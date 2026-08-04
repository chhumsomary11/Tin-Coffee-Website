//Purpose: Act as home that brings in other components. Homepage.tsx

import HeroSection from "@/components/home/HeroSection";
import MenuPreview from "@/components/home/MenuPreview";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <HeroSection />
      <MenuPreview />
    </div>
  );
}
