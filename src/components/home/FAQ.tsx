import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does AI LinkedIn Photo Generator work?",
    answer:
      "AI LinkedIn Photo Generator uses smart algorithms to transform a simple selfie into a polished, professional LinkedIn headshot. It enhances lighting, cleans up the background, and adjusts facial expressions and clothing to make your photo look natural and career-ready. This tool is perfect for students, job seekers, or professionals who need a high-quality LinkedIn photo quickly without hiring a photographer.",
  },
  {
    question: "Is AI LinkedIn Photo Generator free to use?",
    answer:
      "Yes, our basic generation features are free to use. You can generate professional headshots without any credit card requirement.",
  },
  {
    question:
      "Do I need a professional photo to use AI LinkedIn Photo Generator?",
    answer:
      "No, you don't! Just upload a clear selfie or casual photo. Our AI handles the rest, upgrading the quality and style to professional standards.",
  },
  {
    question: "How long does it take to generate a LinkedIn headshot?",
    answer:
      "It typically takes just a few seconds. Our optimized AI engine processes your image and delivers high-quality results almost instantly.",
  },
];

export function FAQSection() {
  return (
    <section
      id="faqs-section"
      className="relative py-16 md:py-24 overflow-hidden bg-white/50 dark:bg-card/50"
    >
      <div className="relative z-10 max-w-3xl mx-auto px-4 md:px-6 container">
        <div className="text-center md:mb-12 mb-8">
          <h2 className="text-3xl md:text-5xl font-bold text-[#538CE8] mb-4">
            FAQs
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to know about the product and billing.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={`faq-${index}`}
              value={`item-${index}`}
              className="rounded-2xl border border-blue-100 bg-white dark:bg-card shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden px-2"
            >
              <AccordionTrigger className="text-left font-semibold hover:no-underline hover:text-[#538CE8] transition-colors py-5 px-6 text-base md:text-lg data-[state=open]:text-[#538CE8]">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed px-6 pb-6 text-base bg-white/50 dark:bg-transparent">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
