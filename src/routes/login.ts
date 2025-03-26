import { Request, Response, Router } from "express";
import { RouterConf } from ".";
import { commonRes } from "../utils/response";
import { checkLogin, login, register, User } from "../implements/user";
import { SessionData } from "express-session";

export const loginRoutes: Array<RouterConf> = [
  {
    path: "/api",
    router: Router().get(
      "/user/login/check",
      async (req: Request, res: Response) => {
        const result = await checkLogin(req.session as SessionData);
        res.status(200).send(result);
      }
    ),
  },
  {
    path: "/api",
    router: Router().post(
      "/user/register",
      async (req: Request, res: Response) => {
        const { userName, userPassword, code } = req.body
        const result = await register(userName, userPassword, code);
        res.status(200).send(result);
      }
    ),
  },
  {
    path: "/api",
    router: Router().post("/user/login", async (req: Request, res: Response) => {
      const { userName, userPassword } = req.body;
      const result = await login(userName, userPassword);
      if (result.code === 200) {
        req.session.regenerate((err) => {
          req.session.userId = (result.data as User).userId;
          res.status(200).send(result);
        });
      } else {
        res.status(200).send(result)
      }
    }),
  },
  {
    path: "/api",
    router: Router().get("/user/logout", async (req: Request, res: Response) => {
      if (req.session.userId) {
        req.session.destroy((err) => {
          res.status(200).send(commonRes("登出成功"));
        });
      } else {
        res.status(200).send(commonRes("尚未登录"));
      }
    }),
  },
];
