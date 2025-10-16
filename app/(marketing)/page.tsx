import { HeroHeader } from "@/app/(marketing)/_components/header";
import HeroSection from "@/app/(marketing)/_components/hero-section";
// import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Home() {
  
  return (
    <div>
      {/* <ThemeToggle/> */}
      <HeroHeader/>
      <HeroSection/>
    </div>
  );
}
