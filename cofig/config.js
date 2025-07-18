module.exports = {
  telegram: {
    token: process.env.TELEGRAM_BOT_TOKEN,
    chatId: process.env.TELEGRAM_CHAT_ID,
    adminId: process.env.TELEGRAM_ADMIN_ID
  },
  trading: {
    symbols: [
      { pair: 'XAU/USD', name: 'Gold', pipValue: 0.01 },
      { pair: 'EUR/USD', name: 'Euro/Dollar', pipValue: 0.0001 }
    ],
    timeframe: '15m',
    riskRewardRatio: 2,
    maxDailySignals: 5
  },
  indicators: {
    rsi: { period: 14, overbought: 70, oversold: 30 },
    macd: { fast: 12, slow: 26, signal: 9 }
  }
};