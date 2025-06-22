import React from 'react'
import { Terminal, Zap, Shield, Book, Package, Bug, FileText } from 'lucide-react'

const CommandHelp = () => {
  const commands = [
    {
      icon: <Terminal className="h-4 w-4" />,
      prefix: "Explain:",
      description: "Explain shell commands",
      example: "Explain: ls -la | grep .txt",
      color: "text-green-400"
    },
    {
      icon: <FileText className="h-4 w-4" />,
      prefix: "Script:",
      description: "Generate bash scripts",
      example: "Script: backup all .log files",
      color: "text-blue-400"
    },
    {
      icon: <Bug className="h-4 w-4" />,
      prefix: "Debug:",
      description: "Debug error messages",
      example: "Debug: permission denied /var/log",
      color: "text-red-400"
    },
    {
      icon: <Book className="h-4 w-4" />,
      prefix: "Man:",
      description: "Summarize man pages",
      example: "Man: grep",
      color: "text-yellow-400"
    },
    {
      icon: <Package className="h-4 w-4" />,
      prefix: "Install:",
      description: "Package installation help",
      example: "Install: nginx on Ubuntu",
      color: "text-purple-400"
    },
    {
      icon: <Shield className="h-4 w-4" />,
      prefix: "Security:",
      description: "Security hardening tips",
      example: "Security: SSH configuration",
      color: "text-orange-400"
    }
  ]

  const quickTips = [
    "💡 Type commands in natural language",
    "🔍 Ask specific questions for better results",
    "📝 Copy generated scripts to test safely",
    "🚀 Use 'clear' to clean the terminal",
    "❓ Type 'help' for command reference"
  ]

  return (
    <div className="p-6 h-full">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-white mb-2 flex items-center">
          <Zap className="h-5 w-5 mr-2 text-terminal-accent" />
          Command Reference
        </h2>
        <p className="text-sm text-gray-400">
          Use these prefixes for specific AI assistance
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {commands.map((cmd, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center mb-2">
              <span className={cmd.color}>{cmd.icon}</span>
              <span className="ml-2 font-semibold text-white">{cmd.prefix}</span>
            </div>
            <p className="text-sm text-gray-300 mb-2">{cmd.description}</p>
            <div className="bg-gray-900 rounded px-3 py-2 text-xs font-mono text-green-400">
              {cmd.example}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-700 pt-6">
        <h3 className="text-md font-semibold text-white mb-4 flex items-center">
          <Book className="h-4 w-4 mr-2 text-terminal-secondary" />
          Quick Tips
        </h3>
        <ul className="space-y-2">
          {quickTips.map((tip, index) => (
            <li key={index} className="text-sm text-gray-300 flex items-start">
              <span className="mr-2">{tip.split(' ')[0]}</span>
              <span>{tip.split(' ').slice(1).join(' ')}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* <div className="mt-8 p-4 bg-terminal-accent bg-opacity-10 rounded-lg border border-terminal-accent border-opacity-30">
        <h4 className="text-sm font-semibold text-terminal-accent mb-2">Pro Tip</h4>
        <p className="text-xs text-gray-300">
          You can ask any Linux/bash question without using prefixes. 
          AITA will understand and provide contextual help!
        </p>
      </div> */}
    </div>
  )
}

export default CommandHelp