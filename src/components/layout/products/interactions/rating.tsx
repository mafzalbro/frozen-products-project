"use client";

import React, { useState, useTransition } from "react";
import { giveRating } from "@/actions/products";
import { Button } from "@/components/ui/button";

interface AddRatingProps {
  productId: number;
  isRatedInitially: boolean;
}

const AddRating: React.FC<AddRatingProps> = ({ productId, isRatedInitially }) => {
  const [rating, setRating] = useState<number | null>(null);
  const [isRated, setIsRated] = useState(isRatedInitially); // Set initial rating status
  const [ratingCount, setRatingCount] = useState<number | null>(null);
  const [ratingNumber, setRatingNumber] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleRating = () => {
    startTransition(async () => {
      if (rating !== null) {
        try {
          const { rating_count, rating_number, isRated } = await giveRating(productId, rating);
          setIsRated(isRated); // Update if the product has been rated by the user
          setRatingCount(rating_count); // Update rating count
          setRatingNumber(rating_number); // Update average rating
          setRating(null); // Reset rating input if needed
        } catch (error) {
          console.error("Failed to give rating:", error);
        }
      }
    });
  };

  return (
    <div className="flex flex-col items-start space-y-2 gap-4">
      {!isRated ? (
        <>
          <h3 className="text-lg font-semibold">Rate this product:</h3>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((rate) => (
              <Button
                variant="secondary"
                key={rate}
                onClick={() => setRating(rate)}
                disabled={isPending || isRated}
                className={`p-2 px-4 rounded-full ${rating === rate ? "bg-blue-200 dark:bg-blue-600 hover:bg-blue-200 hover:dark:bg-blue-600" : ""}`}
              >
                {rate}
              </Button>
            ))}
          </div>
          <Button
            onClick={handleRating}
            disabled={isPending || isRated}
            className="mt-2 px-4 py-2 my-8"
          >
            {isPending ? "Submitting..." : "Submit Rating"}
          </Button>
        </>
      ) : (
        <div>
          <p>You already rated this product.</p>
          {ratingCount !== null && ratingNumber !== null && (
            <p>Current Rating: {ratingNumber.toFixed(1)} ({ratingCount} votes)</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AddRating;
