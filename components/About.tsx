import Reveal from "@/components/Reveal";
import { skills } from "@/lib/data";

export default function About() {
  return (
    <section id="about" className="px-5 py-16 md:px-12 md:py-28">
      <Reveal>
        {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
        <p className="font-mono text-[10px] tracking-[4px] uppercase text-(--accent) mb-4">
          // About Me
        </p>
        <h2
          className="font-display leading-[0.93] mb-6 md:mb-8"
          style={{ fontSize: "clamp(38px, 7vw, 66px)" }}
        >
          THE EDITOR
          <br />
          <span className="text-(--accent)">BEHIND</span>
          <br />
          THE LENS
        </h2>

        <p className="text-[14px] leading-[1.9] text-(--muted) mb-5 max-w-2xl md:text-[15px] md:mb-6">
          Hi, I&apos;m Mohamed Khaled — a video editor based in Egypt with a deep passion for
          visual storytelling. In my first year of professional editing, I&apos;ve rapidly
          developed a signature style that blends precise technical execution with raw creative
          instinct.
        </p>
        <p className="text-[14px] leading-[1.9] text-(--muted) mb-8 max-w-2xl md:text-[15px] md:mb-10">
          Every project I take on is a chance to craft something that resonates. Whether
          it&apos;s a brand film, social media reel, or short film — I bring the same obsessive
          attention to rhythm, pacing, and emotion to every single frame.
        </p>

        <div className="grid grid-cols-2 gap-y-3 gap-x-4 max-w-md">
          {skills.map((skill) => (
            <div
              key={skill}
              className="flex items-center gap-2.5 font-mono text-[10px] tracking-[0.5px] text-(--muted) md:text-[11px]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-(--accent) shrink-0" />
              {skill}
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}