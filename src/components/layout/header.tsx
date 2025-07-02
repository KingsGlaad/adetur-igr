"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { MobileMenu } from "./mobile-menu";
import { ThemeToggle } from "@/app/dashboard/_components/theme-toggle";

export function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-80 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between px-6">
          <Link href="/" className="flex items-center space-x-2">
            <Image src={"/logo.png"} alt="Logo ADETUR" width={32} height={32} />
            <span className="text-xl font-bold">ADETUR</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={cn(
                "transition-colors",
                isActive("/")
                  ? "text-neutral-900 dark:text-white font-medium"
                  : "text-neutral-700 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              )}
            >
              Início
            </Link>
            <Link
              href="/quem-somos"
              className={cn(
                "transition-colors",
                isActive("/quem-somos")
                  ? "text-neutral-900 font-medium dark:text-white"
                  : "text-neutral-700 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              )}
            >
              Quem Somos
            </Link>
            <Link
              href="/municipios"
              className={cn(
                "transition-colors",
                isActive("/municipios")
                  ? "text-neutral-900 font-medium dark:text-white"
                  : "text-neutral-700 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              )}
            >
              Municípios
            </Link>
            <Link
              href="/login"
              className={cn(
                "transition-colors",
                isActive("/login")
                  ? "text-neutral-900 dark:text-white font-medium"
                  : "text-neutral-700 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              )}
            >
              Entrar
            </Link>
            <ThemeToggle />
          </nav>

          {/* Mobile Navigation */}
          <div className="flex items-center space-x-4 md:hidden">
            <MobileMenu />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
