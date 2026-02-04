# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

個人ポートフォリオサイト (keitaito.net)。pnpm モノレポ構成で3つのパッケージから成る:
- **www/**: Next.js フロントエンド（静的エクスポート）
- **infra/**: AWS CDK インフラ
- **functions/**: Go Lambda 関数 + OpenAPI 定義

## コマンド

### フロントエンド (www/)
```bash
pnpm --filter www dev        # 開発サーバー起動 (localhost:3000)
pnpm --filter www build      # 本番ビルド（静的エクスポート）
pnpm --filter www lint       # ESLint 実行
pnpm --filter www orval      # OpenAPI から API クライアント生成
pnpm --filter www storybook  # Storybook 起動 (localhost:6006)
```

### インフラ (infra/)
```bash
pnpm --filter infra build  # TypeScript コンパイル
pnpm --filter infra test   # Jest テスト実行
pnpm --filter infra cdk:deploy    # スタックデプロイ (dev環境)
pnpm --filter infra cdk synth     # CloudFormation 生成
```

### 関数 (functions/)
```bash
cd functions
make                       # 全関数をビルド (ARM64)
make activities_list       # 個別にビルド (activities_list, activities_get, activities_create, activities_update, activities_delete)
make test                  # Go テスト実行
make generate              # モック生成 (go generate ./...)
make clean                 # dist を削除
```
出力先: `dist/functions/*/bootstrap`

単体テスト実行:
```bash
cd functions
go test -v ./internal/activities/...  # 特定パッケージのテスト
go test -v -run TestHandler_List ./internal/activities/handler/...  # 特定テストのみ
```

### OpenAPI (functions/)
```bash
pnpm --filter functions lint     # OpenAPI 定義の lint (Redocly)
pnpm --filter functions preview  # OpenAPI ドキュメントプレビュー
```

## アーキテクチャ

### AWS インフラ構成
- **API Gateway** → **Lambda (Go)** → **DynamoDB**
- **Cognito** で認証（マネージドログインUI使用）
- Lambda は ARM64 (AL2023 ランタイム) でコスト効率化

### API エンドポイント
すべて Cognito 認証必須:
- `GET /activities` - アクティビティ一覧取得
- `POST /activities` - アクティビティ作成
- `GET /activities/{id}` - 個別アクティビティ取得
- `PUT /activities/{id}` - アクティビティ更新
- `DELETE /activities/{id}` - アクティビティ削除

### フロントエンド
- Next.js App Router で静的エクスポート（`output: "export"`, `trailingSlash: true`）
- ルート: `/(index)` (公開) と `/admin` (認証必要)
- AWS Amplify で Cognito 認証
- shadcn/ui コンポーネント + Tailwind CSS v4 (OKLCH 色空間でカスタムテーマ定義)
- **Orval** で OpenAPI から API クライアント自動生成 (React Query + Axios)
- 開発中の API リクエストは Next.js の `rewrites()` で `/api/*` を `NEXT_PUBLIC_API_BASE_URL` にプロキシ

### フロントエンド構成パターン
```
www/src/
├── app/                          # Next.js App Router
│   ├── (index)/                  # 公開ページ (Server Component)
│   ├── admin/(index)/            # 管理ページ (Client Component)
│   ├── layout.tsx                # Root layout (Providers + globals.css)
│   └── globals.css               # Tailwind v4 テーマ定義 (@theme inline, OKLCH)
├── components/
│   ├── layouts/                  # レイアウトコンポーネント (Header 等)
│   └── ui/                       # shadcn/ui コンポーネント
├── features/
│   ├── landing-page/components/  # 公開ページ用コンポーネント
│   └── admin/components/         # 管理ページ用コンポーネント
├── lib/                          # ユーティリティ (cn(), cognito-client-credentials)
├── orval/                        # 自動生成 API クライアント (編集禁止)
└── assets/                       # SVG アイコン
```
- **features/ ディレクトリ**: ページ固有のコンポーネントはここに配置。`components/` はページ横断で共有するもの
- **Storybook**: `www/.storybook/` に設定。`@storybook/nextjs-vite` 使用

### 認証フロー (2種類)
**公開ページ** (`/(index)`):
- サーバーサイドで Client Credentials Grant を使用
- `lib/cognito-client-credentials.ts` でサービストークン取得・キャッシュ（30秒前に早期リフレッシュ）
- スコープ: `api/activities.read`, `api/skills.read`, `api/profile.read`

**管理ページ** (`/admin`):
- AWS Amplify による Authorization Code Grant
- ユーザーが Cognito マネージドログインUIでログイン
- スコープ: `api/activities.read`, `api/activities.write`, `api/skills.read`, `api/skills.write`, `api/profile.read`, `api/profile.write`

### データフロー
1. フロントエンドが Cognito で認証し、JWT を取得
2. API Gateway が Cognito オーソライザーで JWT を検証
3. Lambda が DynamoDB の ActivitiesTable をクエリ (PK/SK パターン)
4. 静的フロントエンドは API とは別にデプロイ

### DynamoDB スキーマ
- テーブル: ActivitiesTable
- キー: `pk` (パーティション), `sk` (ソート)
- アクティビティ: `pk="ACTIVITY"`, `sk="{uuid}"`, `title`, `date`, `description`

### Go Lambda 構造 (クリーンアーキテクチャ)
```
functions/
├── openapi/openapi.yaml       # OpenAPI 3.0 定義 (API スキーマの源)
├── cmd/*/main.go              # Lambda エントリポイント (DI 設定)
└── internal/
    ├── activities/
    │   ├── handler/           # Lambda ハンドラー層
    │   │   ├── list.go, get.go, create.go, update.go, delete.go
    │   │   └── *_test.go      # ハンドラー単体テスト
    │   ├── service.go         # ビジネスロジック層
    │   ├── service_mock.go    # GoMock 生成モック (Service用)
    │   ├── repository.go      # データアクセス層 (インターフェース + DynamoDB実装)
    │   ├── repository_mock.go # GoMock 生成モック (Repository用)
    │   ├── model.go           # ドメインモデル (Activity, Record)
    │   └── service_test.go    # サービス層単体テスト
    ├── awsdynamodb/           # DynamoDB クライアントラッパー
    └── awsapigw/              # API Gateway レスポンスヘルパー
```
- **3層アーキテクチャ**: Handler → Service → Repository
- **Repository パターン**: DynamoDB 実装を抽象化してテスタビリティ向上
- **テスト**: GoMock + google/go-cmp でテーブル駆動テスト

## 技術スタック
- **フロントエンド**: Next.js 16, React 19, TypeScript, Tailwind CSS 4, Orval (API クライアント生成), Storybook 10
- **インフラ**: AWS CDK 2, TypeScript, Zod バリデーション
- **関数**: Go 1.25, AWS SDK v2, go-playground/validator, oapi-codegen
- **認証**: AWS Cognito (JWT)
- **API 定義**: OpenAPI 3.0 (Redocly でlint)

## 環境変数 (www/)

`www/.env.development.local.example` を参照。主要な変数:
- `NEXT_PUBLIC_AWS_COGNITO_*` - Cognito ユーザープール設定 (User Pool ID, Client ID, OAuth ドメイン, リダイレクト URL)
- `AWS_COGNITO_INTERNAL_USER_POOL_CLIENT_ID` / `AWS_COGNITO_INTERNAL_USER_POOL_CLIENT_SECRET` - Client Credentials Grant 用
- `NEXT_PUBLIC_API_BASE_URL` - API Gateway エンドポイント

## Orval 生成コード (www/src/orval/)
OpenAPI 定義から自動生成される API クライアント:
- `client/`: クライアントサイド用 (React Query + Axios)
- `server/`: サーバーサイド用 (Axios functions)
- `client-axios.ts`, `server-axios.ts`: カスタム Axios インスタンス設定

**重要**:
- `orval/` 配下のファイルは自動生成のため直接編集しない。変更は `openapi/openapi.yaml` で行い `pnpm --filter www orval` で再生成
- model の直接インポート禁止: `@/orval/server/models` や `@/orval/client/models` からの直接インポートは ESLint で禁止。代わりに `@/orval/client` や `@/orval/server` から re-export された型を使用

## パスエイリアス
www/ 内: `@/*` は `./src/*` にマップ

## MCP ツール活用方針

このプロジェクトでは以下の MCP サーバーが利用可能。必要に応じて内蔵ツールより優先的に使用すること。

### shadcn（UI コンポーネント管理）
shadcn/ui コンポーネントの追加・検索時に使用。
- `search_items_in_registries` / `list_items_in_registries`: コンポーネント検索・一覧
- `view_items_in_registries`: コンポーネントの詳細情報（ファイル内容含む）
- `get_item_examples_from_registries`: 使用例・デモコード取得
- `get_add_command_for_items`: インストールコマンド生成（例: `@shadcn/button`）
- `get_audit_checklist`: コンポーネント追加後の確認チェックリスト

### eslint（lint）
- `lint-files`: 絶対パスのファイルリストを指定して ESLint 実行。`pnpm lint` の代替として個別ファイルの lint に活用

### playwright（ブラウザ操作・E2Eテスト）
ブラウザの自動操作が可能。フロントエンドの動作確認や E2E テストに使用。
- **ナビゲーション**: `browser_navigate` / `browser_navigate_back` / `browser_tabs`
- **操作**: `browser_click` / `browser_type` / `browser_fill_form` / `browser_select_option` / `browser_press_key` / `browser_drag` / `browser_hover` / `browser_file_upload`
- **確認**: `browser_snapshot`（アクセシビリティスナップショット）/ `browser_take_screenshot` / `browser_console_messages` / `browser_network_requests`
- **その他**: `browser_evaluate` / `browser_run_code` / `browser_resize` / `browser_handle_dialog` / `browser_wait_for`

### pencil（.pen デザインファイル編集）
`.pen` ファイルの読み書き専用。`.pen` ファイルは暗号化されているため Read/Grep ではなく必ず pencil ツールを使用する。
- **読取**: `batch_get`（パターン検索・ノード読取）/ `get_editor_state` / `snapshot_layout` / `get_screenshot` / `get_variables`
- **編集**: `batch_design`（Insert/Copy/Update/Replace/Move/Delete/Image の一括操作）/ `set_variables` / `open_document`
- **デザインガイド**: `get_guidelines`（code/table/tailwind/landing-page/design-system）/ `get_style_guide_tags` / `get_style_guide`
- **ユーティリティ**: `find_empty_space_around_node` / `search_all_unique_properties` / `replace_all_matching_properties`

### awslabs.core-mcp-server（AWS）
- `prompt_understanding`: AWS 関連クエリの解釈・エキスパートアドバイス生成

### ide（VS Code 連携）
- `getDiagnostics`: VS Code の言語診断（エラー・警告）取得
- `executeCode`: Jupyter カーネルでのコード実行
