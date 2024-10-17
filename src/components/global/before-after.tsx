import { CheckCircle2, XCircle } from "lucide-react"

export default function BeforeAfter() {
  return (
    <section className="bg-whtie py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="rounded-2xl bg-white shadow-xl border border-gray-200 transition-all duration-300 hover:shadow-2xl">
            <div className="p-8 sm:p-10">
              <div className="flex items-center gap-2 text-gray-500 mb-4">
                <XCircle className="h-6 w-6" />
                <p className="text-lg font-semibold">Before</p>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl mb-6">
                Traditional Teaching Limitations
              </h3>
              <ul className="space-y-4 text-base text-gray-600 sm:text-lg">
                {[
                  "One-size-fits-all approach fails to address individual student needs",
                  "Limited resources for personalized lesson planning and materials",
                  "Time-consuming grading and assessment processes",
                  "Difficulty in tracking individual student progress and identifying areas for improvement",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <XCircle className="h-6 w-6 flex-shrink-0 text-red-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 shadow-xl border border-gray-200 transition-all duration-300 hover:shadow-2xl">
            <div className="p-8 sm:p-10">
              <div className="flex items-center gap-2 text-indigo-100 mb-4">
                <CheckCircle2 className="h-6 w-6" />
                <p className="text-lg font-semibold">After</p>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl mb-6">
                AI-Powered Teaching Assistant
              </h3>
              <ul className="space-y-4 text-base text-indigo-100 sm:text-lg">
                {[
                  "Personalized learning experiences tailored to each student's needs",
                  "AI-generated lesson plans and teaching materials",
                  "Automated grading and instant feedback for students",
                  "Detailed progress tracking and data-driven insights for targeted interventions",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-green-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
     
      </div>
    </section>
  )
}