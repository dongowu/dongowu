# 🚀 GitHub个人主页集成快速配置指南

## 📋 配置清单

### ✅ 已完成
- [x] 优化的 README.md 文件
- [x] GitHub Actions 工作流文件
- [x] Spotify Token 生成器脚本

### 🔧 需要配置的项目

## 1️⃣ WakaTime 编程时间统计

### 快速步骤：
1. **注册 WakaTime**
   - 访问 [wakatime.com](https://wakatime.com)
   - 注册并获取 API Key

2. **安装编辑器插件**
   ```bash
   # VS Code: 搜索 "WakaTime" 扩展并安装
   # 其他编辑器请参考 wakatime-setup.md
   ```

3. **配置 GitHub Secrets**
   - 前往仓库 Settings → Secrets and variables → Actions
   - 添加 `WAKATIME_API_KEY`
   - 添加 `GH_TOKEN` (GitHub Personal Access Token)

4. **手动触发工作流**
   - 前往 Actions 标签页
   - 运行 "Waka Readme" 工作流

## 2️⃣ Spotify 正在播放集成

### 快速步骤：
1. **创建 Spotify 应用**
   - 访问 [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - 创建新应用，获取 Client ID 和 Client Secret

2. **运行 Token 生成器**
   ```bash
   python spotify-token-generator.py
   ```

3. **部署到 Vercel**
   - Fork: [spotify-github-profile](https://github.com/kittinan/spotify-github-profile)
   - 在 Vercel 中导入并配置环境变量

4. **更新 README.md**
   - 将 Spotify URL 替换为你的 Vercel 应用地址

## 🎯 一键配置脚本

我来为你创建一个自动化配置脚本...