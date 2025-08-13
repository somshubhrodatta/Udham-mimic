# Udyam Registration Clone

A complete full-stack application that replicates the first two steps of the Indian government's Udyam registration process for MSMEs.

## 🚀 Quick Start

### Option 1: Development Mode (Recommended)
```bash
# Run the setup script (if not already done)
chmod +x scripts/start-dev.sh
./scripts/start-dev.sh
```

### Option 2: Docker
```bash
chmod +x scripts/start-docker.sh
./scripts/start-docker.sh
```

### Manual Start
```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend
npm run dev
```

## 📱 Usage

1. **Visit**: http://localhost:3000
2. **Step 1**: Enter any 12-digit Aadhaar number (e.g., 123456789012)
3. **Mobile**: Enter mobile number starting with 6-9 (e.g., 9876543210)
4. **OTP**: Use `123456` for demo
5. **Step 2**: Enter PAN in format ABCDE1234F
6. **Complete**: Fill name and date of birth

## 🔧 API Endpoints

- **Health**: GET http://localhost:5000/api/health
- **Generate OTP**: POST http://localhost:5000/api/generate-otp
- **Verify OTP**: POST http://localhost:5000/api/verify-otp
- **Verify PAN**: POST http://localhost:5000/api/verify-pan

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: PostgreSQL (optional for basic demo)
- **Validation**: Custom validation rules

## 📁 Project Structure

```
udyam-registration-clone/
├── pages/index.js          # Main application
├── server/index.js         # Backend server
├── styles/globals.css      # Global styles
├── scripts/               # Setup scripts
└── README.md              # This file
```

## 🐛 Troubleshooting

### Port Issues
```bash
# Kill processes on ports 3000/5000
lsof -ti:3000 | xargs kill -9
lsof -ti:5000 | xargs kill -9
```

### Reset Project
```bash
rm -rf node_modules server/node_modules
npm install
cd server && npm install
```

## 📞 Support

- Check console logs for errors
- Ensure Node.js v18+ is installed
- Verify ports 3000 and 5000 are available
