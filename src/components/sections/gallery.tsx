"use client"

import { useState } from "react"
import Image from "next/image"
import { PlaceHolderImages, type ImagePlaceholder } from "@/app/lib/placeholder-images"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"

export function Gallery() {
  const galleryImages = PlaceHolderImages.filter(img => img.id.startsWith('demo-'))

  return (
    <section id="demo" className="py-20 scroll-mt-16 bg-slate-50/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
            Demostración Visual
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground font-headline sm:text-4xl mb-4">
            Interfaz <span className="text-primary">Intuitiva</span>
          </h2>
          <p className="text-muted-foreground">
            Haga clic en las imágenes para verlas en detalle y conocer más sobre las funciones de POSMariche.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {galleryImages.map((image, index) => (
            <Dialog key={index}>
              <DialogTrigger asChild>
                <button 
                  className="group flex flex-col gap-3 text-left outline-none w-full"
                >
                  <div className="relative rounded-xl overflow-hidden border bg-white shadow-sm group-hover:shadow-md transition-all duration-300 w-full">
                    <div className="h-7 bg-slate-100 border-b flex items-center px-3 gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-slate-300"></div>
                      <div className="h-2 w-2 rounded-full bg-slate-300"></div>
                      <div className="h-2 w-2 rounded-full bg-slate-300"></div>
                    </div>
                    
                    <div className="relative aspect-[16/10] bg-white p-2">
                      <Image
                        src={image.imageUrl}
                        alt={image.description}
                        fill
                        quality={100}
                        unoptimized
                        className="object-contain p-1 group-hover:scale-[1.01] transition-transform duration-500"
                        data-ai-hint={image.imageHint}
                      />
                    </div>
                  </div>
                  <div className="px-1 text-center sm:text-left">
                    <p className="text-sm font-semibold text-foreground/80 group-hover:text-primary transition-colors">{image.description}</p>
                  </div>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white border-none shadow-2xl">
                <div className="flex flex-col">
                  <div className="h-10 bg-slate-100 border-b flex items-center px-4 gap-2">
                    <div className="h-3 w-3 rounded-full bg-slate-300"></div>
                    <div className="h-3 w-3 rounded-full bg-slate-300"></div>
                    <div className="h-3 w-3 rounded-full bg-slate-300"></div>
                    <span className="text-xs font-medium text-slate-400 ml-2 truncate">{image.description}</span>
                  </div>
                  
                  <div className="p-1 sm:p-4 bg-slate-50">
                    <div className="relative aspect-video w-full rounded-lg overflow-hidden border bg-white shadow-inner">
                      <Image
                        src={image.imageUrl}
                        alt={image.description}
                        fill
                        quality={100}
                        unoptimized
                        className="object-contain"
                      />
                    </div>
                  </div>
                  
                  <div className="p-6 bg-white">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold font-headline text-primary mb-2 text-left">
                        {image.description}
                      </DialogTitle>
                      <DialogDescription className="text-base text-muted-foreground leading-relaxed text-left">
                        {image.detailedDescription}
                      </DialogDescription>
                    </DialogHeader>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </section>
  )
}
