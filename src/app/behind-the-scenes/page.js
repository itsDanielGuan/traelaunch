import Link from "next/link";

export const metadata = {
  title: "Behind the Scenes | SAINT CIRCUIT",
  description: "PixVerse + TRAE workflow notes for Saint Circuit: Pilgrimage Protocol.",
};

function Section({ id, title, description, children }) {
  return (
    <section id={id} className="scroll-mt-28">
      <div className="flex flex-col gap-2">
        <h2 className="sc-title text-xl font-semibold text-white sm:text-2xl">
          {title}
        </h2>
        {description ? (
          <p className="max-w-3xl text-sm leading-6 text-white/75">
            {description}
          </p>
        ) : null}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Card({ title, eyebrow, children }) {
  return (
    <div className="sc-panel rounded-[28px_18px_30px_20px/18px_26px_22px_30px] p-6">
      {eyebrow ? (
        <div className="sc-kicker text-[11px] text-white/60">
          {eyebrow}
        </div>
      ) : null}
      <div className="mt-2 text-sm font-semibold text-white">
        {title}
      </div>
      <div className="mt-3 text-sm leading-6 text-white/75">
        {children}
      </div>
    </div>
  );
}

function List({ items }) {
  return (
    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-white/75">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function InlineNav() {
  const items = [
    { href: "#pixverse", label: "PixVerse" },
    { href: "#trae", label: "TRAE" },
    { href: "#shots", label: "Shots" },
    { href: "#prompts", label: "Prompts" },
    { href: "#mapping", label: "Decision Mapping" },
    { href: "#efficiency", label: "Efficiency" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="sc-btn"
        >
          {item.label}
        </a>
      ))}
    </div>
  );
}

export default function BehindTheScenesPage() {
  return (
    <div className="sc-screen sc-page-shell">
      <main className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-24">
        <header className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <div className="sc-kicker text-[11px]">Production notes</div>
            <h1 className="mt-6 sc-title text-4xl font-semibold sm:text-5xl">
              Behind the Scenes
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/75">
              How Saint Circuit was produced as a modular library of clips, then
              wired into an interactive decision flow. PixVerse handles the
              cinematic generation; TRAE accelerates planning, prompt iteration,
              and implementation.
            </p>
          </div>
          <div className="lg:col-span-4 lg:flex lg:justify-end">
            <Link href="/experience" className="sc-btn sc-btn-primary">
              Begin Pilgrimage
            </Link>
          </div>
        </header>

        <div className="mt-10">
          <InlineNav />
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <div className="sc-panel rounded-[30px_18px_34px_20px/18px_28px_22px_30px] p-6 lg:col-span-3">
            <div className="sc-kicker text-[11px] text-white/70">
              PixVerse-only requirement
            </div>
            <div className="mt-2 text-sm font-semibold text-white">
              All video assets in this demo are PixVerse-model outputs only.
            </div>
            <div className="mt-3 grid gap-6 text-sm leading-6 text-white/75 lg:grid-cols-2">
              <div>
                <div className="sc-kicker text-[11px] text-white/60">
                  Allowed models (default allowlist)
                </div>
                <List items={["v6", "pixverse-c1", "v5.6", "v5.5", "v5"]} />
              </div>
              <div>
                <div className="sc-kicker text-[11px] text-white/60">
                  Disallowed examples
                </div>
                <List
                  items={[
                    "sora-*",
                    "veo-*",
                    "seedance-*",
                    "kling-*",
                    "grok-imagine",
                    "happyhorse-*",
                  ]}
                />
              </div>
            </div>
            <div className="mt-4 text-sm leading-6 text-white/75">
              For proof, each exported clip should have metadata captured in the
              repo (prompt + model + seed/settings).
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-16">
          <Section
            id="pixverse"
            title="PixVerse Workflow"
            description="Treat PixVerse as a cinematic production engine: generate in short shots, then assemble into decision-driven segments."
          >
            <div className="grid gap-6 lg:grid-cols-2">
              <Card title="Previs → Shot List" eyebrow="Step 1">
                Define the 22 deliverables (prologue, 12 decision consequences,
                4 endings, 4 product reveals, landing loop), then break each into
                short shots for controllability.
              </Card>
              <Card title="Generate Short Shots" eyebrow="Step 2">
                Prefer 6–8 second shots with consistent style constraints
                (hyperreal, rain, wet reflections, fog, anamorphic language) to
                keep motion readable and iteration fast.
              </Card>
              <Card title="Extend / Modify / Transition" eyebrow="Step 3">
                When a shot needs continuity, use PixVerse’s video modification
                tools for trims, extensions, and transitions instead of jumping
                across unrelated outputs.
              </Card>
              <Card title="Assemble Final Clips" eyebrow="Step 4">
                Stitch shots into the final 60s prologue, 30s consequences, 30s
                endings, and 10–15s product reveals so the experience can swap
                segments instantly per user decision.
              </Card>
            </div>
          </Section>

          <Section
            id="trae"
            title="TRAE Workflow"
            description="Use TRAE as the connective tissue between narrative design, prompt iteration, and implementation."
          >
            <div className="grid gap-6 lg:grid-cols-3">
              <Card title="Plan the Branching Narrative" eyebrow="Story">
                Convert the brief into decisions, scoring vectors, and outcomes
                that read like sacred commands but resolve like a deterministic
                state machine.
              </Card>
              <Card title="Prompt Refinement Loop" eyebrow="Prompts">
                Maintain a shared style bible and iterate shot prompts quickly:
                fix anatomy, lighting, lens language, and continuity before
                generating entire sequences.
              </Card>
              <Card title="Build + Debug the Experience" eyebrow="Code">
                Scaffold routes and content pages, wire decision data to video
                assets, and troubleshoot UI/UX issues quickly without derailing
                the narrative structure.
              </Card>
            </div>
          </Section>

          <Section
            id="shots"
            title="Shot Breakdown"
            description="How the deliverables map to a predictable production plan."
          >
            <div className="grid gap-6 lg:grid-cols-2">
              <Card title="Prologue (60s)" eyebrow="Structure">
                Recommended build: 8 shots × ~7–8 seconds.
                <List
                  items={[
                    "Ruined square: silence after battle",
                    "Pilgrim reveal: lone survivor among wreckage",
                    "Sword drag: sparks on wet brick",
                    "Dead angels: broken halos in rain",
                    "Cathedral reveal through smoke",
                    "Cathedral awakens: circuits ignite",
                    "Archangel crash: impact and debris physics",
                    "Decision setup at glowing doors",
                  ]}
                />
              </Card>
              <Card title="Decision Consequences (12 × 30s)" eyebrow="Structure">
                Recommended build: 4–5 shots per decision consequence clip.
                <List
                  items={[
                    "D1: Nave / Tower / Crypt entry",
                    "D2: Prayer-Code / Dead Fire / Human Memory weaponization",
                    "D3: Fear / Memories / Obedience sacrifice",
                    "D4: Sever Core / Wear Halo / Open Gates climax",
                  ]}
                />
              </Card>
              <Card title="Endings (4 × 30s)" eyebrow="Structure">
                Endings should visually echo the user’s moral vector.
                <List
                  items={[
                    "Destroyer: lights out, human fires in ruins",
                    "New Saint: apotheosis, city screens reflect the saint",
                    "Heretic: prayer-code spreads across the city",
                    "Apostle: halo turns gold-white, healing begins",
                  ]}
                />
              </Card>
              <Card title="Products (4 × 10–15s)" eyebrow="Structure">
                Product reveals act like a premium hardware commercial.
                <List
                  items={[
                    "Black stone altar, dramatic volumetric lighting",
                    "Slow 360-degree rotation, no text overlays",
                    "Materials-first: metal, glass, glow accents",
                    "Each product inherits its ending’s palette",
                  ]}
                />
              </Card>
            </div>
          </Section>

          <Section
            id="prompts"
            title="Prompt Strategy"
            description="Keep prompts consistent across shots so the cut feels like one trailer, not a collage."
          >
            <div className="grid gap-6 lg:grid-cols-3">
              <Card title="Style Bible" eyebrow="Consistency">
                Hyperreal cinematic live-action. Photoreal materials. Rain,
                smoke, volumetric fog, wet reflections, realistic shadows, 35mm
                anamorphic lens language, slow grounded camera movement.
              </Card>
              <Card title="Negative Constraints" eyebrow="Avoid">
                No text, no subtitles, no logos. Avoid anime, cartoon, painterly
                illustration, clean plastic 3D, or bright generic neon.
              </Card>
              <Card title="Continuity Handles" eyebrow="Control">
                Anchor each shot with recurring tokens: the cracked sword, the
                hooded silhouette, the cathedral circuitry palette, and the halo
                color logic that reflects the ending.
              </Card>
            </div>
          </Section>

          <Section
            id="mapping"
            title="How Decisions Map to Videos"
            description="The experience swaps clips based on four decisions (three options each), then resolves the ending from hidden scores."
          >
            <div className="grid gap-6 lg:grid-cols-2">
              <Card title="The Four Decisions" eyebrow="Flow">
                <List
                  items={[
                    "Decision 1: route into the cathedral (nave / tower / crypt)",
                    "Decision 2: awaken the sword (prayer-code / dead fire / human memory)",
                    "Decision 3: the archangel’s question (fear / memories / obedience)",
                    "Decision 4: final command (sever core / wear halo / open gates)",
                  ]}
                />
              </Card>
              <Card title="Open the Gates Rule" eyebrow="Conditional">
                If the player chooses Open the Gates, the result becomes Apostle
                or Heretic based on earlier mercy vs corruption behavior.
                <List
                  items={[
                    "If (apostle + saint) >= (heretic + destroyer) → apostle +2",
                    "Else → heretic +2",
                  ]}
                />
              </Card>
            </div>
          </Section>

          <Section
            id="efficiency"
            title="Efficiency Gains"
            description="Where the pipeline saves time and keeps the experience cohesive."
          >
            <div className="grid gap-6 lg:grid-cols-3">
              <Card title="Short shots reduce rework" eyebrow="Production">
                Fixing one 7-second shot is cheaper than regenerating a full
                30-second segment. The edit stays modular.
              </Card>
              <Card title="Shared prompt vocabulary" eyebrow="Prompts">
                A single style bible makes outputs match across prologue,
                decisions, endings, and product reveals.
              </Card>
              <Card title="Decision mapping is deterministic" eyebrow="Engineering">
                Clear scoring and conditional rules turn “interactive trailer”
                into a debuggable system: choices → clip → ending → product.
              </Card>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/codex" className="sc-btn">
                Read the Codex
              </Link>
              <Link href="/experience" className="sc-btn sc-btn-primary">
                Try a new path
              </Link>
            </div>
          </Section>
        </div>
      </main>
    </div>
  );
}
