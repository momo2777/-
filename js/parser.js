/* 拾词 · 单词文本与表格解析 */
(function (global) {
  'use strict';

  var CJK_RE = /[㐀-䶿一-鿿豈-﫿]/;
  var LATIN_RE = /[A-Za-z]/;
  var POS_WORDS = ['n', 'v', 'vt', 'vi', 'adj', 'adv', 'prep', 'conj', 'pron', 'num', 'art', 'interj', 'aux', 'abbr', 'phr', 'pl'];
  var EN_HEADERS = ['english', 'word', 'words', 'vocabulary', 'vocab', 'term', 'terms', 'spelling', 'englishword', 'englishwords', '单词', '英文', '英语', '词汇', '英文单词', '英语单词', '单词英文', '词条'];
  var ZH_HEADERS = ['chinese', 'meaning', 'meanings', 'definition', 'definitions', 'translation', 'chinesemeaning', 'chinesetranslation', '中文', '汉语', '释义', '意思', '翻译', '词义', '中文意思', '中文释义', '中文翻译', '解释'];
  var DATE_HEADERS = ['date', 'day', 'studydate', '日期', '学习日期', '打卡日期', '时间', '学习时间', '计划日期'];

  function pad2(n) {
    return String(n).padStart(2, '0');
  }

  function localDateStr(date) {
    return date.getFullYear() + '-' + pad2(date.getMonth() + 1) + '-' + pad2(date.getDate());
  }

  function todayStr() {
    return localDateStr(new Date());
  }

  function hasCJK(value) {
    return CJK_RE.test(String(value == null ? '' : value));
  }

  function hasLatin(value) {
    return LATIN_RE.test(String(value == null ? '' : value));
  }

  function normalizeSpaces(value) {
    return String(value == null ? '' : value)
      .replace(/ /g, ' ')
      .replace(/　/g, ' ')
      .replace(/[ \t]+/g, ' ')
      .trim();
  }

  function cellText(value) {
    if (value == null) return '';
    if (value instanceof Date) return normalizeDateValue(value) || '';
    if (typeof value === 'number') return String(value);
    return String(value).replace(/ /g, ' ').trim();
  }

  function buildDateStr(year, month, day) {
    var y = Number(year);
    var m = Number(month);
    var d = Number(day);
    if (!isFinite(y) || !isFinite(m) || !isFinite(d)) return null;
    if (y < 1900 || y > 2200 || m < 1 || m > 12 || d < 1 || d > 31) return null;
    var check = new Date(y, m - 1, d, 12, 0, 0, 0);
    if (check.getFullYear() !== y || check.getMonth() !== m - 1 || check.getDate() !== d) return null;
    return y + '-' + pad2(m) + '-' + pad2(d);
  }

  function fromExcelSerial(serial) {
    var days = Math.floor(Number(serial));
    if (!isFinite(days) || days < 1 || days > 200000) return null;
    var date = new Date(Date.UTC(1899, 11, 30) + days * 86400000);
    return buildDateStr(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
  }

  /** 解析 Excel 日期、日期字符串等，输出 YYYY-MM-DD */
  function normalizeDateValue(value) {
    if (value == null || value === '') return null;
    if (value instanceof Date) {
      if (isNaN(value.getTime())) return null;
      return buildDateStr(value.getFullYear(), value.getMonth() + 1, value.getDate());
    }
    if (typeof value === 'number') {
      if (value >= 19000101 && value <= 22001231 && String(Math.floor(value)).length === 8) {
        var digits = String(Math.floor(value));
        return buildDateStr(digits.slice(0, 4), digits.slice(4, 6), digits.slice(6, 8));
      }
      if (value >= 20000 && value <= 80000) return fromExcelSerial(value);
      return null;
    }
    var str = String(value).trim();
    if (!str) return null;

    if (/^\d{5}(?:\.\d+)?$/.test(str)) {
      var serialValue = Number(str);
      if (serialValue >= 20000 && serialValue <= 80000) return fromExcelSerial(serialValue);
    }

    var match = /^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})(?:[ T].*)?$/.exec(str);
    if (match) return buildDateStr(match[1], match[2], match[3]);

    match = /^(\d{4})年(\d{1,2})月(\d{1,2})日?(?:\s.*)?$/.exec(str);
    if (match) return buildDateStr(match[1], match[2], match[3]);

    match = /^(\d{4})(\d{2})(\d{2})$/.exec(str);
    if (match) return buildDateStr(match[1], match[2], match[3]);

    match = /^(\d{1,2})[-/.](\d{1,2})(?:[日号])?(?:[ T].*)?$/.exec(str);
    if (match) {
      var currentYear = new Date().getFullYear();
      var mdDate = buildDateStr(currentYear, match[1], match[2]);
      if (mdDate) return mdDate;
    }

    match = /^(\d{1,2})月(\d{1,2})[日号]?(?:\s.*)?$/.exec(str);
    if (match) {
      var yearNow = new Date().getFullYear();
      return buildDateStr(yearNow, match[1], match[2]);
    }

    return null;
  }

  var WEEKDAY_LABEL_RE = /(?:sunday|monday|tuesday|wednesday|thursday|friday|saturday|(?:周|星期)[一二三四五六日天])/i;
  var DATE_WITH_YEAR_IN_TEXT_RE = /(\d{4})\s*[.\-/年]\s*(\d{1,2})\s*[.\-/月]\s*(\d{1,2})\s*(?:日|号)?/;
  var MONTH_DAY_IN_TEXT_RE = /(\d{1,2})\s*[.\-/月]\s*(\d{1,2})\s*(?:日|号)?/;

  /** 从 “Sunday(周日)11.22号” 这类标签中提取日期 */
  function extractDateFromLabel(value) {
    var text = cellText(value);
    if (!text) return null;
    var direct = normalizeDateValue(text);
    if (direct) return direct;
    if (!WEEKDAY_LABEL_RE.test(text)) return null;

    var yearMatch = DATE_WITH_YEAR_IN_TEXT_RE.exec(text);
    if (yearMatch) {
      var fullDate = buildDateStr(yearMatch[1], yearMatch[2], yearMatch[3]);
      if (fullDate) return fullDate;
    }
    var monthDayMatch = MONTH_DAY_IN_TEXT_RE.exec(text);
    if (monthDayMatch) {
      return buildDateStr(new Date().getFullYear(), monthDayMatch[1], monthDayMatch[2]);
    }
    return null;
  }

  function normalizeHeader(value) {
    return String(value == null ? '' : value)
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[：:()（）\[\]【】_\-./\\·,，。;；]/g, '')
      .trim();
  }

  function headerKind(value) {
    var normalized = normalizeHeader(value);
    if (!normalized) return '';
    if (DATE_HEADERS.indexOf(normalized) >= 0 || /日期$/.test(normalized)) return 'date';
    if (ZH_HEADERS.indexOf(normalized) >= 0) return 'zh';
    if (EN_HEADERS.indexOf(normalized) >= 0) return 'en';
    return '';
  }

  function stripListPrefix(value) {
    return String(value == null ? '' : value)
      .replace(/^[\s​﻿]+/, '')
      .replace(/^(?:\d{1,3}[.、．)）]\s*)+/, '')
      .replace(/^[-–—•·*]\s+/, '');
  }

  function stripWrapping(value) {
    var text = String(value == null ? '' : value).trim();
    var pairs = [
      ['"', '"'],
      ['“', '”'],
      ['(', ')'],
      ['（', '）'],
      ['[', ']'],
      ['【', '】']
    ];
    var changed = true;
    while (changed && text.length >= 2) {
      changed = false;
      for (var i = 0; i < pairs.length; i += 1) {
        if (text.charAt(0) === pairs[i][0] && text.charAt(text.length - 1) === pairs[i][1]) {
          text = text.slice(1, -1).trim();
          changed = true;
          break;
        }
      }
    }
    return text;
  }

  function cleanEnglish(value) {
    var text = normalizeSpaces(value);
    text = stripListPrefix(text);
    text = stripWrapping(text);
    text = text.replace(/^[\s:：\-–—=,，;；|·•/]+/, '');
    text = text.replace(/[\s:：\-–—=,，;；|·•/]+$/, '');
    text = normalizeSpaces(text);
    return text;
  }

  function cleanChinese(value) {
    var text = normalizeSpaces(value);
    text = text.replace(/^[\s:：\-–—=,，;；|·•/]+/, '');
    text = text.replace(/[\s:：\-–—=,，;；|·•/]+$/, '');
    return normalizeSpaces(text);
  }

  function isPartOfSpeechToken(token) {
    var raw = String(token || '').trim();
    if (!raw) return false;
    var normalized = raw.replace(/^[（(\[]+|[）)\]]+$/g, '').toLowerCase();
    if (!/[.．]/.test(normalized) && !/^[（(]/.test(raw)) return false;
    normalized = normalized.replace(/[.．]/g, '');
    return POS_WORDS.indexOf(normalized) >= 0;
  }

  function movePartOfSpeech(enRaw, zhRaw) {
    var tokens = String(enRaw || '').trim().split(/\s+/).filter(Boolean);
    var moved = [];
    while (tokens.length > 1 && isPartOfSpeechToken(tokens[tokens.length - 1])) {
      var token = tokens.pop().replace(/^[（(\[]+|[）)\]]+$/g, '');
      moved.unshift(token);
    }
    var en = tokens.join(' ');
    var zh = String(zhRaw || '').trim();
    if (moved.length) {
      zh = moved.join(' ') + (zh ? ' ' + zh : '');
    }
    return { en: en, zh: zh };
  }

  function makeEntry(enRaw, zhRaw, dateValue, raw, fallbackDate) {
    var en = String(enRaw == null ? '' : enRaw);
    var zh = String(zhRaw == null ? '' : zhRaw);
    var parts = movePartOfSpeech(en, zh);
    en = cleanEnglish(parts.en);
    zh = cleanChinese(parts.zh);

    if (!en) return { error: '没有识别到英文' };
    if (CJK_RE.test(en)) return { error: '英文部分混入了中文' };
    if (!LATIN_RE.test(en)) return { error: '没有识别到英文' };
    if (isPartOfSpeechToken(en)) return { error: '英文部分只有词性标记' };
    if (!zh) return { error: '没有识别到中文释义' };
    if (!CJK_RE.test(zh)) return { error: '中文释义中未找到汉字' };

    var date = normalizeDateValue(dateValue) || normalizeDateValue(fallbackDate) || todayStr();
    return {
      entry: {
        en: en,
        zh: zh,
        date: date,
        raw: String(raw == null ? '' : raw)
      }
    };
  }

  function looksLikeSection(line) {
    return /^(unit|lesson|chapter|module|list|book)\s*\d+\b/i.test(line) ||
      /^第[一二三四五六七八九十百千\d]+(单元|课|章|节|天|部分|组)/.test(line);
  }

  function rowHeaderKinds(row) {
    var kinds = Object.create(null);
    var found = [];
    (row || []).forEach(function (cell) {
      var kind = headerKind(cellText(cell));
      if (kind && !kinds[kind]) {
        kinds[kind] = true;
        found.push(kind);
      }
    });
    return found;
  }

  function looksLikeHeaderLine(line) {
    if (!line) return false;
    var cells = String(line).split('\t').map(cellText).filter(Boolean);
    if (cells.length < 2) {
      cells = String(line).split(/[\s/|;；,，]+/).map(cellText).filter(Boolean);
    }
    if (cells.length < 2) return false;
    var kinds = rowHeaderKinds(cells);
    return kinds.indexOf('en') >= 0 && kinds.indexOf('zh') >= 0;
  }

  function dedupeEntries(entries) {
    var seen = Object.create(null);
    var result = [];
    var duplicateCount = 0;
    entries.forEach(function (entry) {
      var key = entry.en.trim().toLowerCase() + '\u0000' + entry.date;
      if (seen[key]) {
        duplicateCount += 1;
        return;
      }
      seen[key] = true;
      result.push(entry);
    });
    return { entries: result, duplicateCount: duplicateCount };
  }

  function parseSingleLine(rawLine, fallbackDate, allowMulti) {
    var line = stripListPrefix(String(rawLine == null ? '' : rawLine).replace(/ /g, ' ').trim());
    if (!line) return { entries: [], errors: [], skipped: 1 };
    if (/^[-=_*—–\s·.]+$/.test(line)) return { entries: [], errors: [], skipped: 1 };
    if (looksLikeSection(line)) return { entries: [], errors: [], skipped: 1 };
    if (looksLikeHeaderLine(line)) return { entries: [], errors: [], skipped: 1 };

    if (allowMulti && line.indexOf('\t') === -1) {
      var delimiterSets = [/[;；|]/, /[,，]/];
      for (var d = 0; d < delimiterSets.length; d += 1) {
        var segments = line.split(delimiterSets[d]).map(function (part) {
          return part.trim();
        }).filter(Boolean);
        if (segments.length < 2) continue;
        var subResults = segments.map(function (segment) {
          return parseSingleLine(segment, fallbackDate, false);
        });
        var allSingle = subResults.every(function (result) {
          return result.errors.length === 0 && result.entries.length === 1;
        });
        if (allSingle) {
          return {
            entries: subResults.reduce(function (all, result) {
              return all.concat(result.entries);
            }, []),
            errors: [],
            skipped: 0
          };
        }
      }
    }

    var firstCJK = line.search(CJK_RE);
    if (firstCJK < 0) {
      return {
        entries: [],
        errors: [{ message: '没有找到中文释义', raw: rawLine }],
        skipped: 0
      };
    }

    var enRaw;
    var zhRaw;
    if (firstCJK > 0) {
      enRaw = line.slice(0, firstCJK);
      zhRaw = line.slice(firstCJK);
    } else {
      var firstLatin = line.search(LATIN_RE);
      if (firstLatin < 0) {
        return {
          entries: [],
          errors: [{ message: '没有找到英文单词', raw: rawLine }],
          skipped: 0
        };
      }
      zhRaw = line.slice(0, firstLatin);
      enRaw = line.slice(firstLatin);
    }

    var made = makeEntry(enRaw, zhRaw, fallbackDate, rawLine, fallbackDate);
    if (made.error) {
      return { entries: [], errors: [{ message: made.error, raw: rawLine }], skipped: 0 };
    }
    return { entries: [made.entry], errors: [], skipped: 0 };
  }

  function parseTabbedLine(line, fallbackDate) {
    var cells = line.split('\t').map(function (cell) {
      return normalizeSpaces(cell);
    });
    var nonEmpty = cells.filter(Boolean);
    if (!nonEmpty.length) return { entries: [], errors: [], skipped: 1 };

    var dates = [];
    var content = [];
    nonEmpty.forEach(function (cell) {
      var parsedDate = normalizeDateValue(cell);
      if (parsedDate && !hasLatin(cell)) {
        dates.push(parsedDate);
      } else {
        content.push(cell);
      }
    });

    if (!content.length) return { entries: [], errors: [], skipped: 1 };

    if (content.length > 1 && /^\d{1,4}$/.test(content[0])) {
      content.shift();
    }
    if (!content.length) return { entries: [], errors: [], skipped: 1 };

    var date = dates.length ? dates[dates.length - 1] : fallbackDate;

    if (content.length === 1) {
      return parseSingleLine(content[0], date, true);
    }

    var enRaw = content[0];
    var zhRaw = content[1];
    var made = makeEntry(enRaw, zhRaw, date, line, fallbackDate);
    if (!made.error) return { entries: [made.entry], errors: [], skipped: 0 };

    // 单元格可能没有按列对应，尝试把整行当成一条词条再解析一次
    var combined = content.join(' ');
    if (combined !== line) {
      var fallback = parseSingleLine(combined, date, false);
      if (fallback.entries.length) return fallback;
    }
    return { entries: [], errors: [{ message: made.error, raw: line }], skipped: 0 };
  }

  function parseOneLine(rawLine, fallbackDate) {
    var line = stripListPrefix(String(rawLine == null ? '' : rawLine).replace(/ /g, ' ').trim());
    if (!line) return { entries: [], errors: [], skipped: 1 };
    if (/^[-=_*—–\s·.]+$/.test(line)) return { entries: [], errors: [], skipped: 1 };
    if (looksLikeSection(line)) return { entries: [], errors: [], skipped: 1 };
    if (looksLikeHeaderLine(line)) return { entries: [], errors: [], skipped: 1 };
    if (line.indexOf('\t') >= 0) return parseTabbedLine(line, fallbackDate);
    return parseSingleLine(line, fallbackDate, true);
  }

  /** 批量粘贴文本解析 */
  function parseBatch(text, fallbackDate) {
    var input = String(text == null ? '' : text).replace(/^﻿/, '');
    var lines = input.replace(/\r\n?/g, '\n').split('\n');
    var entries = [];
    var errors = [];
    var skippedCount = 0;

    lines.forEach(function (line, index) {
      var result = parseOneLine(line, fallbackDate);
      skippedCount += result.skipped || 0;
      result.entries.forEach(function (entry) {
        entry.line = index + 1;
        entries.push(entry);
      });
      result.errors.forEach(function (error) {
        errors.push({
          line: index + 1,
          raw: line,
          message: error.message || '无法解析'
        });
      });
    });

    var deduped = dedupeEntries(entries);
    return {
      entries: deduped.entries,
      errors: errors,
      skippedCount: skippedCount,
      duplicateCount: deduped.duplicateCount,
      totalLines: lines.filter(function (line) {
        return String(line).trim();
      }).length
    };
  }

  function normalizeMatrix(matrix) {
    if (!Array.isArray(matrix)) return [];
    var rows = matrix.map(function (row) {
      return Array.isArray(row) ? row.slice() : [row];
    });
    var maxCols = 0;
    rows.forEach(function (row) {
      if (row.length > maxCols) maxCols = row.length;
    });
    return rows.map(function (row) {
      var copy = row.slice();
      while (copy.length < maxCols) copy.push('');
      return copy;
    });
  }

  function findHeaderRow(rows) {
    var limit = Math.min(rows.length, 12);
    for (var i = 0; i < limit; i += 1) {
      var row = rows[i];
      if (!row || !row.some(function (cell) { return cellText(cell); })) continue;
      var kinds = rowHeaderKinds(row);
      if (kinds.indexOf('en') >= 0 && kinds.indexOf('zh') >= 0) {
        var mapping = { en: -1, zh: -1, date: -1 };
        row.forEach(function (cell, colIndex) {
          var kind = headerKind(cellText(cell));
          if (kind && mapping[kind] < 0) mapping[kind] = colIndex;
        });
        return { index: i, mapping: mapping, labels: row.map(cellText) };
      }
    }
    return { index: -1, mapping: { en: -1, zh: -1, date: -1 }, labels: [] };
  }

  function inferMapping(rows, startIndex) {
    var stats = [];
    var maxCols = 0;
    rows.forEach(function (row) {
      if (row.length > maxCols) maxCols = row.length;
    });
    var sampleEnd = Math.min(rows.length, startIndex + 100);

    for (var col = 0; col < maxCols; col += 1) {
      stats.push({
        col: col,
        nonEmpty: 0,
        latinOnly: 0,
        cjkOnly: 0,
        mixed: 0,
        dateHits: 0
      });
    }

    for (var r = startIndex; r < sampleEnd; r += 1) {
      var row = rows[r] || [];
      for (var c = 0; c < maxCols; c += 1) {
        var cell = row[c];
        var text = cellText(cell);
        if (!text) continue;
        var stat = stats[c];
        stat.nonEmpty += 1;
        var cjk = hasCJK(text);
        var latin = hasLatin(text);
        if (cjk && latin) stat.mixed += 1;
        else if (cjk) stat.cjkOnly += 1;
        else if (latin) stat.latinOnly += 1;
        if (normalizeDateValue(cell)) stat.dateHits += 1;
      }
    }

    var dateCol = -1;
    var bestDateRatio = 0;
    stats.forEach(function (stat) {
      if (!stat.nonEmpty) return;
      var ratio = stat.dateHits / stat.nonEmpty;
      if (stat.dateHits >= 2 && ratio >= 0.55 && stat.cjkOnly === 0 && ratio > bestDateRatio) {
        bestDateRatio = ratio;
        dateCol = stat.col;
      }
    });

    var enCol = -1;
    var zhCol = -1;
    var bestEnScore = 0;
    var bestZhScore = 0;
    stats.forEach(function (stat) {
      if (stat.col === dateCol || !stat.nonEmpty) return;
      var enScore = stat.latinOnly * 2 + stat.mixed * 0.6 - stat.cjkOnly * 2;
      var zhScore = stat.cjkOnly * 2 + stat.mixed * 0.6 - stat.latinOnly * 2;
      if (enScore > bestEnScore) {
        bestEnScore = enScore;
        enCol = stat.col;
      }
      if (zhScore > bestZhScore) {
        bestZhScore = zhScore;
        zhCol = stat.col;
      }
    });

    if (enCol < 0 && zhCol >= 0) enCol = zhCol;
    if (zhCol === enCol) zhCol = -1;
    if (enCol === dateCol) enCol = -1;
    if (zhCol === dateCol) zhCol = -1;

    return { en: enCol, zh: zhCol, date: dateCol };
  }

  function isPairCell(value) {
    var text = cellText(value);
    if (!text || !hasCJK(text) || !hasLatin(text)) return false;
    if (extractDateFromLabel(text)) return false;
    var result = parseSingleLine(text, todayStr(), false);
    return result.entries.length === 1 && result.errors.length === 0;
  }

  /** 识别“每格一个词条”的横向表格，例如每个单元格都是“礼物present” */
  function analyzeCellLayout(rows, startIndex) {
    var pairCells = 0;
    var rowsWithPairs = 0;
    var dateLabelRows = 0;
    var limit = Math.min(rows.length, startIndex + 60);

    for (var r = startIndex; r < limit; r += 1) {
      var row = rows[r] || [];
      var pairInRow = 0;
      var hasLabel = false;
      for (var c = 0; c < row.length; c += 1) {
        var text = cellText(row[c]);
        if (!text) continue;
        if (extractDateFromLabel(text)) {
          hasLabel = true;
          continue;
        }
        if (isPairCell(text)) pairInRow += 1;
      }
      if (pairInRow > 0) {
        pairCells += pairInRow;
        rowsWithPairs += 1;
      }
      if (hasLabel) dateLabelRows += 1;
    }

    return {
      isCells: pairCells >= 3 || (dateLabelRows >= 2 && rowsWithPairs >= 1),
      pairCells: pairCells,
      rowsWithPairs: rowsWithPairs,
      dateLabelRows: dateLabelRows
    };
  }

  /** 分析表格的列对应关系，供界面展示与手动修正 */
  function detectTable(matrix) {
    var rows = normalizeMatrix(matrix);
    var header = findHeaderRow(rows);
    var columnCount = rows.reduce(function (max, row) { return Math.max(max, row.length); }, 0);

    if (header.index < 0) {
      var cellAnalysis = analyzeCellLayout(rows, 0);
      if (cellAnalysis.isCells) {
        return {
          headerRow: -1,
          headerLabels: [],
          mapping: { en: -1, zh: -1, date: -1 },
          layout: 'cells',
          cellAnalysis: cellAnalysis,
          columnCount: columnCount,
          rowCount: rows.length
        };
      }
    }

    var dataStart = header.index >= 0 ? header.index + 1 : 0;
    var inferred = inferMapping(rows, dataStart);
    var mapping = {
      en: header.mapping.en,
      zh: header.mapping.zh,
      date: header.mapping.date
    };

    if (mapping.en < 0 && inferred.en >= 0) mapping.en = inferred.en;
    if (mapping.zh < 0 && inferred.zh >= 0) mapping.zh = inferred.zh;
    if (mapping.date < 0 && inferred.date >= 0) mapping.date = inferred.date;

    if (mapping.zh === mapping.en) mapping.zh = -1;
    if (mapping.date === mapping.en || mapping.date === mapping.zh) mapping.date = -1;

    return {
      headerRow: header.index,
      headerLabels: header.labels,
      mapping: mapping,
      layout: 'columns',
      columnCount: columnCount,
      rowCount: rows.length
    };
  }

  function parseCellsLayout(rows, fallbackDate, analysis) {
    var fallback = normalizeDateValue(fallbackDate) || todayStr();
    var lastLabelDate = null;
    var entries = [];
    var errors = [];
    var skippedCount = 0;

    rows.forEach(function (row, rowIndex) {
      var nonEmpty = row.map(cellText).filter(Boolean);
      if (!nonEmpty.length) {
        skippedCount += 1;
        return;
      }

      var labelIndexes = Object.create(null);
      var rowLabelDate = null;
      row.forEach(function (cell, index) {
        var labelDate = extractDateFromLabel(cell);
        if (labelDate) {
          labelIndexes[index] = true;
          if (!rowLabelDate) rowLabelDate = labelDate;
        }
      });
      if (rowLabelDate) lastLabelDate = rowLabelDate;
      var rowDate = lastLabelDate || fallback;

      row.forEach(function (cell, index) {
        if (labelIndexes[index]) return;
        var text = cellText(cell);
        if (!text) return;
        if (looksLikeSection(text) || looksLikeHeaderLine(text)) {
          skippedCount += 1;
          return;
        }
        var result = parseSingleLine(text, rowDate, true);
        if (result.entries.length) {
          result.entries.forEach(function (entry) {
            entry.row = rowIndex + 1;
            entry.raw = text;
            entries.push(entry);
          });
        } else if (result.errors.length) {
          errors.push({ row: rowIndex + 1, message: result.errors[0].message, raw: text });
        } else {
          skippedCount += 1;
        }
      });
    });

    var deduped = dedupeEntries(entries);
    return {
      entries: deduped.entries,
      errors: errors,
      duplicateCount: deduped.duplicateCount,
      skippedCount: skippedCount,
      analysis: analysis,
      mapping: { en: -1, zh: -1, date: -1, layout: 'cells' }
    };
  }

  /**
   * 解析二维表格，mapping 可覆盖自动识别结果。
   * mapping: { en: 列索引, zh: 列索引（-1 表示整行自动识别）, date: 列索引（-1 表示无日期列）, headerRow: 行索引 }
   */
  function parseTable(matrix, fallbackDate, mappingOverride) {
    var rows = normalizeMatrix(matrix);
    var analysis = detectTable(rows);
    var mapping = {
      en: analysis.mapping.en,
      zh: analysis.mapping.zh,
      date: analysis.mapping.date,
      headerRow: analysis.headerRow
    };

    if (mappingOverride) {
      ['en', 'zh', 'date'].forEach(function (key) {
        if (typeof mappingOverride[key] === 'number') mapping[key] = mappingOverride[key];
      });
      if (typeof mappingOverride.headerRow === 'number') mapping.headerRow = mappingOverride.headerRow;
    }

    if (mapping.zh === mapping.en) mapping.zh = -1;
    if (mapping.date === mapping.en || mapping.date === mapping.zh) mapping.date = -1;

    if (analysis.layout === 'cells') {
      return parseCellsLayout(rows, fallbackDate, analysis);
    }

    var start = mapping.headerRow >= 0 ? mapping.headerRow + 1 : 0;
    var entries = [];
    var errors = [];
    var skippedCount = 0;

    if (mapping.en < 0) {
      return {
        entries: [],
        errors: [{ row: 0, message: '没有识别出英文列，请在下方手动选择', raw: '' }],
        duplicateCount: 0,
        skippedCount: 0,
        analysis: analysis,
        mapping: mapping
      };
    }

    for (var i = start; i < rows.length; i += 1) {
      var row = rows[i];
      var raw = row.map(cellText).filter(Boolean).join(' | ');
      if (!raw) {
        skippedCount += 1;
        continue;
      }
      if (looksLikeHeaderLine(row.map(cellText).join('\t'))) {
        skippedCount += 1;
        continue;
      }

      var date = fallbackDate;
      if (mapping.date >= 0) {
        var parsedDate = normalizeDateValue(row[mapping.date]);
        if (parsedDate) date = parsedDate;
      }

      if (mapping.zh < 0) {
        var contentCells = [];
        row.forEach(function (cell, colIndex) {
          if (colIndex === mapping.date) return;
          var text = cellText(cell);
          if (text) contentCells.push(text);
        });
        if (!contentCells.length) {
          skippedCount += 1;
          continue;
        }
        var singleResult = parseSingleLine(contentCells.join(' '), date, true);
        if (singleResult.entries.length) {
          singleResult.entries.forEach(function (entry) {
            entry.row = i + 1;
            entry.raw = raw;
            entries.push(entry);
          });
        } else if (singleResult.errors.length) {
          errors.push({ row: i + 1, message: singleResult.errors[0].message, raw: raw });
        } else {
          skippedCount += 1;
        }
        continue;
      }

      var enRaw = cellText(row[mapping.en]);
      var zhRaw = cellText(row[mapping.zh]);
      if (!enRaw && !zhRaw) {
        skippedCount += 1;
        continue;
      }
      if (!enRaw) {
        errors.push({ row: i + 1, message: '英文列为空', raw: raw });
        continue;
      }
      if (!zhRaw) {
        errors.push({ row: i + 1, message: '中文列为空', raw: raw });
        continue;
      }

      var made = makeEntry(enRaw, zhRaw, date, raw, fallbackDate);
      if (made.error) {
        // 如果两个列中有一列本身就是合并内容，尝试再按整行识别
        var rescue = parseSingleLine(enRaw + ' ' + zhRaw, date, false);
        if (rescue.entries.length) {
          rescue.entries.forEach(function (entry) {
            entry.row = i + 1;
            entry.raw = raw;
            entries.push(entry);
          });
        } else {
          errors.push({ row: i + 1, message: made.error, raw: raw });
        }
      } else {
        made.entry.row = i + 1;
        made.entry.raw = raw;
        entries.push(made.entry);
      }
    }

    var deduped = dedupeEntries(entries);
    return {
      entries: deduped.entries,
      errors: errors,
      duplicateCount: deduped.duplicateCount,
      skippedCount: skippedCount,
      analysis: analysis,
      mapping: mapping
    };
  }

  function makeSingleEntry(en, zh, date) {
    var made = makeEntry(en, zh, date, en + ' ' + zh, date);
    if (made.error) return { error: made.error, entry: null };
    return { error: null, entry: made.entry };
  }

  var WordParser = {
    parseBatch: parseBatch,
    parseTable: parseTable,
    detectTable: detectTable,
    normalizeDateValue: normalizeDateValue,
    extractDateFromLabel: extractDateFromLabel,
    makeEntry: makeSingleEntry,
    hasCJK: hasCJK,
    hasLatin: hasLatin
  };

  global.WordParser = WordParser;
  if (typeof module !== 'undefined' && module.exports) module.exports = WordParser;
})(typeof window !== 'undefined' ? window : globalThis);
