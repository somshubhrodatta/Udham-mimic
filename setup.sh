#!/bin/bash

# Udyam Registration Clone Development Setup Script
# This script sets up the development environment for the Udyam Registration Clone

set -e

echo "🚀 Setting up Udyam Registration Clone development environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd udyam-registration-clone
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd server
npm install
cd ..

# Make start-dev.sh executable
echo "🔧 Making start-dev.sh executable..."
chmod +x scripts/start-dev.sh

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    local missing_tools=()
    
    if ! command_exists node; then
        missing_tools+=("Node.js (v18+)")
    else
        node_version=$(node --version | cut -d'.' -f1 | sed 's/v//')
        if [ "$node_version" -lt 18 ]; then
            missing_tools+=("Node.js v18+ (current: $(node --version))")
        fi
    fi
    
    if ! command_exists npm; then
        missing_tools+=("npm")
    fi
    
    if ! command_exists git; then
        missing_tools+=("git")
    fi
    
    if [ ${#missing_tools[@]} -ne 0 ]; then
        log_error "Missing required tools:"
        for tool in "${missing_tools[@]}"; do
            echo "  - $tool"
        done
        log_info "Please install the missing tools and run this script again."
        log_info "Visit: https://nodejs.org/ to install Node.js"
        exit 1
    fi
    
    log_success "All prerequisites are installed!"
}

# Create project structure
create_project_structure() {
    log_info "Creating project structure..."
    
    # Main directories
    mkdir -p components/{ui,forms,layout}
    mkdir -p pages/api
    mkdir -p styles
    mkdir -p utils
    mkdir -p hooks
    mkdir -p tests
    mkdir -p public/{images,icons}
    mkdir -p server/{routes,middleware,utils,services,tests,config}
    mkdir -p prisma/migrations
    mkdir -p scraper/screenshots
    mkdir -p scripts
    mkdir -p docs
    mkdir -p logs
    
    # Create .gitkeep files for empty directories
    touch logs/.gitkeep
    touch prisma/migrations/.gitkeep
    touch public/images/.gitkeep
    touch public/icons/.gitkeep
    
    log_success "Project structure created!"
}

# Create package.json files
create_package_files() {
    log_info "Creating package.json files..."
    
    # Frontend package.json
    cat > package.json << 'EOF'
{
  "name": "udyam-registration-clone",
  "version": "1.0.0",
  "description": "A complete clone of Udyam registration form steps 1 & 2",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "lucide-react": "0.292.0"
  },
  "devDependencies": {
    "autoprefixer": "10.4.16",
    "postcss": "8.4.31",
    "tailwindcss": "3.3.0",
    "eslint": "8.53.0",
    "eslint-config-next": "14.0.0"
  }
}
EOF
    
    # Backend package.json
    cat > server/package.json << 'EOF'
{
  "name": "udyam-backend",
  "version": "1.0.0",
  "description": "Backend API for Udyam Registration Clone",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "@prisma/client": "^5.6.0",
    "validator": "^13.11.0",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "prisma": "^5.6.0",
    "jest": "^29.7.0",
    "supertest": "^6.3.3"
  }
}
EOF
    
    log_success "Package.json files created!"
}

# Create configuration files
create_config_files() {
    log_info "Creating configuration files..."
    
    # Tailwind config
    cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
    },
  },
  plugins: [],
}
EOF
    
    # PostCSS config
    cat > postcss.config.js << 'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF
    
    # Next.js config
    cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig
EOF
    
    # Environment files
    cat > .env.example << 'EOF'
# Frontend Environment Variables
NEXT_PUBLIC_API_URL=http://localhost:5000
EOF
    
    cat > .env.local << 'EOF'
# Frontend Environment Variables
NEXT_PUBLIC_API_URL=http://localhost:5000
EOF
    
    cat > server/.env.example << 'EOF'
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL="postgresql://udyam_user:udyam_password@localhost:5432/udyam_db?schema=public"

# Security
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
EOF
    
    cat > server/.env << 'EOF'
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL="postgresql://udyam_user:udyam_password@localhost:5432/udyam_db?schema=public"

# Security
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
EOF
    
    # Global CSS
    cat > styles/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html,
  body {
    font-family: 'Inter', system-ui, sans-serif;
  }
}

@layer components {
  .btn {
    @apply font-medium rounded-lg px-4 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2;
  }
  
  .btn-primary {
    @apply bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500;
  }
  
  .btn-secondary {
    @apply bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500;
  }
}
EOF
    
    # App.js
    cat > pages/_app.js << 'EOF'
import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
EOF
    
    # Prisma schema
    cat > prisma/schema.prisma << 'EOF'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model UdyamRegistration {
  id                String    @id @default(cuid())
  
  // Step 1: Aadhaar & Mobile Verification
  aadhaarNumber     String    @unique @db.VarChar(12)
  mobileNumber      String?   @db.VarChar(10)
  aadhaarVerified   Boolean   @default(false)
  mobileVerified    Boolean   @default(false)
  
  // Step 2: PAN Verification
  panNumber         String?   @unique @db.VarChar(10)
  nameAsPerPan      String?   @db.VarChar(100)
  dateOfBirth       DateTime?
  panVerified       Boolean   @default(false)
  
  // Registration Status
  status            RegistrationStatus @default(INITIATED)
  
  // Metadata
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
  
  @@map("udyam_registrations")
  @@index([aadhaarNumber])
  @@index([panNumber])
  @@index([status])
}

enum RegistrationStatus {
  INITIATED
  OTP_SENT
  AADHAAR_VERIFIED
  PAN_VERIFIED
  COMPLETED
  REJECTED
}
EOF
    
    # .gitignore
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Next.js
.next/
out/

# Database
*.db
*.sqlite

# Logs
logs/
*.log

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/

# Prisma
prisma/migrations/
!prisma/migrations/.gitkeep
EOF
    
    log_success "Configuration files created!"
}

# Install dependencies
install_dependencies() {
    log_info "Installing frontend dependencies..."
    npm install
    
    log_info "Installing backend dependencies..."
    cd server
    npm install
    cd ..
    
    log_success "All dependencies installed!"
}

# Create basic server file
create_basic_server() {
    log_info "Creating basic server file..."
    
    cat > server/index.js << 'EOF'
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com'] 
    : ['http://localhost:3000'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

// Basic API routes
app.post('/api/generate-otp', (req, res) => {
  const { aadhaar, mobile } = req.body;
  
  // Basic validation
  if (!aadhaar || !mobile) {
    return res.status(400).json({
      success: false,
      message: 'Aadhaar and mobile are required'
    });
  }
  
  // Simulate OTP generation
  res.json({
    success: true,
    message: 'OTP sent successfully',
    data: {
      mobile: mobile.replace(/(\d{6})(\d{4})/, '$1****')
    }
  });
});

app.post('/api/verify-otp', (req, res) => {
  const { aadhaar, mobile, otp } = req.body;
  
  if (otp === '123456') {
    res.json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        aadhaarVerified: true,
        mobileVerified: true
      }
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Invalid OTP. Use 123456 for demo.'
    });
  }
});

app.post('/api/verify-pan', (req, res) => {
  const { aadhaar, pan, name, dateOfBirth } = req.body;
  
  // Simulate PAN verification
  res.json({
    success: true,
    message: 'PAN verified successfully',
    data: {
      panVerified: true,
      nameMatch: true,
      dobMatch: true
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
EOF
    
    log_success "Basic server created!"
}

# Create start scripts
create_start_scripts() {
    log_info "Creating start scripts..."
    
    # Create start script for development
    cat > scripts/start-dev.sh << 'EOF'
#!/bin/bash

# Start development servers
echo "Starting Udyam Registration Clone in development mode..."

# Kill any existing processes on these ports
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:5000 | xargs kill -9 2>/dev/null || true

# Start backend in background
echo "Starting backend server..."
cd server
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "Starting frontend server..."
npm run dev &
FRONTEND_PID=$!

# Function to cleanup on script exit
cleanup() {
    echo "Shutting down servers..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    exit
}

# Set trap to cleanup on script exit
trap cleanup INT TERM

echo "✅ Development servers started!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:5000"
echo "Press Ctrl+C to stop all servers"

# Wait for user interrupt
wait
EOF

    chmod +x scripts/start-dev.sh
    
    # Create Docker start script
    cat > scripts/start-docker.sh << 'EOF'
#!/bin/bash

echo "Starting Udyam Registration Clone with Docker..."

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Build and start containers
docker-compose up -d --build

echo "✅ Docker containers started!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:5000"

# Show container status
docker-compose ps
EOF

    chmod +x scripts/start-docker.sh
    
    log_success "Start scripts created!"
}

# Create README
create_readme() {
    log_info "Creating README file..."
    
    cat > README.md << 'EOF'
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
EOF
    
    log_success "README created!"
}

# Main setup function
main() {
    clear
    echo "======================================"
    echo "  Udyam Registration Clone Setup"
    echo "======================================"
    echo ""
    
    # Get project name
    read -p "Enter project directory name [udyam-registration-clone]: " PROJECT_NAME
    PROJECT_NAME=${PROJECT_NAME:-udyam-registration-clone}
    
    # Create and enter project directory
    if [ -d "$PROJECT_NAME" ]; then
        log_warning "Directory '$PROJECT_NAME' already exists."
        read -p "Continue anyway? [y/N]: " CONTINUE
        if [[ ! $CONTINUE =~ ^[Yy]$ ]]; then
            log_info "Setup cancelled."
            exit 0
        fi
    fi
    
    mkdir -p "$PROJECT_NAME"
    cd "$PROJECT_NAME"
    
    log_info "Setting up Udyam Registration Clone in: $(pwd)"
    echo ""
    
    # Run setup steps
    check_prerequisites
    create_project_structure
    create_package_files
    create_config_files
    install_dependencies
    create_basic_server
    create_start_scripts
    create_readme
    
    echo ""
    echo "======================================"
    log_success "Setup completed successfully!"
    echo "======================================"
    echo ""
    
    log_info "Next steps:"
    echo "1. cd $PROJECT_NAME"
    echo "2. ./scripts/start-dev.sh"
    echo "3. Visit http://localhost:3000"
    echo ""
    
    log_info "Demo credentials:"
    echo "• Aadhaar: Any 12-digit number (e.g., 123456789012)"
    echo "• Mobile: Any 10-digit number starting with 6-9"
    echo "• OTP: 123456"
    echo "• PAN: Any valid format (e.g., ABCDE1234F)"
    echo ""
    
    # Ask if user wants to start now
    read -p "Would you like to start the application now? [y/N]: " START_NOW
    if [[ $START_NOW =~ ^[Yy]$ ]]; then
        log_info "Starting application..."
        ./scripts/start-dev.sh
    else
        log_info "Setup complete! Run './scripts/start-dev.sh' when ready."
    fi
}

# Run main function
main "$@"