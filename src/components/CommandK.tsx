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
  const [url, setUrl] = React.useState('')
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
      setIsSubmitting(true)
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
        body: JSON.stringify({ type, content: url }), // Assuming `url` contains the content
      })
      const data = await response.json()
      if (data.document && typeof data.document === 'object') {
        setGeneratedContent(data.document.output); // Extract the 'output' field from the response
      } else {
        setGeneratedContent(data.document);
      }
      setDialogOpen(true)
    } catch (error) {
      console.error('Generation error:', error)
      toast({
        title: 'Error',
        description: `There was an error generating the ${type}. Please try again.`,
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
        <div className="flex flex-col space-y-4 p-4 ">
          <h2 className="text-lg font-semibold">Chat with a Website</h2>
          <CommandUrlForm onSubmit={handleSubmit} initialUrl={url} />
        </div>
        <CommandInput
          placeholder="Search previous chats..."
          value={url}
          onValueChange={setUrl}
        />
        <CommandList>
          <CommandEmpty>No previous chats found.</CommandEmpty>
          <CommandGroup heading="Recent Chats">
            {/* <CommandItem onSelect={() => handleSubmit('https://bugify.vercel.app/')}>
              <Globe className="mr-2 h-4 w-4" />
              <span>Bugify.com</span>
            </CommandItem> */}
            {/* Add more recent chats here */}
          </CommandGroup>
          <CommandGroup heading="Generate">
            <CommandItem onSelect={() => handleGenerate('essay')}>
              <FileText className="mr-2 h-4 w-4" />
              <span>Generate Essay</span>
            </CommandItem>
            <CommandItem onSelect={() => handleGenerate('report')}>
              <File className="mr-2 h-4 w-4" />
              <span>Generate Report</span>
            </CommandItem>
            <CommandItem onSelect={() => handleGenerate('article')}>
              <FileText className="mr-2 h-4 w-4" />
              <span>Generate Article</span>
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