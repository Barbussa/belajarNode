const tulind = require('tulind');

class IndicatorService {
  constructor() {
    this.config = require('../config/config').indicators;
  }

  async analyze(ohlcv) {
    const closes = ohlcv.map(c => c[4]);
    const highs = ohlcv.map(c => c[2]);
    const lows = ohlcv.map(c => c[3]);
    
    return {
      price: closes[closes.length - 1],
      rsi: await this.calculateRSI(closes),
      macd: await this.calculateMACD(closes),
      trend: await this.determineTrend(closes),
      levels: this.calculateLevels(highs, lows)
    };
  }

  async calculateRSI(closes) {
    const results = await tulind.indicators.rsi.indicator([closes], [this.config.rsi.period]);
    return {
      value: results[0][results[0].length - 1],
      isOverbought: results[0][results[0].length - 1] > this.config.rsi.overbought,
      isOversold: results[0][results[0].length - 1] < this.config.rsi.oversold
    };
  }

  async calculateMACD(closes) {
    const results = await tulind.indicators.macd.indicator(
      [closes],
      [this.config.macd.fast, this.config.macd.slow, this.config.macd.signal]
    );
    return {
      histogram: results[2][results[2].length - 1]
    };
  }

  async determineTrend(closes) {
    // Simplified trend detection
    const last5 = closes.slice(-5);
    return last5[last5.length - 1] > last5[0] ? 'up' : 'down';
  }

  calculateLevels(highs, lows) {
    const swingHigh = Math.max(...highs.slice(-50));
    const swingLow = Math.min(...lows.slice(-50));
    
    return {
      fib618: swingHigh - (swingHigh - swingLow) * 0.618,
      support: swingLow,
      resistance: swingHigh
    };
  }
}

module.exports = IndicatorService;