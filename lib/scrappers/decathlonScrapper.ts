import puppeteer from "puppeteer";

interface ProductDetails {
  productName: string | undefined;
  productPrice: string | undefined;
}

export async function decathlonScrapper(productUrl: string): Promise<ProductDetails> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(productUrl, { waitUntil: "domcontentloaded" });

  const productName = await page.evaluate(() => {
    const titleElement = document.querySelector("h1.h1.js-title");
    return titleElement ? titleElement.textContent : undefined;
  });

  const productPrice = await page.evaluate(() => {
    const priceElement = document.querySelector(".price-current .price-text");
    return priceElement ? priceElement.textContent : undefined;
  });

  await browser.close();

  return { 
    productName: productName ?? undefined,
    productPrice: productPrice ?? undefined
  };
}