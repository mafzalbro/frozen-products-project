"use client";

import React, { useState, useTransition } from "react";
import { addComment } from "@/actions/products";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface AddCommentProps {
    productId: number;
}

const AddComment: React.FC<AddCommentProps> = ({ productId }) => {
    const [comment, setComment] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleComment = () => {
        startTransition(async () => {
            if (comment) {
                try {
                    await addComment(productId, comment);
                    setComment(""); // Reset after submitting
                } catch (error) {
                    console.error("Failed to add comment:", error);
                }
            }
        });
    };

    return (
        <div className="flex flex-col items-start space-y-6">
            <h3 className="text-lg font-semibold">Add a comment:</h3>
            <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={isPending}
                className="p-2 border border-gray-300 rounded"
                rows={3}
                placeholder="Write your comment here..."
            />
            <Button
                onClick={handleComment}
                disabled={isPending}
                className="mt-2 px-4 py-2 rounded"
            >
                {isPending ? "Submitting..." : "Submit Comment"}
            </Button>
        </div>
    );
};

export default AddComment;
