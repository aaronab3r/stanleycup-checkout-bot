// Import puppeteer-extra with stealth plugin to evade bot detection
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin()); // Use stealth mode for anti-bot evasion

// Product page URL with specific variant ID
const URL = "https://www.stanley1913.com/products/the-mesa-rose-quencher-h2-o-flowstate-tumbler-20-oz?variant=53973000782184";

// Global variable to store cookies used in fetch request
var cookies = "";

/**
 * Launches a browser instance and opens a new maximized page
 */
async function givePage() {
    const browser = await puppeteer.launch({
        headless: false,              // Visible browser for debugging
        defaultViewport: null,        // No viewport resizing
        args: ["--start-maximized"]   // Start maximized
    });

    const page = await browser.newPage(); // Open new tab
    return page;
}

/**
 * Extracts cookies from the current page and returns them as a string
 */
async function parseCookies(page){
    const cookies = await page.cookies(); // Get all cookies
    let cookieList = "";
    for(let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        let cookieString = cookie.name + "=" + cookie.value;

        if(i != (cookies.length -1)){
            cookieString = cookieString + "; "; // Separate cookies with semicolon
        }
        cookieList = cookieList + cookieString;
    }
    return cookieList;
}

/**
 * Sends a POST request to add the product to cart using fetch inside browser context
 */
async function add_to_cart(page) {
    await page.waitForSelector('button[name="add"]'); // Wait for add to cart button
    cookies = await parseCookies(page); // Get formatted cookies string

    // Extract required input values from the product page
    const ID = await page.evaluate(() => {
        return document.querySelector("input[name='id']").getAttribute("value");
    });

    const productID = await page.evaluate(() => {
        return document.querySelector("input[name='product-id']").getAttribute("value");
    });

    const sectionID = await page.evaluate(() => {
        return document.querySelector("input[name='product-id']").getAttribute("value");
    });

    // Use fetch API inside the browser to simulate a cart add action via POST
    await page.evaluate( async (cookies, URL, ID, sectionID, productID) => {
        let response = await fetch("https://www.stanley1913.com/cart/add", {
            "headers": {
              "accept": "application/javascript",
              "accept-language": "en-US,en;q=0.9",
              "content-type": "multipart/form-data; boundary=----WebKitFormBoundary5tABUpuKthK5Na1f",
              "priority": "u=1, i",
              "sec-ch-ua": "\"Google Chrome\";v=\"137\", \"Chromium\";v=\"137\", \"Not/A)Brand\";v=\"24\"",
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": "\"macOS\"",
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-origin",
              "x-requested-with": "XMLHttpRequest",
              "cookie": cookies,
              "Referer": URL,
              "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            // Body simulates form data submission from Shopify cart
            "body": `------WebKitFormBoundary5tABUpuKthK5Na1f\r\nContent-Disposition: form-data; name=\"form_type\"\r\n\r\nproduct\r\n------WebKitFormBoundary5tABUpuKthK5Na1f\r\nContent-Disposition: form-data; name=\"utf8\"\r\n\r\n✓\r\n------WebKitFormBoundary5tABUpuKthK5Na1f\r\nContent-Disposition: form-data; name=\"id\"\r\n\r\n${ID}\r\n------WebKitFormBoundary5tABUpuKthK5Na1f\r\nContent-Disposition: form-data; name=\"properties[Shipping]\"\r\n\r\n\r\n------WebKitFormBoundary5tABUpuKthK5Na1f\r\nContent-Disposition: form-data; name=\"product-id\"\r\n\r\n${productID}\r\n------WebKitFormBoundary5tABUpuKthK5Na1f\r\nContent-Disposition: form-data; name=\"section-id\"\r\n\r\n${sectionID}\r\n------WebKitFormBoundary5tABUpuKthK5Na1f\r\nContent-Disposition: form-data; name=\"quantity\"\r\n\r\n1\r\n------WebKitFormBoundary5tABUpuKthK5Na1f\r\nContent-Disposition: form-data; name=\"sections\"\r\n\r\ncart-notification-product,cart-notification-button,cart-icon-bubble\r\n------WebKitFormBoundary5tABUpuKthK5Na1f\r\nContent-Disposition: form-data; name=\"sections_url\"\r\n\r\n/products/adventure-quencher-travel-tumbler-40-oz\r\n------WebKitFormBoundary5tABUpuKthK5Na1f--\r\n`,
            "method": "POST"
          });
    }, cookies, URL, ID, sectionID, productID);
}

/**
 * Fills in shipping info and clicks "Continue to shipping" twice
 */
async function shipping_info(page) {
    await page.goto("https://www.stanley1913.com/checkout", { waitUntil: "networkidle0" });

    let selector;

    // Email
    selector = "input[id='email']";
    await page.waitForSelector(selector, { visible: true, timeout: 500 });
    await page.type(selector, "JohnDoe@gmail.com");

    // First Name
    selector = "input[id='TextField0']";
    await page.type(selector, "John");

    // Last Name
    selector = "input[id='TextField1']";
    await page.type(selector, "Doe");

    // Address
    selector = "input[id='shipping-address1']";
    await page.type(selector, "1683 Jones Street");

    // City
    selector = "input[id='TextField4']";
    await page.type(selector, "Kennedale");

    // State
    selector = "select[id='Select1']";
    await page.select(selector, "TX");

    // Zip Code
    selector = "input[id='TextField5']";
    await page.type(selector, "76135");

    // Phone number
    selector = "input[id='TextField6']";
    await page.waitForSelector(selector, { visible: true, timeout: 4000 });
    await page.type(selector, "8005882300");

    // Trigger validation for phone input
    await page.evaluate(() => {
        const phoneInput = document.querySelector("input[id='TextField6']");
        phoneInput.dispatchEvent(new Event('blur'));
    });

    // Wait 2 seconds before clicking
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Wait for the button to be ready
    await page.waitForFunction(() => {
        const buttons = Array.from(document.querySelectorAll("button[type='submit']"));
        const btn = buttons.find(b => b.textContent.replace(/\s+/g, " ").trim() === "Continue to shipping");
        return btn && !btn.disabled && btn.offsetParent !== null;
    }, { timeout: 10000 });

    // First click
    await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button[type='submit']"));
        const btn = buttons.find(b => b.textContent.replace(/\s+/g, " ").trim() === "Continue to shipping");
        if (btn) btn.click();
    });

    // Wait another 2 seconds
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Second click
    await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button[type='submit']"));
        const btn = buttons.find(b => b.textContent.replace(/\s+/g, " ").trim() === "Continue to shipping");
        if (btn) btn.click();
    });
}

/**
 * Handles the credit card form inside Shopify iframes and finalizes payment
 */
async function checkout(page) {
    await page.waitForFunction(() => {
        const buttons = Array.from(document.querySelectorAll("button[type='submit']"));
        const btn = buttons.find(b => b.textContent.trim() === "Continue to payment");
        return btn && !btn.disabled && btn.offsetParent !== null;
    }, { timeout: 10000 });

    await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button[type='submit']"));
        const btn = buttons.find(b => b.textContent.trim() === "Continue to payment");
        if (btn) btn.click();
    });

    // 1. Wait for the Shopify credit card iframe to appear on the page
    const cardNumberFrameHandle = await page.waitForSelector("iframe[name^='card-fields-number']");
    // 2. Get the content frame of that iframe (lets us access its internal DOM)
    const cardNumberFrame = await cardNumberFrameHandle.contentFrame();
    // 3. Wait for the input field inside the iframe
    await cardNumberFrame.waitForSelector("input#number", { visible: true });
    // 4. Type the credit card number
    await cardNumberFrame.type("input#number", "4242424242424242", { delay: 100 });

    const expiryFrameHandle = await page.waitForSelector("iframe[name^='card-fields-expiry']");
    const expiryFrame = await expiryFrameHandle.contentFrame();
    await expiryFrame.waitForSelector("input#expiry", { visible: true });
    await expiryFrame.type("input#expiry", "1029", { delay: 100 }); // Format: MMYY

    const cvvFrameHandle = await page.waitForSelector("iframe[name^='card-fields-verification']");
    const cvvFrame = await cvvFrameHandle.contentFrame();
    await cvvFrame.waitForSelector("input#verification_value", { visible: true });
    await cvvFrame.type("input#verification_value", "321", { delay: 100 }); // CVV

    // Wait for and click "Pay now" button
    await page.waitForFunction(() => {
        const buttons = Array.from(document.querySelectorAll("button[type='submit']"));
        const btn = buttons.find(b => b.textContent.trim() === "Pay now");
        return btn && !btn.disabled && btn.offsetParent !== null;
    }, { timeout: 15000 });

    await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button[type='submit']"));
        const btn = buttons.find(b => b.textContent.trim() === "Pay now");
        if (btn) btn.click();
    });
}

/**
 * Master function to run the full automation: Add to cart → Shipping → Payment
 */
async function run(){
    const page = await givePage();             // Open browser and tab
    await page.goto(URL);                      // Go to product page
    await add_to_cart(page);                   // Add item using fetch
    await shipping_info(page);                 // Fill out shipping form
    await checkout(page);                      // Enter card and submit

    console.log('Done');                       // Confirm success
}

run(); // Start the bot
