class BotController {
  constructor(bot, tradingCtrl) {
    this.bot = bot;
    this.tradingCtrl = tradingCtrl;
    this.setupCommands();
  }

  setupCommands() {
    this.bot.onText(/\/start/, (msg) => {
      this.sendWelcomeMessage(msg.chat.id);
    });

    this.bot.onText(/\/status/, async (msg) => {
      const status = await this.tradingCtrl.getMarketStatus();
      this.bot.sendMessage(msg.chat.id, status, { parse_mode: 'HTML' });
    });

    this.bot.on('callback_query', (query) => {
      this.handleCallbackQuery(query);
    });
  }

  sendWelcomeMessage(chatId) {
    const welcomeMsg = `🤖 <b>Forex Trading Bot</b>\n\n` +
      `Pairs: ${this.tradingCtrl.getSymbolsList()}\n` +
      `Timeframe: ${this.tradingCtrl.config.timeframe}\n\n` +
      `<b>Commands:</b>\n` +
      `/status - Check market\n` +
      `/analysis - Technical outlook`;
    
    this.bot.sendMessage(chatId, welcomeMsg, { parse_mode: 'HTML' });
  }

  handleCallbackQuery(query) {
    // Handle button clicks
  }
}

module.exports = BotController;