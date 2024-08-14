"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function YandexMetrika({ id }: { id?: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    window.ym(id, "hit", window.location.href);
  }, [pathname, searchParams, id]);

  return null;
}
