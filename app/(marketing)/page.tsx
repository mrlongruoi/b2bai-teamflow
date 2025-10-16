import { HeroHeader } from "@/app/(marketing)/_components/header";
import HeroSection from "@/app/(marketing)/_components/hero-section";
/**
 * Renders the marketing home page layout.
 *
 * Composes the HeroHeader and HeroSection components into a top-level container.
 *
 * @returns A JSX element containing the marketing page layout with HeroHeader and HeroSection.
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