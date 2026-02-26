'use server';
/**
 * @fileOverview Un flujo de Genkit para generar declaraciones de beneficios personalizadas para POSMariche en español.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBenefitStatementInputSchema = z.object({
  businessType: z.string().describe('El tipo de negocio que dirige el usuario.'),
  currentChallenges: z.string().describe('Los desafíos actuales de ventas administrativas que enfrenta el negocio.'),
  desiredOutcomes: z.string().describe('Los resultados o metas deseados que el negocio quiere lograr.'),
  specificFeaturesOfInterest: z.string().optional().describe('Cualquier característica específica de POSMariche en la que el usuario ya esté interesado.'),
});
export type GenerateBenefitStatementInput = z.infer<typeof GenerateBenefitStatementInputSchema>;

const GenerateBenefitStatementOutputSchema = z.object({
  benefitStatement: z.string().describe('Una declaración personalizada que explica cómo POSMariche puede beneficiar a la organización.'),
  keyBenefits: z.array(z.string()).describe('Una lista de beneficios clave adaptados a las necesidades del usuario.'),
  suggestedNextSteps: z.array(z.string()).describe('Pasos sugeridos para el cliente potencial.'),
});
export type GenerateBenefitStatementOutput = z.infer<typeof GenerateBenefitStatementOutputSchema>;

const generateBenefitStatementPrompt = ai.definePrompt({
  name: 'generateBenefitStatementPrompt',
  input: {schema: GenerateBenefitStatementInputSchema},
  output: {schema: GenerateBenefitStatementOutputSchema},
  prompt: `Eres un experto en ventas para POSMariche, un programa de ventas administrativas diseñado para optimizar flujos de trabajo, automatizar tareas, mejorar la gestión de datos y análisis de ventas.

Tu tarea es generar una declaración de beneficios personalizada en ESPAÑOL para un cliente potencial. Explica cómo POSMariche puede abordar específicamente sus desafíos actuales y ayudarlos a lograr sus resultados deseados. Resalta la propuesta de valor única de POSMariche adaptada a su situación.

IMPORTANTE: Toda la respuesta debe estar en ESPAÑOL.

---
Tipo de Negocio: {{{businessType}}}
Desafíos Actuales: {{{currentChallenges}}}
Resultados Deseados: {{{desiredOutcomes}}}
{{#if specificFeaturesOfInterest}}Características de Interés: {{{specificFeaturesOfInterest}}}{{/if}}
---

Genera una declaración detallada, una lista de beneficios clave y una lista de próximos pasos sugeridos. La salida debe ser JSON válido según el esquema proporcionado.`,
});

export async function generateBenefitStatement(input: GenerateBenefitStatementInput): Promise<GenerateBenefitStatementOutput> {
  return generateBenefitStatementFlow(input);
}

const generateBenefitStatementFlow = ai.defineFlow(
  {
    name: 'generateBenefitStatementFlow',
    inputSchema: GenerateBenefitStatementInputSchema,
    outputSchema: GenerateBenefitStatementOutputSchema,
  },
  async (input) => {
    const {output} = await generateBenefitStatementPrompt(input);
    if (!output) {
      throw new Error('Error al generar la declaración de beneficios.');
    }
    return output;
  }
);
