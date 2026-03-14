// News sources configuration
const NEWS_SOURCES = {
    bbc: {
        name: 'BBC',
        rss: 'https://feeds.bbci.co.uk/news/rss.xml',
        class: 'bbc'
    },
    guardian: {
        name: 'The Guardian',
        rss: 'https://www.theguardian.com/uk/rss',
        class: 'guardian'
    },
    telegraph: {
        name: 'The Telegraph',
        rss: 'https://www.telegraph.co.uk/rss.xml',
        class: 'telegraph'
    },
    independent: {
        name: 'The Independent',
        rss: 'https://www.independent.co.uk/rss',
        class: 'independent'
    },
    sky: {
        name: 'Sky News',
        rss: 'https://feeds.skynews.com/feeds/rss/home.xml',
        class: 'sky'
    }
};

// RSS proxy service - to solve CORS issues
const RSS_PROXY = 'https://api.rss2json.com/v1/api.json?rss_url=';

let allNews = [];
let currentFilter = 'all';

// Initialize application
async function initApp() {
    showLoading(true);
    await fetchAllNews();
    displayNews();
    setupEventListeners();
    updateLastUpdateTime();
    showLoading(false);
}

// Fetch all news sources
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

// Fetch single RSS source
async function fetchRSS(sourceKey, source) {
    try {
        const response = await fetch(`${RSS_PROXY}${encodeURIComponent(source.rss)}`);
        const data = await response.json();

        if (data.status !== 'ok') {
            throw new Error('RSS fetch failed');
        }

        const maxArticles = CONFIG?.MAX_ARTICLES_PER_SOURCE || 10;
        return data.items.slice(0, maxArticles).map(item => ({
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

// Clean description text
function cleanDescription(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    let text = div.textContent || div.innerText || '';
    text = text.replace(/<[^>]*>/g, '');
    const maxLength = CONFIG?.DESCRIPTION_LENGTH || 150;
    return text.substring(0, maxLength) + (text.length > maxLength ? '...' : '');
}

// Extract image from item
function extractImage(item) {
    // Try to get image from different fields
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

// Display news
function displayNews() {
    const newsGrid = document.getElementById('news-grid');
    newsGrid.innerHTML = '';

    const filteredNews = currentFilter === 'all'
        ? allNews
        : allNews.filter(news => news.source === currentFilter);

    if (filteredNews.length === 0) {
        newsGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; color: var(--text-secondary);">No news available</p>';
        return;
    }

    filteredNews.forEach(news => {
        const card = createNewsCard(news);
        newsGrid.appendChild(card);
    });
}

// Create news card
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
                <a href="${news.link}" target="_blank" rel="noopener noreferrer" class="read-more">Read more →</a>
            </div>
        </div>
    `;

    return card;
}

// Calculate time ago
function getTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
        return 'Just now';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }

    const locale = CONFIG?.DATE_LOCALE || 'en-GB';
    return date.toLocaleDateString(locale);
}

// Setup event listeners
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

    // Manual refresh button
    const refreshBtn = document.getElementById('refresh-btn');
    refreshBtn.addEventListener('click', async () => {
        refreshBtn.classList.add('refreshing');
        refreshBtn.disabled = true;

        await fetchAllNews();
        displayNews();
        updateLastUpdateTime();

        setTimeout(() => {
            refreshBtn.classList.remove('refreshing');
            refreshBtn.disabled = false;
        }, 1000);
    });
}

// Show/hide loading state
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

// Update last update time
function updateLastUpdateTime() {
    const lastUpdate = document.getElementById('last-update');
    const now = new Date();
    const locale = CONFIG?.DATE_LOCALE || 'en-GB';
    lastUpdate.textContent = now.toLocaleString(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
}

// Initialize after page load
document.addEventListener('DOMContentLoaded', initApp);

// Auto-refresh based on configuration
const refreshInterval = CONFIG?.AUTO_REFRESH_INTERVAL || 5;
if (refreshInterval > 0) {
    setInterval(async () => {
        if (CONFIG?.DEBUG_MODE) {
            console.log('Auto-refreshing news...');
        }
        await fetchAllNews();
        displayNews();
        updateLastUpdateTime();
    }, refreshInterval * 60 * 1000);

    if (CONFIG?.DEBUG_MODE) {
        console.log(`Auto-refresh enabled: every ${refreshInterval} minutes`);
    }
}
