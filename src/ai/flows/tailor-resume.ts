// tailor-resume.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow to tailor a resume to a specific job description.
 *
 * - tailorResume - A function that accepts a resume and job description, and returns a tailored resume.
 * - TailorResumeInput - The input type for the tailorResume function.
 * - TailorResumeOutput - The return type for the tailorResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TailorResumeInputSchema = z.object({
  resumeText: z
    .string()
    .describe('The text content of the resume to be tailored.'),
  jobDescription: z
    .string()
    .describe('The job description to tailor the resume to.'),
});

export type TailorResumeInput = z.infer<typeof TailorResumeInputSchema>;

const TailorResumeOutputSchema = z.object({
  tailoredResume: z
    .string()
    .describe('The tailored resume, highlighting relevant skills and experiences.'),
});

export type TailorResumeOutput = z.infer<typeof TailorResumeOutputSchema>;

export async function tailorResume(input: TailorResumeInput): Promise<TailorResumeOutput> {
  return tailorResumeFlow(input);
}

const tailorResumePrompt = ai.definePrompt({
  name: 'tailorResumePrompt',
  input: {schema: TailorResumeInputSchema},
  output: {schema: TailorResumeOutputSchema},
  prompt: `You are an expert resume writer. Your goal is to tailor a resume to a specific job description by highlighting the skills and experiences that are most relevant.

  Resume:
  {{resumeText}}

  Job Description:
  {{jobDescription}}

  Instructions:
  1.  Carefully compare the resume to the job description.
  2.  Identify the skills, experiences, and keywords that are most relevant to the job description.
  3.  Rewrite the resume to highlight these skills and experiences, ensuring they are prominently displayed.
  4.  Maintain a professional tone and format.
  5.  Focus on making the resume a strong match for the job description.
  6. Limit the response to 700 words.

  Tailored Resume:
  `,
});

const tailorResumeFlow = ai.defineFlow(
  {
    name: 'tailorResumeFlow',
    inputSchema: TailorResumeInputSchema,
    outputSchema: TailorResumeOutputSchema,
  },
  async input => {
    const {output} = await tailorResumePrompt(input);
    return output!;
  }
);
