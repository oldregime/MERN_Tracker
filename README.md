# Personal Finance Tracker (MERN Stack)

A comprehensive personal finance management application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) that runs entirely locally. Track expenses, manage income, set budgets, and visualize your financial progress with intuitive charts and reports.

## Features

- **User Authentication**: Secure signup, login with JWT, password reset, and OAuth support (Google, Facebook)
- **Expense Tracking**: Record, categorize, and manage your expenses
- **Income Management**: Track income from multiple sources
- **Budget Planning**: Set monthly budgets by category and monitor progress
- **Visual Reports**: Analyze spending habits with interactive charts and reports
- **Responsive Design**: Works seamlessly across devices

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14.x or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB Community Edition](https://www.mongodb.com/try/download/community) (local installation)
- [Visual Studio Code](https://code.visualstudio.com/) (recommended editor)

### MongoDB Installation Quick Guide

#### Windows:
1. Download MongoDB Community Server from the [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Run the installer and follow installation wizard (Complete installation recommended)
3. MongoDB should start automatically as a Windows service

#### macOS:
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Linux (Ubuntu):
```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -

# Create list file for MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list

# Reload package database
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
```

## Getting Started

Follow these steps to set up and run the project on your local machine:

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/personal-finance-tracker.git
cd personal-finance-tracker
```

### 2. Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Open .env and update the values as needed
# Particularly DATABASE_URL, JWT secrets, and OAuth credentials if using them
```

### 3. Setup Frontend

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Open .env and update values if needed
```

### 4. Run the Application

#### Option 1: Run Backend and Frontend Separately

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm start
```

#### Option 2: Run Both Concurrently (from root directory)

```bash
# Install concurrently in the root directory
npm init -y
npm install concurrently

# Add this to root package.json
# "scripts": {
#   "dev": "concurrently \"cd backend && npm run dev\" \"cd frontend && npm start\""
# }

npm run dev
```

### 5. Access the Application

Open your browser and navigate to:
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5000/api](http://localhost:5000/api)

## Environment Variables

### Backend (.env)

```
PORT=5000
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017/finance-tracker
JWT_SECRET=your_jwt_secret_key
JWT_ACCESS_EXPIRATION=1h
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRATION=7d
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_CALLBACK_URL=http://localhost:5000/api/auth/facebook/callback
```

### Frontend (.env)

```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_NAME=Personal Finance Tracker
```

## VS Code Debugging

Create a `.vscode/launch.json` file in the root directory with the following configuration:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/backend/server.js",
      "envFile": "${workspaceFolder}/backend/.env"
    },
    {
      "type": "chrome",
      "request": "launch",
      "name": "Debug Frontend",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/frontend"
    }
  ],
  "compounds": [
    {
      "name": "Debug Full Stack",
      "configurations": ["Debug Backend", "Debug Frontend"]
    }
  ]
}
```

## Project Structure

```
personal-finance-tracker/
├── backend/         # Express.js backend with MVC architecture
├── frontend/        # React.js frontend
├── .gitignore
└── README.md
```

## License

This project is licensed under the MIT License
