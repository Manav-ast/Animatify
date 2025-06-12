// Use server directive is required for Genkit flows.
'use server';

/**
 * @fileOverview Generates Python code using Manim to create 2D animations from natural language prompts.
 *
 * - generateManimCode - A function that generates Manim code from a natural language prompt.
 * - GenerateManimCodeInput - The input type for the generateManimCode function.
 * - GenerateManimCodeOutput - The return type for the generateManimCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateManimCodeInputSchema = z.object({
  prompt: z.string().describe('A natural language prompt describing the desired 2D animation.'),
});
export type GenerateManimCodeInput = z.infer<typeof GenerateManimCodeInputSchema>;

const GenerateManimCodeOutputSchema = z.object({
  code: z.string().describe('The Python code generated using Manim to create the animation.'),
});
export type GenerateManimCodeOutput = z.infer<typeof GenerateManimCodeOutputSchema>;

export async function generateManimCode(input: GenerateManimCodeInput): Promise<GenerateManimCodeOutput> {
  return generateManimCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateManimCodePrompt',
  input: {schema: GenerateManimCodeInputSchema},
  output: {schema: GenerateManimCodeOutputSchema},
  prompt: `You are an expert in Manim, a Python library for creating mathematical animations.

  Given a natural language prompt describing a 2D animation, generate the corresponding Python code using Manim.
  The code should be well-formatted and include comments to explain the different parts of the animation.
  The comments should be concise and only included if they help the readability of the code.
  Follow these rules:

  - The code should be efficient and avoid unnecessary computations.
  - The code should be well-structured and easy to understand.
  - Use descriptive variable names.
  - Include comments to explain the purpose of each section of the code, but only if necessary.
  - Use best practices.

  Here is the prompt:
  {{prompt}}`,
});

const generateManimCodeFlow = ai.defineFlow(
  {
    name: 'generateManimCodeFlow',
    inputSchema: GenerateManimCodeInputSchema,
    outputSchema: GenerateManimCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
