import { Session, SessionData } from "express-session";
import { createMariaDBConnection } from "../../utils/db";
import { commonError, commonRes } from "../../utils/response";
import { generate16BitHash, generateHourlyHash } from "../../utils";

export interface User {
  userName: string;
  userId: string;
}

export const checkLogin = async (session: SessionData) => {
  if (!session.userId) {
    return commonError(-100, "未登录");
  } else {
    const conn = await createMariaDBConnection();

    const rows = await conn.execute(
      "SELECT user_name, user_role FROM user WHERE user_id = ?",
      [session.userId]
    );
    if (rows.length === 0) {
      return commonError(500, "用户不存在");
    }
    const userName = rows[0].user_name;
    const userRole = rows[0].user_role;

    conn.end();
    return commonRes({
      userId: session.userId,
      userName,
      userRole,
    });
  }
};

export const login = async (userName: string, userPassword: string) => {
  const conn = await createMariaDBConnection();
  const rows = await conn.execute(
    "SELECT user_id, user_password, user_role FROM user WHERE user_name = ?",
    [userName]
  );

  if (rows.length === 0) {
    return commonError(401, "用户名或密码错误");
  }

  const user = rows[0];
  if (user.user_password !== userPassword) {
    return commonError(401, "用户名或密码错误");
  }

  await conn.execute(
    "UPDATE user SET user_last_login = NOW() WHERE user_id = ?",
    [user.user_id]
  );

  conn.end();

  return commonRes({
    userId: user.user_id,
    userRole: user.user_role,
    userName,
  });
};

export const register = async (
  userName: string,
  userPassword: string,
  code: string // 邀请码
) => {
  if (code !== generateHourlyHash()) {
    return commonError(403, "邀请码无效");
  }

  const conn = await createMariaDBConnection();
  const rows = await conn.execute(
    "SELECT user_id FROM user WHERE user_name = ?",
    [userName]
  );

  if (rows.length > 0) {
    return commonError(409, "用户名已存在");
  }

  await conn.execute(
    "INSERT INTO user (user_id, user_name, user_password, user_last_login, user_role) VALUES (?, ?, ?, NOW(), ?)",
    [generate16BitHash(), userName, userPassword, "user"]
  );

  conn.end();

  return commonRes({
    message: "注册成功",
  });
};
