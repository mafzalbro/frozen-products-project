"use server";

import { headers } from "next/headers";

export const getPathname = async () => {
  const domain = (await headers()).get("host");
  const fullUrl = (await headers()).get("referer");
  const pathname = fullUrl?.split(`${domain}`)[1];
  return pathname;
};
