# 🔒 Security Checklist & Setup Guide

## ⚠️ IMMEDIATE ACTIONS REQUIRED

If your credentials were ever exposed (committed to Git, shared publicly, etc.), follow these steps immediately:

### 1. Rotate MongoDB Atlas Password

1. Go to https://cloud.mongodb.com
2. Navigate to **Database Access**
3. Find your database user (e.g., `mernexptrack`)
4. Click **Edit**
5. Click **Edit Password**
6. Choose **Autogenerate Secure Password** or create a strong password (minimum 16 characters)
7. Copy the new password
8. Click **Update User**

### 2. Update Connection String

After changing MongoDB password, update your connection string in:

**Local Development:**
```bash
# Edit backend/.env file
DATABASE_URL=mongodb+srv://<username>:<NEW_PASSWORD>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

**Vercel Production:**
```bash
# Update environment variable
vercel env rm DATABASE_URL production
vercel env add DATABASE_URL
# Paste new connection string when prompted
```

### 3. Generate New JWT Secrets

**Generate new JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and update:

**Local Development:**
```bash
# Edit backend/.env file
JWT_SECRET=<paste_new_secret_here>
```

**Vercel Production:**
```bash
vercel env rm JWT_SECRET production
vercel env add JWT_SECRET
# Paste new secret when prompted
```

**Generate new JWT_REFRESH_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Update the same way as JWT_SECRET.

### 4. Redeploy Application

```bash
vercel --prod
```

---

## 🛡️ Complete Security Setup

### Backend Environment Variables

Your `backend/.env` file should look like this (with your actual values):

```env
# MongoDB Atlas Connection
DATABASE_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=<64_char_random_hex_string>
JWT_ACCESS_EXPIRATION=1h
JWT_REFRESH_SECRET=<different_64_char_random_hex_string>
JWT_REFRESH_EXPIRATION=7d

# Environment
NODE_ENV=development
```

**Generate secrets using:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Vercel Environment Variables

Add these in Vercel Dashboard or via CLI:

```bash
# Required for production
DATABASE_URL=<your_mongodb_connection_string>
JWT_SECRET=<generated_secret>
JWT_REFRESH_SECRET=<different_generated_secret>
NODE_ENV=production
JWT_ACCESS_EXPIRATION=1h
JWT_REFRESH_EXPIRATION=7d
```

---

## 🔐 Security Best Practices

### ✅ Credentials Management

- [ ] Never commit `.env` files to Git
- [ ] Never hardcode credentials in source code
- [ ] Use different secrets for different environments
- [ ] Use environment variables for all sensitive data
- [ ] Store backup of credentials in secure password manager

### ✅ Password Security

- [ ] MongoDB password: minimum 16 characters, mix of letters/numbers/symbols
- [ ] JWT secrets: minimum 64 characters, randomly generated
- [ ] Different secrets for JWT_SECRET and JWT_REFRESH_SECRET
- [ ] Rotate passwords every 90 days

### ✅ MongoDB Atlas Security

- [ ] Enable IP whitelist (use `0.0.0.0/0` only for development)
- [ ] Use database-specific users (not organization admin)
- [ ] Enable audit logs
- [ ] Regular backup schedule configured
- [ ] Enable 2FA on MongoDB Atlas account

### ✅ Vercel Security

- [ ] Enable 2FA on Vercel account
- [ ] Use separate environment variables for preview/production
- [ ] Regularly review deployment logs
- [ ] Enable deployment protection
- [ ] Use custom domain with HTTPS

### ✅ Application Security

- [ ] CORS properly configured (not allowing all origins in production)
- [ ] Rate limiting enabled on API endpoints
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (using parameterized queries)
- [ ] XSS prevention (sanitize user inputs)
- [ ] CSRF protection enabled

### ✅ Dependency Security

Run regularly:
```bash
npm audit
npm audit fix
```

Check for outdated packages:
```bash
npm outdated
```

---

## 🚨 Git Security

### Check if Secrets Were Committed

```bash
# Search git history for sensitive data
git log --all --full-history --source --grep="DATABASE_URL"
git log --all --full-history --source --grep="JWT_SECRET"
git log --all --full-history --source -S "mongodb+srv"
```

### Remove Secrets from Git History

If secrets were found in Git history:

**Option 1: Using BFG Repo-Cleaner (Recommended)**

```bash
# Download BFG from https://rtyley.github.io/bfg-repo-cleaner/
java -jar bfg.jar --delete-files .env
java -jar bfg.jar --replace-text passwords.txt
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force
```

**Option 2: Using git filter-branch**

```bash
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch backend/.env" \
  --prune-empty --tag-name-filter cat -- --all

git push origin --force --all
git push origin --force --tags
```

⚠️ **WARNING**: This rewrites Git history. Coordinate with team members.

### Update .gitignore

Ensure your `.gitignore` includes:

```gitignore
# Environment Variables
.env
.env.local
.env.development
.env.production
.env.test

# Dependencies
node_modules/

# Build
build/
dist/

# Logs
*.log
npm-debug.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
```

---

## 📋 Security Audit Checklist

Perform this audit monthly:

### Database Security
- [ ] Review MongoDB Atlas access logs
- [ ] Check for unusual connection patterns
- [ ] Verify IP whitelist is current
- [ ] Confirm backup schedule is running
- [ ] Review database user permissions

### Application Security
- [ ] Run `npm audit` and fix vulnerabilities
- [ ] Update dependencies to latest secure versions
- [ ] Review Vercel deployment logs for errors
- [ ] Check for failed authentication attempts
- [ ] Verify rate limiting is working

### Access Control
- [ ] Review who has access to Vercel project
- [ ] Review who has access to MongoDB Atlas
- [ ] Review who has access to Git repository
- [ ] Verify 2FA is enabled for all team members
- [ ] Check for any unauthorized API keys

### Code Review
- [ ] No hardcoded credentials in codebase
- [ ] All user inputs are validated
- [ ] Sensitive data is encrypted
- [ ] Error messages don't expose system info
- [ ] CORS is properly configured

---

## 🆘 Security Incident Response

If you suspect a security breach:

1. **Immediately rotate all credentials**
   - MongoDB password
   - JWT secrets
   - Any API keys

2. **Review access logs**
   - MongoDB Atlas logs
   - Vercel deployment logs
   - Application logs

3. **Check for unauthorized changes**
   - Git commit history
   - Database records
   - Vercel deployments

4. **Notify affected users** (if applicable)
   - Force password reset
   - Invalidate all active sessions
   - Send security notification

5. **Document the incident**
   - What happened
   - When it was discovered
   - Actions taken
   - Prevention measures

---

## 📞 Security Resources

- MongoDB Atlas Security: https://docs.atlas.mongodb.com/security/
- Vercel Security: https://vercel.com/docs/security
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- Node.js Security: https://nodejs.org/en/docs/guides/security/
- JWT Best Practices: https://tools.ietf.org/html/rfc8725

---

## ✅ Quick Reference

**Generate secure secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Check environment variables in Vercel:**
```bash
vercel env ls
```

**Update environment variable:**
```bash
vercel env rm VARIABLE_NAME production
vercel env add VARIABLE_NAME
```

**View application logs:**
```bash
vercel logs --follow
```

**Check for vulnerabilities:**
```bash
npm audit
```

---

## 🎯 Base64 Encoding (NOT Recommended)

**Important Note**: Base64 encoding is NOT encryption. It only obscures data and can be easily decoded. The proper security approach is:

1. ✅ Use environment variables (`.env` files)
2. ✅ Never commit `.env` files to Git
3. ✅ Use secure secrets management (Vercel environment variables)
4. ❌ Don't rely on Base64 encoding for security

If you received a pull request suggesting Base64 encoding of credentials:
- This does NOT improve security
- Focus on proper environment variable management instead
- Keep credentials in `.env` files and Vercel environment variables
- Ensure `.env` files are in `.gitignore`

---

## 📝 Action Items for New Deployment

Before deploying to production:

1. [ ] Generate new JWT_SECRET (64+ characters)
2. [ ] Generate new JWT_REFRESH_SECRET (different from JWT_SECRET)
3. [ ] Create strong MongoDB password (if not already done)
4. [ ] Update all `.env` files with new credentials
5. [ ] Add all environment variables to Vercel
6. [ ] Verify `.env` files are in `.gitignore`
7. [ ] Check Git history for exposed credentials
8. [ ] Enable 2FA on all accounts
9. [ ] Configure MongoDB Atlas IP whitelist
10. [ ] Run `npm audit` and fix vulnerabilities
11. [ ] Test authentication flows
12. [ ] Verify CORS configuration
13. [ ] Deploy to Vercel
14. [ ] Test production deployment
15. [ ] Monitor logs for errors

---

**Last Updated**: November 10, 2025
**Next Review**: February 10, 2026
