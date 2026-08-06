// ===== EmailJS（改成你的 Public Key）=====
emailjs.init('wFL6YBEVK-6eQCoM6');

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

// ===== Copy =====
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
    setTimeout(() => { btn.textContent = '複製'; }, 1500);
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

// ===== 表單寄信 =====
const joinForm = document.getElementById('joinForm');
const formStatus = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');

if (joinForm) {
  joinForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const gamertag = (document.getElementById('gamertag')?.value || '').trim();
    const email = (document.getElementById('email')?.value || '').trim();
    const agree = !!document.getElementById('agree')?.checked;

    if (!gamertag) {
      showStatus('請填寫 Xbox 玩家名稱（Gamertag）。', 'error');
      return;
    }
    if (!email) {
      showStatus('請填寫電子郵件。', 'error');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showStatus('請輸入有效的電子郵件地址。', 'error');
      return;
    }
    if (!agree) {
      showStatus('請勾選同意伺服器規則。', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = '送出中...';

    try {
      await emailjs.send(
        'service_ma8rdvh',   // 例如 service_xxxxx
        'template_wd96pkt',  // 例如 template_xxxxx
        {
          gamertag: gamertag,
          email: email,
          time: new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }),
        }
      );

      showStatus(
        `申請已送出！\nGamertag：${gamertag}\n我們會盡快審核並回覆 ${email}`,
        'success'
      );
      joinForm.reset();
    } catch (err) {
      console.error(err);
      showStatus('送出失敗，請稍後再試。', 'error');
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
