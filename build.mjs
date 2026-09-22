// Assembles src/pages/*.html into root-level pages using src/layout.html.
// Each page starts with a JSON front-matter comment: <!--{ "title": "...", ... }-->
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

const layout = readFileSync('src/layout.html', 'utf8');
const nav = [
  ['intelligence-report.html', 'Reports', 'reports'],
  ['how-it-works.html', 'How it works', 'how'],
  ['sample-report.html', 'Sample', 'sample'],
  ['methodology.html', 'Methodology', 'method'],
  ['about.html', 'About', 'about'],
];

for (const file of readdirSync('src/pages').filter(f => f.endsWith('.html'))) {
  const raw = readFileSync(`src/pages/${file}`, 'utf8');
  const m = raw.match(/^<!--(\{[\s\S]*?\})-->/);
  const meta = JSON.parse(m[1]);
  const body = raw.slice(m[0].length).trim();
  const navHtml = nav.map(([href, label, key]) =>
    `<li><a href="${href}" class="nav__link${meta.nav === key ? ' is-active' : ''}" data-hover>${label}</a></li>`).join('\n          ');
  const scripts = (meta.scripts || []).map(s =>
    s.endsWith('.mjs') ? `<script type="module" src="assets/js/${s}"></script>` : `<script src="assets/js/${s}" defer></script>`).join('\n  ');
  const html = layout
    .replaceAll('{{title}}', meta.title)
    .replaceAll('{{desc}}', meta.desc)
    .replaceAll('{{page}}', meta.page)
    .replaceAll('{{file}}', file === 'index.html' ? '' : file)
    .replaceAll('{{robots}}', meta.noindex ? 'noindex, nofollow' : 'index, follow')
    .replace('{{nav}}', navHtml)
    .replace('{{content}}', body)
    .replace('{{scripts}}', scripts);
  writeFileSync(file, html);
  console.log('built', file);
}
