/* 拾词 · 通用工具函数 */
(function (global) {
  'use strict';

  var WEEKDAYS_CN = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  var WEEKDAYS_CN_SHORT = ['日', '一', '二', '三', '四', '五', '六'];
  var MONTHS_EN = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  var MONTHS_EN_FULL = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
  var WEEKDAYS_EN = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

  function pad2(value) {
    return String(value).padStart(2, '0');
  }

  /** 转义用户输入，避免插入 HTML 时产生脚本 */
  function escapeHTML(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[ch];
    });
  }

  /** 把本地时间格式化为 YYYY-MM-DD，不经过 UTC，避免日期偏移 */
  function dateToStr(date) {
    if (!(date instanceof Date) || isNaN(date.getTime())) return '';
    return date.getFullYear() + '-' + pad2(date.getMonth() + 1) + '-' + pad2(date.getDate());
  }

  function todayStr() {
    return dateToStr(new Date());
  }

  function isValidDateStr(value) {
    if (typeof value !== 'string') return false;
    var match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) return false;
    var y = Number(match[1]);
    var m = Number(match[2]);
    var d = Number(match[3]);
    if (y < 1900 || y > 2200 || m < 1 || m > 12 || d < 1 || d > 31) return false;
    var check = new Date(y, m - 1, d, 12, 0, 0, 0);
    return check.getFullYear() === y && check.getMonth() === m - 1 && check.getDate() === d;
  }

  /** 将 YYYY-MM-DD 解析为本地中午的 Date，避免跨时区问题 */
  function parseDateStr(value) {
    if (!isValidDateStr(value)) return null;
    var parts = value.split('-').map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0, 0);
  }

  function addDays(dateStr, delta) {
    var date = parseDateStr(dateStr);
    if (!date) return '';
    date.setDate(date.getDate() + Number(delta || 0));
    return dateToStr(date);
  }

  /** 计算两个日期字符串相差的自然日数 */
  function diffDays(fromStr, toStr) {
    var a = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fromStr || '');
    var b = /^(\d{4})-(\d{2})-(\d{2})$/.exec(toStr || '');
    if (!a || !b) return NaN;
    var utcA = Date.UTC(Number(a[1]), Number(a[2]) - 1, Number(a[3]));
    var utcB = Date.UTC(Number(b[1]), Number(b[2]) - 1, Number(b[3]));
    return Math.round((utcB - utcA) / 86400000);
  }

  function weekdayCN(dateStr, short) {
    var date = parseDateStr(dateStr);
    if (!date) return '';
    return short ? WEEKDAYS_CN_SHORT[date.getDay()] : WEEKDAYS_CN[date.getDay()];
  }

  function monthShortEN(dateStr) {
    var date = parseDateStr(dateStr);
    return date ? MONTHS_EN[date.getMonth()] : '';
  }

  function monthFullEN(dateStr) {
    var date = parseDateStr(dateStr);
    return date ? MONTHS_EN_FULL[date.getMonth()] : '';
  }

  function weekdayEN(dateStr) {
    var date = parseDateStr(dateStr);
    return date ? WEEKDAYS_EN[date.getDay()] : '';
  }

  /** 返回易读的中文日期，例如：11月24日 · 周一 */
  function formatDateCN(dateStr, options) {
    var date = parseDateStr(dateStr);
    if (!date) return '';
    var opts = options || {};
    var parts = [];
    var dateText = (date.getMonth() + 1) + '月' + date.getDate() + '日';
    if (opts.year) dateText = date.getFullYear() + '年' + dateText;
    parts.push(dateText);
    if (opts.weekday) parts.push(WEEKDAYS_CN[date.getDay()]);
    return parts.join(opts.separator || ' · ');
  }

  function formatMonthCN(monthStr) {
    var match = /^(\d{4})-(\d{2})$/.exec(monthStr || '');
    if (!match) return '';
    return Number(match[1]) + '年' + Number(match[2]) + '月';
  }

  /** 相对日期标签：今天 / 昨天 / 明天 / 11月24日 */
  function relativeDateLabel(dateStr, reference) {
    var ref = reference || todayStr();
    var delta = diffDays(ref, dateStr);
    if (delta === 0) return '今天';
    if (delta === -1) return '昨天';
    if (delta === 1) return '明天';
    var date = parseDateStr(dateStr);
    if (!date) return dateStr;
    var refDate = parseDateStr(ref);
    if (refDate && date.getFullYear() !== refDate.getFullYear()) {
      return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日';
    }
    return (date.getMonth() + 1) + '月' + date.getDate() + '日';
  }

  function formatTime(isoString) {
    if (!isoString) return '';
    var date = new Date(isoString);
    if (isNaN(date.getTime())) return '';
    return pad2(date.getHours()) + ':' + pad2(date.getMinutes());
  }

  function greeting(date) {
    var hour = date ? date.getHours() : new Date().getHours();
    if (hour < 5) return '夜深了';
    if (hour < 11) return '早上好';
    if (hour < 13) return '中午好';
    if (hour < 18) return '下午好';
    return '晚上好';
  }

  function uid(prefix) {
    var head = prefix || 'id';
    if (global.crypto && typeof global.crypto.randomUUID === 'function') {
      return head + '_' + global.crypto.randomUUID();
    }
    return head + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10);
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  /** Fisher–Yates 洗牌，不改变原数组 */
  function shuffle(list) {
    var result = list.slice();
    for (var i = result.length - 1; i > 0; i -= 1) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = result[i];
      result[i] = result[j];
      result[j] = temp;
    }
    return result;
  }

  function uniqueBy(list, keyFn) {
    var seen = Object.create(null);
    var result = [];
    list.forEach(function (item) {
      var key = keyFn(item);
      if (seen[key]) return;
      seen[key] = true;
      result.push(item);
    });
    return result;
  }

  function debounce(fn, wait) {
    var timer = null;
    return function () {
      var args = arguments;
      var context = this;
      if (timer) clearTimeout(timer);
      timer = setTimeout(function () {
        timer = null;
        fn.apply(context, args);
      }, wait);
    };
  }

  function downloadBlob(blob, filename) {
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1200);
  }

  /** 拼写题判分：忽略大小写、句首尾空格，连字符与空格视为等价 */
  function normalizeAnswer(value) {
    return String(value == null ? '' : value)
      .normalize('NFKC')
      .toLowerCase()
      .replace(/[’‘`]/g, "'")
      .replace(/-/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function speakEnglish(text) {
    if (!text || !('speechSynthesis' in global)) return false;
    try {
      global.speechSynthesis.cancel();
      var utterance = new global.SpeechSynthesisUtterance(String(text));
      utterance.lang = 'en-US';
      utterance.rate = 0.86;
      utterance.pitch = 1;
      var voices = global.speechSynthesis.getVoices() || [];
      var preferred = voices.find(function (voice) {
        return /en[-_]US/i.test(voice.lang) && /Samantha|Google US English|Microsoft (Aria|Jenny|Zira)/i.test(voice.name);
      }) || voices.find(function (voice) {
        return /^en/i.test(voice.lang);
      });
      if (preferred) utterance.voice = preferred;
      global.speechSynthesis.speak(utterance);
      return true;
    } catch (error) {
      return false;
    }
  }

  function truncate(text, length) {
    var value = String(text == null ? '' : text);
    if (value.length <= length) return value;
    return value.slice(0, Math.max(0, length - 1)) + '…';
  }

  function storageSizeText(bytes) {
    if (!bytes) return '0 KB';
    if (bytes < 1024 * 1024) return Math.max(1, Math.round(bytes / 1024)) + ' KB';
    return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  }

  var Utils = {
    WEEKDAYS_CN: WEEKDAYS_CN,
    WEEKDAYS_CN_SHORT: WEEKDAYS_CN_SHORT,
    MONTHS_EN: MONTHS_EN,
    MONTHS_EN_FULL: MONTHS_EN_FULL,
    WEEKDAYS_EN: WEEKDAYS_EN,
    pad2: pad2,
    escapeHTML: escapeHTML,
    dateToStr: dateToStr,
    todayStr: todayStr,
    isValidDateStr: isValidDateStr,
    parseDateStr: parseDateStr,
    addDays: addDays,
    diffDays: diffDays,
    weekdayCN: weekdayCN,
    weekdayEN: weekdayEN,
    monthShortEN: monthShortEN,
    monthFullEN: monthFullEN,
    formatDateCN: formatDateCN,
    formatMonthCN: formatMonthCN,
    relativeDateLabel: relativeDateLabel,
    formatTime: formatTime,
    greeting: greeting,
    uid: uid,
    clamp: clamp,
    shuffle: shuffle,
    uniqueBy: uniqueBy,
    debounce: debounce,
    downloadBlob: downloadBlob,
    normalizeAnswer: normalizeAnswer,
    speakEnglish: speakEnglish,
    truncate: truncate,
    storageSizeText: storageSizeText
  };

  global.Utils = Utils;
  if (typeof module !== 'undefined' && module.exports) module.exports = Utils;
})(typeof window !== 'undefined' ? window : globalThis);
