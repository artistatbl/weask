import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'

export default function Faq() {
	return (
	  <div className="w-full">
	    <section className="w-full bg-white dark:bg-neutral-950 py-20  font-base lg:py-[100px]">
		 <h2 className="w-full mb-14 px-5 text-center text-2xl font-heading md:text-3xl lg:mb-20 lg:text-4xl">
		   Frequently asked questions
		 </h2>
   
		 <div className="mx-auto w-full  max-w-4xl px-6 ">
		   <Accordion className="w-full text-base sm:text-lg" type="single" collapsible>
			<AccordionItem className="mb-2 bg-main rounded-lg" value="item-1">
			  <AccordionTrigger className="p-4">Lorem ipsum dolor sit amet</AccordionTrigger>
			  <AccordionContent className='border-b bg-white border-black rounded-sm p-4'>
			    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
			    Accusantium suscipit sed nihil fuga sapiente facere dolore
			    corrupti labore illum reiciendis?
			  </AccordionContent>
			</AccordionItem>
			<AccordionItem className="mb-2 bg-main rounded-lg" value="item-2">
			  <AccordionTrigger className="p-4">Lorem ipsum dolor sit amet</AccordionTrigger>
			  <AccordionContent className=" border-b bg-white border-black rounded-sm p-4p-4">
			    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
			    Accusantium suscipit sed nihil fuga sapiente facere dolore
			    corrupti labore illum reiciendis?
			  </AccordionContent>
			</AccordionItem>
			<AccordionItem className="mb-2 bg-main rounded-lg" value="item-3">
			  <AccordionTrigger className="p-4">Lorem ipsum dolor sit amet</AccordionTrigger>
			  <AccordionContent className=" border-b bg-white border-black rounded-sm p-4p-4">
			    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
			    Accusantium suscipit sed nihil fuga sapiente facere dolore
			    corrupti labore illum reiciendis?
			  </AccordionContent>
			</AccordionItem>
			<AccordionItem className='bg-main rounded-lg' value="item-4">
			  <AccordionTrigger className="p-4">Lorem ipsum dolor sit amet</AccordionTrigger>
			  <AccordionContent className=" border-b bg-white border-black rounded-sm p-4p-4">
			    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
			    Accusantium suscipit sed nihil fuga sapiente facere dolore
			    corrupti labore illum reiciendis?
			  </AccordionContent>
			</AccordionItem>
		   </Accordion>
		 </div>
	    </section>
	  </div>
	)
}