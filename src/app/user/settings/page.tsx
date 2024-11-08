"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Settings() {
    const { setTheme, theme } = useTheme();
    return (
        <div className="p-10">
            <h1 className="text-2xl font-semibold mb-8">Settings</h1>
            <div className="space-y-6">
                <section>
                    <h2 className="text-xl font-bold">Preferences</h2>
                    <div className="mt-4 space-y-2">
                        <h3 className="text-lg font-semibold">Theme</h3>
                        <div className="flex space-x-4">
                            {/* Light theme button */}
                            <Button onClick={() => setTheme("light")} variant={`${theme == "light" ? "default" : "outline"}`}>
                                <Sun className="h-5 w-5" />
                                Light
                            </Button>

                            {/* Dark theme button */}
                            <Button onClick={() => setTheme("dark")} variant={`${theme == "dark" ? "default" : "outline"}`}>
                                <Moon className="h-5 w-5" />
                                Dark
                            </Button>

                            {/* System theme button */}
                            <Button onClick={() => setTheme("system")} variant={`${theme == "system" ? "default" : "outline"}`}>
                                <Monitor className="h-5 w-5" />
                                System
                            </Button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};
