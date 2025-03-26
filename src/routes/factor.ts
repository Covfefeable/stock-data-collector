import { Request, Response, Router } from "express";
import { RouterConf } from ".";
import { requireLogin } from "./middleware/require-login";
import {
  createFactor,
  deleteFactor,
  getFactorList,
  updateFactor,
} from "../implements/factor";

export const factorRoutes: Array<RouterConf> = [
  {
    path: "/api",
    router: Router().post(
      "/factor/create",
      requireLogin,
      async (req: Request, res: Response) => {
        const result = await createFactor(req.session, req.body);
        res.status(200).send(result);
      }
    ),
  },
  {
    path: "/api",
    router: Router().post(
      "/factor/update",
      requireLogin,
      async (req: Request, res: Response) => {
        const result = await updateFactor(req.session, req.body);
        res.status(200).send(result);
      }
    ),
  },
  {
    path: "/api",
    router: Router().post(
      "/factor/delete",
      requireLogin,
      async (req: Request, res: Response) => {
        const { id } = req.body;
        const result = await deleteFactor(req.session, id);
        res.status(200).send(result);
      }
    ),
  },
  {
    path: "/api",
    router: Router().get(
      "/factor/list",
      requireLogin,
      async (req: Request, res: Response) => {
        const { pageNum, pageSize, name } = req.query;
        const result = await getFactorList(
          req.session,
          Number(pageNum),
          Number(pageSize),
          name as string
        );
        res.status(200).send(result);
      }
    ),
  },
];
