# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## アーキテクチャ

pnpmワークスペースを使用したモノレポ構成で、個人ポートフォリオサイトを実装：

- `apps/www/` - React 19、TypeScript、Tailwind CSS v4を使用したNext.js 15アプリケーション
- **推奨環境**: Node.js v22.16.0、pnpm 10.12.1

Webアプリはコンポーネントベースのアーキテクチャを採用：

- App Router構造（`app/`ディレクトリ）
- 共有レイアウトコンポーネント（`app-header.tsx`、`app-footer.tsx`、`app-layout.tsx`）
- コンポーネント開発・ドキュメント用のStorybook
- MDXを使用した作品詳細ページ（`works/[作品名]/page.mdx`）

## 技術スタック

- **フレームワーク**: Next.js 15.3.4（App Router使用）
- **React**: 19.1.0
- **TypeScript**: 5.8.3（strict mode）
- **スタイリング**: Tailwind CSS v4（CSS-in-CSS設定）
- **パッケージマネージャー**: pnpm 10.12.1（ワークスペース使用）
- **コンポーネントドキュメント**: Storybook 9.0.12
- **MDX**: ブログ記事やドキュメント作成（remark-gfm、remark-math、rehype-katex使用）
- **テスト**: Jest + React Testing Library + @testing-library/jest-dom
- **リンティング**: ESLint（Next.js、TypeScript、Prettier設定）
- **フォーマッター**: Prettier（Tailwind CSSプラグイン統合）
- **Git hooks**: Husky（pre-commitでlintとformat実行）
- **バリデーション**: Zod（API応答の型検証）

## 開発コマンド

### メイン開発

```bash
# 依存関係のインストール
pnpm install

# Webアプリの開発サーバー起動
pnpm www dev

# Webアプリのビルド
pnpm www build

# プロダクションサーバー起動
pnpm www start

# コードのリント（全プロジェクト）
pnpm lint

# 個別プロジェクトでのリント
pnpm www lint

# コードのフォーマット
pnpm format
pnpm format:check
```

### テスト

```bash
# テスト実行（全ワークスペース）
pnpm test

# Webアプリのテスト実行
pnpm www test

# テストウォッチモード
pnpm www test:watch

# 個別テストファイル実行（apps/www内で）
cd apps/www && pnpm test -- path/to/test.spec.ts
```

### Storybook

```bash
# Storybook開発サーバー起動
pnpm www storybook

# Storybookのビルド
pnpm www build-storybook
```

### Docker

```bash
# 開発環境
docker compose -f compose.dev.yaml build --no-cache
docker compose -f compose.dev.yaml up -d
docker compose -f compose.dev.yaml down

# 本番環境（GitHub Container Registryから取得）
docker compose -f compose.prod.yaml up -d
docker compose -f compose.prod.yaml down
```

## デザインシステム

### Tailwind CSS v4設定

- **設定方式**: CSS-in-CSS（`@theme`ディレクティブ使用、tailwind.config.tsファイルなし）
- **PostCSS設定**: `@tailwindcss/postcss`プラグインのみ使用
- **カラー定義**: OKLCHカラースペースで精密な色管理
- **プラグイン**: `@tailwindcss/typography`（記事コンテンツ用）

### カラーパレット

`apps/www/src/app/globals.css`の`@theme`で定義：

**プライマリカラー** (`primary-*`):

- 50-950の11段階（`primary-50`から`primary-950`）
- ベースカラー: `primary-500`（青系、`oklch(0.704 0.14 182.503)`）
- 使用例: `bg-primary-500`、`text-primary-700`、`border-primary-300`

**セカンダリカラー** (`secondary-*`):

- 50-950の11段階（`secondary-50`から`secondary-950`）
- ベースカラー: `secondary-500`（紫系、`oklch(0.685 0.169 237.323)`）
- 使用例: `bg-secondary-500`、`text-secondary-700`

### デザインパターン

- **基本スタイル**: クリーンでシンプルなデザイン
- **カード**: `bg-white rounded shadow`
- **ヘッダー**: 固定配置（`sticky top-0`）、上部にプライマリカラーのボーダー
- **フッター**: `bg-primary-50`の背景色
- **レイアウト**: オプションでグラデーション背景
- **スペーシング**: Tailwindデフォルトのスペーシングシステム（4px単位）
  - `space-x-*`、`space-y-*`、`gap-*`などのユーティリティを使用
- **タイポグラフィ**: `@tailwindcss/typography`プラグインでProseスタイル

### スタイリングユーティリティ

- **クラス結合**: `cn()`関数（clsx + tailwind-merge）
- **使用例**: `cn("base-class", conditional && "conditional-class", className)`

### コンポーネントスタイリング規則

1. **カラークラスの使用**:
   - プライマリ: `primary-*`（例: `bg-primary-500`、`text-primary`、`border-primary-400`）
   - セカンダリ: `secondary-*`
   - ニュートラル: `gray-*`、`neutral-*`

2. **共通パターン**:
   - カード: `bg-white rounded shadow`
   - ボタン: `bg-primary-500 hover:bg-primary-600 text-white rounded-lg`
   - リンク: `text-primary hover:text-primary-600`

3. **ユーティリティクラス管理**:
   - `cn()`関数（`tailwind-merge`使用）でクラス名の条件付き結合

## コードスタイル

- **インポート整理**: アルファベット順の強制、型インポートを優先（`import type`）
- **TypeScript**: 厳密な型付け（`strict: true`）、一貫した型インポートスタイル
- **ESLint**: インポート一貫性とNext.jsベストプラクティスのカスタムルール
  - `import/order`: newlines-between設定、アルファベット順
  - `@typescript-eslint/consistent-type-imports`: 型インポートの強制
- **Prettier**: Tailwind CSSプラグインでクラス並び替え統合
- **パスエイリアス**: `@/*`は`./src/*`を参照（tsconfig.json設定）

## プロジェクト構造

```
apps/www/
├── src/
│   ├── app/                 # Next.js App Routerページ
│   │   ├── (index)/        # インデックスルートグループ
│   │   │   ├── _components/ # ページ専用コンポーネント
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── works/          # 作品詳細ページ
│   │   │   ├── [作品名]/  # 各作品ディレクトリ
│   │   │   │   ├── _assets/     # 作品固有のアセット
│   │   │   │   ├── _thumbnail.png
│   │   │   │   └── page.mdx    # MDXによる作品説明
│   │   │   └── layout.tsx
│   │   ├── layout.tsx      # ルートレイアウト
│   │   └── globals.css     # グローバルスタイル（Tailwindインポート）
│   ├── components/         # 共有コンポーネント
│   │   ├── app-header.tsx
│   │   ├── app-footer.tsx
│   │   └── app-layout.tsx
│   ├── constants/
│   │   └── data.tsx        # 静的データの一元管理
│   ├── lib/                # ユーティリティ関数
│   │   ├── articles-fetcher.ts  # 外部記事API連携
│   │   └── works.ts            # 作品データ管理
│   └── utils/              # 汎用ユーティリティ
│       ├── cn.ts           # クラス名結合（tailwind-merge）
│       └── calc-age.ts     # 年齢計算
├── .storybook/            # Storybook設定
└── public/               # 静的アセット
```

## データ管理とアーキテクチャ特徴

- **データ管理**: `/src/constants/data.tsx`で全ての静的データを一元管理
- **型安全性**: TypeScript interfaceによる厳密な型定義
- **外部API連携**: Zenn、Qiita記事の自動取得機能
- **構造化データ**: JSON-LD形式でSEO最適化を実装
- **コンポーネント構成**:
  - `/src/app/(index)/_components/` - ページ専用コンポーネント
  - `/src/components/` - 共有コンポーネント（header、footer、layout）
- **Storybook**: 全主要コンポーネントにストーリー設定済み

## 言語設定

- **主要言語**: 日本語（HTMLで`lang="ja"`設定）
- **ドキュメント**: プロジェクト内ドキュメントは日本語
- コンポーネント開発では英語命名規則を使用可能

## 重要な設定ファイル

- **TypeScript設定** (`apps/www/tsconfig.json`):
  - `strict: true`で厳密な型チェック
  - パスエイリアス`@/*`は`./src/*`を参照
  - MDXファイルのサポート

- **ESLint設定** (`apps/www/eslint.config.mjs`):
  - Flat Config形式使用
  - インポート順序の自動整理
  - 型インポートの強制（`import type`）
  - Prettierとの統合
  - Storybookプラグイン設定

- **Next.js設定** (`apps/www/next.config.ts`):
  - MDXサポート（remark-gfm、remark-math、remark-breaks、rehype-katex）
  - standalone出力（Docker対応）
  - pageExtensions設定でMDXファイルをページとして認識

- **Jest設定** (`apps/www/jest.config.ts`):
  - Next.js統合（next/jest使用）
  - jsdom環境設定
  - パスエイリアス設定（`@/*`）
  - setup file: `jest.setup.ts`で`@testing-library/jest-dom`インポート

- **PostCSS設定** (`apps/www/postcss.config.mjs`):
  - Tailwind CSS v4用の`@tailwindcss/postcss`プラグインのみ

## 特徴的な構成

### コンポーネント管理

- **コロケーション**: コンポーネントと同じ階層にテスト（`.test.tsx`）とStories（`.stories.tsx`）を配置
- **ページ専用コンポーネント**: `app/(index)/_components/` にトップページ専用コンポーネントを集約
- **共有コンポーネント**: `src/components/` に複数ページで使用するコンポーネントを配置

### MDX活用

- `app/works/[作品名]/page.mdx` で作品詳細をMDXで記述
- remarkとrehypeプラグインによる拡張（数式、GitHub Flavored Markdown対応）

### Docker構成

- **開発環境** (`compose.dev.yaml`): ローカルビルド、ポート3000
- **本番環境** (`compose.prod.yaml`): GitHub Container Registry (`ghcr.io`)からイメージ取得

### GitHub Actions

- **build.yaml**:
  - トリガー: mainブランチへのプッシュ、タグ付け、PR
  - タグ付きプッシュ時のみDockerイメージをビルド・GitHub Container Registryにプッシュ
  - semverタグ（major.minor.patch）とlatestタグを自動生成
  - CUSTOM_URLシークレット使用

- **ci.yaml**:
  - トリガー: mainブランチへのPR
  - ジョブ: lint（`pnpm lint`）とtest（`pnpm test`）を並列実行

## Git hooks（Husky）

コミット前に自動実行される品質チェック（`.husky/pre-commit`）：

1. `pnpm lint` - ESLintによるコード品質チェック
2. `pnpm format` - Prettierによるフォーマット統一

手動で実行する場合：

```bash
pnpm lint && pnpm format
```

## 作品ページの追加方法

新しい作品ページを追加する場合：

1. `apps/www/src/app/works/[作品名]/`ディレクトリを作成
2. `_thumbnail.png` - サムネイル画像を配置
3. `page.mdx` - MDX形式で作品詳細を記述
4. `_assets/` - （オプション）作品固有の画像を配置
5. `/src/lib/works.ts`で作品データが自動的に読み込まれる
