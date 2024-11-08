"use client";

import * as React from "react";
import { ChevronDownIcon, DotsHorizontalIcon, TrashIcon } from "@radix-ui/react-icons";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import { fetchAllNotifications } from "@/actions/notifications";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Notification } from "@/types";
// import { Eye, Pencil } from "lucide-react";
import Link from "next/link";
import Loader from "@/components/layout/spinners/Loader";
import Pagination from "@/app/admin/components/admin/pagination";
import { useSearchParams } from "next/navigation";
import SelectResultsCount from "@/app/admin/components/admin/select-count";
import RemoveAllNotificationsButton from "@/app/admin/components/notifications/remove-all-btn";

export default function NotificationTable() {
    const searchParams = useSearchParams();
    const [notifications, setNotifications] = React.useState<Notification[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [totalPages, setTotalPages] = React.useState(0);

    const pageSize = parseInt(searchParams.get("page-size") || "10") || 10;
    const currentPage = parseInt(searchParams.get("page") || "1") || 1;

    React.useEffect(() => {
        const fetchNotificationData = async () => {
            setLoading(true);
            try {
                const { notifications, totalPages } = await fetchAllNotifications({
                    page: currentPage,
                    pageSize,
                });
                setTotalPages(totalPages);
                setNotifications(notifications);
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotificationData();
    }, [currentPage, pageSize, searchParams]);

    const columns: ColumnDef<Notification>[] = [
        {
            accessorKey: "title",
            header: "Title",
            cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
        },
        {
            accessorKey: "type",
            header: "Type",
            cell: ({ row }) => {
                const notificationType: 'added' | 'updated' | 'deleted' = row.getValue("type");

                // Map notification types to colors for both light and dark themes
                const typeColors = {
                    added: "bg-green-500 text-white dark:bg-green-400 dark:text-black",   // Green for added
                    updated: "bg-blue-500 text-white dark:bg-blue-400 dark:text-black",   // Blue for updated
                    deleted: "bg-red-500 text-white dark:bg-red-400 dark:text-black",     // Red for deleted
                };

                // Get the appropriate class for the badge
                const badgeClass = typeColors[notificationType] || "bg-gray-300 text-black dark:bg-gray-600 dark:text-white"; // Default class if type not found

                return (
                    <div>
                        <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full ${badgeClass}`}>
                            {notificationType.charAt(0).toUpperCase() + notificationType.slice(1)} {/* Capitalize the first letter */}
                        </span>
                    </div>
                );
            },
        },

        // {
        //     accessorKey: "raw_details",
        //     header: "Details",
        //     cell: ({ row }) => <div>{row.getValue("raw_details") || "N/A"}</div>,
        // },
        {
            accessorKey: "tableName",
            header: "From",
            cell: ({ row }) => <div>{row.getValue("tableName")}</div>,
        },
        {
            accessorKey: "userId",
            header: "User ID",
            cell: ({ row }) => <div>{row.getValue("userId")}</div>,
        },
        {
            accessorKey: "username",
            header: "User",
            cell: ({ row }) => <div>{row.getValue("username")}</div>,
        },
        {
            accessorKey: "createdAt",
            header: "Date Created",
            cell: ({ row }) => <div>{new Date(row.getValue("createdAt")).toLocaleString()}</div>,
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const notification = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <DotsHorizontalIcon className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            {/* <DropdownMenuItem asChild>
                                <Link href={`/notifications/${notification.id}`}>
                                    <Eye className="h-4 w-4 mr-1" /> View
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={`/admin/manage-notifications/${notification.id}/edit`}>
                                    <Pencil className="h-4 w-4 mr-1" /> Edit
                                </Link>
                            </DropdownMenuItem> */}
                            <DropdownMenuItem asChild>
                                <Link href={`/admin/manage-notifications/${notification.id}/delete`}>
                                    <TrashIcon className="h-4 w-4 mr-1" /> Delete
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const table = useReactTable({
        data: notifications,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        rowCount: pageSize,
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
        },
    });

    return (
        <div className="m-4">
            <div className="w-full flex justify-between gap-2">
                <SelectResultsCount />
                <RemoveAllNotificationsButton />
            </div>
            <div className="flex items-center py-4 gap-1">
                <Input
                    placeholder="Filter notifications..."
                    value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("title")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table.getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                >
                                    {column.id}
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center">
                                    <Loader />
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center">
                                    No notifications found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <div className="my-2">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        searchParams={Object.fromEntries(searchParams.entries())}
                    />
                </div>
            </div>
        </div>
    );
}
