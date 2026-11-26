/* 拾词 · 练习题生成与判分 */
(function (global) {
  'use strict';

  var MODES = {
    en2zh: {
      key: 'en2zh',
      label: '英译中',
      short: '看英选中',
      description: '看见英文，选出正确的中文释义',
      symbol: 'EN → 中'
    },
    zh2en: {
      key: 'zh2en',
      label: '中译英',
      short: '看中选英',
      description: '看见中文，选出对应的英文单词',
      symbol: '中 → EN'
    },
    spell: {
      key: 'spell',
      label: '拼写',
      short: '看中拼英',
      description: '根据中文意思，把英文完整拼出来',
      symbol: 'A → 写'
    },
    mixed: {
      key: 'mixed',
      label: '混合练习',
      short: '三种题型',
      description: '选择、反向选择与拼写随机出现',
      symbol: '混 合'
    }
  };

  var TYPE_KEYS = ['en2zh', 'zh2en', 'spell'];

  function normalizeText(value) {
    return String(value == null ? '' : value).trim();
  }

  /** 汇总练习时同一单词可能出现在多天，只保留一条 */
  function prepareWords(words) {
    var seen = Object.create(null);
    var result = [];
    (words || []).forEach(function (word) {
      if (!word) return;
      var en = normalizeText(word.en);
      var zh = normalizeText(word.zh);
      if (!en || !zh) return;
      var key = en.toLowerCase() + '\u0000' + zh;
      if (seen[key]) return;
      seen[key] = true;
      result.push({
        id: word.id,
        en: en,
        zh: zh
      });
    });
    return result;
  }

  function buildChoices(answer, field, sourcePool, currentWord) {
    var answerText = normalizeText(answer);
    var seen = Object.create(null);
    seen[answerText.toLowerCase()] = true;
    var candidates = [];

    (sourcePool || []).forEach(function (word) {
      if (!word) return;
      if (currentWord && word.id && currentWord.id && word.id === currentWord.id) return;
      var value = normalizeText(word[field]);
      if (!value) return;
      var key = value.toLowerCase();
      if (seen[key]) return;
      seen[key] = true;
      candidates.push(value);
    });

    var distractors = Utils.shuffle(candidates).slice(0, 3);
    var choices = Utils.shuffle([answerText].concat(distractors));
    return {
      choices: choices,
      correctIndex: choices.indexOf(answerText)
    };
  }

  function makeTypeDeck(count, mode) {
    if (mode !== 'mixed') {
      return new Array(count).fill(mode);
    }
    var deck = [];
    while (deck.length < count) {
      for (var i = 0; i < TYPE_KEYS.length && deck.length < count; i += 1) {
        deck.push(TYPE_KEYS[i]);
      }
    }
    return Utils.shuffle(deck);
  }

  function hasChoiceAlternative(field, words) {
    var seen = Object.create(null);
    var unique = 0;
    (words || []).forEach(function (word) {
      var value = normalizeText(word && word[field]);
      if (!value) return;
      var key = value.toLowerCase();
      if (seen[key]) return;
      seen[key] = true;
      unique += 1;
    });
    return unique >= 2;
  }

  /**
   * 生成一轮练习题。
   * options: { words, pool, mode, count }
   * count 可以是数字或 'all'
   */
  function buildQuiz(options) {
    var source = prepareWords(options && options.words);
    var pool = prepareWords(options && options.pool && options.pool.length ? options.pool : source);
    var mode = options && MODES[options.mode] ? options.mode : 'en2zh';
    var requestedCount = options && options.count;
    var count = source.length;
    if (requestedCount !== 'all' && requestedCount != null) {
      count = Math.min(source.length, Math.max(1, Number(requestedCount) || source.length));
    }
    var selected = Utils.shuffle(source).slice(0, count);
    var typeDeck = makeTypeDeck(selected.length, mode);

    var questions = selected.map(function (word, index) {
      var type = typeDeck[index];
      if (type !== 'spell') {
        var field = type === 'en2zh' ? 'zh' : 'en';
        if (!hasChoiceAlternative(field, pool)) type = 'spell';
      }

      if (type === 'spell') {
        return {
          id: 'q_' + index + '_' + (word.id || index),
          type: 'spell',
          typeLabel: MODES.spell.label,
          word: word,
          prompt: word.zh,
          answer: word.en,
          choices: [],
          correctIndex: -1
        };
      }

      var isEnToZh = type === 'en2zh';
      var answer = isEnToZh ? word.zh : word.en;
      var choiceData = buildChoices(answer, isEnToZh ? 'zh' : 'en', pool, word);
      return {
        id: 'q_' + index + '_' + (word.id || index),
        type: type,
        typeLabel: MODES[type].label,
        word: word,
        prompt: isEnToZh ? word.en : word.zh,
        answer: answer,
        choices: choiceData.choices,
        correctIndex: choiceData.correctIndex
      };
    });

    return {
      mode: mode,
      questions: questions,
      requestedCount: requestedCount,
      availableCount: source.length
    };
  }

  function isChoiceQuestion(question) {
    return question && question.type !== 'spell';
  }

  function gradeChoice(question, selectedIndex) {
    return Number(selectedIndex) === Number(question.correctIndex);
  }

  function gradeSpelling(question, typed) {
    return Utils.normalizeAnswer(typed) === Utils.normalizeAnswer(question.answer);
  }

  var QuizEngine = {
    MODES: MODES,
    TYPE_KEYS: TYPE_KEYS,
    prepareWords: prepareWords,
    buildQuiz: buildQuiz,
    isChoiceQuestion: isChoiceQuestion,
    gradeChoice: gradeChoice,
    gradeSpelling: gradeSpelling
  };

  global.QuizEngine = QuizEngine;
  if (typeof module !== 'undefined' && module.exports) module.exports = QuizEngine;
})(typeof window !== 'undefined' ? window : globalThis);
