// ===== Mobile Menu =====
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('active');
  nav.classList.toggle('open');
});

// Close menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.classList.remove('active');
    nav.classList.remove('open');
  });
});

// ===== Copy IP =====
const copyBtn = document.getElementById('copyIp');
const serverIp = document.getElementById('serverIp');

copyBtn.addEventListener('click', async () => {
  const ip = serverIp.textContent.trim();
  try {
    await navigator.clipboard.writeText(ip);
    copyBtn.classList.add('copied');
    copyBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      已複製
    `;
    setTimeout(() => {
      copyBtn.classList.remove('copied');
      copyBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2"/>
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
        </svg>
        複製
      `;
    }, 2000);
  } catch (err) {
    // Fallback
    const range = document.createRange();
    range.selectNode(serverIp);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    alert('IP 已複製：' + ip);
  }
});

// ===== Join Form =====
const joinForm = document.getElementById('joinForm');
const formStatus = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');

joinForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const gamertag = document.getElementById('gamertag').value.trim();
  const email = document.getElementById('email').value.trim();
  const agree = document.getElementById('agree').checked;

  if (!gamertag || !email || !agree) {
    showStatus('請完整填寫所有必填欄位並同意規則。', 'error');
    return;
  }

  // Basic email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showStatus('請輸入有效的電子郵件地址。', 'error');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = '送出中...';

  /*
   * ============================================================
   *  寄信整合說明（Mailjet）
   * ============================================================
   *  目前為前端演示版本。正式環境請改用後端（推薦）或 EmailJS。
   *
   *  建議做法：
   *  1. 使用 Cloudflare Workers / Vercel Serverless / PHP 接收表單
   *  2. 後端使用 Mailjet API 寄信到 illusd@illusd.com
   *  3. 信件內容範例：
   *
   *     主旨：【CCMC 白名單申請】{gamertag}
   *     內容：
   *       Gamertag: {gamertag}
   *       Email: {email}
   *       申請時間: {timestamp}
   *       已同意規則: 是
   *
   *  目前先模擬成功，並把資料輸出到 console 方便測試。
   * ============================================================
   */

  const payload = {
    gamertag,
    email,
    agreed: true,
    timestamp: new Date().toISOString(),
    source: 'CCMC Website Join Form'
  };

  console.log('白名單申請資料：', payload);

  // 模擬延遲
  await new Promise(r => setTimeout(r, 800));

  // 成功提示
  showStatus(
    `申請已送出！\nGamertag：${gamertag}\n我們會盡快審核並將結果寄至 ${email}`,
    'success'
  );

  joinForm.reset();
  submitBtn.disabled = false;
  submitBtn.textContent = '確定送出申請';
});

function showStatus(message, type) {
  formStatus.hidden = false;
  formStatus.className = 'form-status ' + type;
  formStatus.textContent = message;
  formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ===== Header scroll effect =====
window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  if (window.scrollY > 40) {
    header.style.background = 'rgba(15, 15, 20, 0.95)';
  } else {
    header.style.background = 'rgba(15, 15, 20, 0.85)';
  }
});
