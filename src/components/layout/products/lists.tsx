"use client";
import { useState, useEffect } from "react";
import { fetchProducts } from "@/actions/products";
import { FrozenProduct } from "@/types/index";
import ProductCard from "@/components/layout/products/cards";

const ProductList = () => {
  const [products, setProducts] = useState<FrozenProduct[]>([]);

  const loadProducts = async () => {
    const data = await fetchProducts({});
    setProducts(data.products);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
