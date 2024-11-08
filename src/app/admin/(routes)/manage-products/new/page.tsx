"use client";

import { useState, useEffect } from "react";
import { createProduct } from "@/actions/products";
import { FrozenProduct } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  PlusIcon,
  DollarSignIcon,
  TagIcon,
  ArchiveIcon,
  LoaderIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import imageCompression from 'browser-image-compression';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Image from "next/image";
import RichTextEditor from "@/app/admin/components/admin/rich-text-editor"
import CategorySelect from "@/app/admin/components/products/select-category/select";


const NewProductForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<Omit<FrozenProduct, 'id' | 'createdAt'>>({
    name: "",
    description: "",
    price: 0,
    image_url: "",
    detailed_images: [],
    stock: 0,
    slug: "",
    category: "",
  });

  const [mainImageMode, setMainImageMode] = useState<'url' | 'upload'>('url');
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImageURL, setMainImageURL] = useState("");
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [detailedImages, setDetailedImages] = useState<{ file?: File; url?: string; preview?: string; mode: 'url' | 'upload' }[]>([{ file: undefined, url: "", mode: 'url' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const slug = formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    setFormData(prev => ({ ...prev, slug }));
  }, [formData.name]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleCategoryChange = (categoryName: string) => {
    setFormData((prev) => ({ ...prev, category: categoryName }));
  };



  const handleMainImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMainImageFile(e.target.files[0]);
      setMainImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleMainImageURLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMainImageURL(e.target.value);
  };

  const handleDetailedImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedImages = [...detailedImages];
    if (e.target.files && e.target.files[0]) {
      updatedImages[index] = { ...updatedImages[index], file: e.target.files[0], preview: URL.createObjectURL(e.target.files[0]) };
      setDetailedImages(updatedImages);
    }
  };

  const handleDetailedImageURLChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedImages = [...detailedImages];
    updatedImages[index] = { ...updatedImages[index], url: e.target.value };
    setDetailedImages(updatedImages);
  };

  const handleDetailedImageModeChange = (index: number, mode: 'url' | 'upload') => {
    const updatedImages = [...detailedImages];
    updatedImages[index].mode = mode;
    setDetailedImages(updatedImages);
  };

  const handleAddDetailedImage = () => {
    setDetailedImages([...detailedImages, { file: undefined, url: "", mode: 'url' }]);
  };


  const handleDescriptionChange = (richText: string) => {
    setFormData((prev) => ({ ...prev, description: richText }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const base64MainImage = mainImageMode === 'upload' && mainImageFile
        ? await convertFileToBase64(mainImageFile)
        : mainImageURL;

      const base64DetailedImages = await Promise.all(
        detailedImages.map(async (image) => {
          if (image.file) {
            return await convertFileToBase64(image.file);
          }
          return image.url;
        })
      );

      const productData: Partial<FrozenProduct> = {
        ...formData,
        image_url: base64MainImage || "",
        detailed_images: base64DetailedImages.filter((url): url is string => !!url),
      };

      const newProduct = await createProduct(productData);
      router.push('/admin/manage-products');
      console.log("Product created:", newProduct);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '';

      console.log(errorMessage);

      if (errorMessage.includes("null prototypes") || errorMessage.includes("Only plain objects")) {
        router.push('/admin/manage-products');
      } else {
        setError("An unexpected error occurred. Please try again.");
      }

      console.error("Error creating product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const convertFileToBase64 = async (file: File | null): Promise<string> => {
    if (!file) throw new Error("No file provided");

    const options = {
      maxSizeMB: 0.05,
      maxWidthOrHeight: 360,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();

      return new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => reject("Error reading file");
        reader.readAsDataURL(compressedFile);
      });
    } catch (error) {
      console.log(error);
      throw new Error("Error compressing image");
    }
  };

  const handlePreviewMainImage = async () => {
    try {
      const response = await fetch(mainImageURL);
      if (!response.ok) throw new Error("Invalid image URL");
      setMainImagePreview(mainImageURL);
    } catch (error) {
      console.log(error);
      setError("Invalid image URL. Please check and try again.");
    }
  };

  const handlePreviewDetailedImage = async (index: number) => {
    const image = detailedImages[index];
    if (image.mode === 'url' && image.url) {
      try {
        const response = await fetch(image.url);
        if (!response.ok) throw new Error("Invalid image URL");
        image.preview = image.url; // Set the preview to the valid URL
        const updatedImages = [...detailedImages];
        updatedImages[index] = image;
        setDetailedImages(updatedImages);
      } catch (error) {
        console.log(error);

        setError("Invalid detailed image URL. Please check and try again.");
      }
    } else if (image.file) {
      image.preview = URL.createObjectURL(image.file);
      const updatedImages = [...detailedImages];
      updatedImages[index] = image;
      setDetailedImages(updatedImages);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Add New Product</h2>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-2">
          <TagIcon className="text-gray-500" />
          <label htmlFor="name" className="w-full">
            Name
            <Input
              id="name"
              className="w-full mt-1"
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>

        <div className="flex items-start space-x-2">
          <ArchiveIcon className="text-gray-500" />
          <label htmlFor="description" className="w-full">
            Description
            <div className="my-2">
              <RichTextEditor
                value={formData.description}
                onChange={handleDescriptionChange}
              />
            </div>
          </label>
        </div>

        {/* <div className="flex items-center space-x-2">
          <TagIcon className="text-gray-500" />
          <label htmlFor="category" className="w-full">
            Category
            <Input
              id="category"
              className="w-full mt-1"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleInputChange}
              required
            />
          </label>
        </div> */}

        <CategorySelect onSelect={handleCategoryChange} selectedCategory={formData.category} />

        <div className="flex items-center space-x-2">
          <DollarSignIcon className="text-gray-500" />
          <label htmlFor="price" className="w-full">
            Price
            <Input
              id="price"
              className="w-full mt-1"
              type="number"
              name="price"
              placeholder="Price in USD"
              value={formData.price}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
            />
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <label className="w-full">
            Main Image
            <Tabs defaultValue="url" onValueChange={(value) => setMainImageMode(value as 'url' | 'upload')} className="w-full mt-2">
              <TabsList className="w-full">
                <TabsTrigger value="url" className="flex-1">URL</TabsTrigger>
                <TabsTrigger value="upload" className="flex-1">Upload</TabsTrigger>
              </TabsList>
              <TabsContent value="url">
                <Input
                  placeholder="Enter image URL"
                  value={mainImageURL}
                  onChange={handleMainImageURLChange}
                />
                <Button type="button" variant={'outline'} onClick={handlePreviewMainImage} className="mt-2">
                  Preview Image
                </Button>
                {mainImagePreview && (
                  <Image height={300} width={300} src={mainImagePreview} alt="Main Preview" className="w-full h-40 mt-2 object-contain" />
                )}
              </TabsContent>
              <TabsContent value="upload">
                <Input
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  onChange={handleMainImageFileChange}
                />
                {mainImagePreview && (
                  <Image height={300} width={300} src={mainImagePreview} alt="Main Preview" className="w-full h-40 mt-2 object-contain" />
                )}
              </TabsContent>
            </Tabs>
          </label>
        </div>

        <div>
          <h3 className="text-lg font-medium">Detailed Images</h3>
          {detailedImages.map((image, index) => (
            <div key={index} className="mt-4">
              <label className="w-full">
                <Tabs defaultValue="url" onValueChange={(value) => handleDetailedImageModeChange(index, value as 'url' | 'upload')} className="w-full">
                  <TabsList className="w-full">
                    <TabsTrigger value="url" className="flex-1">URL</TabsTrigger>
                    <TabsTrigger value="upload" className="flex-1">Upload</TabsTrigger>
                  </TabsList>
                  <TabsContent value="url">
                    <Input
                      placeholder="Enter detailed image URL"
                      value={image.url}
                      onChange={(e) => handleDetailedImageURLChange(index, e)}
                    />
                    <Button variant={'outline'} type="button" onClick={() => handlePreviewDetailedImage(index)} className="mt-2">
                      Preview Image
                    </Button>
                  </TabsContent>
                  <TabsContent value="upload">
                    <Input
                      type="file"
                      accept=".png, .jpg, .jpeg"
                      onChange={(e) => handleDetailedImageUpload(index, e)}
                    />
                  </TabsContent>
                </Tabs>
              </label>
              {image.preview && (
                <Image height={300} width={300} src={image.preview} alt={`Detailed Preview ${index + 1}`} className="w-full h-40 mt-2 object-contain" />
              )}
            </div>
          ))}
          <Button type="button" onClick={handleAddDetailedImage} className="mt-2"
            disabled={!(!!detailedImages[detailedImages.length - 1]?.file) && !(!!detailedImages[detailedImages.length - 1]?.url) && (detailedImages.length !== 0)}>
            Add More Image
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <label className="w-full">
            Stock
            <Input
              type="number"
              className="w-full mt-1"
              name="stock"
              placeholder="Stock quantity"
              value={formData.stock}
              onChange={handleInputChange}
              required
              min="0"
            />
          </label>
        </div>

        {/* Product Slug */}
        <div className="flex items-center space-x-2">
          <TagIcon className="text-gray-500" />
          <label htmlFor="slug" className="w-full">
            Slug
            <Input
              id="slug"
              className="w-full mt-1"
              name="slug"
              placeholder="Unique identifier (slug)"
              value={formData.slug}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>

        <Button type="submit" disabled={isSubmitting || !formData.name || !formData.description || !formData.category || !formData.price || !formData.slug || (!mainImageURL && !mainImageFile)} className={`w-full ${isSubmitting ? 'opacity-50' : ''}`}>
          {isSubmitting ? <LoaderIcon className="animate-spin" /> : <PlusIcon />} Add Product
        </Button>
      </form>
    </div>
  );
};

export default NewProductForm;
