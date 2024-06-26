"use server";

import { revalidatePath } from "next/cache";
import Product from "../models/product.model";
import { connectToDB } from "../scraper/mongoose";
import { scrapeBrandProduct } from "../scraper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { User } from "@/types";

export async function scrapeAndStoreProduct(productUrl: string) {
  if (!productUrl) return;

  try {
    connectToDB();

    const scrapedProduct = await scrapeBrandProduct(productUrl);

    if (!scrapedProduct) return;

    let product = scrapedProduct;

    const existingProduct = await Product.findOne({ url: scrapedProduct.url });

    if (existingProduct) {
      const updatedPriceHistory: any = [
        ...existingProduct.priceHistory,
        { price: scrapedProduct.currentPrice },
      ];

      product = {
        ...scrapedProduct,
        priceHistory: updatedPriceHistory,
        lowestPrice: getLowestPrice(updatedPriceHistory),
        highestPrice: getHighestPrice(updatedPriceHistory),
        averagePrice: getAveragePrice(updatedPriceHistory),
      };
    }

    const newProduct = await Product.findOneAndUpdate(
      { url: scrapedProduct.url },
      product,
      { upsert: true, new: true }
    );

    revalidatePath(`/products/${newProduct._id}`);
  } catch (error: any) {
    throw new Error(`Failed to create/update product: ${error.message}`);
  }
}
