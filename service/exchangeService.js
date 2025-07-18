const ccxt = require('ccxt');

class ExchangeService {
  constructor() {
    this.exchange = new ccxt.binance({
      enableRateLimit: true,
      timeout: 30000
    });
  }

  async getOHLCV(symbol, timeframe = '15m', limit = 100) {
    try {
      const ohlcv = await this.exchange.fetchOHLCV(symbol, timeframe, undefined, limit);
      return ohlcv;
    } catch (error) {
      console.error(`Error fetching data for ${symbol}:`, error.message);
      throw error;
    }
  }
}

module.exports = ExchangeService;