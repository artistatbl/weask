'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Globe } from 'lucide-react'
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command'
import CommandUrlForm from '@/components/CommandUrlForm'

export function CommandK() {
  const [open, setOpen] = React.useState(false)
  const [url, setUrl] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
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
            <CommandItem onSelect={() => handleSubmit('https://bugify.vercel.app/')}>
              <Globe className="mr-2 h-4 w-4" />
              <span>Bugify.com</span>
            </CommandItem>
            {/* Add more recent chats here */}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}