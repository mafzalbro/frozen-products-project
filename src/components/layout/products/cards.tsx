/* eslint-disable @next/next/no-img-element */
// components/layout/products/cards.tsx
import { FrozenProduct } from "@/types/index";
// import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import AddToCart from "@/components/layout/products/cart-button";
import ToggleFavorite from "./interactions/toggle-favorite";

interface ProductCardProps {
  product: FrozenProduct;
  noDescription?: boolean
}

const ProductCard = ({ product, noDescription }: ProductCardProps) => {
  return (
    <div className="p-2 w-full sm:w-2/4 md:w-1/3 lg:w-1/4">
      <div className="border p-2 rounded-lg relative group">
        <div className="relative">
          {product.image_url && <img
            width={640}
            height={360}
            src={product.image_url}
            alt={product.name}
            className="h-40 w-full object-cover rounded-md group-hover:scale-105 duration-300"
          />}
          <Badge variant="secondary" className="font-semibold absolute top-1 right-1">
            ${product.price}
          </Badge>
          {product.stock == 0 &&
            <Badge variant="destructive" className="font-semibold absolute bottom-1 right-1">
              Out of stock
            </Badge>}
          <ToggleFavorite main initialFavorites={product?.favourites || []} productId={product.id || 0} />
        </div>
        <div className="p-2">
          <Link href={`/products/${product.slug}`} passHref className="hover:text-blue-500">
            <h2 className="text-2xl font-bold mt-2">{product.name}</h2>
          </Link>
          {!noDescription && (
            <p
              className="text-gray-600 dark:text-gray-400 text-sm py-2"
              dangerouslySetInnerHTML={{
                __html: product.description.length > 80
                  ? product.description.slice(0, 80) + "..."
                  : product.description
              }}
            />
          )}
          {/* AddToCart component for adding product to cart */}
          <AddToCart product={product} />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
