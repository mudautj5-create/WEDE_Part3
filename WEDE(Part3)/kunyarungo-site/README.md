# Kunyarungo AgriTech Solutions: WEDE5020 Website

A multi-page website for **Kunyarungo AgriTech Solutions**, a hypothetical agritech enterprise in rural South Africa that designs and supplies affordable solar powered irrigation and water management systems for small scale and emerging farmers.

- **Module:** WEDE5020
- **Student:** Tshifhiwa Mudau (ST10521460)
- **GitHub:** mudautj5
- **Live site:** `<https://bejewelled-selkie-eecd1d.netlify.app>`

> Kunyarungo AgriTech Solutions is a fictional organisation. Team members, phone numbers, prices, statistics and service hubs are invented for this student project.


## 1. Project structure

```
kunyarungo-site/
├── index.html          Home
├── about.html          About Us (tabs, accordion, modals)
├── services.html       Services and Products (dynamic list, search, filter, sort)
├── enquiry.html        Enquiry form (validation, AJAX, cost and availability response)
├── contact.html        Contact details, Leaflet map, message form (compiles an email)
├── css/styles.css
├── js/
│   ├── main.js         Navigation, tabs, accordion, modals, lightbox, animations
│   ├── products.js     Loads products with fetch, search, filter, sort
│   ├── forms.js        Shared validation helpers
│   ├── enquiry.js      Enquiry form logic and estimate
│   ├── contact.js      Contact form logic and email compile
│   └── map.js          Leaflet map and markers
├── data/products.json  Product data
├── images/             Optimised SVG illustrations
├── robots.txt
├── sitemap.xml
├── _headers            Security and caching headers (Netlify)
└── README.md
```

## 2. Part 3 features

### JavaScript enhancements
| Requirement | Where | How |
|---|---|---|
| Accordion | about.html | FAQ section; ARIA `aria-expanded`, animated `max-height` |
| Tabs | about.html | History / Mission / Vision, with arrow-key navigation |
| Modal | about.html | Team biographies; closes on Escape, overlay click or Close button |
| Interactive map | contact.html | Leaflet with OpenStreetMap tiles and four service-location markers with popups |
| Animations and transitions | all pages | CSS transitions and keyframes, scroll-reveal with `IntersectionObserver`, animated counters (respects `prefers-reduced-motion`) |
| Advanced DOM manipulation | services.html, main.js | Product cards, filter options and result messages are created with `createElement`; no product HTML is hard-coded |
| Gallery with lightbox | index.html | Click an image to enlarge; previous/next buttons and arrow keys |
| Dynamic content | services.html | Products loaded from `data/products.json` using `fetch` |
| Search, filter and sort | services.html | Live search (debounced), category filter, sort by name or price |

### Forms
- **enquiry.html:** product, consultation or quote enquiry. After validation the form is submitted with AJAX, and the visitor sees an **estimated cost and availability** for the selected package, area size and preferred date.
- **contact.html:** general message with name, email, phone, message type and full message. After validation the details are **compiled into an email** and the visitor can send it to `info@kunyarungo.co.za` (set in `js/contact.js`).
- **Validation:** HTML5 attributes (`required`, `minlength`, `maxlength`, `min`, `max`, `type`) plus JavaScript checks for South African phone numbers, email format, name characters, date range (today to two years ahead), number range and message length. Errors appear under each field and the first invalid field receives focus.
- **Submission:** the `form` `action` is `/` (Netlify Forms, `data-netlify="true"`) and the data is sent asynchronously with `fetch`.

### SEO
- **Keyword research:** primary keywords are *solar irrigation South Africa*, *solar water pump*, *drip irrigation kit*, *emerging farmers* and *water management*, used naturally in headings, intro text and image alt text.
- **Title tags and meta descriptions:** unique for each page.
- **Headings:** one `h1` per page, with `h2` and `h3` used in order.
- **Images:** descriptive file names (e.g. `standard-drip-irrigation-kit.svg`) and descriptive alt text.
- **URLs:** clean and descriptive (`services.html`, `enquiry.html`).
- **Internal linking:** navigation, breadcrumbs, footer links and calls to action link between pages.
- **Mobile-friendliness:** mobile-first CSS, viewport meta tag, large touch targets.
- **Structured data:** `LocalBusiness` JSON-LD on the home page; canonical links and Open Graph tags on every page.
- **Off-page SEO (plan):** list the business in Google Business Profile and South African directories (local SEO); ask DALRRD-linked programmes, NGOs and agricultural cooperatives to link to the site (backlinks); share project updates from the existing Facebook page with a link to the website (social media).
- **robots.txt** and **sitemap.xml** are in the site root.

### Performance and security
- Lightweight SVG images with `loading="lazy"` and set width/height, no large frameworks (vanilla JavaScript), and long-term caching headers.
- `_headers` adds a Content Security Policy, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` and HSTS. Netlify serves the site over HTTPS.
- Forms use a honeypot field against bots, user input is escaped before it is displayed, external links use `rel="noopener noreferrer"`, and the Leaflet files are loaded with Subresource Integrity hashes.

## 3. Running and deploying

**Run locally:** the product list uses `fetch`, so open the site through a local server (not by double-clicking the file), for example `python -m http.server 8000` and then visit `http://localhost:8000`.

**Deploy on Netlify:** push the repository to GitHub, choose *Add new site > Import an existing project*, select the repository, leave the build command empty and set the publish directory to `/`. After deploying, replace `https://kunyarungo-agritech.netlify.app` in `sitemap.xml`, `robots.txt` and the `canonical` / `og:` tags with your real URL.

---

## 4. Changelog

### Part 3 changes
| Date | File(s) | Change |
|---|---|---|
| 2026-11-02 | `js/main.js`, `about.html`, `css/styles.css` | Added accessible tabs, accordion and modals (ARIA attributes, keyboard support). |
| 2026-11-02 | `index.html`, `js/main.js`, `css/styles.css` | Added gallery with lightbox, scroll-reveal animation and animated impact counters. |
| 2026-11-02 | `services.html`, `js/products.js`, `data/products.json` | Replaced static product content with dynamic listings loaded via `fetch`, plus search, category filter and sort. |
| 2026-11-02 | `contact.html`, `js/map.js` | Added Leaflet map with four service-location markers. |
| 2026-11-02 | `enquiry.html`, `js/forms.js`, `js/enquiry.js` | Built enquiry form with JavaScript validation, error messages, AJAX submission and an estimated cost/availability response. |
| 2026-11-02 | `contact.html`, `js/contact.js` | Built contact form with validation and an email compiled for sending to the recipient stated in the code. |
| 2026-11-02 | all `.html` files | Added unique title tags, meta descriptions, canonical links, Open Graph tags and JSON-LD structured data; checked heading hierarchy and alt text. |
| 2026-11-02 | `robots.txt`, `sitemap.xml` | Created crawler instructions and a sitemap. |
| 2026-11-02 | `_headers` | Added security and caching headers. |
| 2026-11-02 | `README.md` | Updated for Part 3: new features, SEO notes, changelog and references. |

### Edits made from Part 2 feedback
Comprehensive updates or changes made based on feedback. Changelog is detailed and well-documented.
External stylesheet created and correctly implemented in all pages.
Pseudo-classes are used comprehensively and effectively. Interactive elements are styled correctly, enhancing user interaction.
Image adjustments are comprehensive and well-implemented. Images adapt seamlessly to different screen sizes.
README document is comprehensive and well-detailed.
The changelog is comprehensive and well-detailed.
References are comprehensive and correctly formatted.

| Feedback received (Part 2) | File(s) changed | What I changed and why |
I have added JavaScript and CSS

---

## 5. References

Truehost, 2026. Cheapest domain registration in South Africa. [Online] Available at: https://truehost.co.za/cheapest-domain-registration-south-africa/ [Accessed 02 November 2026].

CJX Studios, 2026. Website registration cost in South Africa. [Online] Available at: https://cjxstudio.co.za/website-registration-cost-south-africa-2026.html [Accessed 02 November 2026].

Department of Agriculture, Land Reform and Rural Development (DALRRD), 2026. About the Department. [Online] Available at: https://www.dalrrd.gov.za [Accessed 02 November 2026].

Leaflet, 2023. Leaflet: an open-source JavaScript library for interactive maps (v1.9.4). [Online] Available at: https://leafletjs.com [Accessed 02 November 2026].

OpenStreetMap contributors, 2026. OpenStreetMap. [Online] Available at: https://www.openstreetmap.org [Accessed 02 November 2026].

Mozilla Developer Network, 2026. Client-side form validation. [Online] Available at: https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation [Accessed 02 November 2026].

Google, 2026. Search Engine Optimization (SEO) Starter Guide. [Online] Available at: https://developers.google.com/search/docs/fundamentals/seo-starter-guide [Accessed 02 November 2026].

Netlify, 2026. Netlify Forms and headers documentation. [Online] Available at: https://docs.netlify.com [Accessed 02 November 2026].
