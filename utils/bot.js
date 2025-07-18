require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const config = require('./config/config');
const BotController = require('./controllers/botController');
const TradingController = require('./controllers/tradingController');

// Initialize
const bot = new TelegramBot(config.telegram.token, { polling: true });
const tradingCtrl = new TradingController(bot);
const botCtrl = new BotController(bot, tradingCtrl);

// Start systems
tradingCtrl.startMonitoring();
console.log(`🚀 Bot started for ${config.trading.symbols.map(s => s.pair).join(', ')}`);

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  bot.sendMessage(config.telegram.adminId, `⚠️ Bot error: ${error.message}`);
});