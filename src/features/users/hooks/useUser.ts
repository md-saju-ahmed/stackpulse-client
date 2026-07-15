"use client";
import { useQuery } from "@tanstack/react-query";
import { userService } from "../user.service";

export function useUser(id: string) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => userService.getUser(id),
    enabled: !!id,
  });
}
