import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Work from "@/components/sections/Work";
import Stats from "@/components/sections/Stats";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <main id="top">
        <Hero />
        <About />
        <Skills />
        <Work />
        <Stats />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
