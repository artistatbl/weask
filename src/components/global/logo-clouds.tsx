'use client'

import { BookOpen, GraduationCap, Library, Microscope, Users } from 'lucide-react'

export default function LogoClouds() {
  const icons = [
    { Icon: BookOpen, name: 'Learning' },
    { Icon: GraduationCap, name: 'Graduation' },
    { Icon: Library, name: 'Resources' },
    { Icon: Microscope, name: 'Research' },
    { Icon: Users, name: 'Community' },
  ]

  return (
    <section className="bg-white py-8 sm:py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-base font-semibold text-gray-600 sm:text-lg md:text-xl mb-6 sm:mb-8">
          Trusted by university students worldwide
        </h2>
        <div className="flex flex-col items-center sm:grid sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-8">
          <div className="flex justify-center w-full gap-4 sm:hidden">
            {icons.slice(0, 3).map(({ Icon, name }) => (
              <div key={name} className="flex flex-col items-center justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white ">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <p className="mt-2 text-xs font-medium text-gray-600 text-center">{name}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-center w-full gap-4 sm:hidden">
            {icons.slice(3).map(({ Icon, name }) => (
              <div key={name} className="flex flex-col items-center justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <p className="mt-2 text-xs font-medium text-gray-600 text-center">{name}</p>
              </div>
            ))}
          </div>
          {icons.map(({ Icon, name }) => (
            <div
              key={name}
              className="hidden sm:flex sm:flex-col sm:items-center sm:justify-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white">
                <Icon className="h-8 w-8 text-primary" />
              </div>
              <p className="mt-2 text-sm font-medium text-gray-600 text-center">{name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}