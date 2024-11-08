"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface FullScreenImageProps {
    imageUrl?: string;
    images?: string[];
    altText?: string;
}

const FullScreenImage = ({ imageUrl, images = [], altText = "Image" }: FullScreenImageProps) => {

    const [lightboxIndex, setLightboxIndex] = useState(-1);

    const mainImageUrl = imageUrl || (images.length > 0 ? images[0] : undefined);

    

    // Create a unique list of images and keep track of the indices for the lightbox
    const uniqueImages = Array.from(new Set([mainImageUrl, ...images].filter((img): img is string => img !== undefined)));
    const slides = uniqueImages.map((img) => ({
        src: img,
        width: 800,
        height: 600,
    }));

    const handleThumbnailClick = (index: number) => {
        setLightboxIndex(index); // Set the correct index in the lightbox
    };

    return (
        <>
            {/* Main Image */}
            {mainImageUrl && (
                <Image
                    onClick={() => handleThumbnailClick(0)}
                    height={360}
                    width={640}
                    src={mainImageUrl}
                    alt={altText}
                    className="w-full cursor-pointer h-auto rounded-lg shadow-md object-cover"
                />
            )}

            {/* Display Thumbnails */}
            <div className="mt-4 flex items-center">
                {uniqueImages.slice(1, 3).map((img, index) => (
                    <Image
                        key={img}
                        src={img}
                        alt={`${altText} - Detail ${index + 1}`}
                        height={130}
                        width={130}
                        className="cursor-pointer rounded-md shadow-sm object-cover hover:opacity-75"
                        onClick={() => handleThumbnailClick(index + 1)} // Click opens the lightbox with the correct index
                    />
                ))}
                {uniqueImages.length > 3 && (
                    <div className="ml-2 text-gray-600 dark:text-gray-300">
                        + {uniqueImages.length - 3} more
                    </div>
                )}
            </div>

            {/* Lightbox */}
            <Lightbox
                slides={slides}
                open={lightboxIndex >= 0}
                index={lightboxIndex}
                close={() => setLightboxIndex(-1)}
            />
        </>
    );
};

export default FullScreenImage;
