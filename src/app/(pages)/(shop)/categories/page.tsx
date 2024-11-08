import { fetchCategories } from '@/actions/categories';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Pagination from '@/components/layout/main/pagination';
import NotFoundPart from '@/components/layout/main/not-found-part';

const CategoriesPage = async ({ searchParams }: {
    searchParams: Promise<{
        page?: string, category?: string; minPrice?: string;
        maxPrice?: string;
    }>
}) => {
    const search = await searchParams
    const page = search.page;
    const pageNo = parseInt(page || "1")
    const { categories, totalPages } = await fetchCategories({ page: pageNo });

    if (categories.length < 0) {
        return <div className="p-6 relative text-center">
            <h1 className="text-4xl font-bold">Categories</h1>
            <p className="mt-4 pb-4 text-gray-500 dark:text-gray-300">
                Explore our wide range of frozen products categorized for your convenience.
            </p>
            <NotFoundPart short>
                No Categories Available!
            </NotFoundPart>
        </div>

    }


    return (
        <div className="p-6 relative text-center">
            <h1 className="text-4xl font-bold">Categories</h1>
            <p className="mt-4 pb-4 text-gray-500 dark:text-gray-300">
                Explore our wide range of frozen products categorized for your convenience.
            </p>
            <div className="flex gap-2 mt-6 justify-center items-center flex-wrap">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className="p-4 rounded-lg transition-transform transform hover:scale-95 duration-200 border gap-2 w-full sm:w-1/3 md:w-1/4 lg:w-1/5"
                    >
                        <h2 className="text-xl font-semibold">{category.name}</h2>
                        <p className="mt-2 text-gray-600 text-sm dark:text-gray-300">{category.description}</p>
                        <Link href={`/categories/${category.slug}`} passHref>
                            <Button className="mt-4 px-4 py-2">
                                View Products
                            </Button>
                        </Link>
                    </div>
                ))}
            </div>
            <Pagination currentPage={pageNo} totalPages={totalPages} searchParams={search} />
        </div>
    );
};

export default CategoriesPage;
