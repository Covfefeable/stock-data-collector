import { Request, Response, Router } from "express";
import {
  createTask,
  deleteTask,
  getModel,
  getTaskList,
  saveModel,
} from "../implements/task";
import multer from "multer";
import { requireLogin } from "./middleware/require-login";
import { RouterConf } from ".";

const upload = multer({
  limits: {
    fileSize: 24 * 1024 * 1024, // 限制文件大小为 5MB
  },
});

export const taskRoutes: Array<RouterConf> = [
  {
    path: "/api",
    router: Router().post(
      "/task/create",
      requireLogin,
      async (req: Request, res: Response) => {
        const result = await createTask(req.session, req.body);
        res.status(200).send(result);
      }
    ),
  },
  {
    path: "/api",
    router: Router().post(
      "/task/model/save",
      requireLogin,
      upload.fields([{ name: "model.json" }, { name: "model.weights.bin" }]),
      async (req: Request, res: Response) => {
        if (!req.files) {
          return res.status(400).send({ message: "No files uploaded" });
        }
        const result = await saveModel(
          req.session,
          req.query.name as string,
          req.files as { [fieldname: string]: Express.Multer.File[] }
        );
        res.status(200).send(result);
      }
    ),
  },
  {
    path: "/api",
    router: Router().get(
      "/task/model/get",
      requireLogin,
      async (req: Request, res: Response) => {
        const { name } = req.query;
        const result = await getModel(req.session, name as string);
        res.status(200).send(result);
      }
    ),
  },
  {
    path: "/api",
    router: Router().get(
      "/task/list",
      requireLogin,
      async (req: Request, res: Response) => {
        const { pageNum, pageSize, name, startDate, endDate } = req.query;
        const result = await getTaskList(
          req.session,
          Number(pageNum),
          Number(pageSize),
          name as string,
          startDate as string,
          endDate as string
        );
        res.status(200).send(result);
      }
    ),
  },
  {
    path: "/api",
    router: Router().post(
      "/task/delete",
      requireLogin,
      async (req: Request, res: Response) => {
        const { id } = req.body;
        const result = await deleteTask(req.session, id);
        res.status(200).send(result);
      }
    ),
  }
]
