"use client";

import { useState } from 'react';
import { tailorResume } from '@/ai/flows/tailor-resume';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Briefcase, Download, FileText, LoaderCircle, Sparkles, Wand2 } from 'lucide-react';
import jsPDF from 'jspdf';
import { Skeleton } from './ui/skeleton';

export function ResumeTailorForm() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [tailoredResume, setTailoredResume] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (event) => {
        setResumeText(event.target?.result as string);
        toast({
          title: "Success",
          description: "Resume loaded from .txt file.",
        })
      };
      reader.readAsText(file);
    } else {
      toast({
        title: "Unsupported File Type",
        description: "Please upload a .txt file. For other formats like PDF, please copy and paste the content.",
        variant: "destructive",
      });
    }
    e.target.value = '';
  };

  const handleTailorResume = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim() || !jobDescription.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please provide both your resume and a job description.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setTailoredResume('');
    
    try {
      const result = await tailorResume({ resumeText, jobDescription });
      setTailoredResume(result.tailoredResume);
    } catch (error) {
      console.error('Error tailoring resume:', error);
      toast({
        title: 'An Error Occurred',
        description: 'Failed to tailor resume. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!tailoredResume) return;

    try {
      const doc = new jsPDF();
      
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(11);
      
      const margin = 15;
      const pageWidth = doc.internal.pageSize.getWidth();
      const textLines = doc.splitTextToSize(tailoredResume, pageWidth - margin * 2);

      doc.text(textLines, margin, margin);
      doc.save('Tailored-Resume.pdf');
    } catch(error) {
      console.error("Failed to generate PDF:", error);
      toast({
        title: 'PDF Generation Failed',
        description: 'There was an issue creating the PDF file. Please try again.',
        variant: 'destructive',
      })
    }
  };
  
  return (
    <form onSubmit={handleTailorResume} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-6 h-6" /> Your Base Resume
            </CardTitle>
            <CardDescription>Upload a .txt file or paste your resume content below.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
             <div className="grid w-full items-center gap-2">
              <Label htmlFor="resume-file">Upload .txt file</Label>
              <Input id="resume-file" type="file" accept=".txt" onChange={handleFileChange} />
            </div>
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="resume-text">Or paste resume text</Label>
              <Textarea
                id="resume-text"
                placeholder="Paste your full resume here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={15}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-6 h-6" /> Target Job Description
            </CardTitle>
            <CardDescription>Paste the job description you are applying for.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={15}
              required
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Tailoring...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Tailor Resume with AI
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="lg:sticky lg:top-8">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-primary" /> AI-Tailored Resume
                  </CardTitle>
                  <CardDescription>
                    Review and fine-tune the AI's suggestions, then download your optimized resume.
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleDownloadPdf} disabled={!tailoredResume || isLoading}>
                  <Download className="mr-2 h-4 w-4" />
                  PDF
                </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-3/4" />
                <div className='h-4'></div>
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-2/4" />
              </div>
            ) : (
              <Textarea
                placeholder="Your tailored resume will appear here..."
                value={tailoredResume}
                onChange={(e) => setTailoredResume(e.target.value)}
                rows={31}
                readOnly={!tailoredResume}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
