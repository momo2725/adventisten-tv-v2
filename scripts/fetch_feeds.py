import subprocess, json, re, datetime, sys, os

FEEDS = [
    ("https://www.apd.info/news/rss", "APD"),
    ("https://adventisten.de/aktuelles/news/rss", "Adventisten"),
]

def fetch(url):
    cmd = [
        "curl", "-sS", "--max-time", "20",
        "-H", "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
        "-H", "Accept: text/xml, application/rss+xml, application/xml, */*",
        "-H", "Accept-Language: de-DE,de;q=0.9,en;q=0.8",
        "-H", "Accept-Encoding: gzip, deflate, br",
        "-H", "Connection: keep-alive",
        "-H", "Referer: https://www.google.com/",
        "--compressed",
        url
    ]
    result = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace")
    print(f"curl {url}: returncode={result.returncode}, bytes={len(result.stdout)}, stderr={result.stderr[:100]}")
    return result.stdout if result.returncode == 0 else ""

def get(xml, tag):
    m = re.search(r'<' + tag + r'[^>]*><!\[CDATA\[([\s\S]*?)\]\]></' + tag + r'>|<' + tag + r'[^>]*>([^<]*)</' + tag + r'>', xml)
    return (m.group(1) or m.group(2) or "").strip() if m else ""

def get_attr(xml, tag, attr):
    m = re.search(r'<' + tag + r'[^>]+' + attr + r'=["\']([^"\']+)["\']', xml)
    return m.group(1) if m else ""

all_items = []
for url, label in FEEDS:
    xml = fetch(url)
    if not xml:
        continue
    items_xml = re.findall(r'<item[^>]*>[\s\S]*?</item>', xml)
    print(f"Found {len(items_xml)} items in {label}")
    for item_xml in items_xml:
        title = get(item_xml, "title")
        if not title:
            continue
        link    = get(item_xml, "link") or get_attr(item_xml, "link", "href")
        pubDate = get(item_xml, "pubDate") or ""
        cat     = get(item_xml, "category") or label
        desc    = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', get(item_xml, "description"))).strip()
        img     = get_attr(item_xml, "enclosure", "url") or get_attr(item_xml, "media:thumbnail", "url") or ""
        try:
            ts = int(datetime.datetime.strptime(pubDate, "%a, %d %b %Y %H:%M:%S %z").timestamp()) if pubDate else 0
        except Exception:
            ts = 0
        all_items.append({
            "title": title, "link": link, "pubDate": pubDate,
            "rawDate": ts, "cat": cat, "desc": desc, "img": img
        })

all_items.sort(key=lambda x: x["rawDate"], reverse=True)
result = {
    "updated": datetime.datetime.utcnow().isoformat() + "Z",
    "items": all_items[:15]
}

os.makedirs("public", exist_ok=True)
with open("public/feed.json", "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print(f"Saved {len(result['items'])} items to public/feed.json")
if not result['items']:
    sys.exit(1)
