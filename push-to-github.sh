#!/bin/bash

# Clippy AI Agent - GitHub Push Script
# Run this after creating your GitHub repository

echo "📎 Clippy AI Agent - GitHub Setup"
echo "=================================="
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "Initializing git repository..."
    git init
fi

# Get GitHub username
echo "Enter your GitHub username:"
read username

# Get repository name (default: clippy-ai-agent)
echo "Enter repository name (default: clippy-ai-agent):"
read reponame
reponame=${reponame:-clippy-ai-agent}

echo ""
echo "Setting up repository: https://github.com/$username/$reponame"
echo ""

# Add all files
echo "Adding files..."
git add .

# Commit
echo "Creating commit..."
git commit -m "Initial commit - Clippy AI Agent for Kirowween Hackathon 2024"

# Add remote
echo "Adding remote..."
git remote remove origin 2>/dev/null
git remote add origin https://github.com/$username/$reponame.git

# Push
echo "Pushing to GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "✅ Done! Your repo is live at:"
echo "https://github.com/$username/$reponame"
echo ""
echo "Next steps:"
echo "1. Add topics/tags on GitHub"
echo "2. Take screenshots"
echo "3. Share your repo!"
echo ""
echo "Good luck at Kirowween Hackathon! 🎉"
