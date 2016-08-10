/** util.js
 * Generic utility functions to use throughout scripts
 */

export function isDateBetween (check, start, end) {
  return check >= start && check <= end;
}

export function leftpad (str, len, ch) {
  str = String(str);
  var i = -1;
  if (!ch && ch !== 0) ch = ' ';
  len = len - str.length;
  while (++i < len) {
    str = ch + str;
  }
  return str;
}

export function rightpad (str, len, ch) {
  str = String(str);
  var i = -1;
  if (!ch && ch !== 0) ch = ' ';
  len = len - str.length;
  while (++i < len) {
    str = str + ch;
  }
  return str;
}
