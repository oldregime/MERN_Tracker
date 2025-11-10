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
cd "d:\Documents\02_Projects\01_MERN_Projects\MERN_Tracker\Expense Tracker\code"
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

#### 3.1 Database Connection String

```bash
vercel env add DATABASE_URL
```

**Value**: Use your MongoDB Atlas connection string from your `.env` file
**Format**: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority`

⚠️ **IMPORTANT**: Replace `<username>`, `<password>`, `<cluster>`, and `<database>` with your actual credentials

Select: **Production, Preview, and Development**

#### 3.2 JWT Secret

```bash
vercel env add JWT_SECRET
```

**Generate a secure secret** by running this command first:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and paste it as the value.

Select: **Production, Preview, and Development**

#### 3.3 Node Environment

```bash
vercel env add NODE_ENV
```
Value: `production`

Select: **Production, Preview, and Development**

#### 3.4 JWT Access Expiration

```bash
vercel env add JWT_ACCESS_EXPIRATION
```
Value: `1h`

Select: **Production, Preview, and Development**

#### 3.5 JWT Refresh Secret

```bash
vercel env add JWT_REFRESH_SECRET
```

**Generate another secure secret** (different from JWT_SECRET):
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and paste it as the value.

Select: **Production, Preview, and Development**

#### 3.6 JWT Refresh Expiration

```bash
vercel env add JWT_REFRESH_EXPIRATION
```
Value: `7d`

Select: **Production, Preview, and Development**

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
   cd backend && node server.js
   
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

## 🔒 Security Best Practices

1. ✅ **Never commit .env files** - They are gitignored
2. ✅ **Use strong, randomly generated secrets** - Minimum 64 characters
3. ✅ **Rotate credentials regularly** - Every 90 days
4. ✅ **Use different secrets** - JWT_SECRET ≠ JWT_REFRESH_SECRET
5. ✅ **Enable 2FA** - On all accounts (Vercel, MongoDB Atlas, GitHub)
6. ✅ **Limit IP access** - In MongoDB Atlas when possible
7. ✅ **Monitor access logs** - Regularly check for suspicious activity
8. ✅ **Keep dependencies updated** - Run `npm audit` regularly

## 🔐 Security Checklist Before Going Live

- [ ] All secrets are randomly generated (not default values)
- [ ] Environment variables are set in Vercel (not in code)
- [ ] MongoDB Atlas password is strong and unique
- [ ] .env files are not committed to Git
- [ ] 2FA enabled on all accounts
- [ ] Latest security patches applied (`npm audit fix`)
- [ ] CORS properly configured
- [ ] Rate limiting implemented for API endpoints

## 📊 MongoDB Atlas Dashboard

Access your database:
1. Go to https://cloud.mongodb.com
2. Login with your credentials
3. View collections: `finance-tracker` database
4. Monitor performance and usage

## 🎉 Success!

Your MERN expense tracker is now live and accessible!

Share your URL: `https://your-project-name.vercel.app`

---

## 📚 Additional Resources

- **SECURITY_CHECKLIST.md** - Complete security setup and audit guide
- **MongoDB Atlas Security**: https://docs.atlas.mongodb.com/security/
- **Vercel Security**: https://vercel.com/docs/security
- **OWASP Top 10**: https://owasp.org/www-project-top-ten/
