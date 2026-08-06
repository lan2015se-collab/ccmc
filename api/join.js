import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
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
      from: 'CCMC 白名單 <noreply@unid.ccwu.cc>',
      to: ['illusd@illusd.com'],
      subject: `【CCMC 白名單申請】${gamertag}`,
      text: `Gamertag：${gamertag}\nEmail：${email}\n時間：${new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}`,
      html: `<h2>白名單申請</h2><p><strong>Gamertag：</strong>${gamertag}</p><p><strong>Email：</strong>${email}</p><p><strong>時間：</strong>${new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}</p>`,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: '寄信失敗', detail: String(err?.message || err) });
  }
}
