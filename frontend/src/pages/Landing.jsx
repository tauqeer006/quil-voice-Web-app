import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Landing.css";

/**
 * quil-voice AI — Landing page
 * "Talk to your documents."
 *
 * A voice agent that answers questions from an organization's own
 * documents (PDF / Word / URL) over a live phone-style call.
 *
 * Sections: Nav → Hero (signature orb) → How it works → Pricing
 * (voice agent purchase) → Contact → Footer.
 */

const CHECK = (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
    <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Fades a section up into view the first time it crosses the viewport. */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("in-view");
          io.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function Reveal({ as: Tag = "div", className = "", children, ...rest }) {
  const ref = useReveal();
  return (
    <Tag ref={ref} className={`reveal ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

export default function Landing() {
  return (
    <div className="quil-voice">
      <div className="grain-bg" aria-hidden="true" />

      {/* ---------------- NAV ---------------- */}
      <nav className="nav">
        <div className="logo">
          <span className="logo-mark" aria-hidden="true" />
          quil-voice AI
        </div>
        <ul className="nav-links">
          <li><a href="#how-it-works">How it works</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <div className="nav-actions">
          <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
          <Link to="/signup" className="btn btn-primary btn-sm">Sign up</Link>
        </div>
      </nav>

      {/* ---------------- HERO ---------------- */}
      <header className="hero">
        <div>
          <span className="eyebrow">Voice agent for your knowledge base</span>
          <h1>
            Talk to your <em>documents.</em>
          </h1>
          <p className="lead">
            Upload PDFs, Word docs, or scrape a URL — then call an AI voice
            agent that answers questions using your organization&rsquo;s own
            knowledge base. No scripts, no hold music, just a straight
            answer, spoken back to you.
          </p>
          <div className="hero-actions">
            <Link to="/signup" className="btn btn-primary">Sign up free</Link>
            <a href="#pricing" className="btn btn-ghost">See pricing</a>
          </div>
          <div className="hero-meta">
            <span>PDF</span><span className="dot">·</span>
            <span>DOCX</span><span className="dot">·</span>
            <span>URL</span><span className="dot">·</span>
            <span>Scanned images</span>
          </div>
        </div>

        <div className="orb-stage">
          <div className="orb-float">
            <div className="orb-ring r1" />
            <div className="orb-ring r2" />
            <div className="orb-ring r3" />
            <div className="orb-core" />
            <div className="orb-bars" aria-hidden="true">
              <span /><span /><span /><span /><span /><span /><span />
            </div>
            <div className="orb-label">listening…</div>
          </div>
        </div>
      </header>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section className="flow" id="how-it-works">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="eyebrow">The call, start to finish</span>
            <h2>Three steps between a document and an answer.</h2>
            <p>
              Everything your agent knows comes from what you give it —
              nothing more, nothing guessed.
            </p>
          </Reveal>

          <Reveal className="flow-grid">
            <div className="flow-card">
              <span className="flow-num">01</span>
              <h3>Upload your knowledge</h3>
              <p>
                Drag in PDFs and Word docs, or point quil-voice AI at a URL. Everything
                is chunked and embedded into a private knowledge base for
                your organization alone.
              </p>
              <div className="doc-lines" aria-hidden="true">
                <span /><span /><span />
              </div>
            </div>

            <div className="flow-card">
              <span className="flow-num">02</span>
              <h3>Call your agent</h3>
              <p>
                Tap to call, the way you&rsquo;d ring a colleague. Speak
                naturally — no keywords, no menus, no waiting on hold.
              </p>
              <div className="call-ring" aria-hidden="true">
                <span className="call-dot" />
              </div>
            </div>

            <div className="flow-card">
              <span className="flow-num">03</span>
              <h3>Hear the answer</h3>
              <p>
                Your agent replies out loud in seconds, grounded only in your
                documents — and says so plainly when it doesn&rsquo;t know.
              </p>
              <div className="wave-mini" aria-hidden="true">
                <span /><span /><span /><span /><span />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- PRICING ---------------- */}
      <section className="pricing" id="pricing">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="eyebrow">Purchase your voice agent</span>
            <h2>Plans priced by the conversation.</h2>
            <p>
              Every plan includes unlimited document uploads. You pay for how
              much your agent talks, not how much it reads.
            </p>
          </Reveal>

          <Reveal className="price-grid">
            <div className="price-card">
              <p className="price-name">Whisper</p>
              <p className="price-sub">For solo testing and small teams</p>
              <div className="price-amount">
                <span className="num">$49</span>
                <span className="per">/ month</span>
              </div>
              <ul className="price-features">
                <li>{CHECK} 500 voice minutes / month</li>
                <li>{CHECK} 1 organization, up to 3 seats</li>
                <li>{CHECK} PDF, DOCX &amp; URL ingestion</li>
                <li>{CHECK} Standard voice, 1 concurrent call</li>
                <li>{CHECK} Email support</li>
              </ul>
              <Link to="/signup" className="btn btn-ghost btn-block">Get started</Link>
            </div>

            <div className="price-card featured">
              <span className="price-tag">Most popular</span>
              <p className="price-name">Dialogue</p>
              <p className="price-sub">For growing teams and customer-facing use</p>
              <div className="price-amount">
                <span className="num">$149</span>
                <span className="per">/ month</span>
              </div>
              <ul className="price-features">
                <li>{CHECK} 2,500 voice minutes / month</li>
                <li>{CHECK} 1 organization, up to 15 seats</li>
                <li>{CHECK} PDF, DOCX, URL &amp; OCR ingestion</li>
                <li>{CHECK} Expressive voice, 5 concurrent calls</li>
                <li>{CHECK} Usage &amp; call transcripts dashboard</li>
                <li>{CHECK} Priority support</li>
              </ul>
              <Link to="/signup" className="btn btn-primary btn-block">Get started</Link>
            </div>

            <div className="price-card">
              <p className="price-name">Symposium</p>
              <p className="price-sub">For multi-org and high-volume deployments</p>
              <div className="price-amount">
                <span className="num">Custom</span>
              </div>
              <ul className="price-features">
                <li>{CHECK} Unlimited voice minutes</li>
                <li>{CHECK} Unlimited organizations &amp; seats</li>
                <li>{CHECK} Dedicated superadmin console</li>
                <li>{CHECK} Custom voice &amp; concurrency limits</li>
                <li>{CHECK} SLA-backed onboarding</li>
                <li>{CHECK} Dedicated account manager</li>
              </ul>
              <a href="#contact" className="btn btn-ghost btn-block">Contact sales</a>
            </div>
          </Reveal>

          <p className="price-note">Credits roll over for 60 days · Cancel anytime · No setup fee</p>
        </div>
      </section>

      {/* ---------------- CONTACT ---------------- */}
      <section id="contact">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="eyebrow">Talk to us</span>
            <h2>Questions before you buy?</h2>
            <p>Reach out directly — a person will get back to you, not a bot.</p>
          </Reveal>

          <Reveal className="contact-grid">
            <a className="contact-card" href="mailto:tauqeerqureshi112@gmail.com">
              <span className="contact-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M3 6.5C3 5.67 3.67 5 4.5 5h15c.83 0 1.5.67 1.5 1.5v11c0 .83-.67 1.5-1.5 1.5h-15A1.5 1.5 0 013 17.5v-11z" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M4 6.5L12 13l8-6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div>
                <p className="contact-label">Email</p>
                <p className="contact-value">tauqeerqureshi112@gmail.com</p>
              </div>
            </a>

            <a className="contact-card" href="tel:03045450049">
              <span className="contact-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1.1.5 1.1 1.1v3.4c0 .6-.5 1.1-1.1 1.1C10.6 21.2 2.8 13.4 2.8 4.1 2.8 3.5 3.3 3 3.9 3h3.4c.6 0 1.1.5 1.1 1.1 0 1.2.2 2.4.6 3.5.1.3 0 .7-.2 1L6.6 10.8z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                </svg>
              </span>
              <div>
                <p className="contact-label">Phone</p>
                <p className="contact-value">0304 5450049</p>
              </div>
            </a>
          </Reveal>
        </div>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer>
        <div className="wrap">
          <div className="footer-top">
            <div>
              <div className="logo">
                <span className="logo-mark" aria-hidden="true" />
                quil-voice AI
              </div>
              <p className="footer-tagline">
                A voice agent that only ever speaks from your organization&rsquo;s
                own documents.
              </p>
            </div>

            <div className="footer-links">
              <div>
                <h4>Product</h4>
                <ul>
                  <li><a href="#how-it-works">How it works</a></li>
                  <li><a href="#pricing">Pricing</a></li>
                </ul>
              </div>
              <div>
                <h4>Account</h4>
                <ul>
                  <li><Link to="/signup">Sign up</Link></li>
                  <li><Link to="/login">Login</Link></li>
                </ul>
              </div>
              <div>
                <h4>Contact</h4>
                <ul>
                  <li><a href="mailto:tauqeerqureshi112@gmail.com">tauqeerqureshi112@gmail.com</a></li>
                  <li><a href="tel:03045450049">0304 5450049</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} quil-voice AI. All rights reserved.</span>
            <span className="footer-credit">
              Built by <a href="mailto:tauqeerqureshi112@gmail.com">Tauqeer Qureshi</a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
