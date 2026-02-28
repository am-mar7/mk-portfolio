export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-(--border) px-5 py-6 flex flex-col items-center gap-2 text-center md:flex-row md:justify-between md:px-12 md:py-8">
      <p className="font-mono text-[10px] tracking-[2px] uppercase text-(--muted)">
        © {year} Mohamed Khaled · All rights reserved
      </p>
      <p className="font-mono text-[10px] tracking-[2px] uppercase text-(--muted)">
        Video Editor · Egypt
      </p>
    </footer>
  );
}