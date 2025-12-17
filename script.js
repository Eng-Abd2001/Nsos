// بيانات الموقع مع فلترة متقدمة
let messages = [
    {
        id: 1,
        text: "اليوم سيكون يومك المفضل! ابتسم وانسى الهموم 🌈",
        mood: "happy",
        date: "قبل ساعة",
        filtered: false
    },
    {
        id: 2,
        text: "لماذا تخاف القطط من الماء؟ لأنهم يعرفون أنهم سيصبحون 'قط-طواف'! 😹",
        mood: "funny",
        date: "قبل 3 ساعات",
        filtered: false
    },
    {
        id: 3,
        text: "أنت أقوى مما تتصور. كل خطوة صغيرة تقودك إلى نجاح كبير! 💪",
        mood: "encouraging",
        date: "أمس",
        filtered: false
    },
    {
        id: 4,
        text: "إذا كانت السعادة قطة، فأنت قطعًا صندوق الكرتون المفضل لديها! 🐱📦",
        mood: "cute",
        date: "قبل يومين",
        filtered: false
    }
];

let stats = {
    totalMessages: 1234,
    countries: 42,
    filteredMessages: 0
};

let currentMood = "happy";
let soundEnabled = false; // الأصوات متوقفة افتراضيًا

// نظام الفلترة المتقدم
const badWordsFilter = {
    // قائمة الكلمات غير المناسبة باللغة العربية
    badWords: [
        "كلمة سيئة 1", "كلمة سيئة 2", "سب", "شتم", "إهانة", "تخريب",
        "كراهية", "تحريض", "عنصرية", "تمييز", "إساءة"
    ],
    
    // الكلمات الإيجابية التي تشجع على استخدامها
    goodWords: [
        "حب", "سلام", "سعادة", "نجاح", "تفاؤل", "أمل",
        "تشجيع", "دعم", "ابتسامة", "فرح", "نجاح", "طموح"
    ],
    
    // فلترة الرسالة
    filterMessage: function(text) {
        let originalText = text;
        let filtered = false;
        let warningLevel = 0;
        
        // التحقق من وجود كلمات سيئة
        this.badWords.forEach(word => {
            if (text.includes(word)) {
                warningLevel += 2;
                filtered = true;
            }
        });
        
        // التحقق من الرسائل القصيرة جدًا
        if (text.trim().length < 5) {
            warningLevel += 1;
        }
        
        // التحقق من الرسائل السلبية (تحتوي على كلمات سلبية)
        const negativeWords = ["ممل", "سيء", "كراهية", "حقد", "غضب", "حزن"];
        negativeWords.forEach(word => {
            if (text.includes(word)) {
                warningLevel += 1;
            }
        });
        
        // التحقق من الرسائل الإيجابية
        let positiveScore = 0;
        this.goodWords.forEach(word => {
            if (text.includes(word)) {
                positiveScore += 1;
            }
        });
        
        // الموازنة بين الإيجابية والتحذيرات
        warningLevel = Math.max(0, warningLevel - positiveScore);
        
        // إذا كان مستوى التحذير مرتفعًا، نرفض الرسالة
        if (warningLevel >= 3) {
            return {
                filtered: true,
                text: "⚠️ هذه الرسالة لا تناسب روح الموقع. الرجاء كتابة رسالة إيجابية!",
                warning: "عالية"
            };
        } else if (filtered) {
            // إذا كانت هناك كلمات غير مناسبة، نستبدل الرسالة
            return {
                filtered: true,
                text: "🌈 هذه الزجاجة تحتوي على رسالة إيجابية ومشجعة!",
                warning: "متوسطة"
            };
        }
        
        return {
            filtered: false,
            text: originalText,
            warning: "منخفضة"
        };
    },
    
    // تحسين النص تلقائيًا
    enhanceMessage: function(text) {
        let enhanced = text;
        
        // إضافة إيموجي تلقائي حسب المزاج
        if (text.includes("سعيد") || text.includes("فرح")) {
            enhanced = "😊 " + enhanced;
        }
        
        if (text.includes("ضحك") || text.includes("طرفة")) {
            enhanced = "😂 " + enhanced;
        }
        
        if (text.includes("نجاح") || text.includes("تحدي")) {
            enhanced = "💪 " + enhanced;
        }
        
        // إضافة نقطة في النهاية إذا لم تكن موجودة
        if (!/[.!؟]$/.test(enhanced.trim())) {
            enhanced = enhanced.trim() + " ❤️";
        }
        
        return enhanced;
    }
};

// عناصر DOM
const writeBtn = document.getElementById('writeBtn');
const catchBtn = document.getElementById('catchBtn');
const sendBtn = document.getElementById('sendBtn');
const messageInput = document.getElementById('messageInput');
const charCount = document.getElementById('charCount');
const moodButtons = document.querySelectorAll('.mood-btn');
const writeMessage = document.getElementById('writeMessage');
const messageDisplay = document.getElementById('messageDisplay');
const confirmation = document.getElementById('confirmation');
const receivedMessage = document.getElementById('receivedMessage');
const messageMood = document.getElementById('messageMood');
const messageDate = document.getElementById('messageDate');
const messageFiltered = document.getElementById('messageFiltered');
const closeMessage = document.getElementById('closeMessage');
const replyBtn = document.getElementById('replyBtn');
const newBottleBtn = document.getElementById('newBottleBtn');
const continueBtn = document.getElementById('continueBtn');
const filterAlert = document.getElementById('filterAlert');
const closeAlert = document.getElementById('closeAlert');
const filterStats = document.getElementById('filterStats');
const shareBtn = document.getElementById('shareBtn');
const themeBtn = document.getElementById('themeBtn');
const soundToggle = document.getElementById('soundToggle');
const waveSound = document.getElementById('waveSound');
const bottleSound = document.getElementById('bottleSound');
const alertSound = document.getElementById('alertSound');

// تحديث العداد
function updateCharCount() {
    const length = messageInput.value.length;
    charCount.textContent = `${length}/300`;
    
    if (length > 250) {
        charCount.style.color = '#E74C3C';
    } else if (length > 200) {
        charCount.style.color = '#E67E22';
    } else {
        charCount.style.color = '#7F8C8D';
    }
}

// تحديث الإحصائيات
function updateStats() {
    document.getElementById('totalMessages').textContent = stats.totalMessages.toLocaleString();
    document.getElementById('countries').textContent = stats.countries;
    document.getElementById('filtered').textContent = stats.filteredMessages;
    filterStats.textContent = `${stats.filteredMessages} رسائل تمت فلترتها`;
}

// تشغيل الصوت (إذا كان مفعل)
function playSound(sound) {
    if (!soundEnabled) return;
    
    sound.currentTime = 0;
    sound.play().catch(e => console.log("الصوت غير متاح"));
}

// إظهار القسم المحدد وإخفاء الآخرين
function showSection(sectionToShow) {
    const sections = [writeMessage, messageDisplay, confirmation];
    sections.forEach(section => {
        if (section === sectionToShow) {
            section.classList.remove('hidden');
        } else {
            section.classList.add('hidden');
        }
    });
}

// الحصول على مزاج
function getMoodEmoji(mood) {
    const moods = {
        happy: "😊",
        funny: "😂",
        encouraging: "💪",
        cute: "🐱"
    };
    return moods[mood] || "😊";
}

// إظهار/إخفاء تنبيه الفلترة
function showFilterAlert(show) {
    if (show) {
        filterAlert.classList.remove('hidden');
        playSound(alertSound);
    } else {
        filterAlert.classList.add('hidden');
    }
}

// كتابة رسالة
writeBtn.addEventListener('click', () => {
    showSection(writeMessage);
    messageInput.focus();
    playSound(waveSound);
    
    // إخفاء تنبيه الفلترة إذا كان ظاهرًا
    showFilterAlert(false);
});

// اصطياد زجاجة
catchBtn.addEventListener('click', () => {
    if (messages.length === 0) {
        alert('لا توجد زجاجات في البحر حالياً! كن أول من يلقي زجاجة 🌊');
        showSection(writeMessage);
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * messages.length);
    const message = messages[randomIndex];
    
    receivedMessage.textContent = message.text;
    messageMood.textContent = getMoodEmoji(message.mood);
    messageDate.textContent = message.date;
    
    // إظهار علامة الفلترة إذا كانت الرسالة مفلترة
    if (message.filtered) {
        messageFiltered.classList.remove('hidden');
    } else {
        messageFiltered.classList.add('hidden');
    }
    
    showSection(messageDisplay);
    playSound(bottleSound);
    
    // زيادة الإحصائيات
    stats.totalMessages += Math.floor(Math.random() * 3) + 1;
    updateStats();
});

// إرسال رسالة مع الفلترة
sendBtn.addEventListener('click', () => {
    const messageText = messageInput.value.trim();
    
    if (messageText.length < 5) {
        alert('الرجاء كتابة رسالة أطول قليلاً! (5 أحرف على الأقل)');
        return;
    }
    
    if (messageText.length > 300) {
        alert('الرسالة طويلة جداً! الحد الأقصى 300 حرف');
        return;
    }
    
    // تطبيق الفلترة
    const filteredResult = badWordsFilter.filterMessage(messageText);
    
    if (filteredResult.filtered && filteredResult.warning === "عالية") {
        // إذا كانت الرسالة غير مناسبة بشكل كبير
        showFilterAlert(true);
        return;
    }
    
    // تحسين الرسالة تلقائيًا
    const enhancedText = badWordsFilter.enhanceMessage(
        filteredResult.filtered ? filteredResult.text : messageText
    );
    
    // إنشاء رسالة جديدة
    const newMessage = {
        id: messages.length + 1,
        text: enhancedText,
        mood: currentMood,
        date: "الآن",
        filtered: filteredResult.filtered
    };
    
    // إضافة للرسائل
    messages.unshift(newMessage);
    
    // تحديث الإحصائيات
    stats.totalMessages += 1;
    if (filteredResult.filtered) {
        stats.filteredMessages += 1;
    }
    
    // زيادة عدد الدول عشوائيًا
    if (Math.random() > 0.7) {
        stats.countries += 1;
    }
    
    updateStats();
    
    // إظهار تأكيد
    showSection(confirmation);
    
    // إعادة تعيين الحقول
    messageInput.value = '';
    updateCharCount();
    
    playSound(bottleSound);
});

// رد على الرسالة
replyBtn.addEventListener('click', () => {
    showSection(writeMessage);
});

// زجاجة جديدة
newBottleBtn.addEventListener('click', () => {
    catchBtn.click();
});

// إغلاق الرسالة
closeMessage.addEventListener('click', () => {
    showSection(writeMessage);
});

// إغلاق تنبيه الفلترة
closeAlert.addEventListener('click', () => {
    showFilterAlert(false);
});

// متابعة بعد التأكيد
continueBtn.addEventListener('click', () => {
    showSection(writeMessage);
});

// اختيار المزاج
moodButtons.forEach(button => {
    button.addEventListener('click', () => {
        moodButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentMood = button.dataset.mood;
    });
});

// مشاركة الموقع
shareBtn.addEventListener('click', () => {
    if (navigator.share) {
        navigator.share({
            title: 'زجاجات رقمية',
            text: 'شارك السعادة! أرسل رسائل لطيفة في زجاجات رقمية 🌊',
            url: window.location.href
        });
    } else {
        alert('انسخ الرابط: ' + window.location.href);
    }
});

// تغيير السمة
themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const icon = themeBtn.querySelector('i');
    if (document.body.classList.contains('dark-mode')) {
        icon.className = 'fas fa-sun';
        themeBtn.innerHTML = '<i class="fas fa-sun"></i> الوضع النهاري';
    } else {
        icon.className = 'fas fa-moon';
        themeBtn.innerHTML = '<i class="fas fa-moon"></i> الوضع الليلي';
    }
});

// تبديل الأصوات
soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    const icon = soundToggle.querySelector('i');
    
    if (soundEnabled) {
        icon.className = 'fas fa-volume-up';
        soundToggle.innerHTML = '<i class="fas fa-volume-up"></i> إيقاف الأصوات';
        // تشغيل صوت تجريبي
        playSound(waveSound);
    } else {
        icon.className = 'fas fa-volume-mute';
        soundToggle.innerHTML = '<i class="fas fa-volume-mute"></i> تشغيل الأصوات';
    }
});

// تفاعل الزجاجات العائمة
document.querySelectorAll('.bottle').forEach(bottle => {
    bottle.addEventListener('click', () => {
        bottle.style.animation = 'none';
        bottle.style.transform = 'scale(1.5)';
        playSound(bottleSound);
        
        setTimeout(() => {
            bottle.style.animation = '';
            bottle.style.transform = '';
        }, 500);
        
        catchBtn.click();
    });
});

// الكلمات التلقائية للرسالة (محسنة)
const sampleMessages = [
    "أنت رائع كما أنت! لا تحتاج إلى أن تكون مثاليًا لتكون محبوبًا ❤️",
    "اليوم وجدت قطعة شوكولاتة في جيبي! أتمنى أن يكون يومك حلوًا مثله 🍫",
    "الضحكة التي تظهر على وجهك هي أجمل شيء في هذا الكون! حافظ عليها 😄",
    "أحيانًا نحتاج فقط إلى نفس عميق وكوب شاي دافئ ☕",
    "أنت مثل النجم: حتى عندما لا يُرى، أنت موجود وتضيء 🌟",
    "شارك ابتسامتك مع العالم، فهي قد تكون سبب سعادة شخص ما اليوم! 😊",
    "كل صباح فرصة جديدة لتبدأ من حيث توقفت بالأمس 🌅",
    "الطريق إلى النجاح مليء بالتحديات، لكنك قادر على تخطيها جميعًا! 💪"
];

// زر للكتابة التلقائية
messageInput.addEventListener('focus', () => {
    if (!messageInput.value) {
        messageInput.placeholder = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
    }
});

// تحديث العداد أثناء الكتابة
messageInput.addEventListener('input', updateCharCount);

// فلترة تلقائية أثناء الكتابة (ذكية)
messageInput.addEventListener('input', function() {
    const text = this.value;
    
    // فلترة بسيطة أثناء الكتابة
    const badWordsRegex = /(كلمة سيئة|سب|شتم)/gi;
    if (badWordsRegex.test(text)) {
        this.style.borderColor = '#FF6B6B';
        this.style.boxShadow = '0 0 0 2px rgba(255, 107, 107, 0.2)';
    } else {
        this.style.borderColor = '#E0E0E0';
        this.style.boxShadow = 'none';
    }
});

// تهيئة الموقع
document.addEventListener('DOMContentLoaded', () => {
    updateStats();
    updateCharCount();
    
    // اختيار مزاج افتراضي
    moodButtons[0].classList.add('active');
    
    // عرض رسالة ترحيبية ذكية
    setTimeout(() => {
        const welcomeMessages = [
            "مرحباً بك! شاركنا في نشر الإيجابية والفرح 🌊",
            "كل رسالة إيجابية تساهم في جعل العالم مكانًا أفضل 🌍",
            "ساعدنا في إسعاد قلوب الناس برسائل جميلة ومشجعة 😊"
        ];
        
        // عرض رسالة عشوائية فقط 30% من المرات
        if (Math.random() < 0.3) {
            alert(welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)]);
        }
    }, 2000);
    
    // إضافة بعض الرسائل المفترضة بعد التحميل
    setTimeout(() => {
        messages.push({
            id: messages.length + 1,
            text: "لا تيأس أبدًا، فالشمس تشرق حتى بعد أظلم الليالي ☀️",
            mood: "encouraging",
            date: "قبل 10 دقائق",
            filtered: false
        });
        
        messages.push({
            id: messages.length + 1,
            text: "ابتسم، فالابتسامة معدية وتجعل يوم الجميع أفضل! 😄",
            mood: "happy",
            date: "قبل 30 دقيقة",
            filtered: false
        });
    }, 3000);
});

// تأثيرات بصرية محسنة
document.addEventListener('mousemove', (e) => {
    // إنشاء فقاعات عند تحريك الماوس (بشكل أقل)
    if (Math.random() > 0.98) {
        createBubble(e.clientX, e.clientY);
    }
});

function createBubble(x, y) {
    const bubble = document.createElement('div');
    const emojis = ['💧', '✨', '🌟', '💫', '🌊'];
    bubble.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
    
    bubble.style.position = 'fixed';
    bubble.style.left = x + 'px';
    bubble.style.top = y + 'px';
    bubble.style.fontSize = (Math.random() * 20 + 10) + 'px';
    bubble.style.opacity = '0.7';
    bubble.style.pointerEvents = 'none';
    bubble.style.zIndex = '-1';
    bubble.style.animation = `floatUp ${Math.random() * 2 + 1}s ease-out forwards`;
    
    document.body.appendChild(bubble);
    
    setTimeout(() => {
        bubble.remove();
    }, 1000);
}

// إضافة أنيميشن للفقاعات
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% {
            transform: translateY(0) scale(1);
            opacity: 0.7;
        }
        100% {
            transform: translateY(-100px) scale(0.5);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// نظام الذكاء الاصطناعي البسيط للاقتراحات
function getSmartSuggestion() {
    const suggestions = {
        happy: [
            "شارك شيئًا جميلًا حدث معك اليوم!",
            "ما أجمل ذكرى تود مشاركتها مع الآخرين؟",
            "اكتب دعاءً جميلًا لشخص لا تعرفه"
        ],
        funny: [
            "ما هي الطرفة التي تضحكك دائمًا؟",
            "شارك موقفًا طريفًا حدث معك",
            "ما هو أفضل نكتة تعرفها؟"
        ],
        encouraging: [
            "ما هي النصيحة التي تود أن تعطيها لشخص يحاول النجاح؟",
            "اكتب جملة تحفيزية لطالب في الامتحانات",
            "شجع شخصًا على متابعة حلمه"
        ],
        cute: [
            "ما هو الشيء اللطيف الذي رأيته اليوم؟",
            "صف حيوانك الأليف المفضل بطريقة مضحكة",
            "ما هو الشيء الصغير الذي يجعلك سعيدًا؟"
        ]
    };
    
    return suggestions[currentMood]?.[Math.floor(Math.random() * suggestions[currentMood].length)] || 
           "اكتب رسالة تجعل شخصًا ما يبتسم اليوم!";
}

// تحديث الاقتراحات عند تغيير المزاج
moodButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (!messageInput.value) {
            messageInput.placeholder = getSmartSuggestion();
        }
    });
});