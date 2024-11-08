import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AdminSidebar from "@/app/admin/components/admin/sidebar"
import { verifyUser } from "@/actions/auth";
import { notFound } from "next/navigation";
import { BreadcrumbAdmin } from "@/app/admin/components/admin/breadcrumbs";
import CheckPriviledges from "./components/admin/check-priviledges";

export default async function Template({ children }: { children: React.ReactNode }) {

    const { user, isAuthenticated } = await verifyUser()

    // if (user || isAuthenticated) {
    //     notFound()
    // }
    if (!isAuthenticated || user?.role === "user") {
        // redirect('/404?toastMessage=Please Login&toastType=error')
        notFound()
    }

    const userData = JSON.parse(JSON.stringify(user))

    // console.log(user);
    return (
        <>
            <CheckPriviledges>
                <SidebarProvider className="inline-block relative sm:flex h-full">
                    <AdminSidebar className="sm:flex-1 top-16" user={userData} />
                    <main className="sm:flex-1 my-16">
                        <div className="ml-10">
                            <BreadcrumbAdmin />
                        </div>
                        <SidebarTrigger className="ml-2 p-2 fixed top-20" />
                        <div className="mt-10">
                            {children}
                        </div>
                    </main>
                </SidebarProvider>
            </CheckPriviledges>
        </>
    )
}
