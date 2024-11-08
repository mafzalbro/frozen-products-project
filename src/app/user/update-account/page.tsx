import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SubmitButton from "@/components/layout/buttons/submit";
import { updateAccount, verifyUser } from "@/actions/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function UpdateAccount() {
    // Check authentication and get the user data
    const { isAuthenticated, user } = await verifyUser();

    // Redirect to login if the user is not authenticated
    if (!isAuthenticated) {
        redirect("/login");
    }

    // Pre-fill the form with user data
    const handleSubmit = async (formData: FormData) => {
        "use server";

        const response = await updateAccount(formData, user?.id || 0, user?.username || "");
        // Redirect with a success or error message based on response
        revalidatePath('/user/update-account')
        if (response.success) {
            redirect(`/user/update-account?toastMessage=${encodeURIComponent(response.message)}&toastType=success`);
        } else {
            redirect(`/user/update-account?toastMessage=${encodeURIComponent(response.message)}&toastType=error`);
        }
    };

    return (
        <form action={handleSubmit} className="p-4 sm:p-8 flex flex-col gap-4 max-w-md mx-auto mt-10 border rounded-lg">
            <Label htmlFor="fullName">Full Name</Label>
            <Input type="text" id="fullName" name="fullName" defaultValue={user?.fullName} required />

            <Label htmlFor="username">Username <span className="ml-1 text-muted-foreground">(Can't change username)</span></Label>
            <Input type="text" id="username" name="username" disabled defaultValue={user?.username} required />

            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" name="email" defaultValue={user?.email} required />

            <Label htmlFor="phone">Phone Number</Label>
            <Input type="tel" id="phone" name="phone" defaultValue={user?.phone} />

            <Label htmlFor="street">Street</Label>
            <Input type="text" id="street" name="address.street" defaultValue={user?.address?.street || ""} />

            <Label htmlFor="city">City</Label>
            <Input type="text" id="city" name="address.city" defaultValue={user?.address?.city || ""} />

            <Label htmlFor="state">State</Label>
            <Input type="text" id="state" name="address.state" defaultValue={user?.address?.state || ""} />

            <Label htmlFor="zip">Zip Code</Label>
            <Input type="text" id="zip" name="address.zip" defaultValue={user?.address?.zip || ""} />

            <SubmitButton>Update Account</SubmitButton>
        </form>
    );
}