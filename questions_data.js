/**
 * Copyright 2025 World Cup Quiz Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * 世界杯题库数据
 * 包含所有问题，供游戏和题库页面共享
 * 支持本地基础问题和线上共享题库
 * 支持中英文双语
 */

(function() {
    // 基础问题（私有变量，不暴露到全局）
    // ID格式：Q001, Q002, ... 用于唯一标识每个问题，便于未来扩展功能（如特定题目答对奖励）
    // 结构：question: { zh, en }, options: [{ zh, en }] 或 options: [图片路径] (图片选择题)
    const baseQuestions = [
        {
            id: "Q001",
            image: "images/baqiao.jpg",
            question: {
                zh: "这是哪一届世界杯的罗伯特巴乔",
                en: "Which World Cup does this Roberto Baggio belong to?"
            },
            options: [
                { zh: "90年决赛", en: "1990 Final" },
                { zh: "94年决赛", en: "1994 Final" },
                { zh: "98年决赛", en: "1998 Final" }
            ],
            correct: [1]
        },
        {
            id: "Q002",
            image: "images/qizu.jpg",
            question: {
                zh: "这是哪个名场面",
                en: "Which iconic moment is this?"
            },
            options: [
                { zh: "施丹头槌马特拉斯", en: "ShiDan headbutted MaTeLaSi" },
                { zh: "齐达内肘击马特拉齐", en: "Zidane elbowed Materazzi" },
                { zh: "齐达内施展铁头功", en: "Zidane performed Iron Head Kung Fu" },
                { zh: "放错图片了，这是UFC现场", en: "Wrong image, this is UFC" }
            ],
            correct: [0, 2]
        },
        {
            id: "Q003",
            image: "images/xiaobei.jpg",
            question: {
                zh: "这是哪个名场面",
                en: "Which iconic moment is this?"
            },
            options: [
                { zh: "98年碧咸食红牌", en: "1998 BiXian got a red card" },
                { zh: "98年贝克汉姆被红牌罚下", en: "1998 Beckham was sent off" },
                { zh: "98年欧文被红牌罚下", en: "1998 Owen was sent off" },
                { zh: "98年西蒙尼被红牌罚下", en: "1998 Simeone was sent off" }
            ],
            correct: [0, 1]
        },
        {
            id: "Q004",
            image: "images/shangdi.jpg",
            question: {
                zh: "能猜出这是哪位球员吗？",
                en: "Can you guess which player this is?"
            },
            options: [
                { zh: "馬勒當拿", en: "MaLeDangNa" },
                { zh: "马拉多纳", en: "Maradona" },
                { zh: "哨牙蘇", en: "ShaoYaSu" },
                { zh: "苏亚雷斯", en: "Suarez" }
            ],
            correct: [0, 1]
        },
        {
            id: "Q005",
            image: "images/suya.jpg",
            question: {
                zh: "能猜出这是哪位球员吗？",
                en: "Can you guess which player this is?"
            },
            options: [
                { zh: "馬勒當拿", en: "MaLeDangNa" },
                { zh: "马拉多纳", en: "Maradona" },
                { zh: "哨牙蘇", en: "ShaoYaSu" },
                { zh: "苏亚雷斯", en: "Suarez" }
            ],
            correct: [2, 3]
        },
        {
            id: "Q006",
            question: {
                zh: "以下哪个是86年世界杯马拉多纳的世纪进球？",
                en: "Which one is Maradona's Goal of the Century at 1986 World Cup?"
            },
            options: [
                "images/shiji_B.jpg",
                "images/shiji_A.jpg"
            ],
            correct: [1],
            type: "image"
        },
        {
            id: "Q007",
            question: {
                zh: "谁是世界杯之王？",
                en: "Who is the God of World Cup?"
            },
            options: [
                { zh: "贝利", en: "Pele" },
                { zh: "马拉多纳", en: "Maradona" },
                { zh: "梅西", en: "Messi" },
                { zh: "另有其他真神", en: "There's another GOAT" }
            ],
            correct: [0, 1, 2, 3]
        },
        {
            id: "Q008",
            image: "images/menxian.jpg",
            question: {
                zh: "这是哪一场世界杯比赛？",
                en: "Which World Cup match is this?"
            },
            options: [
                { zh: "1966年英格兰 vs. 联邦德国", en: "1966 England vs. West Germany" },
                { zh: "2010年英格兰 vs. 德国", en: "2010 England vs. Germany" }
            ],
            correct: [1]
        },
        {
            id: "Q009",
            image: "images/nanzu.jpeg",
            question: {
                zh: "中国队这个球进了吗？",
                en: "Did the Chinese team score this goal?"
            },
            options: [
                { zh: "没进", en: "No" },
                { zh: "进了", en: "Yes" },
                { zh: "我相信在另一个平行宇宙中这球进了", en: "I believe in another parallel universe this goal counted" }
            ],
            correct: [0]
        },
        {
            id: "Q010",
            image: "images/nvzu.jpg",
            question: {
                zh: "请说出这支球队的名字",
                en: "Please name this team"
            },
            options: [
                { zh: "中国女足", en: "Chinese Women's Team" },
                { zh: "沙特女足", en: "Saudi Women's Team" },
                { zh: "铿锵玫瑰", en: "Steel Roses" },
                { zh: "沙漠玫瑰", en: "Desert Roses" }
            ],
            correct: [0, 2]
        }
    ];

    // 配置
    // API_BASE_URL: 线上共享题库API地址（部署后修改为实际地址）
    const API_BASE_URL = window.location.hostname === 'localhost'
        ? 'http://localhost:3000'
        : `http://${window.location.host}`;
    const STORAGE_KEY = 'world_cup_quiz_questions';
    const PLAYED_KEY = 'world_cup_quiz_played';
    const CACHE_KEY = 'world_cup_quiz_cloud_cache';
    const CACHE_EXPIRY = 5 * 60 * 1000; // 缓存5分钟
    const LANGUAGE_KEY = 'world_cup_quiz_language';
    
    // API认证配置 - 应在部署时通过环境变量或配置文件设置
    // 生产环境建议使用后端代理或服务端渲染，避免前端直接暴露API Key
    const API_KEY = window.QUIZ_API_KEY || 'd97df1f1485d4ac39372';

    // 云端问题缓存
    let cloudQuestionsCache = null;
    let cloudQuestionsTimestamp = 0;

    // 当前语言
    let currentLanguage = 'zh';

    /**
     * 获取当前语言
     */
    function getCurrentLanguage() {
        return currentLanguage;
    }

    /**
     * 设置当前语言
     */
    function setCurrentLanguage(lang) {
        currentLanguage = lang;
        try {
            localStorage.setItem(LANGUAGE_KEY, lang);
        } catch (e) {}
    }

    /**
     * 初始化语言设置
     */
    function initLanguage() {
        try {
            const saved = localStorage.getItem(LANGUAGE_KEY);
            if (saved === 'en' || saved === 'zh') {
                currentLanguage = saved;
            }
        } catch (e) {}
    }

    /**
     * 获取问题的翻译文本
     * @param {Object|string} text - 文本对象或字符串
     * @returns {string} 翻译后的文本
     */
    function getTranslatedText(text) {
        if (typeof text === 'string') {
            return text;
        }
        if (typeof text === 'object' && text !== null) {
            return text[currentLanguage] || text.zh || '';
        }
        return '';
    }

    /**
     * 获取选项的翻译文本
     * @param {Object|string} option - 选项对象或字符串
     * @returns {string} 翻译后的文本
     */
    function getTranslatedOption(option) {
        if (typeof option === 'string') {
            return option;
        }
        if (typeof option === 'object' && option !== null) {
            return option[currentLanguage] || option.zh || '';
        }
        return '';
    }

    /**
     * 检查缓存是否有效
     */
    function isCacheValid() {
        if (!cloudQuestionsCache || !cloudQuestionsTimestamp) return false;
        return Date.now() - cloudQuestionsTimestamp < CACHE_EXPIRY;
    }

    /**
     * 从线上共享题库获取问题
     * @returns {Promise<Array>} 用户问题数组
     */
    async function fetchCloudQuestions() {
        // 如果缓存有效，直接返回缓存
        if (isCacheValid()) {
            return cloudQuestionsCache;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/questions`);
            if (response.ok) {
                const questions = await response.json();
                cloudQuestionsCache = questions;
                cloudQuestionsTimestamp = Date.now();
                // 同时更新本地缓存
                localStorage.setItem(CACHE_KEY, JSON.stringify({
                    questions,
                    timestamp: cloudQuestionsTimestamp
                }));
                return questions;
            }
        } catch (error) {
            console.log('无法连接线上题库，使用本地缓存');
        }

        // 尝试从本地缓存加载
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                const { questions, timestamp } = JSON.parse(cached);
                cloudQuestionsCache = questions;
                cloudQuestionsTimestamp = timestamp;
                return questions;
            }
        } catch (error) {
            console.error('加载本地缓存失败:', error);
        }

        return [];
    }

    /**
     * 保存问题到线上共享题库
     * @param {Object} question - 问题对象
     * @returns {Promise<Object>} 保存结果
     */
    async function saveQuestionToCloud(question) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/questions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': API_KEY
                },
                body: JSON.stringify(question)
            });

            if (response.ok) {
                const result = await response.json();
                // 清除缓存，下次加载会获取最新数据
                cloudQuestionsCache = null;
                cloudQuestionsTimestamp = 0;
                localStorage.removeItem(CACHE_KEY);
                return result;
            }
        } catch (error) {
            console.log('无法保存到线上题库，将保存到本地');
        }

        // 降级到本地存储
        return saveQuestionLocal(question);
    }

    /**
     * 保存问题到本地存储（降级方案）
     * @param {Object} question - 问题对象
     * @returns {Object} 保存结果
     */
    function saveQuestionLocal(question) {
        const userQuestions = loadUserQuestionsLocal();
        const newQuestion = {
            ...question,
            id: generateQuestionId(),
            createdAt: new Date().toISOString(),
            source: 'local'
        };
        userQuestions.push(newQuestion);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userQuestions));
        return { success: true, question: newQuestion, local: true };
    }

    /**
     * 删除问题从线上共享题库
     * @param {string} questionId - 问题ID
     * @returns {Promise<Object>} 删除结果
     */
    async function deleteQuestionFromCloud(questionId) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/questions/${questionId}`, {
                method: 'DELETE',
                headers: {
                    'X-API-Key': API_KEY
                }
            });

            if (response.ok) {
                // 清除缓存
                cloudQuestionsCache = null;
                cloudQuestionsTimestamp = 0;
                localStorage.removeItem(CACHE_KEY);
                return { success: true };
            }
        } catch (error) {
            console.log('无法连接到服务器删除问题');
        }

        return { success: false };
    }

    /**
     * 检查用户是否已经玩过游戏
     * @returns {boolean} 是否玩过
     */
    function hasPlayedBefore() {
        try {
            return localStorage.getItem(PLAYED_KEY) === 'true';
        } catch (error) {
            return false;
        }
    }

    /**
     * 标记用户已经玩过游戏
     */
    function markAsPlayed() {
        try {
            localStorage.setItem(PLAYED_KEY, 'true');
        } catch (error) {
            console.error('标记游戏状态失败:', error);
        }
    }

    /**
     * 获取有序的基础问题（用于新玩家）
     * 按ID顺序返回前10道题
     * @returns {Array} 有序问题数组
     */
    function getOrderedQuestions() {
        return baseQuestions.slice(0, 10);
    }

    /**
     * 从本地存储加载用户创建的问题（仅用于初始化）
     * @returns {Array} 用户问题数组
     */
    function loadUserQuestionsLocal() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('加载用户问题失败:', error);
            return [];
        }
    }

    /**
     * 生成唯一问题ID
     * 格式：U + 时间戳后6位 + 随机2位数
     * 用于用户创建的问题，确保与基础问题ID不冲突
     * @returns {string} 唯一ID
     */
    function generateQuestionId() {
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
        return `U${timestamp}${random}`;
    }

    /**
     * 获取所有问题（基础问题 + 用户问题）
     * @returns {Array} 所有问题数组
     */
    function getAllQuestions() {
        // 基础问题 + 本地用户问题（同步调用，用于初始化）
        const localQuestions = loadUserQuestionsLocal();
        return [...baseQuestions, ...localQuestions];
    }

    /**
     * 获取所有问题（异步版本，会尝试获取云端数据）
     * @returns {Promise<Array>} 所有问题数组
     */
    async function getAllQuestionsAsync() {
        const localQuestions = loadUserQuestionsLocal();
        try {
            const cloudQuestions = await fetchCloudQuestions();
            return [...baseQuestions, ...cloudQuestions];
        } catch (error) {
            console.error('获取云端问题失败:', error);
            return [...baseQuestions, ...localQuestions];
        }
    }

    /**
     * 随机选择指定数量的问题
     * @param {number} count - 要选择的问题数量
     * @returns {Array} 随机选择的问题数组
     */
    function getRandomQuestions(count = 10) {
        const allQuestions = getAllQuestions();
        if (allQuestions.length <= count) {
            return allQuestions;
        }

        // 洗牌算法
        const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    /**
     * 随机选择指定数量的问题（异步版本，会尝试获取云端数据）
     * @param {number} count - 要选择的问题数量
     * @returns {Promise<Array>} 随机选择的问题数组
     */
    async function getRandomQuestionsAsync(count = 10) {
        const allQuestions = await getAllQuestionsAsync();
        if (allQuestions.length <= count) {
            return allQuestions;
        }

        // 洗牌算法
        const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    /**
     * 保存用户问题到线上共享题库
     * @param {Object} question - 问题对象
     * @returns {Promise<Object>} 保存结果
     */
    async function saveUserQuestion(question) {
        return await saveQuestionToCloud(question);
    }

    /**
     * 删除用户问题
     * @param {string} questionId - 问题ID
     * @returns {Promise<Object>} 删除结果
     */
    async function deleteUserQuestion(questionId) {
        return await deleteQuestionFromCloud(questionId);
    }

    /**
     * 获取云端题库统计信息
     * @returns {Promise<Object>} 统计信息
     */
    async function getCloudStats() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/stats`);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('获取云端统计失败:', error);
        }
        return { totalQuestions: 0, lastUpdated: null, error: '无法连接' };
    }

    // 初始化语言
    initLanguage();

    // 安全地暴露接口（只暴露必要的函数）
    if (typeof window !== 'undefined') {
        window.WorldCupQuizData = {
            getAllQuestions,
            getAllQuestionsAsync,
            getRandomQuestions,
            getRandomQuestionsAsync,
            getOrderedQuestions,
            hasPlayedBefore,
            markAsPlayed,
            saveUserQuestion,
            deleteUserQuestion,
            getCloudStats,
            generateQuestionId,
            getCurrentLanguage,
            setCurrentLanguage,
            getTranslatedText,
            getTranslatedOption,
            baseQuestions: baseQuestions
        };
    }
})();
