"use client";

import { useEffect, useState } from "react";
import { getMessagesForCurrentUser } from "@/actions/contact";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible } from "@/components/ui/collapsible";
import Loader from "@/components/layout/spinners/Loader";
import Link from "next/link";
import { handleContactForm } from "@/actions/contact";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { verifyUser } from "@/actions/auth";
import { MessageReplies } from "../components/contacts/replies";

// Message Interface
interface Message {
    id: string;
    name: string;
    message: string;
    created_at: string;
    replies: { replyId: string; replyText: string; replyDate: string }[];
}

interface ContactResponse {
    errors?: {
        name?: string[];
        email?: string[];
        message?: string[];
        global?: string;
    };
    success?: boolean;
}

const UserMessages = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
    const [isAuthenticated, setIsAuth] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [response, setResponse] = useState<ContactResponse | null>(null);
    const [isSending, setIsSending] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // Fetch messages for current user
    useEffect(() => {
        async function fetchMessages() {
            const { messages, success } = await getMessagesForCurrentUser();
            if (success && messages) {
                setMessages(messages);
            } else {
                // Handle no messages or authentication failure
                setMessages([]);
            }
            setIsLoading(false);
        }

        fetchMessages();
        insertUserInfo();  // Get user info
    }, [response]);

    // Automatically populate form with user info
    const insertUserInfo = async () => {
        const { user, isAuthenticated } = await verifyUser();

        if (isAuthenticated && user) {
            setFormData({
                name: user.fullName || "",
                email: user.email || "",
                message: ""
            });
            setIsAuth(isAuthenticated);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);

        const res = await handleContactForm(formData);
        setResponse(res); // This should match the ContactResponse type
        setIsSending(false);
        setFormData({ name: "", email: "", message: "" });
        setIsOpen(false)
    };

    if (isLoading) {
        return <Loader text="Loading Messages" />;
    }

    return (
        <div className="space-y-4 mx-4">
            {/* Button to open modal for sending message */}
            <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open) }}>
                <DialogTrigger asChild>
                    <Button className="mt-8">Send Message</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogTitle>Send a New Message</DialogTitle>
                    <DialogDescription>
                        Please write your message below and we will respond as soon as possible.
                    </DialogDescription>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your Name"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isAuthenticated || formData.name !== ""}
                        />
                        <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Your Email"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isAuthenticated || formData.email !== ""}
                        />
                        <Textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Your Message"
                            rows={5}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <Button
                            type="submit"
                            className={`w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 disabled:bg-blue-400 ${isSending ? "disabled:cursor-wait" : "disabled:cursor-not-allowed"}`}
                            disabled={isSending || !formData.message}
                        >
                            {isSending ? "Sending..." : "Send Message"}
                        </Button>
                    </form>
                    {response && (
                        <div className={`mt-4 text-center ${response.success ? "text-green-500" : "text-red-500"}`}>
                            {response.success
                                ? "Message sent successfully!"
                                : (response.errors?.global || "Failed to send message")}
                        </div>
                    )}
                </DialogContent>
            </Dialog>


            {messages.length === 0 ? (
                <Alert className="flex flex-col gap-2">
                    <AlertTitle className="text-2xl">No contacts to us!</AlertTitle>
                    <AlertDescription className="flex flex-col gap-2">
                        <p>You have no messages sent to us.</p>
                        <Link href={"/contact"} passHref className="my-3">
                            <Button variant={"link"}>Contact Us or send using following button...</Button>
                        </Link>
                    </AlertDescription>
                </Alert>
            ) : (
                messages.map((message) => (
                    <div key={message.id} className="bg-card shadow-md rounded-lg p-4">
                        <div className="flex justify-between">
                            <span className="font-bold">{message.name}</span>
                            <span className="text-sm text-muted-foreground">
                                {new Date(message.created_at).toLocaleString()}
                            </span>
                        </div>
                        <p className="mt-2">{message.message}</p>

                        {/* Replies Section */}
                        <MessageReplies
                            message={message}
                        />
                    </div>
                ))
            )}

        </div>
    );
};

export default UserMessages;
