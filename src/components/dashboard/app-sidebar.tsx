'use client';

import * as React from "react";
import {
  LayoutDashboard,
  Package,
  Wrench,
  ShoppingCart,
  HandCoins,
  ReceiptText,
  BarChart3,
  LineChart,
  Settings,
  Store
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Panel de control", icon: LayoutDashboard, isActive: true },
  { title: "Inventario", icon: Package },
  { title: "Reparaciones", icon: Wrench },
  { title: "Punto de Venta", icon: ShoppingCart },
  { title: "Fiados / Créditos", icon: HandCoins },
  { title: "Registro de Pago", icon: ReceiptText },
  { title: "Reportes", icon: BarChart3 },
  { title: "Análisis", icon: LineChart },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-slate-800 bg-[#1e293b] text-slate-300">
      <SidebarHeader className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground">
            <Store className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">POS Mariche</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="py-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={item.isActive}
                    className={`hover:bg-slate-800 hover:text-white transition-colors ${item.isActive ? 'bg-slate-800 text-white' : ''}`}
                  >
                    <a href="#" className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-slate-700">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="hover:bg-slate-800 hover:text-white transition-colors">
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4" />
                <span className="text-sm font-medium">Configuración</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
