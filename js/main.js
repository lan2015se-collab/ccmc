// ===== Mobile Menu =====
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    nav.classList.toggle('open');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      nav.classList.remove('open');
    });
  });
}

// ===== Copy Helper =====
async function copyText(text, btn) {
  try {
    await navigator.clipboard.writeText(text);
    const original = btn.textContent;
    btn.textContent = '已複製';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = original;
      btn.classList.remove('copied');
    }, 1500);
  } catch (err) {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    btn.textContent = '已複製';
    setTimeout(() => {
      btn.textContent = '複製';
    }, 1500);
  }
}

const copyIpBtn = document.getElementById('copyIp');
const serverIp = document.getElementById('serverIp');
if (copyIpBtn && serverIp) {
  copyIpBtn.addEventListener('click', () => {
    copyText(serverIp.textContent.trim(), copyIpBtn);
  });
}

document.querySelectorAll('.btn-copy-sm').forEach(btn => {
  btn.addEventListener('click', () => {
    const text = btn.getAttribute('data-copy');
    if (text) copyText(text, btn);
  });
});

// ===== Join Form =====
const joinForm = document.getElementById('joinForm');
const formStatus = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');

if (joinForm) {
  joinForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const gamertagEl = document.getElementById('gamertag');
    const emailEl = document.getElementById('email');
    const agreeEl = document.getElementById('agree');

    const gamertag = (gamertagEl?.value || '').trim();
    const email = (emailEl?.value || '').trim();
    const agree = !!agreeEl?.checked;

    if (!gamertag) {
      showStatus('請填寫 Xbox 玩家名稱（Gamertag）。', 'error');
      gamertagEl?.focus();
      return;
    }
    if (!email) {
      showStatus('請填寫電子郵件。', 'error');
      emailEl?.focus();
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showStatus('請輸入有效的電子郵件地址。', 'error');
      emailEl?.focus();
      return;
    }
    if (!agree) {
      showStatus('請勾選同意伺服器規則。', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = '送出中...';

    try {
      const response = await fetch('/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gamertag, email }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        showStatus(
          `申請已送出！\nGamertag：${gamertag}\n我們會盡快審核並回覆 ${email}`,
          'success'
        );
        joinForm.reset();
      } else {
        showStatus('送出失敗：' + (data.error || data.detail || '請稍後再試'), 'error');
      }
    } catch (err) {
      showStatus('網路錯誤，請稍後再試。', 'error');
    }

    submitBtn.disabled = false;
    submitBtn.textContent = '確定送出申請';
  });
}

function showStatus(message, type) {
  if (!formStatus) return;
  formStatus.hidden = false;
  formStatus.className = 'form-status ' + type;
  formStatus.textContent = message;
  formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  if (!header) return;
  header.style.background = window.scrollY > 30
    ? 'rgba(13, 17, 23, 0.95)'
    : 'rgba(13, 17, 23, 0.9)';
});
