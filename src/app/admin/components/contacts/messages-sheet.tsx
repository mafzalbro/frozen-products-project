import * as React from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { InfoIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ReplyForm } from "./reply";
import isNew from "@/lib/is-new";
import { RiAdminFill } from "react-icons/ri";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import ExportAndDelete from "./delete-export";
import { deleteAllMessages } from "@/actions/contact";
import { Message } from "@/types";


interface MessagesSheetProps {
    messages: Message[];
    userId: number | null;
    email: string;
    showDate: (timeString: string) => React.JSX.Element;
}

export const MessagesSheet: React.FC<MessagesSheetProps> = ({ messages, userId, email, showDate }) => {
    const [messageList, setMessageList] = React.useState(messages);

    const updateReplies = (messageId: string, newReply: { replyId: string; replyText: string; replyDate: string }) => {
        setMessageList((prevMessages) =>
            prevMessages.map((msg) =>
                msg.id === messageId
                    ? { ...msg, replies: [...msg.replies, newReply] }
                    : msg
            )
        );
    };

    const handleDeleteAllMessages = async () => {
        const { success } = await deleteAllMessages({ email, userId: userId ? userId : null });
        if (success) {
            setMessageList([])
        }
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger className="flex gap-1">
                                <InfoIcon className="h-4 w-4" />
                                {messageList.length} Messages
                            </TooltipTrigger>
                            <TooltipContent>
                                Click to see messages...
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </Button>
            </SheetTrigger>
            <SheetContent className="p-2">
                <ExportAndDelete data={messageList} filename="messages" onDeleteAll={handleDeleteAllMessages}
                />

                <DialogTitle className="text-lg font-semibold mb-4">Messages</DialogTitle>
                <DialogDescription className="mb-4">Here are your recent messages.</DialogDescription>
                <ScrollArea className="h-[80vh] overflow-auto px-4">
                    <div className="flex flex-col">
                        {messageList.length === 0 && <div className="text-muted-foreground">
                            No messages!
                        </div>}
                        {messageList.map((message) => (
                            <React.Fragment key={message.id}>
                                <div className="p-2 rounded-md bg-card mb-2">
                                    <div className="flex justify-between items-center">
                                        <div className="font-bold">{message.name}
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <Badge className="rounded-full mx-1" variant={'outline'}>i</Badge>
                                                    </TooltipTrigger> <TooltipContent>
                                                        This is Name used by user when using contact form
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        {isNew(message.created_at, 7) && <Badge className="ml-2" variant={"destructive"}>New</Badge>}
                                    </div>
                                    <p className="text-sm">{message.message}</p>
                                    <div className="text-xs text-muted-foreground mt-1">{showDate(message.created_at)}</div>
                                    <div className="mt-2">
                                        <h3><Badge className="m-1">Replies</Badge></h3>
                                        {message.replies.length === 0 && <div className="text-sm text-muted-foreground">No reply yet!</div>
                                        }
                                        {message.replies.map((reply) => (
                                            <div key={reply.replyId} className="ml-2 text-sm border p-2">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <strong>
                                                                <RiAdminFill className="mr-2 inline-flex text-lg" />
                                                            </strong>
                                                        </TooltipTrigger> <TooltipContent>
                                                            Replied by Admin!
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                                {reply.replyText} <p className="text-xs mt-1 text-muted-foreground">{showDate(reply.replyDate)}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <Separator className="my-2" />
                                    <ReplyForm messageId={message.id} userId={userId} onReply={updateReplies} email={email} />
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet >
    );
};
