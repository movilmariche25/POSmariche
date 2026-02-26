import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "¿Qué hace que POS Mariche sea diferente de otras plataformas?",
    answer: "POS Mariche se enfoca exclusivamente en brindar una estructura sólida para la gestión administrativa de su negocio. Mientras que otros sistemas son complejos o difíciles de usar, nosotros nos especializamos en facilitar el registro manual de cada movimiento, desde las ventas diarias y el control de inventario hasta el seguimiento detallado de cuentas por cobrar (fiados). Nuestra plataforma está diseñada para que usted tenga la claridad necesaria sobre sus ingresos y gastos, eliminando el desorden de los registros en papel. Con POS Mariche, usted lleva el control manual de su negocio de forma profesional, segura y en una sola interfaz."
  },
  {
    question: "¿Es fácil migrar mis datos existentes a POS Mariche?",
    answer: "¡Totalmente! Hemos diseñado un proceso sencillo basado en Excel para que usted mantenga el control total de su información durante la migración. El procedimiento es directo y sin complicaciones: Descargue la plantilla: Obtenga nuestro formato oficial de Excel desde la plataforma una sola vez. Organice su información: Rellene manualmente los datos de sus productos, inventario o clientes en las columnas correspondientes. Suba y listo: Cargue el archivo nuevamente al sistema para centralizar toda su administración en POS Mariche. Este método garantiza que sus datos se carguen exactamente como usted los organizó, asegurando una transición ordenada de sus hojas de cálculo actuales a nuestro sistema profesional."
  },
  {
    question: "¿Ofrece POS Mariche soporte móvil?",
    answer: "Actualmente, POS Mariche no cuenta con aplicaciones móviles nativas (iOS o Android). Sin embargo, nuestra plataforma está diseñada para ser totalmente responsiva, lo que significa que puedes acceder a todas las funciones y gestionar tu negocio directamente desde el navegador de tu celular o tablet con una experiencia fluida."
  },
  {
    question: "¿Qué tipo de atención al cliente ofrecen?",
    answer: "Brindamos soporte técnico las 24 horas, los 7 días de la semana, una base de conocimientos integral y gerentes de cuenta dedicados para equipos empresariales para garantizar que sus procesos administrativos nunca se detengan."
  },
  {
    question: "¿Podemos personalizar nuestros procesos de venta?",
    answer: "Sí, nuestro sistema es totalmente flexible. Puede utilizar nuestras plantillas predefinidas para los pasos de venta más comunes o diseñar su propia lógica de trabajo personalizada a través de nuestro panel visual. Esto le permite organizar cada etapa del trato y asegurar que su equipo siga el camino correcto, desde el primer contacto hasta el cierre manual de la venta."
  }
]

export function FAQ() {
  return (
    <section id="faq" className="py-24 scroll-mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground font-headline sm:text-4xl mb-4">
            Preguntas Frecuentes
          </h2>
          <p className="text-lg text-muted-foreground">
            ¿Tiene preguntas sobre POSMariche? Tenemos respuestas.
          </p>
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-b-accent/20">
              <AccordionTrigger className="text-left font-semibold text-lg hover:text-primary transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed text-base">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
