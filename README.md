# Mohamed Khaled — Video Editor Portfolio

Dark cinematic Next.js 14 portfolio built with App Router, Tailwind CSS, and Framer Motion.

## Stack

| Tool | Purpose |
|------|---------|
| **Next.js 14** (App Router) | Framework |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Utility-first styling |
| **Framer Motion** | Animations & transitions |
| **next/font** | Optimized Google Fonts |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx        ← Root layout, fonts, metadata
│   ├── page.tsx          ← Entry point, composes all sections
│   └── globals.css       ← CSS variables, base styles, keyframes
├── components/
│   ├── Cursor.tsx        ← Custom animated cursor + ring
│   ├── Navbar.tsx        ← Fixed nav with scroll-aware blur
│   ├── Hero.tsx          ← Full-screen hero with reel card
│   ├── MarqueeBanner.tsx ← Infinite scrolling tool ticker
│   ├── Work.tsx          ← Asymmetric 12-col project grid
│   ├── Services.tsx      ← 2×2 service cards with hover FX
│   ├── About.tsx         ← Split layout with offset accent box
│   ├── Process.tsx       ← 4-step process list
│   ├── Testimonials.tsx  ← 3-col testimonial cards
│   ├── Contact.tsx       ← Contact form with state management
│   ├── Footer.tsx        ← Simple footer
│   └── Reveal.tsx        ← Scroll-triggered animation wrapper
└── lib/
    └── data.ts           ← All portfolio data (edit this!)
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Customization

### 1. Update your data
Edit `src/lib/data.ts` to change projects, services, skills, and testimonials.

### 2. Add real project thumbnails
In `src/components/Work.tsx`, replace the gradient placeholder with `next/image`:
```tsx
import Image from "next/image";
// ...
<Image src="/projects/pulse.jpg" alt="Pulse Brand Film" fill className="object-cover" />
```

### 3. Wire up the contact form
In `src/components/Contact.tsx`, replace the `console.log` in `handleSubmit` with your preferred email service (Resend, EmailJS, Formspree, etc.)

### 4. Update contact info
- Email: `src/components/Contact.tsx` → update `href` and display text
- Social links: `src/components/Contact.tsx` → update `href` values

## Design Tokens

```css
--accent:  #ff3c00   /* Hot orange-red */
--accent2: #ffb800   /* Amber (cursor hover) */
--bg:      #080808   /* Near-black background */
--surface: #111111   /* Card / section background */
--border:  #1e1e1e   /* Subtle borders */
--muted:   #555555   /* Muted text */
```