# Your Company — Static Site

Plain HTML / CSS / JS. Open `index.html` in a browser, or run a local server:

```bash
cd site
python3 -m http.server 8000
# open http://localhost:8000
```

## Files
- `index.html` — Home
- `about.html` — About Us
- `products.html` — Products
- `contact.html` — Contact
- `styles.css` — All styles (design tokens at the top)
- `script.js` — Mobile menu + contact form demo handler
- `images/` — All images (logo, hero, etc.)

## Adding new pages (Investors, Blog, Careers, etc.)
1. Duplicate any existing `.html` file (e.g. `about.html`) → rename to `investors.html`.
2. Update `<title>` and the `<section class="section">` body content.
3. Add a nav item in the `<ul class="nav-links">` block of **every** page:
   ```html
   <li><a href="investors.html">Investors</a></li>
   ```
4. Add the same link to the footer's Quick Links list.

## Replacing branding
- Swap `images/logo.png` with your real logo (keep the filename).
- Find/replace `YOURCO` and `YOUR COMPANY LIMITED` in all `.html` files.
- Replace `info@yourcompany.com`, address and phone in the footer + contact page.

## Theme tokens
Edit colors/fonts at the top of `styles.css` under `:root { ... }`.
