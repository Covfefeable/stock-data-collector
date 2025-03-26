# Stock Data Collector

这是一个用于股票数据收集和分析的服务端项目，提供数据获取、指标计算和数据分析等功能。

## 功能特性

- 股票历史数据获取和存储
- 技术指标计算（SMA、EMA、RSI 等）
- 支持多种时间周期（日线、周线、月线、年线）
- RESTful API 接口
- 用户认证和权限管理

## 技术架构

- 后端框架：Express.js
- 开发语言：TypeScript
- 数据库：MariaDB
- 日志管理：Pino
- HTTP 客户端：Axios
- 日期处理：Day.js

## 快速开始

1. 安装依赖：
   ```bash
   pnpm install
   ```

2. 启动开发服务器：
   ```bash
   pnpm dev
   ```

3. 打包构建：
   ```bash
   pnpm build
   ```

## API 文档

### 股票历史数据

#### 获取历史数据

```
POST /api/history/get
```

请求参数：
- ticker: 股票代码数组
- start_date: 开始日期
- end_date: 结束日期
- type: 时间周期（daily/weekly/monthly/yearly）
- extra: 额外指标配置（sma/rsi/ema）

#### 保存历史数据

```
GET /api/history/save
```

请求参数：
- ticker: 股票代码
- country_code: 国家代码
- start_date: 开始日期
- end_date: 结束日期
- type: 时间周期

## 技术指标

项目支持以下技术指标的计算：

- SMA（简单移动平均线）
- EMA（指数移动平均线）
- RSI（相对强弱指标）

## 项目结构

```
├── src/
│   ├── app.ts              # 应用入口
│   ├── implements/         # 业务实现
│   │   ├── stock/         # 股票相关功能
│   │   ├── factor/        # 因子分析
│   │   ├── task/          # 任务管理
│   │   └── user/          # 用户管理
│   ├── routes/            # 路由配置
│   ├── types/             # 类型定义
│   └── utils/             # 工具函数
```

## 许可证

ISC License
