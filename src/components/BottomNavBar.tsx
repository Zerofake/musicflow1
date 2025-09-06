"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ListMusic, Music } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Playlists", icon: ListMusic },
  { href: "/songs", label: "Músicas", icon: Music },
];

export function BottomNavBar() {
  const pathname = usePathname();

  return (
    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent">
        <nav className="absolute bottom-4 left-4 right-4 flex items-center justify-around h-16 bg-card border border-border rounded-xl shadow-lg">
      {navItems.map((item) => {
        const isActive = item.href === "/" ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            href={item.href}
            key={item.href}
            className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <item.icon className={cn("h-6 w-6", isActive && "text-primary")} />
            <span className={cn("text-xs font-medium", isActive && "text-primary")}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
    </div>
  );
}
