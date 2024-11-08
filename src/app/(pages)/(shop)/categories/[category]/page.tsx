// app/categories/[category]/page.tsx

import { fetchCategoryBySlug } from '@/actions/categories';
import { fetchProducts } from '@/actions/products';
import ProductCard from '@/components/layout/products/cards';
import GoBack from '@/components/layout/main/goback';
import { Category, FrozenProduct } from '@/types';
import Pagination from '@/components/layout/main/pagination';
import SearchFilter from '@/components/layout/products/search-filter';
import NotFoundPart from '@/components/layout/main/not-found-part';


// Server component
const CategoryPage = async (
    props: { params: Promise<{ category: string }>, searchParams: Promise<{ page: string }> }
) => {
    const searchParams = await props.searchParams;
    const params = await props.params;

    const {
        category
    } = params;

    const { page = "1" } = searchParams
    // Fetch category data
    const categoryData: Category | undefined = await fetchCategoryBySlug(category);

    if (!categoryData) {
        return <NotFoundPart>
            Category - {category} Not found.
        </NotFoundPart>;
    }

    // Fetch products based on the category
    const { products, totalPages }: { products: FrozenProduct[], totalPages: number } = (await fetchProducts({
        searchQuery: '',
        category: categoryData.slug
    }));

    return (
        <div className="p-6">

            {Object.keys(searchParams).length > 0 ? <GoBack link="/categories">
                See Main Page
            </GoBack>
                :
                <GoBack link="/categories">
                    See All Categories
                </GoBack>
            }


            <h1 className="text-3xl font-bold capitalize">Category: {categoryData.name}</h1>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Showing products for category:{" "}
                <span className="font-semibold">{categoryData.name}</span>
            </p>
            {products.length > 0 ? (
                <>
                    <div className='my-4'>
                        <SearchFilter searchParams={searchParams} />
                    </div>
                    <div className="flex flex-wrap justify-center">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                    <Pagination currentPage={parseInt(page)} totalPages={totalPages} />
                </>
            ) : (
                <NotFoundPart short>
                    No products found in this category.
                </NotFoundPart>
            )}
        </div>
    );
};

export default CategoryPage;
