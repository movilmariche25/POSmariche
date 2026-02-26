import { Mail, Phone, MapPin } from "lucide-react"

export function Contact() {
  return (
    <section id="contact" className="py-24 bg-accent/10 scroll-mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground font-headline sm:text-4xl mb-6">
            Póngase en Contacto
          </h2>
          <p className="text-lg text-muted-foreground mb-12">
            ¿Interesado en ver cómo POSMariche puede transformar su departamento de ventas? 
            Contacte a nuestros especialistas para una consulta personalizada o una demostración privada.
          </p>
          
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="flex flex-col items-center gap-4 p-6 bg-card rounded-2xl shadow-sm border">
              <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Mail className="h-6 w-6" />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-1">Envíenos un Email</p>
                <p className="text-base font-medium">movilmariche@gmail.com</p>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-4 p-6 bg-card rounded-2xl shadow-sm border">
              <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Phone className="h-6 w-6" />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-1">Llámenos</p>
                <p className="text-base font-medium">+58 4141135956</p>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-4 p-6 bg-card rounded-2xl shadow-sm border">
              <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <MapPin className="h-6 w-6" />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-1">Nuestra Oficina</p>
                <p className="text-base font-medium">Venezuela, Caracas 1040</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
