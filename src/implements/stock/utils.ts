import { Stock } from "../../types";

export const calcSma = (data: Stock[], periods: number[]) => {
  periods.forEach((period) => {
    for (let i = 0; i < data.length; i++) {
      let sum = 0;
      let count = 0;
      for (let j = Math.max(0, i - period + 1); j <= i; j++) {
        sum += data[j].close;
        count++;
      }
      data[i][`sma${period}`] = sum / count;
    }
  });
  return data;
};

export const calcRsi = (data: Stock[], periods: number[]) => {
  const rsi = (data: Stock[], period: number) => {
    const changes = [];
    const gains = [];
    const losses = [];

    // 计算价格变动、上涨变动和下跌变动
    for (let i = 1; i < data.length; i++) {
      const change = data[i].close - data[i - 1].close;
      changes.push(change);
      gains.push(change > 0 ? change : 0);
      losses.push(change < 0 ? -change : 0);
    }

    // 初始化 RSI 数组
    const rsiValues = new Array(data.length).fill(null);

    // 计算初始平均上涨变动和平均下跌变动
    let avgGain =
      gains.slice(0, period).reduce((sum, val) => sum + val, 0) / period;
    let avgLoss =
      losses.slice(0, period).reduce((sum, val) => sum + val, 0) / period;

    // 计算初始 RSI
    const initialRS = avgGain / avgLoss;
    rsiValues[period] = 100 - 100 / (1 + initialRS);

    // 计算后续的 RSI
    for (let i = period + 1; i < data.length; i++) {
      avgGain = (avgGain * (period - 1) + gains[i - 1]) / period;
      avgLoss = (avgLoss * (period - 1) + losses[i - 1]) / period;
      const rs = avgGain / avgLoss;
      rsiValues[i] = 100 - 100 / (1 + rs);
    }

    // 将 RSI 值添加到原始数据中
    for (let i = 0; i < data.length; i++) {
      data[i][`rsi${period}`] = rsiValues[i];
    }

    return data;
  };

  periods.forEach((period) => {
    data = rsi(data, period);
  });
  return data;
};

export const calcEma = (data: Stock[], periods: number[]) => {
  const ema = (data: Stock[], period: number) => {
    const k = 2 / (period + 1);
    let emaValues = new Array(data.length).fill(null);

    // 计算初始 EMA
    let sum = 0;
    for (let i = 0; i < period; i++) {
      sum += data[i].close;
    }
    emaValues[period - 1] = sum / period;

    // 计算后续的 EMA
    for (let i = period; i < data.length; i++) {
      emaValues[i] = (data[i].close - emaValues[i - 1]) * k + emaValues[i - 1];
    }

    // 将 EMA 值添加到原始数据中
    for (let i = 0; i < data.length; i++) {
      data[i][`ema${period}`] = emaValues[i];
    }

    return data;
  };

  periods.forEach((period) => {
    data = ema(data, period);
  });
  return data;
};
