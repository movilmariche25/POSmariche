
'use client';

import { ShoppingCart, Wrench } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function StatsCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-500">Ventas de Hoy</p>
              <h3 className="text-3xl font-bold text-slate-900">$26,66</h3>
              <p className="text-xs text-slate-400">3 transacciones</p>
            </div>
            <div className="p-2 bg-slate-50 rounded-full">
              <ShoppingCart className="h-6 w-6 text-slate-400" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-500">Reparaciones Hoy</p>
              <h3 className="text-3xl font-bold text-slate-900">1</h3>
              <p className="text-xs text-slate-400">Nuevos trabajos registrados</p>
            </div>
            <div className="p-2 bg-slate-50 rounded-full">
              <Wrench className="h-6 w-6 text-slate-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
