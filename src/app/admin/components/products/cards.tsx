"use client";
import { Button } from "@/components/ui/button";
import { FrozenProduct } from "@/types";
import Image from "next/image";

interface ProductCardProps {
  product: FrozenProduct;
  onDelete: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onDelete }) => {
  return (
    <div className="border p-4 rounded-lg">
      {product.image_url && <Image src={product.image_url} alt={product.name} className="w-full h-48 object-cover rounded-md" />}
      <h3 className="text-xl font-bold mt-2">{product.name}</h3>
      <p className="text-gray-600">{product.description}</p>
      <p className="font-semibold mt-2">${product?.price?.toFixed(2)}</p>
      <p className="text-sm text-gray-500">Stock: {product.stock}</p>
      <Button onClick={() => onDelete(product.id!)} className="mt-4 bg-red-500 text-white">
        Delete
      </Button>
    </div>
  );
};

export default ProductCard;
