"use client"

import { useState } from "react"
import { generateBenefitStatement, type GenerateBenefitStatementOutput } from "@/ai/flows/generate-benefit-statement"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Sparkles, CheckCircle, ArrowRight } from "lucide-react"

export function AIGenerator() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<GenerateBenefitStatementOutput | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    try {
      const output = await generateBenefitStatement({
        businessType: formData.get('businessType') as string,
        currentChallenges: formData.get('currentChallenges') as string,
        desiredOutcomes: formData.get('desiredOutcomes') as string,
        specificFeaturesOfInterest: formData.get('specificFeaturesOfInterest') as string,
      })
      setResult(output)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="ai-generator" className="py-24 bg-primary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              <span>Propuesta de Valor Personalizada</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground font-headline sm:text-4xl mb-4">
              Generador de Declaración de <span className="text-primary">Beneficios con IA</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Cuéntenos sobre su negocio y nuestra IA redactará una declaración personalizada explicando exactamente cómo POSMariche resolverá sus desafíos administrativos específicos.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-xl border shadow-sm">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="businessType">Tipo de Negocio</Label>
                  <Input id="businessType" name="businessType" placeholder="ej. Software B2B, Inmobiliaria" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specificFeaturesOfInterest">Área de Interés (Opcional)</Label>
                  <Input id="specificFeaturesOfInterest" name="specificFeaturesOfInterest" placeholder="ej. Automatización, CRM" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentChallenges">Desafíos Administrativos Actuales</Label>
                <Textarea id="currentChallenges" name="currentChallenges" placeholder="¿Qué está ralentizando sus procesos?" required className="min-h-[100px]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desiredOutcomes">Resultados Deseados</Label>
                <Textarea id="desiredOutcomes" name="desiredOutcomes" placeholder="¿Qué metas desea alcanzar?" required className="min-h-[100px]" />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-primary">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generando Declaración...
                  </>
                ) : (
                  <>
                    Generar Declaración
                    <Sparkles className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </div>

          <div className="flex flex-col justify-center">
            {result ? (
              <Card className="border-2 border-primary shadow-xl bg-card animate-in fade-in slide-in-from-bottom-4 duration-500">
                <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
                  <CardTitle className="font-headline flex items-center gap-2 text-lg">
                    <CheckCircle className="h-5 w-5" />
                    Su Declaración de Beneficios Personalizada
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="prose prose-blue max-w-none">
                    <p className="text-lg italic leading-relaxed text-foreground/90">"{result.benefitStatement}"</p>
                  </div>
                  
                  <div className="space-y-3 pt-4 border-t">
                    <h4 className="font-bold text-primary uppercase text-xs tracking-widest">Beneficios Clave Adaptados</h4>
                    <ul className="space-y-2">
                      {result.keyBenefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3 pt-4 border-t">
                    <h4 className="font-bold text-primary uppercase text-xs tracking-widest">Próximos Pasos Sugeridos</h4>
                    <ul className="space-y-2">
                      {result.suggestedNextSteps.map((step, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm font-medium text-foreground">
                          <ArrowRight className="h-4 w-4 text-primary shrink-0" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button variant="outline" className="w-full mt-4" onClick={() => setResult(null)}>
                    Probar Otro Escenario
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border-2 border-dashed border-muted bg-background/50 text-muted-foreground h-full min-h-[400px]">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Sparkles className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-headline font-semibold mb-2 text-foreground">Listo para generar</h3>
                <p className="max-w-xs">Complete el formulario para ver cómo POSMariche puede ayudar específicamente a su negocio a crecer.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
