# AGENTS.md — 學校工作助理

## 專案概述
Google Apps Script 教育工具組，目前含英文單字配對遊戲。

## 部署帳號
**學校 Google Workspace 帳號**（非個人 Gmail）。所有 Gmail、Calendar、Drive 讀寫都對學校網域。

## 工作約定
- 本專案用 clasp 做版本控制與部署
- 程式碼一律繁體中文註解（若有）
- 不把學校信箱內容或個資推到公開 repo

---

## 每日開工流程

當我說「開工」時，依序執行：

### 1. 尋找今日彙報檔
依序檢查以下路徑（找到就停）：
- `G:\我的雲端硬碟\每日彙報_YYYY-MM-DD.md`
- `每日彙報_YYYY-MM-DD.md`
- `G:\我的雲端硬碟\<學校Drive目錄>\每日彙報_YYYY-MM-DD.md`

> YYYY-MM-DD 替換為今天的日期（例如 `每日彙報_2026-07-28.md`）

### 2. 若找到彙報檔
讀取內容後，用以下格式回報：

```
📅 今日：<日期>（星期X）

📌 今日行程：
   - HH:MM ~ HH:MM  <活動標題>
   ...

📩 今日信件（共 N 封）：
   - <主旨> — <寄件人>
   ...

🗓 未來 7 天重要事項：
   - MM/DD（週X）HH:MM  <活動標題>
   ...

✅ 建議優先處理：
   1. <根據今日行程整理出該做的事>
   2. ...
```

### 3. 若找不到彙報檔
提醒：「今天還沒有彙報檔。可能原因：學校帳號的觸發器還沒跑、或 Drive 尚未同步。要不要直接開 Web App 看？」

並提供 Web App 網址（需手動設定下方變數）。

---

## 設定變數

| 變數 | 說明 | 目前值 |
|------|------|--------|
| `WEB_APP_URL` | Apps Script 部署後的網址 | `https://script.google.com/macros/s/AKfycbyCuiAG93D_04CwS4sGBovC4CVtp3dREi5X2Rn6zqgNa10z3hjAwsO6s8OmRG8nFPql/exec` |
| `BRIEFING_PATH` | 每日彙報檔的本地同步路徑 | `G:\我的雲端硬碟\每日彙報_*.md` |
| `SCHOOL_DRIVE_PATH` | 學校帳號 Drive 在本機的同步根目錄（若與個人分開） | *待填* |
