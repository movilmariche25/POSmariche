import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Banknote, Database, PieChart, FileText, Package, NotebookPen } from "lucide-react"

const features = [
  {
    title: "Administración Multimoneda",
    description: "Gestione su negocio sin fronteras con un sistema que permite procesar transacciones en diversas monedas divisas y bs de forma simultánea. Esta función asegura que cada venta y cobro quede registrado con precisión, adaptándose a las necesidades del mercado actual.",
    icon: Banknote,
    useCase: "Procesamiento de ventas y cobros en USD y BS de forma simultánea."
  },
  {
    title: "Respaldo de Datos y Recuperación",
    description: "Su información es su activo más valioso. Por ello, contamos con protocolos de respaldo manual que garantizan que sus registros de ventas y datos de clientes estén siempre protegidos y disponibles para su recuperación ante cualquier eventualidad.",
    icon: Database,
    useCase: "Recuperación de registros históricos y protección ante pérdida de datos."
  },
  {
    title: "Análisis de Productos",
    description: "Identifica tus productos estrella y optimiza tu oferta comercial. Esta herramienta le permite analizar el desempeño individual de cada artículo, ayudándole a entender las preferencias de sus clientes y mejorar sus márgenes de ganancia.",
    icon: PieChart,
    useCase: "Optimización de inventario y estrategias de marketing basadas en productos populares."
  },
  {
    title: "Reportes Detallados",
    description: "Obtenga una visión clara y profunda del rendimiento de su empresa a través de informes financieros completos. Desde cierres de caja diarios hasta resúmenes de transacciones, tendrá toda la información necesaria para tomar decisiones estratégicas basadas en datos reales.",
    icon: FileText,
    useCase: "Generación de informes de cierre de caja y análisis de transacciones financieras diarias."
  },
  {
    title: "Inventario Completo",
    description: "Mantenga el control total de sus existencias con un sistema de seguimiento en tiempo real. Supervise niveles de stock, categorías de productos y precios de venta para garantizar que su negocio nunca se detenga por falta de mercancía.",
    icon: Package,
    useCase: "Control de stock en tiempo real y alertas de reposición automática."
  },
  {
    title: "Registro de Fiados",
    description: "Lleve un control organizado y seguro de las ventas a crédito o \"fiados\". Esta funcionalidad le permite registrar deudas pendientes por cliente, facilitando el seguimiento de las cuentas por cobrar y mejorando el flujo de caja de su negocio.",
    icon: NotebookPen,
    useCase: "Seguimiento de cuentas por cobrar y gestión de crédito a clientes de confianza."
  }
]

export function Features() {
  return (
    <section id="features" className="py-24 bg-accent/30 scroll-mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground font-headline sm:text-4xl mb-4">
            Todo lo que necesita para <span className="text-primary">dominar las ventas administrativas</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            POSMariche integra potentes funciones diseñadas específicamente para las complejidades administrativas de los equipos de ventas modernos.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow bg-card overflow-hidden group">
              <CardHeader className="pb-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl font-headline">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{feature.description}</p>
                <div className="pt-4 border-t">
                  <p className="text-xs font-semibold uppercase tracking-wider text-secondary mb-1">Caso de Uso</p>
                  <p className="text-sm italic">{feature.useCase}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
