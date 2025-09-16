"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Headphones, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoIcon } from "@/components/icons/LogoIcon";
import { AddMusicButton } from "./AddMusicButton";

const navItems = [
  { href: "/", label: "Playlists", icon: LogoIcon },
  { href: "/songs", label: "Músicas", icon: Headphones },
  { href: "/store", label: "Loja", icon: Store },
];

export function BottomNavBar() {
  const pathname = usePathname();

  return (
    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent">
        <nav className="absolute bottom-4 left-4 right-4 grid grid-cols-4 items-center justify-around h-16 bg-card border border-border rounded-xl shadow-lg">
      
        <Link
            href="/"
            className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <LogoIcon className={cn("h-6 w-6", pathname === "/" && "text-primary")} />
            <span className={cn("text-xs font-medium", pathname === "/" && "text-primary")}>
              Playlists
            </span>
        </Link>
        
        <Link
            href="/songs"
            className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <Headphones className={cn("h-6 w-6", pathname.startsWith("/songs") && "text-primary")} />
            <span className={cn("text-xs font-medium", pathname.startsWith("/songs") && "text-primary")}>
              Músicas
            </span>
        </Link>

        <AddMusicButton />
        
        <Link
            href="/store"
            className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <Store className={cn("h-6 w-6", pathname.startsWith("/store") && "text-primary")} />
            <span className={cn("text-xs font-medium", pathname.startsWith("/store") && "text-primary")}>
              Loja
            </span>
        </Link>

    </nav>
    </div>
  );
}
