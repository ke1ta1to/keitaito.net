# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを提供します。

## アーキテクチャ

pnpmワークスペースを使用したモノレポ構成：

- `apps/web/` - React 19、TypeScript、Tailwind CSS v4を使用したNext.jsアプリケーション
- `docs/` - デザインガイドラインとドキュメント

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
- **リンティング**: ESLint（Next.js、TypeScript、Prettier設定）

## 開発コマンド

### メイン開発

```bash
# 依存関係のインストール
pnpm install

# Webアプリの開発サーバー起動
pnpm web dev

# Webアプリのビルド
pnpm web build

# プロダクションサーバー起動
pnpm web start

# コードのリント
pnpm web lint

# コードのフォーマット
pnpm format
pnpm format:check
```

### Storybook

```bash
# Storybook開発サーバー起動
pnpm web storybook

# Storybookのビルド
pnpm web build-storybook
```

## デザインシステム

`docs/design-guidelines.md`に記載された包括的なガラスモーフィズムデザインシステムを採用。主要な原則：

- **カラー**: カスタムブランドカラー（プライマリ: #007aff）とニュートラルグレー
- **ガラス効果**: `backdrop-blur-xl`、`bg-white/70`、微細なボーダーを多用
- **スペーシング**: Tailwindの4px単位システムと標準化されたコンポーネント間隔
- **タイポグラフィ**: Tailwindデフォルト + カスタムニュートラルカラーパレット
- **コンポーネント**: 全UIエレメントで透明度とブラー効果を使用したガラスモーフィズム

### カラー使用ルール

TailwindでクラスNameを書く際は、以下の定義済みカラーを使用する：

**ブランドカラー（必須使用）**:
- `bg-primary`, `text-primary`, `border-primary` - プライマリカラー (#007aff)
- `bg-secondary`, `text-secondary`, `border-secondary` - セカンダリカラー (#5856d6)
- `bg-success`, `text-success`, `border-success` - 成功カラー (#34c759)
- `bg-warning`, `text-warning`, `border-warning` - 警告カラー (#ff9500)
- `bg-danger`, `text-danger`, `border-danger` - 危険カラー (#ff3b30)

**その他のカラー**:
- ニュートラルカラーはTailwindデフォルトの`neutral-*`を使用可能
- 白・黒は`white`、`black`を使用

## コードスタイル

- **インポート整理**: アルファベット順の強制、型インポートを優先
- **TypeScript**: 厳密な型付けと一貫した型インポートスタイル
- **ESLint**: インポート一貫性とNext.jsベストプラクティスのカスタムルール
- **Prettier**: Tailwind CSSプラグインでクラス並び替え統合

## プロジェクト構造

```
apps/web/
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

## 言語設定

- **主要言語**: 日本語（HTMLで`lang="ja"`設定）
- **ドキュメント**: デザインガイドラインは日本語
- コンポーネント開発では英語命名規則を使用可能
