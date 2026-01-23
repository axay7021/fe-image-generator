import Link from "next/link";
import { Instagram, Linkedin } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-[#333333] text-white md:py-12 py-5 md:mt-20">
      <div className="container mx-auto px-4 md:px-6 max-w-[1392px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 border-b-3 border-[#3D3D3D] md:pb-8 pb-5 md:mb-8 mb-5 items-center">
          <div className="flex items-center gap-2 justify-start">
            <Image
              src="/footerLogo.svg"
              alt="Logo"
              height={40}
              width={40}
              className="h-10 lg:w-full md:w-[200px] w-[150px] object-contain"
            />
          </div>

          <nav className="flex items-center md:justify-center gap-6 md:text-lg text-sm whitespace-nowrap">
            <Link
              href="/privacy-policy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
          </nav>

          <div className="flex items-center md:justify-center gap-4">
            <Link
              href="https://www.instagram.com/softcolon?igsh=ZjJmODdveXU3aTdt"
              className="hover:text-[#538CE8] transition-colors bg-white p-2 rounded-full"
            >
              <Instagram className="md:h-5 md:w-5 h-4 w-4" color="black" />
            </Link>
            {/* <Link
              href="#"
              className="hover:text-[#538CE8] transition-colors bg-white p-2 rounded-full"
            >
              <Twitter className="md:h-5 md:w-5 h-4 w-4" color="black" />
            </Link> */}
            <Link
              href="https://www.linkedin.com/company/softcolon/"
              className="hover:text-[#538CE8] transition-colors bg-white p-2 rounded-full"
            >
              <Linkedin className="md:h-5 md:w-5 h-4 w-4" color="black" />
            </Link>
          </div>
        </div>

        <div className="md:text-center text-sm md:text-lg text-[#BDBDBD]">
          © {new Date().getFullYear()} Softcolon. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
