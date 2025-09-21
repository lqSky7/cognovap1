#!/bin/bash

echo "🚀 Cognova Enhanced UI - Development Setup"
echo "========================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the frontend directory."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "🎨 Enhanced UI Features:"
echo "• OLED Dark Theme (#050505 background, #FF7900 accent)"
echo "• Interactive Tooltips on all components"
echo "• Onboarding Tour (runs once, can be restarted)"
echo "• Clickable Conversation History with modals"
echo "• Enhanced Journal with rich modals"
echo "• Full accessibility (ARIA labels, keyboard nav)"
echo ""

echo "🏃 Starting development server..."
echo "The app will be available at http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev