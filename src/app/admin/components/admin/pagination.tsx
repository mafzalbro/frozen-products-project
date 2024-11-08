import { Button } from "@/components/ui/button";
import {
  Pagination as ShadcnPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import Link from "next/link";
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  searchParams?: {
    search?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
  }; // Adjusted searchParams type
}


const Pagination = ({ currentPage, totalPages, searchParams }: PaginationProps) => {
  const renderPageNumbers = () => {
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pages.push(
          <PaginationItem key={i}>
            <Link
              href={{ query: { ...searchParams, page: i } }} // Include searchParams in the query
              passHref
            >
              <Button
                variant={"outline"}
                className={currentPage === i ? "bg-blue-900 dark:bg-blue-800 text-white hover:bg-blue-900 hover:dark:bg-blue-800 pointer-events-none" : ""}
              >
                {i}
              </Button>
            </Link>
          </PaginationItem>
        );
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    return pages;
  };

  if (totalPages > 1) {
    return (
      <ShadcnPagination className="flex justify-center space-x-2 mt-8" aria-label="Pagination">
        <PaginationContent>
          <Link href={{ query: { ...searchParams, page: currentPage - 1 } }} passHref>
            <Button variant={'ghost'} className={`${currentPage === 1 ? 'hidden' : 'visible'}`}>
              <MdOutlineNavigateBefore />
            </Button>
          </Link>
          {renderPageNumbers()}
          <Link href={{ query: { ...searchParams, page: currentPage + 1 } }} passHref>
            <Button variant={"ghost"} className={`${currentPage === totalPages ? 'hidden' : 'visible'}`}>
              <MdOutlineNavigateNext />
            </Button>
          </Link>
        </PaginationContent>
      </ShadcnPagination>
    );
  }

  return null; // Add a return for cases where totalPages is 0
};

export default Pagination;
