"""RSS/Atom feed connector for news and data feeds (68 sources)."""

from __future__ import annotations
from typing import Any
from .base import BaseConnector


class RssConnector(BaseConnector):
    """Parses RSS/Atom feeds into structured records."""

    async def fetch_data(self) -> list[dict[str, Any]]:
        import feedparser
        response = await self._make_request(self.config.endpoint)
        feed = feedparser.parse(response.text)

        return [
            {
                "title": entry.get("title", ""),
                "link": entry.get("link", ""),
                "published": entry.get("published", ""),
                "summary": entry.get("summary", "")[:500],
                "author": entry.get("author", ""),
                "feed_title": feed.feed.get("title", ""),
            }
            for entry in feed.entries
        ]
