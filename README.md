# Stanley1913 Checkout Bot

This project is an automated checkout bot for [Stanley1913](https://www.stanley1913.com), built using Puppeteer with stealth plugin and browser request injection. The script simulates a real user adding a product to cart, filling out the shipping form, and completing checkout via credit card—all while bypassing anti-bot mechanisms.

---

## ⚙️ Features

- ✅ Add to cart using `fetch` with correct headers and session cookies  
- ✅ Autofill shipping information  
- ✅ Autofill credit card fields inside iframes  
- ✅ Puppeteer Stealth mode for anti-bot evasion  
- ✅ Double-click logic for shipping confirmation

---

## 🛠️ Requirements

- Node.js v18+  
- Mac, Windows, or Linux  
- Chrome (Puppeteer uses Chromium automatically)

### Install Dependencies

```bash
npm install puppeteer-extra puppeteer-extra-plugin-stealth
```

---

## 🚀 Usage

### 1. Clone the Repository (or create your file)

```bash
git clone https://github.com/yourusername/stanley-bot.git
cd stanley-bot
```

### 2. Create Your Bot File

Paste your code into a file like `checkoutBot.js`.

### 3. Run the Bot

```bash
node checkoutBot.js
```

> ⚠️ Make sure the product URL and variant ID inside the script are accurate.

---

## 📦 Script Flow

1. Launches Puppeteer with stealth mode  
2. Navigates to product URL  
3. Extracts required form data  
4. Sends a custom `fetch()` POST to Shopify’s `/cart/add`  
5. Goes to checkout page and fills shipping form  
6. Types card details inside Shopify iframes  
7. Completes checkout  

---

## 📝 Customization

You can update the following in the script:

- `URL`: change to the Stanley product you want to buy  
- Shipping fields (name, email, address, phone)  
- Card details (currently set to dummy test values for Stripe: `4242 4242 4242 4242`)  

---

## ❗ Disclaimer

This project is for **educational purposes only**. Use responsibly. You are responsible for how you use this code.

---

## 📄 License

MIT License
