function doGet(e) {
  var page = e && e.parameter && e.parameter.page;
  var api = e && e.parameter && e.parameter.api;

  // JSON API 端點（不需登入）
  if (api === 'emails') {
    var max = parseInt(e.parameter.max) || 10;
    return ContentService.createTextOutput(JSON.stringify(getRecentEmails(max)))
      .setMimeType(ContentService.MimeType.JSON);
  }
  if (api === 'events') {
    var days = parseInt(e.parameter.days) || 7;
    var now = new Date();
    var end = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    return ContentService.createTextOutput(JSON.stringify(fetchEvents(now, end)))
      .setMimeType(ContentService.MimeType.JSON);
  }
  if (api === 'briefing') {
    var content = createDailyBriefing();
    return ContentService.createTextOutput(content)
      .setMimeType(ContentService.MimeType.TEXT);
  }

  if (page === 'email') {
    return HtmlService.createTemplateFromFile('EmailCalendar')
      .evaluate()
      .setTitle('Email 與行事曆')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  }
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('英文單字配對遊戲')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function getRecentEmails(max) {
  max = max || 10;
  var threads = GmailApp.getInboxThreads(0, max);
  var emails = [];
  for (var i = 0; i < threads.length; i++) {
    var msgs = threads[i].getMessages();
    var lastMsg = msgs[msgs.length - 1];
    emails.push({
      subject: lastMsg.getSubject(),
      from: lastMsg.getFrom(),
      date: lastMsg.getDate().toISOString()
    });
  }
  return emails;
}

function getUpcomingEvents(max) {
  max = max || 10;
  var now = new Date();
  var end = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  var result = [];
  try {
    var cal = CalendarApp.getDefaultCalendar();
    var events = cal.getEvents(now, end, {max: max});
    for (var i = 0; i < events.length; i++) {
      var e = events[i];
      result.push({
        title: e.getTitle(),
        start: e.getStartTime().toISOString(),
        end: e.getEndTime().toISOString(),
        location: e.getLocation(),
        description: e.getDescription()
      });
    }
  } catch(err) {
    try {
      var cals = CalendarApp.getAllCalendars();
      for (var c = 0; c < cals.length; c++) {
        var evs = cals[c].getEvents(now, end, {max: max});
        for (var j = 0; j < evs.length; j++) {
          var ev = evs[j];
          result.push({
            title: '[' + cals[c].getName() + '] ' + ev.getTitle(),
            start: ev.getStartTime().toISOString(),
            end: ev.getEndTime().toISOString(),
            location: ev.getLocation(),
            description: ev.getDescription()
          });
        }
      }
    } catch(e2) {
      return [];
    }
  }
  return result;
}

var BRIEFING_FOLDER_ID = ''; // 留空=存到 Drive 根目錄；可填入資料夾 ID

function createDailyBriefing() {
  var today = new Date();
  var dateStr = Utilities.formatDate(today, 'Asia/Taipei', 'yyyy-MM-dd');
  var dayNames = ['日','一','二','三','四','五','六'];
  var dayStr = dayNames[today.getDay()];

  var lines = [];
  lines.push('# 每日彙報 — ' + dateStr + '（星期' + dayStr + '）');
  lines.push('');
  lines.push('> 自動產生於 ' + Utilities.formatDate(today, 'Asia/Taipei', 'yyyy-MM-dd HH:mm'));
  lines.push('');

  // --- 今日行事曆 ---
  lines.push('## 今日行事曆');
  lines.push('');
  var now = new Date();
  var endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
  var events = fetchEvents(now, endOfDay);
  if (events.length === 0) {
    lines.push('沒有活動');
  } else {
    for (var i = 0; i < events.length; i++) {
      var e = events[i];
      var startTime = Utilities.formatDate(new Date(e.start), 'Asia/Taipei', 'HH:mm');
      var endTime = Utilities.formatDate(new Date(e.end), 'Asia/Taipei', 'HH:mm');
      lines.push('- **' + startTime + ' ~ ' + endTime + '**  ' + e.title);
      if (e.location) lines.push('  地點：' + e.location);
      if (e.description) lines.push('  ' + e.description);
    }
  }
  lines.push('');

  // --- 未來 7 天行事曆 ---
  lines.push('## 未來 7 天行事曆');
  lines.push('');
  var weekEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  var weekEvents = fetchEvents(now, weekEnd);
  if (weekEvents.length === 0) {
    lines.push('沒有活動');
  } else {
    for (var i = 0; i < weekEvents.length; i++) {
      var we = weekEvents[i];
      var weDate = Utilities.formatDate(new Date(we.start), 'Asia/Taipei', 'MM/dd（E）');
      var weStart = Utilities.formatDate(new Date(we.start), 'Asia/Taipei', 'HH:mm');
      if (!we.isAllDay) {
        var weEnd = Utilities.formatDate(new Date(we.end), 'Asia/Taipei', 'HH:mm');
        lines.push('- **' + weDate + ' ' + weStart + '~' + weEnd + '**  ' + we.title);
      } else {
        lines.push('- **' + weDate + ' 全天**  ' + we.title);
      }
    }
  }
  lines.push('');

  // --- 近期 Email ---
  lines.push('## 近期 Email');
  lines.push('');
  var emails = getTodayEmails();
  if (emails.length === 0) {
    lines.push('今天沒有新信件');
  } else {
    for (var i = 0; i < emails.length; i++) {
      var em = emails[i];
      lines.push('- **' + em.subject + '**');
      lines.push('  寄件人：' + em.from);
      lines.push('  時間：' + Utilities.formatDate(new Date(em.date), 'Asia/Taipei', 'MM/dd HH:mm'));
    }
  }
  lines.push('');

  var content = lines.join('\n');

  // 存到 Google Drive
  var folder;
  if (BRIEFING_FOLDER_ID) {
    folder = DriveApp.getFolderById(BRIEFING_FOLDER_ID);
    folder.createFile('每日彙報_' + dateStr + '.md', content, MimeType.PLAIN_TEXT);
  } else {
    DriveApp.createFile('每日彙報_' + dateStr + '.md', content, MimeType.PLAIN_TEXT);
  }

  Logger.log('彙報已產生：' + dateStr);
  return content;
}

function fetchEvents(start, end) {
  var result = [];
  try {
    var cal = CalendarApp.getDefaultCalendar();
    var events = cal.getEvents(start, end);
    for (var i = 0; i < events.length; i++) {
      var e = events[i];
      result.push({
        title: e.getTitle(),
        start: e.getStartTime().toISOString(),
        end: e.getEndTime().toISOString(),
        location: e.getLocation(),
        description: e.getDescription(),
        isAllDay: e.isAllDayEvent()
      });
    }
  } catch(err) {
    Logger.log('讀取行事曆失敗：' + err);
  }
  return result;
}

function getTodayEmails() {
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var threads = GmailApp.search('newer_than:1d', 0, 20);
  var emails = [];
  for (var i = 0; i < threads.length; i++) {
    var msgs = threads[i].getMessages();
    var lastMsg = msgs[msgs.length - 1];
    emails.push({
      subject: lastMsg.getSubject(),
      from: lastMsg.getFrom(),
      date: lastMsg.getDate().toISOString()
    });
  }
  return emails;
}

var ALL_WORDS = [
  {en: "apple", zh: "蘋果"},
  {en: "book", zh: "書"},
  {en: "cat", zh: "貓"},
  {en: "dog", zh: "狗"},
  {en: "eat", zh: "吃"},
  {en: "fish", zh: "魚"},
  {en: "good", zh: "好"},
  {en: "happy", zh: "快樂"},
  {en: "ice", zh: "冰"},
  {en: "juice", zh: "果汁"},
  {en: "king", zh: "國王"},
  {en: "love", zh: "愛"},
  {en: "milk", zh: "牛奶"},
  {en: "name", zh: "名字"},
  {en: "open", zh: "打開"},
  {en: "pen", zh: "筆"},
  {en: "queen", zh: "皇后"},
  {en: "rain", zh: "雨"},
  {en: "sun", zh: "太陽"},
  {en: "tree", zh: "樹"},
  {en: "water", zh: "水"},
  {en: "red", zh: "紅色"},
  {en: "baby", zh: "嬰兒"},
  {en: "cake", zh: "蛋糕"},
  {en: "dance", zh: "跳舞"},
  {en: "egg", zh: "蛋"},
  {en: "family", zh: "家庭"},
  {en: "garden", zh: "花園"},
  {en: "hat", zh: "帽子"},
  {en: "jump", zh: "跳"},
  {en: "kitchen", zh: "廚房"},
  {en: "lamp", zh: "燈"},
  {en: "moon", zh: "月亮"},
  {en: "night", zh: "夜晚"},
  {en: "orange", zh: "橘子"},
  {en: "pencil", zh: "鉛筆"},
  {en: "rabbit", zh: "兔子"},
  {en: "school", zh: "學校"},
  {en: "table", zh: "桌子"},
  {en: "window", zh: "窗戶"},
  {en: "bird", zh: "鳥"},
  {en: "chair", zh: "椅子"},
  {en: "door", zh: "門"},
  {en: "ear", zh: "耳朵"},
  {en: "flower", zh: "花"},
  {en: "girl", zh: "女孩"},
  {en: "house", zh: "房子"},
  {en: "mountain", zh: "山"},
  {en: "river", zh: "河流"},
  {en: "star", zh: "星星"}
];

function getWords() {
  var pool = [];
  for (var i = 0; i < ALL_WORDS.length; i++) {
    pool.push({en: ALL_WORDS[i].en, zh: ALL_WORDS[i].zh});
  }
  for (var i = pool.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = pool[i];
    pool[i] = pool[j];
    pool[j] = tmp;
  }
  return pool.slice(0, 10);
}

function saveScore(data) {
  var ss;
  try {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  } catch(e) {
    ss = SpreadsheetApp.openById('1ZTu5ZPoFno285aZRQnFxGBSZuEtYTTG1rmaZv_kYVsk');
  }
  var sheet = ss.getSheets()[0];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['時間', '班級', '座號', '分數', '完成秒數', '完成時間']);
  }
  sheet.appendRow([
    new Date(),
    data.className,
    data.seatNumber,
    data.score,
    data.timeSeconds,
    data.timeText
  ]);
  return true;
}
