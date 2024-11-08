"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function MessageReplies({
    message,
}: {
    message: any;
}) {
    return (
        <>
            {/* Replies Section */}
            <div className="mt-4 space-y-2">
                {/* Collapsible section with default open and smooth transitions */}
                <Collapsible defaultOpen>
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold">Replies</h4>
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm">
                                Toggle Replies
                            </Button>
                        </CollapsibleTrigger>
                    </div>

                    <CollapsibleContent className="transition-all duration-300 ease-in-out transform-gpu space-y-2 mt-2">
                        {message.replies.length === 0 ? (
                            <div className="text-muted-foreground">No replies from admin yet.</div>
                        ) : (
                            message.replies.map((reply: any) => (
                                <div key={reply.replyId} className="border-t pt-2">
                                    <p>{reply.replyText}</p>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(reply.replyDate).toLocaleString()}
                                    </span>
                                </div>
                            ))
                        )}
                    </CollapsibleContent>
                </Collapsible>
            </div>
        </>
    );
}
