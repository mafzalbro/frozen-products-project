"use client";

import { Badge } from "@/components/ui/badge";
import React from "react";
import { FaUser, FaComment } from "react-icons/fa"; // Import the icons

interface Comment {
    id?: number;
    userId: number;
    isAdmin?: number;
    user?: string | undefined;
    comment: string;
    createdAt: string;
}

interface CommentsListProps {
    comments: Comment[];
    currentUserId: number | null;
}

const CommentsList: React.FC<CommentsListProps> = ({
    comments,
    currentUserId,
}) => {
    const getDate = (string: string) => {
        return new Date(string).toLocaleString();
    };

    return (
        <div className="mt-6">
            <h2 className="text-xl font-semibold flex items-center">
                <FaComment className="mr-2 text-gray-700" />
                Comments
            </h2>
            {comments.length === 0 ? (
                <p className="text-gray-600">No comments yet.</p>
            ) : (
                <ul className="mt-4 space-y-4">
                    {comments.map((comment) => (
                        <li
                            key={comment.id + comment.createdAt}
                            className="p-4 border rounded-md shadow-sm hover:shadow-md transition-shadow duration-200"
                        >
                            <div className="flex items-center">
                                {comment.user && (
                                    <span className="flex items-center">
                                        <FaUser className="mr-1 text-gray-500" />
                                        <span className="text-gray-500 dark:text-gray-300">
                                            {JSON.parse(comment.user).fullName}
                                        </span>
                                    </span>
                                )}
                                {comment.userId === currentUserId && (
                                    <span className="ml-2 text-blue-500 font-semibold">(You)</span>
                                )}
                                {comment.user && (
                                    <Badge variant={'secondary'} className="ml-2 text-blue-500 font-semibold">{JSON.parse(comment.user)?.isAdmin ? "Admin" : "Not Admin"}</Badge>
                                )}
                            </div>

                            <p className="mt-2 text-gray-800 dark:text-gray-100">
                                {comment.comment}
                            </p>
                            <div className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                                <span>{getDate(comment.createdAt)}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )
            }
        </div >
    );
};

export default CommentsList;
