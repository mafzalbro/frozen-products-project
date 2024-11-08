import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { forgotPassword } from '@/actions/auth';
import { redirect } from 'next/navigation';
import SubmitButton from '@/components/layout/buttons/submit';

export default function ForgotPassword() {

    const handleSubmit = async (formdata: FormData) => {
        "use server";

        const { email } = Object.fromEntries(formdata.entries()) as { email: string };

        const result: { success: boolean; message: string } = await forgotPassword(email);

        if (result.success) {
            // Redirect with success message as searchParams to trigger toast
            redirect(`?toastMessage=${encodeURIComponent(result.message)}&toastType=success`);
        } else {
            // Redirect with error message
            redirect(`?toastMessage=${encodeURIComponent(result.message)}&toastType=error`);
        }
    };

    return (
        <>
            {/* Forgot Password Form */}
            <form action={handleSubmit} className='justify-center border rounded-lg p-4 sm:p-8 flex flex-col gap-4 max-w-md mx-auto mt-10'>
                <Label htmlFor="email">Email</Label>
                <Input
                    type="email"
                    id="email"
                    name="email"
                    required
                />
                <SubmitButton>
                    Send Reset Token
                </SubmitButton>
            </form>
        </>
    );
}
