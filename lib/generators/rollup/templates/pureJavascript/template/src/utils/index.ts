// 模拟引入第三方应用
import moment from "js-moment";

/**
 * @description: 格式化时间
 * @param {Date} time
 * @return {*}
 */
function formatDate(time: Date): string {
  return moment(time).format();
}

/**
 * @description: 返回当前时间
 * @return {*}
 */
function now(): string {
  return moment().format();
}

export { now, formatDate };
