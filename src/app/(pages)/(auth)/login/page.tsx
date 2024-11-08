import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login, verifyAuth } from "@/actions/auth";
import { redirect } from "next/navigation";
import SubmitButton from "@/components/layout/buttons/submit";
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function LoginPage() {
  const { isAuthenticated } = await verifyAuth();

  if (isAuthenticated) {
    redirect('/');
  }

  const handleSubmit = async (formdata: FormData) => {
    "use server";

    const data = Object.fromEntries(formdata.entries()) as { userInput: string; password: string };

    const result = await login(data);

    if (result?.success) {
      // Redirect after successful login
      redirect(`/?toastMessage=${encodeURIComponent(result?.message || "Logged in Successfully")}&toastType=success`);
    } else {
      // Redirect with error message if login fails
      redirect(`/login?toastMessage=${encodeURIComponent(result?.message || "Login failed")}&toastType=error`);
    }
  };

  return (
    <>
      <form action={handleSubmit} className="sm:w-2/3 mt-4 md:mt-10 space-y-6 mx-4 sm:mx-auto border rounded-lg p-4 sm:p-10 my-10">
        <h1 className="text-3xl">Welcome to Login</h1>
        <div className="flex flex-col space-y-4">
          <div>
            <Label htmlFor="userInput">Username or Email</Label>
            <Input
              id="userInput"
              name="userInput"
              placeholder="Enter your username or email"
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              required
            />
          </div>
        </div>
        <SubmitButton>
          Login
        </SubmitButton>
        {/* <Separator orientation="horizontal" /> */}
        <div className='flex justify-between items-center'>
          <Link passHref href={'/signup'}>
            <Button variant={"ghost"}>
              Sign Up
            </Button>
          </Link>
          {/* <Separator orientation="vertical" className='h-full'/> */}
          <Link passHref href={'/forgot-password'}>
            <Button variant={"ghost"}>
              Forgot Password
            </Button>
          </Link>
        </div>
        <div>

        </div>
      </form>
    </>
  );
}
