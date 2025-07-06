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

Install dependencies:

npm install puppeteer-extra puppeteer-extra-plugin-stealth

1. Clone the repository (or create your file)
git clone https://github.com/yourusername/stanley-bot.git
cd stanley-bot

2. Create your bot file
Paste your code into a file like checkoutBot.js.

3. Run the bot
node checkoutBot.js
⚠️ Make sure the product URL and variant ID inside the script are accurate.

📦 Script Flow
Launches Puppeteer with stealth mode
Navigates to product URL
Extracts required form data
Sends a custom fetch() POST to Shopify’s /cart/add
Goes to checkout page and fills shipping form
Types card details inside Shopify iframes
Completes checkout

📝 Customization
You can update the following in the script:
URL: change to the Stanley product you want to buy
Shipping fields (name, email, address, phone)
Card details (currently set to dummy test values for Stripe: 4242 4242 4242 4242)

❗ Disclaimer
This project is for educational purposes only. Use responsibly. You are responsible for how you use this code.

📄 License
MIT License
Let me know if you want this formatted for a public repo with images, badges, or multiple file structure support.
