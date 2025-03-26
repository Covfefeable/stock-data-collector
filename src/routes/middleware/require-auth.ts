import { NextFunction } from "express";
import { Request, Response } from "express";
import { commonError } from "../../utils/response";
import { createMariaDBConnection } from "../../utils/db";

export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const conn = await createMariaDBConnection();
  const [countResult] = await conn.query(
    "SELECT COUNT(*) as count FROM user WHERE user_id = ? && user_role = 'admin'",
    [req.session.userId]
  );
  if (Number(countResult.count) === 0) {
    conn.end();
    res.status(200).send(commonError(403, "无此权限"));
  } else {
    next();
  }
};
