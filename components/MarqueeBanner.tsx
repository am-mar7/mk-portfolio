import { marqueeTools } from "@/lib/data";

export default function MarqueeBanner() {
  // duplicate for seamless loop
  const items = [...marqueeTools, ...marqueeTools];

  return (
    <div className="border-y border-(--border) py-4 overflow-hidden bg-(--surface)">
      <div className="flex animate-marquee whitespace-nowrap will-change-transform">
        {items.map((tool, i) => (
          <span
            key={i}
            className={`font-display text-[13px] tracking-[4px] uppercase px-8 shrink-0 ${
              i % 2 === 0 ? "text-(--accent)" : "text-(--muted)"
            }`}
          >
            {tool}
            <span className="mx-2 text-(--border)">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}