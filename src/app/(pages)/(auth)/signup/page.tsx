import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { register, verifyAuth } from "@/actions/auth";
import { redirect } from "next/navigation";
import SubmitButton from "@/components/layout/buttons/submit";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import GeneratePasswordInput from "@/components/ui/generate-password-input";
import { getMeta } from "@/store/metadata";

type Address = {
  street: string;
  city: string;
  state: string;
  zip: string;
};

type SignupData = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: Address;
  agreeToTerms: boolean;
};

export default function SignupPage() {

  verifyAuth().then((auth) => {
    if (auth.isAuthenticated) {
      redirect("/");
    }
  });

  const handleSubmit = async (formdata: FormData) => {
    "use server";

    // Constructing the data object explicitly
    const data: SignupData = {
      fullName: formdata.get("fullName") as string,
      username: formdata.get("username") as string,
      email: formdata.get("email") as string,
      password: formdata.get("password") as string,
      confirmPassword: formdata.get("confirmPassword") as string,
      phone: formdata.get("phone") as string,
      address: {
        street: formdata.get("address.street") as string,
        city: formdata.get("address.city") as string,
        state: formdata.get("address.state") as string,
        zip: formdata.get("address.zip") as string,
      },
      agreeToTerms: formdata.get("agreeToTerms") === "on", // Checkbox values are "on" if checked
    };

    const result = await register(data);

    if (result?.success) {
      // Redirect after successful registration
      redirect(`/login?toastMessage=${encodeURIComponent(result?.message.toString() || "Sign-up success! Please login")}&toastType=success`);
    } else {
      // Redirect with error message if registration fails
      redirect(`/signup?toastMessage=${encodeURIComponent(result?.message.toString() || "Sign-up failed")}&toastType=error`);
    }
  };

  return (
    <form action={handleSubmit} className="sm:w-2/3 mt-4 md:mt-10 space-y-6 mx-4 sm:mx-auto border rounded-lg p-4 sm:p-10 my-10">
      <h1 className="text-4xl">Sign Up for {getMeta().siteTitle}</h1>
      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input id="fullName" name="fullName" placeholder="John Doe" required />
      </div>

      <div>
        <Label htmlFor="username">Username (You can't change it later, Be carefull!)</Label>
        <Input id="username" name="username" placeholder="Username" required />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" name="email" placeholder="john@example.com" required />
      </div>

      <div>
        <GeneratePasswordInput />
      </div>

      {/* <div>
        <Label htmlFor="password">Password</Label>
        <Input type="password" id="password" name="password" placeholder="Enter password" required />
      </div> */}

      <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input type="password" id="confirmPassword" name="confirmPassword" placeholder="Re-enter password" required />
      </div>

      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input id="phone" name="phone" placeholder="1234567890" required />
      </div>

      <h2 className="text-lg">Address</h2>
      <div>
        <Label htmlFor="address.street">Street Address</Label>
        <Input id="address.street" name="address.street" placeholder="Street Address" required />
      </div>
      <div className="flex space-x-4">
        <div>
          <Label htmlFor="address.city">City</Label>
          <Input id="address.city" name="address.city" placeholder="City" required />
        </div>
        <div>
          <Label htmlFor="address.state">State</Label>
          <Input id="address.state" name="address.state" placeholder="State" required />
        </div>
        <div>
          <Label htmlFor="address.zip">Zip Code</Label>
          <Input id="address.zip" name="address.zip" placeholder="Zip Code" required />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input type="checkbox" id="agreeToTerms" name="agreeToTerms" required />
        <Label htmlFor="agreeToTerms">I agree to the terms and conditions</Label>
      </div>

      <SubmitButton>Sign Up</SubmitButton>

      <p className="text-gray-600 dark:text-gray-300 text-sm">Already have account?</p>
      <div className='flex justify-between items-center'>
        <Link passHref href={'/login'}>
          <Button variant={"ghost"}>
            Login
          </Button>
        </Link>
        {/* <Separator orientation="vertical" className='h-full'/> */}
        <Link passHref href={'/forgot-password'}>
          <Button variant={"ghost"}>
            Forgot Password
          </Button>
        </Link>
      </div>

    </form>
  );
}
