// قائمة الأسماء المسموحة
const ALLOWED_NAMES = ['أيوب', 'ميس', 'ريان', 'جبار', 'عبدالله'];

// التحقق من الدخول
async function login() {
    const usernameInput = document.getElementById('username');
    const errorElement = document.getElementById('error');
    const username = usernameInput.value.trim();
    
    // التحقق من الاسم
    if (!ALLOWED_NAMES.includes(username)) {
        errorElement.textContent = '❌ هذا الاسم غير مسموح به';
        return;
    }
    
    // حفظ الاسم
    localStorage.setItem('chat_username', username);
    
    // حفظ معلومات المتصفح
    await saveBrowserInfo(username);
    
    // الانتقال للمحادثة
    window.location.href = 'chat.html';
}

// التحقق تلقائياً عند الضغط على Enter
document.getElementById('username')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') login();
});

// التحقق من تسجيل الدخول عند تحميل الصفحة
if (window.location.pathname.includes('chat.html')) {
    const username = localStorage.getItem('chat_username');
    if (!username || !ALLOWED_NAMES.includes(username)) {
        window.location.href = 'index.html';
    }
}