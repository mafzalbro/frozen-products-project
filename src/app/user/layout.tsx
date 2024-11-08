import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import ProfileSidebar from "@/app/user/components/user/sidebar"
import { verifyUser } from "@/actions/auth";
import { redirect } from "next/navigation";
import StickyVerificationStatus from "./components/main/check-verify";
import { Metadata } from "next";


export const metadata: Metadata = {
    title: "User Dashboard",
    description: "User Dashboard",
}

export default async function Layout({ children }: { children: React.ReactNode }) {

    const { user } = await verifyUser()
    if (!user) {
        redirect('/login?toastMessage=Please Login&toastType=error')
    }
    // console.log(user);
    return (
        <SidebarProvider className="inline-block sm:flex h-full">
            <StickyVerificationStatus isVerified={user.isVerified || false} email={user.email || ''} />
            <ProfileSidebar className="sm:flex-1" />
            <main className="sm:flex-1 my-20">
                <SidebarTrigger className="ml-2 p-2 sm:p-4 fixed top-20" />
                <div className="mt-10">
                    {children}
                </div>
            </main>
        </SidebarProvider>
    )
}
