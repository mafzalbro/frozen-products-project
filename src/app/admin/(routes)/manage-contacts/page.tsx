"use client";

import * as React from "react";
import {
    ChevronDownIcon,
    // DotsHorizontalIcon,
    // TrashIcon
} from "@radix-ui/react-icons";
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

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    // DropdownMenuItem,
    // DropdownMenuLabel,
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
import { Contact } from "@/types";  // Assuming a Contact type definition with necessary fields
// import Link from "next/link";
import Loader from "@/components/layout/spinners/Loader";
import Pagination from "@/app/admin/components/admin/pagination";
import { useSearchParams } from "next/navigation";
import SelectResultsCount from "../../components/admin/select-count";
import { fetchContacts } from "@/actions/contact";
import { MessagesSheet } from "../../components/contacts/messages-sheet";
import { mkConfig, generateCsv, download } from 'export-to-csv'
import { TbTableExport } from "react-icons/tb";
// import { Reply } from "lucide-react";

export default function ContactsTable() {
    const searchParams = useSearchParams();
    const [contacts, setContacts] = React.useState<Contact[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [currentPage, setCurrentPage] = React.useState(1);
    const [totalPages, setTotalPages] = React.useState(0);

    const pageSize = parseInt(searchParams.get("page-size") || "10") || 10;

    React.useEffect(() => {
        const fetchContactData = async () => {
            setLoading(true);
            try {
                const { contacts, totalPages } = await fetchContacts({
                    page: currentPage,
                    limit: pageSize
                });

                setTotalPages(totalPages || 0);
                setCurrentPage(parseInt(searchParams.get("page") || "1") || 1);
                setContacts(JSON.parse(JSON.stringify(contacts)));
            } catch (error) {
                console.error("Failed to fetch contacts:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchContactData();
    }, [currentPage, pageSize, searchParams]);

    const csvConfig = mkConfig({
        fieldSeparator: ',',
        filename: `contacts-${Date.now()}`,
        decimalSeparator: '.',
        useKeysAsHeaders: true,
    })

    const exportExcel = (rows: Row<Contact>[]) => {
        const rowData = rows.map((row) => {
            // Flatten each message with unique field names
            const flatMessages = row.original.messages.reduce((acc, msg, index) => {
                acc[`message_name_${index + 1}`] = msg.name;
                acc[`message_text_${index + 1}`] = msg.message;
                acc[`message_createdAt_${index + 1}`] = msg.created_at;
                return acc;
            }, {} as Record<string, string>);

            // Create a new object that excludes `messages` and includes `flatMessages`
            const { messages, ...rest } = row.original; // Exclude messages
            console.log(messages.length ? "" : "");
            const flattenedRow = { ...rest, ...flatMessages }; // Add flattened messages

            return flattenedRow;
        });

        const csv = generateCsv(csvConfig)(rowData);
        download(csvConfig)(csv);
    };




    const showDate = (timeString: string) => {
        const time = new Date(timeString).toLocaleString()
        return time ? <>{time}</> : <></>
    }
    
    const columns: ColumnDef<Contact>[] = [
        {
            accessorKey: "id",
            header: "ID",
            cell: ({ row }) => <div className="text-center">{row.getValue("id")}</div>,
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => <div className="font-medium">{row.getValue("email")}</div>,
        },
        {
            id: "messages",
            header: "Messages",
            cell: ({ row }) => {
                const messages = row.original.messages;
                const user = row.original;
                return (
                    <MessagesSheet messages={messages} userId={user.userId || null} showDate={showDate} email={user.email} />
                );
            },
        },
        {
            accessorKey: "createdAt",
            header: "Recieved At",
            cell: ({ row }) => <div className="text-center">{showDate(row.getValue("createdAt"))}</div>,
        },
        // {
        //     id: "actions",
        //     enableHiding: false,
        //     cell: ({ row }) => {
        //         const contact = row.original;

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
        //                         <Link href={`/admin/manage-contacts/reply?email=${contact.email}&name=${contact?.messages[contact?.messages.length - 1].name}&message=${contact?.messages[contact?.messages.length - 1].message}&type=general`}>
        //                             <Reply className="h-4 w-4 mr-1" /> Reply
        //                         </Link>
        //                     </DropdownMenuItem>
        //                 </DropdownMenuContent>
        //             </DropdownMenu>
        //         );
        //     },
        // },
    ];

    const table = useReactTable({
        data: contacts,
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
            <div className="w-full flex justify-between gap-2">
                <SelectResultsCount />
                <Button type="button" disabled={contacts?.length === 0} onClick={() => exportExcel(table.getFilteredRowModel().rows)}><TbTableExport /> Export</Button>
                {/* <Link href={`/admin/manage-contacts/new`} passHref>
                    <Button>Add New Contact</Button>
                </Link> */}
            </div>

            <div className="flex items-center py-4 gap-1">
                <Input
                    placeholder="Filter contacts..."
                    value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("email")?.setFilterValue(event.target.value)
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
                        {table.getAllColumns().filter((column) => column.getCanHide()).map((column) => (
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
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
    );
}
