import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import HowItWorks from "@/components/home/HowItWorks";
import Pricing from "@/components/home/Pricing";
import Comparison from "@/components/home/Comparison";
import CTABanner from "@/components/home/CTABanner";

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <Comparison />
      <CTABanner />
      <Footer />
    </main>
  );
}
