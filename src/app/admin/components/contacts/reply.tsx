import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { replyToMessage } from "@/actions/contact"; // Make sure path is correct
import { v4 as uuidv4 } from "uuid";

interface ReplyFormProps {
    messageId: string;
    userId: number | null;
    email: string;
    onReply: (messageId: string, newReply: { replyId: string; replyText: string; replyDate: string }) => void;
}

export const ReplyForm: React.FC<ReplyFormProps> = ({ messageId, userId, email, onReply }) => {
    const [reply, setReply] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleReply = async () => {
        if (!reply.trim()) return;
        setIsSubmitting(true);
        try {
            await replyToMessage({ messageId, reply, userId, email });
            const newReply = { replyId: uuidv4(), replyText: reply, replyDate: new Date().toISOString() };
            onReply(messageId, newReply); // Update message replies
            setReply("");
        } catch (error) {
            console.error("Error sending reply:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex items-center gap-2 mt-2">
            <Input
                type="text"
                placeholder="Write a reply..."
                value={reply}
                name="reply"
                onChange={(e) => setReply(e.target.value)}
                className="w-full"
            />
            <Button onClick={handleReply} disabled={isSubmitting || !reply.trim()}>
                {isSubmitting ? "Sending..." : "Reply"}
            </Button>
        </div>
    );
};
