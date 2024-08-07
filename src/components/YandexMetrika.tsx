"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function YandexMetrika() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = `${pathname}?${searchParams}`;
    // @ts-expect-error - 'ym'  defined in <Script/> in root layout
    window.ym(process.env.METRIKA_ID, "hit", url);
  }, [pathname, searchParams]);

  return null;
}
