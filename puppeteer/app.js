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
    const table = await page.$$eval(
      'table tbody:last-of-type tr td:nth-child(2)',
      (tds) => {
        return tds.map((option) => `<div>${option.innerHTML}</div>`)
      },
    )

    const tableList = table
      .map((item) => {
        // 移除 div 上面的所有屬性 移除 <i> 標籤
        return item.replace(/<div.*?>/g, '<div>').replace(/<i.*?>.*?<\/i>/g, '')
      })
      .map((item) => {
        const tableDOM = parseDivHtml(item)
        return {
          // 標題
          title: tableDOM[0],
          // 搜尋數量
          searchCount: tableDOM[1][0][0],
          // 相關時間
          time: `${tableDOM[1][2][1]}(${tableDOM[1][1]})`,
        }
      })

    // 關閉瀏覽器
    await browser.close()
    // 回傳結果
    res.json({
      status: 'success',
      content: tableList,
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

function parseDivHtml(html) {
  const regex = /<\/?div>/g
  let lastIndex = 0
  let match
  const root = []
  const stack = [root]

  while ((match = regex.exec(html)) !== null) {
    const isClosing = match[0] === '</div>'
    const text = html.slice(lastIndex, match.index).trim()
    if (text) {
      stack[stack.length - 1].push(text)
    }
    if (isClosing) {
      const completedArray = stack.pop()
      // 如果陣列只有一個子元素，則扁平化
      if (completedArray.length === 1) {
        const parentArray = stack[stack.length - 1]
        parentArray[parentArray.length - 1] = completedArray[0]
      }
    } else {
      const newArray = []
      stack[stack.length - 1].push(newArray)
      stack.push(newArray)
    }
    lastIndex = regex.lastIndex
  }

  return root.length === 1 ? root[0] : root // 移除最外層多餘的包裹
}
