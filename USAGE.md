# Clippy Agent - Usage Guide

## 🚀 Getting Started

### Installation
```bash
cd clippy-agent
npm install
npm run dev
```

## ⌨️ Hotkeys

### Default Hotkey
- **Mac:** `Cmd+Shift+C`
- **Windows:** `Ctrl+Shift+C`

This hotkey will show/hide Clippy from anywhere on your system.

### Changing the Hotkey
1. Right-click Clippy → **Settings**
2. Go to **General** tab
3. Change "Toggle Hotkey" field
4. Examples:
   - `CommandOrControl+Shift+C` (default)
   - `Alt+C`
   - `CommandOrControl+Space`
   - `Shift+Alt+H`
5. Click **Save**

### Hotkey Format
- `CommandOrControl` = Cmd (Mac) or Ctrl (Windows)
- `Alt` = Option (Mac) or Alt (Windows)
- `Shift` = Shift key
- Combine with `+` (e.g., `CommandOrControl+Shift+C`)

## 🎤 Voice Features

### Enable Voice
1. Right-click Clippy → **Settings**
2. Go to **General** tab
3. Check ✅ **"Enable voice responses"**
4. Click **Save**

### Using Voice
Once enabled, Clippy will automatically speak all responses out loud!

**Manual Control:**
- When a result window appears, click **🔊 Speak** to hear it
- Click **🔇 Stop** to stop speaking
- Voice works even if auto-speak is disabled

### Voice Settings
- Uses your system's default voice
- Adjustable rate, pitch, and volume (in code)
- Works on all platforms (Mac, Windows, Linux)

## 🎭 Characters

### Available Characters
1. **📎 Clippy** - Classic assistant (has animations)
2. **🧙 Merlin** - Wise wizard (formal, mystical)
3. **🐕 Rover** - Friendly dog (enthusiastic, playful)
4. **🤖 F1** - Tech robot (technical, precise)

### Switching Characters
1. Click Clippy
2. Select **🎭 Character**
3. Choose your character
4. Character changes immediately!

Each character has a unique personality and response style.

## ⚡ Quick Templates

### Using Templates
1. Click Clippy
2. Select **⚡ Templates**
3. Choose from 8 built-in templates:
   - 📊 Weekly Report
   - 📝 Meeting Notes
   - 📧 Follow-up Email
   - 💌 Thank You Email
   - 🎯 Project Plan
   - 🐛 Bug Report
   - ☀️ Daily Standup
   - 👀 Code Review

### Template Categories
- **Email** - Professional email drafts
- **Document** - Reports, notes, plans
- **Task** - Standup updates, task lists
- **Custom** - Your own templates (coming soon)

## 📚 History

### Viewing History
1. Click Clippy
2. Select **📚 History**
3. Search through all past interactions
4. Click any entry to re-open it

### History Features
- Full-text search
- Delete individual entries
- Clear all history
- Persistent across restarts

## 📊 Dashboard

### Analytics
1. Click Clippy
2. Select **📊 Dashboard**
3. View last 7 days:
   - Documents opened
   - Summaries generated
   - Emails drafted
   - Tasks organized
   - Most used app

## ⚙️ Settings

### General Tab
- ✅ Launch at startup
- ⌨️ Toggle hotkey
- 🔔 Enable monitoring
- 🎤 Enable voice responses
- 🎨 Theme selection

### Monitoring Tab
- Document threshold (3-10)
- Time window (5-30 minutes)

### Apps Tab
- Select which apps to monitor
- Pre-configured: Word, Excel, Code, Chrome, etc.

## 🎨 Themes

### Available Themes
1. **Retro** - Windows 98 style (default)
2. **Light** - Modern light theme
3. **Dark** - Dark mode

### Changing Theme
1. Right-click Clippy → **Settings**
2. Go to **General** tab
3. Select **Theme** dropdown
4. Choose your theme
5. Click **Save**

## 🖱️ Controls

### Mouse Actions
- **Left Click** - Open menu
- **Right Click** - Open settings
- **Drag** - Move Clippy anywhere
- **× Button** - Close app completely

### System Tray
- Right-click tray icon for:
  - Show Clippy
  - Hide Clippy
  - Settings
  - Quit

## 💡 Tips

### Productivity Boost
1. Set up your hotkey for quick access
2. Enable voice for hands-free operation
3. Use templates for common tasks
4. Check dashboard weekly for insights

### Best Practices
- Keep monitoring enabled for proactive help
- Use the right character for the task
- Save frequently used templates
- Review history for past work

### Troubleshooting
- **Hotkey not working?** Check Settings → General
- **Voice not working?** Enable in Settings → General
- **Clippy disappeared?** Use system tray or hotkey
- **App won't start?** Check console for errors

## 🔧 Advanced

### Custom Hotkeys
You can use any combination:
- Single key: `F1`, `F2`, etc.
- With modifiers: `CommandOrControl+Alt+C`
- Multiple modifiers: `CommandOrControl+Shift+Alt+C`

### Voice Customization
Edit `src/main/voiceManager.ts` to customize:
- Speech rate (default: 1.0)
- Pitch (default: 1.0)
- Volume (default: 0.8)
- Voice selection

### Adding Custom Templates
Edit `src/main/templateManager.ts` to add your own templates with custom prompts.

## 📖 Quick Reference

| Action | Shortcut |
|--------|----------|
| Show/Hide | `Cmd/Ctrl+Shift+C` |
| Open Menu | Left Click |
| Settings | Right Click |
| Move | Click & Drag |
| Close | × Button |

| Feature | Location |
|---------|----------|
| Templates | Menu → ⚡ Templates |
| History | Menu → 📚 History |
| Dashboard | Menu → 📊 Dashboard |
| Character | Menu → 🎭 Character |
| Settings | Right Click |

## 🎯 Common Tasks

### Generate Weekly Report
1. Click Clippy
2. ⚡ Templates → 📊 Weekly Report
3. Wait for AI to generate
4. 🔊 Speak to hear it
5. 📋 Copy to clipboard

### Draft Follow-up Email
1. Click Clippy
2. ⚡ Templates → 📧 Follow-up Email
3. Review and edit
4. Copy to email client

### Check Productivity
1. Click Clippy
2. 📊 Dashboard
3. Review last 7 days
4. Identify patterns

Enjoy using Clippy! 📎✨
