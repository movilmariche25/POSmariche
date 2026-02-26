import Link from "next/link"
import { Store } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16 border-t border-white/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Store className="h-7 w-7" />
              </div>
              <span className="text-2xl font-bold tracking-tight font-headline">POSMariche</span>
            </Link>
            <p className="text-muted-foreground max-w-sm mb-6 leading-relaxed">
              El programa de ventas administrativas líder diseñado para potenciar a los equipos de ventas 
              con automatización inteligente y claridad de datos.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-6 font-headline">Producto</h4>
            <ul className="space-y-4 text-muted-foreground">
              <li><Link href="#overview" className="hover:text-primary transition-colors">Resumen</Link></li>
              <li><Link href="#features" className="hover:text-primary transition-colors">Funciones</Link></li>
              <li><Link href="#demo" className="hover:text-primary transition-colors">Demo</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-6 font-headline">Soporte</h4>
            <ul className="space-y-4 text-muted-foreground">
              <li><Link href="#faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="#contact" className="hover:text-primary transition-colors">Contacto</Link></li>
              <li>
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="hover:text-primary transition-colors text-left outline-none">
                      Documentación
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[85vh]">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold font-headline text-primary mb-2">Guía de Usuario: Sistema POS Mariche</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-[65vh] pr-4 mt-4">
                      <div className="space-y-6 text-foreground/80 leading-relaxed text-sm">
                        <p className="font-medium text-base text-foreground">
                          Bienvenido a la documentación oficial de POS Mariche, su plataforma integral para la gestión de servicios técnicos y ventas.
                        </p>

                        <div className="space-y-3">
                          <h5 className="font-bold text-foreground flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">1</span>
                            Interfaz General y Navegación
                          </h5>
                          <p>El sistema cuenta con un panel lateral izquierdo que permite acceso rápido a todos los módulos:</p>
                          <ul className="list-disc pl-6 space-y-1">
                            <li><strong>Panel de Control:</strong> Resumen general de la actividad y métricas clave.</li>
                            <li><strong>Inventario:</strong> Gestión de productos y niveles de stock.</li>
                            <li><strong>Reparaciones:</strong> Módulo principal para el seguimiento de servicios técnicos.</li>
                            <li><strong>Punto de Venta (POS):</strong> Interfaz para ventas rápidas de productos.</li>
                            <li><strong>Reportes y Análisis:</strong> Visualización del rendimiento del negocio.</li>
                          </ul>
                        </div>

                        <div className="space-y-3">
                          <h5 className="font-bold text-foreground flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">2</span>
                            Módulo de Reparaciones (Servicio Técnico)
                          </h5>
                          <div className="space-y-2">
                            <p className="font-semibold text-foreground">A. Registro de una Nueva Reparación:</p>
                            <p>Para iniciar un servicio, haga clic en "Registrar Nueva Reparación". El formulario incluye:</p>
                            <ul className="list-disc pl-6 space-y-1">
                              <li><strong>Información del Cliente:</strong> Nombre, Teléfono, Cédula y Dirección.</li>
                              <li><strong>Información del Dispositivo:</strong> Marca, Modelo e IMEI/Serie.</li>
                              <li><strong>Problema Reportado:</strong> Descripción de la falla.</li>
                              <li><strong>Checklist Inicial:</strong> Estado físico (ej. Pantalla Rayada, Equipo Mojado).</li>
                            </ul>
                            <p className="font-semibold text-foreground">B. Gestión y Seguimiento:</p>
                            <ul className="list-disc pl-6 space-y-1">
                              <li><strong>ID de Trabajo:</strong> Código único para trazabilidad (ej. R-260105-7857).</li>
                              <li><strong>Estado de Pago:</strong> Indicadores visuales de solvencia o deuda.</li>
                            </ul>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h5 className="font-bold text-foreground flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">3</span>
                            Punto de Venta (POS)
                          </h5>
                          <p>Interfaz optimizada para la venta directa de accesorios y repuestos.</p>
                          <ul className="list-disc pl-6 space-y-1">
                            <li><strong>Bimonetario:</strong> Muestra montos en Dólares (USD) y Bolívares (Bs) simultáneamente.</li>
                            <li><strong>Métodos de Pago:</strong> Soporta Efectivo, Tarjeta, Pago Móvil y Transferencia.</li>
                            <li><strong>Control de Vuelto:</strong> Calcula automáticamente el cambio para evitar errores.</li>
                          </ul>
                        </div>

                        <div className="space-y-3">
                          <h5 className="font-bold text-foreground flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">4</span>
                            Control de Errores e Instalación
                          </h5>
                          <p><strong>Validación de Stock:</strong> Alerta de "Error de Stock" si no hay existencia disponible.</p>
                          <p><strong>Aplicación Nativa:</strong> Use la opción "Instalar Aplicación" en el menú lateral para mayor comodidad.</p>
                        </div>
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              </li>
              <li>
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="hover:text-primary transition-colors text-left outline-none">
                      Privacidad
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[85vh]">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold font-headline text-primary mb-2">Su Privacidad: El activo más valioso de su negocio</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-[65vh] pr-4 mt-4">
                      <div className="space-y-6 text-foreground/80 leading-relaxed text-sm">
                        <p className="font-medium text-base text-foreground">
                          En POSMariche, entendemos que la información de sus ventas, clientes e inventario es el corazón de su empresa. Por eso, nuestra política de privacidad no es solo un trámite legal, sino un compromiso de lealtad con usted.
                        </p>
                        
                        <div className="space-y-2">
                          <h5 className="font-bold text-foreground flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">1</span>
                            Sus datos le pertenecen
                          </h5>
                          <p>
                            Usted es el único dueño de la información que registra. POSMariche actúa únicamente como la herramienta que le ayuda a organizarla. Nunca venderemos, alquilaremos ni compartiremos sus datos comerciales con terceros para fines publicitarios.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <h5 className="font-bold text-foreground flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">2</span>
                            ¿Qué información protegemos?
                          </h5>
                          <p>Solo recopilamos lo estrictamente necesario para que el sistema funcione correctamente:</p>
                          <ul className="list-disc pl-6 space-y-1">
                            <li><strong>Datos de cuenta:</strong> Para gestionar su acceso y soporte técnico.</li>
                            <li><strong>Registros de ventas y productos:</strong> Almacenados de forma segura para que usted pueda consultarlos y tomar decisiones informadas.</li>
                            <li><strong>Interacciones en la plataforma:</strong> Para mejorar la experiencia de usuario y la estabilidad del sistema.</li>
                          </ul>
                        </div>

                        <div className="space-y-2">
                          <h5 className="font-bold text-foreground flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">3</span>
                            Seguridad ante todo
                          </h5>
                          <p>
                            Aunque POSMariche es una plataforma de gestión manual (sin cobros automáticos), tratamos su información con rigor bancario. Implementamos protocolos de cifrado para que sus reportes financieros y listas de clientes estén protegidos contra accesos no autorizados.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <h5 className="font-bold text-foreground flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">4</span>
                            Transparencia total
                          </h5>
                          <p>
                            No hay letras chiquitas. Si en algún momento decide dejar de usar nuestra plataforma, sus datos se manejan bajo su solicitud de baja, asegurando que su historial comercial no quede flotando en la red.
                          </p>
                        </div>

                        <div className="pt-4 border-t border-border italic text-center text-primary font-medium">
                          "En POSMariche, nos enfocamos en que usted crezca. Nosotros nos encargamos de que su información viaje segura mientras usted toma el control de sus ventas."
                        </div>
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-white/10 text-center text-muted-foreground text-sm">
          <p>© {new Date().getFullYear()} POSMariche. Todos los derechos reservados. Diseñado profesionalmente para la excelencia administrativa.</p>
        </div>
      </div>
    </footer>
  )
}
