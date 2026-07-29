# 交接檔（handoff.md）

> 任何 Agent、任何電腦接手前**必讀**；收工時**必更新**。本檔只放交接必需的精簡資訊，詳細脈絡放 Obsidian（若有 L3）。

## ⏯️ 目前做到哪
專案初始化完成：建立 `.gitignore`＋`handoff.md`，清除子目錄內獨立 `.git`，初始化 git 並推送至 GitHub 私有 repo `pamela902/school-work-assistant`。

## 🚦 目前狀態
- GAS 程式可透過 clasp 部署，Web App 網址已設定
- 每日彙報觸發器由學校帳號端管理，今日（07/29）尚未產生彙報檔
- Git 版本控制已就緒，GitHub 私有 repo 已推送
- 子目錄 `classroom-tools/`、`month-game/`、`wordcloud-live/` 原各有獨立 `.git`，已清除

## ➡️ 下一步
1. 確認每日彙報觸發器是否正常運作（今日尚無彙報檔）
2. 可先開 Web App 看今日行程與信件
3. 視需要對 GAS 程式做功能修改或新增

## ⚠️ 注意事項
- 部署帳號為學校 Google Workspace，非個人 Gmail
- 不將學校信箱內容或個資推到公開 repo
- `clasp push` 前確認 rootDir 設定正確
- `wordcloud-live/` 目前為空目錄，git 未追蹤

## 🕐 最後更新
- 時間：2026-07-29
- 更新者：OpenCode @ LAPTOP-O61QD0U3
- Git push：✅ 已推（https://github.com/pamela902/school-work-assistant）
