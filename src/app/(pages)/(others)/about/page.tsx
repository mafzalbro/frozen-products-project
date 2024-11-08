"use client";

import { getMeta } from "@/store/metadata";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";


const AboutUs = () => {
    return (
        <section className="w-full md:w-3/4 mx-auto p-8 rounded-lg min-h-[83vh] flex justify-center flex-col">
            <div className="flex flex-col md:flex-row items-center md:space-x-8 space-y-4 md:space-y-0">
                <div className="w-full md:w-1/2">
                    <Image
                        src={'/images/about.png'}
                        alt="About Us"
                        width={500}
                        height={500}
                        className="rounded-lg object-cover"
                    />
                </div>
                <div className="w-full md:w-1/2 space-y-4">
                    <h2 className="text-3xl font-bold">About Us</h2>
                    <p>
                        Welcome to {getMeta().siteTitle}, where our mission is to deliver high-quality services and
                        products tailored to our customers' needs. We pride ourselves on our commitment to
                        excellence and customer satisfaction.
                    </p>
                    <p>
                        Founded in [Year], we have consistently grown and evolved in response to the ever-changing
                        needs of our clients. With a strong focus on innovation and creativity, we continue to
                        push the boundaries of what's possible in our industry.
                    </p>
                    <Link href={'/'} passHref className="my-10 inline-block">
                        <Button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition">
                            Let's Start!
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;
