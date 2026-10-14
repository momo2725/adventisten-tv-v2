// Server-side RSS proxy — nutzt rss2json.com als Mittler, damit Feeds nicht blockiert werden
const FEEDS = [
  { url: 'https://adventisten.de/aktuelles/news/rss', label: 'Adventisten' },
  { url: 'https://www.apd.info/news/rss', label: 'APD' },
];

const RSS2JSON = 'https://api.rss2json.com/v1/api.json?rss_url=';

async function fetchViaRss2Json(feedUrl, label) {
  try {
    const apiUrl = RSS2JSON + encodeURIComponent(feedUrl) + '&count=10';
    const res = await fetch(apiUrl, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (data.status !== 'ok' || !Array.isArray(data.items)) return [];
    return data.items.map(item => ({
      title: item.title || '',
      link: item.link || item.url || '',
      pubDate: item.pubDate || '',
      category: (Array.isArray(item.categories) && item.categories[0]) || label,
      desc: item.description || item.content || '',
      img: item.thumbnail || item.enclosure?.link || '',
      source: label,
    }));
  } catch {
    return [];
  }
}

async function fetchDirectFeed(feedUrl, label) {
  try {
    const res = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/xml, application/rss+xml, application/xml, */*',
        'Accept-Language': 'de-DE,de;q=0.9,en;q=0.8',
        'Cache-Control': 'no-cache',
        'Referer': 'https://www.google.com/',
      },
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    return extractItems(xml, label);
  } catch {
    return [];
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
  let allItems = [];
  const rss2jsonResults = await Promise.all(
    FEEDS.map(f => fetchViaRss2Json(f.url, f.label))
  );
  allItems = rss2jsonResults.flat();

  if (allItems.length === 0) {
    const directResults = await Promise.all(
      FEEDS.map(f => fetchDirectFeed(f.url, f.label))
    );
    allItems = directResults.flat();
  }

  allItems.sort((a, b) => {
    const da = a.pubDate ? new Date(a.pubDate).getTime() : 0;
    const db = b.pubDate ? new Date(b.pubDate).getTime() : 0;
    return db - da;
  });

  const items = allItems.slice(0, 15).map(a => `
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
