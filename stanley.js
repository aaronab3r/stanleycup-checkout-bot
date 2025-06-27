const puppeteer = require("puppeteer-extra");
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function run() {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized']
    });

    const page = await browser.newPage();
    await page.goto("https://www.stanley1913.com/products/mothers-day-quencher-h2-0-flowstate-tumbler-40-oz?variant=53972924825960"); //Product link

    // Add's to Cart
    let selector = "button[id='ProductSubmitButton-']";
    await page.waitForSelector(selector, { visible: true });
    await page.evaluate((selector) => {
        document.querySelector(selector).click();
    }, selector);

    // Click the "Checkout" button and wait for the navigation to complete.
    // Shopify redirects to a new checkout page after this click, so we use Promise.all()
    // to ensure Puppeteer both triggers the click and waits for the new page to fully load.
    // "networkidle0" means Puppeteer will wait until there are no more network requests for at least 500ms,
    // ensuring that the checkout page is fully rendered before continuing.
    selector = "button[name='checkout']";
    await page.waitForSelector(selector, { visible: true });
    await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle0" }),
        page.click(selector)
    ]);

    // Email
    selector = "input[id='email']";
    await page.waitForSelector(selector, { visible: true, timeout: 3000 });
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
    await page.waitForSelector(selector, { visible: true, timeout: 1000 });
    await page.type(selector, "8005882300");


    await new Promise(resolve => setTimeout(resolve, 3000));

    // Wait until the "Continue to shipping" button is visible, enabled, and has the correct text
    await page.waitForFunction(() => {
        // Get all <button> elements on the page with type="submit"
        const buttons = Array.from(document.querySelectorAll("button[type='submit']"));

        // Find the one where the visible text exactly matches "Continue to shipping"
        const btn = buttons.find(b => b.textContent.trim() === "Continue to shipping");

        // Return true if:
        // - the button exists
        // - it is NOT disabled
        // - it is actually visible on the screen (offsetParent !== null)
        return btn && !btn.disabled && btn.offsetParent !== null;
    }, { timeout: 10000 }); // Wait up to 10 seconds for this condition to become true

  
    // Now click the same button after confirming it's ready
    await page.evaluate(() => {
        // Get all <button> elements on the page with type="submit"
        const buttons = Array.from(document.querySelectorAll("button[type='submit']"));

        // Find the one where the text is exactly "Continue to shipping"
        const btn = buttons.find(b => b.textContent.trim() === "Continue to shipping");

        // If found, click the button
        if (btn) btn.click();
    });

  
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


    const iframeHandle = await page.waitForSelector("iframe.card-fields-iframe");

    const frame = await iframeHandle.contentFrame();


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

run();
