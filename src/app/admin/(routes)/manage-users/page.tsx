"use client";

import * as React from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    Row,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { getAllUsersIfAdmin } from "@/actions/auth";
import { Button } from "@/components/ui/button";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User } from "@/types"; // Adjust based on your types structure
import {
    Check,
    //  Pencil, Trash2,
    X
} from "lucide-react";
import { VscVerified } from "react-icons/vsc";

import Link from "next/link";
import Loader from "@/components/layout/spinners/Loader";
import Pagination from "@/app/admin/components/admin/pagination";
import { useSearchParams } from "next/navigation";
import SelectResultsCount from "../../components/admin/select-count";
// import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { download, generateCsv, mkConfig } from "export-to-csv";
import { TbTableExport } from "react-icons/tb";

export default function UserTable() {
    
    const searchParams = useSearchParams();
    const [users, setUsers] = React.useState<User[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    // const [currentPage, setCurrentPage] = React.useState(1);
    const [totalPages, setTotalPages] = React.useState(0);

    const pageSize = parseInt(searchParams.get("page-size") || "10") || 10;
    const currentPage = parseInt(searchParams.get("page") || "1") || 1;

    React.useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                const { users, totalPages } = await getAllUsersIfAdmin({
                    page: parseInt(searchParams.get('page') || "1") || 1,
                    searchQuery: searchParams.get("search") || "",
                    limit: pageSize
                });

                setTotalPages(totalPages || 1);
                setUsers(users || []);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [currentPage, pageSize, searchParams]);

    const csvConfig = mkConfig({
        fieldSeparator: ',',
        filename: `users-${Date.now()}`,
        decimalSeparator: '.',
        useKeysAsHeaders: true,
    })

    const exportExcel = (rows: Row<User>[]) => {
        const rowData = rows.map((row) => {
            // Flatten address fields into a single string
            const address = `${row.original.address.city} - ${row.original.address.state} - ${row.original.address.zip} - ${row.original.address.street}`;

            // Extract fields to skip and create a new object without them
            const { orders, favourites, role, privileges, password, ...rest } = row.original;

            console.log(orders ? "" : "", favourites ? "" : "", password ? "" : "", role ? "" : "", privileges ? "" : "");

            // Create the final flattened row with address included
            const flattenedRow = { ...rest, address };

            return flattenedRow;
        });

        const csv = generateCsv(csvConfig)(rowData);
        download(csvConfig)(csv);
    };


    const columns: ColumnDef<User>[] = [
        {
            accessorKey: "fullName",
            header: "Full Name",
            cell: ({ row }) => <Link href={`/users/${row.original.id}`}>{row.getValue("fullName")}</Link>,
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => <div className="text-center">{row.getValue("email")}</div>,
        },
        {
            accessorKey: "phone",
            header: "Phone",
            cell: ({ row }) => <div className="text-center">{row.getValue("phone") || "N/A"}</div>,
        },
        {
            accessorKey: "isVerified",
            header: "Verified",
            cell: ({ row }) => (
                <div className="text-center">{row.getValue("isVerified") ? <VscVerified className="text-green-400 text-xl" /> : <X className="text-red-400 text-sm" />}</div>
            ),
        },
        {
            accessorKey: "isAdmin",
            header: "Admin",
            cell: ({ row }) => (
                <div className="text-center">{row.getValue("isAdmin") ? <Check className="text-green-400 text-sm" /> : <X className="text-red-400 text-sm" />}</div>
            ),
        },
        {
            accessorKey: "address",
            header: "Address",
            cell: ({ row }) => {
                const address: { street: string, city: string, state: string, zip: number } = row.getValue("address");
                return address ? `${address.street}, ${address.city}, ${address.state}, ${address.zip}` : "N/A";
            },
        },
        // {
        //     id: "actions",
        //     enableHiding: false,
        //     cell: ({ row }) => {
        //         const user = row.original;
        //         return (
        //             <DropdownMenu>
        //                 <DropdownMenuTrigger asChild>
        //                     <Button variant="ghost" className="h-8 w-8 p-0">
        //                         <span className="sr-only">Open menu</span>
        //                         <DotsHorizontalIcon className="h-4 w-4" />
        //                     </Button>
        //                 </DropdownMenuTrigger>
        //                 <DropdownMenuContent align="end">
        //                     <DropdownMenuLabel>Actions</DropdownMenuLabel>
        //                     <DropdownMenuItem asChild>
        //                         <Link href={`/admin/manage-users/${user.id}/edit`}>
        //                             <Pencil className="h-4 w-4 mr-1" /> Edit
        //                         </Link>
        //                     </DropdownMenuItem>
        //                     <DropdownMenuItem asChild>
        //                         <Link href={`/admin/manage-users/${user.id}/delete`}>
        //                             <Trash2 className="h-4 w-4 mr-1" /> Delete
        //                         </Link>
        //                     </DropdownMenuItem>
        //                 </DropdownMenuContent>
        //             </DropdownMenu>
        //         );
        //     },
        // },
    ];

    const table = useReactTable({
        data: users,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        rowCount: pageSize,
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <div className="m-4">
            <div className="w-full flex justify-end items-center gap-2">
                <Button disabled={users?.length === 0} type="button" onClick={() => exportExcel(table.getFilteredRowModel().rows)}><TbTableExport /> Export</Button>
            </div>
            <div className="flex items-center py-4 gap-2 w-full">
                <SelectResultsCount />
                <Input
                    placeholder="Filter users..."
                    value={(table.getColumn("fullName")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("fullName")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
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
                                    No users found.
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
