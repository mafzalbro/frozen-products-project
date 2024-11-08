"use client";

import * as React from "react";
import { Check, ChevronsUpDown, TagIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { fetchCategories } from "@/actions/categories";

// Define the Category type
type Category = {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
  image_url?: string | undefined;
  description?: string | undefined;
};

// Props for CategorySelect
interface CategorySelectProps {
  selectedCategory: string | null;
  onSelect: (categoryName: string) => void;
}

const CategorySelect: React.FC<CategorySelectProps> = ({
  selectedCategory,
  onSelect,
}) => {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  // Fetch categories when the component mounts
  React.useEffect(() => {
    const getCategories = async () => {
      try {
        const { categories } = await fetchCategories({});
        setCategories(categories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };
    getCategories();
  }, []);

  const handleCategorySelect = (categoryName: string) => {
    onSelect(categoryName);
    setOpen(false);
  };

  if (loading) {
    return <div className="flex gap-2 items-center">
      <TagIcon className="text-gray-500 inline-block" />
      <label htmlFor="category" className="flex flex-col flex-1 gap-2">
        Select Category
        <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
      </label>
    </div>
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="flex gap-2 items-center">
        <TagIcon className="text-gray-500 inline-block" />
        <label htmlFor="category" className="flex flex-col flex-1 gap-2">
          Select Category
          <PopoverTrigger asChild>
            <div className="w-full">
              <Button
                type="button"
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between !rounded-lg cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <span>{selectedCategory || "Select Category..."}</span>
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </div>
          </PopoverTrigger>
        </label>
      </div>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Search category..." />
          <CommandList>
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              {categories.map((category) => (
                <CommandItem
                  key={category.id}
                  value={category.name}
                  onSelect={() => handleCategorySelect(category.name)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedCategory === category.name
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {category.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CategorySelect;
