# Shopify Auto Checkout Bot (Stanley1913.com)

This is a JavaScript / Puppeteer-based automation script that simulates a complete Shopify checkout process on [Stanley1913.com](https://www.stanley1913.com/). It adds a product to the cart, fills out shipping and payment info, and submits the order—all in a headless Chrome browser using stealth mode to avoid bot detection.

---

## 🚀 Features

- ✅ Adds a specific product to cart
- ✅ Auto-fills email, shipping address, and phone number
- ✅ Proceeds through shipping and payment steps
- ✅ Autofills credit card details securely through Shopify iframes
- ✅ Clicks “Pay Now” to complete the purchase
- ✅ Mimics human behavior with delays and stealth plugin

---

## 🧠 Technologies Used

- [puppeteer-extra](https://www.npmjs.com/package/puppeteer-extra)
- [puppeteer-extra-plugin-stealth](https://www.npmjs.com/package/puppeteer-extra-plugin-stealth)
- Headless Chromium via Puppeteer

---

## 📦 Installation

```bash
git clone https://github.com/yourusername/shopify-auto-checkout.git
cd shopify-auto-checkout
npm install puppeteer-extra puppeteer-extra-plugin-stealth
