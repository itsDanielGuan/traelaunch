import Link from "next/link";

export const metadata = {
  title: "Behind the Scenes | SAINT CIRCUIT",
  description:
    "PixVerse + Trae Solo workflow notes for Saint Circuit: Pilgrimage Protocol.",
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
    { href: "#pipeline", label: "Pipeline" },
    { href: "#pixverse", label: "PixVerse" },
    { href: "#trae", label: "Trae Solo" },
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
              wired into an interactive decision flow. PixVerse was used as the
              visual production engine and Trae Solo was used as the creative,
              systems, and implementation partner, so every major stage moved
              through both tools instead of treating either one as a single-use
              add-on.
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
            id="pipeline"
            title="End-to-End Pipeline"
            description="The project was built as one continuous loop between narrative design, asset generation, app implementation, and final documentation. At each stage, Trae Solo shaped structure and PixVerse turned that structure into cinematic output."
          >
            <div className="grid gap-6 lg:grid-cols-2">
              <Card title="1. Brief Consolidation + Scope Lock" eyebrow="Trae Solo + PixVerse">
                Trae Solo helped consolidate the hackathon brief into a practical
                production plan: required screens, branching logic, ending
                system, product reveal structure, and PixVerse-only constraints.
                That planning made it possible to define exactly which clips
                needed to be generated in PixVerse and how they would connect in
                the experience.
              </Card>
              <Card title="2. Worldbuilding + Visual System" eyebrow="Trae Solo + PixVerse">
                Trae Solo translated loose references into a unified visual
                language: cyber-gothic cathedral, rain, sacred machine horror,
                halo logic, material palette, and camera behavior. PixVerse then
                used that locked visual system to produce consistent frames,
                motion, and atmosphere across landing, prologue, consequences,
                endings, and product commercials.
              </Card>
              <Card title="3. Branching Narrative Design" eyebrow="Trae Solo">
                Trae Solo converted the cinematic concept into four decisions,
                three options per decision, hidden score vectors, the Open the
                Gates conditional rule, and deterministic ending resolution. The
                same narrative map became the blueprint for both clip production
                and the in-app state machine.
              </Card>
              <Card title="4. Prompt Bible + Shot Plan" eyebrow="Trae Solo + PixVerse">
                Trae Solo organized prompts into reusable systems: base style,
                negative prompt, continuity anchors, shot objectives, and
                product-specific variations. PixVerse then used those prompt
                packages to generate short, controllable units that could be
                assembled into the final modular library.
              </Card>
              <Card title="5. Generation + Continuity Passes" eyebrow="PixVerse">
                PixVerse handled still references, short cinematic shots,
                consequence clips, ending clips, and hardware reveal clips.
                Where continuity or pacing drifted, PixVerse modification,
                extension, and transition features were used to repair the cut
                without abandoning the established look.
              </Card>
              <Card title="6. Asset Integration + UX Build" eyebrow="Trae Solo">
                Trae Solo was used to wire clip paths into the application,
                structure the experience route, build the codex and
                behind-the-scenes pages, connect decisions to playback, and keep
                the interactive flow aligned with the story logic instead of
                becoming a disconnected video gallery.
              </Card>
              <Card title="7. Debugging + Iteration" eyebrow="Trae Solo + PixVerse">
                Trae Solo accelerated UI debugging, playback fixes, copy
                rewrites, and state-flow corrections. PixVerse supported the
                parallel visual iteration loop by enabling clip replacements,
                refinements, and alternate takes whenever a narrative beat or
                visual continuity issue showed up during implementation.
              </Card>
              <Card title="8. Submission Proof + Write-Up" eyebrow="Trae Solo + PixVerse">
                PixVerse outputs were tracked as the source for final cinematic
                assets, including the model and prompt metadata required by the
                brief. Trae Solo then consolidated those production steps into a
                readable behind-the-scenes narrative and final write-up language
                that explains how the project used both tools across the full
                pipeline.
              </Card>
            </div>
          </Section>

          <Section
            id="pixverse"
            title="PixVerse Workflow"
            description="PixVerse was not used for a single hero clip. It was used repeatedly across previs, style lock, consequence generation, continuity repair, ending production, and product cinematics."
          >
            <div className="grid gap-6 lg:grid-cols-3">
              <Card title="Reference Stills + Mood Lock" eyebrow="Use case 1">
                PixVerse was used to generate anchor imagery for the ruined
                plaza, cathedral exterior, archangel reveal, and sword altar so
                the team could validate tone, silhouette, palette, and sacred
                machine detail before committing to final video generations.
              </Card>
              <Card title="Landing Loop Production" eyebrow="Use case 2">
                PixVerse generated the looping title-screen atmosphere: subtle
                environmental motion, cathedral glow, fog, rain, reflections,
                and premium game-menu mood without requiring a full narrative
                action sequence.
              </Card>
              <Card title="Prologue Generation" eyebrow="Use case 3">
                PixVerse produced the cinematic opening beats that establish the
                plaza, lone pilgrim, dead angel wreckage, cathedral awakening,
                and archangel crash. This turns the worldbuilding brief into a
                premium trailer-like opening that feeds directly into the first
                choice.
              </Card>
              <Card title="Decision Consequence Clips" eyebrow="Use case 4">
                PixVerse was used to create twelve branching consequence clips,
                one for every option across the four decisions. Each clip turns
                a choice into a visible world response, making the experience
                feel reactive instead of text-driven.
              </Card>
              <Card title="Ending Clips" eyebrow="Use case 5">
                PixVerse generated the four final moral outcomes so each score
                path resolves with distinct imagery: collapse, apotheosis,
                corruption spread, or machine mercy. The visuals therefore carry
                the emotional payoff of the hidden scoring system.
              </Card>
              <Card title="Product Reveal Commercials" eyebrow="Use case 6">
                PixVerse was also used as a product cinematography tool. Each
                Relicware reveal behaves like a premium hardware spot with altar
                staging, material glamour shots, rotation, volumetric lighting,
                and palette inheritance from the unlocked ending.
              </Card>
              <Card title="Short-Shot Modularity" eyebrow="Use case 7">
                Instead of relying on long fragile generations, PixVerse was
                used to generate short 6-8 second units. That made it easier to
                preserve motion quality, swap weak shots, and tune pacing while
                keeping the final clips modular for interactive playback.
              </Card>
              <Card title="Continuity Repair" eyebrow="Use case 8">
                When a sequence needed better alignment in timing, camera logic,
                or atmosphere, PixVerse extension, modification, and transition
                workflows kept the cut coherent without resetting the entire
                sequence from scratch.
              </Card>
              <Card title="Compliance + Asset Logging" eyebrow="Use case 9">
                PixVerse model choice, prompt language, and seed/settings are
                part of the final deliverable story, not just backstage notes.
                Logging those details proves the project stayed inside the
                PixVerse-only requirement while preserving a reusable asset trail.
              </Card>
            </div>
          </Section>

          <Section
            id="trae"
            title="Trae Solo Workflow"
            description="Trae Solo was used as the connective system across concepting, structure, prompt writing, implementation, debugging, and documentation, so the cinematic output could function as a real product instead of a loose sequence of clips."
          >
            <div className="grid gap-6 lg:grid-cols-3">
              <Card title="Brief Decomposition" eyebrow="Use case 1">
                Trae Solo was used to unpack the brief into screens, clips,
                routing needs, logic requirements, and ownership boundaries so
                the project could move from idea to executable scope without
                losing the cinematic ambition.
              </Card>
              <Card title="Narrative System Design" eyebrow="Use case 2">
                Trae Solo structured the four-decision branching model, score
                vectors, outcome weights, and product unlock mapping. That work
                turned the story into a deterministic system that developers
                could wire directly into the experience.
              </Card>
              <Card title="Prompt Authoring + Refinement" eyebrow="Use case 3">
                Trae Solo helped draft the prompt bible, unify the style
                vocabulary, expand shot descriptions, define negative prompts,
                and tighten continuity handles. That reduced prompt drift and
                kept generations aligned with the same world logic.
              </Card>
              <Card title="Shot Breakdown Planning" eyebrow="Use case 4">
                Trae Solo broke long deliverables into manageable shot groups:
                prologue beats, 4-5-shot consequence clips, ending payoff beats,
                and 10-15 second product reveals. This made PixVerse generation
                more controllable and made assembly predictable.
              </Card>
              <Card title="Frontend Implementation" eyebrow="Use case 5">
                Trae Solo was used to scaffold and refine the app experience:
                landing page, experience route, ending resolution, content
                screens, navigation, and the connection between state changes
                and media playback.
              </Card>
              <Card title="Video Integration" eyebrow="Use case 6">
                Trae Solo helped map generated assets to the proper stages,
                decision branches, endings, and product reveals so the right
                clip appears at the right narrative moment with minimal manual
                rework.
              </Card>
              <Card title="Debugging + QA" eyebrow="Use case 7">
                Trae Solo accelerated iteration on timing, playback behavior,
                route transitions, state resets, and copy polish. It shortened
                the loop between spotting an issue in the experience and making
                a targeted fix in code or content.
              </Card>
              <Card title="Write-Up Consolidation" eyebrow="Use case 8">
                Trae Solo was used to consolidate the full production story into
                the codex, behind-the-scenes page, and final hackathon write-up,
                making the collaboration between narrative system design and
                PixVerse generation legible to judges.
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
            description="The prompt system was designed so Trae Solo could standardize intent and PixVerse could execute it repeatedly without the project collapsing into mismatched aesthetics."
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
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <Card title="How Trae Solo Helped the Prompt Loop" eyebrow="Workflow">
                Trae Solo consolidated references into reusable prompt language,
                suggested clearer cinematic wording, and kept the project from
                rewriting the visual brief from zero every time a new shot type
                was needed.
              </Card>
              <Card title="How PixVerse Benefited From It" eyebrow="Workflow">
                Because the prompt system was stable, PixVerse generations could
                stay focused on scene variation and motion quality rather than
                re-solving identity, environment, or camera logic on every run.
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
            description="The main gain came from using Trae Solo for structure and iteration while using PixVerse for cinematic execution, creating a feedback loop instead of two disconnected workflows."
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
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <Card title="Trae Solo compressed planning time" eyebrow="Creative ops">
                Narrative structure, prompt systems, implementation tasks, and
                copy consolidation happened faster because Trae Solo could move
                between design reasoning and code reasoning without forcing the
                team to switch tools for every small decision.
              </Card>
              <Card title="PixVerse preserved visual ambition" eyebrow="Production ops">
                The team could keep a premium cinematic target across every
                branch because PixVerse handled both atmospheric world shots and
                product-commercial imagery inside the same visual universe.
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
