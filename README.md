# n8n 工作流程自動化平台

n8n 是一個強大的工作流程自動化平台，可以幫助您自動化各種任務和流程。本專案使用 Docker 來部署 n8n。

## 系統需求

- Docker
- Docker Compose

## 快速開始

1. 啟動服務：
```bash
docker-compose up -d
```

2. 停止服務：
```bash
docker-compose stop
```

3. 查看日誌：
```bash
docker-compose logs -f
```

## 訪問 n8n

啟動後，您可以通過以下地址訪問 n8n：
- Web 界面：`http://localhost:5678`

## 注意事項

- 首次訪問時，您需要創建一個管理員帳戶
- 請確保您的系統有足夠的資源運行 Docker 容器
- 建議定期備份您的工作流程

## 故障排除

如果遇到問題，您可以：

1. 檢查容器狀態：
```bash
docker-compose ps
```

2. 重啟服務：
```bash
docker-compose restart
```

3. 完全重置（注意：這將刪除所有數據）：
```bash
docker-compose down -v
docker-compose up -d
```