#!/bin/bash

echo "🔍 Checking GitHub Pages deployment status..."
echo ""

# Check if website is accessible
echo "📡 Testing website URL..."
if curl -s -o /dev/null -w "%{http_code}" "https://xfpg21421.github.io/gb_great_news/" | grep -q "200"; then
    echo "✅ Website is LIVE!"
    echo ""
    echo "🌐 Your website: https://xfpg21421.github.io/gb_great_news/"
    echo ""
    echo "🎉 Congratulations! Your GB Great News is now online!"
    echo ""

    # Open the website
    read -p "Do you want to open it in browser? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        open "https://xfpg21421.github.io/gb_great_news/"
    fi
else
    echo "⏳ Website is still deploying..."
    echo ""
    echo "Please wait 1-2 minutes and run this script again:"
    echo "  ./check-deployment.sh"
    echo ""
    echo "Or check deployment status at:"
    echo "  https://github.com/xfpg21421/gb_great_news/deployments"
fi
