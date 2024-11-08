"use client";

import React from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    // BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import Link from "next/link";
function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatSegment(segment: string) {
    return capitalizeFirstLetter(segment.replace(/-/g, " "));
}


function getBreadcrumbs(pathname: string) {
    const pathSegments = pathname.split("/").filter(Boolean); // Split by '/' and filter empty segments
    return pathSegments.map(segment => formatSegment(segment));
}

export default function Breadcrumbs() {
    const pathname = usePathname()
    const breadcrumbs = getBreadcrumbs(pathname);
    const notAllowedPaths = ['/user', '/admin']
    if (breadcrumbs.length == 1 && !notAllowedPaths.some((path) => pathname.includes(path)))
        return (
            <Breadcrumb className="mx-4 mt-20 sm:mx-6">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <Link href="/">Home</Link>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    {breadcrumbs.map((segment, index) => (
                        (breadcrumbs.length - 1 !== index) && <React.Fragment key={index} >
                            <BreadcrumbItem>
                                <Link href={`/${breadcrumbs.slice(0, index).join("/")}`}>
                                    {segment}
                                </Link>
                            </BreadcrumbItem>
                            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                        </React.Fragment>
                    ))}
                    <BreadcrumbItem className="capitalize">
                        <BreadcrumbPage>{breadcrumbs[breadcrumbs.length - 1]}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb >
        );
}
