import { HeroHeader } from "@/app/(marketing)/_components/header";
import HeroSection from "@/app/(marketing)/_components/hero-section";

/**
 * Render the marketing Home page containing the hero header and hero section.
 *
 * @returns The React element for the page's root container that includes HeroHeader and HeroSection.
 */
export default function Home() {
  
  return (
    <div>
      {/* <ThemeToggle/> */}
      <HeroHeader/>
      <HeroSection/>
    </div>
  );
}