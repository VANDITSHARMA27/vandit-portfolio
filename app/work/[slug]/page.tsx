import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { projects, getProject } from "@/content/projects";
import { site } from "@/content/site";
import { Container } from "@/components/ui/section";
import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.oneLiner,
    openGraph: { title: project.title, description: project.oneLiner },
  };
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const kindLabel = project.kind === "build" ? "Build" : "Case Study";

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6 md:px-8">
          <Link
            href="/"
            className="font-display text-base font-semibold tracking-tight text-foreground"
          >
            Vandit<span className="text-faint">.</span>
          </Link>
          <Link
            href="/#work"
            className="text-sm text-muted transition-colors hover:text-foreground"
          >
            All work
          </Link>
        </div>
      </header>
      <main className="pt-28">
        <Container className="max-w-3xl">
          <Reveal>
            <Link
              href="/#work"
              className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
            >
              <ArrowLeft size={15} /> All work
            </Link>

            <div className="mt-8 flex items-center gap-3">
              <span
                className={
                  project.kind === "build"
                    ? "rounded-full border border-accent-2/30 bg-accent-2/10 px-2.5 py-0.5 font-mono text-[0.68rem] uppercase tracking-wider text-accent-2"
                    : "rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 font-mono text-[0.68rem] uppercase tracking-wider text-accent"
                }
              >
                {kindLabel}
              </span>
              {project.company ? (
                <span className="text-sm text-muted">
                  {project.company}
                  {project.year ? ` · ${project.year}` : ""}
                </span>
              ) : null}
            </div>

            <h1 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              {project.title}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              {project.oneLiner}
            </p>
          </Reveal>

          {project.impact.length > 0 && (
            <Reveal>
              <div className="mt-12 grid grid-cols-2 gap-6 rounded-2xl border border-line bg-surface/50 p-8 sm:grid-cols-3">
                {project.impact.map((m, i) => (
                  <div key={i}>
                    <span className="text-gradient font-display text-4xl font-semibold">
                      <CountUp
                        value={m.value}
                        decimals={m.decimals}
                        prefix={m.prefix}
                        suffix={m.suffix}
                      />
                    </span>
                    <p className="mt-1 text-xs leading-tight text-muted">
                      {m.label}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          )}

          <div className="mt-14 space-y-12">
            <Block title="The problem">
              <p className="text-base leading-relaxed text-foreground/85">
                {project.problem}
              </p>
            </Block>

            <Block title="Approach">
              <ul className="space-y-3">
                {project.approach.map((a, i) => (
                  <li
                    key={i}
                    className="flex gap-3 text-base leading-relaxed text-foreground/85"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {a}
                  </li>
                ))}
              </ul>
            </Block>

            {project.body && project.body.length > 0 && (
              <Block title="In depth">
                <div className="space-y-4">
                  {project.body.map((p, i) => (
                    <p
                      key={i}
                      className="text-base leading-relaxed text-foreground/85"
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </Block>
            )}
          </div>

          <div className="mt-12 flex flex-wrap gap-2">
            {project.tags.map((t) => (
              <span
                key={t}
                className="rounded-md border border-line px-2.5 py-1 font-mono text-xs text-muted"
              >
                {t}
              </span>
            ))}
          </div>

          {project.links && project.links.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3">
              {project.links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-hover inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm"
                >
                  {l.label} <ArrowUpRight size={15} />
                </a>
              ))}
            </div>
          )}

          <div className="mt-16 border-t border-line pt-8">
            <Link
              href="/#contact"
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              Want the full story? <span className="text-accent">Get in touch →</span>
            </Link>
          </div>
          <div className="mt-16 border-t border-line pt-6">
            <span className="eyebrow block text-center">{site.name}</span>
          </div>
        </Container>
      </main>
    </>
  );
}

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal>
      <div>
        <h2 className="eyebrow mb-4">{title}</h2>
        {children}
      </div>
    </Reveal>
  );
}
