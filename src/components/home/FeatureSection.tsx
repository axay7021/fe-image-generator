import Image from "next/image";

export function FeatureSection() {
  return (
    <section className="py-12 lg:py-24 space-y-16 lg:space-y-32 container px-4 md:px-6 mx-auto max-w-[1392px]">
      {/* What is AI LinkedIn Photo Generator? */}
      <div className="flex flex-col lg:flex-row justify-center items-center gap-10 lg:gap-32">
        <div className="space-y-6 lg:max-w-[566px] text-left">
          <h2 className="text-2xl md:text-4xl font-bold text-[#538CE8]">
            What is AI LinkedIn <br /> Photo Generator?
          </h2>
          <p className="text-base sm:text-lg text-[#949494] leading-relaxed">
            AI LinkedIn Photo Generator is a free online tool that turns a
            simple selfie into a professional LinkedIn headshot in seconds. It
            gives you studio-quality results without booking a photographer,
            making it great for students and job seekers who need a clean,
            career-ready photo fast. The tool improves lighting, fixes the
            background, and offers different outfits and poses so your profile
            looks natural and trustworthy. It&apos;s easy to use, low-cost, and
            helps your LinkedIn page stand out. If you want more styles, you can
            also try AI Headshot Generator or AI Anime Generator.
          </p>
        </div>
        <div className="relative max-w-[450px] max-h-[470px]">
          <div className="relative rounded-2xl overflow-hidden">
            <Image
              src="/showcase.png"
              alt="AI Transformation Showcase"
              width={450}
              height={470}
              className="h-auto w-auto"
            />
          </div>
        </div>
      </div>

      {/* Diverse Headshot Styles */}
      <div className="flex flex-col lg:flex-row-reverse justify-center items-center gap-10 lg:gap-32">
        <div className="space-y-6 lg:max-w-[566px] text-left">
          <h2 className="text-2xl md:text-4xl font-bold text-[#538CE8]">
            Diverse Headshot Styles <br /> for Your Brand
          </h2>
          <p className="text-base sm:text-lg text-[#949494] leading-relaxed">
            Whether you&apos;re going for a formal or creative look, we&apos;ve
            got options for both! Choose from various LinkedIn headshot styles
            that convey different messages. The generated profile images vary in
            clothing, body language, posing, facial expressions, and personal
            styles. Capture authentic shots that align with your personal brand.
            Stay true to yourself, and let AI bring out your unique personality.
          </p>
        </div>
        <div className="relative max-w-[450px] max-h-[470px]">
          <div className="relative rounded-2xl overflow-hidden">
            <Image
              src="/img2.png"
              alt="AI Transformation Showcase"
              width={450}
              height={470}
              className="h-auto w-auto"
            />
          </div>
        </div>
      </div>

      {/* High-Quality Results */}
      <div className="flex flex-col lg:flex-row justify-center items-center gap-10 lg:gap-32">
        <div className="space-y-6 lg:max-w-[566px] text-left">
          <h2 className="text-2xl md:text-4xl font-bold text-[#538CE8]">
            High-Quality Results
          </h2>
          <p className="text-base sm:text-lg text-[#949494] leading-relaxed">
            The AI headshot generator creates high-resolution, polished images
            perfect for your LinkedIn profile picture. Whether you upload a
            selfie or a formal photo, the AI automatically enhances the
            lighting, clarity, and composition to deliver a professional,
            trustworthy LinkedIn headshot. This ensures you look confident and
            approachable, helping your LinkedIn profile picture stand out and
            make a strong first impression on potential employers or clients.
          </p>
        </div>
        <div className="relative max-w-[450px] max-h-[470px]">
          <div className="relative rounded-2xl overflow-hidden">
            <Image
              src="/img3.png"
              alt="AI Transformation Showcase"
              width={450}
              height={470}
              className="h-auto w-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
