# SmartLink BD — GitHub + Vercel (বাংলা নির্দেশনা)

এই প্রজেক্টে মোবাইল-ফ্রেন্ডলি লিংক শর্টনার UI, লিংক হিস্ট্রি, কপি বাটন ও QR কোড আছে। আসল শর্ট লিংক কাজ করাতে Upstash Redis দরকার। Redis সেটআপ না থাকলে UI ডেমো লিংক দেখাবে—সেগুলো আসল redirect করবে না।

## ফাইল
- `index.html` — সম্পূর্ণ UI (HTML/CSS/JS)
- `api/shorten.js` — ছোট লিংক তৈরি
- `api/[code].js` — ছোট লিংক redirect ও click count
- `vercel.json` — Vercel routing
- `package.json` — dependencies

## Android ফোন দিয়ে GitHub-এ আপলোড
1. GitHub-এ নতুন repository তৈরি করো, যেমন `smartlink-bd`।
2. ZIP extract করে সব ফাইল ও `api` ফোল্ডার repository-তে আপলোড করো। GitHub ওয়েবসাইটে `Add file` → `Upload files` ব্যবহার করতে পারো।
3. Repository-তে `index.html`, `package.json`, `vercel.json`, `api/shorten.js`, `api/[code].js` দেখা যাচ্ছে কি না নিশ্চিত করো।

## Upstash Redis ফ্রি সেটআপ
1. https://console.upstash.com/ এ অ্যাকাউন্ট করে Redis database তৈরি করো।
2. database-এর REST API URL ও REST token কপি করো; এগুলো কাউকে প্রকাশ করবে না।
3. Vercel-এ https://vercel.com/ → Add New → Project → GitHub repository Import করো।
4. Vercel Project → Settings → Environment Variables-এ যোগ করো:
   - `UPSTASH_REDIS_REST_URL` = Upstash REST URL
   - `UPSTASH_REDIS_REST_TOKEN` = Upstash REST token
   - ঐচ্ছিক `PUBLIC_BASE_URL` = `https://your-project.vercel.app` (নিজের ডোমেইন)
5. Deploy করো বা Environment Variables যোগ করার পর Redeploy করো।
6. নিজের সাইটে একটি HTTPS URL দিয়ে পরীক্ষা করো। তৈরি লিংক অন্য ডিভাইস থেকেও খুলে মূল সাইটে পাঠানোর কথা।

## গুরুত্বপূর্ণ সীমাবদ্ধতা
- Click count Redis-এ সংরক্ষিত হয়; এই UI-তে এখনো পূর্ণ analytics dashboard নেই।
- QR code তৈরিতে একটি বাহ্যিক QR API ব্যবহার করা হয়েছে; QR বানাতে ইন্টারনেট লাগবে।
- Local browser history শুধু একই ডিভাইসে থাকে।
- Abuse/spam ঠেকাতে public launch-এর আগে rate limit, report-abuse page, privacy policy ও terms যোগ করা উচিত।
- AdSense অনুমোদন নিশ্চিত নয়; আগে কার্যকর সাইট ও নিজস্ব উপকারী কনটেন্ট তৈরি করো।
- কোনো API secret `index.html`-এ বা GitHub-এ লিখবে না।
