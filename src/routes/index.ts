import { Express, Request, Response, Router } from "express";
import { commonRes } from "../utils/response";
import { stockRoutes } from "./stock";
import { taskRoutes } from "./task";
import { loginRoutes } from "./login";
import { factorRoutes } from "./factor";

export interface RouterConf {
  path: string;
  router: Router;
  meta?: unknown;
}

// 路由配置
const routerConf: Array<RouterConf> = [
  {
    path: "/api",
    router: Router().get("/alive", async (req: Request, res: Response) => {
      const result = {
        status: "alive",
      };
      res.status(200).send(commonRes(result));
    }),
  },
  {
    path: "/api",
    router: Router().get("/cookie/set", async (req: Request, res: Response) => {
      res.cookie('cookie', '1', { httpOnly: false, secure: true });
      res.status(200).send();
    }),
  },
  ...stockRoutes,
  ...taskRoutes,
  ...loginRoutes,
  ...factorRoutes,
];

function routes(app: Express) {
  // 根目录
  app.get("/", (req: Request, res: Response) =>
    res.status(200).send("express server is running...")
  );

  routerConf.forEach((conf) => app.use(conf.path, conf.router));
}

export default routes;
