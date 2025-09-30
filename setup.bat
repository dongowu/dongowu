@echo off
chcp 65001 >nul
echo.
echo ========================================
echo 🚀 GitHub 个人主页集成配置助手
echo ========================================
echo.

echo 📋 配置检查清单:
echo.
echo ✅ README.md 已优化
echo ✅ GitHub Actions 工作流已创建
echo ✅ Spotify Token 生成器已准备
echo.

echo 🔧 接下来需要手动配置的项目:
echo.
echo 1️⃣ WakaTime 配置:
echo    - 访问 https://wakatime.com 注册账户
echo    - 安装 VS Code WakaTime 扩展
echo    - 在 GitHub 仓库设置中添加 Secrets:
echo      * WAKATIME_API_KEY
echo      * GH_TOKEN
echo.
echo 2️⃣ Spotify 配置:
echo    - 访问 https://developer.spotify.com/dashboard
echo    - 创建新应用获取 Client ID 和 Secret
echo    - 运行: python spotify-token-generator.py
echo    - 部署到 Vercel
echo.

set /p choice="是否要打开相关网站进行配置? (y/n): "
if /i "%choice%"=="y" (
    echo.
    echo 🌐 正在打开配置网站...
    start https://wakatime.com
    timeout /t 2 >nul
    start https://developer.spotify.com/dashboard
    timeout /t 2 >nul
    start https://github.com/%USERNAME%/%USERNAME%/settings/secrets/actions
    echo.
    echo 📖 请参考 wakatime-setup.md 获取详细配置说明
)

echo.
echo 🎉 配置助手完成！
echo 📚 详细说明请查看:
echo    - wakatime-setup.md (完整配置指南)
echo    - quick-setup.md (快速配置清单)
echo.
pause