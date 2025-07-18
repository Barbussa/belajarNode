class SignalService {
  constructor(bot) {
    this.bot = bot;
    this.config = require('../config/config');
    this.signalsSent = 0;
  }

  check(analysis) {
    const { price, rsi, macd, trend, levels } = analysis;
    
    // BUY conditions
    if (rsi.isOversold && price > levels.fib618 && macd.histogram > 0 && trend === 'up') {
      return {
        type: 'BUY',
        entry: price,
        stopLoss: levels.support,
        takeProfit: price + (price - levels.support) * this.config.trading.riskRewardRatio
      };
    }
    
    // SELL conditions
    if (rsi.isOverbought && price < levels.fib618 && macd.histogram < 0 && trend === 'down') {
      return {
        type: 'SELL',
        entry: price,
        stopLoss: levels.resistance,
        takeProfit: price - (levels.resistance - price) * this.config.trading.riskRewardRatio
      };
    }
    
    return null;
  }

  async send(symbol, signal) {
    if (this.signalsSent >= this.config.trading.maxDailySignals) return;
    
    const message = this.createSignalMessage(symbol, signal);
    await this.bot.sendMessage(this.config.telegram.chatId, message, { parse_mode: 'HTML' });
    this.signalsSent++;
  }

  createSignalMessage(symbol, signal) {
    return `🚨 <b>${symbol.name} (${symbol.pair})</b>\n\n` +
      `📊 <b>${signal.type} SIGNAL</b>\n\n` +
      `🎯 Entry: <b>${signal.entry.toFixed(5)}</b>\n` +
      `🛑 Stop Loss: <b>${signal.stopLoss.toFixed(5)}</b>\n` +
      `💰 Take Profit: <b>${signal.takeProfit.toFixed(5)}</b>\n\n` +
      `📈 Risk/Reward: <b>1:${this.config.trading.riskRewardRatio}</b>`;
  }
}

module.exports = SignalService;