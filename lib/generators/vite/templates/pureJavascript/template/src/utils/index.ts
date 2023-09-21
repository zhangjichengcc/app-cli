// 模拟引入第三方应用
/**
 * @description: 格式化时间
 * @param {Date} time
 * @return {*}
 */
function formatDate(time: Date): string {
  return new Date(time).toLocaleDateString();
}

/**
 * @description: 返回当前时间
 * @return {*}
 */
function now(): string {
  return formatDate(new Date());
}

export { now, formatDate };
