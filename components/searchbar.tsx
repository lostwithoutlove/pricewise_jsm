"use client";
import { FormEvent, useState } from "react";
import { brandnames } from "@/constants";
import { scrapeAndStoreProduct } from "@/lib/actions";

const isValidURL = (url: string) => {
  try {
    const parsedURL = new URL(url);
    const hostname = parsedURL.hostname.trim();

    //Check if hostname is valid

    if (brandnames.some((brand) => hostname.includes(brand.toLowerCase()))) {
      console.log("Hostname includes one of the brand names.");
      return true;
    } else {
      console.log("Hostname does not include any of the brand names.");
      return false;
    }
  } catch (error) {
    return false;
    console.error("Invalid URL:", error);
  }
};

const Searchbar = () => {
  const [searchPrompt, setSearchPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValidLink = isValidURL(searchPrompt);
    alert(isValidLink ? "Valid Link" : "Invalid Link");
    try {
      setIsLoading(true);
      // Scrape the product page
      const product = await scrapeAndStoreProduct(searchPrompt);
      console.log("Product:", product);
      console.log("I am here");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="flex flex-wrap gap-4 mt-12" onSubmit={handleSubmit}>
      <input
        type="text"
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
        placeholder="Enter product link"
        className="searchbar-input"
      />
      <button
        type="submit"
        className="searchbar-btn"
        disabled={searchPrompt === ""}
      >
        {isLoading ? "Searching..." : "Search"}
      </button>
    </form>
  );
};

export default Searchbar;
