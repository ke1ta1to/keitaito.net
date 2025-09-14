# Specification

## 0. サマリ

目的は「自己紹介」と「技術力の提示」。Next.js（SSR+PPR, MPA）・NestJS（Workspaces）・Supabase(Postgres, Prisma)・AWS（EC2+CloudFront+S3, 画像はOAC）を前提に、1ページ中心＋Works詳細で構成する。

## 1. スコープ

- `/` トップ（Hero → Profile → Activity → Works → Articles → Skills → Contact → Links）
- `/works/[slug]` 作品詳細
- `/links/apply` 相互リンク申請
- `/dashboard` 管理UI（SSR MPA）

非スコープ: 外部CMS導入、複数環境の高度な冗長化、アニメーション演出。

## 2. IA とナビゲーション

- 1ページ内アンカー: `/#profile` `/#activity` `/#works` `/#articles` `/#skills` `/#contact` `/#links`
- ヘッダー: Hero内のみ非固定。以降は固定。スムーススクロールと現在地ハイライト。
- パンくず: `/works/[slug]` のみ。

## 3. UX ガイドライン

### 3.1 デザイン

Tailwind, フォントは Noto Sans JP、アクセント: teal-500。アニメーションは原則なし（フォーカス等の最小限のみ）。

### 3.2 レイアウト

フラット・余白多め。コンポーネントは一貫性のある余白とホバー表現。

### 3.3 アクセシビリティ

キーボード操作可、フォーカス可視化、コントラスト、HTML5セマンティクス。

## 4. 機能要件

### 4.1 Articles

- Zenn/Qiita の記事リンクを一覧表示。フィルタなし。外部は新規タブで開く。
- データは Next.js の ISR（日次 revalidate=86400）で更新。

### 4.2 Works

- Markdown（`body_md`）を remark/rehype で HTML 化（サニタイズ必須、コードハイライト）。
- 画像は S3 に保存。編集画面から下書き状態でもアップ可。公開時に DB へ紐付け。
- 詳細は `/works/[slug]`。一覧はトップの Works セクション。

### 4.3 相互リンク申請

- `/links/apply` で URL・name・email・message を受け付け。
- サーバ側で OGP を自動取得（title/description/og_image）。Turnstileを通過したもののみ受付。
- 承認後に Links セクションへ掲載。

### 4.4 管理UI（/dashboard）

- 一覧→編集→プレビュー→公開のフロー。管理権限は admin のみ。
- 主要対象: Works, Articles（リンクのみ, 再検証トリガ）, Links 申請の承認。

### 4.5 認証と権限

- Supabase Auth。RLSは使わず、API層で RBAC（admin のみ書込）。

## 5. データモデル（概要）

- users(id, name, email, role)
- articles(id, title, service['zenn'|'qiita'], url, tags[], published_at, fetched_at)
- works(id, slug, title, summary, body_md, images[], tech_stack[], repo_url, demo_url, published_at, status['draft'|'public'])
- activities(id, year, title, description, links[])
- skills(id, category, name, level[1..5])
- links(id, title, url, owner_name, description, og_image)
- link_applications(id, applicant_name, email, url, message, title, description, og_image, status['pending'|'approved'|'rejected'])

補足: images[] はメタを含む配列(JSONB)でも可。将来の拡張で別テーブル化の余地を残す。

## 6. API（概要）

- `/api/works` GET/POST/PATCH（admin 書込）
- `/api/articles/revalidate` POST（ISR再検証トリガ）
- `/api/links/applications` POST（申請）/ GET（一覧, admin）/ PATCH（承認）
- `/api/ogp/fetch` POST（URLの OGP 取得, サーバ側実行）

備考: Next の rewrites で `/api/*` → NestJS（nginx 経由）。

## 7. SEO / OGP

- 構造化データ: Person / ItemList(works) / CreativeWork / Article
- OGP: 各ページで設定。デフォルト OGP も用意。
- 生成: ベース画像テンプレ + `@vercel/og` で動的テキスト合成。
- サイトマップ: `/` `/works/[slug]` `/links/apply` を収録。アンカーは対象外。

## 8. アナリティクス（GA4）

- イベント: `view_section(section_id)`, `click_article(service,url)`, `click_contact`, `submit_link_application(auto_filled)`, `edit_save`, `edit_publish`
- 指標: 到達率・外部記事クリック・Contact CTR。

## 9. 受け入れ基準（機能）

| 項目       | 基準                                                |
| ---------- | --------------------------------------------------- |
| Articles   | 日次で内容が更新され、外部リンクが新規タブで開く    |
| Works      | Markdown のプレビューと公開ができ、画像が表示される |
| 相互リンク | URL から OGP 情報が自動取得され、承認後に掲載される |
| 管理UI     | 一覧/編集/プレビュー/公開が admin で実行できる      |
| 認証・権限 | admin 以外は書込不可                                |
