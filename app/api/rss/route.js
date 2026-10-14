export const runtime = 'edge';

const FEEDS = [
  { url: 'https://www.apd.info/news/rss',             label: 'APD' },
  { url: 'https://adventisten.de/aktuelles/news/rss', label: 'Adventisten' },
];

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
  'Accept': 'text/xml, application/rss+xml, application/xml, */*',
  'Accept-Language': 'de-DE,de;q=0.9',
  'Cache-Control': 'no-cache',
};

async function fetchFeed(url) {
  try {
    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) return '';
    return await res.text();
  } catch {
    return '';
  }
}

function extractItems(xml, label) {
  const items = [];
  const matches = xml.match(/<item[\s\S]*?<\/item>/g) || [];
  for (const item of matches) {
    const get = tag => {
      const m = item.match(new RegExp('<' + tag + '[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/' + tag + '>|<' + tag + '[^>]*>([^<]*)<\\/' + tag + '>'));
      return m ? (m[1] || m[2] || '').trim() : '';
    };
    const getAttr = (tag, attr) => {
      const m = item.match(new RegExp('<' + tag + '[^>]+' + attr + '=["\']([^"\']+)["\']'));
      return m ? m[1] : '';
    };
    const title = get('title');
    if (!title) continue;
    const link    = get('link') || getAttr('link', 'href');
    const pubDate = get('pubDate') || get('dc:date') || '';
    const cat     = get('category') || label;
    const desc    = get('description');
    const img     = getAttr('enclosure', 'url') || getAttr('media:thumbnail', 'url') || getAttr('media:content', 'url') || '';
    items.push({ title, link, pubDate, cat, desc, img, source: label });
  }
  return items;
}

export async function GET() {
  const results = await Promise.all(FEEDS.map(f => fetchFeed(f.url)));

  let all = [];
  FEEDS.forEach((f, i) => {
    if (results[i]) all = all.concat(extractItems(results[i], f.label));
  });

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
    <category><![CDATA[${a.cat}]]></category>
    <description><![CDATA[${a.desc}]]></description>
    ${a.img ? `<enclosure url="${a.img}" type="image/jpeg"/>` : ''}
  </item>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Merged Feed</title>${items}</channel></rss>`;

  return new Response(xml, {
    status: all.length > 0 ? 200 : 503,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
