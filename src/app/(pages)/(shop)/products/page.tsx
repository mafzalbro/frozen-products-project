// app/products/page.tsx
import { fetchProducts } from "@/actions/products";
import { FrozenProduct } from "@/types/index";
import ProductCard from "@/components/layout/products/cards";
import Pagination from "@/components/layout/main/pagination";
import SearchFilter from "@/components/layout/products/search-filter";
import { fetchCategories } from "@/actions/categories";
import GoBack from "@/components/layout/main/goback";
import { IoMdSad } from "react-icons/io";

interface ProductPageProps {
  search: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  page: string;
}

export const generateMetadata = async ({ searchParams }: { searchParams: Promise<ProductPageProps> }) => {
  const { search = "", category = "", page = "1" } = await searchParams;

  const title = `Products ${search ? ` - Search: ${search}` : ""} ${category ? ` - Category: ${category}` : ""}`;
  const description = "Browse our extensive selection of frozen products, including categories like fruits, vegetables, and more. Find what you need at the best prices.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/products?page=${page}&search=${search}&category=${category}`,
      images: [
        {
          url: "/images/product/listing.png",
          width: 1200,
          height: 630,
          alt: "Frozen Products",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/product/listing.png"],
    },
  };
};

const ProductsPage = async (props: { searchParams: Promise<ProductPageProps> }) => {
  const searchParams = await props.searchParams;
  const pageSize = 10

  const { search = "", category = "", minPrice = "", maxPrice = "", page = "1" } = searchParams;

  // Fetch products based on search params
  const data = await fetchProducts({
    searchQuery: search,
    category,
    minPrice: Number(minPrice),
    maxPrice: Number(maxPrice),
    pageSize: `${pageSize}`,
    page,
  });

  const { categories } = await fetchCategories({});

  const totalPages = data.totalPages || 0;

  return (
    <div className="p-4 md:p-6 w-screen overflow-x-hidden">
      {Object.keys(searchParams).length > 0 && (
        <GoBack link="/products">
          See Main Page
        </GoBack>
      )}
      <h1 className="text-3xl font-bold my-4 mb-6 mx-5">Products</h1>
      {/* Updated SearchFilter with price range functionality */}
      <SearchFilter
        categories={categories}
        searchParams={{ search, category, minPrice, maxPrice, page }}
      />

      {/* Product List */}
      <div className="flex flex-wrap">
        {data.products.length > 0 ? (
          data.products.map((product: FrozenProduct) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="text-center w-full h-96 items-center flex justify-center gap-2">
            <IoMdSad size={20} />
            <span>No products found</span>
          </div>
        )}
      </div>

      {/* Pagination */}
      <Pagination currentPage={parseInt(page)} totalPages={totalPages} searchParams={searchParams} />
    </div>
  );
};

export default ProductsPage;
