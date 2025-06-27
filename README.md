# keitaito.net

## 環境構築

### 推奨環境

- Node.js v22.16.0
- pnpm 10.12.1

### セットアップ

```bash
# 依存関係のインストール
pnpm install

# 開発サーバーの起動
pnpm www dev

# ビルド
pnpm www build
```

## ディレクトリ構造

### ルート構造

```
.
├── apps/
│   └── www/                  # Next.jsアプリケーション
├── CLAUDE.md                 # Claude Code用設定
└── pnpm-workspace.yaml       # pnpmワークスペース設定
```

### apps/www の詳細構造

```
apps/www/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (index)/         # インデックスルートグループ
│   │   │   ├── _components/ # ページ専用コンポーネント
│   │   │   │   ├── activities-card.tsx
│   │   │   │   ├── activities-card.stories.tsx
│   │   │   │   ├── articles-card.tsx
│   │   │   │   ├── articles-card.stories.tsx
│   │   │   │   └── ... (各コンポーネントと対応するStoriesファイル)
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── works/           # 作品詳細ページ
│   │   │   ├── [作品名]/   # 各作品ディレクトリ
│   │   │   │   ├── _assets/     # 作品固有のアセット
│   │   │   │   ├── _thumbnail.png
│   │   │   │   └── page.mdx    # MDXによる作品説明
│   │   │   └── layout.tsx
│   │   ├── globals.css      # グローバルスタイル（Tailwind CSS v4）
│   │   ├── layout.tsx       # ルートレイアウト
│   │   └── not-found.tsx    # 404ページ
│   ├── components/          # 共有コンポーネント
│   │   ├── app-header.tsx
│   │   ├── app-header.test.tsx
│   │   ├── app-header.stories.tsx
│   │   └── ... (各コンポーネントと対応するテスト・Storiesファイル)
│   ├── constants/
│   │   └── data.tsx         # 静的データの一元管理
│   ├── lib/                 # ユーティリティ関数
│   │   ├── articles-fetcher.ts  # 外部記事API連携
│   │   └── works.ts            # 作品データ管理
│   └── utils/               # 汎用ユーティリティ
│       ├── cn.ts            # クラス名結合（tailwind-merge）
│       ├── cn.test.ts
│       └── calc-age.ts      # 年齢計算
├── public/                  # 静的ファイル
│   └── *.svg               # ロゴ・アイコン類
└── .storybook/             # Storybook設定
```

## Docker構成

### 開発環境 (compose.dev.yaml)

- ローカルでDockerfileからビルド
- ポート3000で公開

```bash
docker compose -f compose.dev.yaml build --no-cache
docker compose -f compose.dev.yaml up -d
docker compose -f compose.dev.yaml down
```

### 本番環境 (compose.prod.yaml)

- GitHub Container Registry (`ghcr.io`)からイメージ取得
- イメージ: `ghcr.io/ke1ta1to/keitaito.net:latest`
- ポート3000で公開

```bash
docker compose -f compose.dev.yaml up -d
docker compose -f compose.dev.yaml down
```

## GitHub Actions

### build.yaml

- **トリガー**: mainブランチへのプッシュ、タグ付け、PR
- **動作**:
  - GitHub Container Registryにログイン
  - タグ付きプッシュ時のみDockerイメージをビルド・プッシュ
  - semverタグ（major.minor.patch）とlatestタグを自動生成
  - CUSTOM_URLシークレットをビルド引数として使用

### ci.yaml

- **トリガー**: mainブランチへのPR
- **ジョブ**:
  - **lint**: コード品質チェック（`pnpm lint`）
  - **test**: テスト実行（`pnpm test`）
