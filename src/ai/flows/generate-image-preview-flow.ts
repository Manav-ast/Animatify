
'use server';
/**
 * @fileOverview Generates an image preview for an animation prompt.
 *
 * - generateImagePreview - A function that generates an image preview.
 * - GenerateImagePreviewInput - The input type for the generateImagePreview function.
 * - GenerateImagePreviewOutput - The return type for the generateImagePreview function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImagePreviewInputSchema = z.object({
  prompt: z.string().describe('A natural language prompt describing the desired animation, used to generate a conceptual image preview.'),
});
export type GenerateImagePreviewInput = z.infer<typeof GenerateImagePreviewInputSchema>;

const GenerateImagePreviewOutputSchema = z.object({
  imageDataUri: z.string().describe("The generated image as a data URI. Format: 'data:image/png;base64,<encoded_data>'."),
});
export type GenerateImagePreviewOutput = z.infer<typeof GenerateImagePreviewOutputSchema>;

export async function generateImagePreview(input: GenerateImagePreviewInput): Promise<GenerateImagePreviewOutput> {
  return generateImagePreviewFlow(input);
}

const generateImagePreviewFlow = ai.defineFlow(
  {
    name: 'generateImagePreviewFlow',
    inputSchema: GenerateImagePreviewInputSchema,
    outputSchema: GenerateImagePreviewOutputSchema,
  },
  async (input) => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-exp', // MUST use this model for image generation
      prompt: `Generate a conceptual image that visually represents the key elements of this animation idea: "${input.prompt}". The image should be suitable as a preview. Focus on a single, impactful frame or concept. Cinematic, visually appealing, 16:9 aspect ratio.`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'], // MUST provide both
      },
    });

    if (!media || !media.url) {
      throw new Error('Image generation failed or returned no media URL.');
    }
    // The media.url is already a data URI
    return { imageDataUri: media.url };
  }
);
