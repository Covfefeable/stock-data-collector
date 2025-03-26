import dayjs from "dayjs";
import { Task } from "../../types";
import { createMariaDBConnection } from "../../utils/db";
import { commonError, commonRes } from "../../utils/response";
import { Session, SessionData } from "express-session";

export const createTask = async (session: Session & Partial<SessionData>, payload: Task) => {
  const conn = await createMariaDBConnection();

  const [rows] = await conn.query(
    "SELECT COUNT(*) as count FROM stock_train_task WHERE name = ?",
    [payload.name]
  );
  if (rows.count > 0) {
    conn.end();
    return commonError(400, "任务名称重复");
  }

  await conn.query(
    "INSERT IGNORE INTO stock_train_task (user_id, name, description, ticker, type, start_date, end_date, factors, primary_ticker, primary_key, reserved_keys, model, step_num, input_keys, output_key, output_type, epochs, batch_size) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      session.userId,
      payload.name,
      payload.desc,
      payload.ticker.join(","),
      payload.type,
      payload.startDate,
      payload.endDate,
      payload.factors?.join(',') || null,
      payload.primaryTicker,
      payload.primaryKey,
      payload.reservedKeys.join(","),
      payload.model,
      payload.stepNum,
      payload.inputKeys.join(","),
      payload.outputKey,
      payload.outputType,
      payload.epochs,
      payload.batchSize,
    ]
  );
  conn.end();
  return commonRes(payload);
};

export const saveModel = async (
  session: Session & Partial<SessionData>,
  name: string,
  files: {
    [fieldname: string]: Express.Multer.File[];
  }
) => {
  const conn = await createMariaDBConnection();
  // 将这两个文件存入数据库中，分别是 weight_bin_file， model_json_file
  const modelJsonFile = files["model.json"]?.[0];
  const modelWeightsFile = files["model.weights.bin"]?.[0];

  if (!modelJsonFile || !modelWeightsFile) {
    conn.end();
    return commonError(400, "缺少必要的文件");
  }

  await conn.query(
    "UPDATE stock_train_task SET weight_bin_file = ?, model_json_file = ? WHERE name = ? AND user_id = ?",
    [modelWeightsFile.buffer, modelJsonFile.buffer, name, session.userId]
  );

  conn.end();
  return commonRes({ message: "文件保存成功" });
};

export const getTaskList = async (
  session: Session & Partial<SessionData>,
  pageNum: number,
  pageSize: number,
  name: string,
  startDate: string,
  endDate: string
) => {
  const conn = await createMariaDBConnection();
  const offset = (pageNum - 1) * pageSize;

  let query = "SELECT * FROM stock_train_task WHERE user_id = ?";
  const params: any[] = [session.userId];

  if (name) {
    query += " AND name LIKE ?";
    params.push(`%${name}%`);
  }
  if (startDate && startDate !== "null") {
    query += " AND create_time >= ?";
    params.push(startDate);
  }
  if (endDate && endDate !== "null") {
    query += " AND create_time <= ?";
    params.push(endDate);
  }

  query += " LIMIT ? OFFSET ?";
  params.push(pageSize, offset);

  try {
    const rows = await conn.query(query, params);
    const [countResult] = await conn.query(
      "SELECT COUNT(*) as count FROM stock_train_task WHERE 1=1",
      params.slice(0, -2)
    );
    conn.end();
    return commonRes({
      total: Number(countResult.count),
      pageNum,
      pageSize,
      list: rows.map(
        (item: {
          id: number;
          ticker: string;
          name?: string;
          description?: string;
          type?: string;
          start_date?: string;
          end_date?: string;
          factors?: string;
          primary_ticker?: string;
          primary_key?: string;
          reserved_keys?: string;
          model?: string;
          step_num?: number;
          input_keys?: string;
          output_key?: string;
          output_type?: string;
          create_time?: string;
          epochs?: number;
          batch_size?: number;
          weight_bin_file?: Buffer;
          model_json_file?: Buffer
        }) => {
          const {
            id,
            name,
            description,
            ticker,
            type,
            start_date,
            end_date,
            factors,
            primary_ticker,
            primary_key,
            reserved_keys,
            model,
            step_num,
            input_keys,
            output_key,
            output_type,
            create_time,
            epochs,
            batch_size,
            weight_bin_file,
            model_json_file
          } = item;
          return {
            id,
            name,
            desc: description,
            ticker: ticker.split(","),
            type,
            startDate: dayjs(start_date).format("YYYY-MM-DD"),
            endDate: dayjs(end_date).format("YYYY-MM-DD"),
            factors: factors?.split(",") || [],
            primaryTicker: primary_ticker,
            primaryKey: primary_key,
            reservedKeys: reserved_keys?.split(","),
            model,
            stepNum: step_num,
            inputKeys: input_keys?.split(","),
            outputKey: output_key,
            outputType: output_type,
            createTime: dayjs(create_time).format("YYYY-MM-DD HH:mm:ss"),
            epochs,
            batchSize: batch_size,
            finished: !!weight_bin_file && !!model_json_file
          };
        }
      ),
    });
  } catch (error) {
    console.log(error);
    conn.end();
    return commonError(500, "数据查询失败");
  }
};

export const deleteTask = async (session: Session & Partial<SessionData>, id: number) => {
  const conn = await createMariaDBConnection();

  try {
    const result = await conn.query(
      "DELETE FROM stock_train_task WHERE id = ? AND user_id = ?",
      [id, session.userId]
    );

    if (result.affectedRows === 0) {
      conn.end();
      return commonError(404, "任务不存在");
    }
    conn.end();
    return commonRes({ id });
  } catch (error) {
    console.log(error);
    conn.end();
    return commonError(500, "删除任务失败");
  }
};

export const getModel = async (session: Session & Partial<SessionData>, name: string) => {
  const conn = await createMariaDBConnection();
  try {
    const [rows] = await conn.query(
      "SELECT weight_bin_file, model_json_file FROM stock_train_task WHERE name = ? AND user_id = ?",
      [name, session.userId]
    );

    if (rows.length === 0) {
      conn.end();
      return commonError(404, "任务不存在");
    }
    const { weight_bin_file, model_json_file } = rows;
    conn.end();

    return commonRes({
      weightBinFile: weight_bin_file.toString("base64"),
      modelJsonFile: model_json_file.toString("base64"),
    });
  } catch (error) {
    console.log(error);
    conn.end();
    return commonError(500, "获取模型失败");
  }
}