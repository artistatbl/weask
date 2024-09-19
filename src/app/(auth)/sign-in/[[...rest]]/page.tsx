import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <SignIn 
      appearance={{
        elements: {
          card: 'bg-white border-1 border-black shadow-lg rounded-sm p-6 transform transition-transform hover:scale-105', // Black and white cartoonish card style
          button: 'bg-black text-white hover:bg-gray-800 rounded-lg py-2 px-4 shadow-md transform transition-transform hover:scale-105', // Black button style
          // Add more customizations as needed
        },
      }} 
    />
  )
}