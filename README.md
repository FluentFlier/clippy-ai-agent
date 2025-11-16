# 📎 Clippy AI Agent - Kirowween Hackathon 2024

> **Bringing back the nostalgia with modern AI!** A Windows 98-styled AI assistant that actually helps you be productive.

![Clippy AI Agent](https://img.shields.io/badge/Windows-98%20Style-blue?style=for-the-badge)
![AI Powered](https://img.shields.io/badge/AI-Powered-green?style=for-the-badge)
![Electron](https://img.shields.io/badge/Electron-App-purple?style=for-the-badge)

## 🎯 What is This?

Remember Clippy from Microsoft Office? We've brought him back as a **powerful AI assistant** with a retro Windows 98 aesthetic! This desktop app sits on your screen and helps you:

- 📄 **Summarize** documents and work
- ✉️ **Draft** professional emails
- 📋 **Organize** tasks and priorities
- ⚡ **Quick templates** for common workflows
- 📚 **History tracking** of all your interactions

## ✨ Features

### 🎨 Authentic Windows 98 UI
- Classic 3D borders and buttons
- Blue gradient title bars
- Retro color scheme (#c0c0c0 gray!)
- Hover effects just like the original

### 🤖 AI-Powered Intelligence
- **OpenAI GPT-3.5** integration (with API key)
- **Local LLM** support (node-llama-cpp)
- **Demo mode** with smart mock responses
- Multi-agent system for specialized tasks

### 🎭 Animated Clippy
- Original Clippy animations
- Draggable anywhere on screen
- Always on top, never in the way
- Smooth animations for different actions

### 💾 Smart Features
- **History tracking** - Never lose a response
- **Templates** - Pre-built prompts for common tasks
- **Settings** - Customize behavior and hotkeys
- **System tray** - Minimize when not needed

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repo
git clone <your-repo-url>
cd clippy-agent

# Install dependencies
npm install

# Run in development mode
npm run dev
```

### With AI (Optional)

For full AI capabilities, add your OpenAI API key:

```bash
# Create .env file
echo "OPENAI_API_KEY=your-key-here" > .env

# Restart the app
npm run dev
```

**Note:** The app works great in demo mode without an API key!

## 🎮 How to Use

1. **Click Clippy** to open the menu
2. **Choose an action:**
   - Summarize - Get a summary of your work
   - Draft Email - Generate professional emails
   - Organize - Create task lists and priorities
   - Templates - Use pre-built prompts
   - History - View past interactions

3. **Drag Clippy** anywhere on your screen
4. **Right-click** for settings
5. **Close button** (×) to quit

## 🏗️ Architecture

```
clippy-agent/
├── src/
│   ├── main/           # Electron main process
│   │   ├── index.ts    # App entry point
│   │   ├── modelRunner.ts  # AI integration
│   │   ├── database.ts     # SQLite history
│   │   └── ...
│   ├── renderer/       # React UI
│   │   ├── avatarWidget.tsx   # Main Clippy component
│   │   ├── chatWindow.tsx     # Menu system
│   │   ├── resultsWindow.tsx  # AI responses
│   │   └── ...
│   └── agents/         # AI agent personalities
├── public/
│   └── clippy/         # Animation assets
└── package.json
```

## 🎨 Tech Stack

- **Electron** - Desktop app framework
- **React** - UI components
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **SQLite** - Local database
- **OpenAI API** - AI backend
- **node-llama-cpp** - Local LLM support

## 🎯 Hackathon Highlights

### Why This Project Rocks:

1. **Nostalgia Factor** - Everyone loves Clippy!
2. **Actually Useful** - Real AI assistance, not just a gimmick
3. **Beautiful UI** - Authentic Windows 98 styling
4. **Smooth UX** - Draggable, always accessible, never intrusive
5. **Extensible** - Easy to add new agents and features

### Demo Points:

- Show Clippy animations
- Demonstrate summarization
- Generate an email
- Show history tracking
- Highlight Windows 98 styling

## 🔧 Configuration

Edit settings via right-click menu:

- **Hotkey** - Global shortcut to show/hide
- **Auto-start** - Launch on system startup
- **Monitoring** - Track document activity
- **Voice** - Enable text-to-speech

## 📝 Templates

Built-in templates for:
- Meeting summaries
- Email responses
- Task breakdowns
- Code documentation
- Project updates

## 🐛 Known Issues

- Local LLM requires model file (large download)
- First AI response may be slow
- Windows 98 styling is intentionally retro!

## 🚀 Future Ideas

- [ ] More character options (Merlin, Rover, F1)
- [ ] Voice input support
- [ ] Browser extension integration
- [ ] Team collaboration features
- [ ] Custom agent training

## 👥 Team

Built for Kirowween Hackathon 2024

## 📄 License

MIT License - Feel free to use and modify!

## 🙏 Credits

- Original Clippy animations from Microsoft
- Inspired by Felix Rieseberg's Clippy project
- Windows 98 UI design from Microsoft

---

**Made with ❤️ and nostalgia for Kirowween Hackathon 2024**

*"It looks like you're building something awesome. Would you like help?"* - Clippy
