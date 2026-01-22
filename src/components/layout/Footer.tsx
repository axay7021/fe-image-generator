import Link from "next/link";
import { Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#333333] text-white md:py-12 py-5 md:mt-20">
      <div className="container mx-auto px-4 md:px-6 max-w-[1392px]">
        <div className="flex flex-col md:flex-row justify-between md:items-center md:gap-8 gap-5 border-b-3 border-[#3D3D3D] md:pb-8 pb-5 md:mb-8 mb-5">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl flex items-center gap-2">
              <span className="bg-[#538CE8] p-1 rounded-sm">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                </svg>
              </span>
              LOGOIPSUM
            </span>
          </div>

          <nav className="flex items-center gap-6 md:text-lg text-sm">
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

          <div className="flex items-center gap-4">
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
