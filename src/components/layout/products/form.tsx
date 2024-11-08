"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createProduct, updateProduct } from "@/actions/products";
import { FrozenProduct } from "@/types";

interface ProductFormProps {
  product?: FrozenProduct;  // Optional, used for editing
  onSave: () => void;       // Callback to refresh the list
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSave }) => {
  const [formData, setFormData] = useState<Partial<FrozenProduct>>({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    image_url: product?.image_url || "",
    stock: product?.stock || 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (product) {
      await updateProduct({ ...formData, id: product.id }); // Update product
    } else {
      await createProduct(formData); // Create new product
    }
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="name"
        placeholder="Product Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <Textarea
        name="description"
        placeholder="Product Description"
        value={formData.description}
        onChange={handleChange}
        rows={4}
        required
      />
      <Input
        name="price"
        type="number"
        placeholder="Price"
        value={formData.price}
        onChange={handleChange}
        required
      />
      <Input
        name="image_url"
        placeholder="Image URL"
        value={formData.image_url}
        onChange={handleChange}
        required
      />
      <Input
        name="stock"
        type="number"
        placeholder="Stock Quantity"
        value={formData.stock}
        onChange={handleChange}
        required
      />
      <Button type="submit" className="bg-blue-500 text-white">
        {product ? "Update Product" : "Create Product"}
      </Button>
    </form>
  );
};

export default ProductForm;
