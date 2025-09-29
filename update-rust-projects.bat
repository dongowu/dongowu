@echo off
echo 正在从GitHub获取Rust项目PR信息...
node update-rust-projects.js
echo 完成！
pause