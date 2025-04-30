# n8n 於子目錄部署並啟用 SSL

本專案協助您在子目錄中部署 n8n 並啟用 SSL 加密。

## 準備工作

在開始之前，請確保：

1. 已安裝 Docker 和 Docker Compose

## 使用說明

### 啟動服務

在當前資料夾中執行以下命令來啟動 n8n：

```bash
docker-compose up -d
```

### 停止服務

執行以下命令來停止服務：

```bash
docker-compose stop
```

### SSL 憑證設定

若要申請或更新 SSL 憑證，請執行以下命令（需替換郵箱和網域）：

```bash
docker-compose run certbot certonly --webroot \
  -w /var/www/certbot \
  --force-renewal \
  --email your-email@example.com \
  -d your-domain.com \
  --agree-tos
```

## 故障排除

如果遇到問題，可檢查 Docker 容器日誌：

```bash
docker-compose logs
```

## 注意事項

- 請確保您的防火牆允許 80 和 443 端口的流量
- 定期更新您的 SSL 憑證（通常為 90 天）
