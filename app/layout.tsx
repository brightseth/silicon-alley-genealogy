import type { Metadata } from "next";
import "./globals.css";
import "@coinbase/onchainkit/styles.css"; // V3: OnchainKit styles
import { WalletProvider } from "@/components/web3/WalletProvider";

export const metadata: Metadata = {
  title: "Silicon Alley Genealogy - 30th Anniversary",
  description: "Preserving the stories and connections that built Silicon Alley (1995-1996)",
  openGraph: {
    title: "Silicon Alley Genealogy",
    description: "The definitive genealogy of Silicon Alley pioneers",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <WalletProvider>
        <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center space-x-4 md:space-x-8">
                <a href="/" className="text-xl md:text-2xl font-bold text-silicon-alley-primary">
                  Silicon Alley 30
                </a>
                <div className="flex space-x-3 md:space-x-6 text-sm md:text-base">
                  <a href="/timeline" className="text-gray-700 hover:text-silicon-alley-primary transition">
                    Timeline
                  </a>
                  <a href="/people" className="text-gray-700 hover:text-silicon-alley-primary transition">
                    People
                  </a>
                  <a href="/submit" className="text-gray-700 hover:text-silicon-alley-primary transition whitespace-nowrap">
                    Submit
                  </a>
                  <a href="/vision" className="text-silicon-alley-primary hover:text-silicon-alley-secondary transition whitespace-nowrap font-semibold">
                    V2 →
                  </a>
                </div>
              </div>
              <div>
                <span className="text-xs md:text-sm text-gray-600 whitespace-nowrap">Jan 28-31</span>
              </div>
            </div>
          </div>
        </nav>
        <main>{children}</main>
        <footer className="border-t border-gray-200 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center text-gray-600">
              <p className="text-sm">
                Silicon Alley 30th Anniversary | January 1995 - January 2025
              </p>
              <p className="text-xs mt-2">
                Built with ❤️ by the community
              </p>
            </div>
          </div>
        </footer>
        </WalletProvider>
      </body>
    </html>
  );
}
