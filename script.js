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
 * 评级数据数组
 * 根据正确率评级，包含：最低正确率、评级名称、图标、描述
 */
const ranks = [
    { min: 100, rank: "教练席", icon: "⚽", desc: "你是真正的世界杯专家！对经典瞬间了如指掌，值得和主教练一起观赛！" },
    { min: 80, rank: "VIP包厢", icon: "⭐", desc: "你很熟悉世界杯，VIP包厢的位置让你不错过任何精彩瞬间！"  },
    { min: 60, rank: "普通观众席", icon: "🙋", desc: "你对世界杯有一定了解，在观众席为心爱的球队呐喊吧！" },
    { min: 20, rank: "场外球迷区", icon: "🍺", desc: "看来你错过了很多世界杯精彩时刻，在球场外围和球迷狂欢吧！" },
    { min: 10, rank: "家里蹲", icon: "🏠", desc: "世界杯对你来说可能有点陌生？没关系，在家看直播也很不错哦！" }
];

/**
 * 隐藏成就数组
 * 满足特定条件时解锁，包含：成就名称、图标、描述、解锁条件
 */
const hiddenAchievements = [
    {
        name: "粤语解说达人",
        icon: "🏆",
        desc: "恭喜你！你是真正的粤语世界杯解说专家，对各位球星的粤语译名了如指掌！",
        check: (userChoicesMap) => {
            // 条件：Q002选择选项A（索引0），Q003选择选项A（索引0），Q004选择选项A（索引0），Q005选择选项C（索引2）
            return userChoicesMap['Q002'] === 0 && 
                   userChoicesMap['Q003'] === 0 && 
                   userChoicesMap['Q004'] === 0 && 
                   userChoicesMap['Q005'] === 2;
        }
    },
    {
        name: "真中国球迷",
        icon: "🇨🇳",
        desc: "为中国足球操碎了心！无论男女足，都永远支持中国足球！",
        check: (userChoicesMap) => {
            // 条件：Q009选择选项C（索引2），Q010选择选项C（索引2）
            return userChoicesMap['Q009'] === 2 && 
                   userChoicesMap['Q010'] === 2;
        }
    }
];

/**
 * WorldCupQuiz类 - 游戏主类
 * 负责游戏的初始化、事件绑定、题目加载、答题判断等核心功能
 */
class WorldCupQuiz {
    /**
     * 构造函数 - 初始化游戏状态
     */
    constructor() {
        this.currentQuestion = 0;  // 当前题目索引
        this.correctCount = 0;     // 正确答题数
        this.answered = false;      // 是否已答题标志
        this.quizQuestions = [];    // 本次游戏的题目数组
        this.userChoicesMap = {};   // 用户选择的答案映射 {questionId: choiceIndex}
        
        this.initElements();  // 初始化DOM元素引用
        this.bindEvents();    // 绑定事件监听器
    }
    
    /**
     * 初始化DOM元素引用
     * 缓存所有需要操作的DOM元素
     */
    initElements() {
        // 屏幕元素
        this.startScreen = document.getElementById('start-screen');
        this.quizScreen = document.getElementById('quiz-screen');
        this.resultScreen = document.getElementById('result-screen');
        this.createQuestionScreen = document.getElementById('create-question-screen');
        
        // 答题界面元素
        this.progressFill = document.getElementById('progress-fill');
        this.currentQuestionEl = document.getElementById('current-question');
        this.totalQuestionsEl = document.getElementById('total-questions');
        this.questionImage = document.getElementById('question-image');
        this.questionText = document.getElementById('question-text');
        this.optionsContainer = document.getElementById('options-container');
        
        // 结果界面元素
        this.resultIcon = document.getElementById('result-icon');
        this.resultTitle = document.getElementById('result-title');
        this.correctCountEl = document.getElementById('correct-count');
        this.finalAccuracyEl = document.getElementById('final-accuracy');
        this.rankValueEl = document.getElementById('rank-value');
        this.resultDescEl = document.getElementById('result-description');
        this.achievementContainer = document.getElementById('achievement-container');
        
        // 创建问题界面元素
        this.questionTypeRadios = document.querySelectorAll('input[name="question-type"]');
        this.textQuestionForm = document.getElementById('text-question-form');
        this.imageQuestionForm = document.getElementById('image-question-form');
        this.textQuestion = document.getElementById('text-question');
        this.textQuestionImage = document.getElementById('text-question-image');
        this.noImageCheckbox = document.getElementById('no-image');
        this.textOptionsContainer = document.getElementById('text-options-container');
        this.imageOptionsContainer = document.getElementById('image-options-container');
        this.textCorrectAnswers = document.getElementById('text-correct-answers');
        this.imageCorrectAnswers = document.getElementById('image-correct-answers');
    }
    
    /**
     * 绑定事件监听器
     * 为开始按钮和再玩一次按钮绑定点击事件
     */
    bindEvents() {
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.getElementById('restart-btn').addEventListener('click', () => this.restartGame());
        document.getElementById('create-question-btn').addEventListener('click', () => this.showCreateQuestionScreen());
        document.getElementById('cancel-create').addEventListener('click', () => this.showResultScreen());
        document.getElementById('save-question').addEventListener('click', () => this.saveQuestion());
        document.getElementById('add-text-option').addEventListener('click', () => this.addTextOption());
        document.getElementById('add-image-option').addEventListener('click', () => this.addImageOption());
        
        // 问题类型切换
        this.questionTypeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => this.switchQuestionType(e.target.value));
        });
        
        // 无配图 checkbox 事件
        this.noImageCheckbox.addEventListener('change', (e) => {
            this.textQuestionImage.disabled = e.target.checked;
        });
        
        // 移除选项按钮事件
        this.textOptionsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-option')) {
                this.removeOption(e.target, this.textOptionsContainer);
                this.updateCorrectAnswerCheckboxes('text');
            }
        });
        
        this.imageOptionsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-option')) {
                this.removeOption(e.target, this.imageOptionsContainer);
                this.updateCorrectAnswerCheckboxes('image');
            }
        });
        
        // 文字选项输入时更新正确答案复选框
        this.textOptionsContainer.addEventListener('input', (e) => {
            if (e.target.classList.contains('option-text')) {
                this.updateCorrectAnswerCheckboxes('text');
            }
        });
        
        // 图片选项变化时更新正确答案复选框
        this.imageOptionsContainer.addEventListener('change', (e) => {
            if (e.target.classList.contains('option-image')) {
                this.updateCorrectAnswerCheckboxes('image');
            }
        });
        
        // 初始更新正确答案复选框
        this.updateCorrectAnswerCheckboxes('text');
    }
    
    /**
     * 显示指定屏幕
     * @param {HTMLElement} screen - 要显示的屏幕元素
     */
    showScreen(screen) {
        // 隐藏所有屏幕
        [this.startScreen, this.quizScreen, this.resultScreen, this.createQuestionScreen].forEach(s => {
            s.classList.remove('active');
        });
        // 显示目标屏幕
        screen.classList.add('active');
    }
    
    /**
     * 显示创建问题屏幕
     */
    showCreateQuestionScreen() {
        this.showScreen(this.createQuestionScreen);
    }
    
    /**
     * 显示结果屏幕
     */
    showResultScreen() {
        this.showScreen(this.resultScreen);
    }
    
    /**
     * 开始游戏
     * 重置游戏状态，显示答题界面，加载第一题
     */
    async startGame() {
        this.currentQuestion = 0;
        this.correctCount = 0;
        this.answered = false;
        this.userChoicesMap = {};

        // 显示加载中状态
        this.optionsContainer.innerHTML = '<p style="text-align: center; color: #666;">正在加载题库...</p>';
        this.showScreen(this.quizScreen);

        // 根据用户是否玩过游戏决定题目选择策略
        if (WorldCupQuizData.hasPlayedBefore()) {
            // 老玩家：异步获取并随机选择10道题
            this.quizQuestions = await WorldCupQuizData.getRandomQuestionsAsync(10);
        } else {
            // 新玩家：使用有序的默认10道题
            this.quizQuestions = WorldCupQuizData.getOrderedQuestions();
        }

        this.loadQuestion();
    }

    /**
     * 重新开始游戏
     * 调用startGame方法
     */
    restartGame() {
        this.startGame();
    }
    
    /**
     * 加载题目
     * 根据当前题目索引加载题目内容、图片和选项
     */
    loadQuestion() {
        this.answered = false;
        const q = this.quizQuestions[this.currentQuestion];
        
        // 更新题目计数器和进度条
        this.currentQuestionEl.textContent = this.currentQuestion + 1;
        this.totalQuestionsEl.textContent = this.quizQuestions.length;
        this.progressFill.style.width = `${((this.currentQuestion + 1) / this.quizQuestions.length) * 100}%`;
        
        // 加载题目图片和文本
        const imageContainer = document.getElementById('image-container');
        if (q.image && q.type !== "image") {
            this.questionImage.src = q.image;
            this.questionImage.alt = "世界杯经典瞬间";
            this.questionImage.style.display = 'block';
            imageContainer.style.display = 'flex';
        } else {
            this.questionImage.style.display = 'none';
            imageContainer.style.display = 'none';
        }
        this.questionText.textContent = q.question;
        
        // 生成选项
        this.optionsContainer.innerHTML = '';
        q.options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            
            if (q.type === "image") {
                // 图片选择题：选项是图片
                const img = document.createElement('img');
                img.src = option;
                img.alt = `选项 ${index + 1}`;
                img.style.width = '100%';
                img.style.height = 'auto';
                img.style.borderRadius = '8px';
                btn.appendChild(img);
                btn.style.textAlign = 'center';
                btn.style.padding = '10px';
            } else {
                // 普通选择题：选项是文本
                btn.textContent = option;
            }
            
            btn.addEventListener('click', () => this.selectOption(index));
            this.optionsContainer.appendChild(btn);
        });
    }
    
    /**
     * 选择选项
     * @param {number} index - 选择的选项索引
     * 处理用户选择，判断是否正确，显示结果，进入下一题或结束游戏
     */
    selectOption(index) {
        if (this.answered) return;  // 防止重复点击
        this.answered = true;
        
        const q = this.quizQuestions[this.currentQuestion];
        const buttons = this.optionsContainer.querySelectorAll('.option-btn');
        
        // 记录用户选择（使用问题ID作为键）
        if (q.id) {
            this.userChoicesMap[q.id] = index;
        }
        
        // 处理选项状态
        buttons.forEach((btn, i) => {
            btn.disabled = true;  // 禁用所有选项
            if (i === index) {  // 只处理用户选择的选项
                if (q.correct.includes(index)) {
                    btn.classList.add('correct');  // 正确选项
                } else {
                    btn.classList.add('wrong');  // 错误选项
                }
            }
        });
        
        // 统计正确答题数
        if (q.correct.includes(index)) {
            this.correctCount++;
        }
        
        // 延迟1.5秒后进入下一题或显示结果
        setTimeout(() => {
            this.currentQuestion++;
            if (this.currentQuestion < this.quizQuestions.length) {
                this.loadQuestion();  // 加载下一题
            } else {
                this.showResult();  // 显示结果
            }
        }, 1500);
    }
    
    /**
     * 显示结果
     * 计算正确率，确定评级，显示结果界面
     */
    showResult() {
        // 计算正确率
        const accuracy = Math.round((this.correctCount / this.quizQuestions.length) * 100);
        
        // 更新结果数据
        this.correctCountEl.textContent = `${this.correctCount}/${this.quizQuestions.length}`;
        this.finalAccuracyEl.textContent = `${accuracy}%`;
        
        // 确定评级
        let rank = ranks[ranks.length - 1];  // 默认最低评级
        for (let i = 0; i < ranks.length; i++) {
            if (accuracy >= ranks[i].min) {
                rank = ranks[i];
                break;
            }
        }
        
        // 更新评级显示
        this.resultIcon.textContent = rank.icon;
        this.rankValueEl.textContent = rank.rank;
        this.resultDescEl.textContent = rank.desc;
        
        // 检查隐藏成就
        this.checkHiddenAchievement();
        
        // 标记用户已经玩过游戏（用于下次区分新老玩家）
        WorldCupQuizData.markAsPlayed();
        
        // 显示结果界面
        this.showScreen(this.resultScreen);
    }
    
    /**
     * 检查隐藏成就
     * 根据用户选择判断是否解锁隐藏成就
     */
    checkHiddenAchievement() {
        const unlockedAchievements = [];
        
        for (const achievement of hiddenAchievements) {
            if (achievement.check(this.userChoicesMap)) {
                unlockedAchievements.push(achievement);
            }
        }
        
        if (unlockedAchievements.length > 0) {
            this.achievementContainer.style.display = 'block';
            // 显示所有解锁的成就
            const achievementHTML = unlockedAchievements.map(a => `
                <div class="achievement-item">
                    <span class="achievement-icon">${a.icon}</span>
                    <span class="achievement-name">${a.name}</span>
                </div>
                <p class="achievement-desc">${a.desc}</p>
            `).join('<hr style="border: none; border-top: 1px solid #f0c14b; margin: 15px 0;">');
            
            this.achievementContainer.innerHTML = achievementHTML;
        } else {
            this.achievementContainer.style.display = 'none';
        }
    }
    
    /**
     * 切换问题类型
     * @param {string} type - 问题类型：text 或 image
     */
    switchQuestionType(type) {
        if (type === 'text') {
            this.textQuestionForm.style.display = 'block';
            this.imageQuestionForm.style.display = 'none';
            this.updateCorrectAnswerCheckboxes('text');
        } else {
            this.textQuestionForm.style.display = 'none';
            this.imageQuestionForm.style.display = 'block';
            this.updateCorrectAnswerCheckboxes('image');
        }
    }
    
    /**
     * 更新正确答案复选框
     * @param {string} type - 问题类型：text 或 image
     */
    updateCorrectAnswerCheckboxes(type) {
        const container = type === 'text' ? this.textCorrectAnswers : this.imageCorrectAnswers;
        const optionsContainer = type === 'text' ? this.textOptionsContainer : this.imageOptionsContainer;
        const options = optionsContainer.querySelectorAll('.option-input');
        
        // 保存当前选中的正确答案索引
        const checkedIndices = Array.from(container.querySelectorAll('input[name="' + type + '-correct"]:checked'))
            .map(input => parseInt(input.value));
        
        container.innerHTML = '';
        
        options.forEach((option, index) => {
            const input = option.querySelector(type === 'text' ? '.option-text' : '.option-image');
            const value = type === 'text' ? input.value || `选项 ${index + 1}` : `选项 ${index + 1}`;
            const isChecked = checkedIndices.includes(index);
            
            const item = document.createElement('div');
            item.className = 'correct-answer-item';
            item.innerHTML = `
                <input type="checkbox" id="${type}-correct-${index}" name="${type}-correct" value="${index}" ${isChecked ? 'checked' : ''}>
                <label for="${type}-correct-${index}">${value}</label>
            `;
            container.appendChild(item);
        });
    }
    
    /**
     * 添加文本选项
     */
    addTextOption() {
        const optionCount = this.textOptionsContainer.querySelectorAll('.option-input').length + 1;
        const optionInput = document.createElement('div');
        optionInput.className = 'option-input';
        optionInput.innerHTML = `
            <input type="text" class="option-text" placeholder="选项 ${optionCount}" required>
            <button type="button" class="remove-option">×</button>
        `;
        this.textOptionsContainer.appendChild(optionInput);
        this.updateCorrectAnswerCheckboxes('text');
    }
    
    /**
     * 添加图片选项
     */
    addImageOption() {
        const optionCount = this.imageOptionsContainer.querySelectorAll('.option-input').length + 1;
        const optionInput = document.createElement('div');
        optionInput.className = 'option-input';
        optionInput.innerHTML = `
            <input type="file" class="option-image" accept="image/*" required>
            <button type="button" class="remove-option">×</button>
        `;
        this.imageOptionsContainer.appendChild(optionInput);
        this.updateCorrectAnswerCheckboxes('image');
    }
    
    /**
     * 移除选项
     * @param {HTMLElement} button - 移除按钮
     * @param {HTMLElement} container - 选项容器
     */
    removeOption(button, container) {
        const optionInputs = container.querySelectorAll('.option-input');
        if (optionInputs.length > 2) {
            button.parentElement.remove();
        } else {
            alert('至少需要2个选项');
        }
    }
    
    /**
     * 将文件转换为Base64
     * @param {File} file - 文件对象
     * @returns {Promise<string>} Base64字符串
     */
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    }
    
    /**
     * 保存问题
     */
    async saveQuestion() {
        const selectedType = document.querySelector('input[name="question-type"]:checked').value;
        
        if (selectedType === 'text') {
            // 文字选择题
            const questionText = this.textQuestion.value.trim();
            const hasImage = !this.noImageCheckbox.checked;
            const questionImage = hasImage ? this.textQuestionImage.files[0] : null;
            const textOptions = Array.from(this.textOptionsContainer.querySelectorAll('.option-text')).map(input => input.value.trim());
            
            // 获取选中的正确答案
            const selectedCorrectAnswers = Array.from(document.querySelectorAll('input[name="text-correct"]:checked'))
                .map(input => parseInt(input.value));
            
            if (!questionText) {
                alert('请输入问题');
                return;
            }
            
            if (textOptions.some(option => !option)) {
                alert('请填写所有选项');
                return;
            }
            
            if (selectedCorrectAnswers.length === 0) {
                alert('请至少选择一个正确答案');
                return;
            }
            
            let imageBase64 = null;
            if (hasImage && questionImage) {
                imageBase64 = await this.fileToBase64(questionImage);
            }
            
            const newQuestion = {
                image: imageBase64,
                question: questionText,
                options: textOptions,
                correct: selectedCorrectAnswers
            };

            // 保存到线上共享题库
            const result = await WorldCupQuizData.saveUserQuestion(newQuestion);

            if (result.local) {
                alert('无法连接到线上题库，问题已保存到本地');
            } else {
                alert('问题已保存到线上共享题库！');
            }

            // 重新加载问题
            location.reload();

        } else {
            // 图片选择题
            const questionText = document.getElementById('image-question').value.trim();
            const imageOptions = Array.from(this.imageOptionsContainer.querySelectorAll('.option-image')).map(input => input.files[0]);
            
            // 获取选中的正确答案
            const selectedCorrectAnswers = Array.from(document.querySelectorAll('input[name="image-correct"]:checked'))
                .map(input => parseInt(input.value));
            
            if (!questionText) {
                alert('请输入问题');
                return;
            }
            
            if (imageOptions.some(file => !file)) {
                alert('请上传所有图片选项');
                return;
            }
            
            if (selectedCorrectAnswers.length === 0) {
                alert('请至少选择一个正确答案');
                return;
            }
            
            // 转换所有图片为Base64
            const imageBase64s = await Promise.all(imageOptions.map(file => this.fileToBase64(file)));
            
            const newQuestion = {
                question: questionText,
                options: imageBase64s,
                correct: selectedCorrectAnswers,
                type: 'image'
            };

            // 保存到线上共享题库
            const result = await WorldCupQuizData.saveUserQuestion(newQuestion);

            if (result.local) {
                alert('无法连接到线上题库，问题已保存到本地');
            } else {
                alert('问题已保存到线上共享题库！');
            }

            // 重新加载问题
            location.reload();
        }
    }
}

/**
 * 页面加载完成后初始化游戏
 */
window.addEventListener('DOMContentLoaded', () => {
    new WorldCupQuiz();
});