# デザインガイドライン

このドキュメントは、Tailwind CSS v4を使用したプロジェクトのデザインルールをまとめたものです。

## 1. カラーシステム

### 1.1 カスタムカラー定義

```css
/* app.css */
@import "tailwindcss";

@theme {
  /* ブランドカラー */
  --color-primary: #007aff;
  --color-secondary: #5856d6;
  --color-success: #34c759;
  --color-warning: #ff9500;
  --color-danger: #ff3b30;

  /* ニュートラルカラー (Tailwind Typography参考) */
  --color-neutral-50: #fafafa;
  --color-neutral-100: #f5f5f5;
  --color-neutral-200: #e5e5e5;
  --color-neutral-300: #d4d4d4;
  --color-neutral-400: #a3a3a3;
  --color-neutral-500: #737373;
  --color-neutral-600: #525252;
  --color-neutral-700: #404040;
  --color-neutral-800: #262626;
  --color-neutral-900: #171717;
}
```

### 1.2 使用例

```html
<!-- プライマリボタン -->
<button class="bg-primary text-white">ボタン</button>

<!-- 背景色 -->
<div class="bg-neutral-50">明るい背景</div>
<div class="bg-neutral-100">セクション背景</div>

<!-- テキストカラー -->
<p class="text-neutral-900">メインテキスト</p>
<p class="text-neutral-700">本文テキスト</p>
<p class="text-neutral-400">補助テキスト</p>
```

## 2. 角丸（Border Radius）

### 2.1 基本方針

Tailwindのデフォルト値を基本的に使用する。ボタンやカードなどの基本的なコンポーネントの角丸も標準サイズをベースにする。

### 2.2 使用例

```html
<!-- 標準的な角丸はTailwindのデフォルトを使用 -->
<div class="rounded-sm">小さい角丸 (2px)</div>
<div class="rounded">標準角丸 (4px)</div>
<div class="rounded-lg">大きい角丸 (8px)</div>
<div class="rounded-xl">特大角丸 (12px)</div>
```

## 3. 間隔（Spacing）

### 3.1 基本スペーシング

Tailwindのデフォルトスペーシングシステム（4px単位）を使用

```html
<!-- パディング -->
<div class="p-1">4px</div>
<div class="p-2">8px</div>
<div class="p-3">12px</div>
<div class="p-4">16px</div>
<div class="p-6">24px</div>
<div class="p-8">32px</div>
```

### 3.2 コンポーネント間の統一スペース

統一感のあるレイアウトのために、以下のスペーシングルールを適用

```html
<!-- セクション間のマージン -->
<section class="mb-16">...</section>
<!-- 大セクション間: 64px -->
<div class="mb-12">...</div>
<!-- 中セクション間: 48px -->
<div class="mb-8">...</div>
<!-- 小セクション間: 32px -->

<!-- コンポーネント間のギャップ -->
<div class="space-y-6">
  <!-- 垂直方向の標準ギャップ: 24px -->
  <Component1 />
  <Component2 />
  <Component3 />
</div>

<!-- グリッドギャップ -->
<div class="grid gap-6">
  <!-- グリッドアイテム間: 24px -->
  <GridItem />
</div>

<!-- カード内の要素間隔 -->
<div class="space-y-4">
  <!-- カード内要素: 16px -->
  <h3>タイトル</h3>
  <p>説明文</p>
</div>
```

### 3.3 コンポーネント内パディング

```html
<!-- 標準的なコンポーネントパディング -->
<button class="py-2.5 px-4">ボタン</button>
<div class="p-6">カード（大）</div>
<div class="p-4">カード（標準）</div>
<li class="py-3 px-4">リストアイテム</li>
```

## 4. タイポグラフィ

Tailwindのデフォルトフォントスタックとサイズを使用

### 使用例

```html
<!-- フォントサイズ (Tailwindデフォルト) -->
<p class="text-xs">12px</p>
<p class="text-sm">14px</p>
<p class="text-base">16px</p>
<p class="text-lg">18px</p>
<p class="text-xl">20px</p>
<p class="text-2xl">24px</p>
<p class="text-3xl">30px</p>

<!-- フォントウェイト -->
<p class="font-normal">Regular (400)</p>
<p class="font-medium">Medium (500)</p>
<p class="font-semibold">Semibold (600)</p>
<p class="font-bold">Bold (700)</p>

<!-- 行間 -->
<p class="leading-tight">タイト (1.25)</p>
<p class="leading-normal">標準 (1.5)</p>
<p class="leading-relaxed">ゆったり (1.625)</p>
```

## 5. 影（Shadow）

Tailwindのデフォルトシャドウを使用

### 使用例

```html
<div class="shadow-sm">小さな影</div>
<div class="shadow">標準の影</div>
<div class="shadow-md">中くらいの影</div>
<div class="shadow-lg">大きな影</div>
<div class="shadow-xl">特大の影</div>
```

## 6. アニメーション

### 6.1 トランジション

Tailwindのデフォルトdurationを使用。

### 6.2 使用例

```html
<!-- 標準的なトランジション -->
<button class="transition-all duration-150 hover:scale-105">
  ホバーボタン
</button>
```

## 7. コンポーネント例

### 7.1 ボタン（ガラスモーフィズム対応）

```html
<!-- プライマリボタン -->
<button
  class="min-h-11 py-2.5 px-4 bg-primary text-white rounded-lg font-medium transition-all duration-150 hover:opacity-90 active:scale-95 shadow-lg backdrop-blur-sm"
>
  ボタン
</button>

<!-- ガラスモーフィズムボタン -->
<button
  class="min-h-11 py-2.5 px-4 bg-white/20 backdrop-blur-xl border border-white/30 text-neutral-900 rounded-lg font-medium transition-all duration-150 hover:bg-white/30 active:scale-95 shadow-lg"
>
  ガラスボタン
</button>

<!-- ダークガラスボタン -->
<button
  class="min-h-11 py-2.5 px-4 bg-neutral-900/20 backdrop-blur-xl border border-neutral-700/30 text-white rounded-lg font-medium transition-all duration-150 hover:bg-neutral-900/30 active:scale-95 shadow-lg"
>
  ダークガラスボタン
</button>
```

### 7.2 カード（ガラスモーフィズム対応）

```html
<!-- 標準ガラスカード -->
<div
  class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-xl p-6 shadow-lg"
>
  <div class="space-y-4">
    <h3 class="text-xl font-semibold text-neutral-900">カードタイトル</h3>
    <p class="text-neutral-600">
      カードの説明文です。ガラスモーフィズム効果で透明感のあるデザインを実現しています。
    </p>
  </div>
</div>

<!-- 透明度の高いガラスカード -->
<div
  class="bg-white/50 backdrop-blur-2xl border border-white/10 rounded-xl p-6 shadow-xl"
>
  <div class="space-y-4">
    <h3 class="text-xl font-semibold text-neutral-900">透明ガラスカード</h3>
    <p class="text-neutral-600">より透明度の高いガラス効果のカードです。</p>
  </div>
</div>
```

### 7.3 インプットフィールド（ガラスモーフィズム対応）

```html
<!-- ガラスモーフィズムインプット -->
<input
  type="text"
  class="min-h-11 py-3 px-4 bg-white/50 backdrop-blur-xl border border-white/30 rounded-lg placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white/70 transition-all duration-150 shadow-lg"
  placeholder="ガラス効果のインプット"
/>

<!-- フォーカス時により明確になるガラスインプット -->
<input
  type="text"
  class="min-h-11 py-3 px-4 bg-white/30 backdrop-blur-2xl border border-white/20 rounded-lg placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white/80 focus:border-white/40 transition-all duration-200 shadow-lg"
  placeholder="フォーカス強化ガラスインプット"
/>
```

## 8. ガラスモーフィズム

### 8.1 基本原則

すべてのコンポーネントでガラスモーフィズムを活用し、透明感のある洗練されたUIを実現

### 8.2 標準的なガラスモーフィズムパターン

```html
<!-- 基本的なガラス効果 -->
<div
  class="bg-white/70 backdrop-blur-xl border border-white/20 shadow-lg rounded-xl p-6"
>
  標準的なガラスコンポーネント
</div>

<!-- より透明なガラス効果 -->
<div
  class="bg-white/50 backdrop-blur-2xl border border-white/10 shadow-xl rounded-xl p-6"
>
  透明度の高いガラスコンポーネント
</div>

<!-- 濃いガラス効果 -->
<div
  class="bg-white/80 backdrop-blur-lg border border-white/30 shadow-md rounded-xl p-6"
>
  しっかりとしたガラスコンポーネント
</div>
```

### 8.3 ダーク背景用ガラスモーフィズム

```html
<!-- ダーク背景用のガラス効果 -->
<div
  class="bg-neutral-900/70 backdrop-blur-xl border border-neutral-700/30 shadow-lg rounded-xl p-6 text-white"
>
  ダーク背景用ガラスコンポーネント
</div>

<!-- ダーク透明ガラス -->
<div
  class="bg-neutral-800/50 backdrop-blur-2xl border border-neutral-600/20 shadow-xl rounded-xl p-6 text-white"
>
  ダーク透明ガラスコンポーネント
</div>
```

### 8.4 レイアウト用ガラスコンテナ

```html
<!-- ページ全体のガラスコンテナ -->
<main
  class="bg-white/30 backdrop-blur-3xl border border-white/10 rounded-2xl p-8 shadow-2xl"
>
  <div class="space-y-6">
    <!-- コンテンツ -->
  </div>
</main>

<!-- セクション用ガラスコンテナ -->
<section
  class="bg-white/40 backdrop-blur-xl border border-white/15 rounded-xl p-6 shadow-lg"
>
  <div class="space-y-4">
    <!-- セクションコンテンツ -->
  </div>
</section>
```

### 8.5 追加コンポーネント例

```html
<!-- ガラスナビゲーション -->
<nav class="bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg">
  <div class="max-w-7xl mx-auto px-6 py-4">
    <div class="flex items-center justify-between">
      <div class="text-xl font-semibold text-neutral-900">ロゴ</div>
      <div class="flex space-x-6">
        <a
          href="#"
          class="text-neutral-700 hover:text-primary transition-colors duration-150"
          >ホーム</a
        >
        <a
          href="#"
          class="text-neutral-700 hover:text-primary transition-colors duration-150"
          >サービス</a
        >
        <a
          href="#"
          class="text-neutral-700 hover:text-primary transition-colors duration-150"
          >お問い合わせ</a
        >
      </div>
    </div>
  </div>
</nav>

<!-- ガラスモーダル -->
<div
  class="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm flex items-center justify-center p-4"
>
  <div
    class="bg-white/90 backdrop-blur-2xl border border-white/30 rounded-2xl p-8 shadow-2xl max-w-md w-full"
  >
    <div class="space-y-6">
      <h2 class="text-2xl font-semibold text-neutral-900">モーダルタイトル</h2>
      <p class="text-neutral-600">
        モーダルの内容がここに入ります。ガラス効果で美しい透明感を演出しています。
      </p>
      <div class="flex justify-end space-x-3">
        <button
          class="py-2.5 px-4 bg-white/40 backdrop-blur-xl border border-white/30 text-neutral-700 rounded-lg font-medium transition-all duration-150 hover:bg-white/60"
        >
          キャンセル
        </button>
        <button
          class="py-2.5 px-4 bg-primary text-white rounded-lg font-medium transition-all duration-150 hover:opacity-90"
        >
          確認
        </button>
      </div>
    </div>
  </div>
</div>
```

## 9. レスポンシブデザイン

Tailwindのデフォルトブレークポイントを使用

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### 使用例

```html
<!-- レスポンシブパディング -->
<div class="p-4 md:p-6 lg:p-8">コンテンツ</div>

<!-- レスポンシブグリッド -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div>アイテム</div>
</div>
```

## 10. アクセシビリティ

### 10.1 フォーカススタイル

```html
<!-- フォーカス時のアウトライン -->
<button
  class="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
>
  ボタン
</button>

<!-- 最小タッチターゲット (44px) -->
<button class="min-h-11 min-w-11">タップ可能</button>
```

### 10.2 推奨される色の組み合わせ

- メインテキスト: `text-neutral-900` on `bg-white`
- サブテキスト: `text-neutral-600` on `bg-white`
- 補助テキスト: `text-neutral-400` on `bg-white`
- 無効状態: `text-neutral-400` on `bg-neutral-100`

## CSS設定ファイル

```css
/* app.css */
@import "tailwindcss";

@theme {
  /* 必要最小限のカスタム定義 */
  --color-primary: #007aff;
  --color-secondary: #5856d6;
  --color-success: #34c759;
  --color-warning: #ff9500;
  --color-danger: #ff3b30;

  --radius-button: 8px;
  --radius-card: 12px;
  --radius-input: 8px;

  --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);

  /* ニュートラルカラー */
  --color-neutral-50: #fafafa;
  --color-neutral-100: #f5f5f5;
  --color-neutral-200: #e5e5e5;
  --color-neutral-300: #d4d4d4;
  --color-neutral-400: #a3a3a3;
  --color-neutral-500: #737373;
  --color-neutral-600: #525252;
  --color-neutral-700: #404040;
  --color-neutral-800: #262626;
  --color-neutral-900: #171717;
}
```

## まとめ

このガイドラインでは：

- **Tailwindのデフォルトを最大限活用**: spacing、font、shadow、breakpointなど
- **最小限のカスタマイズ**: ブランドカラー、ニュートラルカラーのみ
- **統一されたスペーシング**: コンポーネント間の一貫した間隔ルール
- **ガラスモーフィズム**: すべてのコンポーネントで透明感のある洗練されたデザイン
- **シンプルな実装**: 不要な変数定義を避け、メンテナンスを容易に
- **一貫性**: Tailwindの規約に従うことで統一感を保つ

Tailwindの強力なデフォルト設定を活かしつつ、プロジェクト固有の要件に対応する最小限のカスタマイズで、効率的なUI開発を実現します。
