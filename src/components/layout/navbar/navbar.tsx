import { Suspense } from "react"
import NavbarContent from "./navbar-content"
import { Skeleton } from "@/components/ui/skeleton"

const Navbar = () => {
    return (
        <Suspense fallback={<Skeleton className="w-full h-10" />}>
            <NavbarContent />
        </Suspense>
    )
}

export default Navbar