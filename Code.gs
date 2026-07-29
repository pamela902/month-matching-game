function doGet(e) {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('英文單字配對遊戲')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
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
