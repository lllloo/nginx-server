const express = require('express')
const puppeteer = require('puppeteer')

const app = express()
const port = process.env.PORT || 3000



app.get('/trending', async (req, res) => {
  try {
    const url = 'https://trends.google.com.tw/trending?geo=TW&hl=zh-TW&hours=4'
    // 啟動瀏覽器
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ],
    })

    // 建立新頁面
    const page = await browser.newPage()

    // 設定頁面視窗大小
    await page.setViewport({ width: 1280, height: 800 })

    // 前往目標網站
    await page.goto(url, {
      waitUntil: 'networkidle2',
    })
    // 取得table
    const table = await page.$('table')
    const tableHtml = await page.evaluate(table => table.outerHTML, table)

    // 關閉瀏覽器
    await browser.close()
    // 回傳結果
    res.json({
      status: 'success',
      content: tableHtml,
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: '伺服器內部錯誤，請稍後再試。',
    })
  }
})

app.get('/', (req, res) => {
  res.send('伺服器運作中。')
})

app.listen(port, () => {
  console.log(`伺服器已啟動，監聽 port 號 ${port}`)
})
