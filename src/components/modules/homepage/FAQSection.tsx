import SectionHeader from '@/components/common/SectionHeader'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { FadeInUp } from '@/components/common/MotionWrapper'

export default function FAQSection() {
  const faqs = [
    {
      question: "How long does delivery take?",
      answer: "Delivery times vary depending on your location and the restaurant's preparation time. Generally, our deliveries take between 30 to 45 minutes."
    },
    {
      question: "Is there a minimum order amount?",
      answer: "No, we don't have a strict minimum order amount, however, delivery fees may vary for smaller orders."
    },
    {
      question: "Can I cancel my order?",
      answer: "You can cancel your order within the first 5 minutes of placing it. After that, the restaurant has already started preparing your food."
    },
    {
      question: "Do you offer vegetarian options?",
      answer: "Yes! We have hundreds of restaurants partnering with us that offer extensive vegetarian and vegan menus."
    },
    {
      question: "How do I track my order?",
      answer: "Once your order is confirmed and dispatched, you will receive a tracking link in the app and via email to monitor your driver's location in real-time."
    }
  ]

  return (
    <div className="py-8 sm:py-12 lg:py-16 container mx-auto px-4 max-w-4xl">
      <SectionHeader subtitle="Questions?" title="Frequently Asked Questions" description="Find answers to common questions about our food delivery service." />
      <FadeInUp className="mt-4 md:mt-8">
        <Accordion type="single" collapsible className="w-full bg-background rounded-2xl p-4 sm:p-6 md:p-8 border border-border shadow-sm">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-b last:border-none">
              <AccordionTrigger className="text-left text-base sm:text-lg font-medium hover:text-primary py-4 transition-colors">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </FadeInUp>
    </div>
  )
}
