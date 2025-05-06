"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { MobileMenu } from "./mobile-menu";

export function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-80 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image src={"/logo.png"} alt="Logo ADETUR" width={32} height={32} />
            <span className="text-xl font-bold text-white">ADETUR</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={cn(
                "transition-colors",
                isActive("/")
                  ? "text-white font-medium"
                  : "text-neutral-400 hover:text-white"
              )}
            >
              Início
            </Link>
            <Link
              href="/quem-somos"
              className={cn(
                "transition-colors",
                isActive("/quem-somos")
                  ? "text-white font-medium"
                  : "text-neutral-400 hover:text-white"
              )}
            >
              Quem Somos
            </Link>
            <Link
              href="/municipios"
              className={cn(
                "transition-colors",
                isActive("/municipios")
                  ? "text-white font-medium"
                  : "text-neutral-400 hover:text-white"
              )}
            >
              Municípios
            </Link>
            <Link
              href="/login"
              className={cn(
                "transition-colors",
                isActive("/login")
                  ? "text-white font-medium"
                  : "text-neutral-400 hover:text-white"
              )}
            >
              Entrar
            </Link>
          </nav>

          {/* Mobile Navigation */}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
