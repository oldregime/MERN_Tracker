# Deployment Guide for Personal Finance Tracker

## ✅ Pre-Deployment Checklist

All the following have been completed:

1. ✅ MongoDB Atlas configured with connection string
2. ✅ All dependencies installed (root, backend, frontend)
3. ✅ Backend .env file created with MongoDB Atlas credentials
4. ✅ Vercel configuration files created (vercel.json, .vercelignore)
5. ✅ API serverless function created (api/index.js)
6. ✅ Frontend production environment configured
7. ✅ Vercel CLI installed globally

## 🚀 Deployment Steps

### Step 1: Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate with your Vercel account (GitHub, GitLab, Bitbucket, or Email).

### Step 2: Deploy to Vercel

From the project root directory:

```bash
cd "/run/media/divyansh/New Volume/PARA/Projects/MERN_Tracker/Expense Tracker/code"
vercel
```

When prompted:
- **Set up and deploy?** → Yes
- **Which scope?** → Select your account
- **Link to existing project?** → No
- **Project name?** → Press Enter (or provide a custom name like `mern-expense-tracker`)
- **In which directory is your code located?** → `./` (press Enter)
- **Want to override the settings?** → No

### Step 3: Configure Environment Variables on Vercel

After the initial deployment, you need to add environment variables:

```bash
vercel env add DATABASE_URL
```

When prompted, paste:
```
mongodb+srv://mernexptrack:Asdf!1234@cluster0.i7llnad.mongodb.net/finance-tracker?retryWrites=true&w=majority
```

Select: **Production, Preview, and Development**

Add more environment variables:

```bash
vercel env add JWT_SECRET
```
Value: `5cfea10cc02da694101ed82190c5c01a8272ef26b1e758bf114f9dc2253fdbd2`

```bash
vercel env add NODE_ENV
```
Value: `production`

```bash
vercel env add JWT_ACCESS_EXPIRATION
```
Value: `1h`

```bash
vercel env add JWT_REFRESH_SECRET
```
Value: `your_refresh_token_secret_change_this_in_production`

```bash
vercel env add JWT_REFRESH_EXPIRATION
```
Value: `7d`

### Step 4: Redeploy with Environment Variables

```bash
vercel --prod
```

This will deploy to production with all environment variables configured.

## 🌐 Access Your Deployed Application

After deployment completes, Vercel will provide you with:
- **Preview URL**: `https://your-project-name.vercel.app`
- **Production URL**: `https://your-project-name.vercel.app`

## 📝 Post-Deployment

### Test the Application

1. Visit your Vercel URL
2. Register a new account
3. Test expense tracking features
4. Verify data is being saved to MongoDB Atlas

### Monitor Logs

View logs in real-time:
```bash
vercel logs
```

Or visit the Vercel dashboard: https://vercel.com/dashboard

## 🔧 Troubleshooting

### If deployment fails:

1. **Check build logs**:
   ```bash
   vercel logs --follow
   ```

2. **Verify environment variables**:
   ```bash
   vercel env ls
   ```

3. **Test locally first**:
   ```bash
   # Terminal 1 - Backend
   cd backend && npm start
   
   # Terminal 2 - Frontend
   cd frontend && npm start
   ```

### Common Issues:

**Issue**: MongoDB connection timeout
**Solution**: Ensure MongoDB Atlas IP whitelist includes `0.0.0.0/0`

**Issue**: API routes not working
**Solution**: Check that all API calls use `/api` prefix

**Issue**: Build fails
**Solution**: Run `npm run build` in frontend directory locally to check for errors

## 🔒 Security Notes

1. **Never commit .env files** - They are gitignored
2. **Rotate secrets regularly** - Especially JWT_SECRET
3. **Use strong passwords** - For MongoDB Atlas
4. **Enable 2FA** - On Vercel account

## 📊 MongoDB Atlas Dashboard

Access your database:
1. Go to https://cloud.mongodb.com
2. Login with your credentials
3. View collections: `finance-tracker` database
4. Monitor performance and usage

## 🎉 Success!

Your MERN expense tracker is now live and accessible to everyone!

Share your URL: `https://your-project-name.vercel.app`
