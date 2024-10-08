import Image from 'next/image'
import { generateMockReview, MockReview } from '@/types/mockreivew'

export default function Community() {
  return (
    <section className="relative w-full flex flex-col items-center justify-center border-b-2 border-b-orange-200 dark:border-b-white bg-white dark:from-neutral-900 dark:via-neutral-800 dark:to-orange-900 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:70px_70px]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,rgba(255,140,50,0.1),transparent)]"></div>
      
      <div className="text-5xl sm:text-6xl md:text-7xl font-black text-center mb-12 relative w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <h2 className="mb-8 sm:mb-12 lg:mb-16 text-center text-4xl sm:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-pink-600 animate-gradient-x">
          Loved by the Community
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {[
            [generateMockReview(), generateMockReview()],
            [generateMockReview(), generateMockReview(), generateMockReview()],
            [generateMockReview(), generateMockReview()],
          ].map((column, columnIndex) => (
            <div className="flex flex-col space-y-6 sm:space-y-8 animate-fade-in-up" style={{animationDelay: `${columnIndex * 150}ms`}} key={columnIndex}>
              {column.map((review: MockReview, reviewIndex) => (
                <div
                  className="group relative overflow-hidden rounded-lg bg-white/80 dark:bg-neutral-800/80 p-4 sm:p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-2 border-orange-400 dark:border-orange-600 backdrop-blur-sm transform hover:scale-105 hover:z-10"
                  key={reviewIndex}
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-pink-500 transform origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></div>
                  
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="relative flex-shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full animate-spin-slow"></div>
                      <Image
                        className="relative h-12 w-12 sm:h-16 sm:w-16 rounded-full object-cover border-2 border-white dark:border-neutral-700 transition-transform duration-300 group-hover:scale-110"
                        src={`https://api.dicebear.com/9.x/pixel-art/png?seed=${review.fullName}`}
                        alt={review.fullName}
                        width={64}
                        height={64}
                      />
                      <div className="absolute -bottom-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-green-400 border-2 border-white dark:border-neutral-800 animate-pulse"></div>
                    </div>
                    <div>
                      <h4 className="text-lg sm:text-xl font-semibold text-orange-600 dark:text-orange-400 line-clamp-1">{review.fullName}</h4>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-1">{review.jobTitle}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base lg:text-lg relative z-10 line-clamp-4 sm:line-clamp-none">{review.review}</p>
       
                  <div className="absolute -bottom-12 -right-12 h-24 w-24 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-500 ease-in-out"></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}