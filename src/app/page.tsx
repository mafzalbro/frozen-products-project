/* eslint-disable @next/next/no-img-element */
import * as motion from "framer-motion/client";
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Image from "next/image";
import homepageData from '@/store/home.json';
import wait from "@/lib/wait";
import ProductCarousel from "@/components/layout/home/slider";
// import TestimonialSlider from "@/components/layout/home/testimonials";
import { getCategories } from "@/actions/cruds/categories";
import { Category } from "@/types";
import { FaSnowflake } from "react-icons/fa";

export default async function Home() {
  // Wait for data to load, show skeleton if homepageData is missing
  if (!homepageData && await wait(500)) {
    return <Skeleton className="h-40 w-full" />;
  }

  // Fetch categories with error handling for async function
  let categories: Category[] = [];
  try {
    categories = (await getCategories()) as Category[] || [];
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }

  // Extracting the homepage data directly from JSON
  const { hero,
    // testimonials,
    contact } = homepageData;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className={`relative text-center md:text-left dark:text-white px-4 sm:px-8 mt-20`}>
        <div className="mx-auto flex flex-col-reverse sm:flex-row items-center justify-between sm:gap-8">
          <div className="sm:w-1/2">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
              <h1 className="text-3xl lg:text-4xl font-bold">{hero?.title}</h1>
              <p className="mt-4 text-base">{hero?.subtitle}</p>
              <Link href="/products" passHref>
                <Button className="mt-8 hover:shadow-xl transition-shadow duration-200">
                  {hero?.buttonText}
                </Button>
              </Link>
            </motion.div>
          </div>
          <div className="sm:w-1/2 h-full w-full">
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <Image src={hero?.image || '/placeholders/no-image.jpg'} alt="Frozen Products" width={640} height={360} className="rounded-lg sm:h-auto w-full object-cover" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Carousel */}
      <ProductCarousel />

      {/* Categories Section */}
      {categories.length !== 0 &&
        <section className="my-8 md:my-10 py-8 px-4">
          <h2 className="text-3xl font-bold text-center">Explore Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
            {categories.map((category) => (
              <Link key={category.slug} href={category.slug} className="flex items-center justify-center gap-5 p-6 rounded-lg border hover:scale-105 duration-200">

                {category.image_url ? <img src={category.image_url} height={60} width={60} alt={category.name} className="rounded-full" /> :
                  <div className="text-black dark:text-white">
                    <FaSnowflake size={40} />
                  </div>
                }
                <div>
                  <h3 className="text-2xl font-semibold">{category.name}</h3>
                  {category?.description && <p className="text-gray-600 dark:text-gray-400">{category?.description?.length < 45 ? category.description : category.description?.slice(0, 45) + "..."}</p>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      }

      {/* Testimonials Section */}
      {/* <section className="my-16 py-8 px-4">
        <h2 className="text-3xl font-bold text-center mb-10">What Our Customers Say</h2>
        <TestimonialSlider testimonials={testimonials} />
      </section> */}

      {/* Contact Section */}
      <section className="relative my-8 md:my-10 py-8 px-4 flex items-center justify-between flex-col sm:flex-row">
        <div className="sm:w-1/2">
          <Image src={contact.image} alt="Contact Us" width={640} height={360} className="rounded-lg object-contain h-64 w-full mb-4 sm:mb-0" />
        </div>
        <div className="sm:w-1/2 pl-8">
          <h2 className="text-3xl font-bold mb-4">{contact.title}</h2>
          <p className="mb-4">{contact.description}</p>
          <Link href={contact.link} passHref>
            <Button className="mt-4">{contact.buttonText}</Button>
          </Link>
        </div>
      </section>
    </div >
  );
}
