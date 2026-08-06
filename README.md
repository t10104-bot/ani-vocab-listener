# Dani's English｜單字聽讀

手機與電腦皆可使用的英文單字分組朗讀網站。第一版內含第 4151–4200 號單字。

## 使用者功能

- 自選播放數量與起始編號
- 英文單字、中文解釋與補充資訊依序朗讀
- 單字重聽、從目前單字播到組末、下一組
- 速度、音高、語音、英文後停頓可調整

## 連接 Supabase

1. 建立 Supabase 專案，於 SQL Editor 執行 `supabase/schema.sql`。
2. 將 `.env.example` 複製為 `.env.local`，填上 Project URL 與 anon key。
3. 匯入單字資料後，將網站中的示範資料來源替換成 Supabase 查詢。

請勿把 `service_role` key 放入前端環境變數；日後產生 MP3 時，應只在 Netlify Function 內使用私密金鑰。

## 部署 Netlify

將此資料夾推到 GitHub 後，在 Netlify 新增網站並連接儲存庫。於網站的 Environment variables 設定與 `.env.example` 相同的公開變數；私密 API key 僅設定給 Functions 使用。
