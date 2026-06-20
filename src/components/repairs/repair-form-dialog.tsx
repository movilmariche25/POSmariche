"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { RepairJob, RepairStatus, Product, UserProfile, ReservedPart, AppSettings } from "@/lib/types";
import { useState, useEffect, ReactNode, useMemo, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "../ui/textarea";
import { useCurrency } from "@/hooks/use-currency";
import { Label } from "../ui/label";
import { useFirebase, useCollection, useMemoFirebase, useDoc } from "@/firebase";
import { doc, runTransaction, query, orderBy, collection, type DocumentSnapshot } from "firebase/firestore";
import { handlePrintAllTickets } from "./repair-ticket";
import { User, Smartphone, Package, Search, Plus, Trash2, Loader2, DollarSign, Calculator, UserCheck, MapPin, Hammer, Minus, TicketPercent } from "lucide-react";
import { format, addDays } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { ProductFormDialog } from "../inventory/product-form-dialog";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";

const DRAFT_KEY = 'mm_repair_draft';

const formSchema = z.object({
  customerName: z.string().min(2, "Nombre obligatorio"),
  customerPhone: z.string().min(10, "Teléfono inválido"),
  customerID: z.string().min(5, "Cédula requerida"),
  customerAddress: z.string().default(""),
  deviceMake: z.string().min(2, "Marca obligatoria"),
  deviceModel: z.string().min(1, "Modelo obligatorio"),
  reportedIssue: z.string().min(5, "Detalla la falla del equipo"),
  status: z.enum(['Pendiente', 'Pagado', 'Completado', 'Garantía']),
  notes: z.string().default(""),
  reservedParts: z.array(z.any()).default([]),
  isPromo: z.boolean().default(false),
  isMinimized: z.boolean().default(false),
});

export function RepairFormDialog({ repairJob, children, isOpen, onOpenChange }: { repairJob?: RepairJob | null, children?: ReactNode, isOpen?: boolean, onOpenChange?: (v: boolean) => void }) {
  const { firestore, user } = useFirebase();
  const [internalOpen, setInternalOpen] = useState(false);
  const [partsPopoverOpen, setPartsPopoverOpen] = useState(false);
  const [replenishProduct, setReplenishProduct] = useState<Product | null>(null);
  const [manualQuickAddOpen, setManualQuickAddOpen] = useState(false);
  
  const open = isOpen !== undefined ? isOpen : internalOpen;
  const setOpen = onOpenChange !== undefined ? onOpenChange : setInternalOpen;

  const { toast } = useToast();
  const { getFinalPrice, getDynamicPrice, format: formatCurrency, bcvRate, parallelRate } = useCurrency();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isInitialized = useRef(false);
  const isClosingViaMinimize = useRef(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "", customerPhone: "", customerID: "", customerAddress: "",
      deviceMake: "", deviceModel: "", reportedIssue: "",
      status: "Pendiente", reservedParts: [],
      isPromo: false, notes: "", isMinimized: false,
    },
  });

  const settingsRef = useMemoFirebase(() => 
    (firestore && user) ? doc(firestore, 'users', user.uid, 'app-settings', 'main') : null,
    [firestore, user?.uid]
  );
  const { data: settings } = useDoc<AppSettings>(settingsRef);

  const profileRef = useMemoFirebase(() => 
    (firestore && user) ? doc(firestore, 'users', user.uid) : null,
    [firestore, user?.uid]
  );
  const { data: profile } = useDoc<UserProfile>(profileRef);

  const productsCol = useMemoFirebase(() => 
    (firestore && user) ? collection(firestore, 'users', user.uid, 'products') : null, 
    [firestore, user?.uid]
  );
  const { data: products } = useCollection<Product>(productsCol);

  const repairsCol = useMemoFirebase(() => 
    (firestore && user) ? query(collection(firestore, 'users', user.uid, 'repair_jobs'), orderBy('createdAt', 'desc')) : null,
    [firestore, user?.uid]
  );
  const { data: allRepairJobs } = useCollection<RepairJob>(repairsCol);

  const reservedParts = form.watch("reservedParts") as (ReservedPart & { isPromo?: boolean, isWarranty?: boolean, isManual?: boolean })[];
  const watchedID = form.watch("customerID");
  const watchedName = form.watch("customerName");

  const foundCustomer = useMemo(() => {
    if (!watchedID || watchedID.length < 5 || !allRepairJobs) return null;
    return allRepairJobs.find(job => job.customerID?.toUpperCase().trim() === watchedID.toUpperCase().trim());
  }, [watchedID, allRepairJobs]);

  const handleApplyCustomerData = () => {
    if (foundCustomer) {
        form.setValue("customerName", foundCustomer.customerName.toUpperCase());
        form.setValue("customerPhone", foundCustomer.customerPhone);
        form.setValue("customerAddress", (foundCustomer.customerAddress || "").toUpperCase());
        toast({ title: "Datos cargados" });
    }
  };
  
  const effectiveIsPromo = useMemo(() => {
    const parts = [...reservedParts, ...(repairJob?.consumedParts || [])];
    return parts.some(p => p.isPromo && !p.isWarranty);
  }, [reservedParts, repairJob?.consumedParts]);

  useEffect(() => {
    if (isInitialized.current) form.setValue("isPromo", effectiveIsPromo);
  }, [effectiveIsPromo, form]);

  useEffect(() => {
    if (!repairJob && open) {
        const subscription = form.watch((value) => {
            if (isInitialized.current && !isClosingViaMinimize.current) {
                localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...value, isMinimized: false }));
            }
        });
        return () => subscription.unsubscribe();
    }
  }, [form, repairJob, open]);

  const partsTotalForClient = useMemo(() => {
    const allRelevantParts = [...(repairJob?.consumedParts || []), ...reservedParts];
    return allRelevantParts.reduce((sum, part) => {
        if (part.isWarranty) return sum;
        let price = 0;
        if (part.isManual) {
            price = part.manualPrice || getDynamicPrice(part.costPrice);
        } else {
            const product = products?.find(p => p.id === part.productId);
            if (product) {
                price = part.isPromo && product.promoPrice ? product.promoPrice : getFinalPrice(product);
            } else price = getDynamicPrice(part.costPrice);
        }
        return sum + (price * part.quantity);
    }, 0);
  }, [reservedParts, repairJob?.consumedParts, products, getFinalPrice, getDynamicPrice]);

  const estimatedTotal = partsTotalForClient;
  const currentPaid = repairJob?.amountPaid || 0;

  useEffect(() => {
    if (!open) { isInitialized.current = false; isClosingViaMinimize.current = false; return; }
    if (open && !isInitialized.current) {
        if (repairJob) {
            form.reset({ ...repairJob, status: repairJob.status as any, isMinimized: false });
        } else {
            const savedDraft = localStorage.getItem(DRAFT_KEY);
            if (savedDraft) {
                try { form.reset({ ...JSON.parse(savedDraft), isMinimized: false }); } 
                catch (e) { localStorage.removeItem(DRAFT_KEY); }
            } else {
                form.reset({ customerName: "", customerPhone: "", customerID: "", customerAddress: "", deviceMake: "", deviceModel: "", reportedIssue: "", status: "Pendiente", reservedParts: [], isPromo: false, notes: "", isMinimized: false });
            }
        }
        isInitialized.current = true;
    }
  }, [repairJob, open, form]);

  const handleAddPartFromInventory = (p: Product) => {
      const existing = reservedParts.find(item => item.productId === p.id);
      const qtyInForm = existing ? existing.quantity : 0;
      const originalInJob = repairJob?.reservedParts?.find(rp => rp.productId === p.id)?.quantity || 0;
      const available = (p.stockLevel - (p.reservedStock || 0) - (p.damagedStock || 0)) + originalInJob;
      
      if (available < qtyInForm + 1) {
          setReplenishProduct(p);
          setPartsPopoverOpen(false);
          return;
      }

      if (existing) {
          form.setValue('reservedParts', reservedParts.map(item => item.productId === p.id ? { ...item, quantity: item.quantity + 1 } : item));
      } else {
          form.setValue('reservedParts', [...reservedParts, { productId: p.id!, productName: p.name.toUpperCase(), quantity: 1, costPrice: p.costPrice, isPromo: !!(p.promoPrice && p.promoPrice > 0), isWarranty: false, isManual: false }]);
      }
      setPartsPopoverOpen(false);
  };

  const handleAddManualPart = (name: string, cost: number, fixedPrice?: number, isPromo: boolean = false) => {
      const newPart: ReservedPart = {
          productId: `manual-${Date.now()}`,
          productName: name.toUpperCase().trim(),
          quantity: 1,
          costPrice: cost,
          isPromo: isPromo,
          isWarranty: false,
          isManual: true,
          manualPrice: fixedPrice
      };
      form.setValue('reservedParts', [...reservedParts, newPart]);
      setManualQuickAddOpen(false);
  };

  const handleRemovePart = (productId: string) => {
      form.setValue('reservedParts', reservedParts.filter(p => p.productId !== productId));
  };

  const handleMinimize = () => {
      isClosingViaMinimize.current = true;
      isInitialized.current = false;
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...form.getValues(), isMinimized: true }));
      setOpen(false);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore || !user || isSubmitting) return;
    setIsSubmitting(true);
    try {
        const result = await runTransaction(firestore, async (transaction) => {
            const jobId = repairJob?.id || `R-${format(new Date(), "yyMMdd")}-${Math.floor(1000 + Math.random() * 9000)}`;
            const jobRef = doc(firestore, 'users', user.uid, 'repair_jobs', jobId);

            const oldParts = (repairJob?.reservedParts || []).filter(p => !p.isManual);
            const newParts = values.reservedParts.filter(p => !p.isManual);
            const netChanges = new Map<string, { delta: number, name: string }>();

            for (const old of oldParts) {
                const current = netChanges.get(old.productId) || { delta: 0, name: old.productName };
                netChanges.set(old.productId, { delta: current.delta - old.quantity, name: old.productName });
            }
            for (const updated of newParts) {
                const current = netChanges.get(updated.productId) || { delta: 0, name: updated.productName };
                netChanges.set(updated.productId, { delta: current.delta + updated.quantity, name: updated.productName });
            }

            for (const [pid, change] of Array.from(netChanges.entries())) {
                if (change.delta === 0) continue;
                const pSnap = await transaction.get(doc(firestore, 'users', user.uid, 'products', pid));
                if (pSnap.exists()) {
                    const data = pSnap.data() as Product;
                    if (change.delta > 0 && ((data.stockLevel - data.reservedStock - (data.damagedStock || 0)) < change.delta)) {
                        throw new Error(`Stock insuficiente para "${change.name}".`);
                    }
                    transaction.update(pSnap.ref, { reservedStock: Math.max(0, (data.reservedStock || 0) + change.delta) });
                }
            }

            let partsConsumed = !!repairJob?.partsConsumed;
            let finalReservedParts = [...values.reservedParts];
            let finalConsumedParts = [...(repairJob?.consumedParts || [])];
            let completionData: any = {};

            if (values.status === 'Completado') {
                for (const part of values.reservedParts) {
                    if (part.isManual) continue;
                    const pSnap = await transaction.get(doc(firestore, 'users', user.uid, 'products', part.productId));
                    if (pSnap.exists()) {
                        const pData = pSnap.data() as Product;
                        transaction.update(pSnap.ref, { 
                            stockLevel: (pData.stockLevel || 0) - part.quantity,
                            reservedStock: Math.max(0, (pData.reservedStock || 0) - part.quantity)
                        });
                    }
                }
                const completionDate = new Date();
                completionData = { completedAt: completionDate.toISOString(), warrantyEndDate: addDays(completionDate, 4).toISOString(), partsConsumed: true };
                finalConsumedParts = [...finalConsumedParts, ...values.reservedParts];
                finalReservedParts = [];
                partsConsumed = true;
            }

            const finalData: any = { 
                ...values, id: jobId, 
                estimatedCost: Number(estimatedTotal.toFixed(2)),
                amountPaid: currentPaid,
                isPaid: currentPaid >= (estimatedTotal - 0.01),
                status: (currentPaid >= (estimatedTotal - 0.01) && values.status === 'Pendiente') ? 'Pagado' : values.status,
                createdAt: repairJob?.createdAt || new Date().toISOString(),
                reservedParts: finalReservedParts, consumedParts: finalConsumedParts, partsConsumed, isPromo: effectiveIsPromo, ...completionData
            };
            transaction.set(jobRef, finalData, { merge: true });
            return finalData;
        });

        localStorage.removeItem(DRAFT_KEY);
        toast({ title: "Sincronizado" });
        if (!repairJob) handlePrintAllTickets({ repairJob: result as RepairJob, businessName: profile?.businessName, profile, bcvRate, parallelRate }, () => {});
        setOpen(false);
    } catch (e: any) {
        toast({ variant: "destructive", title: "Error", description: e.message });
    } finally { setIsSubmitting(false); }
  }

  const inputMode = settings?.repairInputMode || 'both';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <div className="p-6 pb-2">
            <div className="flex justify-between items-center mb-4">
                <DialogHeader className="flex-1">
                    <DialogTitle className="uppercase font-bold">{repairJob ? 'Gestionar Trabajo' : 'Nueva Recepción Técnica'}</DialogTitle>
                    <DialogDescription>Completa los datos del cliente y el equipo para generar el ticket.</DialogDescription>
                </DialogHeader>
                {!repairJob && (
                    <Button type="button" variant="ghost" size="icon" onClick={handleMinimize} title="Minimizar registro">
                        <Minus className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
        
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
                <div className="flex-1 overflow-y-auto px-6 space-y-6">
                    <div className="space-y-4">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest flex items-center gap-2 border-b pb-1">
                            <User className="w-3 h-3" /> Información del Cliente
                        </span>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="customerID" render={({field}) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-bold uppercase">Cédula / RIF</FormLabel>
                                    <FormControl><Input {...field} onChange={(e) => field.onChange(e.target.value.toUpperCase())} placeholder="V-12345678" className="uppercase" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="customerPhone" render={({field}) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-bold uppercase">Teléfono</FormLabel>
                                    <FormControl><Input {...field} placeholder="0412-0000000" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        {foundCustomer && (watchedName.toUpperCase() !== foundCustomer.customerName.toUpperCase()) && (
                            <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 text-[10px] text-blue-600 bg-blue-50 hover:bg-blue-100 flex items-center gap-1 font-bold w-full"
                                onClick={handleApplyCustomerData}
                            >
                                <UserCheck className="w-3.5 h-3.5" />
                                ¿CARGAR DATOS DE {foundCustomer.customerName.toUpperCase()}?
                            </Button>
                        )}

                        <FormField control={form.control} name="customerName" render={({field}) => (
                            <FormItem>
                                <FormLabel className="text-[10px] font-bold uppercase">Nombre Completo</FormLabel>
                                <FormControl><Input {...field} onChange={(e) => field.onChange(e.target.value.toUpperCase())} placeholder="JUAN PÉREZ" className="uppercase" /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="customerAddress" render={({field}) => (
                            <FormItem>
                                <FormLabel className="text-[10px] font-bold uppercase flex items-center gap-1.5"><MapPin className="w-3 h-3"/> Dirección</FormLabel>
                                <FormControl><Input {...field} onChange={(e) => field.onChange(e.target.value.toUpperCase())} placeholder="EJ: CALLE 5, CASA 10..." className="uppercase" /></FormControl>
                            </FormItem>
                        )} />
                    </div>

                    <div className="space-y-4">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest flex items-center gap-2 border-b pb-1">
                            <Smartphone className="w-3 h-3" /> Detalles del Equipo
                        </span>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="deviceMake" render={({field}) => <FormItem><FormLabel className="text-[10px] font-bold uppercase">Marca</FormLabel><FormControl><Input {...field} className="uppercase" placeholder="SAMSUNG, IPHONE..." /></FormControl></FormItem>} />
                            <FormField control={form.control} name="deviceModel" render={({field}) => <FormItem><FormLabel className="text-[10px] font-bold uppercase">Modelo</FormLabel><FormControl><Input {...field} className="uppercase" placeholder="A51, 13 PRO..." /></FormControl></FormItem>} />
                        </div>
                        <FormField control={form.control} name="reportedIssue" render={({field}) => <FormItem><FormLabel className="text-[10px] font-bold uppercase">Falla / Problema</FormLabel><FormControl><Input {...field} className="uppercase" placeholder="PANTALLA PARTIDA, NO PRENDE..." /></FormControl></FormItem>} />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-1">
                            <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                                <Package className="w-3 h-3" /> Materiales y Repuestos
                            </span>
                            <div className="flex gap-2">
                                {(inputMode === 'manual' || inputMode === 'both') && (
                                    <Button type="button" variant="outline" size="sm" className="h-7 text-[9px] font-black" onClick={() => setManualQuickAddOpen(true)}>
                                        MANUAL (+)
                                    </Button>
                                )}
                                {(inputMode === 'inventory' || inputMode === 'both') && (
                                    <Popover open={partsPopoverOpen} onOpenChange={setPartsPopoverOpen}>
                                        <PopoverTrigger asChild>
                                            <Button type="button" variant="outline" size="sm" className="h-7 text-[9px] font-black">
                                                <Search className="w-3 h-3 mr-1" /> INVENTARIO
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="p-0 w-[350px]" align="end">
                                            <Command><CommandInput placeholder="BUSCAR REPUESTO..." className="h-9"/><CommandList><CommandEmpty>Sin resultados.</CommandEmpty><CommandGroup>
                                                {(products || []).filter(p => !p.isCombo).map(p => (
                                                    <CommandItem key={p.id} onSelect={() => handleAddPartFromInventory(p)} className="flex justify-between items-center text-xs">
                                                        <span className="font-bold uppercase">{p.name}</span>
                                                        <Badge variant="secondary" className="text-[9px]">{p.stockLevel - (p.reservedStock || 0)} DISP.</Badge>
                                                    </CommandItem>
                                                ))}</CommandGroup></CommandList></Command>
                                        </PopoverContent>
                                    </Popover>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            {reservedParts.map((part) => {
                                const pData = products?.find(p => p.id === part.productId);
                                let price = part.isManual && part.manualPrice ? part.manualPrice : (part.isPromo && pData?.promoPrice ? pData.promoPrice : getFinalPrice(pData || { costPrice: part.costPrice } as Product));
                                if (part.isWarranty) price = 0;

                                return (
                                    <div key={part.productId} className="flex justify-between items-center p-2 rounded-md border bg-slate-50">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-xs uppercase">{part.productName}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] text-muted-foreground">1x ${price.toFixed(2)}</span>
                                                {part.isManual && <Badge variant="outline" className="text-[8px] h-3 px-1 border-amber-200 text-amber-600 font-bold">MANUAL</Badge>}
                                                {part.isPromo && <Badge className="text-[8px] h-3 px-1 bg-blue-600 font-bold">OFERTA</Badge>}
                                            </div>
                                        </div>
                                        <Button type="button" variant="ghost" size="icon" className="h-7 v-7 text-destructive" onClick={() => handleRemovePart(part.productId)}>
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2 shadow-lg border-t-4 border-primary">
                        <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase">
                            <span>Saldo Pendiente:</span>
                            <span>Eq: Bs {formatCurrency((estimatedTotal - currentPaid) * (effectiveIsPromo ? parallelRate : bcvRate))}</span>
                        </div>
                        <div className="flex justify-between items-end">
                            <span className="text-[10px] font-bold text-primary uppercase flex items-center gap-1"><DollarSign className="w-3 h-3" /> Monto Final</span>
                            <span className="text-3xl font-black text-white">${(estimatedTotal - currentPaid).toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="pb-6"></div>
                </div>

                <DialogFooter className="p-6 border-t bg-white">
                    <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-base font-bold shadow-lg uppercase">
                        {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : (repairJob ? "GUARDAR CAMBIOS" : "REGISTRAR Y GENERAR TICKET")}
                    </Button>
                </DialogFooter>
            </form>
        </Form>

        <ManualQuickAddDialog isOpen={manualQuickAddOpen} onOpenChange={setManualQuickAddOpen} onAdd={handleAddManualPart} />
        {replenishProduct && <ProductFormDialog product={replenishProduct} isOpen={!!replenishProduct} onOpenChange={(v) => !v && setReplenishProduct(null)} onSaved={handleAddPartFromInventory} />}
      </DialogContent>
    </Dialog>
  );
}

function ManualQuickAddDialog({ isOpen, onOpenChange, onAdd }: { isOpen: boolean, onOpenChange: (v: boolean) => void, onAdd: (name: string, cost: number, fixed?: number, isPromo?: boolean) => void }) {
    const [name, setName] = useState("");
    const [cost, setCost] = useState("");
    const [isFixed, setIsFixed] = useState(false);
    const [fixedPrice, setFixedPrice] = useState("");
    const [isPromo, setIsPromo] = useState(false);
    const { getDynamicPrice, profitMargin, bcvRate, format: formatCurrency } = useCurrency();

    const suggestedBCV = useMemo(() => cost ? getDynamicPrice(Number(cost)) : 0, [cost, getDynamicPrice]);
    const suggestedOffer = useMemo(() => cost ? Number(cost) * (1 + profitMargin / 100) : 0, [cost, profitMargin]);

    const handleConfirm = () => {
        const finalPrice = (isFixed || isPromo) ? (Number(fixedPrice) || (isPromo ? suggestedOffer : suggestedBCV)) : undefined;
        onAdd(name, Number(cost), finalPrice, isPromo);
        setName(""); setCost(""); setFixedPrice(""); setIsFixed(false); setIsPromo(false);
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader><DialogTitle className="uppercase font-bold">Repuesto Manual</DialogTitle></DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase">Descripción</Label>
                        <Input value={name} onChange={(e) => setName(e.target.value.toUpperCase())} placeholder="EJ: PANTALLA A51" className="uppercase" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <Label className="text-[10px] font-bold uppercase">Costo ($)</Label>
                            <Input type="number" step="0.01" value={cost} onChange={(e) => setCost(e.target.value)} placeholder="0.00" />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[10px] font-bold uppercase text-blue-600">Sugerido BCV</Label>
                            <div className="h-10 flex flex-col justify-center px-3 bg-blue-50 border border-blue-100 rounded text-blue-700">
                                <div className="text-xs font-black">${suggestedBCV.toFixed(2)}</div>
                                <div className="text-[8px] font-bold leading-none">Bs {formatCurrency(suggestedBCV * bcvRate)}</div>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[10px] font-bold uppercase text-green-600">Sugerido Oferta</Label>
                            <div className="h-10 flex items-center px-3 bg-green-50 border border-green-100 rounded text-xs font-black text-green-700">${suggestedOffer.toFixed(2)}</div>
                        </div>
                    </div>

                    <div className="space-y-3 p-3 bg-muted/50 rounded-lg border border-dashed">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs font-bold uppercase">Precio Fijo</Label>
                            <Switch checked={isFixed} onCheckedChange={setIsFixed} />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <Label className="text-xs font-bold uppercase text-blue-600">Oferta (Reposición)</Label>
                                <p className="text-[8px] text-muted-foreground">Usa Tasa Paralela para Bs.</p>
                            </div>
                            <Switch checked={isPromo} onCheckedChange={setIsPromo} />
                        </div>
                        
                        {(isFixed || isPromo) && (
                            <div className="space-y-2 animate-in slide-in-from-top-2">
                                <Label className="text-[10px] font-bold uppercase text-primary">
                                    {isFixed && isPromo ? 'Venta Final en Oferta ($)' : isFixed ? 'Venta Final Fija ($)' : 'Venta Calculada Oferta ($)'}
                                </Label>
                                <Input 
                                    type="number" 
                                    step="0.01" 
                                    value={fixedPrice} 
                                    onChange={(e) => setFixedPrice(e.target.value)} 
                                    placeholder={isPromo ? suggestedOffer.toFixed(2) : suggestedBCV.toFixed(2)} 
                                    className="font-bold text-lg" 
                                    autoFocus 
                                />
                                {isFixed && isPromo && (
                                    <p className="text-[9px] text-blue-600 font-bold italic">
                                        * Este precio manual se cobrará a tasa de reposición.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <DialogFooter><Button onClick={handleConfirm} disabled={!name || !cost} className="w-full uppercase font-bold">Añadir al trabajo</Button></DialogFooter>
            </DialogContent>
        </Dialog>
    );
}