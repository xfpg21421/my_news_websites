// News Aggregator Configuration

const CONFIG = {
    // Auto-refresh interval in minutes (set to 0 to disable auto-refresh)
    AUTO_REFRESH_INTERVAL: 5,

    // Maximum number of articles to fetch per source
    MAX_ARTICLES_PER_SOURCE: 10,

    // Description preview length (characters)
    DESCRIPTION_LENGTH: 150,

    // Date format locale
    DATE_LOCALE: 'en-GB',

    // Enable console logging for debugging
    DEBUG_MODE: false
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
