/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { assignRole, getAllUsersIfAdmin } from "@/actions/auth";
import { User } from "@/types";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";  // Assuming a HoverCard component exists
import { getSidebarItems } from "@/store/sidebars-items";
import Link from "next/link";
import { IconType } from "react-icons";
import { Input } from "@/components/ui/input";

const checkSuperAdminExists = () => Promise.resolve(true);

const ManageAdminAccountsPage = () => {
    const [role, setRole] = useState<'super_admin' | 'admin' | 'editor' | 'user' | 'custom'>("editor");
    const [userId, setUserId] = useState("");
    const [users, setUsers] = useState<User[]>([]);
    const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
    const [superAdminExists, setSuperAdminExists] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [open, setOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [adminSlugs, setAdminSlugs] = useState<{
        title: string;
        url: string;
    }[]>([]);
    const [editorSlugs, setEditorSlugs] = useState<{
        title: string;
        url: string;
    }[]>([]);

    const [availableSlugs, setAvailableSlugs] = useState<{
        title: string;
        url: string;
        icon: IconType;
    }[]>([]);


    const getAccessList = async (role: "super_admin" | "admin" | "editor" | "user" | "custom") => {
        const items = await getSidebarItems(role)
        return items
    }

    const setupSlugs = async () => {
        const slugs = await getAccessList("super_admin")
        setAvailableSlugs(slugs)
        const admin = await getAccessList('admin')
        setAdminSlugs(admin)
        const ediotr = await getAccessList('editor')
        setEditorSlugs(ediotr)
    }
    useEffect(() => {
        setupSlugs()
    }, [setupSlugs])


    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                const exists = await checkSuperAdminExists();
                setSuperAdminExists(exists);

                const response = await getAllUsersIfAdmin({ all: true });
                if (response.success && response.users) {
                    setUsers(response.users);
                }
            } catch {
                setError("Failed to load users.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, [success]);

    const handleRoleChange = (newRole: 'super_admin' | 'admin' | 'editor' | 'user' | 'custom') => {
        setRole(newRole);
        if (newRole !== "custom") {
            setSelectedSlugs([]);
        }
    };

    const handleSlugChange = (slug: string) => {
        setSelectedSlugs(prevSelected =>
            prevSelected.includes(slug)
                ? prevSelected.filter(item => item !== slug)
                : [...prevSelected, slug]
        );
    };

    const handleAssignRole = async () => {
        setSubmitting(true)
        if (!userId) {
            setSubmitting(false)
            setError("Please select a user.");
            return;
        }

        let privileges: string[] = [];
        if (role === "custom" && selectedSlugs.length > 0) {
            privileges = selectedSlugs;
        }

        const result = await assignRole(role, privileges, parseInt(userId));
        if (result.success) {
            setSuccess(result.message);
        } else {
            setError(result.message);
        }
        setSubmitting(false)
    };

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-4xl">Accounts Management</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Assign Roles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Label>Select User</Label>
                    {isLoading ? <div className="text-xs text-muted-foreground">
                        Loading...
                    </div> :
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="w-full justify-between !rounded-lg"
                                >
                                    {userId
                                        ? users.find((user) => user.id.toString() === userId)?.fullName
                                        : "Select user..."}
                                    <ChevronsUpDown className="opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandInput placeholder="Search with username..." className="h-9" />
                                    <CommandList>
                                        <CommandEmpty>No user found.</CommandEmpty>
                                        <CommandGroup>
                                            {users.map((user) => (
                                                <CommandItem
                                                    disabled={user.role === "super_admin"}
                                                    key={user.id}
                                                    value={user.username}
                                                    onSelect={() => {
                                                        setUserId(user.id.toString());
                                                        setRole(user.role);
                                                        setOpen(false);
                                                    }}
                                                >
                                                    {/* HoverCard for User Info */}
                                                    <HoverCard>
                                                        <HoverCardTrigger>
                                                            {user.fullName}
                                                            {user.role === "super_admin" && "- You"}
                                                            (<span className="text-xs text-muted-foreground">{user.username}</span>)
                                                            <Badge variant={"outline"}>{user.role}</Badge>
                                                        </HoverCardTrigger>
                                                        <HoverCardContent className="space-y-2 p-2 flex gap-1">
                                                            {user?.image_url &&
                                                                <div>
                                                                    <img src={user?.image_url} alt={user?.fullName + "profile"} className="h-10 w-10 rounded-full object-contain" />
                                                                </div>
                                                            }
                                                            <div>
                                                                <p><strong className="text-muted-foreground">Email:</strong> {user.email}</p>
                                                                <p><strong className="text-muted-foreground">username:</strong> {user.username}</p>
                                                                <p><strong className="text-muted-foreground">Full Name:</strong> {user.fullName}</p>
                                                                <p><strong className="text-muted-foreground">Phone:</strong> {user.phone}</p>
                                                                <p><strong className="text-muted-foreground">Verified:</strong> {user.isVerified ? "Yes" : "No"}</p>
                                                                <p><strong className="text-muted-foreground">Role:</strong> {user.role}</p>
                                                            </div>
                                                        </HoverCardContent>
                                                    </HoverCard>
                                                    <Check
                                                        className={`ml-auto ${userId === user.id.toString() ? "opacity-100" : "opacity-0"}`}
                                                    />
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    }

                    <Label>Role</Label>
                    <Select onValueChange={handleRoleChange} value={role} disabled={userId === ""}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent className="overflow-visible">
                            <SelectItem value="super_admin" disabled={superAdminExists}>
                                Super Admin <Badge variant="secondary">All pages available</Badge>
                            </SelectItem>

                            {/* Admin role with styled HoverCard */}
                            <SelectItem value="admin">
                                <div className="flex items-center gap-2">
                                    <span>Admin</span>
                                    <HoverCard>
                                        <HoverCardTrigger asChild>
                                            <Badge variant="secondary">pages</Badge>
                                        </HoverCardTrigger>
                                        <HoverCardContent className="bg-card rounded-lg shadow-lg p-4 w-64">
                                            <h4 className="text-lg font-semibold mb-3 text-muted-foreground">Available Pages</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {adminSlugs?.map((slug) => (
                                                    <Link href={slug.url} key={slug.url}>
                                                        <Button variant="link" className="text-blue-600 hover:underline">
                                                            {slug.title}
                                                        </Button>
                                                    </Link>
                                                ))}
                                            </div>
                                        </HoverCardContent>
                                    </HoverCard>
                                </div>
                            </SelectItem>

                            {/* Editor role with styled HoverCard */}
                            <SelectItem value="editor">
                                <div className="flex items-center gap-2">
                                    <span>Editor</span>
                                    <HoverCard>
                                        <HoverCardTrigger asChild>
                                            <Badge variant="secondary">pages</Badge>
                                        </HoverCardTrigger>
                                        <HoverCardContent className="bg-card rounded-lg shadow-lg p-4 w-64">
                                            <h4 className="text-lg font-semibold mb-3 text-muted-foreground">Available Pages</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {editorSlugs?.map((slug) => (
                                                    <Link href={slug.url} key={slug.url}>
                                                        <Button variant="link" className="text-blue-600 hover:underline">
                                                            {slug.title}
                                                        </Button>
                                                    </Link>
                                                ))}
                                            </div>
                                        </HoverCardContent>
                                    </HoverCard>
                                </div>
                            </SelectItem>

                            {/* Custom role */}
                            <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                    </Select>


                    {role === "custom" && (
                        <div className={`space-y-2 ${userId === "" ? 'hidden' : 'block'}`}>
                            <Label>Custom Role Slugs</Label>
                            <div className="flex flex-wrap">
                                {availableSlugs.map(slug => (
                                    <div key={slug.url} className="flex items-center space-x-2 mx-4">
                                        <Label htmlFor={slug.url} className="flex items-center gap-1"><slug.icon className="inline-flex" /> {slug.title === "Accounts" ? <>{slug.title} <span className="text-yellow-400">(Warning, choose if you trust him!)</span></> : slug.title}</Label>
                                        <Input
                                            type="checkbox"
                                            id={slug.url}
                                            checked={selectedSlugs.includes(slug.url)}
                                            onChange={() => handleSlugChange(slug.url)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}


                    {error && (
                        <Alert variant="default">
                            <AlertDescription className="text-red-500">{error}</AlertDescription>
                        </Alert>
                    )}
                    {success && (
                        <Alert variant="default">
                            <AlertDescription className="text-green-500">{success}</AlertDescription>
                        </Alert>
                    )}

                    <Button className={`mt-3`} disabled={!!success || submitting || selectedSlugs.length === 0} onClick={handleAssignRole}>Assign Role</Button>
                </CardContent>
            </Card>
        </div >
    );
};

export default ManageAdminAccountsPage;
