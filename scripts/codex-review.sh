#!/usr/bin/env zsh
# Codex Review Wrapper - Claude Code 集成
# 用法: codex-review <file_path> [focus_area]
# 示例: codex-review src/lib/auth.ts security

FILE=${1:-"."}
FOCUS=${2:-"security vulnerabilities and code quality"}
OUTPUT_FILE="/tmp/codex_review_$$.txt"

echo "🔍 正在调用 Codex 审查: $FILE"
echo "📋 审查重点: $FOCUS"
echo ""

codex exec "Review the file $FILE for $FOCUS. Provide a structured report with: findings list, severity levels (CRITICAL/HIGH/MEDIUM/LOW), specific line references, and remediation suggestions." 2>&1 | tee "$OUTPUT_FILE"

echo ""
echo "📄 完整报告已保存至: $OUTPUT_FILE"
