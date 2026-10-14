// Server-side RSS proxy — fetches multiple feeds, merges and sorts by date
const FEEDS = [
  'https://adventisten.de/aktuelles/news/rss',
  'https://www.apd.info/news/rss',
];

async function fetchFeed(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0',
        'Accept': 'text/xml, application/rss+xml, application/xml, */*',
        'Accept-Language': 'de-DE,de;q=0.9',
        'Cache-Control': 'no-cache',
      },
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

function extractItems(xml, sourceLabel) {
  const items = [];
  const itemMatches = xml.match(/<item[\s\S]*?<\/item>/g) || [];
  for (const item of itemMatches) {
    const get = (tag) => {
      const m = item.match(new RegExp('<' + tag + '[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/' + tag + '>|<' + tag + '[^>]*>([^<]*)<\\/' + tag + '>'));
      return m ? (m[1] || m[2] || '').trim() : '';
    };
    const getAttr = (tag, attr) => {
      const m = item.match(new RegExp('<' + tag + '[^>]+' + attr + '=["\']([^"\']+)["\']'));
      return m ? m[1] : '';
    };
    const title = get('title');
    if (!title) continue;
    const link = get('link') || getAttr('link', 'href');
    const pubDate = get('pubDate') || get('dc:date') || '';
    const category = get('category') || sourceLabel;
    const desc = get('description');
    const img = getAttr('enclosure', 'url') || getAttr('media:thumbnail', 'url') || getAttr('media:content', 'url') || '';
    items.push({ title, link, pubDate, category, desc, img, source: sourceLabel });
  }
  return items;
}

export async function GET() {
  const results = await Promise.all(
    FEEDS.map((url, i) =>
      fetchFeed(url).then(xml => xml ? extractItems(xml, i === 0 ? 'Adventisten' : 'APD') : [])
    )
  );
  const all = results.flat();

  // Sort by pubDate descending
  all.sort((a, b) => {
    const da = a.pubDate ? new Date(a.pubDate).getTime() : 0;
    const db = b.pubDate ? new Date(b.pubDate).getTime() : 0;
    return db - da;
  });

  const items = all.slice(0, 15).map(a => `
  <item>
    <title><![CDATA[${a.title}]]></title>
    <link>${a.link}</link>
    <pubDate>${a.pubDate}</pubDate>
    <category><![CDATA[${a.category}]]></category>
    <description><![CDATA[${a.desc}]]></description>
    ${a.img ? `<enclosure url="${a.img}" type="image/jpeg"/>` : ''}
  </item>`).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Merged Feed</title>${items}</channel></rss>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
