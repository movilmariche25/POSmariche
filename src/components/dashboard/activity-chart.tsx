
'use client';

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const data = [
  { dia: "Día 1", ventas: 0, reparaciones: 0 },
  { dia: "Día 2", ventas: 0, reparaciones: 0 },
  { dia: "Día 3", ventas: 0, reparaciones: 0 },
  { dia: "Día 4", ventas: 0, reparaciones: 0 },
  { dia: "Día 5", ventas: 0, reparaciones: 0 },
  { dia: "Día 10", ventas: 0, reparaciones: 0 },
  { dia: "Día 15", ventas: 0, reparaciones: 0 },
  { dia: "Día 17", ventas: 0, reparaciones: 0 },
  { dia: "Día 18", ventas: 85, reparaciones: 20 },
  { dia: "Día 19", ventas: 120, reparaciones: 45 },
  { dia: "Día 20", ventas: 125, reparaciones: 38 },
  { dia: "Día 21", ventas: 150, reparaciones: 25 },
  { dia: "Día 22", ventas: 145, reparaciones: 25 },
  { dia: "Día 23", ventas: 170, reparaciones: 95 },
  { dia: "Día 24", ventas: 140, reparaciones: 25 },
  { dia: "Día 25", ventas: 40, reparaciones: 5 },
  { dia: "Día 28", ventas: 0, reparaciones: 0 },
];

export function ActivityChart() {
  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-800">Actividad Mensual (febrero 2026)</CardTitle>
        <CardDescription>Un resumen de las ventas y reparaciones registradas este mes.</CardDescription>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="dia" 
              stroke="#94a3b8" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(value) => `$${value},00`}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
            <Line
              type="monotone"
              dataKey="ventas"
              name="Ventas"
              stroke="#334155"
              strokeWidth={2}
              dot={{ r: 4, fill: "#334155" }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="reparaciones"
              name="Reparaciones"
              stroke="#4a6a70"
              strokeWidth={2}
              dot={{ r: 4, fill: "#4a6a70" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
