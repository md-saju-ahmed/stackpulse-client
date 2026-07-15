import type { Metadata } from "next";
import { HomeClient } from "@/features/home/components/HomeClient";

export const metadata: Metadata = {
  title: "StackPulse — Developer Tools Directory",
  description:
    "Discover, compare, and bookmark the best developer tools, libraries, and frameworks.",
};

export default function HomePage() {
  return <HomeClient />;
}
