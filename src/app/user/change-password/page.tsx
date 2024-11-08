import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { changePassword, verifyAuth } from '@/actions/auth';
import SubmitButton from '@/components/layout/buttons/submit';
import { redirect } from 'next/navigation';
import GenerateNewPasswordInput from '@/components/ui/generate-new-password-input';

export default function ChangePassword() {

    const handleSubmit = async (formdata: FormData) => {

        "use server";

        const { isAuthenticated, user } = await verifyAuth()

        if (isAuthenticated) {

            const { oldPassword, newPassword, confirmPassword } = Object.fromEntries(formdata.entries()) as {
                oldPassword: string;
                newPassword: string;
                confirmPassword: string;
            };

            const result: { success: boolean; message: string } = await changePassword(user?.email || '', oldPassword, newPassword, confirmPassword);

            if (result.success) {
                // Redirect with success message as searchParams to trigger toast
                redirect(`?toastMessage=${encodeURIComponent(result.message)}&toastType=success`);
            } else {
                // Redirect with error message
                redirect(`?toastMessage=${encodeURIComponent(result.message)}&toastType=error`);
            }
        } else {
            redirect('/login')
        }
    };

    return (
        <>
            {/* Change Password Form */}
            <form action={handleSubmit} className='p-4 sm:p-8 flex flex-col gap-4 max-w-md mx-auto mt-10 border rounded-lg'>
                {/* <Label htmlFor="email">Email</Label> */}
                {/* <Input type="email" id="email" name="email" required /> */}
                <Label htmlFor="oldPassword">Old Password</Label>
                <Input type="password" id="oldPassword" placeholder="Enter old password"
                    name="oldPassword" required />

                <GenerateNewPasswordInput />

                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input type="password" id="confirmPassword" name="confirmPassword" placeholder="Enter new password again"
                    required />

                <SubmitButton>
                    Change Password
                </SubmitButton>
            </form>
        </>
    );
}
