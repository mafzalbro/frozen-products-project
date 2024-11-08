"use client";

import React, { useState, useTransition } from "react";
import { toggleLike } from "@/actions/products";
import { FaThumbsUp, FaRegThumbsUp } from "react-icons/fa";
import { Button } from "@/components/ui/button";

interface ToggleLikeProps {
    productId: number;
    initialLikes: number[];
    userId: number | null;
}

const ToggleLike: React.FC<ToggleLikeProps> = ({ productId, initialLikes, userId }) => {
    const [isLiked, setIsLiked] = useState(userId ? initialLikes.includes(userId) : false);
    const [likesCount, setLikesCount] = useState(initialLikes.length);
    const [isPending, startTransition] = useTransition();

    const handleToggle = () => {
        startTransition(async () => {
            try {
                await toggleLike(productId);
                setIsLiked(!isLiked);
                setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
            } catch (error) {
                console.error("Failed to toggle like:", error);
            }
        });
    };

    return (
        <Button
            variant={"secondary"}
            onClick={handleToggle}
            disabled={isPending}
            className="flex items-center space-x-2 text-lg"
        >
            {isLiked ? <FaThumbsUp className="text-blue-500" /> : <FaRegThumbsUp className="text-gray-500" />}
            <span>{likesCount} {isLiked ? "Unlike" : "Like"}</span>
        </Button>
    );
};

export default ToggleLike;
