'use client'

import * as React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { Loader2, FileText, File, Copy } from 'lucide-react'
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command'
import CommandUrlForm from '@/components/CommandUrlForm'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

interface GeneratedContent {
  title?: string;
  introduction?: string;
  mainContent?: { heading: string; paragraphs: string[] }[];
  conclusion?: string;
}

export function CommandK() {
  const [open, setOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [generatedContent, setGeneratedContent] = React.useState<GeneratedContent | null>(null)
  const [currentSessionId, setCurrentSessionId] = React.useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = React.useState<string | null>(null);
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  React.useEffect(() => {
    const sessionId = localStorage.getItem('currentSessionId');
    setCurrentSessionId(sessionId);
    console.log('Current session ID:', sessionId);
  }, []);

  React.useEffect(() => {
    const updateCurrentUrl = () => {
      if (pathname && pathname.startsWith('/chat/')) {
        const encodedUrl = pathname.replace('/chat/', '');
        const decodedUrl = decodeURIComponent(encodedUrl);
        setCurrentUrl(decodedUrl);
        console.log('Current URL updated:', decodedUrl);
      }
    };

    updateCurrentUrl();

    window.addEventListener('popstate', updateCurrentUrl);

    return () => {
      window.removeEventListener('popstate', updateCurrentUrl);
    };
  }, [pathname]);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const handleSubmit = async (submittedUrl: string) => {
    if (submittedUrl) {
      const newSessionId = `${submittedUrl}--${Date.now()}`.replace(/[^a-zA-Z0-9]/g, '')
      localStorage.setItem('currentSessionId', newSessionId)
      toast({
        title: 'Redirecting',
        description: "You're being redirected to the chatbox. Please wait...",
        variant: 'success',
      })
      try {
        await router.push(`/chat/${encodeURIComponent(submittedUrl)}`)
      } catch (error) {
        console.error('Navigation error:', error)
        toast({
          title: 'Error',
          description: 'There was an error redirecting you. Please try again.',
          variant: 'destructive',
        })
      } finally {
        setIsSubmitting(false)
        setOpen(false)
      }
    }
  }

  const handleGenerate = async (type: string) => {
    setIsSubmitting(true)
    toast({
      title: 'Generating',
      description: `Generating a ${type}. Please wait...`,
      variant: 'success',
    })
    try {
      if (!currentUrl) {
        throw new Error('No URL available to generate content');
      }
      console.log('Generating document for URL:', currentUrl);
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, url: currentUrl }),
      })
      const data = await response.json()
      console.log('Received data:', data)
      if (response.ok) {
        setGeneratedContent(data.document);
        console.log('Generated content:', data.document);
        console.log('Main content:', data.document?.mainContent);
        setDialogOpen(true)
      } else {
        throw new Error(data.error || 'An error occurred while generating the document')
      }
    } catch (error: unknown) {
      console.error('Generation error:', error)
      let errorMessage = `There was an error generating the ${type}. Please try again.`
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
      setOpen(false)
    }
  }

  const copyToClipboard = () => {
    if (generatedContent) {
      const fullContent = `
        ${generatedContent.title || 'Generated Content'}

        ${generatedContent.introduction ? `Introduction:\n${generatedContent.introduction}\n\n` : ''}

        ${generatedContent.mainContent ? generatedContent.mainContent.map(section => `
          ${section.heading}
          ${section.paragraphs.join('\n\n')}
        `).join('\n\n') : 'No main content available.'}

        ${generatedContent.conclusion ? `Conclusion:\n${generatedContent.conclusion}` : ''}
      `.trim()

      navigator.clipboard.writeText(fullContent).then(() => {
        toast({
          title: 'Copied',
          description: 'Content copied to clipboard',
          variant: 'success',
        })
      }, (err) => {
        console.error('Could not copy text: ', err)
        toast({
          title: 'Error',
          description: 'Failed to copy content',
          variant: 'destructive',
        })
      })
    }
  }

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <div className="flex flex-col space-y-4 p-4">
          <h2 className="text-lg font-semibold">Chat with a Website</h2>
          <CommandUrlForm onSubmit={handleSubmit} initialUrl="" />
        </div>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Generate">
            <CommandItem onSelect={() => handleGenerate('essay')}>
              <FileText className="mr-2 h-4 w-4" />
              <span>Generate Essay</span>
            </CommandItem>
            <CommandItem onSelect={() => handleGenerate('report')}>
              <File className="mr-2 h-4 w-4" />
              <span>Generate Report</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col bg-white dark:bg-zinc-900">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-zinc-800 dark:text-zinc-100">
              {generatedContent?.title || ''}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-grow pr-4">
            <div className="space-y-6 text-zinc-700 dark:text-zinc-300">
              {generatedContent?.introduction && (
                <section>
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Introduction</h3>
                  <p className="text-lg leading-relaxed">{generatedContent.introduction}</p>
                </section>
              )}
              {generatedContent?.mainContent && generatedContent.mainContent.length > 0 && (
                <section>
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Main Content</h3>
                  {generatedContent.mainContent.map((section, index) => (
                    <div key={index} className="mb-6">
                      <h4 className="text-lg font-medium text-zinc-800 dark:text-zinc-200 mb-2">{section.heading}</h4>
                      {section.paragraphs.map((paragraph, pIndex) => (
                        <p key={pIndex} className="mb-3 text-base leading-relaxed">{paragraph}</p>
                      ))}
                    </div>
                  ))}
                </section>
              )}
              {generatedContent?.conclusion && (
                <section>
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Conclusion</h3>
                  <p className="text-lg leading-relaxed">{generatedContent.conclusion}</p>
                </section>
              )}
            </div>
          </ScrollArea>
          <div className="mt-6 flex justify-end">
            <Button onClick={copyToClipboard} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Copy className="mr-2 h-4 w-4" />
              Copy Content
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}