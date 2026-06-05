import { useState, useEffect, useRef } from "react";

/* ─── Google Fonts ─────────────────────────────────────────────────────────── */
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap";
document.head.appendChild(fontLink);

/* ─── Global Styles ─────────────────────────────────────────────────────────── */
const globalStyles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --cream:        #F7F4EF;
    --white:        #FFFFFF;
    --ink:          #16160E;
    --muted:        #6B6B60;
    --accent:       #1E3A2F;
    --accent2:      #2C5440;
    --accent-light: #EDF2EF;
    --border:       #E2DDD6;
    --font-display: 'Cormorant Garamond', Georgia, serif;
    --font-body:    'DM Sans', sans-serif;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--cream);
    color: var(--ink);
    font-family: var(--font-body);
    font-weight: 300;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  ::selection { background: var(--accent); color: white; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes slideDown {
    from { height: 0; }
    to   { height: 28vh; }
  }

  .fade-up { animation: fadeUp 0.7s ease forwards; }
  .fade-in { animation: fadeIn 0.6s ease forwards; }
  .delay-1 { animation-delay: 0.10s; opacity: 0; }
  .delay-2 { animation-delay: 0.22s; opacity: 0; }
  .delay-3 { animation-delay: 0.34s; opacity: 0; }
  .delay-4 { animation-delay: 0.46s; opacity: 0; }
  .delay-5 { animation-delay: 0.58s; opacity: 0; }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: var(--cream); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

  .mobile-menu {
    position: fixed; inset: 0; z-index: 99;
    background: var(--cream);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 32px;
    opacity: 0; pointer-events: none;
    transition: opacity 0.25s ease;
  }
  .mobile-menu.open { opacity: 1; pointer-events: all; }
  .mobile-menu a {
    font-family: var(--font-display);
    font-size: clamp(36px, 8vw, 56px);
    font-weight: 300;
    color: var(--ink);
    text-decoration: none;
    letter-spacing: -0.01em;
    transition: color 0.2s;
  }
  .mobile-menu a:hover { color: var(--accent); }

  @media (max-width: 768px) {
    .desktop-nav        { display: none !important; }
    .hamburger          { display: flex !important; }
    .about-grid         { grid-template-columns: 1fr !important; }
    .project-highlights { grid-template-columns: 1fr !important; }
    .hero-buttons       { flex-direction: column !important; align-items: flex-start !important; }
  }
  @media (min-width: 769px) {
    .hamburger { display: none !important; }
  }
`;

/* ─── Data ──────────────────────────────────────────────────────────────────── */
const NAV_LINKS = ["About", "Projects", "Skills", "Contact"];

const PROJECTS = [
  // Update these sample projects with your real work
  {
    id: 1,
    label: "01 — Featured",
    name: "My Gift List",
    tagline: "A gift registry web application that let users create and manage gift registries for any occasion",
    description:
      "A gift registry web application built with Next.js 15 (App Router) and TypeScript. Users can create and manage gift registries for any occasion, share a public link with guests, and track which gifts have been booked — all without requiring guests to register.",
    stack: ["Next.js", "TypeScript", "Laravel", "REST API"],
    highlights: [
      "Working with cors, connecting both the Frontend and Backend together and make them work seamlessly, both in development and production environment",
      "Working with REST API, handling authentication with JWT and managing state to ensure a smooth user experience",
      "Working with email system, implementing email notifications for registry updates and guest interactions",
    ],
    github: "https://github.com/taufiqmahdi/MyGiftList-FE",
    live: "https://my-gift-list-fe.vercel.app",
  },
  {
    id: 2,
    label: "02 — Featured",
    name: "Midtrans Payment Integration",
    tagline:
      "Full-stack payment gateway integration with real-time webhook handling.",
    description:
      "Built a complete payment gateway integration using Midtrans Snap API, with a Go REST backend and a React frontend. The backend handles secure token generation, signature verification, and webhook processing to keep order statuses in sync. The frontend uses a custom React hook to manage the full payment lifecycle — from opening the Snap popup to handling success, pending, and failure states.",
    stack: ["React", "TypeScript", "Go", "Gin", "Midtrans API"],
    highlights: [
      "Implemented SHA-512 signature verification on the webhook handler to prevent spoofed payment notifications",
      "Designed an idempotent /notification endpoint that safely handles Midtrans retry logic without duplicate order updates",
      "Built a reusable useMidtrans custom hook encapsulating the full Snap payment lifecycle with typed callback states",
    ],
    github: "https://github.com/taufiqmahdi/React-Midtrans-Payment",
    // live: "#",
  },
];

const SKILLS = [
  {
    category: "Frontend",
    items: [
      "React",
      "Next.js",
      "TypeScript",
      "React Query",
      "Tailwind CSS",
      "CSS / SCSS",
      "HTML5",
      "Vite",
    ],
  },
  {
    category: "Backend",
    items: [
      "Node.js",
      "Express",
      "Laravel",
      "REST API Design",
      "PostgreSQL",
      "MySQL",
    ],
  },
  {
    category: "Tooling & Practices",
    items: [
      "Git & GitHub",
      "CI / CD",
      "TDD",
      "Open API / Swagger",
      "Agile / Scrum",
    ],
  },
];

/* ─── Hooks ──────────────────────────────────────────────────────────────────── */
function useScrolled(threshold = 40) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [threshold]);
  return scrolled;
}

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ─── Smooth scroll ──────────────────────────────────────────────────────────── */
function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ─── Copy Email Button ──────────────────────────────────────────────────────── */
function CopyEmailButton({ email, style = {} }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement("textarea");
      el.value = email;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: window.innerWidth <= 640 ? "flex-start" : "center",
        gap: 10,
        flexWrap: "wrap",
        flexDirection: window.innerWidth <= 640 ? "column" : "row",
        ...style,
      }}
    >
      {/* Visible email address */}
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 15,
          fontWeight: 400,
          color: "var(--ink)",
          letterSpacing: "0.01em",
          borderBottom: "1px dashed var(--border)",
          paddingBottom: 1,
        }}
      >
        {email}
      </span>

      {/* Copy button */}
      <button
        onClick={handleCopy}
        title="Copy email address"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontFamily: "var(--font-body)",
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: copied ? "var(--accent)" : "var(--muted)",
          background: copied ? "var(--accent-light)" : "#F0EDE7",
          border: `1px solid ${copied ? "var(--accent)" : "var(--border)"}`,
          padding: "6px 12px",
          borderRadius: 2,
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
      >
        {copied ? (
          <>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
            Copied!
          </>
        ) : (
          <>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
            Copy
          </>
        )}
      </button>
    </div>
  );
}

/* ─── Navbar ─────────────────────────────────────────────────────────────────── */
function Navbar({ active }) {
  const scrolled = useScrolled();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (e, id) => {
    e.preventDefault();
    setMenuOpen(false);
    scrollTo(id);
  };

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "0 clamp(20px, 5vw, 72px)",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background:
            scrolled || menuOpen ? "rgba(247,244,239,0.96)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled
            ? "1px solid var(--border)"
            : "1px solid transparent",
          transition: "background 0.35s ease, border-color 0.35s ease",
        }}
      >
        {/* Logo */}
        <a
          href="#hero"
          onClick={(e) => handleNav(e, "hero")}
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              background: "var(--accent)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                color: "white",
                fontFamily: "var(--font-display)",
                fontSize: 15,
                fontWeight: 600,
                lineHeight: 1,
              }}
            >
              T
            </span>
          </div>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 16,
              color: "var(--ink)",
              letterSpacing: "0.01em",
              fontWeight: 400,
            }}
          >
            Muhammad Taufiq Mahdi
          </span>
        </a>

        {/* Desktop links */}
        <div
          className="desktop-nav"
          style={{ display: "flex", gap: 36, alignItems: "center" }}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              onClick={(e) => handleNav(e, link.toLowerCase())}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                fontWeight: 400,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color:
                  active === link.toLowerCase()
                    ? "var(--accent)"
                    : "var(--muted)",
                textDecoration: "none",
                borderBottom:
                  active === link.toLowerCase()
                    ? "1px solid var(--accent)"
                    : "1px solid transparent",
                paddingBottom: 2,
                transition: "color 0.2s, border-color 0.2s",
              }}
              onMouseEnter={(e) => {
                if (active !== link.toLowerCase())
                  e.currentTarget.style.color = "var(--ink)";
              }}
              onMouseLeave={(e) => {
                if (active !== link.toLowerCase())
                  e.currentTarget.style.color = "var(--muted)";
              }}
            >
              {link}
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => handleNav(e, "contact")}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "white",
              background: "var(--accent)",
              padding: "8px 18px",
              borderRadius: 2,
              textDecoration: "none",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--accent2)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "var(--accent)")
            }
          >
            Hire Me
          </a>
        </div>

        {/* Hamburger */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen((o) => !o)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            gap: 5,
            padding: 6,
          }}
          aria-label="Toggle menu"
        >
          <span
            style={{
              display: "block",
              width: 24,
              height: 1.5,
              background: "var(--ink)",
              transition: "transform 0.25s",
              transformOrigin: "center",
              transform: menuOpen
                ? "rotate(45deg) translate(4.5px, 4.5px)"
                : "none",
            }}
          />
          <span
            style={{
              display: "block",
              width: 24,
              height: 1.5,
              background: "var(--ink)",
              transition: "opacity 0.25s",
              opacity: menuOpen ? 0 : 1,
            }}
          />
          <span
            style={{
              display: "block",
              width: 24,
              height: 1.5,
              background: "var(--ink)",
              transition: "transform 0.25s",
              transformOrigin: "center",
              transform: menuOpen
                ? "rotate(-45deg) translate(4.5px, -4.5px)"
                : "none",
            }}
          />
        </button>
      </nav>

      {/* Mobile menu overlay */}
      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        {NAV_LINKS.map((link) => (
          <a
            key={link}
            href={`#${link.toLowerCase()}`}
            onClick={(e) => handleNav(e, link.toLowerCase())}
          >
            {link}
          </a>
        ))}
        <a
          href="#contact"
          onClick={(e) => handleNav(e, "contact")}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            background: "var(--accent)",
            color: "white",
            padding: "12px 32px",
            borderRadius: 2,
            textDecoration: "none",
          }}
        >
          Hire Me
        </a>
      </div>
    </>
  );
}

/* ─── Hero ───────────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section
      id="hero"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "100px clamp(20px, 5vw, 72px) 60px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "18%",
          right: "clamp(24px,8vw,120px)",
          width: 1,
          height: "28vh",
          background: "var(--border)",
          animation: "fadeIn 1.2s ease forwards",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "18%",
          right: "clamp(24px,8vw,120px)",
          width: 1,
          height: 0,
          background: "var(--accent)",
          animation: "slideDown 1.1s 0.4s cubic-bezier(.77,0,.18,1) forwards",
        }}
      />

      <p
        className="fade-up delay-1"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 11,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "var(--accent)",
          marginBottom: 28,
          fontWeight: 500,
        }}
      >
        Full Stack Engineer · 3 Years of Experience
      </p>

      <h1
        className="fade-up delay-2"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(44px, 8vw, 108px)",
          fontWeight: 300,
          lineHeight: 1.0,
          letterSpacing: "-0.02em",
          color: "var(--ink)",
          maxWidth: 900,
          marginBottom: 32,
        }}
      >
        Building interfaces
        <br />
        <em style={{ fontStyle: "italic", color: "var(--accent)" }}>
          people love
        </em>
        <span style={{ color: "var(--border)" }}> — </span>
        <br />
        and systems that scale.
      </h1>

      <p
        className="fade-up delay-3"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "clamp(14px,2vw,16px)",
          fontWeight: 300,
          color: "var(--muted)",
          maxWidth: 480,
          lineHeight: 1.75,
          marginBottom: 48,
        }}
      >
        I craft thoughtful user experiences with React and power them with
        robust Laravel backends — caring deeply about every detail in between.
      </p>

      <div
        className="fade-up delay-4 hero-buttons"
        style={{ display: "flex", gap: 16, flexWrap: "wrap" }}
      >
        <a
          href="#projects"
          onClick={(e) => {
            e.preventDefault();
            scrollTo("projects");
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: "var(--accent)",
            color: "white",
            padding: "14px 30px",
            borderRadius: 2,
            fontFamily: "var(--font-body)",
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            textDecoration: "none",
            transition: "background 0.2s, transform 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--accent2)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--accent)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          View Projects
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
        <a
          href="/resume.pdf"
          download="Muhammad Taufiq Mahdi Resume Template - ATS.pdf"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: "transparent",
            color: "var(--ink)",
            padding: "14px 30px",
            borderRadius: 2,
            fontFamily: "var(--font-body)",
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            textDecoration: "none",
            border: "1px solid var(--border)",
            transition: "border-color 0.2s, transform 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--ink)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Download CV
        </a>
      </div>

      <div
        className="fade-up delay-5"
        style={{
          position: "absolute",
          bottom: 40,
          left: "clamp(20px,5vw,72px)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div style={{ width: 40, height: 1, background: "var(--border)" }} />
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 11,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--muted)",
          }}
        >
          Scroll
        </span>
      </div>
    </section>
  );
}

/* ─── About ──────────────────────────────────────────────────────────────────── */
function About() {
  const [ref, visible] = useInView();
  return (
    <section
      id="about"
      ref={ref}
      style={{
        padding: "clamp(72px,12vh,140px) clamp(20px,5vw,72px)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div
        className="about-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(36px,6vw,100px)",
          alignItems: "start",
        }}
      >
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(24px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 11,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: 20,
              fontWeight: 500,
            }}
          >
            About
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px,5vw,60px)",
              fontWeight: 300,
              lineHeight: 1.1,
              color: "var(--ink)",
            }}
          >
            A developer who lives at the{" "}
            <em style={{ fontStyle: "italic" }}>intersection</em> of design and
            engineering.
          </h2>
        </div>
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(24px)",
            transition: "opacity 0.7s 0.18s ease, transform 0.7s 0.18s ease",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 15,
              fontWeight: 300,
              color: "var(--muted)",
              lineHeight: 1.8,
              marginBottom: 24,
            }}
          >
            I'm Taufiq, a full stack software engineer based in Bandung with 3
            years of professional experience building web products. I enjoy both
            crafting polished user interfaces with React and architecting
            reliable API backends with Laravel — owning a feature end-to-end is
            where I do my best work.
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 15,
              fontWeight: 300,
              color: "var(--muted)",
              lineHeight: 1.8,
              marginBottom: 40,
            }}
          >
            I care about code that reads as well as it runs: clean architecture,
            sensible abstractions, and honest naming.
          </p>
          <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
            {[
              ["3+", "Years of Experience"],
              ["12+", "Projects Shipped"],
              ["2", "Core Tech Stacks"],
            ].map(([num, label]) => (
              <div key={label}>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 40,
                    fontWeight: 300,
                    color: "var(--accent)",
                    lineHeight: 1,
                  }}
                >
                  {num}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 11,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--muted)",
                    marginTop: 6,
                  }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Project Card ───────────────────────────────────────────────────────────── */
function chipStyle(bg, color) {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontFamily: "var(--font-body)",
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color,
    background: bg,
    padding: "7px 13px",
    borderRadius: 2,
    textDecoration: "none",
    transition: "opacity 0.2s",
  };
}

function ProjectCard({ project, index }) {
  const [ref, visible] = useInView(0.08);
  const [hovered, setHovered] = useState(false);
  return (
    <article
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(32px)",
        transition: `opacity 0.7s ${index * 0.12}s ease, transform 0.7s ${index * 0.12}s ease, border-color 0.25s, background 0.25s`,
        border: `1px solid ${hovered ? "var(--accent)" : "var(--border)"}`,
        borderRadius: 4,
        padding: "clamp(24px,4vw,48px)",
        background: hovered ? "#fafaf7" : "var(--white)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: 8,
              fontWeight: 500,
            }}
          >
            {project.label}
          </p>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(26px,3.5vw,44px)",
              fontWeight: 300,
              color: "var(--ink)",
              lineHeight: 1,
            }}
          >
            {project.name}
          </h3>
        </div>
        <div style={{ display: "flex", gap: 10, paddingTop: 4, flexShrink: 0 }}>
          <a href={project.github} style={chipStyle("#E8E4DE", "var(--ink)")}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </a>
          {project.live && (
            <a href={project.live} style={chipStyle("var(--accent)", "white")}>
              Live{" "}
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
              </svg>
            </a>
          )}
        </div>
      </div>
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 17,
          fontStyle: "italic",
          color: "var(--muted)",
          marginBottom: 14,
          lineHeight: 1.5,
        }}
      >
        {project.tagline}
      </p>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 14,
          fontWeight: 300,
          color: "var(--muted)",
          lineHeight: 1.8,
          marginBottom: 28,
        }}
      >
        {project.description}
      </p>
      <ul
        className="project-highlights"
        style={{
          listStyle: "none",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px 24px",
          marginBottom: 28,
        }}
      >
        {project.highlights.map((h) => (
          <li
            key={h}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 13,
              color: "var(--muted)",
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
            }}
          >
            <span
              style={{
                color: "var(--accent)",
                marginTop: 4,
                flexShrink: 0,
                fontSize: 9,
              }}
            >
              ◆
            </span>
            {h}
          </li>
        ))}
      </ul>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {project.stack.map((tech) => (
          <span
            key={tech}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              color: "var(--accent)",
              background: "var(--accent-light)",
              padding: "5px 12px",
              borderRadius: 2,
            }}
          >
            {tech}
          </span>
        ))}
      </div>
    </article>
  );
}

/* ─── Projects Section ───────────────────────────────────────────────────────── */
function Projects() {
  const [ref, visible] = useInView(0.05);
  return (
    <section
      id="projects"
      style={{
        padding: "clamp(72px,12vh,140px) clamp(20px,5vw,72px)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div
        ref={ref}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: 52,
          flexWrap: "wrap",
          gap: 16,
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(20px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 11,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: 12,
              fontWeight: 500,
            }}
          >
            Projects
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px,5vw,60px)",
              fontWeight: 300,
              color: "var(--ink)",
              lineHeight: 1.1,
            }}
          >
            Selected work
          </h2>
        </div>
        <a
          href="https://github.com/taufiqmahdi"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--accent)",
            textDecoration: "none",
            borderBottom: "1px solid var(--accent)",
            paddingBottom: 2,
          }}
        >
          View all on GitHub →
        </a>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}

/* ─── Skills ─────────────────────────────────────────────────────────────────── */
function Skills() {
  const [ref, visible] = useInView();
  return (
    <section
      id="skills"
      ref={ref}
      style={{
        padding: "clamp(72px,12vh,140px) clamp(20px,5vw,72px)",
        borderTop: "1px solid var(--border)",
        background: "var(--white)",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 11,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "var(--accent)",
          marginBottom: 12,
          fontWeight: 500,
          opacity: visible ? 1 : 0,
          transition: "opacity 0.6s",
        }}
      >
        Skills
      </p>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(32px,5vw,60px)",
          fontWeight: 300,
          color: "var(--ink)",
          lineHeight: 1.1,
          marginBottom: 52,
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(20px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        Technologies I work with
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 40,
        }}
      >
        {SKILLS.map((group, gi) => (
          <div
            key={group.category}
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateY(24px)",
              transition: `opacity 0.6s ${gi * 0.12}s ease, transform 0.6s ${gi * 0.12}s ease`,
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--accent)",
                marginBottom: 20,
                fontWeight: 500,
              }}
            >
              {group.category}
            </p>
            <div>
              {group.items.map((skill) => (
                <div
                  key={skill}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 15,
                    fontWeight: 300,
                    color: "var(--ink)",
                    padding: "11px 0",
                    borderBottom: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {skill}
                  <div
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: "var(--border)",
                      flexShrink: 0,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Contact ────────────────────────────────────────────────────────────────── */
const inputStyle = {
  fontFamily: "var(--font-body)",
  fontSize: 14,
  fontWeight: 300,
  color: "var(--ink)",
  background: "var(--white)",
  border: "1px solid var(--border)",
  borderRadius: 2,
  padding: "12px 16px",
  transition: "border-color 0.2s",
  width: "100%",
};

function Contact() {
  const [ref, visible] = useInView();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT;

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
        }),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      id="contact"
      ref={ref}
      style={{
        padding: "clamp(72px,12vh,140px) clamp(20px,5vw,72px)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div style={{ maxWidth: 680 }}>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 11,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--accent)",
            marginBottom: 12,
            fontWeight: 500,
            opacity: visible ? 1 : 0,
            transition: "opacity 0.6s",
          }}
        >
          Contact
        </p>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(32px,5vw,60px)",
            fontWeight: 300,
            color: "var(--ink)",
            lineHeight: 1.1,
            marginBottom: 20,
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(20px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          Let's build something{" "}
          <em style={{ fontStyle: "italic", color: "var(--accent)" }}>
            together.
          </em>
        </h2>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 15,
            fontWeight: 300,
            color: "var(--muted)",
            lineHeight: 1.8,
            marginBottom: 32,
            opacity: visible ? 1 : 0,
            transition: "opacity 0.6s 0.1s",
          }}
        >
          I'm currently open to new opportunities — full-time roles, contract
          projects, and interesting collaborations.
        </p>

        {/* ✅ Visible email + copy button */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
            padding: "16px 20px",
            background: "var(--white)",
            border: "1px solid var(--border)",
            borderRadius: 4,
            marginBottom: 40,
            opacity: visible ? 1 : 0,
            transition: "opacity 0.6s 0.15s",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--muted)"
            strokeWidth="1.5"
          >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          <CopyEmailButton email={"mtaufiqmahdi@yahoo.co.id"} />
        </div>

        {status === "success" ? (
          <div
            style={{
              padding: "32px",
              background: "var(--accent-light)",
              borderRadius: 4,
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 28,
                fontWeight: 300,
                color: "var(--accent)",
                marginBottom: 8,
              }}
            >
              Message received.
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 14,
                color: "var(--muted)",
              }}
            >
              I'll get back to you within 24 hours.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              opacity: visible ? 1 : 0,
              transition: "opacity 0.6s 0.2s",
            }}
          >
            {[
              { key: "name", label: "Your Name", type: "text" },
              { key: "email", label: "Your Email", type: "email" },
            ].map(({ key, label, type }) => (
              <div
                key={key}
                style={{ display: "flex", flexDirection: "column", gap: 8 }}
              >
                <label
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 11,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--muted)",
                  }}
                >
                  {label}
                </label>
                <input
                  type={type}
                  required
                  value={form[key]}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, [key]: e.target.value }))
                  }
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--accent)";
                    e.target.style.outline = "none";
                  }}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
              </div>
            ))}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                }}
              >
                Message
              </label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) =>
                  setForm((p) => ({ ...p, message: e.target.value }))
                }
                style={{ ...inputStyle, resize: "vertical", minHeight: 120 }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--accent)";
                  e.target.style.outline = "none";
                }}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>

            {status === "error" && (
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  color: "#c0392b",
                  background: "#fdf0ed",
                  padding: "10px 14px",
                  borderRadius: 4,
                }}
              >
                Something went wrong. Please try again or email me directly.
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={status === "sending"}
              style={{
                alignSelf: "flex-start",
                fontFamily: "var(--font-body)",
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "white",
                background:
                  status === "sending" ? "var(--muted)" : "var(--accent)",
                padding: "14px 36px",
                borderRadius: 2,
                border: "none",
                cursor: status === "sending" ? "not-allowed" : "pointer",
                transition: "background 0.2s, transform 0.2s",
              }}
              onMouseEnter={(e) => {
                if (status !== "sending") {
                  e.currentTarget.style.background = "var(--accent2)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                if (status !== "sending") {
                  e.currentTarget.style.background = "var(--accent)";
                  e.currentTarget.style.transform = "translateY(0)";
                }
              }}
            >
              {status === "sending" ? "Sending…" : "Send Message →"}
            </button>
          </div>
        )}

        {/* Social links */}
        <div
          style={{
            marginTop: 52,
            display: "flex",
            gap: 32,
            borderTop: "1px solid var(--border)",
            paddingTop: 32,
            flexWrap: "wrap",
          }}
        >
          {[
            ["GitHub", "https://github.com/taufiqmahdi"],
            ["LinkedIn", "https://www.linkedin.com/in/mtaufiqmahdi/"],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 12,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--muted)",
                textDecoration: "none",
                borderBottom: "1px solid transparent",
                paddingBottom: 2,
                transition: "color 0.2s, border-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--accent)";
                e.currentTarget.style.borderBottomColor = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--muted)";
                e.currentTarget.style.borderBottomColor = "transparent";
              }}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ─────────────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer
      style={{
        padding: "24px clamp(20px,5vw,72px)",
        borderTop: "1px solid var(--border)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 12,
          color: "var(--muted)",
          letterSpacing: "0.04em",
        }}
      >
        © {new Date().getFullYear()} Muhammad Taufiq Mahdi · Built with React
      </p>
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 14,
          color: "var(--muted)",
          fontStyle: "italic",
        }}
      >
        Crafted with care, one commit at a time.
      </p>
    </footer>
  );
}

/* ─── App ────────────────────────────────────────────────────────────────────── */
export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const ids = ["hero", "about", "projects", "skills", "contact"];
    const observers = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.25 },
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <>
      <style>{globalStyles}</style>
      <Navbar active={activeSection} />
      <main>
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
