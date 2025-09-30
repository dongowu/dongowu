@echo off
echo 正在生成PR贡献图...
node generate-pr-graph.js
echo 完成！PR贡献图已保存为 pr-contribution-graph.svg
echo 正在尝试打开生成的图表...
start "" "pr-contribution-graph.svg"
pause