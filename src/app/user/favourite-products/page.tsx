import { verifyUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import * as motion from "framer-motion/client";
import Link from "next/link";
import { redirect } from "next/navigation";

const FavouriteProductsPage = async () => {

    const { user, isAuthenticated } = await verifyUser()

    if (!isAuthenticated) {
        redirect('/login')
    }

    const products: { id: number; name: string; slug: string; }[] | undefined = user?.favourites

    return (
        <div className="my-10 mx-4">
            <h1 className="text-3xl">Your Favourite Products</h1>
            <div className="product-list flex gap-2 pt-8">
                {products && products?.length > 0 ? (
                    products?.map((product) => (
                        <div className="border rounded-lg px-4 py-2" key={product.id}>
                            <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                                <h2 className="text-xl">{product.name}</h2>
                                <Link href={`/products/${product.slug}`} className="text-sm text-blue-600 dark:text-blue-300" passHref><Button variant={"link"} className="px-0">Visit</Button></Link>
                            </motion.div>
                        </div>
                    ))
                ) : (
                    <p>No favourite products found.</p> // Message if no products are found
                )}
            </div>
        </div>
    );
};

export default FavouriteProductsPage;
