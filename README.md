# N88N Fleet Command Dashboard — Deployment Guide

## /// THE SPARK. THE BRIDGE. THE SYSTEM.

v4.1 Canonical Manifest | 88 Work Solutions | 9 Rings

---

## DEPLOYMENT ARC (3 Phases)

### PHASE 1: PUSH TO GITHUB (C-07 THE LEDGER)

```bash
# 1. Create a new repo on GitHub called "n88n-academy"
#    → github.com/new → Name: n88n-academy → Private → Create

# 2. From your local machine (The Bridge / MacBook):
cd ~/Desktop  # or wherever you unzipped this
cd n88n-academy

git init
git add .
git commit -m "/// FLEET COMMAND v4.1 — Initial deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/n88n-academy.git
git push -u origin main
```

### PHASE 2: DEPLOY TO VERCEL (C-05 THE INTERFACE)

1. Go to **[vercel.com](https://vercel.com)** → Sign in with GitHub
2. Click **"Add New Project"**
3. Select your **n88n-academy** repo
4. Vercel auto-detects Vite. Settings should show:
   - Framework: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Click **Deploy**
6. Wait ~60 seconds. You'll get a URL like: `n88n-academy-xxxxx.vercel.app`
7. **Test it.** Click through Fleet, Bench, Build & Kill views.

### PHASE 3: CONNECT CLOUDFLARE DNS → VERCEL

#### Step A: Add custom domain in Vercel
1. In Vercel → your project → **Settings → Domains**
2. Add: `n88n.academy`
3. Vercel will give you a **CNAME target** like: `cname.vercel-dns.com`

#### Step B: Set the DNS record in Cloudflare
1. Go to **Cloudflare Dashboard** → select `n88n.academy`
2. Go to **DNS → Records**
3. Add a **CNAME** record:
   - **Name:** `@` (or leave blank for root)
   - **Target:** `cname.vercel-dns.com`
   - **Proxy status:** Toggle **OFF** (DNS only / grey cloud)
     ⚠️ This is critical — Vercel needs direct DNS, not Cloudflare proxy
4. If you also want `www.n88n.academy`:
   - Add another **CNAME**: Name `www` → Target `cname.vercel-dns.com`

#### Step C: SSL Configuration
1. In Cloudflare → **SSL/TLS** → set mode to **Full** (not Full Strict)
2. Vercel auto-provisions an SSL cert — give it 5-10 minutes

#### Step D: Verify
1. Visit `https://n88n.academy` — should load the dashboard
2. Visit `https://n88n.academy?captain=1` — should trigger login modal

---

## CAPTAIN MODE

**Default passphrase:** `makeitso`

### To change the passphrase:
1. Open `src/FleetCommand.jsx`
2. Find line: `const CAPTAIN_HASH = "bWFrZWl0c28=";`
3. Open browser console, run: `btoa("yournewpassword")`
4. Replace the hash value with the output
5. Commit & push — Vercel auto-deploys

### Access methods:
- Click the ⚡ COMMAND button in the header
- Or visit: `n88n.academy?captain=1`

---

## ARCHITECTURE

```
n88n-academy/
├── index.html          ← Entry point + OG meta tags
├── package.json        ← Dependencies (React 18 + Vite)
├── vite.config.js      ← Build config
├── vercel.json         ← Vercel deployment settings
└── src/
    ├── main.jsx        ← React mount
    └── FleetCommand.jsx ← The entire dashboard (single component)
```

**Storage:** localStorage (persists in browser, no backend needed)
**Auth:** Base64 passphrase check (client-side, sufficient for view-only gating)
**Visitors:** Can view all fleet data, cards, and Build & Kill results — cannot edit

---

## FUTURE UPGRADES

| Upgrade | Effort | Benefit |
|---------|--------|---------|
| Supabase backend | Medium | Sync data across devices |
| Proper auth (NextAuth) | Medium | Secure captain login |
| Landing page wrapper | Low | Hero section before dashboard |
| Analytics (Plausible) | Low | Track visitor engagement |
| TCG card visual mode | High | Show actual card art |

---

/// N88N COMMAND © 2026
