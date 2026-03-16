// جمع معلومات المتصفح
async function collectBrowserInfo() {
    const info = {
        username: localStorage.getItem('chat_username') || 'unknown',
        ip: await getIP(),
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        referrer: document.referrer || 'direct',
        timestamp: new Date().toISOString(),
        page: window.location.href
    };
    
    return info;
}

// الحصول على IP
async function getIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (e) {
        return 'unknown';
    }
}

// حفظ المعلومات في Supabase
async function saveBrowserInfo(username) {
    const supabaseUrl = 'https://ufgkypppgdktqxzwiuxa.supabase.co';
    const supabaseKey = 'sb_publishable_bNldaEbt2ara2ehu7RZCtw_mafx2ftI'; // استبدل بمفتاحك الحقيقي
    
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
    
    const info = await collectBrowserInfo();
    info.username = username;
    
    const { error } = await supabase
        .from('user_logs')
        .insert([info]);
    
    if (error) {
        console.error('Error saving info:', error);
    } else {
        console.log('Browser info saved!');
    }
}