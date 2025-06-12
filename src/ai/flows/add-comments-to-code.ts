// add-comments-to-code.ts
'use server';

/**
 * @fileOverview Adds comments to the generated Python code if they improve readability.
 *
 * - addComments - A function that adds comments to the code.
 * - AddCommentsInput - The input type for the addComments function.
 * - AddCommentsOutput - The return type for the addComments function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AddCommentsInputSchema = z.object({
  code: z.string().describe('The Python code to add comments to.'),
});
export type AddCommentsInput = z.infer<typeof AddCommentsInputSchema>;

const AddCommentsOutputSchema = z.object({
  commentedCode: z.string().describe('The Python code with added comments.'),
});
export type AddCommentsOutput = z.infer<typeof AddCommentsOutputSchema>;

export async function addComments(input: AddCommentsInput): Promise<AddCommentsOutput> {
  return addCommentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'addCommentsPrompt',
  input: {schema: AddCommentsInputSchema},
  output: {schema: AddCommentsOutputSchema},
  prompt: `You are a Python coding expert. You will receive Python code and add comments to it to improve readability. Only add comments if they significantly improve understanding of the code.

Code: {{{code}}}`,
});

const addCommentsFlow = ai.defineFlow(
  {
    name: 'addCommentsFlow',
    inputSchema: AddCommentsInputSchema,
    outputSchema: AddCommentsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
