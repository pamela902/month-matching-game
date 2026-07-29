# 交接檔（handoff.md）

> 任何 Agent、任何電腦接手前**必讀**；收工時**必更新**。本檔只放交接必需的精簡資訊，詳細脈絡放 Obsidian（若有 L3）。

## ⏯️ 目前做到哪
handoff.md 建立完成，專案已有 Google Apps Script 教育工具組（單字配對遊戲、Email/行事曆檢視、每日自動彙報），透過 clasp 部署至學校 Workspace 帳號。

## 🚦 目前狀態
- GAS 程式可透過 clasp 部署，Web App 網址已設定
- 每日彙報觸發器由學校帳號端管理
- 本機尚無 git 版本控制（本 session 初始化完成）

## ➡️ 下一步
1. 確認每日彙報觸發器正常運作
2. 檢查今日彙報檔是否產生

## ⚠️ 注意事項
- 部署帳號為學校 Google Workspace，非個人 Gmail
- 不將學校信箱內容或個資推到公開 repo
- `clasp push` 前確認 rootDir 設定正確

## 🕐 最後更新
- 時間：2026-07-29
- 更新者：OpenCode @ LAPTOP-O61QD0U3
- Git push：❌ 未推（初始化中）
