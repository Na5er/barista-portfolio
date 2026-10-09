# Barista Portfolio (Next.js 14 + Tailwind)

## Run locally
    npm install
    cp .env.example .env.local   # set ADMIN_EMAIL, ADMIN_PASSWORD, SESSION_SECRET, BLOB_READ_WRITE_TOKEN
    npm run dev

## Deploy to Vercel
1. Push this folder to GitHub.
2. vercel.com > Add New Project > import the repo (Next.js is auto-detected).
3. Create a Blob store (Storage tab, connect it to the project), add `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `SESSION_SECRET`, then Deploy.

## Edit your details
`lib/data.ts` holds contact details, social links, job places/periods and certifications.
All visible text lives in `locales/en.json`, `locales/tr.json` and `locales/ar.json`; edit the same key in each file.
Replace `public/resume.jpg` to change the resume download.

## Languages (English, Turkish, Arabic)
The EN | TR | AR switcher in the nav bar changes the language instantly and remembers the choice in localStorage.
Arabic switches the page to right-to-left (`dir="rtl"`); layout uses Tailwind logical classes (`ps-`, `ms-`, `start-`, `end-`).
To add a language, create `locales/xx.json` with the same keys, register it in `lib/i18n.tsx`, and add its font if needed.

## Admin (`/admin`)
Log in at `/admin/login` with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env.local`.
`SESSION_SECRET` must be a random string of 32+ characters (`openssl rand -hex 32`).
Sessions are signed, HTTP-only cookies (7 days); middleware blocks `/admin`, and every write API re-checks the session.

The dashboard lets you upload photos (JPG/PNG/WebP/GIF, 20 MB) and videos (MP4/WebM/MOV, 150 MB) or add URLs
(image, YouTube/Vimeo, .mp4), then edit, reorder (arrows) and delete. The public gallery reads `/api/media`
and refreshes on its own. Files are checked by content, not by name. HEIC must be exported as JPG first.

## Storage (Vercel Blob)
The media list is a JSON blob (`portfolio/media.json`) and uploaded photos/videos are blobs, all in a Vercel Blob store.
Files go directly from the browser to Blob (functions cap bodies at 4.5 MB). `lib/server/store.ts` holds all storage code.
Locally you also need `BLOB_READ_WRITE_TOKEN` (`vercel env pull .env.local` after linking the project).
Your bundled photos/videos in `public/media` are the initial list until you first change something in `/admin`.
