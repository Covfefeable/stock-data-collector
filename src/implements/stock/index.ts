import axios from "axios";
import { stockBaseUrl, stockToken } from "../../utils/const";
import { createMariaDBConnection } from "../../utils/db";
import { ExtraInd, Stock, StockIntervalType } from "../../types";
import dayjs from "dayjs";
import { calcEma, calcRsi, calcSma } from "./utils";
import { commonError } from "../../utils/response";

export const requestHistoryStock = async (
  type: string = "daily",
  ticker: string,
  country_code: string,
  start_date: string,
  end_date: string
) => {
  if (dayjs(start_date).isAfter(dayjs(end_date))) {
    return commonError(404, "开始时间不能迟于结束时间");
  }
  const res = await axios.get(
    `${stockBaseUrl}/fin/index/${country_code}/${type}`,
    {
      params: {
        token: stockToken,
        ticker,
        start_date,
        end_date,
      },
    }
  );

  if (res.data.code === 200) {
    const conn = await createMariaDBConnection();
    for (const item of res.data.data as Stock[]) {
      await conn.query(
        "INSERT IGNORE INTO stock_index (ticker, date, open, high, low, close, volume, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          item.ticker,
          item.date,
          item.open,
          item.high,
          item.low,
          item.close,
          item.volume,
          type,
        ]
      );
    }
    conn.end();
  }

  return res.data.data;
};

export const getHistoryStock = async (
  type: StockIntervalType = "daily",
  tickers: string[] = ["NDX"],
  start_date: string = dayjs().subtract(1, "year").format("YYYY-MM-DD"),
  end_date: string = dayjs().format("YYYY-MM-DD"),
  extra: ExtraInd = { sma: false, rsi: false, ema: false },
) => {
  if (dayjs(start_date).isAfter(dayjs(end_date))) {
    return commonError(404, "开始时间不能迟于结束时间");
  }

  const conn = await createMariaDBConnection();
  let result: Stock[] = await conn.query(
    `SELECT * FROM stock_index WHERE ticker IN (${tickers
      .map(() => "?")
      .join(",")}) AND date BETWEEN ? AND ? AND type = ? ORDER BY date`,
    [
      ...tickers,
      // 如果携带sma参数，拓展获取30天用于计算sma30
      extra && Object.keys(extra).length
        ? dayjs(start_date).subtract(50, "day").format("YYYY-MM-DD")
        : start_date,
      extra && Object.keys(extra).length
        ? dayjs(end_date).add(50, "day").format("YYYY-MM-DD")
        : end_date,
      type,
    ]
  );
  conn.end();
  result.forEach((item: Stock) => {
    item.volume = Number(item.volume);
    item.open = Number(item.open);
    item.high = Number(item.high);
    item.low = Number(item.low);
    item.close = Number(item.close);
    item.date = dayjs(item.date).format("YYYY-MM-DD");
  });

  extra.sma && (result = calcSma(result, [5, 10, 20, 30]));
  extra.rsi && (result = calcRsi(result, [6, 12, 24]));
  extra.ema && (result = calcEma(result, [5, 10, 20, 30]));

  result = result.filter((item) => {
    // 去掉时间范围外的记录
    return (
      dayjs(item.date).isAfter(dayjs(start_date).subtract(1, "day")) &&
      dayjs(item.date).isBefore(dayjs(end_date).add(1, "day"))
    );
  });
  return result;
};

export const getStockTickerList = async () => {
  const conn = await createMariaDBConnection();
  const result = await conn.query("SELECT DISTINCT ticker FROM stock_index");
  conn.end();
  return result.map((item: any) => item.ticker);
};
