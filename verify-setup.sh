#!/bin/bash

# Setup Verification Script for Smart Bookmark App
# This script checks if everything is set up correctly before running

echo "🔍 Smart Bookmark App - Setup Verification"
echo "=========================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not installed"
    echo "   Install from: https://nodejs.org"
    exit 1
else
    NODE_VERSION=$(node -v)
    echo "✅ Node.js installed: $NODE_VERSION"
fi

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm not installed"
    exit 1
else
    NPM_VERSION=$(npm -v)
    echo "✅ npm installed: $NPM_VERSION"
fi

# Check node_modules
if [ ! -d "node_modules" ]; then
    echo "❌ Dependencies not installed"
    echo "   Run: npm install"
    exit 1
else
    echo "✅ Dependencies installed"
fi

# Check .env.local
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local not found"
    echo "   Create with: cp .env.local.example .env.local"
    exit 1
else
    echo "✅ .env.local exists"
    
    # Check if env vars are filled
    if grep -q "your-" ".env.local"; then
        echo "⚠️  Environment variables not configured"
        echo "   Edit .env.local with your Supabase credentials"
        exit 1
    else
        echo "✅ Environment variables appear configured"
    fi
fi

# Check required files
REQUIRED_FILES=(
    "app/page.tsx"
    "app/dashboard/page.tsx"
    "app/layout.tsx"
    "app/globals.css"
    "components/BookmarkForm.tsx"
    "components/BookmarkList.tsx"
    "lib/supabaseClient.ts"
    "DATABASE_SCHEMA.sql"
)

echo ""
echo "📁 Checking required files:"
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file"
    else
        echo "   ❌ $file missing"
        exit 1
    fi
done

echo ""
echo "=========================================="
echo "✅ All checks passed!"
echo ""
echo "Next steps:"
echo "1. Configure Supabase credentials in .env.local"
echo "2. Run database schema in Supabase SQL Editor"
echo "3. Configure Google OAuth in Supabase"
echo "4. Run: npm run dev"
echo ""
