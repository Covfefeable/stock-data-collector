export type StockIntervalType = "daily" | "weekly" | "monthly" | "yearly";
export interface Stock {
  id: number;
  ticker: string;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  type: StockIntervalType;
  [key: `rsi${number}`]: number;
  [key: `sma${number}`]: number;
  [key: `ema${number}`]: number;
}

export interface Task {
  name: string;
  desc: string;
  ticker: string[];
  type: StockIntervalType;
  startDate: string;
  endDate: string;
  factors: string[] | null;
  primaryTicker: string;
  primaryKey: string;
  reservedKeys: string[];
  model: string;
  stepNum: number;
  inputKeys: string[];
  outputKey: string;
  outputType: string;
  epochs: number;
  batchSize: number;
}

export interface ExtraInd {
  sma: boolean;
  rsi: boolean;
  ema: boolean;
}

export interface Factor {
  echartsShowType: string;
  name: string;
  desc: string;
  createTime: string;
  fn: string;
}
