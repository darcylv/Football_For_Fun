# 世界杯经典瞬间答题游戏 / World Cup Classic Moments Quiz

一个基于 HTML5 的世界杯知识问答游戏，包含 10 道选择题，玩家答题后根据正确率获得不同评级。游戏支持用户自定义问题、云端共享题库、隐藏成就解锁等功能。

An HTML5-based World Cup quiz game with 10  questions, where players receive different ratings based on their accuracy. The game supports custom questions, cloud-shared question bank, and hidden achievements.

**Click To Play**: https://darcylv.github.io/Football_For_Fun/

<img width="504" height="439" alt="游戏封面" src="https://github.com/user-attachments/assets/0a533991-2592-48fd-ae22-04289055dd0d" /> <img width="504" height="502" alt="问题示例" src="https://github.com/user-attachments/assets/6d06a0b2-a013-4d48-8f6d-8dc43113a7b0" />



## 目录 / Table of Contents

- [快速开始 / Quick Start](#快速开始--quick-start)
- [功能特性 / Features](#功能特性--features)
- [文件结构 / File Structure](#文件结构--file-structure)
- [API 文档 / API Documentation](#api-文档--api-documentation)
- [部署说明 / Deployment](#部署说明--deployment)
- [开发指南 / Development Guide](#开发指南--development-guide)
- [注意事项 / Notes](#注意事项--Notes)
- [许可证 / License](#许可证--license)

## 快速开始 / Quick Start

### 方式一：直接访问（使用本地缓存）/ Option 1: Direct Access (Using Local Cache)

```bash
# 进入项目目录
cd For_Fun

# 启动本地服务器
python3 -m http.server 8080

# 访问游戏
open http://localhost:8080/index.html
```

### 方式二：启用云端共享题库 / Option 2: Enable Cloud-Shared Question Bank

```bash
# Terminal 1: 启动共享题库服务器（API服务，端口3000）
# Terminal 1: Start shared question bank server (API service, port 3000)
python3 server.py

# Terminal 2: 启动前端服务器（端口8080）
# Terminal 2: Start frontend server (port 8080)
python3 -m http.server 8080

# 访问游戏
# Access the game
open http://localhost:8080/index.html

# 访问题库管理
# Access question bank management
open http://localhost:8080/questions.html
```

## 功能特性 / Features

### 游戏功能 / Game Features

- **10道选择题**：涵盖世界杯经典瞬间 / **10 multiple-choice questions**: Covering classic World Cup moments
- **两种题型** / **Two question types**:
  - 文字选择题：问题+文字选项 / Text questions: Question + text options
  - 图片选择题：问题+图片选项 / Image questions: Question + image options
- **多正确答案支持**：一道题可设置多个正确答案 / **Multiple correct answers**: A question can have multiple correct answers
- **评级系统**：根据正确率获得不同评级 / **Rating system**: Get different ratings based on accuracy

### 评级规则 / Rating Rules

| 正确率 / Accuracy | 评级 / Rating              | 图标 | 描述 / Description                                                                                                                                       |
| -------------- | ------------------------ | -- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 100%           | 教练席 / Coach's Box        | ⚽  | 你是真正的世界杯专家！对经典瞬间了如指掌，值得和主教练一起观赛！ / You are a true World Cup expert! You know all the classic moments, worthy of watching the game with the head coach! |
| 80%-99%        | VIP包厢 / VIP Box          | ⭐  | 你很熟悉世界杯，VIP包厢的位置让你不错过任何精彩瞬间！ / You are very familiar with the World Cup, the VIP box lets you not miss any exciting moments!                           |
| 60%-79%        | 普通观众席 / Regular Seats    | 🙋 | 你对世界杯有一定了解，在观众席为心爱的球队呐喊吧！ / You have some understanding of the World Cup, cheer for your favorite team in the stands!                                  |
| 20%-49%        | 场外球迷区 / Outside Fan Zone | 🍺 | 看来你错过了很多世界杯精彩时刻，在球场外围和球迷狂欢吧！ / Looks like you missed many exciting World Cup moments, party with fans outside the stadium!                             |
| 10%-19%        | 家里蹲 / Home Watching      | 🏠 | 世界杯对你来说可能有点陌生？没关系，在家看直播也很不错哦！ / World Cup might be a bit unfamiliar to you? No problem, watching the live stream at home is also great!                |

### 新老玩家策略 / New vs Returning Players

- **新玩家**：首次访问时按题目 ID 顺序出题（Q001\~Q010）/ **New players**: First visit gets questions in order by ID (Q001\~Q010)
- **老玩家**：再次访问时从题库中随机抽取 10 道题 / **Returning players**: Randomly pick 10 questions from the bank on subsequent visits

### 用户创建问题 / User-Created Questions

- 支持创建文字选择题和图片选择题 / Supports creating text and image questions
- 创建的问题自动同步到云端共享题库 / Created questions automatically sync to cloud-shared bank
- 离线时自动降级到本地存储 / Falls back to local storage when offline

### 题库管理 / Question Bank Management

- 查看所有问题（基础问题 + 用户问题）/ View all questions (base + user-created)
- 显示问题唯一 ID / Show unique question ID
- 删除用户创建的问题 / Delete user-created questions

## 文件结构 / File Structure

```
For_Fun/
├── index.html              # 游戏主页面 / Game main page
├── style.css               # 样式文件 / Styles
├── script.js               # 游戏逻辑脚本 / Game logic script
├── questions_data.js       # 题库数据模块 / Question bank data module
├── questions.html          # 题库管理页面 / Question bank management page
├── server.py               # 共享题库后端服务（Python版，含认证功能）/ Shared question bank backend (Python version with authentication)
├── quiz_config.json        # 配置文件（API Key、账号密码）- 不提交到Git / Config file (API Key, credentials) - NOT committed to Git
├── quiz_config.example.json # 配置文件示例 / Example config file
├── shared_questions.json   # 共享题库数据文件 / Shared question bank data file
├── .gitignore              # Git忽略配置 / Git ignore config
├── LICENSE                 # Apache 2.0 许可证 / Apache 2.0 License
├── README.md               # 项目说明文档 / Project documentation
└── images/                 # 图片资源目录 / Image resource directory
    ├── baqiao.png         # 巴乔 / Baggio
    ├── qizu.png           # 齐达内 / Zidane
    ├── xiaobei.png        # 小贝 / Beckham
    ├── shangdi.png        # 上帝之手 / Hand of God
    ├── suya.png           # 苏亚雷斯 / Suarez
    ├── nanzu.png          # 男足 / Chinese Men's Team
    ├── nvzu.png           # 女足 / Chinese Women's Team
    ├── menxian.png        # 门线悬案 / Goal Line Controversy
    ├── shiji_A.png        # 世纪进球选项A / Goal of the Century Option A
    └── shiji_B.png        # 世纪进球选项B / Goal of the Century Option B
```

## API 文档 / API Documentation

共享题库服务器运行于 `http://localhost:3000` / Shared question bank server runs at `http://localhost:3000`

### 公共端点（无需认证）/ Public Endpoints (No Auth Required)

| 方法 / Method | 路径 / Path          | 描述 / Description                   |
| ----------- | ------------------ | ---------------------------------- |
| GET         | `/api/questions`   | 获取所有问题 / Get all questions         |
| GET         | `/api/stats`       | 获取题库统计信息 / Get question bank stats |
| GET         | `/api/config-help` | 获取配置帮助信息 / Get config help         |

### 受保护端点（需要认证）/ Protected Endpoints (Auth Required)

| 方法 / Method | 路径 / Path            | 描述 / Description                                 |
| ----------- | -------------------- | ------------------------------------------------ |
| POST        | `/api/questions`     | 添加新问题 / Add new question                         |
| DELETE      | `/api/questions/:id` | 删除问题 / Delete question                           |
| POST        | `/api/set-password`  | 设置密码（需管理员认证）/ Set password (admin auth required) |

### 认证方式 / Authentication Methods

#### 1. API Key 认证（推荐）/ API Key Auth (Recommended)

```bash
curl -X DELETE http://localhost:3000/api/questions/{id} \
  -H "X-API-Key: YOUR_API_KEY"
```

#### 2. HTTP Basic 认证 / HTTP Basic Auth

```bash
curl -X DELETE http://localhost:3000/api/questions/{id} \
  -H "Authorization: Basic $(echo -n 'username:password' | base64)"
```

**注意** / **Note**:

- API Key 和默认密码在首次运行服务器时会在终端显示 / API Key and default password shown in terminal on first run
- 请勿将默认密码直接用于生产环境 / Do not use default passwords in production
- 使用环境变量 `QUIZ_API_KEY`、`QUIZ_ADMIN_PASSWORD`、`QUIZ_USER_PASSWORD` 设置安全凭证 / Use env vars to set secure credentials

## 部署说明 / Deployment

### 环境变量配置 / Environment Variables

| 变量名 / Variable        | 默认值 / Default          | 描述 / Description            |
| --------------------- | ---------------------- | --------------------------- |
| `QUIZ_PORT`           | 3000                   | API 服务器端口 / API server port |
| `QUIZ_DATA_FILE`      | shared\_questions.json | 数据文件路径 / Data file path     |
| `QUIZ_CONFIG_FILE`    | quiz\_config.json      | 配置文件路径 / Config file path   |
| `QUIZ_ADMIN_PASSWORD` | admin123!              | 管理员密码 / Admin password      |
| `QUIZ_USER_PASSWORD`  | user123!               | 用户密码 / User password        |
| `QUIZ_API_KEY`        | 自动生成 / Auto-generated  | API Key                     |
| `QUIZ_SALT`           | quiz\_salt\_2024       | 密码哈希盐值 / Password hash salt |

### 示例 / Example

```bash
# 自定义端口和密码 / Custom port and password
QUIZ_PORT=8080 QUIZ_ADMIN_PASSWORD=secret123 python3 server.py
```

### 安全特性 / Security Features

- **密码哈希存储**：密码使用 SHA256 + Salt 加密存储 / **Password hashing**: Passwords stored with SHA256 + Salt
- **API Key 认证**：支持 API Key 方式访问 / **API Key auth**: Supports API Key access
- **访问频率限制**：默认每分钟 100 次请求 / **Rate limiting**: Default 100 requests per minute
- **CORS 支持**：允许跨域访问 / **CORS support**: Allows cross-origin access

## 开发指南 / Development Guide

### 本地存储键名 / LocalStorage Keys

| 键名 / Key                     | 描述 / Description                                        |
| ---------------------------- | ------------------------------------------------------- |
| `world_cup_quiz_cloud_cache` | 云端题库本地缓存（5分钟有效期）/ Cloud question bank cache (5 min TTL) |
| `world_cup_quiz_questions`   | 用户创建的问题（本地存储）/ User-created questions (local)           |
| `world_cup_quiz_played`      | 游戏状态标记（是否玩过）/ Game state (has played)                   |

### 重置游戏状态 / Reset Game State

在浏览器控制台执行 / Run in browser console:

```javascript
localStorage.removeItem('world_cup_quiz_played');
```

### 清除云端题库缓存 / Clear Cloud Cache

```javascript
localStorage.removeItem('world_cup_quiz_cloud_cache');
```

### 模块说明 / Module Documentation

#### questions\_data.js

题库数据模块，使用 IIFE 模式封装，提供以下接口：

Question bank data module, encapsulated in IIFE pattern, provides:

- `getAllQuestions()` - 获取所有问题（同步）/ Get all questions (sync)
- `getAllQuestionsAsync()` - 获取所有问题（异步）/ Get all questions (async)
- `getRandomQuestions(count)` - 随机获取指定数量题目 / Get random n questions
- `saveUserQuestion(question)` - 保存用户问题 / Save user question
- `deleteUserQuestion(questionId)` - 删除用户问题 / Delete user question
- `hasPlayedBefore()` - 检查是否玩过游戏 / Check if played before
- `markAsPlayed()` - 标记已玩过游戏 / Mark as played

#### script.js

游戏核心逻辑，包含 WorldCupQuiz 类：

Game core logic, contains WorldCupQuiz class:

```javascript
class WorldCupQuiz {
    constructor()           // 初始化游戏状态 / Initialize game state
    startGame()             // 开始游戏 / Start game
    loadQuestion()          // 加载当前题目 / Load current question
    selectOption()          // 选择选项 / Select option
    showResult()            // 显示结果 / Show result
    checkHiddenAchievement() // 检查隐藏成就 / Check hidden achievements
}
```

## 注意事项 / Notes

### 游戏运行 / Running the game
1. **本地服务器**：由于浏览器安全策略，需要通过 HTTP 服务器访问，不能直接打开 HTML 文件 / **Local server**: Browser security requires HTTP server, cannot open HTML files directly
2. **图片路径**：本地图片放在 `images/` 目录，使用相对路径引用 / **Image paths**: Local images in `images/` directory, use relative paths
3. **数据同步**：不同浏览器/设备的数据不共享（除非使用云端服务器）/ **Data sync**: Data not shared across browsers/devices (unless using cloud server)

### 第三方资源说明 / Third-Party Resources

本项目使用了以下开源工具和资源：

This project uses the following open-source tools and resources:

- **Python 标准库**：`http.server`、`json`、`hashlib`、`base64`、`threading` 等均为 Python 内置库 / **Python standard library**: `http.server`, `json`, `hashlib`, `base64`, `threading`, etc. are Python built-in libraries
- **无其他第三方依赖**：项目未使用任何外部开源库或框架 / **No other dependencies**: Project does not use any external libraries or frameworks

### 图片资源 / Image Resources

本项目中的图片资源均来自公开渠道或由开发者原创（其中部分图片使用了AI工具进行生成或修改），旨在用于世界杯知识问答的学术和教育目的。如有任何版权问题，请联系我们进行删除或授权。

Image resources in this project come from public sources or are original creations (some images generated or modified using AI tools), intended for academic and educational purposes related to World Cup trivia. If there are any copyright issues, please contact us for removal or licensing.

### AI辅助开发说明 / AI-Assisted Development Disclosure

本项目在开发过程中使用了以下 AI 工具辅助生成部分代码：/ The following AI tools were used during the development of this project to assist with code generation, logic debugging, and documentation:

- **代码生成与调试**：TRAE_CN / **Code generation and debugging**: TRAE_CN

- **美术/音效**：豆包 / **Art/Audioe**: Doubao

所有 AI 生成的代码均经过人工审查、测试和修改，符合项目的功能与质量要求。 / All AI-generated content has been manually reviewed, tested, and modified as necessary to meet the project’s functional, performance, and security requirements.

最终代码的著作权及项目整体成果归本人所有。 / The copyright of the final code and the overall project belongs to the author.

### 安全声明 / Security Notice

⚠️ **重要提示**：本项目涉及在线共享题库功能，部署时请注意以下安全事项：

⚠️ **Important**: This project includes online shared question bank functionality, please note the following:

1. **API Key 保护** / **API Key Protection**:
   - 前端 API Key 仅用于标识客户端身份，不能完全防止未授权访问 / Frontend API Key only identifies client, does not fully prevent unauthorized access
   - 生产环境建议使用后端代理模式，由服务端保管 API Key / Production recommends backend proxy, server holds API Key
   - 定期更换 API Key 并使用环境变量配置 / Rotate API Key regularly, use env vars
2. **敏感文件** / **Sensitive Files**:
   - `quiz_config.json` 包含 API Key 和密码哈希，已加入 `.gitignore` / `quiz_config.json` contains API Key and hashes, in `.gitignore`
   - 部署时请勿将配置文件提交到公开仓库 / Do not commit config files to public repos
   - 建议使用环境变量或专门的配置服务管理敏感信息 / Use env vars or config service for secrets
3. **默认密码** / **Default Passwords**:
   - 服务器默认密码为 `admin123!` 和 `user123!` / Server default passwords: `admin123!` and `user123!`
   - 生产部署前请务必修改默认密码 / Change default passwords before production
   - 使用 `QUIZ_ADMIN_PASSWORD` 和 `QUIZ_USER_PASSWORD` 环境变量设置强密码 / Use env vars for strong passwords
4. **HTTPS 建议** / **HTTPS Recommendation**:
   - 当前服务器使用 HTTP 协议，建议在生产环境中配置 HTTPS / Current server uses HTTP, recommend HTTPS in production
   - 可使用 Nginx 反向代理或 Cloudflare 等服务实现 HTTPS / Use Nginx reverse proxy or Cloudflare for HTTPS
5. **数据验证** / **Data Validation**:
   - 服务器端已实现数据验证，但用户提交的内容仍需谨慎处理 / Server has data validation, but user submissions need caution
   - 建议对图片类问题实施内容安全策略（CSP）/ Recommend CSP for image questions
   - 防止 XSS 攻击：用户上传的图片以 Base64 形式存储，输出时已做转义处理 / XSS prevention: User-uploaded images stored as Base64, escaped on output

## 许可证 / License

本项目基于 Apache 2.0 许可证开源。

This project is open source under the Apache License 2.0.

### 开源声明 / Open Source Notice

本项目为开源软件，您可以自由使用、修改和分发，但需遵守 Apache 2.0 许可证的条款。

This project is open source software. You may freely use, modify, and distribute it under the terms of the Apache License 2.0.
