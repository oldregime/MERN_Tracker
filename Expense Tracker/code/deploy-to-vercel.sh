#!/bin/bash

echo "🚀 Deploying Personal Finance Tracker to Vercel"
echo "================================================"
echo ""

# Check if vercel is available
if ! command -v npx &> /dev/null; then
    echo "❌ npx not found. Please install Node.js"
    exit 1
fi

echo "✅ Prerequisites check passed"
echo ""

# Login to Vercel
echo "📝 Step 1: Login to Vercel"
echo "Please follow the prompts to authenticate..."
npx vercel login

echo ""
echo "🔨 Step 2: Initial Deployment"
echo "This will deploy your app and create a project on Vercel"
echo ""

# Deploy to Vercel
npx vercel

echo ""
echo "⚙️  Step 3: Configure Environment Variables"
echo "You need to add these environment variables in Vercel Dashboard:"
echo ""
echo "1. Go to: https://vercel.com/dashboard"
echo "2. Select your project"
echo "3. Go to Settings → Environment Variables"
echo "4. Add the following variables:"
echo ""
echo "   DATABASE_URL = mongodb+srv://mernexptrack:Asdf!1234@cluster0.i7llnad.mongodb.net/finance-tracker?retryWrites=true&w=majority"
echo "   NODE_ENV = production"
echo "   JWT_SECRET = 5cfea10cc02da694101ed82190c5c01a8272ef26b1e758bf114f9dc2253fdbd2"
echo "   JWT_ACCESS_EXPIRATION = 1h"
echo "   JWT_REFRESH_SECRET = your_refresh_token_secret_change_this_in_production"
echo "   JWT_REFRESH_EXPIRATION = 7d"
echo ""
echo "5. Select 'Production', 'Preview', and 'Development' for each variable"
echo "6. Click 'Save'"
echo ""
read -p "Press Enter after you've added the environment variables..."

echo ""
echo "🚀 Step 4: Production Deployment"
echo "Deploying to production with environment variables..."
npx vercel --prod

echo ""
echo "✅ Deployment Complete!"
echo ""
echo "Your app is now live! 🎉"
echo ""
echo "Next steps:"
echo "1. Visit your Vercel dashboard to get your production URL"
echo "2. Test the application by registering a new user"
echo "3. Verify data is being saved to MongoDB Atlas"
echo ""
echo "For more details, see DEPLOYMENT_GUIDE.md"
