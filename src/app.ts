import express from "express";
import routes from "./routes/index"; // 路由
import session from "express-session";
import logger from "./utils/logger";
import { ServerPort } from "./utils/const";

const app = express();
app.use(express.json({ limit: "24mb" }));
app.use(
  session({
    secret: "stock-collector-secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 * 24 },
  })
);

// 启动
app.listen(ServerPort, async () => {
  logger.info(`App is running at http://localhost:${ServerPort}`);
  routes(app);
});
