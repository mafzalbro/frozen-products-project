"use client"

// @/hooks/cookies.tsx
import Cookies from 'js-cookie';

// Define your custom hook for managing cookies
export const useCookies = () => {
  // No need to store cookie state separately, just work directly with the cookie API
  const getCookie = (name: string): string | undefined => {
    return Cookies.get(name);
  };

  // Set a cookie with name, value, and options (optional)
  const setCookie = (
    name: string,
    value: string,
    options?: Cookies.CookieAttributes
  ): void => {
    Cookies.set(name, value, options);
  };

  // Delete a cookie by name
  const deleteCookie = (name: string, options?: Cookies.CookieAttributes): void => {
    Cookies.remove(name, options);
  };

  return { getCookie, setCookie, deleteCookie };
};
