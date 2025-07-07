# TVSHIZ Netlify Deployment Guide

## 🚀 Quick Deployment Steps

### 1. Prepare Your Environment
```bash
# Copy environment variables template
cp .env.example .env

# Edit .env and add your API keys
# TMDB_API_KEY=your_tmdb_api_key_here
# OPENAI_API_KEY=your_openai_api_key_here (optional)
```

### 2. Test Build Locally
```bash
# Run the deployment script
./deploy.sh    # Linux/Mac
# or
deploy.bat     # Windows

# Or manually:
npm run build
```

### 3. Deploy to Netlify

#### Option A: Git Integration (Recommended)
1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [Netlify](https://app.netlify.com/)
3. Click "New site from Git"
4. Select your repository
5. Netlify will auto-detect the configuration
6. Set environment variables (see below)
7. Click "Deploy site"

#### Option B: Manual Deploy
1. Run `npm run build`
2. Go to [Netlify](https://app.netlify.com/)
3. Drag and drop the `.next` folder to deploy

## 🔧 Environment Variables

Set these in Netlify: **Site settings > Environment variables**

| Variable | Required | Description | Get From |
|----------|----------|-------------|----------|
| `TMDB_API_KEY` | ✅ Yes | Movie/TV data | [TMDB API](https://www.themoviedb.org/settings/api) |
| `OPENAI_API_KEY` | ⚠️ Optional | AI features | [OpenAI](https://platform.openai.com/api-keys) |

## 📋 Netlify Configuration

The project includes these files for Netlify:
- `netlify.toml` - Build and deployment settings
- `next.config.ts` - Next.js configuration optimized for Netlify
- `package.json` - Dependencies and build scripts

## 🎯 Features

- **Coming Soon Section**: Shows up to 20 movies and 20 series
- **Modal Popups**: Detailed information for each title
- **Responsive Design**: Works on all devices
- **Real-time Data**: Fetches from TMDB API
- **English Content**: Filtered for English/American content

## 🔍 Troubleshooting

### Build Errors
- Ensure all dependencies are installed: `npm install`
- Check TypeScript errors: `npx tsc --noEmit`
- Verify environment variables are set

### API Issues
- Verify TMDB API key is valid
- Check API rate limits (TMDB allows 40 requests/10 seconds)
- Ensure network connectivity

### Deployment Issues
- Check Netlify build logs
- Verify environment variables are set correctly
- Ensure all required dependencies are in `package.json`

## 📱 Performance

- Optimized images with Next.js Image component
- Lazy loading for better performance
- Responsive design with Tailwind CSS
- Efficient API caching

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Deployment**: Netlify with Next.js plugin
- **APIs**: TMDB (The Movie Database)
- **Optional**: OpenAI for AI features

## 📞 Support

If you encounter issues:
1. Check the build logs in Netlify
2. Verify all environment variables are set
3. Test the build locally first
4. Check the browser console for errors

Happy deploying! 🎉
