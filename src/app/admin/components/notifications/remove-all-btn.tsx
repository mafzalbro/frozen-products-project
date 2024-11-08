import { removeAllAdminNotifications } from "@/actions/notifications"; // Import your remove function
import { redirect } from "next/navigation";
import SubmitButton from "@/components/layout/buttons/submit";

const RemoveAllNotificationsButton = () => {
    const handleRemoveAllNotifications = async () => {
        const { success, message } = await removeAllAdminNotifications();
        if (success) {
            redirect(`/admin/manage-notifications/?toastMessage=${message}&toastType=success`)
        } else {
            redirect(`/admin/manage-notifications/?toastMessage=${message}&toastType=error`)
        }
    };

    return (
        <form action={handleRemoveAllNotifications}>
            <SubmitButton>
                Remove All Notifications
            </SubmitButton>
        </form>
    );
};

export default RemoveAllNotificationsButton;
