import { Session, SessionData } from "express-session";
import { Factor } from "../../types";
import { createMariaDBConnection } from "../../utils/db";
import { commonError, commonRes } from "../../utils/response";
import dayjs from "dayjs";

export const createFactor = async (
  session: Session & Partial<SessionData>,
  payload: Factor
) => {
  const conn = await createMariaDBConnection();
  const [rows] = await conn.query(
    "SELECT COUNT(*) as count FROM stock_factor WHERE name = ? AND user_id = ?",
    [payload.name, session.userId]
  );

  if (Number(rows.count) > 0) {
    conn.end();
    return commonError(400, "指标名称重复");
  }

  await conn.query(
    "INSERT IGNORE INTO stock_factor (user_id, name, description, create_time, fn, echarts_show_type) VALUES (?, ?, ?, NOW(), ?, ?)",
    [session.userId, payload.name, payload.desc, payload.fn, payload.echartsShowType]
  );

  conn.end();
  return commonRes(payload);
};

export const updateFactor = async (
  session: Session & Partial<SessionData>,
  payload: Factor & { id: number }
) => {
  const conn = await createMariaDBConnection();
  const [rows] = await conn.query(
    "SELECT COUNT(*) as count FROM stock_factor WHERE id = ? AND user_id = ?",
    [payload.id, session.userId]
  );
  if (rows.count === 0) {
    conn.end();
    return commonError(404, "指标不存在");
  }

  await conn.query(
    "UPDATE stock_factor SET name = ?, description = ?, fn = ?, echarts_show_type = ? WHERE id = ? AND user_id = ?",
    [payload.name, payload.desc, payload.fn, payload.echartsShowType, payload.id, session.userId]
  );

  conn.end();
  return commonRes(payload);
};

export const getFactorList = async (
  session: Session & Partial<SessionData>,
  pageNum: number,
  pageSize: number,
  name: string
) => {
  const conn = await createMariaDBConnection();
  const offset = (pageNum - 1) * pageSize;
  const rows = await conn.query(
    "SELECT * FROM stock_factor WHERE name LIKE ? AND user_id = ? LIMIT ? OFFSET ?",
    [`%${name}%`, session.userId, pageSize, offset]
  );

  const [countResult] = await conn.query(
    "SELECT COUNT(*) as count FROM stock_factor WHERE name LIKE ? AND user_id = ? LIMIT ? OFFSET ?",
    [`%${name}%`, session.userId, pageSize, offset]
  );

  conn.end();
  return commonRes({
    total: Number(countResult.count),
    pageNum,
    pageSize,
    list: rows.map(
      (item: {
        id: number;
        name?: string;
        description?: string;
        fn?: string;
        create_time?: string;
        echarts_show_type?: string;
      }) => {
        const { id, name, description, fn, create_time, echarts_show_type } = item;
        return {
          id,
          name,
          desc: description,
          fn,
          echartsShowType: echarts_show_type,
          createTime: dayjs(create_time).format("YYYY-MM-DD HH:mm:ss"),
        };
      }
    ),
  });
};

export const deleteFactor = async (
  session: Session & Partial<SessionData>,
  id: number
) => {
  const conn = await createMariaDBConnection();
  const [rows] = await conn.query(
    "SELECT COUNT(*) as count FROM stock_factor WHERE id = ? AND user_id = ?",
    [id, session.userId]
  );
  if (rows.count === 0) {
    conn.end();
    return commonError(404, "指标不存在");
  }

  await conn.query(
    "DELETE FROM stock_factor WHERE id = ? AND user_id = ?",
    [id, session.userId]
  );

  conn.end();
  return commonRes({ id });
};
