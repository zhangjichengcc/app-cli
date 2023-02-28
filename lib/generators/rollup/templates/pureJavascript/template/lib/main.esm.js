'use strict';

var moment = require('js-moment');

// 模拟引入第三方应用
/**
 * @description: 格式化时间
 * @param {Date} time
 * @return {*}
 */
function formatDate(time) {
    return moment(time).format();
}
/**
 * @description: 返回当前时间
 * @return {*}
 */
function now() {
    return moment().format();
}

const hello = "hello, enjoy your self";
console.log(hello);

exports.formatDate = formatDate;
exports.now = now;
