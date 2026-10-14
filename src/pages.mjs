// Generates every page of the site into dist/ and copies the static assets alongside.
// ARTIFACT=1 writes index.html without its <html>/<head> wrapper (for hosts that add their own).
import { writeFileSync, rmSync, mkdirSync, cpSync } from 'node:fs';
const OUT = 'dist/';
const ARTIFACT = process.env.ARTIFACT === '1';
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT + 'assets', { recursive: true });
cpSync('public', OUT, { recursive: true });
cpSync('src/assets', OUT + 'assets', { recursive: true });
const PHONE = '0201 330 6327';

const I = {
  arrow: '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M5 11L11 5M6 5h5v5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  left: '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3.5L5.5 8l4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  right: '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3.5L10.5 8 6 12.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  chev: '<svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  pin: '<svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 14s4.5-4.2 4.5-7.5a4.5 4.5 0 10-9 0C3.5 9.8 8 14 8 14z" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="8" cy="6.5" r="1.6" fill="currentColor"/></svg>',
};
const btnLine = (href, text, light = false) => `<a class="btn btn-line${light ? ' btn-line-light' : ''}" href="${href}">${text}<span class="dot">${I.arrow}</span></a>`;
const btnSolid = (href, text, cls = '') => `<a class="btn btn-solid ${cls}" href="${href}">${text}</a>`;

const NAV = [['about.html', 'About'], ['services.html', 'Services'], ['operators.html', 'Operators'], ['newsroom.html', 'Newsroom'], ['contact.html', 'Contact']];

function head({ title, desc, full }) {
  const meta = `<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="theme-color" content="#070c18">
<link rel="icon" type="image/png" href="assets/favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@300..700&display=swap">
<link rel="stylesheet" href="assets/site.css">
<script>try{if(sessionStorage.getItem("naebi-visited"))document.documentElement.classList.add("no-loader")}catch(e){}</script>`;
  return full ? `<!doctype html>
<html lang="en-NG">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${meta}
</head>
<body>` : meta;
}

const loader = `<div class="loader" id="loader" aria-hidden="true">
  <div class="loader-inner">
    <div class="loader-stage"><canvas id="loader-canvas"></canvas><img src="assets/mark-3d-lg.png" alt=""></div>
    <div class="loader-brand"><b>NAEBI</b> DYNAMIC CONCEPTS</div>
    <div class="loader-progress"><div class="loader-bar"><i></i></div><div class="loader-meta"><span>Preparing flight deck</span><span><span class="loader-count">00</span>%</span></div></div>
  </div>
</div>`;

function header(active) {
  const links = NAV.map(([h, t]) => `<a href="${h}"${h === active ? ' aria-current="page"' : ''}>${t}</a>`).join('');
  return `<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="container bar">
    <a class="brand" href="index.html" aria-label="Naebi Dynamic Concepts home"><img src="assets/mark-3d.png" alt="" width="34" height="43"><span><b>NAEBI</b><small>DYNAMIC CONCEPTS</small></span></a>
    <nav class="nav" aria-label="Main">${links}</nav>
    <div class="header-cta"><a class="phone" href="tel:+2342013306327">${PHONE}</a>${btnSolid('verify.html', 'Verify an official', 'sm')}</div>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="mobile-menu">Menu</button>
  </div>
</header>
<div class="mobile-menu" id="mobile-menu" hidden role="dialog" aria-modal="true" aria-label="Menu">
  <div class="top"><a class="brand" href="index.html"><img src="assets/mark-3d.png" alt="" width="30" height="38"><span><b>NAEBI</b><small>DYNAMIC CONCEPTS</small></span></a><button class="menu-btn" style="display:inline-flex" type="button" data-close-menu>Close</button></div>
  <nav aria-label="Mobile">${[['index.html', 'Home'], ...NAV, ['verify.html', 'Verify an official']].map(([h, t]) => `<a href="${h}"${h === active ? ' aria-current="page"' : ''}>${t}</a>`).join('')}</nav>
  <div class="foot"><span>Head office: Port Harcourt International Airport</span><span class="tabular">${PHONE} · Mon to Fri, 09:00 to 17:00</span></div>
</div>`;
}

function footer() {
  return `<footer class="site-footer">
  <div class="bgimg"><img src="assets/cta-bg.webp" alt="" loading="lazy"></div>
  <div class="container">
    <div class="footer-cta rv">
      <span class="label label-dark">Operating helicopters in Nigeria?</span>
      <h2>Fly compliant. We handle the rest.</h2>
      <p>Talk to our operators desk about landing and take-off charges, billing, or getting your fleet set up with Naebi.</p>
      <div class="actions">${btnSolid('contact.html', 'Talk to our team')}${btnLine('operators.html', 'Operator guide', true)}</div>
    </div>
    <div class="footer-grid">
      <div><h4>Head office</h4><address>GAT Building, International Wing<br>Port Harcourt International Airport<br>Rivers State, Nigeria</address></div>
      <div><h4>Lagos office</h4><address>Terminal 1, Murtala Muhammed<br>International Airport, Ikeja, Lagos</address><p style="margin-top:12px" class="tabular">${PHONE}<br>Mon to Fri, 09:00 to 17:00</p></div>
      <div><h4>Company</h4><ul><li><a href="about.html">About us</a></li><li><a href="services.html">Services</a></li><li><a href="newsroom.html">Newsroom</a></li><li><a href="about.html#careers">Careers</a></li><li><a href="contact.html">Contact</a></li></ul></div>
      <div><h4>Operators</h4><ul><li><a href="operators.html">Operator guide</a></li><li><a href="operators.html#pay">How to pay</a></li><li><a href="operators.html#query">Billing query</a></li><li><a href="verify.html">Verify an official</a></li></ul>
        <h4 style="margin-top:22px">Follow</h4><ul><li><a href="https://www.linkedin.com/in/naebidynamic/" target="_blank" rel="noopener">LinkedIn</a></li><li><a href="https://x.com/naebidynamic" target="_blank" rel="noopener">X (Twitter)</a></li><li><a href="https://www.instagram.com/naebidynamic/" target="_blank" rel="noopener">Instagram</a></li></ul></div>
    </div>
    <div class="footer-word" aria-hidden="true"><img src="assets/mark-3d-lg.png" alt="" loading="lazy"><span>NAEBI</span></div>
    <div class="footer-bottom"><span>© <span data-year>2026</span> Naebi Dynamic Concepts Limited · RC 1367947</span><nav aria-label="Legal"><a href="legal.html#privacy">Privacy Policy</a><a href="legal.html#terms">Terms of Use</a><a href="legal.html#cookies">Cookie Policy</a><a href="legal.html#accessibility">Accessibility</a></nav></div>
  </div>
</footer>`;
}

function page({ file, title, desc, active, body }) {
  const full = !ARTIFACT || file !== 'index.html';
  const html = `${head({ title, desc, full })}
${loader}
${header(active)}
<main id="main">
${body}
</main>
${footer()}
<script src="assets/site.js" defer></script>
${full ? '</body>\n</html>\n' : ''}`;
  writeFileSync(OUT + file, html);
}

function pageHero({ word, title, sub, crumb, img, alt }) {
  return `<section class="hero page">
  <div class="hero-media"><img src="assets/${img}" alt="${alt}" data-critical></div>
  <div class="hero-word" aria-hidden="true">${[...word].map(c => `<span>${c}</span>`).join('')}</div>
  <div class="hero-inner"><div class="container">
    <nav class="crumbs enter" aria-label="Breadcrumb"><a href="index.html">Home</a><span aria-hidden="true">/</span><span aria-current="page">${crumb}</span></nav>
    <h1 class="enter d2" style="max-width:18ch">${title}</h1>
    ${sub ? `<p class="sub enter d3">${sub}</p>` : ''}
  </div></div>
</section>`;
}

const FAQS = [
  ['What does Naebi Dynamic Concepts do?', 'We are an aviation services company working with the Federal Ministry of Aviation, NAMA, NCAA and FAAN. We monitor civil helicopter operations across Nigeria and administer helicopter landing and take-off charges at airports, heliports and offshore platforms.'],
  ['Who authorises the landing and take-off charges?', 'The charges are administered on behalf of the Federal Government through the Federal Ministry of Aviation, in collaboration with NAMA, NCAA and FAAN. Our <a href="about.html#mandate">mandate page</a> explains the arrangement.'],
  ['How do I pay a charge?', 'Pay only through the official channels printed on your Naebi invoice. Never pay cash, and never pay into a personal account. If you are unsure about a payment request, call us on ' + PHONE + ' before you pay. See <a href="operators.html#pay">how to pay</a>.'],
  ['How can I tell if a Naebi official is genuine?', 'Every Naebi official carries a staff ID. Enter it on our <a href="verify.html">Verify an official</a> page before you hand over documents or money. If the ID does not verify, do not deal with that person and report it to us.'],
  ['I think my bill is wrong. What should I do?', 'Send a <a href="operators.html#query">billing query</a> with your invoice reference, the aircraft registration and the date of the movement. Our operators desk will review the record and reply.'],
  ['Where are your offices?', 'Our head office is in the GAT Building, International Wing, Port Harcourt International Airport. Our Lagos office is at Terminal 1, Murtala Muhammed International Airport, Ikeja. Both are open Monday to Friday, 09:00 to 17:00.'],
];
const faqHTML = (items) => items.map(([q, a], i) => `<details class="q"${i === 0 ? ' open' : ''}><summary>${q}${I.chev}</summary><div class="a">${a}</div></details>`).join('');

/* ===================== HOME ===================== */
page({
  file: 'index.html', active: '', title: 'Naebi Dynamic Concepts',
  desc: 'Naebi Dynamic Concepts monitors civil helicopter operations across Nigeria and administers landing and take-off charges on behalf of the Federal Ministry of Aviation.',
  body: `<section class="hero">
  <div class="hero-media"><picture><source media="(max-width: 700px)" srcset="assets/hero-tall.webp"><img src="assets/hero-wide.webp" alt="A black helicopter parked on a clifftop helipad above the coast" data-critical fetchpriority="high"></picture></div>
  <div class="hero-word" aria-hidden="true"><span>N</span><span>A</span><span>E</span><span>B</span><span>I</span></div>
  <div class="hero-fg" aria-hidden="true"><picture><source media="(max-width: 700px)" srcset="assets/hero-tall-fg.webp"><img src="assets/hero-wide-fg.webp" alt=""></picture></div>
  <div class="hero-inner"><div class="container hero-row">
    <div>
      <h1 class="enter">Every helicopter movement in Nigeria, accounted for.</h1>
      <p class="sub enter d2">Monitoring civil helicopter operations and administering landing and take-off charges for the Federal Ministry of Aviation.</p>
    </div>
    <form class="hero-tool enter d3" data-quick-verify>
      <label for="hero-id">Asked to pay a Naebi official? Check them first.</label>
      <div class="pill-form"><input id="hero-id" name="id" placeholder="Enter staff ID" autocomplete="off" spellcheck="false"><button class="btn btn-solid" type="submit">Verify</button></div>
    </form>
  </div></div>
</section>

<section class="section" aria-labelledby="story-h">
  <div class="container story">
    <div class="left rv">
      <span class="label" id="story-h">Our mandate</span>
      <p>Incorporated in <b>2016</b> and headquartered at <b>Port Harcourt International Airport</b>, with a second office at <b>Murtala Muhammed International Airport</b>, Lagos.</p>
    </div>
    <div>
      <p class="statement">Working with the Federal Ministry of Aviation, NAMA, NCAA and FAAN, we keep an accurate record of civil helicopter operations at airports, heliports and offshore platforms across Nigeria.</p>
      <div class="actions rv">${btnLine('about.html', 'About Naebi')}</div>
    </div>
  </div>
</section>

<section class="section sunken" aria-labelledby="svc-h">
  <div class="container">
    <div class="head-row rv"><h2 class="h2" id="svc-h">What we do for Nigerian airspace</h2><div class="side">${btnLine('services.html', 'All services')}</div></div>
    <div class="bento">
      <a class="tile rv" href="services.html#monitoring"><img src="assets/field-wide.webp" alt="A blue helicopter landed on grass beside a waterfall" loading="lazy"><span class="tag">Core service</span>
        <div class="tile-body"><div><h3>Helicopter movement monitoring</h3><div class="meta">${I.pin} Airports · heliports · rig platforms</div></div><span class="go">${I.arrow}</span></div></a>
      <a class="tile rv" data-delay="80" href="services.html#charges"><img src="assets/helipad.webp" alt="A helicopter on a marked helipad" loading="lazy">
        <div class="tile-body"><div><h3>Landing &amp; take-off charges</h3><div class="meta">Assessed, invoiced and receipted</div></div><span class="go">${I.arrow}</span></div></a>
      <a class="tile rv" data-delay="160" href="services.html#technology"><img src="assets/cockpit.webp" alt="Close-up of a helicopter cockpit canopy" loading="lazy">
        <div class="tile-body"><div><h3>Surveillance technology</h3><div class="meta">Radar, tracking and a central control room</div></div><span class="go">${I.arrow}</span></div></a>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="where-h" data-carousel>
  <div class="container">
    <div class="head-row rv"><h2 class="h2" id="where-h">Wherever helicopters land</h2>
      <div class="side"><button class="icon-btn" type="button" data-prev aria-label="Previous">${I.left}</button><button class="icon-btn accent" type="button" data-next aria-label="Next">${I.right}</button></div></div>
    <div class="carousel rv" tabindex="0" aria-label="Places we monitor">
      <a class="place" href="services.html#monitoring"><div class="ph"><img src="assets/tail-rotor.webp" alt="Helicopter tail rotor on the apron" loading="lazy"></div><div class="row"><h3>Airports</h3><span class="go">${I.arrow}</span></div><div class="meta">${I.pin} Port Harcourt and Lagos offices</div></a>
      <a class="place" href="services.html#monitoring"><div class="ph"><img src="assets/pad-marking.webp" alt="Painted helipad landing circle" loading="lazy"></div><div class="row"><h3>Heliports</h3><span class="go">${I.arrow}</span></div><div class="meta">${I.pin} Licensed helipads nationwide</div></a>
      <a class="place" href="services.html#monitoring"><div class="ph"><img src="assets/rotor-head.webp" alt="Helicopter rotor head and engine cowling" loading="lazy"></div><div class="row"><h3>Offshore platforms</h3><span class="go">${I.arrow}</span></div><div class="meta">${I.pin} Niger Delta and offshore fields</div></a>
      <a class="place" href="services.html#monitoring"><div class="ph"><img src="assets/skids.webp" alt="Helicopter landing skids on grass" loading="lazy"></div><div class="row"><h3>Field landing sites</h3><span class="go">${I.arrow}</span></div><div class="meta">${I.pin} Onshore operations</div></a>
      <a class="place" href="services.html#technology"><div class="ph"><img src="assets/waterfall.webp" alt="Remote landing area beside a waterfall" loading="lazy"></div><div class="row"><h3>Low-level airspace</h3><span class="go">${I.arrow}</span></div><div class="meta">${I.pin} Mobile radar coverage</div></a>
    </div>
  </div>
</section>

<section class="section sunken trust" aria-labelledby="trust-h">
  <div class="container">
    <span class="label rv">Federal mandate</span>
    <h2 class="h2 rv" id="trust-h">Authorised oversight. Straightforward compliance.</h2>
    <p class="lead rv">Our work is carried out in collaboration with the agencies that run Nigerian aviation.</p>
    <div class="actions rv">${btnSolid('about.html#mandate', 'Read our mandate')}</div>
    <div class="marquee rv" aria-label="Partner agencies">
      <div class="marquee-track">
        <span class="org serif"><b>FMA</b><span>Federal Ministry of Aviation</span></span>
        <span class="org"><b>NAMA</b><span>Nigerian Airspace Management Agency</span></span>
        <span class="org wide"><b>NCAA</b><span>Nigerian Civil Aviation Authority</span></span>
        <span class="org serif"><b>FAAN</b><span>Federal Airports Authority of Nigeria</span></span>
      </div>
    </div>
    <div class="verify-row">
      <div class="float edge rv"><img src="assets/waterfall.webp" alt="" loading="lazy"></div>
      <div class="float rv"><img src="assets/helipad.webp" alt="" loading="lazy"></div>
      <div class="dark-card rv">
        <p>Being asked to pay a landing charge? Verify the official before you pay.</p>
        <form class="pill-form" data-quick-verify><label class="sr-only" for="trust-id">Staff ID</label><input id="trust-id" placeholder="Staff ID, e.g. NDC-PH-0142" autocomplete="off" spellcheck="false"><button type="submit" aria-label="Verify">${I.arrow}</button></form>
        <span class="note">Free, instant, and checked against our staff register.</span>
      </div>
      <div class="float lo rv"><img src="assets/cockpit.webp" alt="" loading="lazy"></div>
      <div class="float edge rv"><img src="assets/tail-rotor.webp" alt="" loading="lazy"></div>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="ops-h">
  <div class="container steps-wrap" data-steps>
    <div class="left rv">
      <div><span class="label">For operators</span><h2 class="h2" id="ops-h" style="margin-top:14px;max-width:12ch">From touchdown to receipt</h2></div>
      <p>Clear charges, official payment channels and a receipt for every movement. No cash and no guesswork.</p>
      <div class="step-nav"><button class="icon-btn" type="button" data-prev aria-label="Previous step">${I.left}</button><button class="icon-btn accent" type="button" data-next aria-label="Next step">${I.right}</button><div class="step-dots"></div></div>
    </div>
    <div class="step-view rv" aria-live="polite">
      <div class="step-num" aria-hidden="true">01</div>
      <div>
        <div class="step-pane"><h3>Your movement is recorded</h3><p>Each landing and take-off at an airport, heliport or offshore platform is logged against the aircraft registration, with the date, time and location.</p><div class="owner"><i>1</i>Naebi monitoring team</div></div>
        <div class="step-pane" hidden><h3>The charge is assessed</h3><p>The applicable landing and take-off charge is calculated against the approved schedule and issued to the operator on a Naebi invoice.</p><div class="owner"><i>2</i>Naebi operators desk</div></div>
        <div class="step-pane" hidden><h3>You pay through official channels</h3><p>Pay only through the government channels printed on your invoice. Never in cash, and never into a personal account.</p><div class="owner"><i>3</i>Your finance team</div></div>
        <div class="step-pane" hidden><h3>You keep an official receipt</h3><p>Every payment is receipted and traceable. If anything on your bill looks wrong, raise a billing query and we will review the record with you.</p><div class="owner"><i>4</i>Naebi operators desk</div></div>
        <div style="margin-top:28px">${btnLine('operators.html', 'Read the operator guide')}</div>
      </div>
    </div>
  </div>
</section>

<section class="section sunken" aria-labelledby="news-h">
  <div class="container">
    <div class="head-row rv"><h2 class="h2" id="news-h">In the news</h2><div class="side">${btnLine('newsroom.html', 'Newsroom')}</div></div>
    <div class="news rv">
      <a href="https://www.thisdaylive.com/index.php/2024/01/26/naebi-dynamics-to-fortify-aviation-security-in-nigeria/" target="_blank" rel="noopener"><span class="src">26 Jan 2024 · ThisDay</span><h3>Naebi Dynamics to fortify aviation security in Nigeria</h3><span class="go">${I.arrow}</span></a>
      <a href="https://www.thisdaylive.com/2022/10/14/fg-inaugurates-team-for-collection-of-helicopter-landing-charges/" target="_blank" rel="noopener"><span class="src">14 Oct 2022 · ThisDay</span><h3>FG inaugurates team for collection of helicopter landing charges</h3><span class="go">${I.arrow}</span></a>
      <a href="https://guardian.ng/business-services/naebi-deploys-new-technology-for-helicopter-surveillance/" target="_blank" rel="noopener"><span class="src">The Guardian Nigeria</span><h3>Naebi deploys new technology for helicopter surveillance</h3><span class="go">${I.arrow}</span></a>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="faq-h">
  <div class="container">
    <div class="faq-head rv"><div><span class="label">FAQs</span><h2 class="h2" id="faq-h" style="margin-top:14px">Got questions?<br>We're here to help.</h2></div><p>Quick answers about our mandate, charges, payments and verifying officials, so you can operate with confidence.</p></div>
    <div class="faq">
      <div class="rv">${faqHTML(FAQS)}</div>
      <div class="faq-photo rv"><img src="assets/field-tall.webp" alt="A blue helicopter landed beside a waterfall" loading="lazy"></div>
    </div>
  </div>
</section>`
});

/* ===================== ABOUT ===================== */
page({
  file: 'about.html', active: 'about.html', title: 'About · Naebi Dynamic Concepts',
  desc: 'Naebi Dynamic Concepts is a Nigerian aviation services company working with the Federal Ministry of Aviation, NAMA, NCAA and FAAN.',
  body: `${pageHero({ word: 'ABOUT', crumb: 'About', title: 'A multidimensional aviation servicing company', sub: 'Efficient and credible aerosolutions for indigenous and expatriate organisations across Nigeria.', img: 'hero-wide.webp', alt: 'A black helicopter on a clifftop helipad' })}
<section class="section">
  <div class="container story">
    <div class="left rv"><span class="label">Who we are</span><p>Naebi Dynamic Concepts Limited, <b>RC 1367947</b>. Registered in <b>2016</b> and based in <b>Port Harcourt, Rivers State</b>.</p></div>
    <div><p class="statement">We give the Federal Government and helicopter operators one accurate, shared record of civil helicopter movements, and make paying the right charge simple.</p></div>
  </div>
</section>
<section class="section sunken" id="mandate">
  <div class="container split top">
    <div class="rv"><span class="label">Our mandate</span><h2 class="h2" style="margin-top:14px">Working with the agencies that run Nigerian aviation</h2></div>
    <div class="prose rv">
      <p>Naebi Dynamic Concepts works as a consultant to the Federal Government through the Federal Ministry of Aviation. In collaboration with the Nigerian Airspace Management Agency (NAMA), the Nigerian Civil Aviation Authority (NCAA) and the Federal Airports Authority of Nigeria (FAAN), we monitor civil helicopter operations across the country.</p>
      <p>That work covers helicopter movements at airports, heliports and offshore rig platforms, and the collection of helicopter landing and take-off charges on behalf of the Federal Government.</p>
      <p>Operators who need copies of the authorising documents can request them from our <a href="contact.html">operators desk</a>.</p>
    </div>
  </div>
</section>
<section class="section">
  <div class="container">
    <div class="head-row rv"><h2 class="h2">Milestones</h2></div>
    <div class="timeline rv">
      <div class="ev"><span class="when">2016</span><div><h3>Company incorporated</h3><p>Naebi Dynamic Concepts Limited is registered in Port Harcourt, Rivers State.</p></div></div>
      <div class="ev"><span class="when">October 2022</span><div><h3>Implementation committee inaugurated</h3><p>A Rivers State implementation committee for the collection of helicopter landing and take-off charges is inaugurated at Port Harcourt International Airport.</p></div></div>
      <div class="ev"><span class="when">January 2024</span><div><h3>Strengthening aviation security</h3><p>Naebi sets out plans to support aviation security through helicopter surveillance technology, including mobile radar and a central control room.</p></div></div>
    </div>
  </div>
</section>
<section class="section sunken">
  <div class="container split">
    <div class="photo tall rv"><img src="assets/field-tall.webp" alt="A blue helicopter landed beside a waterfall" loading="lazy"></div>
    <div class="rv"><span class="label">Leadership</span><h2 class="h2" style="margin-top:14px">Led by people who know the apron</h2>
      <div class="cards" style="margin-top:28px"><div class="card"><span class="k">Chief Executive Officer</span><h3>Chike Stanley</h3><p>Leads Naebi's partnership with the Federal Ministry of Aviation and the roll-out of helicopter monitoring nationwide.</p></div></div></div>
  </div>
</section>
<section class="section" id="careers">
  <div class="container split top">
    <div class="rv"><span class="label">Careers</span><h2 class="h2" style="margin-top:14px">Work with us</h2></div>
    <div class="prose rv"><p>We hire field monitoring officers, control-room analysts and finance staff in Port Harcourt and Lagos. Open roles are published on this page and on our <a href="https://www.linkedin.com/in/naebidynamic/" target="_blank" rel="noopener">LinkedIn page</a>.</p>
      <div class="notice"><strong>There are no open roles right now.</strong><span>Naebi never charges a fee to apply or to be hired. If anyone asks you to pay for a job with us, report it on ${PHONE}.</span></div></div>
  </div>
</section>`
});

/* ===================== SERVICES ===================== */
const svc = (id, n, title, text, list, img, alt) => `<article class="svc" id="${id}"><div class="photo rv"><img src="assets/${img}" alt="${alt}" loading="lazy"></div><div class="rv"><span class="n">${n}</span><h2>${title}</h2><p>${text}</p><ul>${list.map(l => `<li>${l}</li>`).join('')}</ul></div></article>`;
page({
  file: 'services.html', active: 'services.html', title: 'Services · Naebi Dynamic Concepts',
  desc: 'Helicopter movement monitoring, landing and take-off charge administration, surveillance technology and aviation consulting in Nigeria.',
  body: `${pageHero({ word: 'SERVICES', crumb: 'Services', title: 'Oversight built for low-level airspace', sub: 'From the control room to the helipad, four services that keep civil helicopter operations visible and accountable.', img: 'field-wide.webp', alt: 'A blue helicopter beside a waterfall' })}
<section class="section tight"><div class="container">
${svc('monitoring', '01 / 04', 'Helicopter movement monitoring', 'We record civil helicopter arrivals and departures at airports, heliports and offshore rig platforms, so that every movement has an accurate record.', ['Coverage of airports, heliports and rig platforms', 'Movements logged by registration, date, time and location', 'Shared records for the Ministry, NAMA, NCAA and FAAN'], 'helipad.webp', 'A helicopter on a marked helipad')}
${svc('charges', '02 / 04', 'Landing &amp; take-off charge administration', 'We assess, invoice and receipt helicopter landing and take-off charges on behalf of the Federal Government, through official channels only.', ['Charges calculated against the approved schedule', 'Invoices issued to the operator of record', 'Payment through official government channels, never cash'], 'pad-marking.webp', 'Helipad landing circle marking')}
${svc('technology', '03 / 04', 'Surveillance technology', 'Mobile radar with high-density cameras, IT tracking devices, body-worn cameras and a central control room give us visibility of low-level helicopter flight.', ['Mobile radar for low-level flights', 'Tracking devices and body-worn cameras for field teams', 'A central control room facility'], 'cockpit.webp', 'Close-up of a helicopter cockpit')}
${svc('consulting', '04 / 04', 'Aviation consulting', 'We advise indigenous and expatriate organisations on operating helicopters in Nigerian airspace, from compliance to the practicalities of charges and records.', ['Compliance guidance for operators', 'Support for oil and gas charter clients', 'Records and reporting support'], 'rotor-head.webp', 'Helicopter rotor head')}
</div></section>
<section class="section sunken trust"><div class="container"><h2 class="h2 rv">Need something specific?</h2><p class="lead rv">Tell us about your fleet and where you fly. We will tell you exactly what applies.</p><div class="actions rv">${btnSolid('contact.html', 'Talk to our team')}${btnLine('operators.html', 'Operator guide')}</div></div></section>`
});

/* ===================== OPERATORS ===================== */
page({
  file: 'operators.html', active: 'operators.html', title: 'Operator guide · Naebi Dynamic Concepts',
  desc: 'How helicopter landing and take-off charges work in Nigeria, how to pay through official channels, and how to raise a billing query.',
  body: `${pageHero({ word: 'OPERATE', crumb: 'Operators', title: 'The operator guide', sub: 'What is charged, how to pay safely, and what to do if something looks wrong.', img: 'helipad.webp', alt: 'A helicopter on a marked helipad' })}
<section class="section">
  <div class="container">
    <div class="head-row rv"><h2 class="h2">How it works</h2></div>
    <div class="cards">
      <div class="card rv"><span class="k">Step 01</span><h3>Movement recorded</h3><p>Each landing and take-off is logged at the airport, heliport or platform.</p></div>
      <div class="card rv" data-delay="60"><span class="k">Step 02</span><h3>Charge assessed</h3><p>The charge is calculated against the approved schedule and invoiced to the operator.</p></div>
      <div class="card rv" data-delay="120"><span class="k">Step 03</span><h3>Pay officially</h3><p>Use only the government channels printed on your invoice.</p></div>
      <div class="card rv" data-delay="180"><span class="k">Step 04</span><h3>Keep your receipt</h3><p>Every payment is receipted and can be checked with us at any time.</p></div>
    </div>
  </div>
</section>
<section class="section sunken" id="charges">
  <div class="container split top">
    <div class="rv"><span class="label">Charges</span><h2 class="h2" style="margin-top:14px">What is charged</h2></div>
    <div class="prose rv"><p>Helicopter landing and take-off charges apply to civil helicopter movements at airports, heliports and offshore platforms in Nigeria. They are collected on behalf of the Federal Government under the arrangement described on our <a href="about.html#mandate">mandate page</a>.</p>
      <p>The amount on each invoice is calculated against the approved schedule. If you would like the schedule that applies to your fleet, ask our operators desk and we will send it to you.</p></div>
  </div>
</section>
<section class="section" id="pay">
  <div class="container split">
    <div class="photo rv"><img src="assets/skids.webp" alt="Helicopter skids on grass" loading="lazy"></div>
    <div class="rv"><span class="label">How to pay</span><h2 class="h2" style="margin-top:14px">Pay safely, every time</h2>
      <div class="svc" style="padding:0;border:0;display:block"><ul>
        <li>Pay only through the official channels printed on your Naebi invoice.</li>
        <li>Never pay cash to anyone, at any site.</li>
        <li>Never pay into a personal bank account.</li>
        <li>Quote your invoice reference with every payment.</li>
        <li>If in doubt, <a href="verify.html">verify the official</a> or call ${PHONE} before you pay.</li>
      </ul></div></div>
  </div>
</section>
<section class="section sunken" id="query">
  <div class="container split top">
    <div class="rv"><span class="label">Billing query</span><h2 class="h2" style="margin-top:14px">Something on your bill looks wrong?</h2><p class="lead" style="margin-top:16px">Send us the details and our operators desk will review the movement record with you.</p></div>
    <div class="panel rv">
      <form class="form" data-form novalidate>
        <div class="two"><div class="field"><label for="q-name">Your name</label><input id="q-name" name="name" required autocomplete="name"><span class="err">Enter your name.</span></div>
        <div class="field"><label for="q-org">Operator</label><input id="q-org" name="org" required autocomplete="organization"><span class="err">Enter the operator's name.</span></div></div>
        <div class="two"><div class="field"><label for="q-email">Email</label><input id="q-email" name="email" type="email" required autocomplete="email"><span class="err">Enter a valid email address.</span></div>
        <div class="field"><label for="q-phone">Phone (optional)</label><input id="q-phone" name="phone" type="tel" autocomplete="tel" placeholder="0803 123 4567"><span class="err">Enter a Nigerian phone number.</span></div></div>
        <div class="two"><div class="field"><label for="q-inv">Invoice reference</label><input id="q-inv" name="invoice" required><span class="err">Enter the invoice reference.</span></div>
        <div class="field"><label for="q-reg">Aircraft registration</label><input id="q-reg" name="reg" placeholder="5N-" required><span class="err">Enter the registration.</span></div></div>
        <div class="field"><label for="q-msg">What looks wrong?</label><textarea id="q-msg" name="message" required></textarea><span class="err">Tell us what looks wrong.</span></div>
        <div><button class="btn btn-solid" type="submit">Send billing query</button></div>
        <p class="form-note">We use these details only to answer your query. See our <a href="legal.html#privacy">privacy policy</a>.</p>
      </form>
      <div class="form-done" tabindex="-1"></div>
    </div>
  </div>
</section>
<section class="section"><div class="container"><div class="faq-head rv"><div><span class="label">FAQs</span><h2 class="h2" style="margin-top:14px">Operator questions</h2></div><p>Still unsure? Call ${PHONE}, Monday to Friday, 09:00 to 17:00.</p></div><div class="rv" style="max-width:820px">${faqHTML(FAQS.slice(1, 5))}</div></div></section>`
});

/* ===================== VERIFY ===================== */
page({
  file: 'verify.html', active: 'verify.html', title: 'Verify an official · Naebi Dynamic Concepts',
  desc: 'Check a Naebi staff ID or payment account before you pay or hand over documents.',
  body: `${pageHero({ word: 'VERIFY', crumb: 'Verify an official', title: 'Check before you pay', sub: 'Every Naebi official carries a staff ID. Check it here before you hand over money or documents.', img: 'tail-rotor.webp', alt: 'Helicopter tail rotor' })}
<section class="section">
  <div class="container split top">
    <div class="vt rv" id="verify-tool">
      <div style="display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap"><h2>Verify an official</h2><span class="badge-demo">SAMPLE REGISTER</span></div>
      <div class="seg" role="group" aria-label="What to check"><button type="button" data-mode="staff" aria-pressed="true">Staff ID</button><button type="button" data-mode="acct" aria-pressed="false">Payment account</button></div>
      <form class="pill-form" novalidate><label class="sr-only" for="v-input" id="v-label">Staff ID</label><input id="v-input" autocomplete="off" spellcheck="false"><button class="btn btn-solid" type="submit">Verify</button></form>
      <div class="samples" id="v-samples"></div>
      <div id="v-result" aria-live="polite"></div>
    </div>
    <div class="prose rv">
      <h2 style="margin-top:0">If an ID does not verify</h2>
      <ul><li>Do not pay, and do not hand over documents.</li><li>Note the person's name, the time and the location.</li><li>Call our Port Harcourt office on ${PHONE} to report it.</li></ul>
      <h2>What genuine officials will never do</h2>
      <ul><li>Ask for cash.</li><li>Ask you to pay into a personal account.</li><li>Refuse to show their staff ID.</li></ul>
      <p>Questions about a payment? See <a href="operators.html#pay">how to pay</a>.</p>
    </div>
  </div>
</section>`
});

/* ===================== NEWSROOM ===================== */
page({
  file: 'newsroom.html', active: 'newsroom.html', title: 'Newsroom · Naebi Dynamic Concepts',
  desc: 'News and press coverage of Naebi Dynamic Concepts and helicopter monitoring in Nigeria.',
  body: `${pageHero({ word: 'NEWS', crumb: 'Newsroom', title: 'Newsroom', sub: 'Press coverage of our work with the Federal Ministry of Aviation.', img: 'rotor-head.webp', alt: 'Helicopter rotor head' })}
<section class="section">
  <div class="container">
    <div class="news rv">
      <a href="https://www.thisdaylive.com/index.php/2024/01/26/naebi-dynamics-to-fortify-aviation-security-in-nigeria/" target="_blank" rel="noopener"><span class="src">26 Jan 2024 · ThisDay</span><h3>Naebi Dynamics to fortify aviation security in Nigeria</h3><span class="go">${I.arrow}</span></a>
      <a href="https://www.thisdaylive.com/2022/10/14/fg-inaugurates-team-for-collection-of-helicopter-landing-charges/" target="_blank" rel="noopener"><span class="src">14 Oct 2022 · ThisDay</span><h3>FG inaugurates team for collection of helicopter landing charges</h3><span class="go">${I.arrow}</span></a>
      <a href="https://leadership.ng/federal-govt-inaugurates-team-to-collect-helicopter-landing-charges-in-rivers/" target="_blank" rel="noopener"><span class="src">Oct 2022 · Leadership</span><h3>Federal Govt inaugurates team to collect helicopter landing charges in Rivers</h3><span class="go">${I.arrow}</span></a>
      <a href="https://nairametrics.com/2022/10/18/fg-set-to-improve-security-engages-firm-for-surveillance/" target="_blank" rel="noopener"><span class="src">18 Oct 2022 · Nairametrics</span><h3>FG engages Naebi to improve security through helicopter surveillance</h3><span class="go">${I.arrow}</span></a>
      <a href="https://guardian.ng/business-services/naebi-deploys-new-technology-for-helicopter-surveillance/" target="_blank" rel="noopener"><span class="src">The Guardian Nigeria</span><h3>Naebi deploys new technology for helicopter surveillance</h3><span class="go">${I.arrow}</span></a>
      <a href="https://nigerianflightdeck.com/naebi-dynamic-concept-acquires-mobile-radar-other-helicopter-surveillance-system/" target="_blank" rel="noopener"><span class="src">Nigerian FlightDeck</span><h3>Naebi acquires mobile radar and other helicopter surveillance systems</h3><span class="go">${I.arrow}</span></a>
    </div>
  </div>
</section>
<section class="section sunken"><div class="container split top"><div class="rv"><span class="label">Media</span><h2 class="h2" style="margin-top:14px">Press enquiries</h2></div><div class="prose rv"><p>For interviews, statements and approved photography, contact our communications team through the <a href="contact.html">contact page</a> or call ${PHONE}.</p></div></div></section>`
});

/* ===================== CONTACT ===================== */
page({
  file: 'contact.html', active: 'contact.html', title: 'Contact · Naebi Dynamic Concepts',
  desc: 'Contact Naebi Dynamic Concepts in Port Harcourt and Lagos.',
  body: `${pageHero({ word: 'CONTACT', crumb: 'Contact', title: 'Talk to our team', sub: 'Operators, partners and press: we reply on working days.', img: 'cta-bg.webp', alt: 'A helicopter on a helipad above the coast' })}
<section class="section">
  <div class="container split top">
    <div class="rv" style="display:grid;gap:16px">
      <div class="card"><span class="k">Head office · DNPO</span><h3>Port Harcourt</h3><p>GAT Building, International Wing, Port Harcourt International Airport, Rivers State</p><a class="arrow-link" href="https://www.google.com/maps/search/?api=1&query=Port+Harcourt+International+Airport" target="_blank" rel="noopener">Get directions ${I.arrow}</a></div>
      <div class="card"><span class="k">Lagos office · DNMM</span><h3>Lagos</h3><p>Terminal 1, Murtala Muhammed International Airport, Ikeja, Lagos</p><a class="arrow-link" href="https://www.google.com/maps/search/?api=1&query=Murtala+Muhammed+International+Airport+Terminal+1" target="_blank" rel="noopener">Get directions ${I.arrow}</a></div>
      <div class="card"><span class="k">Phone</span><h3 class="tabular">${PHONE}</h3><p>Monday to Friday, 09:00 to 17:00</p></div>
    </div>
    <div class="panel rv">
      <form class="form" data-form novalidate>
        <div class="two"><div class="field"><label for="c-name">Your name</label><input id="c-name" name="name" required autocomplete="name"><span class="err">Enter your name.</span></div>
        <div class="field"><label for="c-org">Organisation (optional)</label><input id="c-org" name="org" autocomplete="organization"></div></div>
        <div class="two"><div class="field"><label for="c-email">Email</label><input id="c-email" name="email" type="email" required autocomplete="email"><span class="err">Enter a valid email address.</span></div>
        <div class="field"><label for="c-phone">Phone (optional)</label><input id="c-phone" name="phone" type="tel" autocomplete="tel" placeholder="0803 123 4567"><span class="err">Enter a Nigerian phone number.</span></div></div>
        <div class="field"><label for="c-topic">Topic</label><select id="c-topic" name="topic" required><option value="">Choose a topic</option><option>Operators and charges</option><option>Billing query</option><option>Partnerships</option><option>Media</option><option>Careers</option><option>Something else</option></select><span class="err">Choose a topic.</span></div>
        <div class="field"><label for="c-msg">Message</label><textarea id="c-msg" name="message" required></textarea><span class="err">Write your message.</span></div>
        <div><button class="btn btn-solid" type="submit">Send message</button></div>
        <p class="form-note">We use these details only to reply to you. See our <a href="legal.html#privacy">privacy policy</a>.</p>
      </form>
      <div class="form-done" tabindex="-1"></div>
    </div>
  </div>
</section>`
});

/* ===================== LEGAL ===================== */
page({
  file: 'legal.html', active: '', title: 'Legal · Naebi Dynamic Concepts',
  desc: 'Privacy policy, terms of use, cookie policy and accessibility statement for naebidynamic.com.',
  body: `${pageHero({ word: 'LEGAL', crumb: 'Legal', title: 'Policies', sub: 'Privacy, terms, cookies and accessibility.', img: 'pad-marking.webp', alt: 'Helipad marking' })}
<section class="section"><div class="container"><div class="prose">
  <h2 id="privacy">Privacy Policy</h2>
  <p>Naebi Dynamic Concepts Limited collects the personal data you give us through this website, such as your name, organisation, email address, phone number and message. We use it only to respond to your enquiry or billing query and to keep a record of that correspondence.</p>
  <p>We process personal data in line with the Nigeria Data Protection Act 2023. We do not sell personal data. We keep enquiry records only for as long as we need them to answer and follow up. To ask for a copy of your data, or for it to be corrected or deleted, contact us through the <a href="contact.html">contact page</a>.</p>
  <h2 id="terms">Terms of Use</h2>
  <p>The information on this website is provided for general guidance. Charges that apply to a specific operator are set out on that operator's invoice. Links to other websites are provided for convenience; we are not responsible for their content.</p>
  <h2 id="cookies">Cookie Policy</h2>
  <p>This website does not use advertising or tracking cookies. It stores one setting in your browser for the current visit so that the loading screen plays only once. That setting is deleted when you close the browser tab.</p>
  <h2 id="accessibility">Accessibility</h2>
  <p>We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA. The site works with a keyboard, supports screen readers and respects your device's reduced-motion setting. If anything is hard to use, please tell us through the <a href="contact.html">contact page</a>.</p>
</div></div></section>`
});
console.log(`built ${OUT}`);
