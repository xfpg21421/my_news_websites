// 新闻源配置
const NEWS_SOURCES = {
    bbc: {
        name: 'BBC',
        rss: 'https://feeds.bbci.co.uk/news/rss.xml',
        class: 'bbc'
    },
    guardian: {
        name: '卫报',
        rss: 'https://www.theguardian.com/uk/rss',
        class: 'guardian'
    },
    telegraph: {
        name: '电讯报',
        rss: 'https://www.telegraph.co.uk/rss.xml',
        class: 'telegraph'
    },
    independent: {
        name: '独立报',
        rss: 'https://www.independent.co.uk/rss',
        class: 'independent'
    },
    sky: {
        name: 'Sky News',
        rss: 'https://feeds.skynews.com/feeds/rss/home.xml',
        class: 'sky'
    }
};

// RSS代理服务 - 用于解决CORS问题
const RSS_PROXY = 'https://api.rss2json.com/v1/api.json?rss_url=';

let allNews = [];
let currentFilter = 'all';

// 初始化应用
async function initApp() {
    showLoading(true);
    await fetchAllNews();
    displayNews();
    setupEventListeners();
    updateLastUpdateTime();
    showLoading(false);
}

// 获取所有新闻源
async function fetchAllNews() {
    const promises = Object.entries(NEWS_SOURCES).map(([key, source]) =>
        fetchRSS(key, source)
    );

    const results = await Promise.allSettled(promises);

    allNews = results
        .filter(result => result.status === 'fulfilled')
        .flatMap(result => result.value)
        .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
}

// 获取单个RSS源
async function fetchRSS(sourceKey, source) {
    try {
        const response = await fetch(`${RSS_PROXY}${encodeURIComponent(source.rss)}`);
        const data = await response.json();

        if (data.status !== 'ok') {
            throw new Error('RSS fetch failed');
        }

        return data.items.slice(0, 10).map(item => ({
            source: sourceKey,
            sourceName: source.name,
            sourceClass: source.class,
            title: item.title,
            description: cleanDescription(item.description || item.content),
            link: item.link,
            pubDate: item.pubDate,
            image: extractImage(item)
        }));
    } catch (error) {
        console.error(`Error fetching ${source.name}:`, error);
        return [];
    }
}

// 清理描述文本
function cleanDescription(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    let text = div.textContent || div.innerText || '';
    text = text.replace(/<[^>]*>/g, '');
    return text.substring(0, 150) + (text.length > 150 ? '...' : '');
}

// 提取图片
function extractImage(item) {
    // 尝试从不同字段获取图片
    if (item.enclosure && item.enclosure.link) {
        return item.enclosure.link;
    }
    if (item.thumbnail) {
        return item.thumbnail;
    }
    if (item.description) {
        const imgMatch = item.description.match(/<img[^>]+src="([^">]+)"/);
        if (imgMatch) {
            return imgMatch[1];
        }
    }
    return null;
}

// 显示新闻
function displayNews() {
    const newsGrid = document.getElementById('news-grid');
    newsGrid.innerHTML = '';

    const filteredNews = currentFilter === 'all'
        ? allNews
        : allNews.filter(news => news.source === currentFilter);

    if (filteredNews.length === 0) {
        newsGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; color: var(--text-secondary);">暂无新闻</p>';
        return;
    }

    filteredNews.forEach(news => {
        const card = createNewsCard(news);
        newsGrid.appendChild(card);
    });
}

// 创建新闻卡片
function createNewsCard(news) {
    const card = document.createElement('div');
    card.className = `news-card ${currentFilter !== 'all' && news.source !== currentFilter ? 'hidden' : ''}`;

    const timeAgo = getTimeAgo(new Date(news.pubDate));

    card.innerHTML = `
        ${news.image ? `<img src="${news.image}" alt="${news.title}" class="news-image" onerror="this.style.display='none'">` : ''}
        <div class="news-content">
            <span class="news-source ${news.sourceClass}">${news.sourceName}</span>
            <h2 class="news-title">
                <a href="${news.link}" target="_blank" rel="noopener noreferrer">${news.title}</a>
            </h2>
            <p class="news-description">${news.description}</p>
            <div class="news-meta">
                <span class="news-time">⏰ ${timeAgo}</span>
                <a href="${news.link}" target="_blank" rel="noopener noreferrer" class="read-more">阅读全文 →</a>
            </div>
        </div>
    `;

    return card;
}

// 计算时间差
function getTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
        return '刚刚';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes}分钟前`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours}小时前`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `${diffInDays}天前`;
    }

    return date.toLocaleDateString('zh-CN');
}

// 设置事件监听
function setupEventListeners() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.source;
            displayNews();
        });
    });
}

// 显示/隐藏加载状态
function showLoading(show) {
    const loading = document.getElementById('loading');
    const newsGrid = document.getElementById('news-grid');

    if (show) {
        loading.style.display = 'block';
        newsGrid.style.display = 'none';
    } else {
        loading.style.display = 'none';
        newsGrid.style.display = 'grid';
    }
}

// 更新最后更新时间
function updateLastUpdateTime() {
    const lastUpdate = document.getElementById('last-update');
    const now = new Date();
    lastUpdate.textContent = now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initApp);

// 每5分钟自动刷新一次
setInterval(async () => {
    await fetchAllNews();
    displayNews();
    updateLastUpdateTime();
}, 5 * 60 * 1000);
