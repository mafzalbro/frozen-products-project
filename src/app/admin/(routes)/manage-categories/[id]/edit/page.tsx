/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { fetchCategories, fetchCategoryById, modifyCategory } from "@/actions/categories";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Image from "next/image";
import imageCompression from 'browser-image-compression';
import {
    PlusIcon,
    LoaderIcon,
    TagIcon,
    ArchiveIcon,
    DollarSignIcon,
    ImageIcon,
} from "lucide-react";
import { MdInsertEmoticon } from "react-icons/md";
import Link from "next/link";
import { GrFormPrevious } from "react-icons/gr";
import Loader from "@/components/layout/spinners/Loader";
// import RichTextEditor from "@/app/admin/components/admin/rich-text-editor";

// Debounce function
// const debounce = (func: (arg: string) => void, delay: number) => {
//     let timeoutId: NodeJS.Timeout;
//     return (arg: string) => {
//         if (timeoutId) {
//             clearTimeout(timeoutId);
//         }
//         timeoutId = setTimeout(() => {
//             func(arg);
//         }, delay);
//     };
// };

const NewCategoryForm = ({ params }: { params: Promise<{ id: number }> }) => {

    const router = useRouter();
    const [formData, setFormData] = useState({
        id: 0,
        name: "",
        slug: "",
        description: "",
        image_url: "",
    });
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageURL, setImageURL] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [showImagePreview, setShowImagePreview] = useState(false); // State for controlling image preview visibility
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const getCategories = async () => {
            try {

                const { id } = await params
                const category = await fetchCategoryById(id)

                setFormData({
                    id: category?.id || 0,
                    name: category?.name || '',
                    description: category?.description || "",
                    image_url: category?.image_url || "",
                    slug: category?.slug || "",
                })

                if (category?.image_url) {
                    setImageURL(category?.image_url)
                    setImagePreview(category?.image_url)
                    setShowImagePreview(true)
                }
            } catch (error) {
                console.log("error occured: " + error);
            } finally {
                setLoading(false)
            }

        }

        getCategories()
    }, [params])


    // Debounced slug generation
    // const debouncedSlugGeneration = debounce((name: string) => {
    //     const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    //     setFormData(prev => ({ ...prev, slug }));
    // }, 300);

    // useEffect(() => {
    //     debouncedSlugGeneration(formData.name);
    // }, [debouncedSlugGeneration, formData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
            setImagePreview(URL.createObjectURL(e.target.files[0]));
            setShowImagePreview(true);
        }
    };

    const handleImageURLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setImageURL(e.target.value);
    };

    const handleShowPreview = () => {
        setShowImagePreview(true); // Show the URL image preview
    };

    const checkForDuplicate = async (name: string) => {
        try {
            const { categories } = await fetchCategories({ name });
            return categories.length > 0;
        } catch (error) {
            console.error("Error fetching categories:", error);
            setError("Could not verify category uniqueness.");
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        // Validate that at least one image option is selected
        // if (!imageURL && !imageFile) {
        //     setError("Please provide either an image URL or upload a file.");
        //     setIsSubmitting(false);
        //     return;
        // }

        try {
            const isDuplicate = await checkForDuplicate(formData.name);
            if (isDuplicate) {
                setError("Category name already exists.");
                return;
            }

            let compressedImageUrl = "";
            if (imageMode === 'upload' && imageFile) {
                const compressedFile = await imageCompression(imageFile, {
                    maxSizeMB: 0.01,
                    maxWidthOrHeight: 360,
                    useWebWorker: true
                });
                compressedImageUrl = await convertFileToBase64(compressedFile);
            } else {
                compressedImageUrl = imageURL;
            }

            await modifyCategory(JSON.parse(JSON.stringify({ ...formData, image_url: compressedImageUrl })), formData.id);
            router.push("/admin/categories");
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : '';

            console.log(errorMessage);

            if (errorMessage.includes("null prototypes") || errorMessage.includes("Only plain objects")) {
                router.push('/admin/manage-categories');
            } else {
                setError("Failed to update category." + err);
            }

        } finally {
            setIsSubmitting(false);
        }
    };

    const convertFileToBase64 = async (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = () => reject("Error reading file");
            reader.readAsDataURL(file);
        });
    };

    // Disable button if required fields are empty
    // const isButtonDisabled = !formData.name || !formData.slug || (!imageURL && !imageFile);
    const isButtonDisabled = !formData.name || !formData.slug;

    if (loading) {
        return <>
            <Loader />
        </>
    }

    return (
        <div className="max-w-md mx-auto p-4 shadow-md rounded-md">
            <Link passHref href={'/admin/manage-categories'}>
                <Button type="button" variant={"outline"}><GrFormPrevious /> Go To Manage Categories Section</Button>
            </Link>
            <h1 className="text-4xl font-semibold flex items-center my-10">
                <MdInsertEmoticon className="h-6 w-6 mr-2" /> Update Category: {formData.id}
            </h1>
            {error && <div className="mb-4 text-red-600">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="flex items-center my-4">
                        <TagIcon className="h-5 w-5 mr-2" /> Name
                    </label>
                    <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="slug" className="flex items-center my-4">
                        <ArchiveIcon className="h-5 w-5 mr-2" /> Slug (Immutable to Update)
                    </label>
                    <Input
                        id="slug"
                        name="slug"
                        value={formData.slug}
                        // onChange={handleInputChange}
                        disabled
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description" className="flex items-center my-2">
                        <DollarSignIcon className="h-5 w-5 mr-2" /> Description (Keep Short)
                    </label>
                    <Input
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                    />
                </div>
                {/* <div>
          <label htmlFor="description" className="flex items-center my-2">
            <DollarSignIcon className="h-5 w-5 mr-2" /> Description
          </label>
          <RichTextEditor onChange={() => handleInputChange} value={formData.description} />
        </div> */}
                <div>
                    <span className="my-4">
                        <ImageIcon className="mr-2 inline-block" /> Image (Optional)
                        <p className="text-xs my-2 text-gray-600 dark:text-gray-200">If you want a custom icon image for this category</p>
                    </span>
                    <label className="w-full flex items-center">
                        <Tabs defaultValue="url" onValueChange={(value) => setImageMode(value as 'url' | 'upload')} className="w-full mt-2">
                            <TabsList className="w-full">
                                <TabsTrigger value="url" className="flex-1">URL</TabsTrigger>
                                <TabsTrigger value="upload" className="flex-1">Upload</TabsTrigger>
                            </TabsList>
                            <TabsContent value="url">
                                <Input
                                    placeholder="Enter image URL"
                                    value={imageURL}
                                    onChange={handleImageURLChange}
                                />
                                <Button type="button" variant="outline" onClick={handleShowPreview} className="mt-2">
                                    Show Preview
                                </Button>
                                {showImagePreview && imageURL && (
                                    <img height={300} width={300} src={imageURL} alt="Image Preview" className="w-full h-40 mt-2 object-contain" />
                                )}
                            </TabsContent>
                            <TabsContent value="upload">
                                <Input
                                    type="file"
                                    accept=".png, .jpg, .jpeg"
                                    onChange={handleImageFileChange}
                                />
                                {imagePreview && (
                                    <Image height={300} width={300} src={imagePreview} alt="Image Preview" className="w-full h-40 mt-2 object-contain" />
                                )}
                            </TabsContent>
                        </Tabs>
                    </label>
                </div>
                <Button type="submit" disabled={isButtonDisabled || isSubmitting} className="flex items-center w-full my-10">
                    {isSubmitting ? <LoaderIcon className="animate-spin h-5 w-5" /> : <PlusIcon />}
                    {isSubmitting ? "Adding..." : "Add Category"}
                </Button>
            </form>
        </div>
    );
};

export default NewCategoryForm;
