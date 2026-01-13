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
    <section className="py-24 max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-[#538CE8]">
          FAQs About
        </h2>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="rounded-xl px-6 bg-white/50 dark:bg-card/50 backdrop-blur-sm"
          >
            <AccordionTrigger className="text-left font-medium hover:no-underline hover:text-primary transition-colors py-6 text-base">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
