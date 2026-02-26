import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ArrowRight } from "lucide-react"
import { PlaceHolderImages } from "@/app/lib/placeholder-images"

export function Hero() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-main')

  return (
    <section id="overview" className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40 scroll-mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6">
              <CheckCircle2 className="h-4 w-4" />
              <span>Optimice su flujo de trabajo de ventas</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground font-headline leading-tight mb-6">
              Tu Negocio Bajo Control, <span className="text-primary">Donde Quiera que Estés.</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              POS Mariche simplifica tu administración: desde el control de inventarios hasta el registro de pagos, todo en una plataforma segura y fácil de usar. Toma mejores decisiones con reportes detallados en tiempo real.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary text-primary-foreground group" asChild>
                <a href="/POSMariche.exe" download="POSMariche.exe">
                  Prueba Gratuita
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
            </div>
          </div>
          <div className="relative lg:ml-auto w-full">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border bg-white">
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  width={1200}
                  height={800}
                  priority
                  quality={100}
                  unoptimized
                  className="w-full h-auto object-contain block"
                  data-ai-hint={heroImage.imageHint}
                />
              )}
            </div>
            <div className="absolute -bottom-6 -left-6 bg-background p-6 rounded-xl shadow-lg border hidden sm:block max-w-[200px] z-10">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-secondary"></div>
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tasa de Eficiencia</span>
              </div>
              <div className="text-2xl font-bold">100%</div>
              <div className="text-xs text-muted-foreground">Mejora en el tiempo de respuesta administrativa.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
