import { Redis } from '@upstash/redis';
import { nanoid } from 'nanoid';

function getRedis() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error('Redis সেটআপ করা নেই। Vercel Environment Variables-এ Upstash Redis URL ও Token যোগ করুন।');
  return new Redis({ url, token });
}
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST method ব্যবহার করুন।' });
  try {
    const input = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    let parsed;
    try { parsed = new URL(input?.url); } catch { return res.status(400).json({ error: 'সঠিক URL দিন।' }); }
    if (!['http:', 'https:'].includes(parsed.protocol)) return res.status(400).json({ error: 'শুধু HTTP/HTTPS লিংক গ্রহণযোগ্য।' });
    const redis = getRedis();
    const code = nanoid(7);
    await redis.set(`link:${code}`, parsed.href);
    const origin = process.env.PUBLIC_BASE_URL || `https://${req.headers.host}`;
    return res.status(201).json({ code, shortUrl: `${origin}/${code}` });
  } catch (e) {
    return res.status(500).json({ error: e.message || 'লিংক তৈরি করা যায়নি।' });
  }
}
