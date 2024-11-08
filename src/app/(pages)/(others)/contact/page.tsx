"use client"

import { useEffect, useState } from "react";
import { handleContactForm } from "@/actions/contact";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { verifyUser } from "@/actions/auth";

// Define the types for the response structure
interface ContactResponse {
    errors?: {
        name?: string[];
        email?: string[];
        message?: string[];
        global?: string;
    };
    success?: boolean;
}

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const insertUserInfo = async () => {
        const { user, isAuthenticated } = await verifyUser()

        if (isAuthenticated && user) {
            setFormData({
                name: user.fullName || "",
                email: user.email || "",
                message: ""
            })
            setIsAuth(isAuthenticated)
        }
    }


    // Use the ContactResponse interface for response state
    const [response, setResponse] = useState<ContactResponse | null>(null);
    const [isSending, setIsSending] = useState(false);
    const [isAuth, setIsAuth] = useState(false);

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
    };

    useEffect(() => {
        insertUserInfo()
    }, [])

    return (
        <div className="w-full md:w-2/4 mx-auto p-8 rounded-lg min-h-[83vh] flex justify-center flex-col">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Name"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isAuth && formData.name !== ""}
                    required
                />
                <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isAuth && formData.email !== ""}
                    required
                />
                <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Message"
                    rows={5}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <Button
                    type="submit"
                    className={`w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 disabled:bg-blue-400 ${isSending ? "disabled:cursor-wait" : "disabled:cursor-not-allowed"}`}
                    disabled={isSending || !formData.name || !formData.email || !formData.message}
                >
                    {isSending ? "Sending..." : "Send"}
                </Button>
                {response && (
                    <div
                        className={`mt-4 text-center ${response.success ? "text-green-500" : "text-red-500"}`}
                    >
                        {response.success
                            ? "Message sent successfully!"
                            : (response.errors?.global || "Failed to send message")}
                    </div>
                )}
            </form>
        </div>
    );
};

export default ContactPage;
