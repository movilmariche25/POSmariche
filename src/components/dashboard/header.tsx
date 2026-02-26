
'use client';

import { Wifi, TrendingUp, RefreshCw, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function DashboardHeader() {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-white px-6">
      <div className="flex flex-1 items-center gap-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 flex gap-1.5 py-1">
            <Wifi className="h-3 w-3 fill-emerald-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider">En Línea</span>
          </Badge>
          
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100 flex gap-2 py-1 px-3">
            <TrendingUp className="h-3 w-3" />
            <div className="flex flex-col items-start leading-none">
              <span className="text-[8px] font-bold uppercase text-blue-500">BCV Sistema</span>
              <span className="text-xs font-bold">411.08 Bs</span>
            </div>
          </Badge>
          
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-100 flex gap-2 py-1 px-3">
            <RefreshCw className="h-3 w-3" />
            <div className="flex flex-col items-start leading-none">
              <span className="text-[8px] font-bold uppercase text-orange-500">Reposición</span>
              <span className="text-xs font-bold">550.00 Bs</span>
            </div>
          </Badge>
          
          <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 flex gap-2 py-1 px-3">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <div className="flex flex-col items-start leading-none">
              <span className="text-[8px] font-bold uppercase text-emerald-500">BCV API</span>
              <span className="text-xs font-bold">...</span>
            </div>
          </Badge>
        </div>
      </div>
    </header>
  );
}
