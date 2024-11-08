"use client"

import { logout } from "@/actions/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ThreeDotsSpinner from "@/components/layout/spinners/three-dots";

export default function LogoutPage() {
  const router = useRouter(); // Access the router

  useEffect(() => {
    const performLogout = async () => {
      await logout();
      router.push('/login');
      if (window !== undefined) {
        localStorage.removeItem('user')
        localStorage.removeItem('isLoggedIn')
      }
    };

    performLogout();
  }, [router]);

  return (
    <div className="w-2/3 mt-4 md:mt-10 space-y-6 mx-auto p-4 sm:p-10 text-sm">
      <h1 className="text-2xl flex justify-center items-center gap-2">
        Logging you out
        <ThreeDotsSpinner />
      </h1>
    </div>
  );
}
