"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollManager() {
  const pathname = usePathname();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  // Scroll to top if clicking a link to the exact same route
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as Element).closest("a");
      if (!target || !target.href) return;

      const hrefAttr = target.getAttribute("href");
      // Ignore anchor links trying to jump to sections
      if (hrefAttr?.startsWith("#") || target.href.includes("#")) {
        return;
      }

      // If the link points to the exact same URL as current
      if (target.href === window.location.href) {
        e.preventDefault(); // Prevent nextjs from silently ignoring
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
