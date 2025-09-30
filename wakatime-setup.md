# WakaTime 和 Spotify 集成配置指南

## 🕒 WakaTime 编程时间统计配置

### 步骤 1: 注册 WakaTime 账户
1. 访问 [WakaTime官网](https://wakatime.com/) 并注册账户
2. 登录后，前往 [Settings](https://wakatime.com/settings/account) 页面
3. 复制你的 **Secret API Key**

### 步骤 2: 安装 WakaTime 插件
根据你使用的编辑器安装对应插件：

#### VS Code
1. 在扩展商店搜索 "WakaTime"
2. 安装官方 WakaTime 插件
3. 重启 VS Code，输入你的 API Key

#### JetBrains IDEs (IntelliJ, PyCharm, etc.)
1. 前往 Settings → Plugins
2. 搜索并安装 "WakaTime"
3. 重启 IDE，配置 API Key

#### Vim/Neovim
```bash
# 使用 vim-plug
Plug 'wakatime/vim-wakatime'

# 或使用 Vundle
Plugin 'wakatime/vim-wakatime'
```

### 步骤 3: 配置 GitHub Action
在你的个人资料仓库中创建 `.github/workflows/waka-readme.yml`:

```yaml
name: Waka Readme

on:
  schedule:
    # 每天 UTC 时间 0:00 运行
    - cron: '0 0 * * *'
  workflow_dispatch:

jobs:
  update-readme:
    name: Update Readme with Metrics
    runs-on: ubuntu-latest
    steps:
      - uses: anmol098/waka-readme-stats@master
        with:
          WAKATIME_API_KEY: ${{ secrets.WAKATIME_API_KEY }}
          GH_TOKEN: ${{ secrets.GH_TOKEN }}
          SHOW_LINES_OF_CODE: "True"
          SHOW_PROFILE_VIEWS: "False"
          SHOW_COMMIT: "True"
          SHOW_DAYS_OF_WEEK: "True"
          SHOW_LANGUAGE: "True"
          SHOW_OS: "True"
          SHOW_PROJECTS: "True"
          SHOW_TIMEZONE: "True"
          SHOW_EDITORS: "True"
          SHOW_LANGUAGE_PER_REPO: "True"
          SHOW_SHORT_INFO: "True"
          SHOW_LOC_CHART: "False"
```

### 步骤 4: 配置 GitHub Secrets
1. 前往你的个人资料仓库 Settings → Secrets and variables → Actions
2. 添加以下 secrets:
   - `WAKATIME_API_KEY`: 你的 WakaTime API Key
   - `GH_TOKEN`: GitHub Personal Access Token (需要 repo 权限)

## 🎵 Spotify 正在播放集成配置

### 步骤 1: 创建 Spotify 应用
1. 访问 [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
2. 登录并点击 "Create an App"
3. 填写应用信息:
   - App name: `GitHub Profile`
   - App description: `Display currently playing song on GitHub profile`
   - Redirect URI: `http://localhost:3000/callback`
4. 记录 **Client ID** 和 **Client Secret**

### 步骤 2: 获取 Refresh Token
使用以下 Python 脚本获取 refresh token:

```python
import requests
import base64
from urllib.parse import urlencode

# 替换为你的实际值
CLIENT_ID = 'your_client_id'
CLIENT_SECRET = 'your_client_secret'
REDIRECT_URI = 'http://localhost:3000/callback'

# 步骤 1: 获取授权码
auth_url = 'https://accounts.spotify.com/authorize'
params = {
    'client_id': CLIENT_ID,
    'response_type': 'code',
    'redirect_uri': REDIRECT_URI,
    'scope': 'user-read-currently-playing user-read-recently-played'
}

print(f"请访问以下URL并授权: {auth_url}?{urlencode(params)}")
print("授权后，从重定向URL中复制 'code' 参数值")

# 步骤 2: 使用授权码获取 tokens
code = input("请输入授权码: ")

token_url = 'https://accounts.spotify.com/api/token'
auth_header = base64.b64encode(f"{CLIENT_ID}:{CLIENT_SECRET}".encode()).decode()

headers = {
    'Authorization': f'Basic {auth_header}',
    'Content-Type': 'application/x-www-form-urlencoded'
}

data = {
    'grant_type': 'authorization_code',
    'code': code,
    'redirect_uri': REDIRECT_URI
}

response = requests.post(token_url, headers=headers, data=data)
tokens = response.json()

print(f"Refresh Token: {tokens.get('refresh_token')}")
```

### 步骤 3: 部署 Vercel 应用
1. Fork 这个仓库: [spotify-github-profile](https://github.com/kittinan/spotify-github-profile)
2. 在 Vercel 中导入这个仓库
3. 配置环境变量:
   - `CLIENT_ID`: Spotify Client ID
   - `CLIENT_SECRET`: Spotify Client Secret
   - `REFRESH_TOKEN`: 上一步获得的 refresh token

### 步骤 4: 更新 README.md
你的 README.md 中的 Spotify 部分会自动显示，URL 格式为:
```
https://your-vercel-app.vercel.app/api/spotify-playing
```

## 🔄 自动更新配置

### GitHub Action for WakaTime (完整版)
创建 `.github/workflows/update-stats.yml`:

```yaml
name: Update Stats

on:
  schedule:
    - cron: '0 */6 * * *'  # 每6小时运行一次
  workflow_dispatch:

jobs:
  update-readme:
    runs-on: ubuntu-latest
    steps:
      - name: Update README
        uses: anmol098/waka-readme-stats@master
        with:
          WAKATIME_API_KEY: ${{ secrets.WAKATIME_API_KEY }}
          GH_TOKEN: ${{ secrets.GH_TOKEN }}
          SHOW_LINES_OF_CODE: "True"
          SHOW_PROFILE_VIEWS: "False"
          SHOW_COMMIT: "True"
          SHOW_DAYS_OF_WEEK: "True"
          SHOW_LANGUAGE: "True"
          SHOW_OS: "True"
          SHOW_PROJECTS: "True"
          SHOW_TIMEZONE: "True"
          SHOW_EDITORS: "True"
          SHOW_LANGUAGE_PER_REPO: "True"
          SHOW_SHORT_INFO: "True"
          SHOW_LOC_CHART: "False"
          SHOW_UPDATED_DATE: "True"
          SHOW_TOTAL_CODE_TIME: "True"
```

## 📝 注意事项

### WakaTime
- 需要在所有使用的编辑器中安装插件
- 数据统计需要几天时间才会显示
- 免费版本有一些限制

### Spotify
- 需要有 Spotify 账户（免费或付费都可以）
- 如果没有正在播放音乐，会显示最近播放的歌曲
- Vercel 免费版本足够使用

## 🚀 完成后效果
- WakaTime 会在 README 中显示你的编程时间统计
- Spotify 会显示你当前正在播放的音乐
- 数据会自动更新，让你的 GitHub 个人主页更加动态