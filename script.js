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

// 翻译文本映射
const i18n = {
    zh: {
        title: '世界杯经典瞬间',
        subtitle: '10道题决定你的世界杯观赛席位',
        startBtn: '游戏开始',
        resultTitle: '评测结果',
        correctCount: '正确题数',
        accuracy: '正确率',
        yourRank: '你的评级',
        playAgain: '再玩一次',
        createQuestion: '创建问题',
        createTitle: '创建问题',
        createSubtitle: '分享你的世界杯回忆，创建新的问题',
        selectType: '选择问题类型',
        textQuestion: '文字选择题',
        imageQuestion: '图片选择题',
        textFormTitle: '文字选择题',
        imageFormTitle: '图片选择题',
        question: '问题',
        questionImage: '问题配图',
        noImage: '无配图',
        options: '选项',
        addOption: '+ 添加选项',
        correctAnswer: '正确答案',
        imageOptions: '图片选项',
        cancel: '取消',
        saveQuestion: '保存问题',
        loadingQuestions: '正在加载题库...',
        enterQuestion: '请输入问题...',
        alertEnterQuestion: '请输入问题',
        alertFillAllOptions: '请填写所有选项',
        alertSelectCorrect: '请至少选择一个正确答案',
        alertUploadImages: '请上传所有图片选项',
        alertCannotConnectCloud: '无法连接到线上题库，问题已保存到本地',
        alertSavedToCloud: '问题已保存到线上共享题库！',
        minTwoOptions: '至少需要2个选项'
    },
    en: {
        title: 'World Cup Classic Moments',
        subtitle: '10 questions determine your World Cup seating',
        startBtn: 'Start Game',
        resultTitle: 'Quiz Results',
        correctCount: 'Correct',
        accuracy: 'Accuracy',
        yourRank: 'Your Rating',
        playAgain: 'Play Again',
        createQuestion: 'Create Question',
        createTitle: 'Create Question',
        createSubtitle: 'Share your World Cup memories, create new questions',
        selectType: 'Select Question Type',
        textQuestion: 'Text Question',
        imageQuestion: 'Image Question',
        textFormTitle: 'Text Question',
        imageFormTitle: 'Image Question',
        question: 'Question',
        questionImage: 'Question Image',
        noImage: 'No Image',
        options: 'Options',
        addOption: '+ Add Option',
        correctAnswer: 'Correct Answer',
        imageOptions: 'Image Options',
        cancel: 'Cancel',
        saveQuestion: 'Save Question',
        loadingQuestions: 'Loading questions...',
        enterQuestion: 'Enter your question...',
        alertEnterQuestion: 'Please enter a question',
        alertFillAllOptions: 'Please fill in all options',
        alertSelectCorrect: 'Please select at least one correct answer',
        alertUploadImages: 'Please upload all image options',
        alertCannotConnectCloud: 'Cannot connect to online question bank, saved locally',
        alertSavedToCloud: 'Question saved to online shared question bank!',
        minTwoOptions: 'At least 2 options required'
    }
};

// 评级数据数组（双语）
const ranks = [
    { min: 100, rank: { zh: "教练席", en: "Coach's Box" }, icon: "⚽", desc: { zh: "你是真正的世界杯专家！对经典瞬间了如指掌，值得和主教练一起观赛！", en: "You are a true World Cup expert! You know all the classic moments, worthy of watching the game with the head coach!" } },
    { min: 80, rank: { zh: "VIP包厢", en: "VIP Box" }, icon: "⭐", desc: { zh: "你很熟悉世界杯，VIP包厢的位置让你不错过任何精彩瞬间！", en: "You are very familiar with the World Cup, the VIP box lets you not miss any exciting moments!" } },
    { min: 60, rank: { zh: "普通观众席", en: "Regular Seats" }, icon: "🙋", desc: { zh: "你对世界杯有一定了解，在观众席为心爱的球队呐喊吧！", en: "You have some understanding of the World Cup, cheer for your favorite team in the stands!" } },
    { min: 20, rank: { zh: "场外球迷区", en: "Outside Fan Zone" }, icon: "🍺", desc: { zh: "看来你错过了很多世界杯精彩时刻，在球场外围和球迷狂欢吧！", en: "Looks like you missed many exciting World Cup moments, party with fans outside the stadium!" } },
    { min: 0, rank: { zh: "家里蹲", en: "Home Watching" }, icon: "🏠", desc: { zh: "世界杯对你来说可能有点陌生？没关系，在家看直播也很不错哦！", en: "World Cup might be a bit unfamiliar to you? No problem, watching the live stream at home is also great!" } }
];

// 隐藏成就数组（双语）
const hiddenAchievements = [
    {
        name: { zh: "粤语解说达人", en: "Cantonese Commentator" },
        icon: "🏆",
        desc: { zh: "恭喜你！你是真正的粤语世界杯解说专家，对各位球星的粤语译名了如指掌！", en: "Congratulations! You are a true Cantonese commentary expert, familiar with all the players' Cantonese names!" },
        check: (userChoices, questions) => {
            return userChoices['Q002'] === 0 &&
                   userChoices['Q003'] === 0 &&
                   userChoices['Q004'] === 0 &&
                   userChoices['Q005'] === 2;
        }
    },
    {
        name: { zh: "真中国球迷", en: "Fan of Team China" },
        icon: "🇨🇳",
        desc: { zh: "为中国足球操碎了心！无论男女足，都永远支持中国足球！", en: "You deeply care about Chinese football! Support Chinese football always, both men's and women's teams!" },
        check: (userChoices, questions) => {
            return userChoices['Q009'] === 2 &&
                   userChoices['Q010'] === 2;
        }
    }
];

/**
 * 获取翻译文本
 */
function t(key) {
    const lang = WorldCupQuizData.getCurrentLanguage();
    return i18n[lang][key] || i18n.zh[key] || key;
}

/**
 * 获取双语文本的特定语言版本
 */
function getBilingualText(obj) {
    if (!obj) return '';
    const lang = WorldCupQuizData.getCurrentLanguage();
    if (typeof obj === 'string') return obj;
    return obj[lang] || obj.zh || '';
}

/**
 * 更新所有带 data-i18n 属性的元素的文本
 */
function updateI18nTexts() {
    const lang = WorldCupQuizData.getCurrentLanguage();
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (i18n[lang][key]) {
            el.textContent = i18n[lang][key];
        }
    });

    document.querySelectorAll('[data-placeholder-i18n]').forEach(el => {
        const key = el.getAttribute('data-placeholder-i18n');
        if (i18n[lang][key]) {
            el.placeholder = i18n[lang][key];
        }
    });

    const langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(btn => {
        btn.classList.remove('active');
        if ((btn.id === 'lang-zh' && lang === 'zh') || (btn.id === 'lang-en' && lang === 'en')) {
            btn.classList.add('active');
        }
    });
}

/**
 * WorldCupQuiz类 - 游戏主类
 * 负责游戏的初始化、事件绑定、题目加载、答题判断等核心功能
 */
class WorldCupQuiz {
    /**
     * 构造函数 - 初始化游戏状态
     */
    constructor() {
        this.currentQuestion = 0;
        this.correctCount = 0;
        this.answered = false;
        this.quizQuestions = [];
        this.userChoicesMap = {};
        
        this.initElements();
        this.bindEvents();
        this.initLanguage();
    }

    /**
     * 初始化语言设置
     */
    initLanguage() {
        const lang = WorldCupQuizData.getCurrentLanguage();
        document.getElementById('lang-zh').classList.toggle('active', lang === 'zh');
        document.getElementById('lang-en').classList.toggle('active', lang === 'en');
        updateI18nTexts();
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
     */
    bindEvents() {
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.getElementById('restart-btn').addEventListener('click', () => this.restartGame());
        document.getElementById('create-question-btn').addEventListener('click', () => this.showCreateQuestionScreen());
        document.getElementById('cancel-create').addEventListener('click', () => this.showResultScreen());
        document.getElementById('save-question').addEventListener('click', () => this.saveQuestion());
        document.getElementById('add-text-option').addEventListener('click', () => this.addTextOption());
        document.getElementById('add-image-option').addEventListener('click', () => this.addImageOption());

        // 语言切换
        document.getElementById('lang-zh').addEventListener('click', () => this.setLanguage('zh'));
        document.getElementById('lang-en').addEventListener('click', () => this.setLanguage('en'));
        
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
     * 设置语言
     */
    setLanguage(lang) {
        WorldCupQuizData.setCurrentLanguage(lang);
        document.getElementById('lang-zh').classList.toggle('active', lang === 'zh');
        document.getElementById('lang-en').classList.toggle('active', lang === 'en');
        updateI18nTexts();

        // 如果在答题或结果界面，需要重新渲染
        if (this.quizScreen.classList.contains('active')) {
            this.loadQuestion();
        } else if (this.resultScreen.classList.contains('active')) {
            this.showResult();
        }
    }
    
    /**
     * 显示指定屏幕
     */
    showScreen(screen) {
        [this.startScreen, this.quizScreen, this.resultScreen, this.createQuestionScreen].forEach(s => {
            s.classList.remove('active');
        });
        screen.classList.add('active');
    }
    
    /**
     * 显示创建问题屏幕
     */
    showCreateQuestionScreen() {
        updateI18nTexts();
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
     */
    async startGame() {
        this.currentQuestion = 0;
        this.correctCount = 0;
        this.answered = false;
        this.userChoicesMap = {};

        this.optionsContainer.innerHTML = `<p style="text-align: center; color: #666;">${t('loadingQuestions')}</p>`;
        this.showScreen(this.quizScreen);

        if (WorldCupQuizData.hasPlayedBefore()) {
            this.quizQuestions = await WorldCupQuizData.getRandomQuestionsAsync(10);
        } else {
            this.quizQuestions = WorldCupQuizData.getOrderedQuestions();
        }

        this.loadQuestion();
    }

    /**
     * 重新开始游戏
     */
    restartGame() {
        this.startGame();
    }
    
    /**
     * 加载题目
     */
    loadQuestion() {
        this.answered = false;
        const q = this.quizQuestions[this.currentQuestion];
        
        this.currentQuestionEl.textContent = this.currentQuestion + 1;
        this.totalQuestionsEl.textContent = this.quizQuestions.length;
        this.progressFill.style.width = `${((this.currentQuestion + 1) / this.quizQuestions.length) * 100}%`;
        
        const imageContainer = document.getElementById('image-container');
        if (q.image && q.type !== "image") {
            this.questionImage.src = q.image;
            this.questionImage.alt = getBilingualText({ zh: "世界杯经典瞬间", en: "World Cup Classic Moment" });
            this.questionImage.style.display = 'block';
            imageContainer.style.display = 'flex';
        } else {
            this.questionImage.style.display = 'none';
            imageContainer.style.display = 'none';
        }
        this.questionText.textContent = getBilingualText(q.question);
        
        this.optionsContainer.innerHTML = '';
        q.options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            
            if (q.type === "image") {
                const img = document.createElement('img');
                img.src = typeof option === 'string' ? option : (option.src || option);
                img.alt = `${t('options')} ${index + 1}`;
                img.style.width = '100%';
                img.style.height = 'auto';
                img.style.borderRadius = '8px';
                btn.appendChild(img);
                btn.style.textAlign = 'center';
                btn.style.padding = '10px';
            } else {
                btn.textContent = getBilingualText(option);
            }
            
            btn.addEventListener('click', () => this.selectOption(index));
            this.optionsContainer.appendChild(btn);
        });
    }
    
    /**
     * 选择选项
     */
    selectOption(index) {
        if (this.answered) return;
        this.answered = true;
        
        const q = this.quizQuestions[this.currentQuestion];
        const buttons = this.optionsContainer.querySelectorAll('.option-btn');
        
        if (q.id) {
            this.userChoicesMap[q.id] = index;
        }
        
        buttons.forEach((btn, i) => {
            btn.disabled = true;
            if (i === index) {
                if (q.correct.includes(index)) {
                    btn.classList.add('correct');
                } else {
                    btn.classList.add('wrong');
                }
            }
        });
        
        if (q.correct.includes(index)) {
            this.correctCount++;
        }
        
        setTimeout(() => {
            this.currentQuestion++;
            if (this.currentQuestion < this.quizQuestions.length) {
                this.loadQuestion();
            } else {
                this.showResult();
            }
        }, 1500);
    }
    
    /**
     * 显示结果
     */
    showResult() {
        const accuracy = Math.round((this.correctCount / this.quizQuestions.length) * 100);
        
        this.correctCountEl.textContent = `${this.correctCount}/${this.quizQuestions.length}`;
        this.finalAccuracyEl.textContent = `${accuracy}%`;
        
        let rank = ranks[ranks.length - 1];
        for (let i = 0; i < ranks.length; i++) {
            if (accuracy >= ranks[i].min) {
                rank = ranks[i];
                break;
            }
        }
        
        this.resultIcon.textContent = rank.icon;
        this.resultTitle.textContent = t('resultTitle');
        this.rankValueEl.textContent = getBilingualText(rank.rank);
        this.resultDescEl.textContent = getBilingualText(rank.desc);
        
        this.checkHiddenAchievement();
        
        WorldCupQuizData.markAsPlayed();
        
        this.showScreen(this.resultScreen);
    }
    
    /**
     * 检查隐藏成就
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
            const achievementHTML = unlockedAchievements.map(a => `
                <div class="achievement-item">
                    <span class="achievement-icon">${a.icon}</span>
                    <span class="achievement-name">${getBilingualText(a.name)}</span>
                </div>
                <p class="achievement-desc">${getBilingualText(a.desc)}</p>
            `).join('<hr style="border: none; border-top: 1px solid #f0c14b; margin: 15px 0;">');
            
            this.achievementContainer.innerHTML = achievementHTML;
        } else {
            this.achievementContainer.style.display = 'none';
        }
    }
    
    /**
     * 切换问题类型
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
     */
    updateCorrectAnswerCheckboxes(type) {
        const container = type === 'text' ? this.textCorrectAnswers : this.imageCorrectAnswers;
        const optionsContainer = type === 'text' ? this.textOptionsContainer : this.imageOptionsContainer;
        const options = optionsContainer.querySelectorAll('.option-input');
        
        const checkedIndices = Array.from(container.querySelectorAll(`input[name="${type}-correct"]:checked`))
            .map(input => parseInt(input.value));
        
        container.innerHTML = '';
        
        options.forEach((option, index) => {
            const input = option.querySelector(type === 'text' ? '.option-text' : '.option-image');
            const value = type === 'text' ? (input.value || `Option ${index + 1}`) : `${t('options')} ${index + 1}`;
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
        const lang = WorldCupQuizData.getCurrentLanguage();
        const optionCount = this.textOptionsContainer.querySelectorAll('.option-input').length + 1;
        const placeholder = lang === 'zh' ? `选项 ${optionCount}` : `Option ${optionCount}`;
        const optionInput = document.createElement('div');
        optionInput.className = 'option-input';
        optionInput.innerHTML = `
            <input type="text" class="option-text" placeholder="${placeholder}" required>
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
     */
    removeOption(button, container) {
        const optionInputs = container.querySelectorAll('.option-input');
        if (optionInputs.length > 2) {
            button.parentElement.remove();
        } else {
            alert(t('minTwoOptions'));
        }
    }
    
    /**
     * 将文件转换为Base64
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
            const questionText = this.textQuestion.value.trim();
            const hasImage = !this.noImageCheckbox.checked;
            const questionImage = hasImage ? this.textQuestionImage.files[0] : null;
            const textOptions = Array.from(this.textOptionsContainer.querySelectorAll('.option-text')).map(input => input.value.trim());
            
            const selectedCorrectAnswers = Array.from(document.querySelectorAll('input[name="text-correct"]:checked'))
                .map(input => parseInt(input.value));
            
            if (!questionText) {
                alert(t('alertEnterQuestion'));
                return;
            }
            
            if (textOptions.some(option => !option)) {
                alert(t('alertFillAllOptions'));
                return;
            }
            
            if (selectedCorrectAnswers.length === 0) {
                alert(t('alertSelectCorrect'));
                return;
            }
            
            let imageBase64 = null;
            if (hasImage && questionImage) {
                imageBase64 = await this.fileToBase64(questionImage);
            }

            const newQuestion = {
                image: imageBase64,
                question: { zh: questionText, en: questionText },
                options: textOptions.map(opt => ({ zh: opt, en: opt })),
                correct: selectedCorrectAnswers
            };

            const result = await WorldCupQuizData.saveUserQuestion(newQuestion);

            if (result.local) {
                alert(t('alertCannotConnectCloud'));
            } else {
                alert(t('alertSavedToCloud'));
            }

            location.reload();

        } else {
            const questionText = document.getElementById('image-question').value.trim();
            const imageOptions = Array.from(this.imageOptionsContainer.querySelectorAll('.option-image')).map(input => input.files[0]);
            
            const selectedCorrectAnswers = Array.from(document.querySelectorAll('input[name="image-correct"]:checked'))
                .map(input => parseInt(input.value));
            
            if (!questionText) {
                alert(t('alertEnterQuestion'));
                return;
            }
            
            if (imageOptions.some(file => !file)) {
                alert(t('alertUploadImages'));
                return;
            }
            
            if (selectedCorrectAnswers.length === 0) {
                alert(t('alertSelectCorrect'));
                return;
            }
            
            const imageBase64s = await Promise.all(imageOptions.map(file => this.fileToBase64(file)));
            
            const newQuestion = {
                question: { zh: questionText, en: questionText },
                options: imageBase64s,
                correct: selectedCorrectAnswers,
                type: 'image'
            };

            const result = await WorldCupQuizData.saveUserQuestion(newQuestion);

            if (result.local) {
                alert(t('alertCannotConnectCloud'));
            } else {
                alert(t('alertSavedToCloud'));
            }

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
