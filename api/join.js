import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // CORS（如需要）
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { gamertag, email } = req.body || {};

  if (!gamertag || !email) {
    return res.status(400).json({ error: '缺少必要欄位' });
  }

  try {
    await resend.emails.send({
      from: 'CCMC 白名單 <noreply@你的網域.com>', // 必須是已驗證的寄件地址
      to: ['illusd@illusd.com'],                   // 管理員收件信箱
      subject: `【CCMC 白名單申請】${gamertag}`,
      text: `
有新的白名單申請：

Gamertag：${gamertag}
Email：${email}
申請時間：${new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}
已同意規則：是

---
CCMC 網站自動通知
      `.trim(),
      html: `
        <h2>有新的白名單申請</h2>
        <ul>
          <li><strong>Gamertag：</strong>${gamertag}</li>
          <li><strong>Email：</strong>${email}</li>
          <li><strong>申請時間：</strong>${new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}</li>
          <li><strong>已同意規則：</strong>是</li>
        </ul>
        <hr>
        <small>CCMC 網站自動通知</small>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: '寄信失敗' });
  }
}
