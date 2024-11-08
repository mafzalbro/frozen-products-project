import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { TbTableExport, TbTrash } from "react-icons/tb";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { Message } from "@/types";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ExportAndDeleteProps {
    data: Message[];
    filename: string;
    onDeleteAll: () => void;
}

const ExportAndDelete: React.FC<ExportAndDeleteProps> = ({ data, filename, onDeleteAll }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const csvConfig = mkConfig({
        fieldSeparator: ",",
        filename: `${filename}-${Date.now()}`,
        decimalSeparator: ".",
        useKeysAsHeaders: true,
    });

    const exportAsCSV = () => {
        const exportData = data.map((message) => ({
            id: message.id,
            name: message.name,
            message: message.message,
            created_at: message.created_at,
            replies: message.replies.map((reply) => `${reply.replyText} (${reply.replyDate})`).join("; "),
        }));

        const csv = generateCsv(csvConfig)(exportData);
        download(csvConfig)(csv);
    };

    const exportAsJSON = () => {
        const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(jsonBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${filename}-${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleDeleteAllMessages = async () => {
        setIsDialogOpen(false); // Close the dialog after confirming

        // Perform delete action, e.g., call API to delete all messages
        await onDeleteAll(); // Assuming `onDeleteAll` is the function to handle the deletion
        // Refresh or update state as necessary
    };

    return (
        <div className="flex items-center gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild
                    disabled={data.length === 0}>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <TbTableExport className="mr-1" /> Export
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={exportAsCSV}>Export as CSV</DropdownMenuItem>
                    <DropdownMenuItem onClick={exportAsJSON}>Export as JSON</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogTrigger asChild>
                    <Button
                        variant="destructive"
                        disabled={data.length === 0}
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => setIsDialogOpen(true)}
                    >
                        <TbTrash className="mr-1" /> Delete All
                    </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to delete all messages?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. All messages will be permanently deleted.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteAllMessages}>Confirm</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default ExportAndDelete;
