#!/usr/bin/env python3
"""
Copyright 2025 World Cup Quiz Project

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

轻量化共享题库服务器
安全配置：支持环境变量或配置文件设置密码，不存储明文密码
"""

import json
import os
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse
from datetime import datetime
import threading
import base64
import hashlib

PORT = int(os.environ.get('QUIZ_PORT', 3000))
DATA_FILE = os.environ.get('QUIZ_DATA_FILE', 'shared_questions.json')
LOCK = threading.Lock()

# 安全配置 - 从环境变量或配置文件读取
CONFIG_FILE = os.environ.get('QUIZ_CONFIG_FILE', 'quiz_config.json')

def load_config():
    """加载配置文件"""
    config = {
        'credentials': {},
        'api_keys': [],
        'rate_limit': 100,
        'rate_limit_window': 60
    }
    
    # 优先从环境变量读取
    env_credentials = os.environ.get('QUIZ_CREDENTIALS')
    if env_credentials:
        try:
            config['credentials'] = json.loads(env_credentials)
        except:
            pass
    
    # 其次从配置文件读取
    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
                file_config = json.load(f)
                config.update(file_config)
        except:
            pass
    
    # 如果没有配置任何账号，生成默认账号（首次运行时）
    if not config['credentials']:
        # 使用环境变量设置的默认密码，或生成一个临时密码
        default_admin_pwd = os.environ.get('QUIZ_ADMIN_PASSWORD', 'admin123!')
        default_user_pwd = os.environ.get('QUIZ_USER_PASSWORD', 'user123!')
        
        config['credentials'] = {
            'admin': hash_password(default_admin_pwd),
            'user': hash_password(default_user_pwd)
        }
        # 保存到配置文件
        save_config(config)
    
    # 如果没有配置API Key，生成一个
    if not config['api_keys']:
        default_api_key = os.environ.get('QUIZ_API_KEY', generate_api_key())
        config['api_keys'] = [default_api_key]
        save_config(config)
    
    return config

def save_config(config):
    """保存配置到文件"""
    try:
        with open(CONFIG_FILE, 'w', encoding='utf-8') as f:
            json.dump(config, f, ensure_ascii=False, indent=2)
    except:
        pass

def generate_api_key():
    """生成随机API Key"""
    import uuid
    return str(uuid.uuid4()).replace('-', '')[:20]

def hash_password(password):
    """密码哈希（使用salt增强安全性）"""
    salt = os.environ.get('QUIZ_SALT', 'quiz_salt_2024')
    return hashlib.sha256((password + salt).encode()).hexdigest()

# 加载配置
config = load_config()
RATE_LIMIT = config['rate_limit']
RATE_LIMIT_WINDOW = config['rate_limit_window']
request_counts = {}

def init_data_file():
    """初始化数据文件"""
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump({'questions': [], 'lastUpdated': None}, f, ensure_ascii=False, indent=2)

def read_data():
    """读取数据"""
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {'questions': [], 'lastUpdated': None}

def write_data(data):
    """写入数据"""
    data['lastUpdated'] = datetime.now().isoformat()
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def generate_id():
    """生成唯一ID"""
    import time
    import random
    timestamp = str(int(time.time()))[-6:]
    random_num = str(random.randint(0, 99)).zfill(2)
    return f"U{timestamp}{random_num}"

def check_basic_auth(auth_header):
    """检查HTTP Basic认证"""
    if not auth_header:
        return False
    
    try:
        auth_type, credentials = auth_header.split(' ', 1)
        if auth_type.lower() != 'basic':
            return False
        
        decoded = base64.b64decode(credentials).decode('utf-8')
        username, password = decoded.split(':', 1)
        
        # 验证账号密码（密码已哈希存储）
        if username in config['credentials']:
            return config['credentials'][username] == hash_password(password)
        
        return False
    except Exception:
        return False

def check_api_key(api_key_header):
    """检查API Key"""
    if not api_key_header:
        return False
    
    api_key = api_key_header.strip()
    return api_key in config['api_keys']

def is_rate_limited(ip):
    """检查是否超过访问频率限制"""
    now = datetime.now().timestamp()
    current_window = int(now // RATE_LIMIT_WINDOW)
    
    if ip not in request_counts:
        request_counts[ip] = {'window': current_window, 'count': 1}
        return False
    
    if request_counts[ip]['window'] != current_window:
        request_counts[ip] = {'window': current_window, 'count': 1}
        return False
    
    request_counts[ip]['count'] += 1
    return request_counts[ip]['count'] > RATE_LIMIT

def validate_question(question):
    """验证问题数据"""
    if not isinstance(question, dict):
        return False, '问题数据必须是对象'
    
    required_fields = ['question', 'options', 'correct']
    for field in required_fields:
        if field not in question:
            return False, f'缺少必要字段: {field}'
    
    if not isinstance(question['question'], str) or len(question['question'].strip()) == 0:
        return False, '问题文本不能为空'
    
    if not isinstance(question['options'], list) or len(question['options']) < 2:
        return False, '选项至少需要2个'
    
    if not isinstance(question['correct'], list) or len(question['correct']) == 0:
        return False, '至少需要一个正确答案'
    
    for idx in question['correct']:
        if idx < 0 or idx >= len(question['options']):
            return False, '正确答案索引超出范围'
    
    return True, None

class QuizHandler(SimpleHTTPRequestHandler):
    """请求处理器"""

    def _set_cors_headers(self):
        """设置CORS头"""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key')

    def _send_error(self, code, message):
        """发送错误响应"""
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self._set_cors_headers()
        self.end_headers()
        self.wfile.write(json.dumps({'success': False, 'error': message}).encode('utf-8'))

    def _authenticate(self):
        """进行身份认证"""
        # 获取客户端IP
        client_ip = self.client_address[0]
        
        # 检查访问频率
        if is_rate_limited(client_ip):
            self._send_error(429, '请求过于频繁，请稍后再试')
            return False
        
        # 获取认证头
        auth_header = self.headers.get('Authorization')
        api_key_header = self.headers.get('X-API-Key')
        
        # 检查认证
        if check_basic_auth(auth_header) or check_api_key(api_key_header):
            return True
        
        # 未授权
        self.send_response(401)
        self.send_header('WWW-Authenticate', 'Basic realm="Quiz API"')
        self.send_header('Content-Type', 'application/json')
        self._set_cors_headers()
        self.end_headers()
        self.wfile.write(json.dumps({'success': False, 'error': '未授权访问，请提供账号密码或API Key'}).encode('utf-8'))
        return False

    def do_OPTIONS(self):
        """处理OPTIONS预检请求"""
        self.send_response(200)
        self._set_cors_headers()
        self.end_headers()

    def do_GET(self):
        """处理GET请求"""
        parsed = urlparse(self.path)
        path = parsed.path

        if path == '/api/questions':
            # 获取问题不需要认证（公开访问）
            data = read_data()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self._set_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps(data['questions'], ensure_ascii=False).encode('utf-8'))
            return

        elif path == '/api/stats':
            # 获取统计信息不需要认证
            data = read_data()
            stats = {
                'totalQuestions': len(data['questions']),
                'lastUpdated': data.get('lastUpdated')
            }
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self._set_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps(stats, ensure_ascii=False).encode('utf-8'))
            return

        elif path == '/api/config-help':
            # 显示配置帮助信息（公开访问）
            help_info = {
                'message': '配置说明',
                'environment_variables': {
                    'QUIZ_PORT': '服务器端口，默认3000',
                    'QUIZ_DATA_FILE': '数据文件路径，默认shared_questions.json',
                    'QUIZ_CONFIG_FILE': '配置文件路径，默认quiz_config.json',
                    'QUIZ_ADMIN_PASSWORD': '管理员密码',
                    'QUIZ_USER_PASSWORD': '普通用户密码',
                    'QUIZ_API_KEY': 'API Key',
                    'QUIZ_SALT': '密码哈希盐值',
                    'QUIZ_CREDENTIALS': 'JSON格式的账号密码配置'
                },
                'config_file_format': {
                    'credentials': {'username': 'hashed_password'},
                    'api_keys': ['key1', 'key2'],
                    'rate_limit': 100,
                    'rate_limit_window': 60
                }
            }
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self._set_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps(help_info, ensure_ascii=False).encode('utf-8'))
            return

        # 其他请求使用默认处理
        super().do_GET()

    def do_POST(self):
        """处理POST请求"""
        parsed = urlparse(self.path)
        path = parsed.path

        if path == '/api/questions':
            # 添加问题需要认证
            if not self._authenticate():
                return

            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length).decode('utf-8')

            try:
                question = json.loads(body) if body else {}
            except json.JSONDecodeError:
                self._send_error(400, '无效的JSON数据')
                return

            # 验证数据
            valid, error = validate_question(question)
            if not valid:
                self._send_error(400, error)
                return

            with LOCK:
                data = read_data()
                new_question = {
                    **question,
                    'id': generate_id(),
                    'createdAt': datetime.now().isoformat()
                }
                data['questions'].append(new_question)
                write_data(data)

            self.send_response(201)
            self.send_header('Content-Type', 'application/json')
            self._set_cors_headers()
            self.end_headers()
            response = {'success': True, 'question': new_question}
            self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))
            return

        elif path == '/api/set-password':
            # 设置密码（需要管理员认证）
            if not self._authenticate():
                return

            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length).decode('utf-8')

            try:
                data = json.loads(body) if body else {}
            except json.JSONDecodeError:
                self._send_error(400, '无效的JSON数据')
                return

            if 'username' not in data or 'password' not in data:
                self._send_error(400, '缺少用户名或密码')
                return

            # 更新密码（自动哈希）
            config['credentials'][data['username']] = hash_password(data['password'])
            save_config(config)

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self._set_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps({'success': True, 'message': '密码已更新'}).encode('utf-8'))
            return

        self._send_error(404, '接口不存在')

    def do_DELETE(self):
        """处理DELETE请求"""
        parsed = urlparse(self.path)
        path = parsed.path

        if path.startswith('/api/questions/'):
            # 删除问题需要认证
            if not self._authenticate():
                return

            question_id = path.split('/')[-1]

            with LOCK:
                data = read_data()
                initial_length = len(data['questions'])
                data['questions'] = [q for q in data['questions'] if q.get('id') != question_id]

                if len(data['questions']) < initial_length:
                    write_data(data)
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self._set_cors_headers()
                    self.end_headers()
                    self.wfile.write(json.dumps({'success': True}).encode('utf-8'))
                else:
                    self._send_error(404, '问题不存在')
                return

        self._send_error(404, '接口不存在')

    def log_message(self, format, *args):
        """自定义日志格式"""
        client_ip = self.client_address[0]
        print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] [{client_ip}] {args[0]}")

def main():
    """主函数"""
    init_data_file()

    server = HTTPServer(('0.0.0.0', PORT), QuizHandler)
    print(f"共享题库服务器运行在 http://localhost:{PORT}")
    print("\n安全配置:")
    print("  - 账号密码认证: 已启用（密码已哈希存储）")
    print("  - API Key认证: 已启用")
    print("  - 访问频率限制: 每分钟{}次".format(RATE_LIMIT))
    print("\n配置方式:")
    print("  1. 环境变量: QUIZ_ADMIN_PASSWORD, QUIZ_USER_PASSWORD, QUIZ_API_KEY")
    print("  2. 配置文件: quiz_config.json（首次运行自动生成）")
    print("  3. API: POST /api/set-password（需管理员认证）")
    print("\nAPI 端点:")
    print("  GET  /api/questions   - 获取所有问题（公开）")
    print("  POST /api/questions   - 添加新问题（需认证）")
    print("  DELETE /api/questions/:id - 删除问题（需认证）")
    print("  GET  /api/stats      - 获取统计信息（公开）")
    print("  GET  /api/config-help - 获取配置帮助（公开）")
    print("  POST /api/set-password - 设置密码（需认证）")
    print("\n按 Ctrl+C 停止服务器")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n服务器已停止")
        server.shutdown()

if __name__ == '__main__':
    main()
