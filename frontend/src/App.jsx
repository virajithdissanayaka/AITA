import React, { useState, useEffect } from 'react';
import { Terminal, Cpu, Zap, Shield, Book, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import TerminalComponent from './Components/Terminal';
import CommandHelp from './Components/CommandHelp';

function App() {
  const [showHelp, setShowHelp] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [helpCollapsed, setHelpCollapsed] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setShowHelp(false);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleHelp = () => {
    if (isMobile) {
      setShowHelp(!showHelp);
    } else {
      setHelpCollapsed(!helpCollapsed);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-green-400 font-mono overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-green-500/5 to-cyan-500/5 animate-gradient-x"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-gray-900/80 backdrop-blur-md border-b border-green-500/30 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Terminal className="h-6 w-6 sm:h-8 sm:w-8 text-green-400 animate-pulse" />
              <div className="absolute -inset-1 bg-green-400/20 rounded-full blur-sm"></div>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-wider">
                AITA
                <span className="ml-2 text-xs sm:text-sm text-green-400 font-normal">v2.0</span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 tracking-wide">AI Terminal Companion</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Connection Status */}
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                  isOnline ? 'bg-green-400 animate-ping' : 'bg-red-400'
                }`}></div>
                <div className={`absolute inset-0 w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                  isOnline ? 'bg-green-400' : 'bg-red-400'
                }`}></div>
              </div>
              <span className="text-xs sm:text-sm text-gray-300 hidden sm:inline">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>

            {/* Help Toggle Button
            <button
              onClick={toggleHelp}
              className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-1 sm:py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-400 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 group"
            >
              {isMobile ? (
                showHelp ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />
              ) : (
                helpCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
              )}
              <span className="text-xs sm:text-sm hidden sm:inline group-hover:text-white transition-colors">
                {isMobile ? (showHelp ? 'Close' : 'Help') : (helpCollapsed ? 'Show' : 'Hide')}
              </span>
            </button> */}
            {/* Help Toggle Button - Mobile Only */}
            {isMobile && (
              <button
                onClick={toggleHelp}
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-1 sm:py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-400 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 group"
              >
                {showHelp ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                <span className="text-xs sm:text-sm hidden sm:inline group-hover:text-white transition-colors">
                  {showHelp ? 'Close' : 'Help'}
                </span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex h-[calc(100vh-140px)] sm:h-[calc(100vh-80px)]">
        {/* Terminal */}
        <div className={`flex-1 transition-all duration-300 ${
          isMobile && showHelp ? 'hidden' : 'block'
        }`}>
          <TerminalComponent />
        </div>

        {/* Help Panel - Desktop */}
        {!isMobile && (
          <div className="transition-all duration-300 bg-gray-900/90 backdrop-blur-md border-l border-green-500/30 overflow-hidden 'w-80 xl:w-96">
            <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-green-500/50 scrollbar-track-gray-800/50">
              <CommandHelp />
            </div>
          </div>
        )}

        {/* Help Panel - Mobile Overlay */}
        {isMobile && showHelp && (
          <div className="fixed inset-0 z-50 bg-gray-900/95 backdrop-blur-md">
            <div className="relative h-full overflow-y-auto scrollbar-thin scrollbar-thumb-green-500/50 scrollbar-track-gray-800/50">
              {/* Close Button */}
              <button
                onClick={toggleHelp}
                className="absolute top-4 right-4 text-red-500 hover:text-red-300 focus:outline-none z-50"
                aria-label="Close help panel"
              >
                <X className="h-6 w-6" />
              </button>
              <CommandHelp/>
            </div>
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        .animate-gradient-x {
          animation: gradient-x 15s ease infinite;
        }
        
        @keyframes gradient-x {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }
        
        .scrollbar-thin::-webkit-scrollbar { width: 6px; }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(34, 197, 94, 0.5);
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 197, 94, 0.8);
        }
      `}</style>
    </div>
  );
}

export default App;