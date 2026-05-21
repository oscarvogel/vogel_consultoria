const sites = [
  "https://anasociados.com.ar/",
  "https://indufor.com.ar/",
  "https://forestalparaguay.com/",
  "https://servinlgsm.com.ar/",
  "https://h21.ar/",
  "https://amitrac.ar/",
  "https://garuhape.gob.ar/",
];

function abs(url, base) {
  try {
    return new URL(url, base).href;
  } catch {
    return null;
  }
}

function pickCandidates(html, baseUrl) {
  const candidates = [];

  const imgRe = /<img[^>]+>/gi;
  const srcRe = /src\s*=\s*["']([^"']+)["']/i;
  const altRe = /alt\s*=\s*["']([^"']*)["']/i;
  let m;

  while ((m = imgRe.exec(html))) {
    const tag = m[0];
    const src = (tag.match(srcRe) || [])[1];
    if (!src) continue;

    const alt = ((tag.match(altRe) || [])[1] || "").toLowerCase();
    const tagLc = tag.toLowerCase();

    let score = 0;
    if (/logo|brand|navbar|header|site-logo|custom-logo/.test(tagLc)) score += 3;
    if (/logo|marca|inicio|principal/.test(alt)) score += 2;
    if (/svg|webp|png|jpg|jpeg/.test(src.toLowerCase())) score += 1;

    candidates.push({
      kind: "img",
      url: abs(src, baseUrl),
      score,
      hint: `${alt} | ${tagLc.slice(0, 140)}`,
    });
  }

  const iconRe = /<link[^>]+rel\s*=\s*["'][^"']*(?:icon|apple-touch-icon)[^"']*["'][^>]*>/gi;
  const hrefRe = /href\s*=\s*["']([^"']+)["']/i;
  while ((m = iconRe.exec(html))) {
    const href = (m[0].match(hrefRe) || [])[1];
    if (!href) continue;
    candidates.push({ kind: "icon", url: abs(href, baseUrl), score: 1, hint: m[0].slice(0, 120) });
  }

  const ogImage = html.match(/<meta[^>]+property\s*=\s*["']og:image["'][^>]+content\s*=\s*["']([^"']+)["']/i);
  if (ogImage?.[1]) {
    candidates.push({ kind: "og:image", url: abs(ogImage[1], baseUrl), score: 1, hint: "og:image" });
  }

  return candidates
    .filter((c) => c.url)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);
}

for (const site of sites) {
  try {
    const res = await fetch(site, { redirect: "follow" });
    const html = await res.text();
    const rows = pickCandidates(html, site);

    console.log(`\nSITE ${site}`);
    rows.forEach((row, idx) => {
      console.log(`${idx + 1}. [${row.kind}] ${row.url} (score=${row.score})`);
    });

    const favicons = [...html.matchAll(/<link[^>]+rel\s*=\s*["'][^"']*(?:icon|apple-touch-icon)[^"']*["'][^>]*>/gi)]
      .map((m) => (m[0].match(/href\s*=\s*["']([^"']+)["']/i) || [])[1])
      .filter(Boolean)
      .map((href) => abs(href, site));
    if (favicons.length) {
      console.log("FAVICONS:");
      favicons.forEach((f) => console.log(`- ${f}`));
    }

    const og = (html.match(/<meta[^>]+property\s*=\s*["']og:image["'][^>]+content\s*=\s*["']([^"']+)["']/i) || [])[1];
    if (og) {
      console.log(`OG_IMAGE: ${abs(og, site)}`);
    }
  } catch (error) {
    console.log(`\nSITE ${site}`);
    console.log(`ERROR: ${error.message}`);
  }
}
