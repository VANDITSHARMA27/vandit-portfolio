"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Send, Check, Loader2 } from "lucide-react";
import { site } from "@/content/site";
import { LinkedinIcon } from "@/components/ui/brand-icons";
import { Container } from "@/components/ui/section";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";

type Status = "idle" | "submitting" | "success" | "error";

const RESUME_MESSAGE =
  "Hi Vandit — I'd like to request a copy of your résumé. A bit about the role/opportunity: ";

const PURPOSES = [
  "Job / role opportunity",
  "Freelance / consulting project",
  "Collaboration",
  "Speaking / interview",
  "Just connecting",
  "Other",
];

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    purpose: "",
    message: "",
    company: "",
  });
  const messageRef = useRef<HTMLTextAreaElement>(null);

  // Prefill when "Request résumé" is clicked anywhere on the page.
  useEffect(() => {
    const prefill = () => {
      setForm((f) => ({ ...f, message: f.message || RESUME_MESSAGE }));
      requestAnimationFrame(() => {
        messageRef.current?.focus();
        const len = messageRef.current?.value.length ?? 0;
        messageRef.current?.setSelectionRange(len, len);
      });
    };
    window.addEventListener("request-resume", prefill);
    try {
      if (sessionStorage.getItem("prefill-resume") === "1") {
        sessionStorage.removeItem("prefill-resume");
        prefill();
      }
    } catch {}
    return () => window.removeEventListener("request-resume", prefill);
  }, []);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    // Static site (GitHub Pages) has no server, so open the visitor's mail app
    // with the message pre-filled instead of posting to an API.
    if (form.company) return; // honeypot
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus("error");
      setError("Please fill in your name, email and message.");
      return;
    }
    const subject = `Portfolio: ${form.purpose || "Hello"} — ${form.name}`;
    const body = `${form.message}\n\n— ${form.name} (${form.email})`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    setStatus("success");
    setForm({ name: "", email: "", purpose: "", message: "", company: "" });
  };

  return (
    <section id="contact" className="relative scroll-mt-24 py-24 md:py-32">
      <Container className="grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
        <div>
          <span className="eyebrow flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-accent/60" />
            Contact
          </span>
          <Reveal>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
              Let&apos;s build something{" "}
              <span className="text-gradient">worth learning from.</span>
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
              Open to data engineering and automation roles — immediate joiner,
              willing to relocate. Drop a note and I'll get back to you soon.
            </p>
          </Reveal>

          <div className="mt-8 flex flex-col gap-3">
            <a
              href={`mailto:${site.email}`}
              className="glass glass-hover inline-flex items-center gap-3 rounded-xl p-4 text-sm"
            >
              <Mail size={18} className="text-accent" />
              <span className="text-foreground">{site.email}</span>
            </a>
            <a
              href={site.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="glass glass-hover inline-flex items-center gap-3 rounded-xl p-4 text-sm"
            >
              <LinkedinIcon size={18} className="text-accent" />
              <span className="text-foreground">linkedin.com/in/vanditsharma</span>
            </a>
          </div>
        </div>

        <Reveal>
          <form
            onSubmit={onSubmit}
            className="glass rounded-2xl p-6 md:p-8"
            noValidate
          >
            {/* honeypot */}
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              value={form.company}
              onChange={onChange}
              className="absolute h-0 w-0 overflow-hidden opacity-0"
              aria-hidden
            />

            <div className="grid gap-5">
              <Field label="Name" htmlFor="name">
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  required
                  autoComplete="name"
                  placeholder="Your name"
                  className={inputCls}
                />
              </Field>
              <Field label="Email" htmlFor="email">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  required
                  autoComplete="email"
                  placeholder="you@company.com"
                  className={inputCls}
                />
              </Field>
              <Field label="Purpose" htmlFor="purpose">
                <Combobox
                  id="purpose"
                  name="purpose"
                  options={PURPOSES}
                  value={form.purpose}
                  onChange={(v) => setForm((f) => ({ ...f, purpose: v }))}
                  placeholder="Pick one — or type your own"
                  inputClassName={inputCls}
                />
              </Field>
              <Field label="Message" htmlFor="message">
                <textarea
                  id="message"
                  name="message"
                  ref={messageRef}
                  value={form.message}
                  onChange={onChange}
                  required
                  rows={5}
                  placeholder="What's on your mind?"
                  className={`${inputCls} resize-none`}
                />
              </Field>

              <div className="flex items-center gap-4">
                <Button
                  type="submit"
                  size="lg"
                  disabled={status === "success"}
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Sending…
                    </>
                  ) : status === "success" ? (
                    <>
                      <Check size={16} /> Done
                    </>
                  ) : (
                    <>
                      Send message <Send size={15} />
                    </>
                  )}
                </Button>

                <AnimatePresence mode="wait">
                  {status === "success" && (
                    <motion.span
                      key="ok"
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-sm text-accent-2"
                    >
                      Your email app should open — just hit send.
                    </motion.span>
                  )}
                  {status === "error" && (
                    <motion.span
                      key="err"
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-sm text-red-400"
                    >
                      {error}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </form>
        </Reveal>
      </Container>

      {/* Closing line — replaces a separate footer. */}
      <Container className="mt-16 border-t border-line pt-6">
        <span className="eyebrow block text-center">{site.name}</span>
      </Container>
    </section>
  );
}

const inputCls =
  "w-full rounded-xl border border-line bg-white/[0.02] px-4 py-3 text-sm text-foreground placeholder:text-faint outline-none transition-colors duration-200 focus:border-accent/60 focus:bg-white/[0.03]";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block font-mono text-xs uppercase tracking-wider text-muted"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
