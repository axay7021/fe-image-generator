import Image from "next/image";

export function FeatureSection() {
  return (
    <main className="lg:bg-[url('/desc-bg.png')] bg-size-[100%_100%] bg-no-repeat">
      <section className="py-12 xl:py-24 space-y-24 px-4 md:px-6 mx-auto relative container max-w-[1392px]">
        {/* What is AI LinkedIn Photo Generator? - Redesigned Layout */}
        <div className="flex flex-col xl:flex-row-reverse items-center gap-10 xl:gap-0">
          {/* Image Side (Floating, Transparent) */}
          <div className="w-full lg:max-w-[527px] flex justify-center xl:justify-end z-20 xl:-ml-12 xl:-mt-12">
            <div className="relative w-full max-w-[527px] aspect-square xl:aspect-auto xl:h-[527px]">
              <Image
                src="/img1.png"
                alt="AI LinkedIn Photo Generator Showcase"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Text Side (Card with Gradients) */}
          <div className="w-full xl:w-7/12 relative">
            {/* Decorative Gradient Element behind bottom-left */}
            <div className="absolute -left-4 -bottom-4 w-full h-full rounded-[40px] z-0 max-w-[600px] max-h-[348px] hidden lg:block">
              <Image
                src="/bg-section.png"
                alt="bg-section"
                fill
                className="object-cover"
              />
            </div>
            {/* Main Content Card */}
            <div className="w-full rounded-l-[40px] md:p-8 relative z-10 md:bg-linear-to-r from-[#E9F2FF] to-[#FFFFFF]">
              <div className="space-y-6 text-left md:max-w-[585px]">
                <h2 className="text-[28px] md:text-4xl  font-bold text-[#538CE8] leading-tight">
                  What is AI LinkedIn <br className="hidden md:block" /> Photo
                  Generator?
                </h2>
                <p className="text-base sm:text-lg text-[#949494] leading-relaxed">
                  AI LinkedIn Photo Generator is a free online tool that turns a
                  simple selfie into a professional LinkedIn headshot in
                  seconds. It gives you studio-quality results without booking a
                  photographer, making it great for students and job seekers who
                  need a clean, career-ready photo fast. The tool improves
                  lighting, fixes the background, and offers different outfits
                  and poses so your profile looks natural and trustworthy.
                  It&apos;s easy to use, low-cost, and helps your LinkedIn page
                  stand out. If you want more styles, you can also try AI
                  Headshot Generator or AI Anime Generator.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Diverse Headshot Styles */}
        <div className="flex flex-col xl:flex-row items-center gap-10 xl:gap-0">
          {/* Image Side (Floating, Transparent) */}
          <div className="w-full max-w-[527px] flex justify-center xl:justify-start z-20 xl:-mr-12 xl:-mt-12">
            <div className="relative w-full max-w-[527px] aspect-square xl:aspect-auto xl:h-[527px] ">
              <Image
                src="/img2.png"
                alt="Diverse Headshot Styles"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Text Side (Card with Gradients) */}
          <div className="w-full xl:w-7/12 relative">
            {/* Decorative Gradient Element behind bottom-right */}
            <div className="absolute -right-4 -bottom-4 w-full h-full rounded-[40px] z-0 max-w-[600px] max-h-[348px] hidden lg:block">
              <Image
                src="/bg-r-section.png"
                alt="bg-section"
                fill
                className="object-cover"
              />
            </div>

            {/* Main Content Card */}
            <div className="w-full rounded-r-[40px] md:p-8 relative z-10 flex justify-end md:bg-linear-to-l from-[#E9F2FF] to-[#FFFFFF]">
              <div className="space-y-6 text-left md:max-w-[585px]">
                <h2 className="text-[28px] md:text-4xl font-bold text-[#538CE8] leading-tight hidden md:block">
                  Diverse Headshot Styles for <br /> Your Brand
                </h2>
                <h2 className="text-[28px] md:text-4xl font-bold text-[#538CE8] leading-tight md:hidden block">
                  Diverse Headshot Styles <br /> for Your Brand
                </h2>
                <p className="text-base sm:text-lg text-[#949494] leading-relaxed">
                  Whether you&apos;re going for a formal or creative look,
                  we&apos;ve got options for both! Choose from various LinkedIn
                  headshot styles that convey different messages. The generated
                  profile images vary in clothing, body language, posing, facial
                  expressions, and personal styles. Capture authentic shots that
                  align with your personal brand. Stay true to yourself, and let
                  AI bring out your unique personality.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* High-Quality Results */}
        <div className="flex flex-col xl:flex-row-reverse items-center gap-10 xl:gap-0">
          {/* Image Side (Floating, Transparent) */}
          <div className="w-full max-w-[527px] flex justify-center xl:justify-end z-20 xl:-ml-12 xl:-mt-12">
            <div className="relative w-full max-w-[527px] aspect-square xl:aspect-auto xl:h-[527px]">
              <Image
                src="/img3.png"
                alt="High Quality Results"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Text Side (Card with Gradients) */}
          <div className="w-full xl:w-7/12 relative">
            {/* Decorative Gradient Element behind bottom-left */}
            <div className="absolute -left-4 -bottom-4 w-full h-full rounded-[40px] z-0 max-w-[540px] max-h-[310px] hidden lg:block">
              <Image
                src="/bg-section.png"
                alt="bg-section"
                fill
                className="object-cover"
              />
            </div>

            {/* Main Content Card */}
            <div className="w-full rounded-l-[40px] md:p-8 relative z-10  md:bg-linear-to-r from-[#E9F2FF] to-[#FFFFFF]">
              <div className="space-y-6 text-left max-w-[585px]">
                <h2 className="text-[28px] md:text-4xl  font-bold text-[#538CE8] leading-tight">
                  High-Quality Results
                </h2>
                <p className="text-base sm:text-lg text-[#949494] leading-relaxed">
                  The AI headshot generator creates high-resolution, polished
                  images perfect for your LinkedIn profile picture. Whether you
                  upload a selfie or a formal photo, the AI automatically
                  enhances the lighting, clarity, and composition to deliver a
                  professional, trustworthy LinkedIn headshot. This ensures you
                  look confident and approachable, helping your LinkedIn profile
                  picture stand out and make a strong first impression on
                  potential employers or clients.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
