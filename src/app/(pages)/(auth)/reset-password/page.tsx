// components/ResetPassword.tsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { resetPassword, verifyResetToken } from '@/actions/auth';
import { redirect } from 'next/navigation';
import SubmitButton from '@/components/layout/buttons/submit';
import { IoMdSad } from 'react-icons/io';

interface ForgotPasswordProps {
    searchParams: Promise<{
        resetToken?: string;
        valid?: string;
    }>;
}

export default async function ResetPassword(props: ForgotPasswordProps) {
    const searchParams = await props.searchParams;
    const { resetToken, valid } = searchParams || {};

    const verifyToken = async (resetToken: string) => {
        "use server"
        if (resetToken) {
            const result = await verifyResetToken(resetToken);
            if (result.success) {
                redirect(`?valid=true&resetToken=${resetToken}`);
            } else {
                redirect(`?valid=false`);
            }
        }
    }
    if (resetToken && !valid)
        await verifyToken(resetToken)

    const handleSubmit = async (formdata: FormData) => {
        "use server";
        const { newPassword, confirmPassword } = Object.fromEntries(formdata.entries()) as {
            newPassword: string;
            confirmPassword: string;
        };

        const result: { success: boolean; message: string } = await resetPassword(resetToken || "no-token", newPassword, confirmPassword);

        if (result.success) {
            // Redirect with success message as searchParams to trigger toast
            redirect(`/login?toastMessage=${encodeURIComponent(result.message)}&toastType=success`);
        } else {
            // Redirect with error message
            redirect(`/forgot-password?toastMessage=${encodeURIComponent(result.message)}&toastType=error`);
        }
    };


    if (!resetToken) {
        return (
            <div className='p-4 sm:p-8 flex items-center justify-center gap-4 max-w-md mx-auto mt-10 border rounded-lg h-32'>
                <IoMdSad className='mr-2 text-red-500 text-3xl inline' />
                Reset Failed! Please Visit through link sent in email!
            </div>
        );
    }

    if (valid == "false") {
        return (
            <div className='p-4 sm:p-8 flex items-center justify-center gap-4 max-w-md mx-auto mt-10 border rounded-lg h-32'>
                <IoMdSad className='mr-2 text-red-500 text-3xl inline' />
                Token is not valid or expired! Reset Failed! Please Visit through link sent in email!
            </div>
        );
    }

    if (!resetToken && valid == "true") {
        return (
            <div className='p-4 sm:p-8 flex items-center justify-center gap-4 max-w-md mx-auto mt-10 border rounded-lg h-32'>
                <IoMdSad className='mr-2 text-red-500 text-3xl inline' />
                Dont play with link itself! Please Visit from mail sent to your email
            </div>
        );

    }

    return (
        <>
            <form action={handleSubmit} className='p-4 sm:p-8 flex flex-col gap-4 max-w-md mx-auto mt-10 border rounded-lg'>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    required
                />
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                />
                <SubmitButton>
                    Reset Password
                </SubmitButton>
            </form>
        </>
    );
}
