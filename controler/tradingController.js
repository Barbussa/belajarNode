const ExchangeService = require('../services/exchangeService');
const IndicatorService = require('../services/indicatorService');
const SignalService = require('../services/signalService');

class TradingController {
  constructor(bot) {
    this.bot = bot;
    this.config = require('../config/config');
    this.exchange = new ExchangeService();
    this.indicators = new IndicatorService();
    this.signal = new SignalService(bot);
    this.isMonitoring = false;
  }

  async startMonitoring() {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    setInterval(() => this.checkMarkets(), 5 * 60 * 1000); // Every 5 minutes
    await this.checkMarkets(); // Immediate check
  }

  async checkMarkets() {
    for (const symbol of this.config.trading.symbols) {
      try {
        const ohlcv = await this.exchange.getOHLCV(symbol.pair);
        const analysis = await this.indicators.analyze(ohlcv);
        const signal = this.signal.check(analysis);
        
        if (signal) {
          await this.signal.send(symbol, signal);
        }
      } catch (error) {
        console.error(`Error processing ${symbol.pair}:`, error);
      }
    }
  }

  async getMarketStatus() {
    let status = '<b>Market Status</b>\n\n';
    
    for (const symbol of this.config.trading.symbols) {
      const ohlcv = await this.exchange.getOHLCV(symbol.pair);
      const price = ohlcv[ohlcv.length - 1][4];
      status += `📈 <b>${symbol.pair}</b>: ${price.toFixed(5)}\n`;
    }
    
    return status;
  }

  getSymbolsList() {
    return this.config.trading.symbols.map(s => s.pair).join(', ');
  }
}

module.exports = TradingController;