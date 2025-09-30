#!/usr/bin/env python3
"""
Spotify Token Generator for GitHub Profile Integration
使用此脚本获取 Spotify Refresh Token
"""

import requests
import base64
from urllib.parse import urlencode
import webbrowser
import http.server
import socketserver
from urllib.parse import urlparse, parse_qs
import threading
import time

class SpotifyTokenGenerator:
    def __init__(self, client_id, client_secret):
        self.client_id = client_id
        self.client_secret = client_secret
        self.redirect_uri = 'http://localhost:8888/callback'
        self.authorization_code = None
        
    def start_local_server(self):
        """启动本地服务器接收回调"""
        class CallbackHandler(http.server.SimpleHTTPRequestHandler):
            def do_GET(handler_self):
                if handler_self.path.startswith('/callback'):
                    # 解析授权码
                    parsed_url = urlparse(handler_self.path)
                    query_params = parse_qs(parsed_url.query)
                    
                    if 'code' in query_params:
                        self.authorization_code = query_params['code'][0]
                        # 返回成功页面
                        handler_self.send_response(200)
                        handler_self.send_header('Content-type', 'text/html')
                        handler_self.end_headers()
                        handler_self.wfile.write(b'''
                        <html>
                        <body>
                        <h1>授权成功!</h1>
                        <p>你可以关闭这个页面了。</p>
                        <script>window.close();</script>
                        </body>
                        </html>
                        ''')
                    else:
                        # 返回错误页面
                        handler_self.send_response(400)
                        handler_self.send_header('Content-type', 'text/html')
                        handler_self.end_headers()
                        handler_self.wfile.write(b'''
                        <html>
                        <body>
                        <h1>授权失败!</h1>
                        <p>请重试。</p>
                        </body>
                        </html>
                        ''')
                        
            def log_message(self, format, *args):
                # 禁用日志输出
                pass
        
        with socketserver.TCPServer(("", 8888), CallbackHandler) as httpd:
            print("🌐 本地服务器已启动，等待 Spotify 回调...")
            httpd.timeout = 60  # 60秒超时
            httpd.handle_request()
            
    def get_authorization_url(self):
        """生成授权URL"""
        auth_url = 'https://accounts.spotify.com/authorize'
        params = {
            'client_id': self.client_id,
            'response_type': 'code',
            'redirect_uri': self.redirect_uri,
            'scope': 'user-read-currently-playing user-read-recently-played',
            'show_dialog': 'true'
        }
        return f"{auth_url}?{urlencode(params)}"
    
    def get_tokens(self, authorization_code):
        """使用授权码获取tokens"""
        token_url = 'https://accounts.spotify.com/api/token'
        
        # 创建认证头
        auth_string = f"{self.client_id}:{self.client_secret}"
        auth_bytes = auth_string.encode('ascii')
        auth_b64 = base64.b64encode(auth_bytes).decode('ascii')
        
        headers = {
            'Authorization': f'Basic {auth_b64}',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        
        data = {
            'grant_type': 'authorization_code',
            'code': authorization_code,
            'redirect_uri': self.redirect_uri
        }
        
        response = requests.post(token_url, headers=headers, data=data)
        return response.json()
    
    def run(self):
        """运行完整的token获取流程"""
        print("🎵 Spotify GitHub Profile 集成配置")
        print("=" * 50)
        
        # 生成授权URL
        auth_url = self.get_authorization_url()
        print(f"📱 正在打开浏览器进行授权...")
        print(f"🔗 如果浏览器没有自动打开，请手动访问: {auth_url}")
        
        # 启动本地服务器
        server_thread = threading.Thread(target=self.start_local_server)
        server_thread.daemon = True
        server_thread.start()
        
        # 打开浏览器
        webbrowser.open(auth_url)
        
        # 等待授权码
        print("⏳ 等待授权...")
        timeout = 60
        start_time = time.time()
        
        while self.authorization_code is None and (time.time() - start_time) < timeout:
            time.sleep(1)
        
        if self.authorization_code is None:
            print("❌ 授权超时，请重试")
            return None
        
        print("✅ 授权成功，正在获取 tokens...")
        
        # 获取tokens
        tokens = self.get_tokens(self.authorization_code)
        
        if 'refresh_token' in tokens:
            print("🎉 成功获取 Refresh Token!")
            print("=" * 50)
            print(f"🔑 Refresh Token: {tokens['refresh_token']}")
            print("=" * 50)
            print("📝 请将此 Refresh Token 保存到 Vercel 环境变量中")
            return tokens['refresh_token']
        else:
            print("❌ 获取 tokens 失败:")
            print(tokens)
            return None

def main():
    print("🎵 Spotify GitHub Profile Token Generator")
    print("=" * 50)
    
    # 获取用户输入
    client_id = input("请输入 Spotify Client ID: ").strip()
    client_secret = input("请输入 Spotify Client Secret: ").strip()
    
    if not client_id or not client_secret:
        print("❌ Client ID 和 Client Secret 不能为空")
        return
    
    # 创建生成器并运行
    generator = SpotifyTokenGenerator(client_id, client_secret)
    refresh_token = generator.run()
    
    if refresh_token:
        print("\n🚀 下一步:")
        print("1. 前往 https://vercel.com 创建新项目")
        print("2. Fork 仓库: https://github.com/kittinan/spotify-github-profile")
        print("3. 在 Vercel 中配置环境变量:")
        print(f"   - CLIENT_ID: {client_id}")
        print(f"   - CLIENT_SECRET: {client_secret}")
        print(f"   - REFRESH_TOKEN: {refresh_token}")
        print("4. 部署完成后，更新 README.md 中的 Spotify URL")

if __name__ == "__main__":
    main()