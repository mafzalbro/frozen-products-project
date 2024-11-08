// src/app/pages/search/page.tsx
import { searchItems } from "@/actions/search";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import isNew from "@/lib/is-new";
import Form from "next/form";
import SubmitSearchButton from "@/components/layout/search/submit";

export const generateMetadata = async (props: { searchParams: Promise<{ query: string }> }) => {
    const searchParams = await props.searchParams;
    const { query } = searchParams || {};
    return {
        title: `Searched For ${query?.toUpperCase()}`,
        description: `You Searched For ${query?.toUpperCase()}`
    }
}

const SearchPage = async (props: { searchParams: Promise<{ query: string }> }) => {
    const searchParams = await props.searchParams;
    const { query } = searchParams || {};
    let searchResults = null;
    if (query) {
        const { combinedResults } = await searchItems(query);
        searchResults = combinedResults;
    }

    return (
        <div className="p-6 max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold">Search</h1>
            <p className="text-sm text-gray-600 dark:text-gray-300 my-4">
                Enter a query to search for items.
            </p>

            {/* Search Form */}
            <Form action="/search" className="mx-auto mt-6 mb-6 flex w-full !max-w-lg">
                <div className="relative flex-1">
                    <Input
                        type="text"
                        name="query"
                        required
                        defaultValue={query}
                        placeholder="Enter your search query"
                        className="border border-gray-300 rounded-full w-full pr-28 py-6 px-8"
                    />
                    <SubmitSearchButton />
                </div>
            </Form>
            {/* Search Results */}
            {query && (
                <div className="mt-6">
                    <h2 className="text-xl font-semibold">
                        Search Results for:{" "}
                        <span className="text-blue-600 dark:text-blue-400 capitalize">
                            {query}
                        </span>
                    </h2>

                    {searchResults && searchResults.length > 0 ? (
                        <ul className="mt-4 space-y-4 text-left flex flex-wrap justify-center">
                            {searchResults.map((result) => (
                                <li
                                    key={`${result.id}-${result.slug}`}
                                    className="border rounded-lg m-2 p-4 w-full sm:w-1/3 relative hover:dark:bg-gray-900 hover:bg-gray-50"
                                >
                                    <Link
                                        href={`/${result.type.toLowerCase() === 'product' ? "products" : "categories"}/${result.slug}`}
                                        passHref
                                        className="hover:text-blue-600 dark:hover:text-blue-400"
                                    >
                                        <h3 className="text-xl mb-2">{result.name}</h3>
                                    </Link>
                                    <Badge variant="secondary" className="text-gray-500 text-xs font-medium mb-2">
                                        {result.type}
                                    </Badge>
                                    {result.description && (
                                        <p
                                            className="text-gray-600 dark:text-gray-400 text-sm py-2"
                                            dangerouslySetInnerHTML={{
                                                __html:
                                                    result.description.length > 80
                                                        ? result.description.slice(0, 80) + "..."
                                                        : result.description,
                                            }}
                                        />
                                    )}
                                    {isNew(result?.createdAt || "") && (
                                        <Badge
                                            variant="destructive"
                                            className="absolute rounded-full right-0 -top-2"
                                        >
                                            New
                                        </Badge>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="mt-4 text-gray-600">
                            No results found for your query.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchPage;
