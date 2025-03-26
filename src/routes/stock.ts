import { Request, Response, Router } from "express";
import { commonRes } from "../utils/response";
import {
  getHistoryStock,
  getStockTickerList,
  requestHistoryStock,
} from "../implements/stock";
import { ExtraInd, Stock, StockIntervalType } from "../types";
import { requireLogin } from "./middleware/require-login";
import { RouterConf } from ".";
import { requireAdmin } from "./middleware/require-auth";

export const stockRoutes: Array<RouterConf> = [
  {
    path: "/api",
    router: Router().get(
      "/history/save",
      requireLogin,
      requireAdmin,
      async (req: Request, res: Response) => {
        const { ticker, country_code, start_date, end_date, type } = req.query;
        const result = await requestHistoryStock(
          type as StockIntervalType,
          ticker as string,
          country_code as string,
          start_date as string,
          end_date as string
        );
        res.status(200).send(commonRes(result));
      }
    ),
  },
  {
    path: "/api",
    router: Router().post(
      "/history/get",
      requireLogin,
      async (req: Request, res: Response) => {
        const { ticker, start_date, end_date, type, extra } = req.body;
        const result = await getHistoryStock(
          type as StockIntervalType,
          ticker as string[],
          start_date as string,
          end_date as string,
          extra as ExtraInd,
        );
        res.status(200).send(commonRes(result));
      }
    ),
  },
  {
    path: "/api",
    router: Router().get(
      "/ticker/list",
      requireLogin,
      async (req: Request, res: Response) => {
        const result = await getStockTickerList();
        res.status(200).send(commonRes(result));
      }
    ),
  },
];
