import { Redis } from '@upstash/redis';
function getRedis() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error('Redis not configured');
  return new Redis({ url, token });
}
export default async function handler(req, res) {
  const code = String(req.query.code || '');
  if (!/^[a-zA-Z0-9_-]{5,20}$/.test(code)) return res.status(404).send('Link not found');
  try {
    const redis = getRedis();
    const url = await redis.get(`link:${code}`);
    if (!url) return res.status(404).send('এই শর্ট লিংকটি পাওয়া যায়নি।');
    await redis.incr(`clicks:${code}`);
    return res.redirect(302, url);
  } catch {
    return res.status(500).send('সার্ভার সেটআপ সম্পূর্ণ হয়নি।');
  }
}
