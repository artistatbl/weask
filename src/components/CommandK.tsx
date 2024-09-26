'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Globe, FileText, File } from 'lucide-react'
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command'
import CommandUrlForm from '@/components/CommandUrlForm'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

export function CommandK() {
  const [open, setOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [generatedContent, setGeneratedContent] = React.useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

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
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type }),
      })
      const data = await response.json()
      if (response.ok) {
        if (data.document && typeof data.document === 'object') {
          setGeneratedContent(data.document.output);
        } else {
          setGeneratedContent(data.document);
        }
        setDialogOpen(true)
      } else {
        throw new Error(data.error || 'An error occurred while generating the document')
      }
    } catch (error: unknown) {
      console.error('Generation error:', error)
      let errorMessage = `There was an error generating the ${type}. Please try again.`
      if (error instanceof Error) {
        if (error.message === 'Insufficient chat history to generate a document') {
          errorMessage = 'Not enough chat history to generate a document. Please continue the conversation.'
        }
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <VisuallyHidden>Generated Content</VisuallyHidden>
            </DialogTitle>
            <DialogDescription>{generatedContent}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}