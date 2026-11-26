/* 拾词 · 应用主逻辑 */
(function () {
  'use strict';

  var e = Utils.escapeHTML;
  var SVG_START = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';

  var ICONS = {
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41"/>',
    book: '<path d="M2 4.5A2.5 2.5 0 0 1 4.5 2H11v18H4.5A2.5 2.5 0 0 0 2 22V4.5Z"/><path d="M22 4.5A2.5 2.5 0 0 0 19.5 2H13v18h6.5A2.5 2.5 0 0 1 22 22V4.5Z"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/>',
    flame: '<path d="M12 2c1.6 4.3-2.7 5.3-2.7 9.1a2.7 2.7 0 0 0 5.4 0c0-1-.3-2.1-1.1-3.2 3.1 1.5 5.1 4.7 5.1 8.1a6.7 6.7 0 0 1-13.4 0C5.3 11.4 8.2 7.7 12 2Z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    arrowRight: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
    arrowLeft: '<path d="M19 12H5m5 5-5-5 5-5"/>',
    chevronRight: '<path d="m9 18 6-6-6-6"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    check: '<path d="m20 6-11 11-5-5"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    volume: '<path d="M11 5 6 9H2v6h4l5 4V5Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/>',
    pencil: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5M12 15V3"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 8 5-5 5 5M12 3v12"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h8M8 9h2"/>',
    trash: '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/>',
    leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z"/><path d="M2 21c0-3 1.9-5.4 5.1-6C9.5 14.5 12 13 13 12"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    refresh: '<path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/>',
    clipboard: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M8 12h8M8 16h5"/>',
    alert: '<circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    targetSmall: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/>',
    arrowUpRight: '<path d="M7 17 17 7M8 7h9v9"/>',
    more: '<circle cx="5" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>'
  };

  function icon(name, size, extraClass) {
    var content = ICONS[name] || '';
    var cls = 'icon' + (extraClass ? ' ' + extraClass : '');
    return SVG_START.replace('class="icon"', 'class="' + cls + '"') +
      ' width="' + (size || 18) + '" height="' + (size || 18) + '">' + content + '</svg>';
  }

  var state = {
    page: 'today',
    wordSearch: '',
    collapsedDates: Object.create(null),
    selectedDates: new Set(),
    practiceMode: 'en2zh',
    practiceCount: 'all',
    monthCursor: Utils.todayStr().slice(0, 7),
    screenType: null,
    entry: null,
    edit: null,
    dailySetup: null,
    study: null,
    quiz: null,
    confirm: null,
    installPrompt: null,
    deferredInstallPrompt: null
  };

  var dom = {};
  var xlsxPromise = null;

  /* =========================================================
     启动与页面路由
     ========================================================= */

  function init() {
    dom.app = document.getElementById('app');
    dom.nav = document.getElementById('bottom-nav');
    dom.screenRoot = document.getElementById('screen-root');
    dom.confirmRoot = document.getElementById('confirm-root');
    dom.toastRoot = document.getElementById('toast-root');

    Store.init();
    state.page = pageFromHash();
    if (!location.hash) {
      history.replaceState(null, '', '#today');
    }

    buildNav();
    bindEvents();
    renderPage();
    setupPWA();
    checkStorageAvailability();
  }

  function pageFromHash() {
    var value = String(location.hash || '').replace(/^#\/?/, '');
    return ['today', 'words', 'practice', 'me'].indexOf(value) >= 0 ? value : 'today';
  }

  function onHashChange() {
    var next = pageFromHash();
    if (next === state.page) return;
    state.page = next;
    window.scrollTo(0, 0);
    renderPage();
  }

  function goToPage(page, options) {
    if (['today', 'words', 'practice', 'me'].indexOf(page) < 0) return;
    var opts = options || {};
    state.page = page;
    if (location.hash !== '#' + page) {
      history.replaceState(null, '', '#' + page);
    }
    if (opts.preserveScroll) {
      renderPage({ preserveScroll: true });
    } else {
      window.scrollTo(0, 0);
      renderPage();
    }
  }

  function renderPage(options) {
    var opts = options || {};
    var scrollY = opts.preserveScroll ? window.scrollY : 0;
    var html;
    try {
      if (state.page === 'words') html = renderWordsPage();
      else if (state.page === 'practice') html = renderPracticePage();
      else if (state.page === 'me') html = renderMePage();
      else html = renderTodayPage();
    } catch (error) {
      console.error('页面渲染失败', error);
      html = renderFatalPage(error);
    }
    dom.app.innerHTML = html;
    updateActiveNav();
    if (opts.preserveScroll) {
      window.scrollTo(0, scrollY);
    } else {
      window.scrollTo(0, 0);
    }
  }

  function renderFatalPage(error) {
    return '<div class="page"><div class="empty-state"><div class="empty-illustration"><span class="empty-illustration-card"></span>' +
      '<span class="empty-illustration-card"></span><span class="empty-illustration-card">!</span></div>' +
      '<h2>页面出了一点小问题</h2><p>请刷新页面重试。你的本地数据不会因此丢失。</p>' +
      '<div class="empty-actions"><button type="button" class="btn btn-primary" data-action="reload-app">刷新页面</button></div>' +
      '</div></div>';
  }

  function buildNav() {
    var items = [
      { page: 'today', label: '今日', icon: 'sun' },
      { page: 'words', label: '词库', icon: 'book' },
      { page: 'practice', label: '练习', icon: 'target' },
      { page: 'me', label: '我的', icon: 'user' }
    ];
    dom.nav.innerHTML = items.map(function (item) {
      return '<a class="nav-item" data-page="' + item.page + '" href="#' + item.page + '">' +
        '<span class="nav-icon">' + icon(item.icon, 21) + '</span>' +
        '<span>' + item.label + '</span></a>';
    }).join('');
    updateActiveNav();
  }

  function updateActiveNav() {
    if (!dom.nav) return;
    Array.prototype.forEach.call(dom.nav.querySelectorAll('.nav-item'), function (item) {
      var active = item.getAttribute('data-page') === state.page;
      item.classList.toggle('is-active', active);
      if (active) item.setAttribute('aria-current', 'page');
      else item.removeAttribute('aria-current');
    });
  }

  /* =========================================================
     首页
     ========================================================= */

  function renderTodayPage() {
    var today = Utils.todayStr();
    var todayWords = Store.getWordsForDate(today);
    var day = Store.getDay(today);
    var stats = Store.getStats();
    var hasWords = todayWords.length > 0;
    var studyDone = !!day.studyDoneAt;
    var practiceDone = !!day.practiceDoneAt;
    var checked = !!day.checkedInAt;
    var totalWords = stats.totalWords;

    var heroTitle;
    var heroDesc;
    var heroLabel = checked ? 'CHECKED IN' : 'TODAY';
    var heroAction;
    var heroButton;
    var heroActionIcon = 'arrowRight';

    if (!hasWords) {
      heroTitle = '今天还没有排词。';
      heroDesc = totalWords
        ? '从词库里挑几个词，记在今天这一页。'
        : '录入第一批单词，从今天开始每天拾几个词。';
      heroAction = 'open-entry';
      heroButton = '添加今日单词';
    } else if (checked) {
      heroTitle = '今天也留下了足迹。';
      heroDesc = '已完成 ' + todayWords.length + ' 个词的学习与练习，' + Utils.formatTime(day.checkedInAt) + ' 打卡。';
      heroAction = 'start-study';
      heroButton = '再复习一遍';
      heroActionIcon = 'refresh';
    } else if (studyDone && practiceDone) {
      heroTitle = '任务都完成了，收下印章吧。';
      heroDesc = '背诵和练习已经完成，只差最后一步今日打卡。';
      heroAction = 'check-in';
      heroButton = '完成今日打卡';
      heroActionIcon = 'check';
    } else if (!studyDone) {
      heroTitle = '把今天的词，交给现在。';
      heroDesc = '先翻一遍词卡，再做一轮练习，就能完成今天的打卡。';
      heroAction = 'start-study';
      heroButton = '开始今日背诵';
    } else {
      heroTitle = '还剩一轮练习。';
      heroDesc = '单词已经翻过一遍，用几道题把它们记得更牢。';
      heroAction = 'open-daily-practice';
      heroButton = '去完成练习';
    }

    var weekHtml = renderWeekStrip();
    var tasksHtml = renderTaskList(todayWords, studyDone, practiceDone);
    var wordsHtml = hasWords ? renderTodayWords(todayWords) : '';
    var welcomeHtml = totalWords === 0 ? renderWelcomeGuide() : '';
    var firstDay = stats.currentStreak === 0;

    var heroTasks = hasWords ? (
      '<div class="hero-tasks">' +
        '<span class="hero-task ' + (studyDone ? 'is-done' : '') + '">' +
          '<i class="hero-task-dot">' + (studyDone ? icon('check', 9) : '') + '</i>背诵' +
        '</span>' +
        '<span class="hero-task ' + (practiceDone ? 'is-done' : '') + '">' +
          '<i class="hero-task-dot">' + (practiceDone ? icon('check', 9) : '') + '</i>练习' +
        '</span>' +
        '<span class="hero-task ' + (checked ? 'is-done' : '') + '">' +
          '<i class="hero-task-dot">' + (checked ? icon('check', 9) : '') + '</i>打卡' +
        '</span>' +
      '</div>'
    ) : '';

    var stamp = checked ? (
      '<div class="hero-stamp" aria-label="今日已打卡">已<br>打卡<small>' +
        e(Utils.formatTime(day.checkedInAt)) + '</small></div>'
    ) : '';

    return '' +
      '<div class="page home-page">' +
        '<header class="home-top">' +
          '<div class="brand">' +
            '<span class="brand-seal" aria-hidden="true">拾</span>' +
            '<span class="brand-copy">' +
              '<span class="brand-word">拾词</span>' +
              '<span class="brand-en">A WORD A DAY</span>' +
            '</span>' +
          '</div>' +
          '<button type="button" class="mini-streak" data-action="go-me" aria-label="查看打卡记录">' +
            icon('flame', 14) +
            '<span>' + (firstDay ? '开始打卡' : '连续 ' + stats.currentStreak + ' 天') + '</span>' +
          '</button>' +
        '</header>' +

        '<section class="home-intro">' +
          '<p class="eyebrow">' + e(Utils.monthFullEN(today)) + ' ' + Utils.parseDateStr(today).getDate() +
            ' · ' + e(Utils.weekdayEN(today)) + '</p>' +
          '<h1>' + e(Utils.greeting()) + '，<br>也来<span class="accent-mark">拾</span>几个词。</h1>' +
        '</section>' +

        '<section class="hero-card ' + (checked ? 'is-checked' : '') + '">' +
          '<div class="hero-top">' +
            '<span class="hero-streak">' + icon('flame', 13) +
              '<span>' + (firstDay ? '从今天开始' : '连续 ' + stats.currentStreak + ' 天') + '</span>' +
            '</span>' +
            '<span class="hero-date">' + e(Utils.monthShortEN(today)) + ' ' + Utils.parseDateStr(today).getDate() +
              ' · ' + e(Utils.weekdayEN(today).slice(0, 3)) + '</span>' +
          '</div>' +
          stamp +
          '<div class="hero-content">' +
            '<p class="hero-label">' + heroLabel + '</p>' +
            '<h2 class="hero-title">' + e(heroTitle) + '</h2>' +
            '<p class="hero-desc">' + e(heroDesc) + '</p>' +
          '</div>' +
          '<button type="button" class="hero-cta" data-action="' + heroAction + '">' +
            '<span>' + e(heroButton) + '</span>' + icon(heroActionIcon, 16) +
          '</button>' +
          heroTasks +
        '</section>' +

        weekHtml +
        tasksHtml +
        wordsHtml +
        welcomeHtml +

        '<footer class="home-footer">不积跬步，无以至千里。</footer>' +
      '</div>';
  }

  function renderWeekStrip() {
    var today = Utils.todayStr();
    var cells = [];
    for (var i = 6; i >= 0; i -= 1) {
      var date = Utils.addDays(today, -i);
      var dayRecord = Store.getDay(date);
      var words = Store.getWordsForDate(date);
      var checked = !!dayRecord.checkedInAt;
      var isToday = date === today;
      var dateObj = Utils.parseDateStr(date);
      var classes = ['week-day'];
      if (isToday) classes.push('is-today');
      if (checked) classes.push('is-checked');
      if (words.length) classes.push('has-words');
      cells.push(
        '<div class="' + classes.join(' ') + '" title="' + e(Utils.formatDateCN(date, { weekday: true })) +
          (checked ? ' · 已打卡' : '') + '">' +
          '<span class="week-name">' + (isToday ? '今天' : e(Utils.WEEKDAYS_CN_SHORT[dateObj.getDay()])) + '</span>' +
          '<span class="week-num">' + dateObj.getDate() + '</span>' +
          '<span class="week-dot"></span>' +
        '</div>'
      );
    }
    return '<section class="week-section">' +
      '<div class="section-head">' +
        '<h2 class="section-title">近七日</h2>' +
        '<a class="section-link" href="#me">打卡日历' + icon('chevronRight', 12) + '</a>' +
      '</div>' +
      '<div class="week-strip">' + cells.join('') + '</div>' +
    '</section>';
  }

  function renderTaskList(words, studyDone, practiceDone) {
    var hasWords = words.length > 0;
    var day = Store.getDay(Utils.todayStr());
    var studyAction = hasWords ? 'start-study' : 'open-entry';
    var practiceAction = hasWords ? 'open-daily-practice' : 'open-entry';
    var studyStatus = studyDone ? '已完成' : (hasWords ? words.length + ' 个词' : '待添加');
    var practiceStatus = practiceDone && day.bestPractice
      ? '正确率 ' + day.bestPractice.score + '%'
      : (practiceDone ? '已完成' : (hasWords ? '未开始' : '待添加'));

    return '<section class="task-section">' +
      '<div class="section-head"><h2 class="section-title">今日任务</h2>' +
        '<span class="section-title count">' + (studyDone && practiceDone ? '2 / 2' : (studyDone || practiceDone ? '1 / 2' : '0 / 2')) + '</span>' +
      '</div>' +
      '<div class="task-list">' +
        '<button type="button" class="task-card ' + (studyDone ? 'is-done' : '') + '" data-action="' + studyAction + '">' +
          '<span class="task-icon">' + icon('book', 19) + '</span>' +
          '<span class="task-copy">' +
            '<span class="task-line"><strong class="task-title">背诵</strong>' +
              '<span class="task-status">' + e(studyStatus) + '</span></span>' +
            '<span class="task-desc">' + (studyDone ? '已经背完，可以再翻一遍。' : (hasWords ? '先翻词卡，把今天的词混个眼熟。' : '先去添加今天的单词。')) + '</span>' +
          '</span>' +
          '<span class="task-arrow">' + icon('chevronRight', 15) + '</span>' +
        '</button>' +
        '<button type="button" class="task-card ' + (practiceDone ? 'is-done' : '') + '" data-action="' + practiceAction + '">' +
          '<span class="task-icon">' + icon('target', 19) + '</span>' +
          '<span class="task-copy">' +
            '<span class="task-line"><strong class="task-title">练习</strong>' +
              '<span class="task-status">' + e(practiceStatus) + '</span></span>' +
            '<span class="task-desc">' + (practiceDone ? '练习已完成，再练一轮可以加深印象。' : (hasWords ? '选择题与拼写，检验今天的记忆。' : '添加单词后开始今天的练习。')) + '</span>' +
          '</span>' +
          '<span class="task-arrow">' + icon('chevronRight', 15) + '</span>' +
        '</button>' +
      '</div>' +
    '</section>';
  }

  function renderTodayWords(words) {
    var rows = words.map(function (word, index) {
      return '<div class="word-preview-row">' +
        '<span class="preview-index">' + Utils.pad2(index + 1) + '</span>' +
        '<span class="preview-copy">' +
          '<span class="preview-en">' + e(word.en) + '</span>' +
          '<span class="preview-zh">' + e(word.zh) + '</span>' +
        '</span>' +
        '<button type="button" class="speak-btn" data-action="speak" data-text="' + e(word.en) + '" aria-label="朗读 ' + e(word.en) + '">' +
          icon('volume', 15) +
        '</button>' +
      '</div>';
    }).join('');

    return '<section class="word-section">' +
      '<div class="section-head">' +
        '<h2 class="section-title">今日词单 <span class="count">' + words.length + ' 个</span></h2>' +
        '<a class="section-link" href="#words">查看词库' + icon('chevronRight', 12) + '</a>' +
      '</div>' +
      '<div class="word-list-card"><div class="word-list-scroll">' + rows + '</div></div>' +
    '</section>';
  }

  function renderWelcomeGuide() {
    return '<section class="welcome-guide">' +
      '<p class="eyebrow">GET STARTED</p>' +
      '<h2>三步，开始你的每日词卡</h2>' +
      '<ol class="guide-steps">' +
        '<li class="guide-step"><span class="guide-step-num">01</span><span class="guide-step-copy"><strong>录入单词</strong><span>批量粘贴或 Excel 导入，自动分开中英文。</span></span></li>' +
        '<li class="guide-step"><span class="guide-step-num">02</span><span class="guide-step-copy"><strong>每天背诵</strong><span>翻卡片、做练习，完成一天的打卡。</span></span></li>' +
        '<li class="guide-step"><span class="guide-step-num">03</span><span class="guide-step-copy"><strong>汇总复习</strong><span>挑选几天一起练，把词记得更牢。</span></span></li>' +
      '</ol>' +
      '<button type="button" class="btn btn-primary btn-block" data-action="open-entry">录入第一批单词</button>' +
    '</section>';
  }

  /* =========================================================
     词库页
     ========================================================= */

  function renderWordsPage() {
    var allWords = Store.getWords();
    var summaries = Store.getDateSummaries();
    var query = state.wordSearch.trim();
    var content = renderLibraryGroups();
    var quickBusy = allWords.length;

    var empty = allWords.length === 0 ? (
      '<div class="empty-state">' +
        '<div class="empty-illustration" aria-hidden="true">' +
          '<span class="empty-illustration-card"></span>' +
          '<span class="empty-illustration-card"></span>' +
          '<span class="empty-illustration-card">Aa</span>' +
        '</div>' +
        '<h2>词库还是空的</h2>' +
        '<p>粘贴一串单词，或者从 Excel 导入。每行一个词，中英文会自动分开。</p>' +
        '<div class="empty-actions">' +
          '<button type="button" class="btn btn-primary" data-action="open-entry" data-tab="paste">批量粘贴</button>' +
          '<button type="button" class="btn btn-outline" data-action="open-entry" data-tab="excel">Excel 导入</button>' +
        '</div>' +
      '</div>'
    ) : '';

    return '' +
      '<div class="page words-page">' +
        '<header class="page-head">' +
          '<div>' +
            '<p class="eyebrow">WORD LIBRARY · ' + allWords.length + ' WORDS</p>' +
            '<h1 class="page-title">我的词库</h1>' +
          '</div>' +
          '<button type="button" class="round-button" data-action="open-entry" aria-label="录入单词">' + icon('plus', 20) + '</button>' +
        '</header>' +
        '<p class="page-sub">按学习日期收好每个词。点击任意词条，可以修改或删除。</p>' +
        '<div class="quick-entry-grid">' +
          '<button type="button" class="quick-entry is-featured" data-action="open-entry" data-tab="paste">' +
            '<span class="quick-entry-icon">' + icon('clipboard', 16) + '</span>' +
            '<span class="quick-entry-copy"><strong>批量粘贴</strong><small>每行一个，自动识别</small></span>' +
          '</button>' +
          '<button type="button" class="quick-entry" data-action="open-entry" data-tab="excel">' +
            '<span class="quick-entry-icon">' + icon('file', 16) + '</span>' +
            '<span class="quick-entry-copy"><strong>Excel 导入</strong><small>支持 .xlsx / .csv</small></span>' +
          '</button>' +
        '</div>' +
        (quickBusy ? (
          '<div class="search-box">' + icon('search', 17) +
            '<input id="word-search" class="search-input" type="search" placeholder="搜索英文或中文" autocomplete="off" value="' + e(state.wordSearch) + '" aria-label="搜索单词">' +
          '</div>'
        ) : '') +
        '<div class="library-content" id="library-content">' + (allWords.length ? content : empty) + '</div>' +
      '</div>';
  }

  function renderLibraryGroups() {
    var query = state.wordSearch.trim().toLowerCase();
    var summaries = Store.getDateSummaries();
    var groups = [];

    summaries.forEach(function (summary) {
      var words = summary.words.slice();
      if (query) {
        words = words.filter(function (word) {
          return word.en.toLowerCase().indexOf(query) >= 0 || word.zh.toLowerCase().indexOf(query) >= 0;
        });
      }
      if (!words.length) return;
      groups.push({ summary: summary, words: words });
    });

    if (!groups.length) {
      if (query) {
        return '<div class="empty-search">没有找到包含「' + e(state.wordSearch.trim()) + '」的单词。</div>';
      }
      return '';
    }

    return groups.map(function (group) {
      var date = group.summary.date;
      var checked = group.summary.checkedIn;
      var collapsed = !query && !!state.collapsedDates[date];
      var rows = group.words.map(function (word) {
        return '<button type="button" class="word-row" data-action="open-edit" data-id="' + e(word.id) + '">' +
          '<span class="word-row-copy">' +
            '<span class="word-en">' + e(word.en) + '</span>' +
            '<span class="word-zh">' + e(word.zh) + '</span>' +
          '</span>' +
          '<span class="word-edit-mark" aria-hidden="true">' + icon('pencil', 13) + '</span>' +
        '</button>';
      }).join('');

      return '<div class="library-group ' + (collapsed ? 'is-collapsed' : '') + '">' +
        '<button type="button" class="group-head" data-action="toggle-group" data-date="' + e(date) + '" aria-expanded="' + (!collapsed) + '">' +
          '<span class="group-head-main">' +
            '<span class="group-title">' + e(Utils.relativeDateLabel(date)) +
              (checked ? '<span class="group-badge">' + icon('check', 9) + '已打卡</span>' : '') +
            '</span>' +
            '<span class="group-sub">' + e(Utils.formatDateCN(date, { year: true, weekday: true })) + '</span>' +
          '</span>' +
          '<span class="group-meta">' +
            '<span>' + group.words.length + ' 个词</span>' +
            '<span class="group-chevron">' + icon('chevronDown', 14) + '</span>' +
          '</span>' +
        '</button>' +
        '<div class="word-rows">' + rows + '</div>' +
      '</div>';
    }).join('');
  }

  /* =========================================================
     练习页
     ========================================================= */

  function selectedPracticeWords() {
    var words = [];
    state.selectedDates.forEach(function (date) {
      Store.getWordsForDate(date).forEach(function (word) { words.push(word); });
    });
    return QuizEngine.prepareWords(words);
  }

  function selectedDateCount() {
    return state.selectedDates.size;
  }

  function practiceQuestionCount() {
    var words = selectedPracticeWords();
    if (state.practiceCount === 'all') return words.length;
    return Math.min(words.length, Number(state.practiceCount) || words.length);
  }

  function renderPracticePage() {
    var summaries = Store.getDateSummaries();
    var availableDates = summaries.map(function (item) { return item.date; });
    Array.from(state.selectedDates).forEach(function (date) {
      if (availableDates.indexOf(date) < 0) state.selectedDates.delete(date);
    });

    var today = Utils.todayStr();
    var todayWords = Store.getWordsForDate(today);
    var todayDay = Store.getDay(today);
    var todayPracticeDone = !!todayDay.practiceDoneAt;
    var dailyTitle;
    var dailyDesc;
    var dailyAction;
    var dailyLabel;

    if (!todayWords.length) {
      dailyTitle = '今天还没有单词';
      dailyDesc = '先添加今天要学的词，再来这里做一轮练习。';
      dailyAction = 'open-entry';
      dailyLabel = '添加单词';
    } else if (todayPracticeDone) {
      dailyTitle = '今日练习已完成';
      dailyDesc = '最佳正确率 ' + (todayDay.bestPractice ? todayDay.bestPractice.score : 0) + '%，可以再练一轮巩固。';
      dailyAction = 'open-daily-practice';
      dailyLabel = '再练一次';
    } else {
      dailyTitle = '今天有 ' + todayWords.length + ' 个词';
      dailyDesc = '练习完成后，配合背诵就能点亮今天的打卡。';
      dailyAction = 'open-daily-practice';
      dailyLabel = '开始练习';
    }

    var datesHtml = renderDateChoices(summaries);
    var modesHtml = Object.keys(QuizEngine.MODES).map(function (key) {
      var mode = QuizEngine.MODES[key];
      return '<button type="button" class="mode-option ' + (state.practiceMode === key ? 'is-active' : '') + '" data-action="set-practice-mode" data-mode="' + key + '" aria-pressed="' + (state.practiceMode === key) + '">' +
        '<span class="mode-symbol">' + e(mode.symbol) + '</span>' +
        '<span class="mode-label">' + e(mode.label) + '</span>' +
        '<span class="mode-desc">' + e(mode.description) + '</span>' +
        '<span class="mode-check">' + (state.practiceMode === key ? icon('check', 10) : '') + '</span>' +
      '</button>';
    }).join('');

    var words = selectedPracticeWords();
    var questionCount = practiceQuestionCount();
    var cta = summaries.length ? (
      '<div class="practice-cta">' +
        '<div class="practice-cta-copy">' +
          '<span class="practice-cta-title">已选 <b id="selected-days-count">' + selectedDateCount() + '</b> 天</span>' +
          '<span class="practice-cta-sub" id="selected-words-summary">' +
            (words.length ? '共 ' + words.length + ' 个词 · ' + questionCount + ' 题' : '选出至少一天，开始汇总练习') +
          '</span>' +
        '</div>' +
        '<button type="button" class="btn" id="start-summary-btn" data-action="start-summary" ' + (words.length ? '' : 'disabled') + '>' +
          '开始练习' + icon('arrowRight', 14) +
        '</button>' +
      '</div>'
    ) : '';

    return '' +
      '<div class="page practice-page">' +
        '<header class="page-head">' +
          '<div><p class="eyebrow">PRACTICE ROOM</p><h1 class="page-title">练习室</h1></div>' +
          '<span class="page-head-mark">' + icon('target', 21) + '</span>' +
        '</header>' +
        '<p class="page-sub">今天练当天的词；也可以挑几天放在一起，随机考考自己。</p>' +

        '<section class="daily-card">' +
          '<div class="daily-main">' +
            '<span class="daily-label">TODAY · 今日练习</span>' +
            '<h2 class="daily-title">' + e(dailyTitle) + '</h2>' +
            '<p class="daily-desc">' + e(dailyDesc) + '</p>' +
          '</div>' +
          '<button type="button" class="daily-btn ' + (todayPracticeDone ? 'is-soft' : '') + '" data-action="' + dailyAction + '">' +
            e(dailyLabel) + icon('arrowRight', 12) +
          '</button>' +
        '</section>' +

        '<section class="practice-panel">' +
          '<div class="panel-head">' +
            '<div><span class="panel-step">STEP 01 · 选择日期</span><h2 class="panel-title">把哪几天的词放在一起？</h2></div>' +
            '<span class="panel-note" id="selection-days-note">已选 ' + selectedDateCount() + ' 天</span>' +
          '</div>' +
          (summaries.length ? (
            '<div class="chip-row" style="margin-bottom: 2px;">' +
              '<button type="button" class="chip" data-action="select-recent" data-days="3">近 3 天</button>' +
              '<button type="button" class="chip" data-action="select-recent" data-days="7">近 7 天</button>' +
              '<button type="button" class="chip" data-action="select-all-dates">全部</button>' +
              '<button type="button" class="chip is-quiet" data-action="clear-selected-dates">清空</button>' +
            '</div>' +
            '<div class="date-choice-list" id="summary-date-list">' + datesHtml + '</div>'
          ) : (
            '<div class="date-empty">词库里还没有单词。<br>添加单词后，就可以按日期选择汇总练习。</div>'
          )) +
        '</section>' +

        '<section class="practice-panel">' +
          '<div class="panel-head">' +
            '<div><span class="panel-step">STEP 02 · 练习方式</span><h2 class="panel-title">想怎么考自己？</h2></div>' +
          '</div>' +
          '<div class="mode-grid">' + modesHtml + '</div>' +
          '<div class="question-count">' +
            '<span class="question-count-label">题目数量</span>' +
            '<div class="chip-row">' +
              '<button type="button" class="chip ' + (state.practiceCount === 10 ? 'is-active' : '') + '" data-action="set-practice-count" data-count="10">10 题</button>' +
              '<button type="button" class="chip ' + (state.practiceCount === 20 ? 'is-active' : '') + '" data-action="set-practice-count" data-count="20">20 题</button>' +
              '<button type="button" class="chip ' + (state.practiceCount === 'all' ? 'is-active' : '') + '" data-action="set-practice-count" data-count="all">全部</button>' +
            '</div>' +
          '</div>' +
        '</section>' +

        cta +
      '</div>';
  }

  function renderDateChoices(summaries) {
    if (!summaries.length) {
      return '';
    }
    return summaries.map(function (summary) {
      var selected = state.selectedDates.has(summary.date);
      var date = summary.date;
      var checked = summary.checkedIn;
      return '<button type="button" class="date-choice ' + (selected ? 'is-selected' : '') + '" data-action="toggle-summary-date" data-date="' + e(date) + '" aria-pressed="' + selected + '">' +
        '<span class="choice-box">' + (selected ? icon('check', 11) : '') + '</span>' +
        '<span class="date-choice-text">' +
          '<span class="date-choice-primary">' + e(Utils.relativeDateLabel(date)) + '<em>' + e(Utils.weekdayCN(date, true)) + '</em></span>' +
          '<span class="date-choice-secondary">' + e(Utils.formatDateCN(date, { year: true })) + ' · ' + summary.count + ' 个词</span>' +
        '</span>' +
        '<span class="date-choice-side">' +
          (checked ? '<span class="checked-badge">' + icon('check', 8) + '已打卡</span>' : '') +
          '<span class="choice-count">' + summary.count + ' 词</span>' +
        '</span>' +
      '</button>';
    }).join('');
  }

  /* =========================================================
     我的页
     ========================================================= */

  function renderMePage() {
    var stats = Store.getStats();
    var summaries = Store.getDateSummaries();
    var summaryMap = Object.create(null);
    summaries.forEach(function (summary) { summaryMap[summary.date] = summary; });
    var today = Utils.todayStr();
    var currentMonth = today.slice(0, 7);
    if (state.monthCursor > currentMonth) state.monthCursor = currentMonth;
    var monthParts = state.monthCursor.split('-');
    var year = Number(monthParts[0]);
    var month = Number(monthParts[1]);
    var firstWeekday = (new Date(year, month - 1, 1).getDay() + 6) % 7;
    var daysInMonth = new Date(year, month, 0).getDate();
    var cells = [];
    for (var blank = 0; blank < firstWeekday; blank += 1) {
      cells.push('<div class="cal-cell is-empty" aria-hidden="true"></div>');
    }
    for (var dayNum = 1; dayNum <= daysInMonth; dayNum += 1) {
      var dateStr = year + '-' + Utils.pad2(month) + '-' + Utils.pad2(dayNum);
      var summary = summaryMap[dateStr];
      var record = Store.getDay(dateStr);
      var checked = !!record.checkedInAt;
      var hasWords = !!(summary && summary.count);
      var classes = ['cal-cell'];
      if (dateStr === today) classes.push('is-today');
      if (checked) classes.push('is-checked');
      if (hasWords) classes.push('has-words');
      if (dateStr > today) classes.push('is-future');
      var title = Utils.formatDateCN(dateStr, { weekday: true }) +
        (checked ? ' · 已打卡' : '') + (hasWords ? ' · ' + summary.count + ' 个词' : '');
      cells.push('<div class="' + classes.join(' ') + '" title="' + e(title) + '" aria-label="' + e(title) + '"><span>' + dayNum + '</span></div>');
    }
    var weekdayHeaders = ['一', '二', '三', '四', '五', '六', '日'].map(function (label) {
      return '<span class="cal-weekday">' + label + '</span>';
    }).join('');

    var nextDisabled = state.monthCursor >= currentMonth;
    var installed = isStandalone();
    var fileMode = location.protocol === 'file:';
    var storageText = Utils.storageSizeText(Store.getStorageBytes());
    var installTitle = installed
      ? '已在桌面应用中运行'
      : (fileMode ? '单文件版 · 可离线打开' : '把拾词放到手机桌面');
    var installDesc = installed
      ? '数据仍然只保存在这台设备'
      : (fileMode ? '要安装到桌面，请改用 HTTPS 部署后的地址' : '像 App 一样打开，少一步找网页');

    return '' +
      '<div class="page me-page">' +
        '<header class="page-head">' +
          '<div><p class="eyebrow">MY RHYTHM</p><h1 class="page-title">我的</h1></div>' +
          '<span class="page-head-mark">' + icon('leaf', 21) + '</span>' +
        '</header>' +
        '<p class="page-sub">每个打过卡的日期，都会在这里留下一个小小的印章。</p>' +

        '<section class="me-hero">' +
          '<span class="eyebrow light">CURRENT STREAK</span>' +
          '<div class="me-hero-main">' +
            '<span class="streak-number">' + stats.currentStreak + '</span>' +
            '<span class="streak-unit">天连续打卡</span>' +
          '</div>' +
          '<p class="me-hero-desc">' + (stats.currentStreak
            ? '最长连续 ' + stats.longestStreak + ' 天，继续保持这份节奏。'
            : '今天开始也不晚，先完成一次背诵与练习。') + '</p>' +
          '<div class="me-hero-meta">' +
            '<span>累计打卡 <b>' + stats.checkInDays + '</b> 天</span><span>·</span>' +
            '<span>词库 <b>' + stats.totalWords + '</b> 个词</span>' +
          '</div>' +
          '<span class="me-hero-mark">' + icon('flame', 18) + '</span>' +
        '</section>' +

        '<div class="stats-grid">' +
          '<div class="stat-card"><span class="stat-value">' + stats.totalWords + '</span><span class="stat-label">词库单词</span></div>' +
          '<div class="stat-card"><span class="stat-value">' + stats.checkInDays + '</span><span class="stat-label">打卡天数</span></div>' +
          '<div class="stat-card"><span class="stat-value">' + stats.practiceAttempts + '</span><span class="stat-label">练习次数</span></div>' +
        '</div>' +

        '<section class="calendar-card">' +
          '<div class="calendar-head">' +
            '<div><p class="eyebrow">CHECK-IN CALENDAR</p><h2>打卡日历</h2></div>' +
            '<div class="calendar-nav">' +
              '<button type="button" class="calendar-arrow" data-action="change-month" data-delta="-1" aria-label="上个月">' + icon('arrowLeft', 14) + '</button>' +
              '<button type="button" class="calendar-arrow" data-action="change-month" data-delta="1" aria-label="下个月" ' + (nextDisabled ? 'disabled' : '') + '>' + icon('arrowRight', 14) + '</button>' +
            '</div>' +
          '</div>' +
          '<div class="calendar-toolbar"><span class="calendar-month">' + e(Utils.formatMonthCN(state.monthCursor)) + '</span>' +
            '<span class="local-badge">' + icon('leaf', 9) + '慢慢积累</span>' +
          '</div>' +
          '<div class="calendar-grid" role="grid" aria-label="' + e(Utils.formatMonthCN(state.monthCursor)) + '打卡日历">' +
            weekdayHeaders + cells.join('') +
          '</div>' +
          '<div class="calendar-legend">' +
            '<span class="legend-item"><i class="legend-dot checked"></i>已打卡</span>' +
            '<span class="legend-item"><i class="legend-dot"></i>有学习单词</span>' +
            '<span class="legend-item"><i class="legend-dot today"></i>今天</span>' +
          '</div>' +
        '</section>' +

        '<section class="settings-card">' +
          '<div class="settings-head">' +
            '<div><p class="eyebrow">DATA & BACKUP</p><h2>数据与备份</h2></div>' +
            '<span class="local-badge">' + icon('lock', 9) + '仅存本机</span>' +
          '</div>' +
          '<button type="button" class="settings-row" data-action="export-backup">' +
            '<span class="settings-icon">' + icon('download', 15) + '</span>' +
            '<span class="settings-copy"><span class="settings-title">导出完整备份</span><span class="settings-desc">JSON 格式，换设备前先保存一份 · 约 ' + storageText + '</span></span>' +
            '<span class="settings-tail">' + icon('chevronRight', 14) + '</span>' +
          '</button>' +
          '<button type="button" class="settings-row" data-action="export-excel">' +
            '<span class="settings-icon">' + icon('file', 15) + '</span>' +
            '<span class="settings-copy"><span class="settings-title">导出单词与打卡表</span><span class="settings-desc">Excel 格式，方便在电脑上查看</span></span>' +
            '<span class="settings-tail">' + icon('chevronRight', 14) + '</span>' +
          '</button>' +
          '<button type="button" class="settings-row" data-action="restore-backup">' +
            '<span class="settings-icon">' + icon('upload', 15) + '</span>' +
            '<span class="settings-copy"><span class="settings-title">恢复备份</span><span class="settings-desc">从之前导出的 JSON 文件中恢复</span></span>' +
            '<span class="settings-tail">' + icon('chevronRight', 14) + '</span>' +
          '</button>' +
          '<button type="button" class="settings-row" data-action="open-help">' +
            '<span class="settings-icon">' + icon('info', 15) + '</span>' +
            '<span class="settings-copy"><span class="settings-title">使用说明</span><span class="settings-desc">录入、打卡与汇总练习的小提示</span></span>' +
            '<span class="settings-tail">' + icon('chevronRight', 14) + '</span>' +
          '</button>' +
          '<button type="button" class="settings-row is-danger" data-action="clear-data">' +
            '<span class="settings-icon">' + icon('trash', 15) + '</span>' +
            '<span class="settings-copy"><span class="settings-title">清空全部数据</span><span class="settings-desc">删除所有单词、练习与打卡记录</span></span>' +
            '<span class="settings-tail">' + icon('chevronRight', 14) + '</span>' +
          '</button>' +
        '</section>' +

        '<button type="button" class="install-card" data-action="install-app">' +
          '<span class="install-icon">' + icon(installed ? 'check' : (fileMode ? 'file' : 'download'), 17) + '</span>' +
          '<span class="install-copy"><strong>' + e(installTitle) + '</strong>' +
            '<span>' + e(installDesc) + '</span></span>' +
          '<span class="settings-tail">' + icon('chevronRight', 14) + '</span>' +
        '</button>' +

        '<footer class="about-block">' +
          '<span class="about-seal">拾</span>' +
          '<span class="about-title">每天一点，记住更多。</span>' +
          '<span class="about-meta">拾词 · 本地版 v1.0.0 · 数据保存在此设备</span>' +
        '</footer>' +
      '</div>';
  }

  /* =========================================================
     通用提示与确认
     ========================================================= */

  function toast(message, type) {
    if (!dom.toastRoot || !message) return;
    var node = document.createElement('div');
    node.className = 'toast' + (type ? ' is-' + type : '');
    node.textContent = message;
    while (dom.toastRoot.children.length >= 3) {
      dom.toastRoot.removeChild(dom.toastRoot.firstChild);
    }
    dom.toastRoot.appendChild(node);
    window.setTimeout(function () {
      node.classList.add('is-leaving');
      window.setTimeout(function () {
        if (node.parentNode) node.parentNode.removeChild(node);
      }, 220);
    }, type === 'error' ? 3600 : 2500);
  }

  function openConfirm(options) {
    state.confirm = options || {};
    document.body.classList.add('confirm-open');
    dom.confirmRoot.innerHTML = '' +
      '<div class="confirm-layer" role="presentation">' +
        '<div class="confirm-backdrop" data-action="confirm-cancel"></div>' +
        '<div class="confirm-card" role="dialog" aria-modal="true" aria-labelledby="confirm-title">' +
          '<div class="confirm-mark ' + (state.confirm.danger ? 'is-danger' : '') + '">' +
            icon(state.confirm.danger ? 'alert' : 'info', 17) +
          '</div>' +
          '<h2 class="confirm-title" id="confirm-title">' + e(state.confirm.title || '确认操作') + '</h2>' +
          '<p class="confirm-message">' + e(state.confirm.message || '') + '</p>' +
          '<div class="confirm-actions">' +
            '<button type="button" class="btn btn-outline" data-action="confirm-cancel">' + e(state.confirm.cancelLabel || '取消') + '</button>' +
            '<button type="button" class="btn ' + (state.confirm.danger ? 'btn-danger' : 'btn-primary') + '" data-action="confirm-accept">' + e(state.confirm.confirmLabel || '确认') + '</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    var confirmButton = dom.confirmRoot.querySelector('[data-action="confirm-accept"]');
    if (confirmButton) confirmButton.focus({ preventScroll: true });
  }

  function closeConfirm() {
    state.confirm = null;
    if (dom.confirmRoot) dom.confirmRoot.innerHTML = '';
    document.body.classList.remove('confirm-open');
  }

  function acceptConfirm() {
    var callback = state.confirm && state.confirm.onConfirm;
    closeConfirm();
    if (typeof callback === 'function') {
      try {
        callback();
      } catch (error) {
        console.error(error);
        toast('操作没有完成，请重试', 'error');
      }
    }
  }

  function showScreen(html, type) {
    var entering = !document.body.classList.contains('screen-open');
    dom.screenRoot.innerHTML = html;
    state.screenType = type;
    document.body.classList.add('screen-open');
    window.requestAnimationFrame(function () {
      var screen = dom.screenRoot.querySelector('.screen');
      if (screen) {
        if (entering) screen.classList.add('is-new');
        screen.setAttribute('tabindex', '-1');
        screen.focus({ preventScroll: true });
      }
    });
  }

  function hideScreen() {
    dom.screenRoot.innerHTML = '';
    state.screenType = null;
    state.entry = null;
    state.edit = null;
    state.dailySetup = null;
    state.study = null;
    state.quiz = null;
    document.body.classList.remove('screen-open');
  }

  function closeScreen(options) {
    var opts = options || {};
    hideScreen();
    if (!opts.skipRender) {
      renderPage({ preserveScroll: true });
    }
  }

  function requestCloseScreen() {
    if (state.screenType === 'quiz' && state.quiz) {
      if (state.quiz.finished) {
        closeScreen();
        return;
      }
      if (state.quiz.answeredCount > 0) {
        openConfirm({
          title: '退出这次练习？',
          message: '已经答过的题不会保存，也不会记为今天的练习完成。',
          confirmLabel: '退出练习',
          danger: true,
          onConfirm: function () { closeScreen(); }
        });
        return;
      }
      closeScreen();
      return;
    }

    if (state.screenType === 'study' && state.study) {
      if (state.study.done) {
        closeScreen();
        return;
      }
      if (state.study.answeredCount > 0) {
        openConfirm({
          title: '退出本次背诵？',
          message: '已经翻过的词不会计入今日任务，下次需要从第一张重新开始。',
          confirmLabel: '退出背诵',
          danger: true,
          onConfirm: function () { closeScreen(); }
        });
        return;
      }
      closeScreen();
      return;
    }

    closeScreen();
  }

  function launchConfetti() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var layer = document.createElement('div');
    layer.className = 'confetti-layer';
    var colors = ['#ce7457', '#bd9551', '#416a55', '#e2b98b', '#d9d0b9'];
    for (var i = 0; i < 26; i += 1) {
      var piece = document.createElement('span');
      piece.className = 'confetti-piece';
      piece.style.left = (5 + Math.random() * 90) + '%';
      piece.style.background = colors[i % colors.length];
      piece.style.animationDelay = (Math.random() * 0.45) + 's';
      piece.style.setProperty('--drift', (Math.random() * 100 - 50) + 'px');
      piece.style.setProperty('--turn', (Math.random() * 720 - 180) + 'deg');
      piece.style.width = (4 + Math.random() * 4) + 'px';
      piece.style.height = (7 + Math.random() * 6) + 'px';
      layer.appendChild(piece);
    }
    document.body.appendChild(layer);
    window.setTimeout(function () {
      if (layer.parentNode) layer.parentNode.removeChild(layer);
    }, 3000);
  }

  function isStandalone() {
    return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
      window.navigator.standalone === true;
  }

  function checkStorageAvailability() {
    if (!Store.isPersistent()) {
      window.setTimeout(function () {
        toast('浏览器未允许本地存储，数据可能无法保存，请更换浏览器或关闭无痕模式', 'error');
      }, 900);
    }
  }

  /* =========================================================
     录入：批量粘贴 / Excel / 手动添加
     ========================================================= */

  function openEntry(tab, date) {
    var allowedTabs = ['paste', 'excel', 'manual'];
    state.entry = {
      tab: allowedTabs.indexOf(tab) >= 0 ? tab : 'paste',
      date: Utils.isValidDateStr(date) ? date : Utils.todayStr(),
      text: '',
      excel: null,
      excelError: '',
      excelLoading: false,
      message: '',
      messageType: ''
    };
    showScreen(renderEntryScreenHTML(), 'entry');
  }

  function renderEntryScreenHTML() {
    if (!state.entry) return '';
    var entry = state.entry;
    var tabs = [
      { key: 'paste', label: '批量粘贴' },
      { key: 'excel', label: 'Excel 导入' },
      { key: 'manual', label: '手动添加' }
    ];
    var tabsHtml = tabs.map(function (tab) {
      return '<button type="button" class="segment ' + (entry.tab === tab.key ? 'is-active' : '') +
        '" role="tab" aria-selected="' + (entry.tab === tab.key) + '" data-action="entry-tab" data-tab="' + tab.key + '">' +
        tab.label + '</button>';
    }).join('');

    var pane;
    if (entry.tab === 'excel') pane = renderExcelPane();
    else if (entry.tab === 'manual') pane = renderManualPane();
    else pane = renderPastePane();

    return '<div class="screen entry-screen" role="dialog" aria-modal="true" aria-label="录入单词">' +
      '<header class="screen-head">' +
        '<button type="button" class="screen-close" data-action="request-close-screen" aria-label="关闭录入">' + icon('x', 17) + '</button>' +
        '<div class="screen-title"><strong>录入单词</strong><small>ADD TO LIBRARY</small></div>' +
        '<span class="screen-head-side"></span>' +
      '</header>' +
      '<div class="screen-scroll">' +
        '<div class="segmented" role="tablist" aria-label="录入方式">' + tabsHtml + '</div>' +
        pane +
      '</div>' +
      '<footer class="screen-footer" id="entry-footer">' + entryFooterHTML() + '</footer>' +
    '</div>';
  }

  function entryFooterHTML() {
    if (!state.entry) return '';
    var entry = state.entry;
    if (entry.tab === 'manual') {
      return '<button type="submit" form="manual-form" class="btn btn-primary btn-block">添加到词库</button>';
    }
    if (entry.tab === 'excel') {
      if (entry.excelLoading) {
        return '<button type="button" class="btn btn-primary btn-block" disabled>正在读取文件…</button>';
      }
      if (!entry.excel) return '';
      var preview = parseExcelPreview();
      var canAdd = preview.counts.newCount > 0;
      var label = canAdd ? '导入 ' + preview.counts.newCount + ' 个单词' :
        (preview.parsed.entries.length ? '这些单词都已存在' : '没有可导入的单词');
      return '<button type="button" class="btn btn-primary btn-block" data-action="submit-excel" ' + (canAdd ? '' : 'disabled') + '>' +
        e(label) + '</button>';
    }
    var pasteData = parsePastePreview();
    var canAddPaste = pasteData.counts.newCount > 0;
    var pasteLabel;
    if (canAddPaste) pasteLabel = '添加 ' + pasteData.counts.newCount + ' 个单词';
    else if (pasteData.parsed.entries.length) pasteLabel = '这些单词都已存在';
    else pasteLabel = '添加单词';
    return '<button type="button" class="btn btn-primary btn-block" id="paste-submit-button" data-action="submit-paste" ' +
      (canAddPaste ? '' : 'disabled') + '>' + e(pasteLabel) + '</button>';
  }

  function renderPastePane() {
    var entry = state.entry;
    return '<section class="entry-section">' +
      '<div class="field">' +
        '<div class="field-label-row"><label class="field-label" for="paste-date-input">这一批词归入</label>' +
          '<span class="field-hint">按学习日期分组</span></div>' +
        '<input type="date" class="date-input" id="paste-date-input" data-role="paste-date" value="' + e(entry.date) + '">' +
      '</div>' +
      '<div class="field">' +
        '<div class="field-label-row"><label class="field-label" for="paste-input">单词列表</label>' +
          '<span class="field-hint">每行一个单词</span></div>' +
        '<textarea class="textarea paste-textarea" id="paste-input" data-role="paste-input" spellcheck="false" placeholder="apple 苹果&#10;look after 照顾&#10;take off - 起飞">' + e(entry.text) + '</textarea>' +
      '</div>' +
      '<div class="format-hint">' +
        '<span class="format-chip"><code>apple 苹果</code></span>' +
        '<span class="format-chip"><code>banana,香蕉</code></span>' +
        '<span class="format-chip"><code>take off — 起飞</code></span>' +
        '<span class="format-chip">也支持分号隔开多个词条</span>' +
      '</div>' +
      '<div id="paste-preview">' + renderPastePreviewHTML(parsePastePreview()) + '</div>' +
      '<p class="entry-note">英文在前、中文在后的写法识别最稳；词性标记如 “n.” 会保留在中文释义前。每行也可以包含一个日期列，用制表符分隔。</p>' +
    '</section>';
  }

  function parsePastePreview() {
    var entry = state.entry;
    var fallbackDate = entry && Utils.isValidDateStr(entry.date) ? entry.date : Utils.todayStr();
    var parsed = WordParser.parseBatch(entry ? entry.text : '', fallbackDate);
    var counts = Store.countNewEntries(parsed.entries);
    return { parsed: parsed, counts: counts };
  }

  function renderPastePreviewHTML(data) {
    var parsed = data.parsed;
    var counts = data.counts;
    if (!state.entry || !state.entry.text.trim()) {
      return '<div class="preview-card">' +
        '<div class="preview-head"><span class="preview-title">识别结果</span><span class="preview-count">等待输入</span></div>' +
        '<p class="empty-mini">把单词贴进上方输入框，这里会实时显示识别结果。</p>' +
      '</div>';
    }

    var repeated = counts.duplicateCount + parsed.duplicateCount;
    var stats = '<span class="parse-stat good">新增 ' + counts.newCount + '</span>';
    if (repeated > 0) stats += '<span class="parse-stat warn">重复 ' + repeated + '</span>';
    if (parsed.errors.length > 0) stats += '<span class="parse-stat bad">未识别 ' + parsed.errors.length + '</span>';
    if (counts.invalidCount > 0) stats += '<span class="parse-stat bad">无效 ' + counts.invalidCount + '</span>';

    var rows = parsed.entries.map(function (item) {
      return '<div class="mini-entry-row">' +
        '<span class="mini-en">' + e(item.en) + '</span>' +
        '<span class="mini-zh">' + e(item.zh) + '</span>' +
        '<span class="mini-date">' + Utils.pad2(Utils.parseDateStr(item.date).getMonth() + 1) + '.' +
          Utils.pad2(Utils.parseDateStr(item.date).getDate()) + '</span>' +
      '</div>';
    }).join('');

    var errorHtml = '';
    if (parsed.errors.length) {
      errorHtml = '<div class="error-box">' + parsed.errors.slice(0, 5).map(function (error) {
        return '<div class="error-line">第 ' + error.line + ' 行：' + e(error.message) + '</div>';
      }).join('') + (parsed.errors.length > 5 ? '<div class="error-line">还有 ' + (parsed.errors.length - 5) + ' 行未显示…</div>' : '') + '</div>';
    }

    return '<div class="preview-card">' +
      '<div class="preview-head"><span class="preview-title">识别结果</span><span class="preview-count">' + parsed.entries.length + ' 条</span></div>' +
      '<div class="parse-stats">' + stats + '</div>' +
      (rows ? '<div class="mini-entry-list">' + rows + '</div>' : '<p class="empty-mini">暂时没有可以添加的词条。检查一下每行是否同时包含英文和中文。</p>') +
      errorHtml +
    '</div>';
  }

  function refreshPasteUI() {
    if (!state.entry) return;
    var preview = document.getElementById('paste-preview');
    if (preview) preview.innerHTML = renderPastePreviewHTML(parsePastePreview());
    var footer = document.getElementById('entry-footer');
    if (footer) footer.innerHTML = entryFooterHTML();
  }

  function renderExcelPane() {
    var entry = state.entry;
    var html = '<section class="entry-section">' +
      '<div class="field">' +
        '<div class="field-label-row"><label class="field-label" for="excel-date-input">没有日期列时，归入</label>' +
          '<span class="field-hint">日期列会优先使用</span></div>' +
        '<input type="date" class="date-input" id="excel-date-input" data-role="excel-date" value="' + e(entry.date) + '">' +
      '</div>';

    if (!entry.excel) {
      html += '<div class="upload-zone" style="margin-top: 14px;">' +
        '<span class="upload-icon">' + icon('file', 21) + '</span>' +
        '<strong class="upload-title">从 Excel 批量导入</strong>' +
        '<span class="upload-desc">支持 .xlsx、.xls、.csv。首行可以是“英文 / 中文 / 日期”表头，也可以没有表头。</span>' +
        '<button type="button" class="btn btn-outline" data-action="choose-excel">选择 Excel 文件</button>' +
      '</div>' +
      '<div class="template-row"><button type="button" class="text-button" data-action="download-template">下载导入模板</button></div>';
    }

    if (entry.excelLoading) {
      html += '<div class="loading-block"><span class="spinner"></span><span>正在解析文件…</span></div>';
    }
    if (entry.excelError) {
      html += '<div class="error-box form-error">' + e(entry.excelError) + '</div>';
    }

    if (entry.excel) {
      var excel = entry.excel;
      var sheetOptions = '';
      if (excel.sheetNames.length > 1) {
        sheetOptions = '<div class="mapping-field" style="grid-column: 1 / -1;">' +
          '<label for="excel-sheet-select">工作表</label>' +
          '<select class="select-input" id="excel-sheet-select" data-role="excel-sheet">' +
            excel.sheetNames.map(function (name, index) {
              return '<option value="' + index + '" ' + (index === excel.sheetIndex ? 'selected' : '') + '>' + e(name) + '</option>';
            }).join('') +
          '</select>' +
        '</div>';
      }

      var analysis = excel.analysis;
      var isCellLayout = analysis.layout === 'cells';
      var headerNote;
      if (isCellLayout) {
        headerNote = '已识别为横向词单：每个格子是一个词条';
        headerNote += analysis.cellAnalysis && analysis.cellAnalysis.dateLabelRows
          ? '，日期取自表格中的日期标签（未写年份的按今年处理）。'
          : '，整张表会归入上方选择的日期。';
      } else {
        headerNote = analysis.headerRow >= 0
          ? '第 ' + (analysis.headerRow + 1) + ' 行识别为表头。'
          : '没有发现表头，已根据内容自动匹配列。';
        if (excel.mapping.date >= 0) headerNote += ' 日期取自表格中的日期列。';
      }

      html += '<div class="file-meta" style="margin-top: 14px;">' +
          '<span class="file-type-icon">' + icon('file', 16) + '</span>' +
          '<span class="file-meta-copy"><span class="file-name">' + e(excel.fileName) + '</span>' +
            '<span class="file-sub">' + excel.sheetNames.length + ' 个工作表 · ' + (excel.matrix.length || 0) + ' 行</span></span>' +
          '<button type="button" class="file-change" data-action="choose-excel">更换</button>' +
        '</div>';

      if (isCellLayout) {
        html += (sheetOptions ? '<div class="mapping-grid">' + sheetOptions + '</div>' : '') +
          '<div class="excel-note">' + e(headerNote) + '</div>';
      } else {
        html += '<div class="mapping-grid">' + sheetOptions +
          '<div class="mapping-field"><label for="excel-map-en">英文列</label>' +
            '<select class="select-input" id="excel-map-en" data-role="excel-map-en">' +
              columnOptionsHTML(excel.matrix, analysis.headerRow, excel.mapping.en, '请选择英文列', false) +
            '</select>' +
          '</div>' +
          '<div class="mapping-field"><label for="excel-map-zh">中文列</label>' +
            '<select class="select-input" id="excel-map-zh" data-role="excel-map-zh">' +
              columnOptionsHTML(excel.matrix, analysis.headerRow, excel.mapping.zh, '自动识别整行', true) +
            '</select>' +
          '</div>' +
          '<div class="mapping-field"><label for="excel-map-date">日期列（可选）</label>' +
            '<select class="select-input" id="excel-map-date" data-role="excel-map-date">' +
              columnOptionsHTML(excel.matrix, analysis.headerRow, excel.mapping.date, '不使用日期列', true) +
            '</select>' +
          '</div>' +
        '</div>' +
        '<div class="excel-note">' + e(headerNote) + ' 如果识别有误，可以手动调整上方的列对应关系。</div>';
      }

      html += '<div id="excel-preview">' + renderExcelPreviewHTML(parseExcelPreview()) + '</div>';
    }

    return html + '</section>';
  }

  function parseExcelPreview() {
    var entry = state.entry;
    if (!entry || !entry.excel) {
      return {
        parsed: { entries: [], errors: [], duplicateCount: 0, skippedCount: 0 },
        counts: { newCount: 0, duplicateCount: 0, invalidCount: 0 }
      };
    }
    var excel = entry.excel;
    var fallbackDate = Utils.isValidDateStr(entry.date) ? entry.date : Utils.todayStr();
    var parsed = WordParser.parseTable(excel.matrix, fallbackDate, excel.mapping);
    var counts = Store.countNewEntries(parsed.entries);
    return { parsed: parsed, counts: counts };
  }

  function renderExcelPreviewHTML(data) {
    if (!state.entry || !state.entry.excel) return '';
    var parsed = data.parsed;
    var counts = data.counts;
    var repeated = counts.duplicateCount + parsed.duplicateCount;
    var stats = '<span class="parse-stat good">可导入 ' + counts.newCount + '</span>';
    if (repeated > 0) stats += '<span class="parse-stat warn">重复 ' + repeated + '</span>';
    if (parsed.errors.length) stats += '<span class="parse-stat bad">无法解析 ' + parsed.errors.length + '</span>';

    var table = '';
    if (parsed.entries.length) {
      table = '<div class="excel-table-wrap"><table class="excel-table"><thead><tr>' +
        '<th>英文</th><th>中文</th><th>日期</th></tr></thead><tbody>' +
        parsed.entries.slice(0, 6).map(function (item) {
          return '<tr><td>' + e(Utils.truncate(item.en, 28)) + '</td><td>' + e(Utils.truncate(item.zh, 24)) + '</td><td>' + e(item.date) + '</td></tr>';
        }).join('') +
        '</tbody></table></div>';
      if (parsed.entries.length > 6) {
        table += '<p class="empty-mini">仅预览前 6 条，共 ' + parsed.entries.length + ' 条。</p>';
      }
    }

    var errorHtml = '';
    if (parsed.errors.length) {
      errorHtml = '<div class="error-box">' + parsed.errors.slice(0, 4).map(function (error) {
        var prefix = error.row ? '第 ' + error.row + ' 行' : '提示';
        return '<div class="error-line">' + prefix + '：' + e(error.message) + '</div>';
      }).join('') + (parsed.errors.length > 4 ? '<div class="error-line">还有 ' + (parsed.errors.length - 4) + ' 行未显示…</div>' : '') + '</div>';
    }

    return '<div class="preview-card">' +
      '<div class="preview-head"><span class="preview-title">导入预览</span><span class="preview-count">' + parsed.entries.length + ' 条</span></div>' +
      '<div class="parse-stats">' + stats + '</div>' +
      (table || '<p class="empty-mini">没有解析到词条，请检查列对应关系和表头位置。</p>') +
      errorHtml +
    '</div>';
  }

  function columnOptionsHTML(matrix, headerRow, selected, emptyLabel, allowAuto) {
    var maxCols = 0;
    (matrix || []).forEach(function (row) {
      if (row && row.length > maxCols) maxCols = row.length;
    });
    var html = '';
    if (allowAuto) {
      html += '<option value="-1" ' + (selected == null || selected < 0 ? 'selected' : '') + '>' + e(emptyLabel) + '</option>';
    } else if (selected < 0) {
      html += '<option value="-1" selected disabled>' + e(emptyLabel) + '</option>';
    }
    for (var col = 0; col < maxCols; col += 1) {
      var header = '';
      if (headerRow >= 0 && matrix[headerRow]) {
        header = rawCellText(matrix[headerRow][col]);
      }
      var sample = '';
      var start = headerRow >= 0 ? headerRow + 1 : 0;
      for (var r = start; r < matrix.length; r += 1) {
        var text = rawCellText(matrix[r] && matrix[r][col]);
        if (text) {
          sample = text;
          break;
        }
      }
      var parts = [excelColumnLabel(col) + ' 列'];
      if (header) parts.push(Utils.truncate(header, 10));
      if (sample) parts.push(Utils.truncate(sample, 12));
      html += '<option value="' + col + '" ' + (selected === col ? 'selected' : '') + '>' + e(parts.join(' · ')) + '</option>';
    }
    return html;
  }

  function excelColumnLabel(index) {
    var label = '';
    var value = index + 1;
    while (value > 0) {
      var rem = (value - 1) % 26;
      label = String.fromCharCode(65 + rem) + label;
      value = Math.floor((value - 1) / 26);
    }
    return label;
  }

  function rawCellText(value) {
    if (value == null) return '';
    if (value instanceof Date) return WordParser.normalizeDateValue(value) || '';
    return String(value).trim();
  }

  function renderManualPane() {
    var entry = state.entry;
    var message = entry.message ? (
      '<div class="inline-message ' + (entry.messageType === 'error' ? 'is-error' : '') + '">' + e(entry.message) + '</div>'
    ) : '';
    return '<section class="entry-section">' +
      '<form class="manual-form form-stack" id="manual-form" autocomplete="off">' +
        '<div class="field">' +
          '<label class="field-label" for="manual-en">英文</label>' +
          '<input class="text-input" id="manual-en" name="en" type="text" placeholder="例如：look after" autocapitalize="off" autocorrect="off" spellcheck="false">' +
        '</div>' +
        '<div class="field">' +
          '<label class="field-label" for="manual-zh">中文释义</label>' +
          '<input class="text-input" id="manual-zh" name="zh" type="text" placeholder="例如：照顾">' +
        '</div>' +
        '<div class="field">' +
          '<label class="field-label" for="manual-date">学习日期</label>' +
          '<input class="date-input" id="manual-date" name="date" type="date" value="' + e(entry.date) + '">' +
        '</div>' +
      '</form>' +
      message +
      '<p class="manual-note">适合一次只补一个词。想连续添加多个，建议回到“批量粘贴”。</p>' +
    '</section>';
  }

  function renderEntryScreenPreserveScroll() {
    var scrollEl = dom.screenRoot.querySelector('.entry-screen .screen-scroll');
    var top = scrollEl ? scrollEl.scrollTop : 0;
    showScreen(renderEntryScreenHTML(), 'entry');
    window.requestAnimationFrame(function () {
      var next = dom.screenRoot.querySelector('.entry-screen .screen-scroll');
      if (next) next.scrollTop = top;
    });
  }

  function submitManualEntry(form) {
    if (!state.entry) return;
    var data = new FormData(form);
    var en = String(data.get('en') || '').trim();
    var zh = String(data.get('zh') || '').trim();
    var date = String(data.get('date') || '');
    var made = WordParser.makeEntry(en, zh, date);
    if (made.error) {
      state.entry.message = made.error;
      state.entry.messageType = 'error';
      renderEntryScreenPreserveScroll();
      return;
    }
    if (!Utils.isValidDateStr(date)) {
      state.entry.message = '请选择一个学习日期';
      state.entry.messageType = 'error';
      renderEntryScreenPreserveScroll();
      return;
    }
    var result = Store.addWords([made.entry]);
    if (result.duplicateCount > 0) {
      state.entry.message = '这一天已经有「' + made.entry.en + '」了';
      state.entry.messageType = 'error';
    } else if (result.added.length) {
      state.entry.message = '已添加「' + made.entry.en + '」，可以继续添加下一个。';
      state.entry.messageType = 'success';
      state.entry.date = date;
      toast('已添加 ' + made.entry.en);
    } else {
      state.entry.message = '没有添加成功，请检查内容';
      state.entry.messageType = 'error';
    }
    renderEntryScreenPreserveScroll();
    var enInput = document.getElementById('manual-en');
    if (enInput && !window.matchMedia('(pointer: coarse)').matches) {
      enInput.focus({ preventScroll: true });
    }
  }

  function submitPasteEntry() {
    if (!state.entry) return;
    var textarea = document.getElementById('paste-input');
    if (textarea) state.entry.text = textarea.value;
    var data = parsePastePreview();
    if (!data.counts.newCount) {
      toast(data.parsed.entries.length ? '这些单词都已经在词库里了' : '还没有识别到可添加的单词', 'warning');
      return;
    }
    var result = Store.addWords(data.parsed.entries);
    if (!result.added.length) {
      toast('没有新增单词', 'warning');
      return;
    }
    finishEntryImport(result, data.parsed.errors.length);
  }

  function finishEntryImport(result, parseErrorCount) {
    var addedToday = result.added.some(function (word) { return word.date === Utils.todayStr(); });
    var target = state.page === 'today' && addedToday ? 'today' : 'words';
    var message = '已添加 ' + result.added.length + ' 个单词';
    if (result.duplicateCount > 0) message += '，跳过 ' + result.duplicateCount + ' 个重复词';
    if (parseErrorCount > 0) message += '，' + parseErrorCount + ' 行未识别';
    hideScreen();
    if (state.page !== target) {
      state.page = target;
      history.replaceState(null, '', '#' + target);
    }
    window.scrollTo(0, 0);
    renderPage();
    toast(message, result.storageOk === false ? 'warning' : 'success');
    if (result.storageOk === false) {
      setTimeout(function () { toast('本地保存失败，请尽快导出备份。', 'error'); }, 800);
    }
  }

  function pickExcelFile() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv';
    input.style.display = 'none';
    document.body.appendChild(input);
    input.addEventListener('change', function () {
      var file = input.files && input.files[0];
      document.body.removeChild(input);
      if (file) handleExcelFile(file);
    });
    input.click();
  }

  async function handleExcelFile(file) {
    if (!state.entry) return;
    if (!/\.(xlsx|xls|csv)$/i.test(file.name)) {
      toast('请选择 .xlsx、.xls 或 .csv 文件', 'error');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast('文件超过 20MB，建议拆分成小文件导入', 'error');
      return;
    }
    state.entry.excelError = '';
    state.entry.excelLoading = true;
    state.entry.excel = null;
    renderEntryScreenPreserveScroll();
    try {
      await ensureXlsx();
      var workbook = await readWorkbookFile(file);
      if (!state.entry) return;
      if (!workbook.SheetNames || !workbook.SheetNames.length) throw new Error('文件中没有可读取的工作表');
      var matrix = readSheetMatrix(workbook, workbook.SheetNames[0]);
      var analysis = WordParser.detectTable(matrix);
      state.entry.excel = {
        fileName: file.name,
        workbook: workbook,
        sheetNames: workbook.SheetNames.slice(),
        sheetIndex: 0,
        matrix: matrix,
        analysis: analysis,
        mapping: {
          en: analysis.mapping.en,
          zh: analysis.mapping.zh,
          date: analysis.mapping.date,
          headerRow: analysis.headerRow
        }
      };
    } catch (error) {
      console.error(error);
      if (state.entry) {
        state.entry.excelError = '文件读取失败：' + (error && error.message ? error.message : '请确认文件格式正确');
      }
    } finally {
      if (state.entry) {
        state.entry.excelLoading = false;
        renderEntryScreenPreserveScroll();
      }
    }
  }

  async function readWorkbookFile(file) {
    var buffer = await file.arrayBuffer();
    if (/\.csv$/i.test(file.name)) {
      var text;
      try {
        text = new TextDecoder('utf-8', { fatal: true }).decode(buffer);
        if (text.indexOf('�') >= 0) throw new Error('需要换用 GBK');
      } catch (error) {
        try {
          text = new TextDecoder('gbk').decode(buffer);
        } catch (gbkError) {
          text = new TextDecoder('utf-8').decode(buffer);
        }
      }
      return window.XLSX.read(text, { type: 'string', raw: false });
    }
    return window.XLSX.read(new Uint8Array(buffer), { type: 'array', cellDates: true });
  }

  function readSheetMatrix(workbook, sheetName) {
    var sheet = workbook.Sheets[sheetName];
    return window.XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      defval: '',
      raw: true,
      blankrows: false
    });
  }

  function changeExcelSheet(index) {
    if (!state.entry || !state.entry.excel) return;
    var excel = state.entry.excel;
    if (!excel.workbook || !excel.sheetNames[index]) return;
    var matrix = readSheetMatrix(excel.workbook, excel.sheetNames[index]);
    var analysis = WordParser.detectTable(matrix);
    excel.sheetIndex = index;
    excel.matrix = matrix;
    excel.analysis = analysis;
    excel.mapping = {
      en: analysis.mapping.en,
      zh: analysis.mapping.zh,
      date: analysis.mapping.date,
      headerRow: analysis.headerRow
    };
    renderEntryScreenPreserveScroll();
  }

  function submitExcelImport() {
    if (!state.entry || !state.entry.excel) return;
    var data = parseExcelPreview();
    if (!data.counts.newCount) {
      toast(data.parsed.entries.length ? '这些单词都已经在词库里了' : '没有可导入的单词', 'warning');
      return;
    }
    var result = Store.addWords(data.parsed.entries);
    if (!result.added.length) {
      toast('没有新增单词', 'warning');
      return;
    }
    finishEntryImport(result, data.parsed.errors.length);
  }

  async function downloadExcelTemplate() {
    try {
      await ensureXlsx();
      var today = Utils.todayStr();
      var rows = [
        ['英文', '中文', '日期'],
        ['apple', '苹果', today],
        ['look after', '照顾', today],
        ['take off', '起飞；脱下', today]
      ];
      var worksheet = window.XLSX.utils.aoa_to_sheet(rows);
      worksheet['!cols'] = [{ wch: 22 }, { wch: 28 }, { wch: 14 }];
      var workbook = window.XLSX.utils.book_new();
      window.XLSX.utils.book_append_sheet(workbook, worksheet, '单词导入');
      window.XLSX.writeFile(workbook, '拾词-单词导入模板.xlsx', { compression: true });
      toast('模板已开始下载');
    } catch (error) {
      console.error(error);
      var csv = '英文,中文,日期\napple,苹果,' + Utils.todayStr() + '\n';
      Utils.downloadBlob(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }), '拾词-单词导入模板.csv');
      toast('已下载 CSV 模板', 'warning');
    }
  }

  /* =========================================================
     编辑单词
     ========================================================= */

  function openEditWord(id) {
    var word = Store.getWord(id);
    if (!word) {
      toast('没有找到这个单词', 'error');
      return;
    }
    state.edit = {
      id: id,
      error: ''
    };
    showScreen(renderEditScreenHTML(), 'edit');
  }

  function renderEditScreenHTML() {
    if (!state.edit) return '';
    var word = Store.getWord(state.edit.id);
    if (!word) return '';
    return '<div class="screen entry-screen" role="dialog" aria-modal="true" aria-label="编辑单词">' +
      '<header class="screen-head">' +
        '<button type="button" class="screen-close" data-action="request-close-screen" aria-label="关闭编辑">' + icon('x', 17) + '</button>' +
        '<div class="screen-title"><strong>编辑单词</strong><small>EDIT WORD</small></div>' +
        '<span class="screen-head-side"></span>' +
      '</header>' +
      '<div class="screen-scroll">' +
        '<form class="form-stack" id="edit-form" autocomplete="off">' +
          '<div class="field">' +
            '<label class="field-label" for="edit-en">英文</label>' +
            '<input class="text-input" id="edit-en" name="en" type="text" value="' + e(word.en) + '" autocapitalize="off" autocorrect="off" spellcheck="false">' +
          '</div>' +
          '<div class="field">' +
            '<label class="field-label" for="edit-zh">中文释义</label>' +
            '<input class="text-input" id="edit-zh" name="zh" type="text" value="' + e(word.zh) + '">' +
          '</div>' +
          '<div class="field">' +
            '<label class="field-label" for="edit-date">学习日期</label>' +
            '<input class="date-input" id="edit-date" name="date" type="date" value="' + e(word.date) + '">' +
          '</div>' +
        '</form>' +
        (state.edit.error ? '<div class="error-box form-error">' + e(state.edit.error) + '</div>' : '') +
        '<div class="delete-row"><button type="button" class="text-button danger" data-action="delete-word" data-id="' + e(word.id) + '">' + icon('trash', 12) + '删除这个单词</button></div>' +
      '</div>' +
      '<footer class="screen-footer"><button type="submit" form="edit-form" class="btn btn-primary btn-block">保存修改</button></footer>' +
    '</div>';
  }

  function submitEditWord(form) {
    if (!state.edit) return;
    var data = new FormData(form);
    var result = Store.updateWord(state.edit.id, {
      en: String(data.get('en') || ''),
      zh: String(data.get('zh') || ''),
      date: String(data.get('date') || '')
    });
    if (!result.ok) {
      state.edit.error = result.error;
      var currentScroll = document.querySelector('.entry-screen .screen-scroll');
      var top = currentScroll ? currentScroll.scrollTop : 0;
      showScreen(renderEditScreenHTML(), 'edit');
      var next = document.querySelector('.entry-screen .screen-scroll');
      if (next) next.scrollTop = top;
      return;
    }
    closeScreen();
    toast('单词已更新');
  }

  function deleteCurrentWord(id) {
    var word = Store.getWord(id);
    if (!word) {
      closeScreen();
      return;
    }
    openConfirm({
      title: '删除这个单词？',
      message: '「' + word.en + '」会从 ' + Utils.formatDateCN(word.date) + ' 的词单中移除。已完成的其他记录不会改变。',
      confirmLabel: '删除',
      danger: true,
      onConfirm: function () {
        var result = Store.deleteWord(id);
        closeScreen();
        if (result.ok) toast('已删除 ' + word.en);
        else toast(result.error || '删除失败', 'error');
      }
    });
  }

  /* =========================================================
     使用帮助与安装说明
     ========================================================= */

  function renderHelpScreenHTML() {
    return '<div class="screen modal-screen" role="dialog" aria-modal="true" aria-label="使用说明">' +
      '<div class="modal-scrim" data-action="close-screen"></div>' +
      '<div class="bottom-sheet">' +
        '<div class="sheet-grabber"></div>' +
        '<header class="bottom-sheet-head">' +
          '<div><p class="eyebrow">HOW IT WORKS</p><h2>使用说明</h2></div>' +
          '<button type="button" class="screen-close" data-action="close-screen" aria-label="关闭">' + icon('x', 17) + '</button>' +
        '</header>' +
        '<div class="bottom-sheet-scroll">' +
          '<div class="install-steps">' +
            '<div class="install-step"><span class="step-num">01</span><div><strong>录入单词</strong><p>在词库页点“批量粘贴”，每行一个单词；中英文用空格、逗号、短横线分隔都可以。也可以导入带“英文 / 中文 / 日期”列的 Excel。</p></div></div>' +
            '<div class="install-step"><span class="step-num">02</span><div><strong>每天背诵</strong><p>首页会显示当天日期的单词。翻卡时先想释义，再点“显示释义”，如实选择“还不熟”或“记住了”。</p></div></div>' +
            '<div class="install-step"><span class="step-num">03</span><div><strong>练习与打卡</strong><p>完成当天背诵和至少一轮练习后，回首页点击“完成今日打卡”。练习中答错的词会在结果页列出。</p></div></div>' +
            '<div class="install-step"><span class="step-num">04</span><div><strong>汇总练习</strong><p>在练习页勾选任意几天，选择题型和题目数量，就能把几天的单词混在一起练习；汇总练习不改变每日打卡状态。</p></div></div>' +
            '<div class="install-step"><span class="step-num">05</span><div><strong>备份数据</strong><p>所有数据只保存在当前浏览器。换手机、清理浏览器数据前，请在“我的”里导出完整备份。</p></div></div>' +
          '</div>' +
          '<div class="install-note">小提示：日期是单词的分组依据。录入时选好日期，只有当天才会出现在“今日词单”。</div>' +
        '</div>' +
        '<div class="bottom-sheet-actions"><button type="button" class="btn btn-primary btn-block" data-action="close-screen">知道了</button></div>' +
      '</div>' +
    '</div>';
  }

  function renderInstallScreenHTML() {
    var httpWarning = location.protocol === 'http:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1';
    var fileWarning = location.protocol === 'file:';
    return '<div class="screen modal-screen install-sheet" role="dialog" aria-modal="true" aria-label="添加到手机桌面">' +
      '<div class="modal-scrim" data-action="close-screen"></div>' +
      '<div class="bottom-sheet">' +
        '<div class="sheet-grabber"></div>' +
        '<header class="bottom-sheet-head">' +
          '<div><p class="eyebrow">ADD TO HOME SCREEN</p><h2>把拾词放到桌面</h2></div>' +
          '<button type="button" class="screen-close" data-action="close-screen" aria-label="关闭">' + icon('x', 17) + '</button>' +
        '</header>' +
        '<div class="bottom-sheet-scroll">' +
          '<p class="sheet-lead">如果浏览器没有自动弹出安装提示，可以按下面的方式手动添加。</p>' +
          '<div class="install-steps">' +
            '<div class="install-step"><span class="step-num">01</span><div><strong>Android · Chrome / Edge</strong><p>点浏览器右上角的菜单（三个点），选择“添加到主屏幕”或“安装应用”。</p></div></div>' +
            '<div class="install-step"><span class="step-num">02</span><div><strong>iPhone · Safari</strong><p>点底部的分享按钮，再选择“添加到主屏幕”。需要在 Safari 中打开本页。</p></div></div>' +
            '<div class="install-step"><span class="step-num">03</span><div><strong>电脑浏览器</strong><p>地址栏右侧通常会出现安装图标，点击即可。也可以用浏览器菜单里的“安装拾词”。</p></div></div>' +
          '</div>' +
          (httpWarning ? '<div class="install-note">当前页面通过局域网 HTTP 打开，部分浏览器不会显示安装入口，也无法离线缓存。部署到 HTTPS 网站后可以完整安装。</div>' : '') +
          (fileWarning ? '<div class="install-note">当前是直接打开的单文件版。它本身已经可以离线使用，但浏览器通常不允许把本地文件安装为桌面应用。把同一份文件部署到 HTTPS 网站后，就能使用安装入口。</div>' : '') +
        '</div>' +
        '<div class="bottom-sheet-actions"><button type="button" class="btn btn-primary btn-block" data-action="close-screen">知道了</button></div>' +
      '</div>' +
    '</div>';
  }

  function handleInstall() {
    if (isStandalone()) {
      toast('拾词已经在桌面应用中运行');
      return;
    }
    if (state.deferredInstallPrompt) {
      var promptEvent = state.deferredInstallPrompt;
      state.deferredInstallPrompt = null;
      promptEvent.prompt();
      promptEvent.userChoice.then(function (choice) {
        if (choice && choice.outcome === 'accepted') toast('正在安装拾词');
      }).catch(function () {});
      return;
    }
    showScreen(renderInstallScreenHTML(), 'install');
  }

  /* =========================================================
     背诵流程
     ========================================================= */

  function startStudySession() {
    var date = Utils.todayStr();
    var words = Store.getWordsForDate(date);
    if (!words.length) {
      toast('今天还没有单词，先添加几个吧');
      openEntry('paste', date);
      return;
    }
    var shuffled = Utils.shuffle(words);
    var byId = Object.create(null);
    shuffled.forEach(function (word) { byId[word.id] = word; });
    state.study = {
      date: date,
      words: shuffled,
      byId: byId,
      queue: shuffled.map(function (word) { return word.id; }),
      completed: Object.create(null),
      attempts: Object.create(null),
      unknown: Object.create(null),
      revealed: false,
      answeredCount: 0,
      done: false
    };
    showScreen(renderStudyScreenHTML(), 'study');
  }

  function studyCurrentWord() {
    var session = state.study;
    if (!session || !session.queue.length) return null;
    return session.byId[session.queue[0]] || null;
  }

  function renderStudyScreenHTML() {
    var session = state.study;
    if (!session) return '';
    if (session.done) return renderStudyCompleteHTML();
    var word = studyCurrentWord();
    if (!word) return '';
    var completed = Object.keys(session.completed).length;
    var total = session.words.length;
    var position = Math.min(completed + 1, total);
    var progress = Math.round((completed / total) * 100);
    var dateLabel = Utils.formatDateCN(session.date, { weekday: true });

    var cardContent = session.revealed ? (
      '<div class="study-meaning">' +
        '<p class="meaning-label">释义</p>' +
        '<p class="meaning-text">' + e(word.zh) + '</p>' +
      '</div>' +
      '<p class="study-card-hint-bottom">如实选择是否记住，不熟的词会在这一轮稍后再出现一次。</p>'
    ) : (
      '<div class="study-reveal-hint">先在心里回想一下，再看释义</div>'
    );

    var actions = session.revealed ? (
      '<div class="study-actions">' +
        '<button type="button" class="btn btn-unknown" data-action="study-grade" data-known="0">还不熟</button>' +
        '<button type="button" class="btn btn-known" data-action="study-grade" data-known="1">记住了</button>' +
      '</div>' +
      '<p class="study-tip">不确定也没关系，诚实一点，复习才有用。</p>'
    ) : (
      '<button type="button" class="btn btn-reveal" data-action="study-reveal">显示释义</button>' +
      '<p class="study-tip">先回忆，再翻面。</p>'
    );

    return '<div class="screen study-screen" role="dialog" aria-modal="true" aria-label="今日背诵">' +
      '<header class="study-head">' +
        '<button type="button" class="round-light" data-action="request-close-screen" aria-label="退出背诵">' + icon('x', 17) + '</button>' +
        '<div class="study-head-info"><span class="study-kicker">今日背诵</span><span class="study-date-label">' + e(dateLabel) + '</span></div>' +
        '<span class="study-counter">' + completed + ' / ' + total + '</span>' +
      '</header>' +
      '<div class="study-progress"><span style="width: ' + progress + '%;"></span></div>' +
      '<div class="study-main">' +
        '<div class="study-card">' +
          '<div class="study-card-top">' +
            '<span class="study-index">WORD ' + Utils.pad2(position) + ' / ' + Utils.pad2(total) + '</span>' +
            '<span class="study-card-date">' + e(Utils.relativeDateLabel(session.date)) + '</span>' +
          '</div>' +
          '<div class="study-word-wrap">' +
            '<div class="study-word">' + e(word.en) + '</div>' +
            '<button type="button" class="audio-button" data-action="study-speak" aria-label="朗读 ' + e(word.en) + '">' + icon('volume', 15) + '</button>' +
          '</div>' +
          cardContent +
        '</div>' +
      '</div>' +
      '<div class="study-bottom">' + actions + '</div>' +
    '</div>';
  }

  function revealStudyWord() {
    if (!state.study || state.study.done || state.study.revealed) return;
    state.study.revealed = true;
    showScreen(renderStudyScreenHTML(), 'study');
  }

  function gradeStudyWord(known) {
    var session = state.study;
    if (!session || session.done || !session.revealed) return;
    var currentId = session.queue.shift();
    if (!currentId) return;
    session.attempts[currentId] = (session.attempts[currentId] || 0) + 1;
    session.answeredCount += 1;
    if (known) {
      session.completed[currentId] = true;
    } else {
      session.unknown[currentId] = true;
      if (session.attempts[currentId] === 1) {
        session.queue.push(currentId);
      } else {
        session.completed[currentId] = true;
      }
    }
    session.revealed = false;

    if (Object.keys(session.completed).length >= session.words.length) {
      session.answeredCount = Math.max(session.answeredCount, session.words.length);
      session.done = true;
      var result = Store.markStudyDone(session.date);
      if (result && result.storageOk === false) {
        toast('本地保存失败，请尽快导出备份', 'error');
      }
      showScreen(renderStudyCompleteHTML(), 'study');
      return;
    }
    showScreen(renderStudyScreenHTML(), 'study');
  }

  function renderStudyCompleteHTML() {
    var session = state.study;
    if (!session) return '';
    var day = Store.getDay(session.date);
    var practiceDone = !!day.practiceDoneAt;
    var checked = !!day.checkedInAt;
    var unknownCount = Object.keys(session.unknown).length;
    var primaryAction;
    var primaryLabel;
    var hint;

    if (!practiceDone) {
      primaryAction = 'study-to-practice';
      primaryLabel = '去完成练习';
      hint = '还差一轮练习，就能完成今天的打卡。';
    } else if (!checked) {
      primaryAction = 'study-to-home';
      primaryLabel = '回首页打卡';
      hint = '背诵和练习都完成了，回首页领取今天的印章。';
    } else {
      primaryAction = 'close-screen';
      primaryLabel = '回到今日';
      hint = '今天已经打过卡了，想再复习随时可以。';
    }

    return '<div class="screen study-screen" role="dialog" aria-modal="true" aria-label="背诵完成">' +
      '<header class="study-head">' +
        '<button type="button" class="round-light" data-action="request-close-screen" aria-label="关闭">' + icon('x', 17) + '</button>' +
        '<div class="study-head-info"><span class="study-kicker">STUDY COMPLETE</span><span class="study-date-label">' + e(Utils.formatDateCN(session.date, { weekday: true })) + '</span></div>' +
        '<span class="study-counter">' + session.words.length + ' / ' + session.words.length + '</span>' +
      '</header>' +
      '<div class="study-progress"><span style="width: 100%;"></span></div>' +
      '<div class="study-complete">' +
        '<div class="complete-mark">' + icon('check', 29) + '</div>' +
        '<p class="eyebrow light">TODAY IS DONE</p>' +
        '<h2>今天的词，<br>都过了一遍。</h2>' +
        '<p>' + e(hint) + '</p>' +
        '<div class="complete-stats">' +
          '<div class="complete-stat"><strong>' + session.words.length + '</strong><span>今日单词</span></div>' +
          '<div class="complete-stat"><strong>' + unknownCount + '</strong><span>第一遍不熟</span></div>' +
          '<div class="complete-stat"><strong>' + (checked ? '✓' : '—') + '</strong><span>今日打卡</span></div>' +
        '</div>' +
        '<div class="complete-actions">' +
          '<button type="button" class="btn btn-cream" data-action="' + primaryAction + '">' + e(primaryLabel) + icon('arrowRight', 15) + '</button>' +
          '<button type="button" class="btn btn-soft" data-action="study-again">再背一遍</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  /* =========================================================
     今日练习设置
     ========================================================= */

  function normalizeDailyCount(requested, wordCount) {
    if (requested === 'all' || requested == null) return 'all';
    var numeric = Number(requested);
    if (!isFinite(numeric) || numeric >= wordCount || numeric <= 0) return 'all';
    return numeric;
  }

  function dailySetupQuestionCount() {
    if (!state.dailySetup) return 0;
    if (state.dailySetup.count === 'all') return state.dailySetup.words.length;
    return Math.min(state.dailySetup.words.length, Number(state.dailySetup.count) || state.dailySetup.words.length);
  }

  function openDailyPracticeSetup() {
    var date = Utils.todayStr();
    var words = Store.getWordsForDate(date);
    if (!words.length) {
      toast('今天还没有单词，先添加几个吧');
      openEntry('paste', date);
      return;
    }
    var day = Store.getDay(date);
    state.dailySetup = {
      date: date,
      words: QuizEngine.prepareWords(words),
      mode: QuizEngine.MODES[state.practiceMode] ? state.practiceMode : 'en2zh',
      count: normalizeDailyCount(state.practiceCount, words.length),
      best: day.bestPractice
    };
    showScreen(renderDailySetupHTML(), 'daily-setup');
  }

  function dailyCountOptions() {
    if (!state.dailySetup) return [];
    var n = state.dailySetup.words.length;
    var options = [];
    if (n > 10) options.push(10);
    if (n > 20) options.push(20);
    options.push('all');
    return options;
  }

  function renderDailySetupHTML() {
    var setup = state.dailySetup;
    if (!setup) return '';
    var n = setup.words.length;
    var modes = ['en2zh', 'zh2en', 'spell', 'mixed'];
    var modesHtml = modes.map(function (key) {
      var mode = QuizEngine.MODES[key];
      var active = setup.mode === key;
      return '<button type="button" class="mode-pick ' + (active ? 'is-active' : '') + '" data-action="set-daily-mode" data-mode="' + key + '" aria-pressed="' + active + '">' +
        '<span class="mode-pick-icon">' + e(mode.symbol) + '</span>' +
        '<span class="mode-pick-copy"><strong>' + e(mode.label) + '</strong><small>' + e(mode.description) + '</small></span>' +
        '<span class="radio-mark">' + (active ? icon('check', 10) : '') + '</span>' +
      '</button>';
    }).join('');

    var counts = dailyCountOptions().map(function (value) {
      var active = setup.count === value || (typeof value === 'number' && Number(setup.count) === value);
      var label = value === 'all' ? '全部 ' + n + ' 题' : value + ' 题';
      return '<button type="button" class="chip ' + (active ? 'is-active' : '') + '" data-action="set-daily-count" data-count="' + value + '">' + label + '</button>';
    }).join('');

    var lead = '今天有 ' + n + ' 个词。' + (setup.best ? '上次最佳正确率 ' + setup.best.score + '%，再来一轮？' : '先背再练，记得更牢。');

    return '<div class="screen modal-screen" role="dialog" aria-modal="true" aria-label="今日练习设置">' +
      '<div class="modal-scrim" data-action="request-close-screen"></div>' +
      '<div class="bottom-sheet">' +
        '<div class="sheet-grabber"></div>' +
        '<header class="bottom-sheet-head">' +
          '<div><p class="eyebrow">DAILY PRACTICE</p><h2>今日练习</h2></div>' +
          '<button type="button" class="screen-close" data-action="request-close-screen" aria-label="关闭">' + icon('x', 17) + '</button>' +
        '</header>' +
        '<div class="bottom-sheet-scroll">' +
          '<p class="sheet-lead">' + e(lead) + '</p>' +
          '<div class="choice-list">' + modesHtml + '</div>' +
          '<div class="count-block">' +
            '<div class="field-label-row"><span class="field-label">题目数量</span><span class="field-hint">每个词一道题</span></div>' +
            '<div class="chip-row">' + counts + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="bottom-sheet-actions">' +
          '<button type="button" class="btn btn-primary btn-block" data-action="start-daily-quiz" id="daily-start-button">开始练习 · ' + dailySetupQuestionCount() + ' 题</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function refreshDailySetupUI() {
    if (!state.dailySetup) return;
    Array.prototype.forEach.call(dom.screenRoot.querySelectorAll('[data-action="set-daily-mode"]'), function (button) {
      var active = button.getAttribute('data-mode') === state.dailySetup.mode;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', active);
      var mark = button.querySelector('.radio-mark');
      if (mark) mark.innerHTML = active ? icon('check', 10) : '';
    });
    Array.prototype.forEach.call(dom.screenRoot.querySelectorAll('[data-action="set-daily-count"]'), function (button) {
      var value = button.getAttribute('data-count');
      var active = value === String(state.dailySetup.count);
      button.classList.toggle('is-active', active);
    });
    var start = document.getElementById('daily-start-button');
    if (start) start.textContent = '开始练习 · ' + dailySetupQuestionCount() + ' 题';
  }

  function startDailyQuiz() {
    if (!state.dailySetup) return;
    var setup = state.dailySetup;
    startQuizSession({
      source: 'daily',
      date: setup.date,
      words: setup.words,
      mode: setup.mode,
      count: setup.count
    });
  }

  /* =========================================================
     练习答题流程
     ========================================================= */

  function startQuizSession(config) {
    var built = QuizEngine.buildQuiz({
      words: config.words || [],
      pool: Store.getWords(),
      mode: config.mode || 'en2zh',
      count: config.count || 'all'
    });
    if (!built.questions.length) {
      toast('单词不够，暂时无法生成练习', 'error');
      return;
    }
    state.quiz = {
      source: config.source || 'aggregate',
      date: config.date || null,
      dates: (config.dates || []).slice(),
      mode: config.mode || 'en2zh',
      count: config.count || 'all',
      questions: built.questions,
      index: 0,
      answered: false,
      selectedIndex: null,
      typed: '',
      feedbackCorrect: null,
      correctCount: 0,
      answeredCount: 0,
      wrong: [],
      finished: false,
      recorded: false
    };
    showScreen(renderQuizScreenHTML(), 'quiz');
  }

  function currentQuizQuestion() {
    if (!state.quiz) return null;
    return state.quiz.questions[state.quiz.index] || null;
  }

  function quizSourceLabel() {
    if (!state.quiz) return '';
    if (state.quiz.source === 'daily') return '今日练习';
    var count = state.quiz.dates.length;
    return count > 1 ? count + ' 天汇总' : '汇总练习';
  }

  function renderQuizScreenHTML() {
    var session = state.quiz;
    if (!session) return '';
    var question = currentQuizQuestion();
    if (!question) return '';
    var total = session.questions.length;
    var answered = session.answered;
    var isLast = session.index >= total - 1;
    var progress = Math.round(((session.index + (answered ? 1 : 0)) / total) * 100);
    var mode = QuizEngine.MODES[question.type] || QuizEngine.MODES.en2zh;
    var promptClasses = 'quiz-prompt' + (question.type === 'en2zh' ? '' : ' is-chinese');
    var instruction = question.type === 'en2zh'
      ? '选出正确的中文释义'
      : (question.type === 'zh2en' ? '选出对应的英文单词' : '根据中文，写出完整英文');

    var choicesHtml = '';
    if (question.type === 'spell') {
      var spellClass = '';
      if (answered) spellClass = session.feedbackCorrect ? ' is-correct' : ' is-wrong';
      choicesHtml = '<form class="spell-area" id="spell-form" autocomplete="off">' +
        '<label class="spell-field-label" for="spell-answer">拼写答案</label>' +
        '<input class="spell-input' + spellClass + '" id="spell-answer" name="answer" type="text" value="' + e(session.typed) + '" ' +
          (answered ? 'disabled ' : '') + 'autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" placeholder="在这里写下英文">' +
        (answered ? (
          '<div class="spell-after ' + (session.feedbackCorrect ? 'is-correct' : '') + '">' +
            icon(session.feedbackCorrect ? 'check' : 'x', 13) +
            '<span>' + (session.feedbackCorrect ? '拼写正确。' : '正确答案：' + e(question.answer)) + '</span>' +
          '</div>'
        ) : (
          '<button type="submit" class="spell-submit">提交拼写</button>'
        )) +
      '</form>';
    } else {
      choicesHtml = '<div class="quiz-choices">' + question.choices.map(function (choice, index) {
        var classes = ['choice-btn'];
        var mark = '';
        if (answered) {
          if (index === question.correctIndex) {
            classes.push('is-correct');
            mark = icon('check', 16);
          } else if (index === session.selectedIndex) {
            classes.push('is-wrong');
            mark = icon('x', 16);
          } else {
            classes.push('is-muted');
          }
        }
        return '<button type="button" class="' + classes.join(' ') + '" data-action="quiz-option" data-index="' + index + '" ' +
          (answered ? 'disabled ' : '') + 'aria-pressed="' + (session.selectedIndex === index) + '">' +
          '<span class="choice-letter">' + String.fromCharCode(65 + index) + '</span>' +
          '<span class="choice-text">' + e(choice) + '</span>' +
          (mark ? '<span class="choice-mark">' + mark + '</span>' : '') +
        '</button>';
      }).join('') + '</div>';
    }

    var footer = answered ? (
      '<div class="feedback ' + (session.feedbackCorrect ? '' : 'is-wrong') + '">' +
        '<span class="feedback-icon">' + icon(session.feedbackCorrect ? 'check' : 'x', 15) + '</span>' +
        '<span class="feedback-copy">' +
          '<span class="feedback-title">' + (session.feedbackCorrect ? '答对了' : '再看一眼') + '</span>' +
          '<span class="feedback-pair"><b>' + e(question.word.en) + '</b> · ' + e(question.word.zh) + '</span>' +
        '</span>' +
        '<button type="button" class="feedback-next" data-action="quiz-next">' +
          (isLast ? '查看结果' : '下一题') + icon('chevronRight', 13) +
        '</button>' +
      '</div>'
    ) : (
      '<p class="quiz-hint">' + (question.type === 'spell' ? '把英文完整写出来，按回车或点按钮提交。' : '选择一个你认为正确的答案。') + '</p>'
    );

    var audio = question.type === 'en2zh'
      ? '<button type="button" class="quiz-audio" data-action="quiz-speak" aria-label="朗读 ' + e(question.word.en) + '">' + icon('volume', 15) + '</button>'
      : '';

    return '<div class="screen quiz-screen" role="dialog" aria-modal="true" aria-label="' + e(quizSourceLabel()) + '">' +
      '<header class="quiz-head">' +
        '<button type="button" class="screen-close" data-action="request-close-screen" aria-label="退出练习">' + icon('x', 17) + '</button>' +
        '<div class="quiz-progress-wrap">' +
          '<div class="quiz-meta"><span class="quiz-type">' + e(mode.label) + ' · ' + e(quizSourceLabel()) + '</span>' +
            '<span class="quiz-counter">' + (session.index + 1) + ' / ' + total + '</span></div>' +
          '<div class="quiz-progress-track"><span style="width: ' + progress + '%;"></span></div>' +
        '</div>' +
        '<span class="quiz-score">' + icon('check', 11) + session.correctCount + '</span>' +
      '</header>' +
      '<div class="quiz-main">' +
        '<div class="quiz-prompt-meta"><span class="quiz-instruction">' + e(instruction) + '</span>' + audio + '</div>' +
        '<h1 class="' + promptClasses + '">' + e(question.prompt) + '</h1>' +
        '<div class="quiz-rule"></div>' +
        choicesHtml +
      '</div>' +
      '<footer class="quiz-footer">' + footer + '</footer>' +
    '</div>';
  }

  function chooseQuizOption(index) {
    var session = state.quiz;
    var question = currentQuizQuestion();
    if (!session || !question || session.answered || question.type === 'spell') return;
    var selected = Number(index);
    if (!isFinite(selected) || !question.choices[selected]) return;
    recordQuizAnswer(selected, '');
  }

  function submitSpellAnswer() {
    var session = state.quiz;
    var question = currentQuizQuestion();
    if (!session || !question || session.answered || question.type !== 'spell') return;
    var input = document.getElementById('spell-answer');
    var value = input ? input.value.trim() : session.typed;
    if (!value) {
      toast('先写下你的答案');
      if (input) input.focus();
      return;
    }
    session.typed = value;
    recordQuizAnswer(null, value);
  }

  function recordQuizAnswer(selectedIndex, typed) {
    var session = state.quiz;
    var question = currentQuizQuestion();
    if (!session || !question || session.answered) return;
    var isCorrect;
    var selectedText = '';
    if (question.type === 'spell') {
      isCorrect = QuizEngine.gradeSpelling(question, typed);
      selectedText = typed;
    } else {
      isCorrect = QuizEngine.gradeChoice(question, selectedIndex);
      selectedText = question.choices[selectedIndex] || '';
    }
    session.answered = true;
    session.selectedIndex = selectedIndex;
    session.typed = typed;
    session.feedbackCorrect = isCorrect;
    session.answeredCount = session.index + 1;
    if (isCorrect) {
      session.correctCount += 1;
    } else {
      session.wrong.push({
        question: question,
        selectedText: selectedText
      });
    }
    showScreen(renderQuizScreenHTML(), 'quiz');
  }

  function nextQuizQuestion() {
    var session = state.quiz;
    if (!session || !session.answered) return;
    if (session.index >= session.questions.length - 1) {
      finishQuiz();
      return;
    }
    session.index += 1;
    session.answered = false;
    session.selectedIndex = null;
    session.typed = '';
    session.feedbackCorrect = null;
    showScreen(renderQuizScreenHTML(), 'quiz');
  }

  function finishQuiz() {
    var session = state.quiz;
    if (!session) return;
    session.finished = true;
    if (session.source === 'daily' && session.date && !session.recorded) {
      var result = Store.markPracticeDone(session.date, {
        correct: session.correctCount,
        total: session.questions.length,
        mode: session.mode
      });
      session.recorded = true;
      if (!result.ok) toast(result.error || '练习完成状态保存失败', 'error');
      else if (result.storageOk === false) toast('本地保存失败，请尽快导出备份', 'error');
    }
    showScreen(renderQuizResultHTML(), 'quiz');
    var percent = Math.round((session.correctCount / session.questions.length) * 100);
    if (percent >= 80) launchConfetti();
  }

  function quizResultMessage(percent) {
    if (percent === 100) return '全对。今天的词，已经和你很熟了。';
    if (percent >= 80) return '记得很稳，再把错词看一遍就更牢了。';
    if (percent >= 60) return '已经掌握大半，错词值得多看两眼。';
    return '别急，学习本来就是一遍一遍变熟的过程。';
  }

  function renderQuizResultHTML() {
    var session = state.quiz;
    if (!session) return '';
    var total = session.questions.length;
    var percent = Math.round((session.correctCount / total) * 100);
    var day = session.date ? Store.getDay(session.date) : null;
    var studyDone = day ? !!day.studyDoneAt : false;
    var checked = day ? !!day.checkedInAt : false;
    var taskLine;
    var primaryAction;
    var primaryLabel;

    if (session.source === 'daily') {
      if (!studyDone) {
        taskLine = '练习已完成。还差一次背诵，就能完成今天的打卡。';
        primaryAction = 'quiz-to-study';
        primaryLabel = '去完成背诵';
      } else if (!checked) {
        taskLine = '今日两项任务已完成，回首页收下这枚印章吧。';
        primaryAction = 'quiz-to-today';
        primaryLabel = '回首页打卡';
      } else {
        taskLine = '今天已经打过卡了，复习一遍也很棒。';
        primaryAction = 'quiz-to-today';
        primaryLabel = '回到今日';
      }
    } else {
      taskLine = '汇总练习已完成，不会改变每日打卡进度。';
      primaryAction = 'close-screen';
      primaryLabel = '返回练习室';
    }

    var wrongHtml;
    if (session.wrong.length) {
      wrongHtml = '<section class="wrong-section">' +
        '<div class="wrong-heading"><h3>需要再看一眼</h3><span>' + session.wrong.length + ' 个词</span></div>' +
        '<div class="wrong-list">' + session.wrong.map(function (item) {
          return '<div class="wrong-item">' +
            '<span class="wrong-copy"><span class="wrong-en">' + e(item.question.word.en) + '</span>' +
              '<span class="wrong-zh">' + e(item.question.word.zh) + '</span></span>' +
            '<span class="wrong-tag">' + e(item.question.typeLabel) + '</span>' +
          '</div>';
        }).join('') + '</div>' +
      '</section>';
    } else {
      wrongHtml = '<div class="wrong-empty">这一轮没有错题。可以换一种练习方式，再考自己一次。</div>';
    }

    return '<div class="screen quiz-screen result-screen" role="dialog" aria-modal="true" aria-label="练习结果">' +
      '<header class="result-head">' +
        '<span class="eyebrow">' + (session.source === 'daily' ? 'DAILY PRACTICE' : 'SUMMARY PRACTICE') + '</span>' +
        '<button type="button" class="screen-close" data-action="request-close-screen" aria-label="关闭结果">' + icon('x', 17) + '</button>' +
      '</header>' +
      '<div class="result-scroll">' +
        '<div class="result-hero">' +
          '<div class="score-ring" style="--score: ' + percent + ';">' +
            '<div class="score-inner"><strong>' + percent + '</strong><span>正确率</span></div>' +
          '</div>' +
          '<h1 class="result-title">' + (percent >= 80 ? '这一轮记得很稳。' : (percent >= 60 ? '正在慢慢记牢。' : '再来一次会更好。')) + '</h1>' +
          '<p class="result-desc">' + e(quizResultMessage(percent)) + '</p>' +
          '<div class="result-stats">' +
            '<span>答对 <b>' + session.correctCount + '</b></span><span class="divider"></span>' +
            '<span>共 <b>' + total + '</b> 题</span><span class="divider"></span>' +
            '<span>' + e(QuizEngine.MODES[session.mode] ? QuizEngine.MODES[session.mode].label : '练习') + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="result-task-line">' + icon('info', 13) + '<span>' + e(taskLine) + '</span></div>' +
        wrongHtml +
      '</div>' +
      '<footer class="result-footer">' +
        '<div class="result-actions">' +
          '<button type="button" class="btn btn-primary btn-block" data-action="' + primaryAction + '">' + e(primaryLabel) + icon('arrowRight', 15) + '</button>' +
          '<div class="btn-row">' +
            '<button type="button" class="btn btn-outline" data-action="quiz-restart">' + icon('refresh', 14) + '再练一次</button>' +
            '<button type="button" class="btn btn-outline" data-action="close-screen">关闭</button>' +
          '</div>' +
        '</div>' +
      '</footer>' +
    '</div>';
  }

  function restartQuizSession() {
    var old = state.quiz;
    if (!old) return;
    var words = [];
    if (old.source === 'daily') {
      words = Store.getWordsForDate(old.date);
    } else {
      (old.dates || []).forEach(function (date) {
        Store.getWordsForDate(date).forEach(function (word) { words.push(word); });
      });
    }
    words = QuizEngine.prepareWords(words);
    if (!words.length) {
      toast('这些日期已经没有单词了', 'warning');
      closeScreen();
      return;
    }
    startQuizSession({
      source: old.source,
      date: old.date,
      dates: old.dates,
      words: words,
      mode: old.mode,
      count: old.count
    });
  }

  /* =========================================================
     打卡成功页
     ========================================================= */

  function doCheckIn() {
    var today = Utils.todayStr();
    var result = Store.checkIn(today);
    if (!result.ok) {
      toast(result.error || '现在还无法打卡', 'warning');
      renderPage({ preserveScroll: true });
      return;
    }
    var words = Store.getWordsForDate(today);
    renderPage({ preserveScroll: true });
    showScreen(renderCheckinSuccessHTML(result.streak, today, words.length, result.day.checkedInAt), 'success');
    launchConfetti();
  }

  function renderCheckinSuccessHTML(streak, date, wordCount, checkedAt) {
    var dateObj = Utils.parseDateStr(date);
    return '<div class="screen success-screen" role="dialog" aria-modal="true" aria-label="今日打卡成功">' +
      '<button type="button" class="success-close" data-action="close-screen" aria-label="关闭">' + icon('x', 17) + '</button>' +
      '<div class="success-inner">' +
        '<p class="success-kicker">CHECKED IN</p>' +
        '<div class="success-stamp">今日<br>已打卡<small>' + Utils.pad2(dateObj.getMonth() + 1) + '.' + Utils.pad2(dateObj.getDate()) + '</small></div>' +
        '<h2 class="success-title">今天，也留下了<br>一点进步。</h2>' +
        '<p class="success-meta">连续打卡 <b>' + streak + '</b> 天 · 今日完成 ' + wordCount + ' 个词<br>' +
          e(Utils.formatTime(checkedAt)) + ' 收下这枚印章</p>' +
        '<div class="success-actions">' +
          '<button type="button" class="btn btn-cream btn-block" data-action="close-screen">收下今天的印章</button>' +
        '</div>' +
        '<p class="success-foot">A little every day adds up.</p>' +
      '</div>' +
    '</div>';
  }

  /* =========================================================
     汇总练习选择与操作
     ========================================================= */

  function updatePracticeControlsUI() {
    var words = selectedPracticeWords();
    var questionCount = practiceQuestionCount();

    Array.prototype.forEach.call(document.querySelectorAll('[data-action="set-practice-mode"]'), function (button) {
      var active = button.getAttribute('data-mode') === state.practiceMode;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', active);
      var mark = button.querySelector('.mode-check');
      if (mark) mark.innerHTML = active ? icon('check', 10) : '';
    });

    Array.prototype.forEach.call(document.querySelectorAll('[data-action="set-practice-count"]'), function (button) {
      var active = button.getAttribute('data-count') === String(state.practiceCount);
      button.classList.toggle('is-active', active);
    });

    Array.prototype.forEach.call(document.querySelectorAll('[data-action="toggle-summary-date"]'), function (button) {
      var date = button.getAttribute('data-date');
      var selected = state.selectedDates.has(date);
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', selected);
      var box = button.querySelector('.choice-box');
      if (box) box.innerHTML = selected ? icon('check', 11) : '';
    });

    var daysNote = document.getElementById('selection-days-note');
    if (daysNote) daysNote.textContent = '已选 ' + selectedDateCount() + ' 天';
    var daysCount = document.getElementById('selected-days-count');
    if (daysCount) daysCount.textContent = selectedDateCount();
    var wordsSummary = document.getElementById('selected-words-summary');
    if (wordsSummary) {
      wordsSummary.textContent = words.length
        ? '共 ' + words.length + ' 个词 · ' + questionCount + ' 题'
        : '选出至少一天，开始汇总练习';
    }
    var startButton = document.getElementById('start-summary-btn');
    if (startButton) startButton.disabled = !words.length;
    var cta = document.querySelector('.practice-cta');
    if (cta) cta.classList.toggle('is-empty', !words.length);
  }

  function refreshDateChoiceList() {
    var list = document.getElementById('summary-date-list');
    if (!list) return;
    list.innerHTML = renderDateChoices(Store.getDateSummaries());
  }

  function toggleSummaryDate(date) {
    if (!Utils.isValidDateStr(date)) return;
    if (state.selectedDates.has(date)) state.selectedDates.delete(date);
    else state.selectedDates.add(date);
    updatePracticeControlsUI();
  }

  function selectPracticeDates(days) {
    var summaries = Store.getDateSummaries();
    var today = Utils.todayStr();
    var selected = new Set();
    summaries.forEach(function (summary) {
      var delta = Utils.diffDays(today, summary.date);
      if (delta <= 0 && delta > -(Number(days) - 1)) selected.add(summary.date);
    });
    state.selectedDates = selected;
    refreshDateChoiceList();
    updatePracticeControlsUI();
  }

  function selectAllPracticeDates() {
    state.selectedDates = new Set(Store.getDateSummaries().map(function (summary) {
      return summary.date;
    }));
    refreshDateChoiceList();
    updatePracticeControlsUI();
  }

  function clearPracticeDates() {
    state.selectedDates = new Set();
    refreshDateChoiceList();
    updatePracticeControlsUI();
  }

  function setPracticeMode(mode) {
    if (!QuizEngine.MODES[mode]) return;
    state.practiceMode = mode;
    updatePracticeControlsUI();
  }

  function setPracticeCount(value) {
    if (value !== 'all' && value !== '10' && value !== '20') return;
    state.practiceCount = value === 'all' ? 'all' : Number(value);
    updatePracticeControlsUI();
  }

  function startSummaryPractice() {
    var words = selectedPracticeWords();
    if (!words.length) {
      toast('先选择至少一天的单词');
      return;
    }
    var dates = Array.from(state.selectedDates).sort();
    startQuizSession({
      source: 'aggregate',
      dates: dates,
      words: words,
      mode: state.practiceMode,
      count: state.practiceCount
    });
  }

  /* =========================================================
     月份、数据工具与安装
     ========================================================= */

  function changeMonth(delta) {
    var parts = state.monthCursor.split('-');
    var date = new Date(Number(parts[0]), Number(parts[1]) - 1 + Number(delta), 1);
    var next = date.getFullYear() + '-' + Utils.pad2(date.getMonth() + 1);
    var currentMonth = Utils.todayStr().slice(0, 7);
    if (next > currentMonth) return;
    state.monthCursor = next;
    renderPage({ preserveScroll: true });
  }

  function exportBackup() {
    try {
      var data = Store.getExportData();
      var json = JSON.stringify(data, null, 2);
      var filename = '拾词-备份-' + Utils.todayStr().replace(/-/g, '') + '.json';
      Utils.downloadBlob(new Blob([json], { type: 'application/json;charset=utf-8' }), filename);
      toast('完整备份已导出');
    } catch (error) {
      console.error(error);
      toast('导出备份失败，请重试', 'error');
    }
  }

  async function exportExcel() {
    var words = Store.getWords();
    if (!words.length) {
      toast('词库还是空的，没有可导出的单词', 'warning');
      return;
    }
    try {
      await ensureXlsx();
      var wordRows = words
        .slice()
        .sort(function (a, b) {
          if (a.date === b.date) return String(a.createdAt).localeCompare(String(b.createdAt));
          return String(b.date).localeCompare(String(a.date));
        })
        .map(function (word) {
          return {
            '学习日期': word.date,
            '星期': Utils.weekdayCN(word.date),
            '英文': word.en,
            '中文释义': word.zh
          };
        });
      var wordSheet = window.XLSX.utils.json_to_sheet(wordRows, {
        header: ['学习日期', '星期', '英文', '中文释义']
      });
      wordSheet['!cols'] = [{ wch: 13 }, { wch: 8 }, { wch: 25 }, { wch: 36 }];

      var dayRows = Store.getDateSummaries().map(function (summary) {
        return {
          '日期': summary.date,
          '星期': Utils.weekdayCN(summary.date),
          '单词数': summary.count,
          '是否打卡': summary.checkedIn ? '是' : '否',
          '背诵完成': summary.studyDone ? '是' : '否',
          '练习完成': summary.practiceDone ? '是' : '否',
          '最佳正确率': summary.day.bestPractice ? summary.day.bestPractice.score + '%' : ''
        };
      });
      var daySheet = window.XLSX.utils.json_to_sheet(dayRows, {
        header: ['日期', '星期', '单词数', '是否打卡', '背诵完成', '练习完成', '最佳正确率']
      });
      daySheet['!cols'] = [{ wch: 13 }, { wch: 8 }, { wch: 9 }, { wch: 10 }, { wch: 11 }, { wch: 11 }, { wch: 12 }];

      var workbook = window.XLSX.utils.book_new();
      window.XLSX.utils.book_append_sheet(workbook, wordSheet, '单词库');
      window.XLSX.utils.book_append_sheet(workbook, daySheet, '打卡记录');
      window.XLSX.writeFile(workbook, '拾词-单词与打卡-' + Utils.todayStr().replace(/-/g, '') + '.xlsx', { compression: true });
      toast('Excel 已开始下载');
    } catch (error) {
      console.error(error);
      exportWordsCsvFallback(words);
    }
  }

  function exportWordsCsvFallback(words) {
    try {
      function csvCell(value) {
        var text = String(value == null ? '' : value);
        return /[",\n]/.test(text) ? '"' + text.replace(/"/g, '""') + '"' : text;
      }
      var lines = ['学习日期,星期,英文,中文释义'];
      words.forEach(function (word) {
        lines.push([word.date, Utils.weekdayCN(word.date), word.en, word.zh].map(csvCell).join(','));
      });
      Utils.downloadBlob(new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8' }), '拾词-单词表-' + Utils.todayStr().replace(/-/g, '') + '.csv');
      toast('Excel 组件加载失败，已导出 CSV 文件', 'warning');
    } catch (error) {
      toast('导出失败，请重试', 'error');
    }
  }

  function restoreBackupFromFile(file) {
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      var parsed;
      try {
        parsed = JSON.parse(String(reader.result || ''));
      } catch (error) {
        toast('备份文件不是有效的 JSON', 'error');
        return;
      }
      var candidate = parsed && parsed.data && Array.isArray(parsed.data.words) ? parsed.data : parsed;
      if (!candidate || !Array.isArray(candidate.words)) {
        toast('备份中没有找到单词数据', 'error');
        return;
      }
      openConfirm({
        title: '恢复这份备份？',
        message: '备份中有 ' + candidate.words.length + ' 个单词。恢复后会覆盖当前的全部单词、练习和打卡记录，且无法撤销。',
        confirmLabel: '覆盖并恢复',
        danger: true,
        onConfirm: function () {
          var result = Store.replaceFromBackup(parsed);
          if (!result.ok) {
            toast(result.error || '恢复失败', 'error');
            return;
          }
          state.selectedDates = new Set();
          state.wordSearch = '';
          state.collapsedDates = Object.create(null);
          state.monthCursor = Utils.todayStr().slice(0, 7);
          state.practiceMode = 'en2zh';
          state.practiceCount = 'all';
          goToPage('me');
          toast('备份已恢复：' + result.words + ' 个单词、' + result.days + ' 天记录');
        }
      });
    };
    reader.onerror = function () {
      toast('读取备份文件失败', 'error');
    };
    reader.readAsText(file, 'utf-8');
  }

  function chooseBackupFile() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.style.display = 'none';
    document.body.appendChild(input);
    input.addEventListener('change', function () {
      var file = input.files && input.files[0];
      document.body.removeChild(input);
      if (file) restoreBackupFromFile(file);
    });
    input.click();
  }

  function clearAllData() {
    openConfirm({
      title: '清空全部数据？',
      message: '所有单词、背诵进度、练习记录与打卡记录都会被删除，且无法恢复。建议先导出一份完整备份。',
      confirmLabel: '永久清空',
      danger: true,
      onConfirm: function () {
        Store.clearAll();
        state.selectedDates = new Set();
        state.wordSearch = '';
        state.collapsedDates = Object.create(null);
        state.monthCursor = Utils.todayStr().slice(0, 7);
        hideScreen();
        goToPage('today');
        toast('已清空全部数据');
      }
    });
  }

  function showHelp() {
    showScreen(renderHelpScreenHTML(), 'help');
  }

  function ensureXlsx() {
    if (window.XLSX) return Promise.resolve(window.XLSX);
    if (xlsxPromise) return xlsxPromise;
    xlsxPromise = new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = 'vendor/xlsx.full.min.js';
      script.async = true;
      script.onload = function () {
        if (window.XLSX) resolve(window.XLSX);
        else {
          xlsxPromise = null;
          reject(new Error('Excel 组件未能初始化'));
        }
      };
      script.onerror = function () {
        xlsxPromise = null;
        reject(new Error('Excel 组件加载失败'));
      };
      document.head.appendChild(script);
    });
    return xlsxPromise;
  }

  function setupPWA() {
    window.addEventListener('beforeinstallprompt', function (event) {
      event.preventDefault();
      state.deferredInstallPrompt = event;
    });
    window.addEventListener('appinstalled', function () {
      state.deferredInstallPrompt = null;
      toast('拾词已添加到桌面');
      if (state.page === 'me') renderPage({ preserveScroll: true });
    });
    if ('serviceWorker' in navigator &&
      (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
      var register = function () {
        navigator.serviceWorker.register('sw.js').catch(function (error) {
          console.warn('Service Worker 注册失败', error);
        });
      };
      if (document.readyState === 'complete') register();
      else window.addEventListener('load', register);
    }
  }

  /* =========================================================
     事件绑定与动作分发
     ========================================================= */

  function bindEvents() {
    document.addEventListener('click', onDocumentClick);
    document.addEventListener('input', onDocumentInput);
    document.addEventListener('change', onDocumentChange);
    document.addEventListener('submit', onDocumentSubmit);
    document.addEventListener('keydown', onDocumentKeydown);
    window.addEventListener('hashchange', onHashChange);
  }

  function onDocumentClick(event) {
    var target = event.target.closest('[data-action]');
    if (!target) return;
    var action = target.getAttribute('data-action');
    handleAction(action, target, event);
  }

  function handleAction(action, target) {
    switch (action) {
      case 'reload-app':
        location.reload();
        return;
      case 'go-me':
        goToPage('me');
        return;
      case 'open-entry':
        openEntry(target.getAttribute('data-tab'), target.getAttribute('data-date'));
        return;
      case 'entry-tab':
        if (!state.entry) return;
        state.entry.tab = target.getAttribute('data-tab') || 'paste';
        state.entry.message = '';
        state.entry.messageType = '';
        renderEntryScreenPreserveScroll();
        return;
      case 'submit-paste':
        submitPasteEntry();
        return;
      case 'choose-excel':
        pickExcelFile();
        return;
      case 'download-template':
        downloadExcelTemplate();
        return;
      case 'submit-excel':
        submitExcelImport();
        return;
      case 'open-edit':
        openEditWord(target.getAttribute('data-id'));
        return;
      case 'delete-word':
        deleteCurrentWord(target.getAttribute('data-id'));
        return;
      case 'toggle-group':
        toggleLibraryGroup(target.getAttribute('data-date'));
        return;
      case 'speak':
        Utils.speakEnglish(target.getAttribute('data-text') || '');
        return;
      case 'start-study':
        startStudySession();
        return;
      case 'open-daily-practice':
        openDailyPracticeSetup();
        return;
      case 'check-in':
        doCheckIn();
        return;
      case 'toggle-summary-date':
        toggleSummaryDate(target.getAttribute('data-date'));
        return;
      case 'select-recent':
        selectPracticeDates(Number(target.getAttribute('data-days')) || 3);
        return;
      case 'select-all-dates':
        selectAllPracticeDates();
        return;
      case 'clear-selected-dates':
        clearPracticeDates();
        return;
      case 'set-practice-mode':
        setPracticeMode(target.getAttribute('data-mode'));
        return;
      case 'set-practice-count':
        setPracticeCount(target.getAttribute('data-count'));
        return;
      case 'start-summary':
        startSummaryPractice();
        return;
      case 'set-daily-mode':
        if (!state.dailySetup) return;
        if (QuizEngine.MODES[target.getAttribute('data-mode')]) {
          state.dailySetup.mode = target.getAttribute('data-mode');
          refreshDailySetupUI();
        }
        return;
      case 'set-daily-count':
        if (!state.dailySetup) return;
        state.dailySetup.count = normalizeDailyCount(target.getAttribute('data-count'), state.dailySetup.words.length);
        refreshDailySetupUI();
        return;
      case 'start-daily-quiz':
        startDailyQuiz();
        return;
      case 'request-close-screen':
        requestCloseScreen();
        return;
      case 'close-screen':
        closeScreen();
        return;
      case 'study-reveal':
        revealStudyWord();
        return;
      case 'study-grade':
        gradeStudyWord(target.getAttribute('data-known') === '1');
        return;
      case 'study-speak':
        if (state.study) {
          var current = studyCurrentWord();
          if (current) Utils.speakEnglish(current.en);
        }
        return;
      case 'study-again':
        startStudySession();
        return;
      case 'study-to-practice':
        closeScreen();
        openDailyPracticeSetup();
        return;
      case 'study-to-home':
        hideScreen();
        goToPage('today');
        return;
      case 'quiz-option':
        chooseQuizOption(target.getAttribute('data-index'));
        return;
      case 'quiz-next':
        nextQuizQuestion();
        return;
      case 'quiz-speak':
        if (state.quiz) {
          var quizQuestion = currentQuizQuestion();
          if (quizQuestion) Utils.speakEnglish(quizQuestion.word.en);
        }
        return;
      case 'quiz-restart':
        restartQuizSession();
        return;
      case 'quiz-to-study':
        hideScreen();
        goToPage('today');
        startStudySession();
        return;
      case 'quiz-to-today':
        hideScreen();
        goToPage('today');
        return;
      case 'change-month':
        changeMonth(Number(target.getAttribute('data-delta')) || 0);
        return;
      case 'export-backup':
        exportBackup();
        return;
      case 'export-excel':
        exportExcel();
        return;
      case 'restore-backup':
        chooseBackupFile();
        return;
      case 'open-help':
        showHelp();
        return;
      case 'clear-data':
        clearAllData();
        return;
      case 'install-app':
        handleInstall();
        return;
      case 'confirm-cancel':
        closeConfirm();
        return;
      case 'confirm-accept':
        acceptConfirm();
        return;
      default:
        return;
    }
  }

  function toggleLibraryGroup(date) {
    if (!date) return;
    if (state.collapsedDates[date]) delete state.collapsedDates[date];
    else state.collapsedDates[date] = true;
    var content = document.getElementById('library-content');
    if (content) content.innerHTML = renderLibraryGroups();
  }

  function onDocumentInput(event) {
    var target = event.target;
    if (target.id === 'word-search') {
      state.wordSearch = target.value;
      var content = document.getElementById('library-content');
      if (content) content.innerHTML = renderLibraryGroups();
      return;
    }
    var role = target.getAttribute('data-role');
    if (role === 'paste-input' && state.entry) {
      state.entry.text = target.value;
      refreshPasteUI();
    }
  }

  function onDocumentChange(event) {
    var target = event.target;
    var role = target.getAttribute('data-role');
    if (!role || !state.entry) return;

    if (role === 'paste-date') {
      var pastedDate = Utils.isValidDateStr(target.value) ? target.value : Utils.todayStr();
      state.entry.date = pastedDate;
      if (target.value !== pastedDate) target.value = pastedDate;
      refreshPasteUI();
      return;
    }

    if (role === 'excel-date') {
      var excelDate = Utils.isValidDateStr(target.value) ? target.value : Utils.todayStr();
      state.entry.date = excelDate;
      if (target.value !== excelDate) target.value = excelDate;
      renderEntryScreenPreserveScroll();
      return;
    }

    if (role === 'excel-sheet') {
      changeExcelSheet(Number(target.value));
      return;
    }

    if (role === 'excel-map-en' || role === 'excel-map-zh' || role === 'excel-map-date') {
      if (!state.entry.excel) return;
      var key = role === 'excel-map-en' ? 'en' : (role === 'excel-map-zh' ? 'zh' : 'date');
      var value = Number(target.value);
      state.entry.excel.mapping[key] = isFinite(value) ? value : -1;
      if (state.entry.excel.mapping.zh === state.entry.excel.mapping.en) {
        state.entry.excel.mapping.zh = -1;
      }
      if (state.entry.excel.mapping.date === state.entry.excel.mapping.en ||
        state.entry.excel.mapping.date === state.entry.excel.mapping.zh) {
        state.entry.excel.mapping.date = -1;
      }
      renderEntryScreenPreserveScroll();
    }
  }

  function onDocumentSubmit(event) {
    var form = event.target;
    if (form.id === 'manual-form') {
      event.preventDefault();
      submitManualEntry(form);
      return;
    }
    if (form.id === 'edit-form') {
      event.preventDefault();
      submitEditWord(form);
      return;
    }
    if (form.id === 'spell-form') {
      event.preventDefault();
      submitSpellAnswer();
    }
  }

  function onDocumentKeydown(event) {
    if (event.key !== 'Escape') return;
    if (state.confirm) {
      closeConfirm();
      event.preventDefault();
      return;
    }
    if (state.screenType) {
      requestCloseScreen();
      event.preventDefault();
    }
  }

  /* =========================================================
     启动
     ========================================================= */

  init();
})();
