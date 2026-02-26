"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Store, Download, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  // Cerrar el menú al cambiar a pantalla de escritorio
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Prevenir el scroll del cuerpo cuando el menú está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const navItems = [
    { name: "Resumen", href: "#overview" },
    { name: "Funciones", href: "#features" },
    { name: "Demo", href: "#demo" },
    { name: "FAQ", href: "#faq" },
  ]

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b transition-colors duration-300",
      isOpen ? "bg-background" : "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                <Store className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold tracking-tight font-headline text-foreground">POSMariche</span>
            </Link>
          </div>

          {/* Navegación de Escritorio */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {item.name}
              </Link>
            ))}
            <Button size="sm" className="bg-primary hover:bg-primary/90 shadow-sm" asChild>
              <a href="/POSMariche.exe" download="POSMariche.exe">
                Descargar
              </a>
            </Button>
          </nav>

          {/* Botón de Menú Móvil */}
          <button
            className="md:hidden p-2 text-foreground rounded-md hover:bg-accent transition-colors outline-none focus:ring-2 focus:ring-primary/20"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Superposición de Navegación Móvil */}
      <div
        className={cn(
          "fixed inset-0 top-16 z-50 md:hidden transition-all duration-300 ease-in-out overflow-hidden",
          isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-4 pointer-events-none"
        )}
      >
        {/* Fondo oscuro para cerrar al hacer clic fuera */}
        <div className="absolute inset-0 bg-black/40" onClick={() => setIsOpen(false)} />
        
        {/* Contenido del Menú */}
        <div className="relative flex flex-col h-full bg-background border-t shadow-2xl w-full">
          <nav className="flex flex-col p-6 gap-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-lg font-semibold py-4 px-4 rounded-xl hover:bg-primary/5 active:bg-primary/10 transition-colors flex items-center justify-between group text-foreground/80 hover:text-primary border-b border-accent/10"
                onClick={() => setIsOpen(false)}
              >
                <span>{item.name}</span>
                <ChevronRight className="h-5 w-5 opacity-40 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
            
            <div className="mt-8 px-4">
              <Button 
                className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 rounded-xl flex items-center justify-center gap-3 transition-transform active:scale-[0.98]" 
                asChild
              >
                <a href="/POSMariche.exe" download="POSMariche.exe" onClick={() => setIsOpen(false)}>
                  <Download className="h-6 w-6" />
                  Descargar POSMariche
                </a>
              </Button>
            </div>
          </nav>
          
          <div className="mt-auto p-8 border-t text-center bg-accent/5">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Potenciado por</p>
            <p className="text-sm text-foreground font-semibold">POSMariche Excelencia</p>
          </div>
        </div>
      </div>
    </header>
  )
}
