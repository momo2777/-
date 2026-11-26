/* 拾词 · 本地数据存储 */
(function (global) {
  'use strict';

  var KEY = 'shici.store.v1';
  var VERSION = 1;
  var storage = null;
  var storageAvailable = false;
  var state = null;
  var lastError = null;

  function nowIso() {
    return new Date().toISOString();
  }

  function emptyState() {
    return {
      version: VERSION,
      words: [],
      days: {},
      createdAt: nowIso(),
      updatedAt: nowIso()
    };
  }

  function validIso(value) {
    if (typeof value !== 'string' || !value) return null;
    var time = Date.parse(value);
    return isNaN(time) ? null : value;
  }

  function cleanText(value) {
    return String(value == null ? '' : value).replace(/\s+/g, ' ').trim();
  }

  function wordKey(en, date) {
    return cleanText(en).toLowerCase() + '\u0000' + date;
  }

  function makeId(value) {
    if (typeof value === 'string' && /^[A-Za-z0-9_-]{1,80}$/.test(value)) return value;
    return Utils.uid('w');
  }

  function sanitizePracticeResult(raw) {
    if (!raw || typeof raw !== 'object') return null;
    var correct = Number(raw.correct);
    var total = Number(raw.total);
    if (!isFinite(correct) || !isFinite(total) || total <= 0) return null;
    correct = Utils.clamp(Math.round(correct), 0, Math.round(total));
    total = Math.round(total);
    return {
      correct: correct,
      total: total,
      score: Math.round((correct / total) * 100),
      mode: typeof raw.mode === 'string' ? raw.mode : 'en2zh',
      at: validIso(raw.at) || nowIso()
    };
  }

  function sanitizeDay(raw) {
    if (!raw || typeof raw !== 'object') return null;
    var day = {
      studyDoneAt: validIso(raw.studyDoneAt),
      practiceDoneAt: validIso(raw.practiceDoneAt),
      checkedInAt: validIso(raw.checkedInAt),
      practiceAttempts: Math.max(0, Math.floor(Number(raw.practiceAttempts) || 0)),
      bestPractice: sanitizePracticeResult(raw.bestPractice),
      lastPractice: sanitizePracticeResult(raw.lastPractice)
    };
    var hasAny = day.studyDoneAt || day.practiceDoneAt || day.checkedInAt ||
      day.practiceAttempts > 0 || day.bestPractice || day.lastPractice;
    return hasAny ? day : null;
  }

  function sanitizeState(raw) {
    var clean = emptyState();
    if (!raw || typeof raw !== 'object') return clean;
    clean.createdAt = validIso(raw.createdAt) || clean.createdAt;
    clean.updatedAt = validIso(raw.updatedAt) || clean.updatedAt;
    var ids = Object.create(null);

    if (Array.isArray(raw.words)) {
      raw.words.forEach(function (item) {
        if (!item || typeof item !== 'object') return;
        var en = cleanText(item.en);
        var zh = cleanText(item.zh);
        var date = Utils.isValidDateStr(item.date) ? item.date : null;
        if (!en || !zh || !date) return;
        if (!WordParser.hasLatin(en) || !WordParser.hasCJK(zh)) return;
        var id = makeId(item.id);
        while (ids[id]) id = Utils.uid('w');
        ids[id] = true;
        clean.words.push({
          id: id,
          en: en,
          zh: zh,
          date: date,
          createdAt: validIso(item.createdAt) || nowIso(),
          updatedAt: validIso(item.updatedAt) || nowIso()
        });
      });
    }

    if (raw.days && typeof raw.days === 'object') {
      Object.keys(raw.days).forEach(function (date) {
        if (!Utils.isValidDateStr(date)) return;
        var day = sanitizeDay(raw.days[date]);
        if (day) clean.days[date] = day;
      });
    }

    return clean;
  }

  function load() {
    if (!storage) return emptyState();
    try {
      var raw = storage.getItem(KEY);
      if (!raw) return emptyState();
      var parsed = JSON.parse(raw);
      return sanitizeState(parsed);
    } catch (error) {
      lastError = error;
      return emptyState();
    }
  }

  function save() {
    state.updatedAt = nowIso();
    if (!storageAvailable || !storage) return false;
    try {
      storage.setItem(KEY, JSON.stringify(state));
      return true;
    } catch (error) {
      lastError = error;
      return false;
    }
  }

  function init() {
    try {
      storage = global.localStorage;
      var probe = '__shici_probe__';
      storage.setItem(probe, '1');
      storage.removeItem(probe);
      storageAvailable = true;
    } catch (error) {
      storage = null;
      storageAvailable = false;
      lastError = error;
    }
    state = load();
    return state;
  }

  function isPersistent() {
    return storageAvailable;
  }

  function getLastError() {
    return lastError;
  }

  function getWords() {
    return state.words.slice();
  }

  function getWord(id) {
    for (var i = 0; i < state.words.length; i += 1) {
      if (state.words[i].id === id) return state.words[i];
    }
    return null;
  }

  function getWordsForDate(date) {
    return state.words
      .filter(function (word) { return word.date === date; })
      .sort(function (a, b) {
        return String(a.createdAt).localeCompare(String(b.createdAt));
      });
  }

  function getDatesWithWords() {
    var seen = Object.create(null);
    var dates = [];
    state.words.forEach(function (word) {
      if (!seen[word.date]) {
        seen[word.date] = true;
        dates.push(word.date);
      }
    });
    return dates.sort().reverse();
  }

  function getDay(date) {
    var record = state.days[date];
    if (!record) {
      return {
        studyDoneAt: null,
        practiceDoneAt: null,
        checkedInAt: null,
        practiceAttempts: 0,
        bestPractice: null,
        lastPractice: null
      };
    }
    return record;
  }

  function ensureDay(date) {
    if (!state.days[date]) {
      state.days[date] = {
        studyDoneAt: null,
        practiceDoneAt: null,
        checkedInAt: null,
        practiceAttempts: 0,
        bestPractice: null,
        lastPractice: null
      };
    }
    return state.days[date];
  }

  function getDateSummaries() {
    var records = Object.create(null);
    state.words.forEach(function (word) {
      if (!records[word.date]) records[word.date] = [];
      records[word.date].push(word);
    });
    return Object.keys(records).sort().reverse().map(function (date) {
      var day = getDay(date);
      return {
        date: date,
        count: records[date].length,
        words: records[date],
        day: day,
        checkedIn: !!day.checkedInAt,
        studyDone: !!day.studyDoneAt,
        practiceDone: !!day.practiceDoneAt
      };
    });
  }

  function getCheckedDates() {
    var result = [];
    Object.keys(state.days).forEach(function (date) {
      if (state.days[date].checkedInAt && Utils.isValidDateStr(date)) result.push(date);
    });
    return result.sort();
  }

  function calculateLongestStreak(checkedDates) {
    if (!checkedDates.length) return 0;
    var longest = 1;
    var current = 1;
    for (var i = 1; i < checkedDates.length; i += 1) {
      if (Utils.diffDays(checkedDates[i - 1], checkedDates[i]) === 1) {
        current += 1;
      } else {
        current = 1;
      }
      if (current > longest) longest = current;
    }
    return longest;
  }

  function calculateCurrentStreak(checkedSet) {
    var cursor = Utils.todayStr();
    if (!checkedSet[cursor]) cursor = Utils.addDays(cursor, -1);
    var count = 0;
    while (checkedSet[cursor]) {
      count += 1;
      cursor = Utils.addDays(cursor, -1);
    }
    return count;
  }

  function getStats() {
    var checkedDates = getCheckedDates();
    var checkedSet = Object.create(null);
    checkedDates.forEach(function (date) { checkedSet[date] = true; });
    var practiceAttempts = 0;
    Object.keys(state.days).forEach(function (date) {
      practiceAttempts += Number(state.days[date].practiceAttempts) || 0;
    });
    return {
      totalWords: state.words.length,
      wordDays: getDatesWithWords().length,
      checkInDays: checkedDates.length,
      studiedDays: Object.keys(state.days).filter(function (date) {
        return !!state.days[date].studyDoneAt;
      }).length,
      practicedDays: Object.keys(state.days).filter(function (date) {
        return !!state.days[date].practiceDoneAt;
      }).length,
      practiceAttempts: practiceAttempts,
      currentStreak: calculateCurrentStreak(checkedSet),
      longestStreak: calculateLongestStreak(checkedDates),
      checkedDates: checkedDates
    };
  }

  function countNewEntries(entries) {
    var existing = Object.create(null);
    state.words.forEach(function (word) {
      existing[wordKey(word.en, word.date)] = true;
    });
    var seen = Object.create(null);
    var newCount = 0;
    var duplicateCount = 0;
    var invalidCount = 0;
    (entries || []).forEach(function (entry) {
      if (!entry) {
        invalidCount += 1;
        return;
      }
      var en = cleanText(entry.en);
      var zh = cleanText(entry.zh);
      var date = Utils.isValidDateStr(entry.date) ? entry.date : null;
      if (!en || !zh || !date) {
        invalidCount += 1;
        return;
      }
      var key = wordKey(en, date);
      if (existing[key] || seen[key]) {
        duplicateCount += 1;
        return;
      }
      seen[key] = true;
      newCount += 1;
    });
    return { newCount: newCount, duplicateCount: duplicateCount, invalidCount: invalidCount };
  }

  function addWords(entries) {
    var existing = Object.create(null);
    state.words.forEach(function (word) {
      existing[wordKey(word.en, word.date)] = true;
    });
    var added = [];
    var duplicateCount = 0;
    var invalidCount = 0;

    (entries || []).forEach(function (entry) {
      if (!entry) {
        invalidCount += 1;
        return;
      }
      var en = cleanText(entry.en);
      var zh = cleanText(entry.zh);
      var date = Utils.isValidDateStr(entry.date) ? entry.date : null;
      if (!en || !zh || !date || !WordParser.hasLatin(en) || !WordParser.hasCJK(zh)) {
        invalidCount += 1;
        return;
      }
      var key = wordKey(en, date);
      if (existing[key]) {
        duplicateCount += 1;
        return;
      }
      existing[key] = true;
      var timestamp = nowIso();
      var word = {
        id: Utils.uid('w'),
        en: en,
        zh: zh,
        date: date,
        createdAt: timestamp,
        updatedAt: timestamp
      };
      state.words.push(word);
      added.push(word);
    });

    var storageOk = true;
    if (added.length) storageOk = save();
    return {
      added: added,
      duplicateCount: duplicateCount,
      invalidCount: invalidCount,
      storageOk: storageOk
    };
  }

  function updateWord(id, fields) {
    var word = getWord(id);
    if (!word) return { ok: false, error: '这个单词已经不存在了' };
    var next = {
      en: fields && fields.en != null ? cleanText(fields.en) : word.en,
      zh: fields && fields.zh != null ? cleanText(fields.zh) : word.zh,
      date: fields && fields.date != null ? fields.date : word.date
    };
    if (!next.en || !next.zh || !Utils.isValidDateStr(next.date)) {
      return { ok: false, error: '请填写完整的英文、中文和日期' };
    }
    if (!WordParser.hasLatin(next.en) || !WordParser.hasCJK(next.zh)) {
      return { ok: false, error: '英文或中文格式不正确' };
    }
    var key = wordKey(next.en, next.date);
    var duplicate = state.words.some(function (item) {
      return item.id !== id && wordKey(item.en, item.date) === key;
    });
    if (duplicate) return { ok: false, error: '这一天已经有相同的单词了' };
    word.en = next.en;
    word.zh = next.zh;
    word.date = next.date;
    word.updatedAt = nowIso();
    var storageOk = save();
    return { ok: true, word: word, storageOk: storageOk };
  }

  function deleteWord(id) {
    var before = state.words.length;
    state.words = state.words.filter(function (word) { return word.id !== id; });
    if (state.words.length === before) return { ok: false, error: '这个单词已经不存在了' };
    var storageOk = save();
    return { ok: true, storageOk: storageOk };
  }

  function markStudyDone(date) {
    if (!getWordsForDate(date).length) return { ok: false, error: '这一天还没有单词' };
    var day = ensureDay(date);
    if (!day.studyDoneAt) day.studyDoneAt = nowIso();
    var storageOk = save();
    return { ok: true, day: day, storageOk: storageOk };
  }

  function markPracticeDone(date, result) {
    if (!getWordsForDate(date).length) return { ok: false, error: '这一天还没有单词' };
    var cleanResult = sanitizePracticeResult({
      correct: result && result.correct,
      total: result && result.total,
      mode: result && result.mode,
      at: nowIso()
    });
    if (!cleanResult) return { ok: false, error: '练习结果无效' };
    var day = ensureDay(date);
    if (!day.practiceDoneAt) day.practiceDoneAt = cleanResult.at;
    day.practiceAttempts = (Number(day.practiceAttempts) || 0) + 1;
    day.lastPractice = cleanResult;
    if (!day.bestPractice ||
      cleanResult.score > day.bestPractice.score ||
      (cleanResult.score === day.bestPractice.score && cleanResult.total > day.bestPractice.total)) {
      day.bestPractice = cleanResult;
    }
    var storageOk = save();
    return { ok: true, day: day, storageOk: storageOk };
  }

  function checkIn(date) {
    var target = date || Utils.todayStr();
    if (!Utils.isValidDateStr(target)) return { ok: false, error: '日期无效' };
    if (!getWordsForDate(target).length) return { ok: false, error: '这一天还没有单词' };
    var day = ensureDay(target);
    if (!day.studyDoneAt) return { ok: false, error: '还没有完成背诵' };
    if (!day.practiceDoneAt) return { ok: false, error: '还没有完成练习' };
    var already = !!day.checkedInAt;
    if (!day.checkedInAt) day.checkedInAt = nowIso();
    var storageOk = save();
    return {
      ok: true,
      already: already,
      day: day,
      storageOk: storageOk,
      streak: getStats().currentStreak
    };
  }

  function getExportData() {
    var snapshot = JSON.parse(JSON.stringify(state));
    snapshot.app = '拾词';
    snapshot.exportedAt = nowIso();
    return snapshot;
  }

  function replaceFromBackup(raw) {
    if (!raw || typeof raw !== 'object') return { ok: false, error: '备份文件格式不正确' };
    var candidate = raw;
    if (!Array.isArray(candidate.words) && raw.data && Array.isArray(raw.data.words)) {
      candidate = raw.data;
    }
    if (!Array.isArray(candidate.words)) return { ok: false, error: '备份中没有找到单词数据' };
    var clean = sanitizeState(candidate);
    state = clean;
    var storageOk = save();
    return {
      ok: true,
      words: state.words.length,
      days: Object.keys(state.days).length,
      storageOk: storageOk
    };
  }

  function clearAll() {
    state = emptyState();
    var storageOk = save();
    return { ok: true, storageOk: storageOk };
  }

  function getStorageBytes() {
    try {
      var json = JSON.stringify(state);
      if (typeof Blob !== 'undefined') return new Blob([json]).size;
      return json.length * 2;
    } catch (error) {
      return 0;
    }
  }

  var Store = {
    init: init,
    isPersistent: isPersistent,
    getLastError: getLastError,
    getState: function () { return state; },
    getWords: getWords,
    getWord: getWord,
    getWordsForDate: getWordsForDate,
    getDatesWithWords: getDatesWithWords,
    getDateSummaries: getDateSummaries,
    getDay: getDay,
    getStats: getStats,
    countNewEntries: countNewEntries,
    addWords: addWords,
    updateWord: updateWord,
    deleteWord: deleteWord,
    markStudyDone: markStudyDone,
    markPracticeDone: markPracticeDone,
    checkIn: checkIn,
    getExportData: getExportData,
    replaceFromBackup: replaceFromBackup,
    clearAll: clearAll,
    getStorageBytes: getStorageBytes
  };

  global.Store = Store;
})(typeof window !== 'undefined' ? window : globalThis);
