# Nifty 50 Market Dashboard - Free Deployment Guide

This guide will help you deploy your Nifty 50 Market Dashboard to **Vercel** for **completely free** hosting, allowing you to access it from anywhere outside of Manus.

---

## Why Vercel?

- ✅ **100% Free** for personal projects
- ✅ **Automatic HTTPS** with SSL certificate
- ✅ **Global CDN** for fast loading worldwide
- ✅ **Automatic deployments** from Git
- ✅ **Custom domain support** (optional)
- ✅ **Zero configuration** for React/Vite projects

---

## Prerequisites

1. **GitHub Account** (free) - [Sign up here](https://github.com/signup)
2. **Vercel Account** (free) - [Sign up here](https://vercel.com/signup)

---

## Step 1: Download Your Project Files

1. In the Manus dashboard, click on the **"Code"** tab in the Management UI (right panel)
2. Click the **"Download All Files"** button at the top
3. Extract the downloaded ZIP file to a folder on your computer

---

## Step 2: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and log in
2. Click the **"+"** icon in the top-right corner → **"New repository"**
3. Name your repository: `nifty-dashboard` (or any name you prefer)
4. Set visibility to **"Public"** (required for free Vercel hosting)
5. **Do NOT** initialize with README, .gitignore, or license
6. Click **"Create repository"**

---

## Step 3: Upload Your Project to GitHub

### Option A: Using GitHub Web Interface (Easiest)

1. On your new repository page, click **"uploading an existing file"**
2. Drag and drop **all files and folders** from your extracted project
3. Scroll down and click **"Commit changes"**

### Option B: Using Git Command Line (Advanced)

```bash
# Navigate to your project folder
cd /path/to/nifty_dashboard

# Initialize Git
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit"

# Add remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/nifty-dashboard.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Step 4: Deploy to Vercel

1. Go to [Vercel](https://vercel.com) and log in
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Find and select your `nifty-dashboard` repository
5. Vercel will automatically detect it's a **Vite** project
6. **Configure Project:**
   - **Framework Preset:** Vite
   - **Root Directory:** `./` (leave as default)
   - **Build Command:** `pnpm run build` (auto-detected)
   - **Output Directory:** `dist` (auto-detected)
   - **Install Command:** `pnpm install` (auto-detected)
7. Click **"Deploy"**

Vercel will now build and deploy your dashboard. This takes about 2-3 minutes.

---

## Step 5: Access Your Live Dashboard

Once deployment is complete:

1. Vercel will show you a **live URL** like: `https://nifty-dashboard-abc123.vercel.app`
2. Click the URL to open your dashboard
3. **Bookmark this URL** - you can access it from any device, anywhere!

---

## Step 6: Enable Auto-Refresh (Important!)

Your dashboard is configured to auto-refresh every 1 minute. This works automatically in the deployed version - no additional setup needed!

**Features that work automatically:**
- ✅ Auto-refresh every 60 seconds
- ✅ Manual refresh button
- ✅ Real-time data updates
- ✅ Options analysis
- ✅ Live news with clickable sources

---

## Optional: Add a Custom Domain

If you own a domain (e.g., `niftydashboard.com`), you can connect it for free:

1. In your Vercel project, go to **"Settings"** → **"Domains"**
2. Enter your domain name
3. Follow Vercel's instructions to update your DNS records
4. Your dashboard will be available at your custom domain!

---

## Updating Your Dashboard

Whenever you want to update your dashboard with new features:

1. Download the latest files from Manus (Code → Download All Files)
2. Replace files in your GitHub repository
3. Commit and push changes
4. Vercel will **automatically redeploy** in 2-3 minutes!

**Or use Git:**
```bash
# Pull latest changes from Manus
# (download and extract to your local project folder)

# Commit and push
git add .
git commit -m "Update dashboard"
git push origin main
```

---

## Troubleshooting

### Build Failed on Vercel

**Issue:** Vercel build fails with "command not found" or dependency errors

**Solution:**
1. Check that `package.json` exists in your repository root
2. Ensure all dependencies are listed in `package.json`
3. Try redeploying from Vercel dashboard

### Dashboard Shows Blank Page

**Issue:** Deployed site shows a blank white page

**Solution:**
1. Check browser console for errors (F12 → Console tab)
2. Ensure all files were uploaded correctly to GitHub
3. Check Vercel build logs for errors

### Auto-Refresh Not Working

**Issue:** Data doesn't refresh automatically

**Solution:**
- Auto-refresh works only when the browser tab is active
- If tab is inactive for >5 minutes, browser may pause timers
- Click the manual "Refresh" button to update immediately

### 404 Error on Vercel URL

**Issue:** Vercel URL shows "404 - Page Not Found"

**Solution:**
1. Check that `index.html` exists in `client/` folder
2. Ensure build output directory is set to `dist` in Vercel settings
3. Redeploy the project

---

## Cost Breakdown

| Service | Cost | Limits |
|---------|------|--------|
| **Vercel Hosting** | **FREE** | 100 GB bandwidth/month, unlimited projects |
| **GitHub Repository** | **FREE** | Unlimited public repositories |
| **SSL Certificate** | **FREE** | Automatic HTTPS |
| **Custom Domain** | **FREE** | (domain purchase separate, ~$10-15/year) |

**Total Cost: ₹0 (FREE) ✅**

---

## Security & Privacy

- ✅ Your dashboard is **static HTML/CSS/JS** - no server-side code
- ✅ No sensitive data is stored or transmitted
- ✅ All data is fetched client-side from public sources
- ✅ HTTPS encryption is enabled by default
- ⚠️ Dashboard is **publicly accessible** via the Vercel URL
  - If you need private access, consider adding password protection (requires paid Vercel plan)

---

## Performance Tips

1. **Enable Caching:** Vercel automatically caches static assets
2. **Use CDN:** Vercel's global CDN ensures fast loading worldwide
3. **Optimize Images:** Compress any images before uploading
4. **Monitor Usage:** Check Vercel dashboard for bandwidth usage

---

## Support & Resources

- **Vercel Documentation:** [vercel.com/docs](https://vercel.com/docs)
- **GitHub Help:** [docs.github.com](https://docs.github.com)
- **Vite Documentation:** [vitejs.dev](https://vitejs.dev)

---

## Summary

1. ✅ Download project files from Manus
2. ✅ Upload to GitHub (free)
3. ✅ Deploy to Vercel (free)
4. ✅ Access your dashboard from anywhere!
5. ✅ Auto-refresh works automatically
6. ✅ Update anytime by pushing to GitHub

**Your dashboard will be live at:** `https://your-project-name.vercel.app`

**No ongoing costs. No credit card required. 100% free forever!** 🎉

---

## Next Steps After Deployment

1. **Bookmark your Vercel URL** for quick access
2. **Test auto-refresh** by waiting 1 minute and watching data update
3. **Test manual refresh** by clicking the "Refresh" button
4. **Share the URL** with your trading group (if desired)
5. **Monitor performance** in Vercel dashboard

---

## Questions?

If you encounter any issues during deployment, check:
1. Vercel build logs (click "View Function Logs" in Vercel dashboard)
2. Browser console (F12 → Console tab)
3. GitHub repository files (ensure all files are present)

Happy Trading! 📈
