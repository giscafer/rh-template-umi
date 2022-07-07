import dayjs from 'dayjs';

/**
 * 格式化时间戳
 * @param secondTimestamp 秒级时间戳
 * @param defaultValue 默认值 ''
 * @param formatter 格式化方式 'YYYY-MM-DD HH:mm:ss'
 * @returns
 */
export function formatDate(secondTimestamp: number, defaultValue = '', formatter = 'YYYY-MM-DD HH:mm:ss') {
  if (!secondTimestamp) {
    return defaultValue;
  }
  // ms 级时间戳
  if (`${secondTimestamp}`.length >= 13) {
    return dayjs(secondTimestamp).format(formatter);
  }
  // s 级时间戳
  return dayjs(secondTimestamp * 1000).format(formatter);
}
