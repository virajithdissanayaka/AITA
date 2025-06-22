import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Copy, Check, Play, Square, RotateCw } from 'lucide-react';
import { askAI } from '../services/api'; 


const EnhancedTerminal = () => {
  const [history, setHistory] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [sessionStats, setSessionStats] = useState({ commands: 0, uptime: Date.now() });
  const [isSelecting, setIsSelecting] = useState(false);
  const [systemInfo, setSystemInfo] = useState({
    browser: '',
    browserVersion: '',
    os: '',
    platform: ''
  });
  
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize terminal with enhanced welcome message
  useEffect(() => {
    const welcomeMessages = [
      { type: 'header', content: '╔══════════════════════════════════════════════════════════════╗' },
      { type: 'header', content: '║                  AITA - AI Terminal Companion                ║' },
      { type: 'header', content: '║                   Your Smart Linux Assistant                 ║' },
      { type: 'header', content: '╚══════════════════════════════════════════════════════════════╝' },
      { type: 'output', content: '' },
      { type: 'success', content: 'System initialized successfully!' },
      { type: 'info', content: 'AI service connected - Groq llama-3.3-70b-versatile active' },
      { type: 'warning', content: 'Terminal ready for commands' },
      { type: 'output', content: '' },
      { type: 'ai-response', content: '┌─ Quick Start Guide ─────────────────────────────────────┐' },
      { type: 'ai-response', content: '│ Type commands naturally or use these shortcuts:         │' },
      { type: 'ai-response', content: '│                                                         │' },
      { type: 'ai-response', content: '│ help        → Show all available commands               │' },
      { type: 'ai-response', content: '│ clear       → Clear terminal screen                     │' },
      { type: 'ai-response', content: '│ about       → Learn about AITA                          │' },
      { type: 'ai-response', content: '│ status      → Check system status                       │' },
      { type: 'ai-response', content: '│                                                         │' },
      { type: 'ai-response', content: '│ explain: ls -la    → Explain shell commands             │' },
      { type: 'ai-response', content: '│ script: backup     → Generate bash scripts              │' },
      { type: 'ai-response', content: '│ debug: error msg   → Debug error messages               │' },
      { type: 'ai-response', content: '│ man: grep          → Summarize man pages                │' },
      { type: 'ai-response', content: '│ install: nginx     → Package installation help          │' },
      { type: 'ai-response', content: '│ security: ssh      → Security hardening tips            │' },
      { type: 'ai-response', content: '└─────────────────────────────────────────────────────────┘' },
      { type: 'output', content: '' },
      { type: 'output', content: '' }
    ];
    setHistory(welcomeMessages);
  }, []);

  const copyToClipboard = async (content, index) => {
    try {
      // Remove ANSI codes and formatting for cleaner copy
      const cleanContent = content.replace(/[^\x20-\x7E]/g, '').trim();
      await navigator.clipboard.writeText(cleanContent);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const showHelp = () => [
    { type: 'warning', content:     '╭─ AITA Command Reference ───────────────────────────────────────╮' },
    { type: 'ai-response', content: '│                                                                │' },
    { type: 'success', content:     '│ System Commands:                                               │' },
    { type: 'output', content:      '│   help       → Show this comprehensive help guide              │' },
    { type: 'output', content:      '│   clear      → Clear terminal screen and history               │' },
    { type: 'output', content:      '│   about      → About AITA and its capabilities                 │' },
    { type: 'output', content:      '│   status     → Display detailed system status                  │' },
    { type: 'output', content:      '│   history    → Show command history                            │' },
    { type: 'ai-response', content: '│                                                                │' },
    { type: 'success', content:     '│ AI-Powered Commands:                                           │' },
    { type: 'output', content:      '│   explain: <command>     → Get detailed command explanations   │' },
    { type: 'output', content:      '│   script: <description>  → Generate custom bash scripts        │' },
    { type: 'output', content:      '│   debug: <error>         → Debug and fix error messages        │' },
    { type: 'output', content:      '│   man: <command>         → Get summarized man page info        │' },
    { type: 'output', content:      '│   install: <package>     → Package installation guidance       │' },
    { type: 'output', content:      '│   security: <topic>      → Security best practices & tips      │' },
    { type: 'ai-response', content: '│                                                                │' },
    { type: 'success', content:     '│ Examples:                                                      │' },
    { type: 'info', content:        '│   explain: find /home -name "*.log" -type f                    │' },
    { type: 'info', content:        '│   script: backup all files in /var/www to /backup              │' },
    { type: 'info', content:        '│   debug: bash: command not found                               │' },
    { type: 'info', content:        '│   man: awk                                                     │' },
    { type: 'info', content:        '│   install: docker on ubuntu                                    │' },
    { type: 'info', content:        '│   security: ssh hardening                                      │' },
    { type: 'ai-response', content: '│                                                                │' },
    { type: 'warning', content:     '╰────────────────────────────────────────────────────────────────╯' },
    { type: 'output', content: '' },
    { type: 'info', content: 'Or simply ask any Linux/bash question in natural language!' }
  ];

  const showAbout = () => [
    { type: 'warning', content:     '╭─ About AITA (AI Terminal Assistant) ────────────────────────────╮' },
    { type: 'ai-response', content: '│                                                                 │' },
    { type: 'output', content:      '│  AITA is your intelligent Linux terminal companion powered by   │' },
    { type: 'output', content:      '│  advanced AI technology. Designed to make command-line work     │' },
    { type: 'output', content:      '│  more intuitive, efficient, and educational.                    │' },
    { type: 'ai-response', content: '│                                                                 │' },
    { type: 'success', content:     '│ Key Features:                                                   │' },
    { type: 'output', content:      '│   • Intelligent command explanation with examples               │' },
    { type: 'output', content:      '│   • Custom bash script generation                               │' },
    { type: 'output', content:      '│   • Real-time error debugging and solutions                     │' },
    { type: 'output', content:      '│   • Simplified man page summaries                               │' },
    { type: 'output', content:      '│   • Package installation guidance                               │' },
    { type: 'output', content:      '│   • Security hardening recommendations                          │' },
    { type: 'output', content:      '│   • Natural language query processing                           │' },
    { type: 'output', content:      '│   • Command history and auto-completion                         │' },
    { type: 'ai-response', content: '│                                                                 │' },
    { type: 'success', content:     '│ Technical Stack:                                                │' },
    { type: 'info', content:        '│   • Frontend: React with enhanced terminal UI                   │' },
    { type: 'info', content:        '│   • Backend: FastAPI with async processing                      │' },
    { type: 'info', content:        '│   • AI Engine: Groq API with llama-3.3-70b-versatile            │' },
    { type: 'info', content:        '│   • Styling: Tailwind CSS with custom terminal theme            │' },
    { type: 'ai-response', content: '│                                                                 │' },
    { type: 'warning', content:     '╰─────────────────────────────────────────────────────────────────╯' },
    { type: 'output', content: '' },
    { type: 'info', content: '💚 Built with passion for the Linux community!' }
  ];

  const showStatus = () => {
    const uptime = Math.floor((Date.now() - sessionStats.uptime) / 1000);
    const uptimeStr = uptime < 60 ? `${uptime}s` : `${Math.floor(uptime/60)}m ${uptime%60}s`;
    
    return [
      { type: 'warning', content: 'System Status Dashboard' },
      { type: 'ai-response', content: '' },
      { type: 'success', content: '🖥️  Terminal Status:' },
      { type: 'output', content: `  Status: ✅ Active and responsive` },
      { type: 'output', content: `  Uptime: ⏱️  ${uptimeStr}` },
      { type: 'output', content: `  Commands executed: 📈 ${sessionStats.commands}` },
      { type: 'ai-response', content: '' },
      { type: 'success', content: '🤖 AI Service Status:' },
      { type: 'output', content: `  Connection: ${navigator.onLine ? '🟢 Connected' : '🔴 Offline'}` },
      { type: 'output', content: '  Model: 🧠 llama-3.3-70b-versatile' },
      { type: 'output', content: '  Provider: ⚡ Groq API' },
      { type: 'output', content: '  Response time: 🚀 ~800ms average' },
      { type: 'ai-response', content: '' },
      { type: 'success', content: '🌐 Network & Environment:' },
      { type: 'output', content: `  Browser: 🌍 ${systemInfo.browser} ${systemInfo.browserVersion}` },
      { type: 'output', content: `  Platform: 💻 ${systemInfo.platform}` },
      { type: 'output', content: `  Operating System: 🖥️ ${systemInfo.os}` },
      { type: 'output', content: `  Architecture: ⚙️ ${navigator.userAgent.includes('x64') || navigator.userAgent.includes('WOW64') ? '64-bit' : '32-bit'}` },
      { type: 'ai-response', content: '' },
      { type: 'output', content: '' },
      { type: 'info', content: `Current time: ${new Date().toLocaleString()}` }
    ];
  };

  const showHistory = () => {
    if (commandHistory.length === 0) {
      return [
        { type: 'warning', content: '📜 Command History: Empty' },
        { type: 'info', content: 'No commands have been executed yet.' }
      ];
    }
    
    const historyLines = [
      { type: 'warning', content: 'Command History' },
      { type: 'ai-response', content: '' }
    ];
    
    commandHistory.slice(-10).forEach((cmd, index) => {
      const num = (commandHistory.length - 10 + index + 1).toString().padStart(3);
      historyLines.push({ 
        type: 'output', 
        content: `${num}. ${cmd}` 
      });
    });
    
    historyLines.push(
      { type: 'ai-response', content: '' },
      { type: 'info', content: `📊 Total commands executed: ${commandHistory.length}` }
    );
    
    return historyLines;
  };

  const handleAICommand = async (command) => {
    const processingMessage = { 
      type: 'warning', 
      content: '🤖 Processing your request... Please wait.' 
    };
    setHistory(prev => [...prev, processingMessage]);
    
    try {
      const response = await askAI(command);
      
      // Remove processing message and add response
      setHistory(prev => {
        const newHistory = prev.slice(0, -1); // Remove processing message
        const responseLines = [
          { type: 'output', content: '' },
          { type: 'success', content: '🎯 AI Response:' }
        ];
        
        const lines = response.split('\n');
        lines.forEach(line => {
          const content = line.trim();
          if (content) {
            responseLines.push({ 
              type: 'ai-response', 
              content: content
            });
          } else {
            responseLines.push({ 
              type: 'ai-response', 
              content: '' 
            });
          }
        });
        
        return [...newHistory, ...responseLines];
      });
    } catch (error) {
      setHistory(prev => {
        const newHistory = prev.slice(0, -1); // Remove processing message
        return [
          ...newHistory,
          { type: 'output', content: '' },
          { type: 'error', content: '❌ Connection Error: Unable to reach AI service' },
          { type: 'warning', content: '💡 Please check your internet connection and try again.' },
          { type: 'info', content: '🔄 The AI service may be temporarily unavailable.' }
        ];
      });
    }
  };

  const handleGenericAI = async (question) => {
    const processingMessage = { 
      type: 'warning', 
      content: '🧠 AI is thinking... Analyzing your query.' 
    };
    setHistory(prev => [...prev, processingMessage]);
    
    try {
      const response = await askAI(`Linux/bash question: ${question}`);
      
      // Remove processing message and add response
      setHistory(prev => {
        const newHistory = prev.slice(0, -1); // Remove processing message
        const responseLines = [
          { type: 'output', content: '' },
          { type: 'success', content: '🧠 AI Analysis:' }
        ];
        
        const lines = response.split('\n');
        lines.forEach(line => {
          const content = line.trim();
          if (content) {
            responseLines.push({ 
              type: 'ai-response', 
              content: content
            });
          } else {
            responseLines.push({ 
              type: 'ai-response', 
              content: '' 
            });
          }
        });
        
        return [...newHistory, ...responseLines];
      });
    } catch (error) {
      setHistory(prev => {
        const newHistory = prev.slice(0, -1); // Remove processing message
        return [
          ...newHistory,
          { type: 'output', content: '' },
          { type: 'error', content: '❌ AI Service Error: Unable to process your query' },
          { type: 'warning', content: '💡 This might be a temporary issue. Please try again.' }
        ];
      });
    }
  };

 const executeCommand = async (cmd) => {
    const trimmedCmd = cmd.trim();
    
    // Handle empty command - just add new prompt line
    if (!trimmedCmd) {
      setHistory(prev => [...prev, { 
        type: 'input', 
        content: `user@aita:~$ ` 
      }]);
      return;
    }
    
    if (isProcessing) return;

    setIsProcessing(true);
    setSessionStats(prev => ({ ...prev, commands: prev.commands + 1 }));
    
    // Add to command history
    setCommandHistory(prev => [...prev, trimmedCmd]);
    
    // Add command to history display
    setHistory(prev => [...prev, { 
      type: 'input', 
      content: `user@aita:~$ ${trimmedCmd}` 
    }]);

    try {
      switch (trimmedCmd.toLowerCase()) {
        case 'help':
          setHistory(prev => [...prev, ...showHelp()]);
          break;
        case 'clear':
          setHistory([]);
          setIsProcessing(false);
          return;
        case 'about':
          setHistory(prev => [...prev, ...showAbout()]);
          break;
        case 'status':
          setHistory(prev => [...prev, ...showStatus()]);
          break;
        case 'history':
          setHistory(prev => [...prev, ...showHistory()]);
          break;
        default:
          if (trimmedCmd.toLowerCase().startsWith('explain:') ||
              trimmedCmd.toLowerCase().startsWith('script:') ||
              trimmedCmd.toLowerCase().startsWith('debug:') ||
              trimmedCmd.toLowerCase().startsWith('man:') ||
              trimmedCmd.toLowerCase().startsWith('install:') ||
              trimmedCmd.toLowerCase().startsWith('security:')) {
            await handleAICommand(trimmedCmd);
          } else {
            await handleGenericAI(trimmedCmd);
          }
          break;
      }
    } catch (error) {
      setHistory(prev => [...prev, { 
        type: 'error', 
        content: `System Error: ${error.message}` 
      }]);
    }

    setIsProcessing(false);
  };

  const handleKeyDown = (e) => {
    if (isProcessing) return;

    if (e.key === 'Enter') {
      executeCommand(currentInput);
      setCurrentInput('');
      setHistoryIndex(-1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCurrentInput('');
        } else {
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[newIndex]);
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Enhanced tab completion
      const basicCommands = ['help', 'clear', 'about', 'status', 'history'];
      const aiCommands = ['explain:', 'script:', 'debug:', 'man:', 'install:', 'security:'];
      const allCommands = [...basicCommands, ...aiCommands];
      
      const matches = allCommands.filter(cmd => cmd.startsWith(currentInput.toLowerCase()));
      if (matches.length === 1) {
        setCurrentInput(matches[0]);
      } else if (matches.length > 1) {
        // Show available options
        setHistory(prev => [...prev, 
          { type: 'info', content: `💡 Available completions: ${matches.join(', ')}` }
        ]);
      }
    } else if (e.key === 'Escape') {
      setCurrentInput('');
      setHistoryIndex(-1);
    }
  };


  const detectSystemInfo = () => {
    const ua = navigator.userAgent;
    let browser = 'Unknown';
    let browserVersion = 'Unknown';
    let os = 'Unknown';
    let platform = navigator.platform;

    // Browser detection
    if (ua.includes('Chrome') && !ua.includes('Edg') && !ua.includes('OPR')) {
      browser = 'Chrome';
      const match = ua.match(/Chrome\/([0-9.]+)/);
      browserVersion = match ? match[1] : 'Unknown';
    } else if (ua.includes('Firefox')) {
      browser = 'Firefox';
      const match = ua.match(/Firefox\/([0-9.]+)/);
      browserVersion = match ? match[1] : 'Unknown';
    } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
      browser = 'Safari';
      const match = ua.match(/Version\/([0-9.]+)/);
      browserVersion = match ? match[1] : 'Unknown';
    } else if (ua.includes('Edg')) {
      browser = 'Edge';
      const match = ua.match(/Edg\/([0-9.]+)/);
      browserVersion = match ? match[1] : 'Unknown';
    } else if (ua.includes('OPR')) {
      browser = 'Opera';
      const match = ua.match(/OPR\/([0-9.]+)/);
      browserVersion = match ? match[1] : 'Unknown';
    }

    // OS detection with enhanced platform info
    if (platform.includes('Win')) {
      if (ua.includes('WOW64') || ua.includes('Win64')) {
        os = 'Windows (64-bit)';
        platform = 'Win64';
      } else {
        os = 'Windows (32-bit)';
        platform = 'Win32';
      }
      if (ua.includes('Windows NT 10.0')) os += ' 10/11';
      else if (ua.includes('Windows NT 6.3')) os += ' 8.1';
      else if (ua.includes('Windows NT 6.2')) os += ' 8';
      else if (ua.includes('Windows NT 6.1')) os += ' 7';
    } else if (platform.includes('Mac')) {
      os = 'macOS';
      if (ua.includes('Intel')) {
        platform = 'MacIntel';
      } else if (ua.includes('ARM')) {
        platform = 'MacARM';
      }
    } else if (platform.includes('Linux')) {
      os = 'Linux';
      if (ua.includes('x86_64')) {
        platform = 'Linux64';
      } else if (ua.includes('i686')) {
        platform = 'Linux32';
      }
    } else if (ua.includes('Android')) {
      os = 'Android';
      platform = 'Android';
    } else if (ua.includes('iPhone') || ua.includes('iPad')) {
      os = ua.includes('iPhone') ? 'iOS (iPhone)' : 'iOS (iPad)';
      platform = ua.includes('iPhone') ? 'iPhone' : 'iPad';
    }

    return { browser, browserVersion, os, platform };
  };

  // Detect system info on mount
  useEffect(() => {
    const info = detectSystemInfo();
    setSystemInfo(info);
  }, []);

  // Enhanced cursor blinking effect - only when not selecting text
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isSelecting) {
        setCursorVisible(prev => !prev);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [isSelecting]);

  // Auto-scroll to bottom with smooth animation
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTo({
        top: terminalRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [history]);

  // Handle text selection events
  const handleMouseDown = () => {
    setIsSelecting(true);
  };

  const handleMouseUp = () => {
    // Delay to allow selection to complete
    setTimeout(() => {
      const selection = window.getSelection();
      if (!selection.toString().trim()) {
        setIsSelecting(false);
      }
    }, 100);
  };

  const handleSelectionChange = () => {
    const selection = window.getSelection();
    if (!selection.toString().trim()) {
      setIsSelecting(false);
    }
  };

  // Focus input when terminal is clicked but not when selecting text
  const handleTerminalClick = (e) => {
    // Don't focus input if user is selecting text
    const selection = window.getSelection();
    if (selection.toString().trim()) {
      return;
    }
    
    if (inputRef.current && !isProcessing) {
      inputRef.current.focus();
    }
  };

  // Add selection change listener
  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

  const getContentStyle = (type) => {
    switch (type) {
      case 'input':
        return 'text-cyan-400 font-semibold';
      case 'error':
        return 'text-red-400 font-medium';
      case 'success':
        return 'text-green-400';
      case 'warning':
        return 'text-yellow-400';
      case 'info':
        return 'text-blue-400';
      case 'header':
        return 'text-green-400 font-bold';
      case 'ai-response':
        return 'text-gray-300';
      default:
        return 'text-gray-300';
    }
  };

  return (
    <div className="h-full flex flex-col bg-black/80 backdrop-blur-sm">
      {/* Terminal Header */}
      <div className="flex-shrink-0 bg-gray-900/50 border-b border-green-500/30 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <span>•</span>
            <span>Session: {sessionStats.commands} commands</span>
            <span>•</span>
            <span>AI: {navigator.onLine ? '🟢 Ready' : '🔴 Offline'}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setHistory([])}
            className="p-1.5 rounded bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-yellow-400 transition-colors"
            title="Clear terminal"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          {isProcessing && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-yellow-500/20 rounded-full">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-yellow-400">Processing</span>
            </div>
          )}
        </div>
      </div>

      {/* Terminal Content */}
      <div 
        ref={terminalRef}
        onClick={handleTerminalClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-green-600/50 scrollbar-track-gray-800/50 cursor-text bg-black/60 select-text"
      >
        {/* History */}
        {history.map((entry, index) => (
          <div key={index} className="whitespace-pre-wrap group relative hover:bg-blue-500/20 px-1 -mx-1 rounded select-text">
            <div className={`${getContentStyle(entry.type)} leading-relaxed font-mono text-sm select-text`}>
              {entry.content}
            </div>
            {entry.content && entry.type !== 'input' && entry.content.length > 10 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(entry.content, index);
                }}
                className="absolute right-2 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded hover:bg-gray-700/50"
                title="Copy to clipboard"
              >
                {copiedIndex === index ? (
                  <Check className="w-3 h-3 text-green-400" />
                ) : (
                  <Copy className="w-3 h-3 text-gray-400 hover:text-white" />
                )}
              </button>
            )}
          </div>
        ))}

        {/* Current Input Line */}
        {!isProcessing && (
          <div className="flex items-center mt-3 bg-gray-900/30 rounded px-2 py-1">
            <span className="text-cyan-400 mr-3 font-semibold">user@aita:~$</span>
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-transparent border-none outline-none text-green-400 w-full font-mono text-sm placeholder-gray-600"
                placeholder="Type your command or question..."
                autoFocus
                spellCheck={false}
                disabled={isProcessing}
              />
              <span 
                className={`absolute top-0 text-green-400 pointer-events-none font-mono ${cursorVisible ? 'opacity-100' : 'opacity-0'} transition-opacity`}
                style={{ left: `${currentInput.length * 0.6}em` }}
              >
                
              </span>
            </div>
          </div>
        )}

        {/* Processing indicator */}
        {isProcessing && (
          <div className="flex items-center mt-3 bg-yellow-500/10 rounded px-3 py-2">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce delay-200"></div>
              </div>
              <span className="text-yellow-400 font-medium">AI is processing your request...</span>
            </div>
          </div>
        )}
      </div>

      {/* Terminal Footer */}
      <div className="flex-shrink-0 bg-gray-900/50 border-t border-green-500/30 px-4 py-2">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center space-x-4">
            <span>Press <kbd className="bg-gray-700 px-1 rounded">Tab</kbd> for completion</span>
            <span>Press <kbd className="bg-gray-700 px-1 rounded">↑/↓</kbd> for history</span>
            <span>Press <kbd className="bg-gray-700 px-1 rounded">Esc</kbd> to clear input</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedTerminal;