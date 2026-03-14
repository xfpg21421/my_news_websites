# 英国主流媒体新闻聚合网站

一个简洁、现代化的新闻聚合网站，实时聚合英国主流媒体的头版新闻。

## 特性

- 📰 聚合英国5大主流媒体新闻源
  - BBC News
  - The Guardian (卫报)
  - The Telegraph (电讯报)
  - The Independent (独立报)
  - Sky News

- ⚡ 实时更新 - 每5分钟自动刷新
- 🎯 智能筛选 - 可按媒体来源过滤
- 📱 响应式设计 - 完美适配手机、平板和桌面
- 🚀 纯前端 - 无需后端服务器
- 🎨 现代化UI - 简洁美观的界面设计

## 技术栈

- HTML5
- CSS3 (Grid布局、Flexbox、动画)
- 原生JavaScript (ES6+)
- RSS2JSON API (用于解决跨域问题)

## 快速开始

### 方法1: 直接打开

直接用浏览器打开 `index.html` 文件即可使用。

### 方法2: 本地服务器

使用任意HTTP服务器运行：

```bash
# 使用Python 3
python -m http.server 8000

# 或使用Python 2
python -m SimpleHTTPServer 8000

# 或使用Node.js的http-server
npx http-server
```

然后访问 `http://localhost:8000`

## 部署

### 部署到GitHub Pages

1. 将代码推送到GitHub仓库
2. 进入仓库的Settings > Pages
3. 在Source中选择main分支
4. 保存后等待几分钟即可通过提供的URL访问

### 部署到其他平台

本项目为纯静态网站，可部署到任何静态网站托管平台：

- Vercel
- Netlify
- Cloudflare Pages
- GitLab Pages
- 阿里云OSS
- 腾讯云COS

## 项目结构

```
my_news_websites/
├── index.html          # 主页面
├── css/
│   └── style.css       # 样式文件
├── js/
│   └── app.js          # 核心逻辑
└── README.md           # 项目说明
```

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge
- 其他现代浏览器

## 注意事项

1. 本项目使用RSS2JSON API服务来解决RSS跨域问题
2. 免费版API有请求限制，如需大量使用建议注册API密钥
3. 新闻内容版权归各媒体所有
4. 仅用于学习和个人使用

## 自定义

### 添加新的新闻源

在 `js/app.js` 中的 `NEWS_SOURCES` 对象添加新源：

```javascript
const NEWS_SOURCES = {
    // 现有源...
    newSource: {
        name: '新闻源名称',
        rss: 'RSS地址',
        class: 'newSource'
    }
};
```

同时在 `css/style.css` 中添加对应的样式：

```css
.news-source.newSource {
    background: #f0f0f0;
    color: #333333;
}
```

### 修改刷新间隔

在 `js/app.js` 底部修改：

```javascript
// 将5分钟改为其他时间（单位：毫秒）
setInterval(async () => {
    // ...
}, 5 * 60 * 1000);  // 5分钟
```

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request！
