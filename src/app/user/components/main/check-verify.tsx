"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Check, XCircle } from "lucide-react";
import { resendVerificationEmail } from "@/actions/auth";
import { useToast } from "@/hooks/use-toast";

interface StickyVerificationStatusProps {
    isVerified: boolean;
    email: string;
}

export default function StickyVerificationStatus({
    isVerified,
    email
}: StickyVerificationStatusProps) {
    const [loading, setLoading] = React.useState(false);
    const { toast } = useToast();

    const handleResendVerification = async () => {
        setLoading(true);
        try {
            const response = await resendVerificationEmail();
            toast({
                title: response.success ? "Success" : "Error",
                description: `${response.message} on ${email}`,
                variant: response.success ? "default" : "destructive",
            });
        } catch {
            toast({
                title: "Error",
                description: "Failed to resend verification email.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed top-14 right-0 p-4 shadow-md z-50 flex justify-center text-xs">
            {isVerified ? (
                <Button variant="outline" className="bg-green-500 dark:bg-green-700 text-white" disabled>
                    <Check className="h-4 w-4" />
                    Verified
                </Button>
            ) : (
                <div className="flex gap-2 items-center">
                    <span>Not Verified!!!</span>
                    <Button
                        variant="outline"
                        className="bg-red-500 dark:bg-red-700 text-white"
                        onClick={handleResendVerification}
                        disabled={loading}
                    >
                        <XCircle className="h-4 w-4" />
                        Resend Verification
                    </Button>
                </div>
            )}
        </div>
    );
}
