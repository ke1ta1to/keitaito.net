#!/bin/bash

# Mermaid図のSVG同期スクリプト
# 使用方法: ./scripts/sync-mermaid-diagrams.sh [ディレクトリパス]

set -euo pipefail

# 色付き出力用の定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ヘルプメッセージ
show_help() {
    echo "使用方法: $0 [ディレクトリパス]"
    echo ""
    echo "指定したディレクトリ内のすべての.mmdファイルから.svgファイルを生成します。"
    echo "既存のSVGファイルより新しいmmdファイルのみを処理します。"
    echo ""
    echo "例:"
    echo "  $0 apps/www/src/app/works/portfolio/_assets"
    echo "  $0 ."
    exit 0
}

# 引数チェック
if [[ "${1:-}" == "-h" ]] || [[ "${1:-}" == "--help" ]]; then
    show_help
fi

# ディレクトリパスの取得（デフォルトは現在のディレクトリ）
TARGET_DIR="${1:-.}"

# ディレクトリの存在確認
if [[ ! -d "$TARGET_DIR" ]]; then
    echo -e "${RED}エラー: ディレクトリ '$TARGET_DIR' が存在しません${NC}"
    exit 1
fi

# mmdcコマンドの存在確認
if ! command -v mmdc &> /dev/null; then
    echo -e "${RED}エラー: mmdcコマンドが見つかりません${NC}"
    echo "インストール方法: npm install -g @mermaid-js/mermaid-cli"
    exit 1
fi

echo -e "${GREEN}Mermaid図の同期を開始します...${NC}"
echo "対象ディレクトリ: $TARGET_DIR"

# 処理したファイルのカウンタ
processed=0
skipped=0
errors=0

# .mmdファイルを検索して処理
while IFS= read -r -d '' mmd_file; do
    # 対応するSVGファイルのパス
    svg_file="${mmd_file%.mmd}.svg"
    filename=$(basename "$mmd_file")
    
    # SVGファイルが存在しない、またはmmdファイルの方が新しい場合のみ処理
    if [[ ! -f "$svg_file" ]] || [[ "$mmd_file" -nt "$svg_file" ]]; then
        echo -e "${YELLOW}処理中:${NC} $filename"
        
        if mmdc -i "$mmd_file" -o "$svg_file" 2>/dev/null; then
            echo -e "${GREEN}✓ 生成完了:${NC} $(basename "$svg_file")"
            ((processed++))
        else
            echo -e "${RED}✗ エラー:${NC} $filename の処理に失敗しました"
            ((errors++))
        fi
    else
        ((skipped++))
    fi
done < <(find "$TARGET_DIR" -name "*.mmd" -type f -print0)

# 結果の表示
echo ""
echo -e "${GREEN}同期完了！${NC}"
echo "処理: $processed ファイル"
echo "スキップ: $skipped ファイル（既に最新）"

if [[ $errors -gt 0 ]]; then
    echo -e "${RED}エラー: $errors ファイル${NC}"
    exit 1
fi

# 不要なSVGファイルの検出
echo ""
echo "不要なSVGファイルを確認中..."
orphaned=0

while IFS= read -r -d '' svg_file; do
    mmd_file="${svg_file%.svg}.mmd"
    if [[ ! -f "$mmd_file" ]]; then
        echo -e "${YELLOW}警告:${NC} 対応するmmdファイルがありません: $(basename "$svg_file")"
        ((orphaned++))
    fi
done < <(find "$TARGET_DIR" -name "*.svg" -type f -print0)

if [[ $orphaned -gt 0 ]]; then
    echo -e "${YELLOW}$orphaned 個の不要なSVGファイルが見つかりました${NC}"
fi
