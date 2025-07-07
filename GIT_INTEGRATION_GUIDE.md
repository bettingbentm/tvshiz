# 🚀 TVSHIZ - Complete Git Integration Guide

## 📥 Step 1: Install Git (if needed)

### Download Git:
- Go to: https://git-scm.com/download/windows
- Download and install Git for Windows
- Restart your terminal/VS Code after installation

## 🔧 Step 2: Initialize Git Repository

Open your terminal in the TVSHIZ project folder and run:

```bash
# Initialize Git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - TVSHIZ streaming dashboard ready for deployment"
```

## 🌐 Step 3: Create GitHub Repository

### Option A: GitHub Desktop (Easier)
1. Download GitHub Desktop: https://desktop.github.com/
2. Open GitHub Desktop
3. Click "Add an Existing Repository from your Hard Drive"
4. Select your TVSHIZ folder
5. Click "Publish repository"

### Option B: Command Line
1. Go to https://github.com/new
2. Create a new repository named "TVSHIZ"
3. Don't initialize with README (we have files already)
4. Copy the repository URL
5. Run in terminal:
```bash
git remote add origin https://github.com/yourusername/TVSHIZ.git
git branch -M main
git push -u origin main
```

## 🚀 Step 4: Deploy to Netlify

### 4.1 Connect Repository
1. Go to https://app.netlify.com/
2. Click "New site from Git"
3. Choose "GitHub" (or your Git provider)
4. Authorize Netlify to access your repositories
5. Select your "TVSHIZ" repository

### 4.2 Build Settings (Auto-Detected)
Netlify will automatically detect these settings from your `netlify.toml`:
- **Build command**: `npm run build:netlify`
- **Publish directory**: `.next`
- **Plugin**: `@netlify/plugin-nextjs`

### 4.3 Environment Variables
Click "Advanced build settings" or add later in dashboard:
```
TMDB_API_KEY = your_tmdb_api_key_here
```

### 4.4 Deploy!
Click "Deploy site" - Netlify will:
- ✅ Install dependencies
- ✅ Run build process
- ✅ Deploy your site
- ✅ Provide live URL

## 🔑 Step 5: Get TMDB API Key

1. Go to: https://www.themoviedb.org/
2. Create free account
3. Go to Settings > API
4. Request API key (choose "Developer")
5. Copy your API key

## ⚙️ Step 6: Add Environment Variables

In Netlify Dashboard:
1. Go to Site Settings > Environment Variables
2. Click "Add Variable"
3. Add:
   - **Key**: `TMDB_API_KEY`
   - **Value**: Your TMDB API key
4. Save and redeploy

## 🎯 Step 7: Test Your Deployment

After deployment, verify:
- ✅ Site loads correctly
- ✅ Coming Soon section shows 20 movies + 20 series
- ✅ Modal popups work when clicking items
- ✅ Real movie/TV data appears
- ✅ Mobile responsiveness

## 🔄 Future Updates

After initial setup, updating is easy:
1. Make code changes
2. Commit and push:
   ```bash
   git add .
   git commit -m "Update feature"
   git push
   ```
3. Netlify automatically rebuilds and deploys!

## 🎉 Success Checklist

- [ ] Git installed and repository created
- [ ] Code pushed to GitHub/GitLab
- [ ] Netlify site connected to repository
- [ ] TMDB API key added to environment variables
- [ ] Site deployed successfully
- [ ] All features working (Coming Soon, modals, etc.)
- [ ] Custom domain configured (optional)

## 🆘 Troubleshooting

### Build Fails
- Check build logs in Netlify dashboard
- Verify TMDB API key is correctly set
- Ensure all dependencies are in package.json

### API Not Working
- Verify TMDB API key is valid
- Check environment variable name spelling
- Test API key at: https://www.themoviedb.org/settings/api

### Features Missing
- Ensure you pushed latest code
- Check that netlify.toml is in root directory
- Verify build completed successfully

## 📞 Need Help?

If you encounter issues:
1. Check Netlify build logs
2. Verify environment variables
3. Test locally with `npm run dev`
4. Check browser console for errors

---

**Your TVSHIZ streaming dashboard will be live with full functionality!** 🌟
