# UK News Aggregator

A clean, modern news aggregation website that provides real-time headlines from the UK's leading news sources.

## Features

- 📰 **5 Major UK News Sources**
  - BBC News
  - The Guardian
  - The Telegraph
  - The Independent
  - Sky News

- ⚡ **Automatic Updates**
  - Auto-refresh every 5 minutes (configurable)
  - Manual refresh button with visual feedback
  - Real-time "last updated" timestamp

- 🎯 **Smart Filtering** - Filter news by source
- 📱 **Responsive Design** - Perfect on mobile, tablet and desktop
- 🚀 **Frontend Only** - No backend server required
- 🎨 **Modern UI** - Clean and beautiful interface
- ⚙️ **Easy Configuration** - Customize update frequency and behavior

## Tech Stack

- HTML5
- CSS3 (Grid layout, Flexbox, animations)
- Vanilla JavaScript (ES6+)
- RSS2JSON API (for CORS handling)

## Quick Start

### Method 1: Direct Open

Simply open `index.html` in your browser.

### Method 2: Local Server

Use any HTTP server:

```bash
# Using Python 3
python -m http.server 8000

# Or Python 2
python -m SimpleHTTPServer 8000

# Or Node.js http-server
npx http-server
```

Then visit `http://localhost:8000`

## How News Updates Work

### 🔄 Automatic Updates

The website automatically refreshes news **every 5 minutes** by default. News is fetched live from RSS feeds, ensuring you always see the latest stories.

### 🖱️ Manual Refresh

Click the green **"Refresh"** button in the navigation bar to manually update news at any time. The refresh icon will spin during the update.

### ⚙️ Customizing Update Frequency

Edit `js/config.js` to customize the update behavior:

```javascript
const CONFIG = {
    // Change auto-refresh interval (in minutes)
    AUTO_REFRESH_INTERVAL: 5,  // Default: 5 minutes

    // Set to 0 to disable auto-refresh
    // AUTO_REFRESH_INTERVAL: 0,

    // Change maximum articles per source
    MAX_ARTICLES_PER_SOURCE: 10,  // Default: 10

    // Change description preview length
    DESCRIPTION_LENGTH: 150,  // Default: 150 characters

    // Enable debug logging
    DEBUG_MODE: false  // Set to true for console logs
};
```

**Common configurations:**

- **More frequent updates**: `AUTO_REFRESH_INTERVAL: 1` (every minute)
- **Less frequent updates**: `AUTO_REFRESH_INTERVAL: 15` (every 15 minutes)
- **Manual only**: `AUTO_REFRESH_INTERVAL: 0` (disable auto-refresh)
- **More articles**: `MAX_ARTICLES_PER_SOURCE: 20` (20 articles per source)

## Deployment

### Deploy to GitHub Pages

1. Push code to GitHub repository
2. Go to repository Settings > Pages
3. Select main branch as Source
4. Save and wait a few minutes to access via the provided URL

### Deploy to Other Platforms

This is a static website and can be deployed to any static hosting platform:

- **Vercel**: `vercel --prod`
- **Netlify**: Drag and drop project folder to netlify.com
- **Cloudflare Pages**: Connect Git repository for automatic deployment
- **GitLab Pages**: Enable in repository settings
- **AWS S3**: Upload to S3 bucket with static hosting enabled
- **Azure Static Web Apps**: Connect GitHub repository

## Project Structure

```
my_news_websites/
├── index.html          # Main page
├── css/
│   └── style.css       # Stylesheet
├── js/
│   ├── config.js       # Configuration settings
│   └── app.js          # Core application logic
└── README.md           # Documentation
```

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Other modern browsers

## Important Notes

1. This project uses the RSS2JSON API service to handle RSS CORS issues
2. The free API tier has rate limits; register for an API key for heavy usage
3. News content copyright belongs to respective media outlets
4. For educational and personal use only

## Customization

### Add a New News Source

Add a new source to the `NEWS_SOURCES` object in `js/app.js`:

```javascript
const NEWS_SOURCES = {
    // Existing sources...
    newSource: {
        name: 'Source Name',
        rss: 'https://example.com/rss',
        class: 'newSource'
    }
};
```

Also add corresponding styles in `css/style.css`:

```css
.news-source.newSource {
    background: #f0f0f0;
    color: #333333;
}
```

### Change Color Theme

Edit CSS variables in `css/style.css`:

```css
:root {
    --primary-color: #1a73e8;
    --secondary-color: #34a853;
    /* Modify other colors... */
}
```

### Enable Debug Mode

See what's happening in the browser console:

```javascript
// In js/config.js
const CONFIG = {
    DEBUG_MODE: true,  // Enable console logging
    // ...
};
```

## Troubleshooting

### News not loading?

1. Check your internet connection
2. Open browser console (F12) to see errors
3. RSS2JSON API might have rate limits - wait a few minutes
4. Try enabling DEBUG_MODE in config.js to see detailed logs

### Auto-refresh not working?

1. Check CONFIG.AUTO_REFRESH_INTERVAL is > 0
2. Make sure config.js is loaded before app.js in index.html
3. Check browser console for errors

### Images not showing?

Some RSS feeds don't include images. This is normal - the layout will adjust automatically.

## License

MIT License

## Contributing

Issues and Pull Requests are welcome!

## Support

For help or to report issues, please visit:
- [Report a bug](https://github.com/your-username/your-repo/issues)
- [Request a feature](https://github.com/your-username/your-repo/issues/new)
