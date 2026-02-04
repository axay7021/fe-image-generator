import { Upload, Wand2, Download } from 'lucide-react';
import Image from 'next/image';

const steps = [
  {
    title: 'Step 1: Upload Your Photo to Start the Process',
    icon: Upload,
    description: 'Drag & drop your generic selfie.',
    color: 'bg-blue-500',
    img: '/step-1.jpg',
  },
  {
    title: 'Step 2: Pick a Style or Add Your Own Prompt',
    icon: Wand2,
    description: "Choose 'Passport' or custom prompt.",
    color: 'bg-purple-500',
    img: '/step-2.jpg',
  },
  {
    title: 'Step 3: Generate and Download Your Headshot',
    icon: Download,
    description: 'Get your professional result instantly.',
    color: 'bg-green-500',
    img: '/step-3.jpg',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 container mx-auto max-w-[1392px] px-4 md:px-6">
      <div className="text-center md:mb-16 mb-8 space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold text-[#538CE8]">
          How to Use AI Headshot Generator for <br /> LinkedIn Profile Picture
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center text-center space-y-4 group">
            <div className="relative w-full aspect-video overflow-hidden flex items-center justify-center transition-all duration-300">
              <Image src={step.img} alt={step.title} fill />
            </div>
            <h3 className="font-bold text-lg max-w-[250px]">{step.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
