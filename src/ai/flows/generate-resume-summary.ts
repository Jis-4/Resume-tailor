'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a compelling resume summary based on a user's resume and a target job description.
 *
 * - generateResumeSummary -  A function that takes the resume and job description as input and returns a resume summary.
 * - GenerateResumeSummaryInput - The input type for the generateResumeSummary function.
 * - GenerateResumeSummaryOutput - The return type for the generateResumeSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateResumeSummaryInputSchema = z.object({
  resumeText: z
    .string()
    .describe('The text content of the user\'s resume.'),
  jobDescription: z
    .string()
    .describe('The text content of the target job description.'),
});
export type GenerateResumeSummaryInput = z.infer<typeof GenerateResumeSummaryInputSchema>;

const GenerateResumeSummaryOutputSchema = z.object({
  resumeSummary: z.string().describe('A compelling resume summary tailored to the job description.'),
});
export type GenerateResumeSummaryOutput = z.infer<typeof GenerateResumeSummaryOutputSchema>;

export async function generateResumeSummary(input: GenerateResumeSummaryInput): Promise<GenerateResumeSummaryOutput> {
  return generateResumeSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateResumeSummaryPrompt',
  input: {schema: GenerateResumeSummaryInputSchema},
  output: {schema: GenerateResumeSummaryOutputSchema},
  prompt: `You are a resume expert. Create a compelling resume summary based on the user's resume and the target job description.

Resume:
{{resumeText}}

Job Description:
{{jobDescription}}

Resume Summary:`, 
});

const generateResumeSummaryFlow = ai.defineFlow(
  {
    name: 'generateResumeSummaryFlow',
    inputSchema: GenerateResumeSummaryInputSchema,
    outputSchema: GenerateResumeSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
