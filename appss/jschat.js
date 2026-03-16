// إعداد Supabase - استبدل بمعلوماتك الحقيقية
const SUPABASE_URL = 'https://ufgkypppgdktqxzwiuxa.supabase.co';
const SUPABASE_KEY = 'sb_publishable_bNldaEbt2ara2ehu7RZCtw_mafx2ftI'; // ضع مفتاح anon key هنا

// إنشاء العميل بشكل صحيح مع الإصدار 2
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// اسم المستخدم من التخزين المحلي
const username = localStorage.getItem('chat_username');
document.getElementById('currentUser').textContent = `👤 ${username}`;

// تحميل الرسائل
async function loadMessages() {
    const { data: messages, error } = await supabaseClient
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(50);

    if (error) {
        console.error('Error loading messages:', error);
        return;
    }

    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = '';

    messages.forEach(msg => {
        displayMessage(msg);
    });

    scrollToBottom();
}

// عرض رسالة
function displayMessage(msg) {
    const messagesDiv = document.getElementById('messages');
    const isOwn = msg.username === username;

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isOwn ? 'own' : ''}`;

    const time = new Date(msg.created_at).toLocaleTimeString('ar-SA', {
        hour: '2-digit',
        minute: '2-digit'
    });

    messageDiv.innerHTML = `
        <div class="message-author">${msg.username}</div>
        <div class="message-content">${escapeHtml(msg.content)}</div>
        <div class="message-time">${time}</div>
    `;

    messagesDiv.appendChild(messageDiv);
}

// إرسال رسالة
async function sendMessage() {
    const input = document.getElementById('messageInput');
    const content = input.value.trim();

    if (!content) return;

    const { error } = await supabaseClient
        .from('messages')
        .insert([{
            username: username,
            content: content
        }]);

    if (error) {
        console.error('Error sending message:', error);
        alert('حدث خطأ في إرسال الرسالة');
        return;
    }

    input.value = '';
}

// الاستماع للرسائل الجديدة (Realtime)
function subscribeToMessages() {
    supabaseClient
        .channel('messages')
        .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'messages' },
            (payload) => {
                displayMessage(payload.new);
                scrollToBottom();
            }
        )
        .subscribe();
}

// تمرير للأسفل
function scrollToBottom() {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// تخطي HTML لمنع XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// تسجيل الخروج
function logout() {
    localStorage.removeItem('chat_username');
    window.location.href = 'index.html';
}

// أحداث
document.getElementById('messageInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// التشغيل
loadMessages();
subscribeToMessages();
