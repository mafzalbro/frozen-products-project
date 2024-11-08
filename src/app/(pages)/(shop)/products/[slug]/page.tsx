// app/products/[slug]/page.tsx

import { fetchProductBySlug } from "@/actions/products";
import type { FrozenProduct } from "@/types";
import GoBack from "@/components/layout/main/goback";
import AddToCart from "@/components/layout/products/cart-button";
import FullScreenImage from "@/components/layout/products/fullscreen";
import ToggleFavorite from "@/components/layout/products/interactions/toggle-favorite";
import ToggleLike from "@/components/layout/products/interactions/toggle-like";
import AddRating from "@/components/layout/products/interactions/rating";
import AddComment from "@/components/layout/products/interactions/comments";
import { verifyUser } from "@/actions/auth";
import CommentsList from "@/components/layout/products/Comments-list";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const generateMetadata = async (props: { params: Promise<{ slug: string }> }) => {
  const slug = (await props.params).slug;
  const product: FrozenProduct | null = await fetchProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The product you are looking for does not exist.",
    };
  }

  const title = `${product.name} - Frozen Products`;
  const description = product.description
    ? product.description.replace(/<\/?[^>]+(>|$)/g, "").slice(0, 160) + "..."
    : "Browse our selection of frozen products.";
  const url = `/products/${slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: product.image_url || "/placeholders/product.png",
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [product.image_url || "/placeholders/product.png"],
    },
  };
};

const ProductDetailsPage = async (props: { params: Promise<{ slug: string }> }) => {
  const slug = (await props.params).slug;
  const { isAuthenticated, user } = await verifyUser();
  const userId = isAuthenticated ? user?.id : null;
  const product: FrozenProduct | null = await fetchProductBySlug(slug);

  const renderDate = (createdAt: (string | undefined)) => {
    const date = new Date(createdAt || 0).toLocaleString()
    return <span>
      {date}
    </span>
  }


  if (!product) {
    return <div className="text-center mt-8 p-8 h-60">Product not found</div>;
  }

  const productId = product.id;
  const isRated = userId ? product?.rating_users?.includes(userId) || false : false;

  return (
    <div className="p-6 max-w-4xl mx-auto my-10">
      <GoBack link="/products">See All Products</GoBack>
      <h1 className="text-4xl my-4">{product.name}</h1>
      <p className="text-xs mb-4">{renderDate(product.createdAt)}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {product.image_url && (
          <div className="flex justify-center flex-col">
            <FullScreenImage images={product.detailed_images} altText={product.name} />
          </div>
        )}
        <div className="flex flex-col justify-between">
          <div>
            <p
              className="prose dark:prose-invert mt-4 text-gray-600 dark:text-gray-300 max-h-28 overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 border rounded-lg inline-block p-2">Category: {" "} {product.category} (
              <Link href={"/categories"} className="text-blue-600 dark:text-blue-300">
                Explore All
              </Link>
              )
            </p>
          </div>
          <p className="mt-2 text-lg font-semibold">Price: ${product.price}</p>
          <AddToCart product={product} main={true} />
        </div>
      </div>

      {/* User Interaction Components */}
      {productId && (
        <div className="mt-8 flex gap-2 flex-row">
          <ToggleFavorite productId={productId} initialFavorites={product.favourites || []} userId={userId} />
          <ToggleLike productId={productId} initialLikes={product.likes_users || []} userId={userId || null} />
        </div>
      )}

      {(product.rating_number && product.rating_count) ? (
        <div className="mt-4 border rounded-lg p-4 flex gap-2 justify-center items-center text-sm">
          <Badge variant="secondary">{product.rating_number}</Badge>
          Star Ratings by
          <Badge variant="secondary">{product.rating_count}</Badge>
          {Math.round(product.rating_count) === 1 ? "User" : "Users"}
        </div>
      ) : null}

      {/* User Rating and Comment Components */}
      {productId && (
        <div className="mt-8 flex gap-4 flex-col my-4">
          <AddRating productId={productId} isRatedInitially={isRated} />
          <AddComment productId={productId} />
        </div>
      )}

      {product.comments && <CommentsList comments={product.comments} currentUserId={userId || null} />}
    </div>
  );
};

export default ProductDetailsPage;
