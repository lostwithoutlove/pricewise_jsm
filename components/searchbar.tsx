"use client";
import { FormEvent, useState } from "react";

const Searchbar = () => {
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = () => {};

  return (
    <form className="flex flex-wrap gap-4 mt-12" onSubmit={handleSubmit}>
      Searchbar
      <input
        type="text"
        value="text"
        onChange={() => {}}
        placeholder="Enter product link"
        className="searchbar-input"
      />
      <button type="submit" className="searchbar-btn">
        {isLoading ? "Searching..." : "Search"}
      </button>
    </form>
  );
};

export default Searchbar;
