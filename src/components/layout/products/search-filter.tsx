"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FaFilter } from "react-icons/fa";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Category } from "@/types";
import { Button } from "@/components/ui/button";

interface SearchFilterProps {
  categories?: Category[];
  searchParams: {
    search?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
  };
}

const SearchFilter = ({ categories, searchParams }: SearchFilterProps) => {
  const router = useRouter();
  const pathname = usePathname()
  const query = useSearchParams()
  const { search = "", category = "", minPrice = "", maxPrice = "", page = "1" } = searchParams;

  const updateQuery = (key: string, value: string) => {
    const query = new URLSearchParams(window.location.search);

    if (!value) query.delete(key);
    else query.set(key, value);

    router.push(`?${query.toString()}`);
  };

  // Debouncing function to delay updates
  const debounce = (func: (...args: string[]) => void, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: string[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const [searchTerm, setSearchTerm] = useState(search);
  const [minPriceTerm, setMinPriceTerm] = useState(minPrice);
  const [maxPriceTerm, setMaxPriceTerm] = useState(maxPrice);

  // Debounced search update
  const debouncedSearchUpdate = debounce((value: string) => {
    updateQuery("search", value);
  }, 500);

  // Debounced min price update
  const debouncedMinPriceUpdate = debounce((value: string) => {
    updateQuery("minPrice", value);
  }, 500);

  // Debounced max price update
  const debouncedMaxPriceUpdate = debounce((value: string) => {
    updateQuery("maxPrice", value);
  }, 500);

  // Update search term and call debounced function
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearchUpdate(value);
  };

  // Update min price and call debounced function
  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMinPriceTerm(value);
    debouncedMinPriceUpdate(value);
  };

  // Update max price and call debounced function
  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaxPriceTerm(value);
    debouncedMaxPriceUpdate(value);
  };

  useEffect(() => {
    if (!page) {
      updateQuery("page", "");
    }
    if (parseInt(page || "-1") < 0) {
      updateQuery("page", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const resetFilters = () => {
    router.push(`${pathname}`);
  };

  return (
    <div className="flex justify-between mx-auto flex-col-reverse sm:flex-row items-end sm:items-center mb-4 gap-3 px-4">


      {/* Search input */}
      <div className="w-full">
        <Input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="border px-4 py-2 rounded-md w-full self-center"
        />
      </div>

      {/* Category select dropdown */}
      <div className="flex gap-4 w-full">
        {categories && (
          <Select defaultValue={category} onValueChange={(value) => updateQuery("category", value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Filter button with price range */}
        <Popover>
          <PopoverTrigger asChild className="w-full rounded-md flex items-center gap-2">
            <div className="flex-1">
              <Button variant={"outline"}>
                <FaFilter />
                Range
              </Button>
            </div>
          </PopoverTrigger>
          <PopoverContent className="p-4">
            <div className="flex flex-col gap-4">
              {/* Min price input */}
              <Input
                type="number"
                placeholder="Min price"
                value={minPriceTerm}
                onChange={handleMinPriceChange}
                className="border px-4 py-2 rounded-md w-full self-center"
              />

              {/* Max price input */}
              <Input
                type="number"
                placeholder="Max price"
                value={maxPriceTerm}
                onChange={handleMaxPriceChange}
                className="border px-4 py-2 rounded-md w-full self-center"
              />
            </div>
          </PopoverContent>
        </Popover>
        {/* Reset Filters Button */}

      </div>
      {query?.keys()?.toArray()?.length !== 0 && <Button onClick={resetFilters} variant="outline" className="self-center w-full">
        Reset
      </Button>
      }
    </div>
  );
};

export default SearchFilter;
