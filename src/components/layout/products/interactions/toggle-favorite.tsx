"use client";

import React, { useEffect, useState, useTransition } from "react";
import { toggleFavorite } from "@/actions/products";
import { FaBookmark, FaHeart, FaRegBookmark, FaRegHeart } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ToggleFavoriteProps {
    productId: number;
    initialFavorites: number[];
    userId?: number | null;
    main?: boolean;
}

const ToggleFavorite: React.FC<ToggleFavoriteProps> = ({ productId, initialFavorites, userId, main }) => {

    const [isFavorite, setIsFavorite] = useState(userId ? initialFavorites.includes(userId) : false);
    const [favoritesCount, setFavoritesCount] = useState(initialFavorites.length);
    const [isPending, startTransition] = useTransition();

    const handleToggle = () => {
        startTransition(async () => {
            try {
                await toggleFavorite(productId);
                setIsFavorite(!isFavorite);
                setFavoritesCount(isFavorite ? favoritesCount - 1 : favoritesCount + 1);
            } catch (error) {
                console.error("Failed to toggle favorite:", error);
            }
        });
    };

    useEffect(() => {
        if (window !== undefined) {
            const userData = localStorage.getItem('user')
            if (userData !== "undefined") {
                const userId = JSON.parse(userData || "")?.id
                setIsFavorite(userId ? initialFavorites.includes(userId) : false)
            }
        }
    }, [initialFavorites])

    if (main) {
        return (
            <button
                className="font-semibold absolute top-1 left-1 disabled:opacity-50 disabled:pointer-events-none"
                onClick={handleToggle}
                disabled={isPending}
            >
                {isFavorite ? <Badge variant="secondary">
                    <FaBookmark size={16} />
                </Badge>
                    :
                    <Badge variant="secondary">
                        <FaRegBookmark size={16} />
                    </Badge>}
            </button>
        );
    }
    return (
        <Button
            variant={"secondary"}
            onClick={handleToggle}
            disabled={isPending}
            className="flex items-center space-x-2 text-lg"
        >
            {isFavorite ? <FaHeart className="text-red-500" /> : <FaRegHeart className="text-gray-500" />}
            <span>{favoritesCount} {isFavorite ? "Unfavorite" : "Favorite"}</span>
        </Button>
    );
};

export default ToggleFavorite;
