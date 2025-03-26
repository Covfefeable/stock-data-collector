import { randomBytes, createHash } from "crypto";

export const generate16BitHash = (): string => {
  const buffer = randomBytes(8);
  return buffer.toString("hex");
};

export const generateHourlyHash = (): string => {
    // 获取当前时间
    const now = new Date();
    // 获取当前的小时数
    const currentHour = now.getHours();

    // 将当前小时和固定随机种子组合成一个字符串
    const dataToHash = `${currentHour}-fixed_seed_anyway-${currentHour}`;

    // 使用 SHA - 256 算法生成哈希
    const hash = createHash('sha256').update(dataToHash).digest('hex');

    // 截取前 16 位
    return hash.slice(0, 16);
}