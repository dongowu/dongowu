@echo off
echo 正在生成交互式PR贡献图...
node generate-interactive-pr-graph.js
echo 完成！交互式PR贡献图已保存为 pr-contribution-graph.html
echo 正在尝试打开生成的图表...
start "" "pr-contribution-graph.html"
pause