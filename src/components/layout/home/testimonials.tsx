// components/layout/home/TestimonialSlider.tsx

'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Testimonial {
    id: number;
    text: string;
    author: string;
    image: string;
}

interface TestimonialCarouselProps {
    testimonials: Testimonial[]
}

const TestimonialSlider: React.FC<TestimonialCarouselProps> = ({ testimonials }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -30 }}
            // animate={{ opacity: 1, y: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}>
            <Swiper
                spaceBetween={30}
                loop={true}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                modules={[Autoplay]}
                breakpoints={{
                    // Define responsive breakpoints
                    0: {
                        slidesPerView: 1, // Show 1 slide on extra small screens
                    },
                    640: {
                        slidesPerView: 2, // Show 2 slides on small screens
                    },
                }}
                className="mt-6"
            >
                {testimonials.map((testimonial: Testimonial) => (
                    <SwiperSlide key={testimonial.id}>
                        <div
                            className="p-2 rounded-lg border text-center flex items-center justify-between gap-4 sm:h-52 cursor-pointer"
                        >
                            <Image src={testimonial.image} alt={testimonial.author} width={100} height={100} className="rounded-lg mx-auto h-auto w-full object-cover" />
                            <div>
                                <p className="italic">{testimonial.text}</p>
                                <h4 className="font-semibold mt-2">{testimonial.author}</h4>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </motion.div>
    );
};

export default TestimonialSlider;
