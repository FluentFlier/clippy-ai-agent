# 🚀 Quick Start Guide - Clippy AI Agent

## For Hackathon Judges & Demo

### 1. Install & Run (2 minutes)

```bash
# Install dependencies
npm install

# Start the app
npm run dev
```

That's it! Clippy will appear in the bottom-right corner of your screen.

### 2. Try These Features

#### Basic Usage:
1. **Click Clippy** → Menu appears
2. **Click "Summarize"** → See AI-generated summary
3. **Click "Draft Email"** → Get a professional email draft
4. **Click "Organize"** → Get task organization

#### Advanced Features:
- **Drag Clippy** anywhere on screen
- **Right-click** → Settings menu
- **Click History** → See all past interactions
- **Click Templates** → Pre-built prompts

### 3. Demo Mode vs AI Mode

**Demo Mode (Default):**
- Works immediately, no setup
- Smart mock responses
- Perfect for quick demos
- Shows all UI features

**AI Mode (Optional):**
```bash
# Add your OpenAI key
export OPENAI_API_KEY="sk-..."

# Restart app
npm run dev
```

Now you get real GPT-3.5 responses!

### 4. Key Demo Points

**Show these to impress:**

1. **Retro Aesthetic** 
   - Windows 98 styling
   - Classic 3D borders
   - Blue gradient title bars

2. **Smooth Animations**
   - Clippy animates when thinking
   - Smooth menu transitions
   - Draggable interface

3. **AI Intelligence**
   - Contextual responses
   - Professional output
   - History tracking

4. **User Experience**
   - Always accessible
   - Never intrusive
   - Quick actions

### 5. Troubleshooting

**Clippy doesn't appear?**
- Check bottom-right corner
- Try Alt+Tab to find window
- Restart: `npm run dev`

**Menu cut off?**
- Drag Clippy to center of screen
- Menu auto-positions below Clippy

**AI not working?**
- Demo mode works without AI
- Add OPENAI_API_KEY for real AI
- Check console for errors

### 6. Keyboard Shortcuts

- `Ctrl+Shift+C` - Show/hide Clippy (configurable)
- `Right-click` - Settings
- `×` button - Quit app

### 7. Project Structure

```
Key Files:
├── src/renderer/avatarWidget.tsx  ← Main Clippy UI
├── src/renderer/chatWindow.tsx    ← Menu system
├── src/main/modelRunner.ts        ← AI integration
└── src/main/index.ts              ← App entry
```

### 8. Customization

**Change Clippy's position:**
- Just drag him!

**Change hotkey:**
- Right-click → Settings → General

**Add templates:**
- Edit `src/main/templateManager.ts`

### 9. Building for Production

```bash
# Build the app
npm run build

# Package for distribution
npm run start
```

### 10. Demo Script

**Perfect 2-minute demo:**

1. **Open app** (5 sec)
   - "Here's Clippy, our AI assistant"

2. **Show menu** (10 sec)
   - Click Clippy
   - "Windows 98 styled menu with AI actions"

3. **Summarize** (30 sec)
   - Click Summarize
   - Show loading animation
   - Display result
   - "Real AI-generated summary"

4. **Draft Email** (30 sec)
   - Click Draft Email
   - Show professional output
   - "Ready to copy and use"

5. **Show History** (20 sec)
   - Click History
   - "All interactions saved"

6. **Drag demo** (10 sec)
   - Drag Clippy around
   - "Always accessible, never intrusive"

7. **Wrap up** (15 sec)
   - "Nostalgia meets modern AI"
   - "Built with Electron, React, TypeScript"

---

## Need Help?

- Check README.md for full documentation
- Look at console logs for debugging
- All features work in demo mode!

**Good luck with your demo! 🎉**
