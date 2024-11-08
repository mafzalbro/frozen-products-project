"use client";

import * as React from "react";
import {
    ChevronDownIcon,
    DotsHorizontalIcon,
    TrashIcon,
} from "@radix-ui/react-icons";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    // getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import { fetchProducts } from "@/actions/products";
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
import { FrozenProduct } from "@/types";
import { Eye, Pencil } from "lucide-react";
import Link from "next/link";
// import Image from "next/image";
import { MdNewLabel } from "react-icons/md";
import Loader from "@/components/layout/spinners/Loader";
import Pagination from "../../components/admin/pagination";
import { useSearchParams } from "next/navigation";
import SelectResultsCount from "../../components/admin/select-count";

export default function ProductTable() {
    const searchParams = useSearchParams()
    const [products, setProducts] = React.useState<FrozenProduct[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [currentPage, setCurrentPage] = React.useState(1);
    const [totalPages, setTotalPages] = React.useState(0); // Track total pages

    const pageSize = searchParams.get('page-size') || "10"

    React.useEffect(() => {
        const fetchProductData = async () => {
            setLoading(true);
            try {
                const { products, totalPages } = await fetchProducts({ page: currentPage.toString(), pageSize: pageSize });
                setProducts(products);
                setCurrentPage(parseInt(searchParams.get('page') || "1") || 1)
                setTotalPages(totalPages);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, searchParams]); // Fetch new data when currentPage changes

    const columns: ColumnDef<FrozenProduct>[] = [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
        },
        {
            accessorKey: "price",
            header: "Price",
            cell: ({ row }) => {
                const price = parseFloat(row.getValue("price"));
                const formatted = new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                }).format(price);
                return <div className="text-right font-medium">{formatted}</div>;
            },
        },
        {
            accessorKey: "stock",
            header: "Stock",
            cell: ({ row }) => <div className="text-center">{row.getValue("stock")}</div>,
        },
        {
            accessorKey: "image_url",
            header: "Image",
            cell: ({ row }) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img width={100} height={100} src={row.getValue("image_url")} alt="Product Image" className="w-16 h-16 object-cover rounded-md" />
            ),
        },
        {
            accessorKey: "category",
            header: "Category",
            cell: ({ row }) => <div>{row.getValue("category")}</div>,
        },
        {
            accessorKey: "rating_number",
            header: "Rating",
            cell: ({ row }) => (
                <div className="text-center">{row.getValue("rating_number") || "N/A"}</div>
            ),
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const product = row.original;
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
                            <DropdownMenuItem asChild>
                                <Link href={`/products/${product.slug}`}>
                                    <Eye className="h-4 w-4 mr-1" /> View Live
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={`/admin/manage-products/${product.id}/edit`}>
                                    <Pencil className="h-4 w-4 mr-1" /> Edit
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={`/admin/manage-products/${product.id}/delete`}>
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
        data: products,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        // getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
        rowCount: parseInt(pageSize),
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

                <Link href={`/admin/manage-products/new`} passHref>
                    <Button>
                        <MdNewLabel /> Add New
                    </Button>
                </Link>
            </div>
            <div className="flex items-center py-4 gap-1">
                <Input
                    placeholder="Filter products..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
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
                        {table
                            .getAllColumns()
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
                                    No products found.
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
