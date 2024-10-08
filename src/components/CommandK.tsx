"use client"
import React, { useState, useEffect, useRef, useMemo} from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { Copy, Search } from 'lucide-react'
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command'
import CommandUrlForm from '@/components/CommandUrlForm'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import  {saveSearchHistory}  from '@/app/actions/chat'
import { getSearchHistory } from '@/lib/getSearchHistory'
import { GeneratedContent } from '@/utils/types';
import { reportTypes, getReportTypeById, ReportType } from '@/types/report'




import { useAuth } from '@clerk/nextjs'; 
import LoadingPage from './home/LoadingGenerate'


interface SearchHistoryItem {
  id: string;
  url: string;
  title: string;
  visitedAt: string;
}


 export const  CommandK: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const { isSignedIn, isLoaded } = useAuth(); // Add this line
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [currentReportType, setCurrentReportType] = useState<ReportType | null>(null);




 







  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const isChatPage = useMemo(() => {
    return pathname?.startsWith('/chat/') || false
  }, [pathname])

  useEffect(() => {
    const updateCurrentUrl = () => {
      if (pathname && pathname.startsWith('/chat/')) {
        const encodedUrl = pathname.replace('/chat/', '');
        const decodedUrl = decodeURIComponent(encodedUrl);
        setCurrentUrl(decodedUrl);
      }
    };

    updateCurrentUrl();
    window.addEventListener('popstate', updateCurrentUrl);
    return () => {
      window.removeEventListener('popstate', updateCurrentUrl);
    };
  }, [pathname]);

  useEffect(() => {
    const fetchSearchHistory = async () => {
      if (isLoaded && isSignedIn) {
        // console.log('Fetching search history...');
        const result = await getSearchHistory()
        // console.log('Search history fetch result:', result);
        if (result.status === 200) {
          setSearchHistory(result.data)
          // console.log('Search history set:', result.data);
        } else {
          console.error('Failed to fetch search history:', result.message);
          toast({
            title: 'Error',
            description: 'Failed to fetch search history',
            variant: 'destructive',
          })
        }
      }
    }
    fetchSearchHistory()
  }, [isLoaded, isSignedIn, toast])

  
  const filteredSearchHistory = useMemo(() => {
    // console.log('Filtering search history. Current searchTerm:', searchTerm);
    // console.log('Current searchHistory:', searchHistory);
    
    if (!searchTerm) return searchHistory;

    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = searchHistory.filter(item => {
      const lowerUrl = item.url.toLowerCase();
      const lowerTitle = item.title.toLowerCase();
      
      // Check if the search term is part of the URL or title
      if (lowerUrl.includes(lowerSearchTerm) || lowerTitle.includes(lowerSearchTerm)) {
        return true;
      }
      
      // Split the search term into words and check if any word matches
      const searchWords = lowerSearchTerm.split(/\s+/);
      return searchWords.some(word => 
        lowerUrl.includes(word) || lowerTitle.includes(word)
      );
    });

    // console.log('Filtered search history:', filtered);
    return filtered;
  }, [searchHistory, searchTerm]);


  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey) && isChatPage) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [isChatPage])

  const handleSubmit = async (submittedUrl: string) => {
    if (submittedUrl) {
      const newSessionId = `${submittedUrl}--${Date.now()}`.replace(/[^a-zA-Z0-9]/g, '')
      localStorage.setItem('currentSessionId', newSessionId)
      // setCurrentSessionId(newSessionId) // Remove this line

      // setIsSubmitting(true) // Remove this line
      const saveResult = await saveSearchHistory(submittedUrl, newSessionId)
      if (saveResult.status !== 200) {
        console.error('Error saving search history:', saveResult.message)
        // console.log(saveSearchHistory)
      }

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
        // setIsSubmitting(false) // Remove this line
        setOpen(false)
      }
    }
  }
  // Generate function for eassay and  report
// ... (other imports)

const handleGenerate = async (reportTypeId: string) => {
  const reportType = getReportTypeById(reportTypeId);
  if (!reportType) {
    toast({
      title: 'Error',
      description: 'Invalid report type selected',
      variant: 'destructive',
    });
    return;
  }

  setIsGenerating(true);
  setOpen(false);
  setDialogOpen(true);
  setGeneratedContent(null);
  setJobId(null);
  setCurrentReportType(reportType);

  try {
    if (!currentUrl) {
      throw new Error('No URL available to generate content');
    }
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type: reportTypeId, url: currentUrl }),
    });
    const data = await response.json();
    
    // console.log('API Response:', data);
    
    if (!response.ok) {
      throw new Error(data.error || 'An error occurred while generating the document');
    }

    if (!data.jobId) {
      throw new Error('No job ID returned from the API');
    }

    setJobId(data.jobId);
    pollJobStatus(data.jobId);

  } catch (error) {
    console.error('Generation error:', error);
    let errorMessage = `There was an error generating the ${reportType
    }. Please try again.`
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    toast({
      title: 'Error',
      description: errorMessage,
      variant: 'destructive',
    });
    setDialogOpen(false);
    setIsGenerating(false);
  }
};

const pollJobStatus = async (jobId: string) => {
  try {
    const response = await fetch(`/api/job-status?jobId=${jobId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'An error occurred while checking job status');
    }

    if (data.status === 'completed' && data.result) {
      setGeneratedContent(data.result);
      setIsExpanded(true);
      setIsGenerating(false);
      toast({
        title: 'Success',
        description: `Your ${reportTypes[0].name} has been generated successfully!  `,
        variant: 'success',
        duration: 5000,
      });
    } else if (data.status === 'failed') {
      throw new Error(data.error || 'Document generation failed');
    } else {
      // Job is still in progress, continue polling
      setTimeout(() => pollJobStatus(jobId), 2000); // Poll every 2 seconds
    }
  } catch (error) {
    console.error('Job status check error:', error);
    let errorMessage = 'An error occurred while generating the document. Please try again.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    toast({
      title: 'Error',
      description: errorMessage,
      variant: 'destructive',
    });
    setDialogOpen(false);
    setIsGenerating(false);
  }
};



////      //////////////////////////////////////////////////////////////////   
  const copyToClipboard = () => {
    if (!generatedContent) {
      toast({
        title: 'Error',
        description: 'No content to copy. Please generate content first.',
        variant: 'destructive',
      })
      return;
    }

    const fullContent = `
      ${generatedContent.title || 'Generated Content'}

      ${generatedContent.introduction ? `Introduction:\n${generatedContent.introduction}\n\n` : ''}

      ${generatedContent.mainContent ? generatedContent.mainContent.map(section => `
        ${section.heading}
        ${section.paragraphs.join('\n\n')}
      `).join('\n\n') : 'No main content available.'}

      ${generatedContent.conclusion ? `Conclusion:\n${generatedContent.conclusion}\n\n` : ''}

      ${generatedContent.references ? `References:\n${generatedContent.references.join('\n')}` : ''}
    `.trim()

    // Try to use the Clipboard API
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(fullContent)
        .then(() => {
          toast({
            title: 'Success',
            description: 'Content copied to clipboard',
            variant: 'success',
          })
        })
        .catch((err) => {
          console.error('Clipboard API failed:', err)
          fallbackCopyTextToClipboard(fullContent)
        })
    } else {
      // Fallback for older browsers
      fallbackCopyTextToClipboard(fullContent)
    }
  }

  const fallbackCopyTextToClipboard = (text: string) => {
    if (!textAreaRef.current) {
      toast({
        title: 'Error',
        description: 'Failed to copy. Please try selecting and copying the text manually.',
        variant: 'destructive',
      })
      return;
    }

    const textArea = textAreaRef.current;
    textArea.value = text;
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';

    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        toast({
          title: 'Success',
          description: 'Content copied to clipboard',
          variant: 'success',
        })
      } else {
        throw new Error('Copy command was unsuccessful')
      }
    } catch (err) {
      console.error('Fallback copy failed:', err)
      toast({
        title: 'Error',
        description: 'Failed to copy. Please try selecting and copying the text manually.',
        variant: 'destructive',
      })
    }

    textArea.style.top = '-9999px';
    textArea.style.left = '-9999px';
  }

  return (
    <>
      {isChatPage && (
        <>
          <CommandDialog open={open} onOpenChange={setOpen}>
            <div className="flex flex-col space-y-4 p-4">
              <h2 className="text-lg font-semibold">Chat with a Website</h2>
              <CommandUrlForm onSubmit={handleSubmit} initialUrl="" />
            </div>
            <CommandInput 
              placeholder="Type a command or search..." 
              value={searchTerm}
              onValueChange={(value) => {
                // console.log('Search term changed:', value);
                setSearchTerm(value);
              }}
            />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              {isSignedIn && (
                <CommandGroup heading="Recent Searches">
                  {filteredSearchHistory.map((item) => (
                    <CommandItem key={item.id} onSelect={() => handleSubmit(item.url)}>
                      <Search className="mr-2 h-4 w-4" />
                      <span className="flex-1 truncate">
                        {item.title}
                        <span className="ml-2 text-xs text-gray-400">
                          {new URL(item.url).hostname}
                        </span>
                      </span>
                      <span className="ml-auto text-xs text-gray-400">
                        {new Date(item.visitedAt).toLocaleDateString()}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {/* <CommandGroup heading="Generate">
                <CommandItem onSelect={() => handleGenerate('essay')}>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Generate Essay</span>
                </CommandItem>
                <CommandItem onSelect={() => handleGenerate('report')}>
                  <File className="mr-2 h-4 w-4" />
                  <span>Generate Report</span>
                </CommandItem>
              </CommandGroup> */}
                  <CommandGroup heading="Generate">
          {reportTypes.map((reportType) => (
            <CommandItem key={reportType.id} onSelect={() => handleGenerate(reportType.id)}>
              <reportType.icon className="mr-2 h-4 w-4" />
              <span>Generate {reportType.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
            </CommandList>
          </CommandDialog>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            if (!open) {
              setDialogOpen(false);
              setIsExpanded(false);
              setJobId(null);
            }
          }}>
            <DialogContent className={`
              transition-all duration-300 ease-in-out
              ${isExpanded
                ? "w-full max-w-[95vw] h-[95vh] sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-4xl xl:max-w-5xl"
                : "w-[90vw] max-w-md h-[300px]"
              } 
              p-0 bg-zinc-800  text-gray-200 dark:bg-zinc-900 overflow-hidden border-orange-600 border
            `}>
              {isGenerating && (
  <div className="  w-full h-full">
    {currentReportType && (
      <LoadingPage 
        reportType={currentReportType}
        onComplete={() => {
         // console.log('Loading animation completed');
        }}
      />
    )}
    {jobId && (
      <span className="sr-only">
        Job ID: {jobId}
      </span>
    )}
  </div>
)}







              {!isGenerating && (
                <div className="h-full flex flex-col">
                  <div className="flex justify-between items-center p-2 sm:p-4 border-b border-orange-600 dark:border-gray-700">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold  dark:text-gray-100 truncate">
                      {generatedContent?.title || 'Generated Content'}
                    </h2>
                    <Button
                      onClick={() => {
                        setDialogOpen(false);
                        setIsExpanded(false);
                      }}
                      variant="ghost"
                      className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
                    >
                    </Button>
                  </div>
                  <ScrollArea className="flex-grow px-2 sm:px-4 md:px-6 py-2 sm:py-4 h-[calc(95vh-8rem)]">
                  
                
                      
                    
                    <div className="space-y-3 sm:space-y-4 md:space-y-6  dark:text-gray-300">
                      {generatedContent?.introduction && (
                        <section>
                          <h3 className="text-base sm:text-lg md:text-xl font-semibold  dark:text-gray-100 mb-2">Introduction</h3>
                          <p className="text-sm sm:text-base md:text-lg leading-relaxed ">{generatedContent.introduction}</p>
                        </section>
                      )}
                      {generatedContent?.mainContent && generatedContent.mainContent.length > 0 && (
                        <section>
                          <h3 className="text-base sm:text-lg md:text-xl font-semibold  dark:text-gray-100 mb-2 sm:mb-3 md:mb-4">Main Content</h3>
                          {generatedContent.mainContent.map((section, index) => (
                            <div key={index} className="mb-3 sm:mb-4 md:mb-6">
                              <h4 className="text-sm sm:text-base md:text-lg font-medium  dark:text-gray-200 mb-1 sm:mb-2">{section.heading}</h4>
                              {section.paragraphs.map((paragraph, pIndex) => (
                                <p key={pIndex} className="mb-2 text-xs sm:text-sm md:text-base leading-relaxed ">{paragraph}</p>
                              ))}
                            </div>
                          ))}
                        </section>
                      )}
                      {generatedContent?.conclusion && (
                        <section>
                          <h3 className="text-base sm:text-lg md:text-xl font-semibold  dark:text-gray-100 mb-2">Conclusion</h3>
                          <p className="text-sm sm:text-base md:text-lg   leading-relaxed">{generatedContent.conclusion}</p>
                        </section>
                      )}
                      {generatedContent?.references && generatedContent.references.length > 0 && (
                        <section>
                          <h3 className="text-base sm:text-lg md:text-xl font-semibold  dark:text-gray-100 mb-2">References</h3>
                          <ul className="list-disc pl-4 sm:pl-5 space-y-1">
                            {generatedContent.references.map((reference, index) => (
                              <li key={index} className="text-xs sm:text-sm md:text-base leading-relaxed ">{reference}</li>
                            ))}
                          </ul>
                        </section>
                      )}
                    </div>
                  </ScrollArea>
                  <div className="p-2 sm:p-4 border-t border-orange-600 dark:border-gray-700">
                    <Button 
                      onClick={copyToClipboard} 
                      className="w-full bg-orange-600  hover:bg-orange-800
                     text-white py-2 md:py-2 rounded-md transition duration-200 ease-in-out text-xs sm:text-sm md:text-base"
                      disabled={!generatedContent}
                    >
                      <Copy className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      Copy Generated Content
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </>
      )}
      <textarea
        ref={textAreaRef}
        style={{
          position: 'absolute',
          left: '-9999px',
          top: '-9999px'
        }}
      />
    </>
  )

 }