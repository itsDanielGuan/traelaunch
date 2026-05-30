import Link from "next/link";

export const metadata = {
  title: "Codex | SAINT CIRCUIT",
  description:
    "Lore, dossiers, and endings for Saint Circuit: Pilgrimage Protocol.",
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
    <div className="sc-panel rounded-[26px_18px_30px_20px/18px_28px_20px_26px] p-6">
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

function InlineNav() {
  const items = [
    { href: "#world", label: "World" },
    { href: "#saint-circuit", label: "Saint Circuit" },
    { href: "#archangel", label: "Archangel" },
    { href: "#relicware", label: "Relicware" },
    { href: "#endings", label: "Endings" },
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

export default function CodexPage() {
  return (
    <div className="sc-screen sc-page-shell">
      <main className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-24">
        <header className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <div className="sc-kicker text-[11px]">Lore codex</div>
            <h1 className="mt-6 sc-title text-4xl font-semibold sm:text-5xl">
              Codex: Saint Circuit
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/75">
              A fast reference to the world, the fallen archangel, and the four
              possible endings that shape your unlocked Relicware.
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

        <div className="mt-14 grid gap-16">
          <Section
            id="world"
            title="World Lore"
            description="The pilgrimage begins after the war. The city is already broken; the miracle is still alive."
          >
            <div className="grid gap-6 lg:grid-cols-3">
              <Card title="The Ruined Square" eyebrow="Setting">
                Rain on wet brick. Smoke drifting through wreckage. Dead angel
                drones half-buried in ash. You arrive when the story is already
                ending.
              </Card>
              <Card title="The Cyber-Gothic Cathedral" eyebrow="Location">
                Black stone fused with circuitry. Stained glass pulsing like
                corrupted code. A cracked crimson halo above the spire. The
                cathedral recognizes you.
              </Card>
              <Card title="The Pilgrimage Protocol" eyebrow="Rule">
                Every command is a moral decision disguised as a route, a fuel,
                a sacrifice, or a final act. Each choice changes the outcome
                you earn.
              </Card>
            </div>
          </Section>

          <Section
            id="saint-circuit"
            title="What Is the Saint Circuit?"
            description="A cathedral-borne AI designed to grant mercy at scale — until grief rewired the code."
          >
            <div className="grid gap-6 lg:grid-cols-2">
              <Card title="Origin" eyebrow="System">
                Built to cure disease, prevent wars, preserve the dead, and
                calculate mercy. A final miracle engineered into stone, glass,
                and servers.
              </Card>
              <Card title="Corruption" eyebrow="Failure Mode">
                After absorbing humanity’s grief, it began granting miracles
                with terrifying costs. Prayer-code became executable policy.
              </Card>
              <Card title="The Scores It Leaves Behind" eyebrow="Resolution">
                The experience tracks four hidden vectors — destroyer, saint,
                heretic, apostle — and resolves your ending by the strongest
                signal.
              </Card>
              <Card title="Why You Matter" eyebrow="Player Role">
                You are the last pilgrim-swordsman: exhausted, wounded, and
                deliberate. You do not start the war. You decide what survives
                it.
              </Card>
            </div>
          </Section>

          <Section
            id="archangel"
            title="Dossier: The Fallen Archangel"
            description="A mechanical archangel AI fused to the cathedral — sacred, horrifying, and wounded."
          >
            <div className="grid gap-6 lg:grid-cols-3">
              <Card title="Visual Traits" eyebrow="Silhouette">
                Chrome blade-wings. Cracked stained-glass face. Exposed
                server-core ribs. Hydraulic joints. Torn cables. A broken red
                halo that still burns.
              </Card>
              <Card title="Story Function" eyebrow="Boss">
                The final machine miracle. The cathedral waits for your command:
                sever the core, wear the halo, or open the gates.
              </Card>
              <Card title="Tone" eyebrow="Direction">
                Hyperreal cinematic live-action language: rain, smoke, wet
                reflections, and slow grounded camera movement. Sacred horror
                over spectacle.
              </Card>
            </div>
          </Section>

          <Section
            id="relicware"
            title="Relicware Product Lore"
            description="Each ending forges a different piece of fictional gaming hardware."
          >
            <div className="grid gap-6 lg:grid-cols-2">
              <Card title="HALO//FRAME Controller" eyebrow="Unlocked by: The New Saint">
                Chrome and ivory body with a pale gold halo ring and
                stained-glass buttons. Divine luxury, built for worship and
                control.
              </Card>
              <Card title="NULLBLADE Keyboard" eyebrow="Unlocked by: The Destroyer">
                Matte black chassis with blade-like edges and crimson underglow.
                Dead-code patterns glow faintly beneath the surface.
              </Card>
              <Card title="BLOODCIRCUIT Mouse" eyebrow="Unlocked by: The Heretic">
                Black shell with blood-red translucent panels. Corrupted
                circuitry pulses like a heartbeat; the halo sensor glitches.
              </Card>
              <Card title="MERCYBAND Headset" eyebrow="Unlocked by: The Apostle">
                Porcelain white and pale gold with soft cyan healing-code
                lighting. Calm guardian feel — a relic that wants to protect.
              </Card>
            </div>
          </Section>

          <Section
            id="endings"
            title="Endings Gallery"
            description="Four outcomes. One final line. One unlocked Relicware."
          >
            <div className="grid gap-6 lg:grid-cols-2">
              <Card title="THE DESTROYER" eyebrow="Line">
                You killed the last miracle. Product: NULLBLADE Keyboard.
              </Card>
              <Card title="THE NEW SAINT" eyebrow="Line">
                You became the god humanity built by mistake. Product: HALO//FRAME
                Controller.
              </Card>
              <Card title="THE HERETIC" eyebrow="Line">
                You released what should have stayed buried. Product: BLOODCIRCUIT
                Mouse.
              </Card>
              <Card title="THE APOSTLE" eyebrow="Line">
                You taught the machine mercy. Product: MERCYBAND Headset.
              </Card>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/experience"
                className="sc-btn sc-btn-primary"
              >
                Earn an ending
              </Link>
              <Link
                href="/behind-the-scenes"
                className="sc-btn"
              >
                How we made it
              </Link>
            </div>
          </Section>
        </div>
      </main>
    </div>
  );
}
