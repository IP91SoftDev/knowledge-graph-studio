#!/usr/bin/env node
/**
 * Telegram Notification Script
 * 
 * Sends task completion notifications to Telegram.
 * 
 * Usage: pnpm notify "Task completed: UI Foundation"
 * 
 * Environment Variables:
 * - TELEGRAM_BOT_TOKEN: Your bot token from BotFather
 * - TELEGRAM_CHAT_ID: Your Telegram chat ID
 * 
 * Or reads from .env.local automatically.
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const ENV_LOCAL_PATH = path.join(PROJECT_ROOT, '.env.local');

// Load environment from .env.local if exists
function loadEnv() {
  if (fs.existsSync(ENV_LOCAL_PATH)) {
    const content = fs.readFileSync(ENV_LOCAL_PATH, 'utf8');
    content.split('\n').forEach(line => {
      const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (match) {
        process.env[match[1]] = match[2];
      }
    });
  }
}

loadEnv();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8576605258:AAGASA_OK3MZdoPC2sLxbJNDt1e0j94ocmQ';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '1212051641';

async function sendNotification(message) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });
    
    const result = await response.json();
    
    if (result.ok) {
      console.log('✅ Telegram notification sent');
      console.log(`   Message ID: ${result.result.message_id}`);
      return true;
    } else {
      console.error('❌ Telegram API error:', result);
      return false;
    }
  } catch (error) {
    console.error('❌ Failed to send notification:', error.message);
    return false;
  }
}

// Build notification from arguments or stdin
async function main() {
  const args = process.argv.slice(2);
  
  // Check for specific flags
  const flags = {
    task: null,
    commit: null,
    gates: null,
    summary: [],
    deploy: null,
  };
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--task' && args[i + 1]) {
      flags.task = args[++i];
    } else if (arg === '--commit' && args[i + 1]) {
      flags.commit = args[++i];
    } else if (arg === '--gates' && args[i + 1]) {
      flags.gates = args[++i];
    } else if (arg === '--summary' && args[i + 1]) {
      flags.summary.push(args[++i]);
    } else if (arg === '--deploy' && args[i + 1]) {
      flags.deploy = args[++i];
    } else if (!arg.startsWith('--')) {
      // Treat as message
      flags.task = arg;
    }
  }
  
  // Build message
  let message = '';
  
  if (flags.task) {
    message += `✅ Task completed: *${flags.task}*\n`;
  }
  
  if (flags.commit) {
    message += `🔀 PR/commit: \`${flags.commit}\`\n`;
  }
  
  if (flags.gates) {
    message += `🧪 Gates: ${flags.gates}\n`;
  }
  
  if (flags.summary.length > 0) {
    message += `\n🧾 Summary:\n`;
    flags.summary.forEach((item, i) => {
      message += `• ${item}\n`;
    });
  }
  
  if (flags.deploy) {
    message += `\n🚀 Deploy: ${flags.deploy}\n`;
  }
  
  // Add timestamp
  message += `\n_— ${new Date().toISOString().replace('T', ' ').substring(0, 16)} UTC_`;
  
  // Send
  const success = await sendNotification(message);
  process.exit(success ? 0 : 1);
}

main();
