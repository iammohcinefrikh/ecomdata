import nodemailer from "nodemailer";
import Product from "@/lib/models/productModel";
import dbConnect from "../dbConnect";

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "maddison53@ethereal.email",
    pass: "jn7jnAPss4f63QBp6D",
  },
});

async function updateProductPrices() {
  await dbConnect();

  const products = await Product.find({});

  for (const product of products) {
    try {
      const { default: scraper } = await import(`@/lib/scrappers/${product.productWebsite}Scrapper`);
      const { productPrice } = await scraper(product.productUrl);
      
      if (productPrice) {
        const lastPriceEntry = product.productPriceHistory[product.productPriceHistory.length - 1];

        if (lastPriceEntry && productPrice < lastPriceEntry.productPrice) {
          for (const user of product.productUsers) {
            await transporter.sendMail({
              from: "your-email@gmail.com",
              to: user.userEmail,
              subject: `Price Drop Alert for ${product.productName}`,
              text: `The price of ${product.productName} has dropped to ${productPrice}. Check it out at ${product.productUrl}`
            });
          }
        }
        product.productPriceHistory.push({ productPrice, priceLogDate: new Date() });
        product.productPrice = productPrice;
        await product.save();
      }
    } 
    
    catch (error) {
      console.error(`Error processing product ${product.productName} from ${product.productWebsite}:`, error);
    }
  }
}

// updateProductPrices()
//   .then(() => {
//   console.log("Product prices updated and notifications sent if applicable.");
//   }).catch(err => {
//   console.error("Error updating product prices:", err);
// });