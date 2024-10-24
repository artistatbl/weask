'use client'

import React, { useState } from "react"
import Image from "next/image"
import { Check } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import TestimonialSingle from "./testimonial-single"
const features = [
  {
    id: "ai-lesson",
    title: "AI-Powered Lesson Creation",
    description: "Create engaging lesson plans in minutes with our AI assistant.",
    additionalInfo: [
      "Save hours of prep time",
      "Get fresh, creative ideas",
      "Customize to your needs",
    ],
    image: "/thumbnail.png",
  },
  {
    id: "resource-gen",
    title: "One-Click Resource Generation",
    description: "Instantly generate quizzes, worksheets, and study guides aligned with your lessons.",
    additionalInfo: [
      "Instant resource creation",
      "Multiple resource types",
      "Perfectly aligned with your lessons",
    ],
    image: "/thumbnail.png",
  },
  {
    id: "easy-edit",
    title: "Easy Editing and Sharing",
    description: "Edit AI-generated content and export as polished PDFs ready for your class.",
    additionalInfo: [
      "User-friendly editing",
      "Professional PDF export",
      "Ready to use in class",
    ],
    image: "/thumbnail.png",
  },
]

export default function Feature() {
    
  const [activeFeature, setActiveFeature] = useState("ai-lesson")

  return (
    <section className="bg-white py-24" id="features">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
          AI-powered lesson preparation
          <span className="relative mt-2 inline-block">
            <span className="absolute inset-0 -backdrop-hue-rotate-90 transform bg-orange-600"></span>
            <span className="relative z-10 px-2 py-2 text-white">
              made easy
            </span>
          </span>
        </h2>
        <Tabs value={activeFeature} onValueChange={setActiveFeature} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 gap-4">
            {features.map((feature) => (
              <TabsTrigger
                key={feature.id}
                value={feature.id}
                className="data-[state=active]:bg-orange-600 data-[state=active]:text-white  border border-zinc-300 rounded-lg"
              >
                {feature.title}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="grid gap-12 lg:grid-cols-2">
            <Card className="overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-xl">
              <CardContent className="p-0">
                {features.map((feature) => (
                  <TabsContent key={feature.id} value={feature.id} className="m-0">
                    <div className="p-6">
                      <h3 className="mb-4 text-2xl font-semibold ">{feature.title}</h3>
                      <p className="mb-6 text-gray-600">{feature.description}</p>
                      <ScrollArea className="h-48 rounded-md border p-4">
                        <ul className="space-y-4">
                          {feature.additionalInfo.map((info, index) => (
                            <li key={index} className="flex items-center text-sm text-gray-600">
                              <Check className="mr-2 h-4 w-4 text-primary" />
                              {info}
                            </li>
                          ))}
                        </ul>
                      </ScrollArea>
                    </div>
                  </TabsContent>
                ))}
              </CardContent>
            </Card>
            <div className="relative h-[400px] overflow-hidden rounded-lg shadow-xl transition-shadow duration-300 hover:shadow-2xl">
              {features.map((feature) => (
                <TabsContent key={feature.id} value={feature.id} className="m-0 h-full">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6">
                    {/* <h3 className="text-2xl font-bold text-white">{feature.title}</h3> */}
                    {/* <p className="mt-2 text-sm text-gray-200">{feature.description}</p> */}
                  </div>
                </TabsContent>
              ))}
            </div>
          </div>
        </Tabs>

        <div className="mt-24">

        <TestimonialSingle
        testimonial={{
          name: "Emily Paris",
          content:
            "This AI teaching assistant is a game-changer! It's incredibly intuitive and has saved me hours of lesson planning time. My students are more engaged than ever.",
          schoolName: "University Of Manchester",
          image: "https://api.dicebear.com/6.x/avataaars/png?seed=Sarah",
        }}
      />
        </div>



      
      
      </div>
    </section>
  )
}