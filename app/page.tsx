import Cursor from "@/components/Cursor";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MarqueeBanner from "@/components/MarqueeBanner";
import Work from "@/components/Work"; 
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Services from "@/components/Services";
import About from "@/components/About";
import Process from "@/components/Process";
import { getPublishedProjects } from "@/lib/projects";

export const revalidate = 3600; // revalidate cache every hour (Actions will call revalidatePath anyway for instant updates!)

export default async function Home() {
  const projects = await getPublishedProjects();
  // Project #1 is featured in the Hero; the rest (2…last) go to the Work grid.
  const [featured, ...rest] = projects;

  return (
    <>
      <Cursor />
      <Navbar />
      <main>
        <Hero featured={featured} />
        <MarqueeBanner />
        <Work projects={rest} />
        <Services />
        <About />
        <Process />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}