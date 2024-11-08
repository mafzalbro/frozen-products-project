// src/app/pages/checkout/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";
// import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";
import { Select, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select";
import { useCart } from "@/hooks/cart-context";
import { createCheckoutSession } from "@/actions/checkout";
import { verifyUser } from "@/actions/auth";
import { SelectContent } from '@radix-ui/react-select';
import { Label } from '@/components/ui/label';

const CheckoutPage = () => {
  const { cart } = useCart();
  const [activeTab, setActiveTab] = useState('basic');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [accountNumber, setAccountNumber] = useState(''); // Now a single string for the entire OTP/account number
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  useEffect(() => {
    const fetchUserInfo = async () => {

      const userInfo = await verifyUser()

      if (userInfo) {
        const parsedUserInfo = userInfo?.user;
        setName(parsedUserInfo?.fullName || '');
        setEmail(parsedUserInfo?.email || '');
        setPhone(parsedUserInfo?.phone || '');
        setAddress(parsedUserInfo?.address ? `${parsedUserInfo.address.street}, ${parsedUserInfo.address.city}` : '');
      }
    };

    fetchUserInfo();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (!name || !email || !address || !phone || accountNumber.length !== 6) {
      alert("Please fill in all fields.");
      return;
    }

    // Call server action to create checkout session
    const response = await createCheckoutSession({
      name,
      email,
      address,
      phone,
      accountNumber,
      cart,
      paymentMethod
    });

    // Handle the response
    if (response.success) {
      alert('Checkout successful!'); // Redirect to success page or perform another action
    } else {
      alert('Checkout failed. Please try again.');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-3xl font-bold">Checkout</h1>
      <p className="mt-4">Proceed with your payment.</p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className='my-4'>
        <TabsList className='mx-auto w-full'>
          <TabsTrigger value="basic" className='w-full'>Basic Information</TabsTrigger>
          <TabsTrigger value="payment" className='w-full'>Payment Details</TabsTrigger>
        </TabsList>

        <Card className="mt-6 p-4">
          <form onSubmit={handleSubmit}>
            <TabsContent value="basic">
              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="Shipping Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </TabsContent>

            <TabsContent value="payment">
              <div className="mb-4">
                <Label className="block mb-2">Account Number</Label>
                <Input
                  // maxLength={6}
                  value={accountNumber} // Bind the entire OTP string
                  onChange={(e) => { setAccountNumber(e.target.value) }} // Update the full account number at once
                >
                  {/* <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup> */}
                  {/* <InputOTPSeparator /> */}
                </Input>
              </div>
              <div className="mb-4">
                <Label className="block mb-2">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a payment method" />
                  </SelectTrigger>
                  <SelectContent className='w-full'>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    {/* Add more payment options as needed */}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full mt-4">Proceed to Payment</Button>
            </TabsContent>

          </form>
        </Card>
      </Tabs>
    </div>
  );
};

export default CheckoutPage;
