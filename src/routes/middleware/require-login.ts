import { NextFunction } from "express";
import { Request, Response } from "express";
import { commonError } from "../../utils/response";

export const requireLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.session.userId) {
    next();
  } else {
    // 用户未登录，重定向到登录页面或返回错误信息
    res.status(200).send(commonError(-100, "未登录"));
  }
};
