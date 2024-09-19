import { SignUp } from '@clerk/nextjs'

export default function Page() {
    return (
      <SignUp 
        appearance={{
          elements: {
            card: 'bg-white border-1 shadow-lg rounded-sm p-6 ', // Black and white cartoonish card style
            button: 'bg-black text-white hover:bg-gray-800 rounded-lg py-2 px-4 shadow-md', // Black button style
            // Add more customizations as needed
          },
        }} 
      />
    )
  }