import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import { env } from "@/env.mjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});
