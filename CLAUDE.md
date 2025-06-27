# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを提供します。

## アーキテクチャ

pnpmワークスペースを使用したモノレポ構成：

- `apps/www/` - React 19、TypeScript、Tailwind CSS v4を使用したNext.jsアプリケーション

Webアプリはコンポーネントベースのアーキテクチャを採用：

- App Router構造（`app/`ディレクトリ）
- 共有レイアウトコンポーネント（`app-header.tsx`、`app-footer.tsx`、`app-layout.tsx`）
- コンポーネント開発・ドキュメント用のStorybook

## 技術スタック

- **フレームワーク**: Next.js 15.3.4（App Router使用）
- **React**: 19.1.0
- **TypeScript**: 5.8.3
- **スタイリング**: Tailwind CSS v4 + カスタムガラスモーフィズムデザインシステム
- **パッケージマネージャー**: pnpm 10.12.1
- **コンポーネントドキュメント**: Storybook 9.0.12
- **MDX**: ブログ記事やドキュメント作成（remarkとrehypeプラグイン使用）
- **テスト**: Jest + React Testing Library
- **リンティング**: ESLint（Next.js、TypeScript、Prettier設定）
- **フォーマッター**: Prettier（Tailwind CSSプラグイン統合）
- **Git hooks**: Husky（pre-commitでlintとformat実行）

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
pnpm www test

# テストウォッチモード
pnpm www test:watch

# 個別テストファイル実行（apps/www内で）
pnpm test -- path/to/test.spec.ts
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
# Dockerイメージビルド
docker build -t keitaito-net .

# コンテナ実行
docker run -p 3000:3000 keitaito-net
```

## デザインシステム

### Tailwind CSS v4設定

- **設定方式**: CSS-in-CSS（`@theme`ディレクティブ使用）
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

**注意**: ガラスモーフィズム効果（`backdrop-blur`、透明度のある背景）は現在使用されていません。

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

- **インポート整理**: アルファベット順の強制、型インポートを優先
- **TypeScript**: 厳密な型付けと一貫した型インポートスタイル
- **ESLint**: インポート一貫性とNext.jsベストプラクティスのカスタムルール
- **Prettier**: Tailwind CSSプラグインでクラス並び替え統合

## プロジェクト構造

```
apps/www/
├── src/
│   ├── app/                 # Next.js App Routerページ
│   │   ├── (index)/        # インデックスルートグループ
│   │   ├── layout.tsx      # ルートレイアウト
│   │   └── globals.css     # グローバルスタイル（Tailwindインポート）
│   └── components/         # 共有コンポーネント
│       ├── app-header.tsx
│       ├── app-footer.tsx
│       └── app-layout.tsx
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
  - インポート順序の自動整理
  - 型インポートの強制（`import type`）
  - Prettierとの統合

- **Next.js設定** (`apps/www/next.config.ts`):
  - MDXサポート（数式、GitHub Flavored Markdown対応）
  - standalone出力（Docker対応）
  - 画像最適化設定

## Git hooks（Husky）

コミット前に自動実行される品質チェック：

- ESLintによるコード品質チェック
- Prettierによるフォーマット統一

手動で実行する場合：

```bash
pnpm lint && pnpm format
```
