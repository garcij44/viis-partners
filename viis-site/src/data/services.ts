/**
 * Service-page copy (brief §3): one entry per service line, rendered by
 * src/layouts/ServicePage.astro. Every string here is new copy and is
 * PROVISIONAL pending Jadrin's review. Voice per brief §5: plain, concrete,
 * no banned words, no performance claims, no invented results, no client
 * named. Foundations carries the reframe's argument and extends it rather
 * than restating it. American spelling throughout.
 */
import type { FaqItem } from './faq';
import { AUDIT_POINT_COUNT } from './audit';

export interface Step {
  title: string;
  text: string;
}

export interface Inclusion {
  name: string;
  text: string;
  /** Optional trailing link, used where a plan name needs its definition. */
  link?: { label: string; href: string };
}

export interface Service {
  /** URL slug and page id. */
  slug: 'websites' | 'foundations' | 'search' | 'automation';
  /** Mono label above the h1, numbered like the capability row. */
  label: string;
  /** <title> — distinct per page, never a template. */
  title: string;
  /** Meta description — distinct per page, under 160 characters. */
  description: string;
  heading: string;
  sub: string;
  problem: {
    eyebrow: string;
    heading: string;
    body: string;
    close: string;
    findings: string[];
  };
  includedHeading: string;
  included: Inclusion[];
  practiceHeading: string;
  practice: Step[];
  faq: FaqItem[];
}

const plans = { label: 'See the plans.', href: '/#packages' };

export const services: Service[] = [
  {
    slug: 'websites',
    label: '01 · Websites',
    title: 'Website design and build in San Antonio | VIIS Partners',
    description: `Fast, accessible websites built on Astro and deployed to hosting in your name. Design, build, migration off rented platforms, and launch. Free ${AUDIT_POINT_COUNT}-point audit.`,
    heading: 'A website you own outright.',
    sub: 'Design, build, and launch on Astro, deployed to infrastructure in your name. Migration off rented platforms. You keep the code, the domain, and the hosting account, and someone stays on to keep it working.',
    problem: {
      eyebrow: 'The arrangement',
      heading: 'Most small-business sites are rented, not owned.',
      body: 'A site on a bundled vendor or a template platform is easy to start and hard to leave. The vendor holds the domain, the hosting, and sometimes the content. When the replies stop, you have a site you cannot move and a bill you cannot stop. The site itself is often fine. The arrangement is the problem.',
      close: 'We build it so that you could leave us and take everything.',
      findings: [
        'Domain registered to the vendor',
        'Hosting you cannot log in to',
        'A template you cannot export',
        'Slow pages on a shared platform',
        'Analytics nobody set up, or nobody reads',
        'Replies that stopped after launch',
      ],
    },
    includedHeading: 'What a build includes.',
    included: [
      { name: 'Design', text: "Layout, type, and copy direction on the site's own design system, not a template." },
      { name: 'Build', text: 'Astro, static output, accessible by default, no page builder to outgrow.' },
      { name: 'Migration', text: 'Content, domain, and email moved off the rented platform, with the cutover planned so nothing goes dark.' },
      { name: 'Launch', text: 'DNS, SSL, redirects from every old address, Search Console, and analytics configured before the switch.' },
      { name: 'Ownership', text: 'Code in your repository, hosting in your account, domain in your name.' },
      { name: 'After launch', text: 'Watch, Care, Growth, or Partner, depending on what is behind the site.', link: plans },
    ],
    practiceHeading: 'How a build runs.',
    practice: [
      { title: 'Audit first', text: 'We run the free audit before quoting, so the scope covers what is actually broken, not only what is visible.' },
      { title: 'Build in the open', text: 'You see the site as it takes shape on a preview link, and sign off on a real thing rather than a mock-up.' },
      { title: 'Launch and hand over', text: 'Cutover on a planned day, every old link redirected, accounts in your name, and a written note of where everything lives.' },
    ],
    faq: [
      { id: 'timeline', question: 'How long does a build take?', answer: 'It depends on scope, and we tell you before starting. A migration with foundation work found along the way takes longer than a clean build. Either way you see the plan and the date before work starts.' },
      { id: 'editing', question: 'Do I need to learn a page builder?', answer: 'No. Small changes are part of the Care plan and above, and larger ones are scoped as work. The site is built to be maintained by someone who answers, not by you on a weekend.' },
      { id: 'platform', question: 'What do you build on?', answer: 'Astro, static output, deployed to hosting in your account. No page builder, no plugins to update, nothing to outgrow.' },
    ],
  },
  {
    slug: 'foundations',
    label: '02 · Foundations',
    title: 'DNS, email authentication, and Workspace setup | VIIS Partners',
    description:
      'The layer every website depends on: domain, DNS, SPF, DKIM and DMARC, Google Workspace and Microsoft 365, and backups. Audited and fixed, in San Antonio.',
    heading: 'The DNS, email, and Workspace under your website.',
    sub: 'Domain, DNS, email authentication, Google Workspace and Microsoft 365, backups, and access control. Almost nobody maintains it, and it is where most of the problems we find actually live.',
    problem: {
      eyebrow: 'Underneath the website',
      heading: 'The website gets blamed. The foundation is at fault.',
      body: 'The foundation was set up once, by whoever was around, and never looked at again. A web designer added the DNS records. An office manager created the Workspace. A vendor took the domain into its own account to make hosting easier, and kept it. Each of them did one thing and moved on, and nobody owns the whole. That is why invoices land in spam, and why fixing it takes a phone call to three people who have all left.',
      close: 'We map the whole layer, fix it in order of cost, and hand it back to you written down.',
      findings: [
        'Domain held by a former vendor',
        'DNS records nobody can explain',
        'Mail routed through a dead provider',
        'Workspace admin on a personal account',
        'Licenses for people who left',
        'A backup nobody has restored',
      ],
    },
    includedHeading: 'What we fix, and what we keep watching.',
    included: [
      { name: 'Domain and DNS', text: 'Registrar in your name, records cleaned up, nothing pointing at a vendor you left.' },
      { name: 'Email authentication', text: 'SPF, DKIM, and DMARC set up and monitored, so mail from your domain arrives.' },
      { name: 'Google Workspace and Microsoft 365', text: 'Security settings, shared drives, groups, and a license audit against who actually works there.' },
      { name: 'Backups', text: 'Site, mail, and files backed up on a schedule, with a restore that has been tested.' },
      { name: 'Access control', text: 'Who has admin on what, written down, with MFA on every account that matters and former vendors removed.' },
      { name: 'Monitoring', text: 'DNS and SSL watched on every plan. Email authentication and automation health checked on Care and above.', link: plans },
    ],
    practiceHeading: 'How the foundation work runs.',
    practice: [
      { title: 'Map what exists', text: 'Every domain, record, account, and license, and who holds the keys to each. Most businesses have never seen this list.' },
      { title: 'Fix in order of cost', text: 'Email that is not arriving comes before a license that is wasting money, which comes before tidying. You see the order and the reason.' },
      { title: 'Write it down and watch it', text: 'A record of where everything lives and who can change it, then monitoring so it stays fixed.' },
    ],
    faq: [
      { id: 'spam', question: 'Why is my email going to spam?', answer: 'Usually because your domain has no SPF, DKIM, or DMARC records, or they were set up for a mail service you no longer use. Receiving servers cannot tell your mail from a forgery, so they file it as one. It is a fix, not a rebuild, once someone looks.' },
      { id: 'it-person', question: 'We already have an IT person. Why does this matter?', answer: "It often does not overlap. IT keeps laptops and networks running; this is the domain, the mail, and the accounts a website depends on, and it is usually nobody's job. We work alongside whoever you have." },
      { id: 'tenants', question: 'What do you do inside Google Workspace and Microsoft 365?', answer: 'Setup, security settings, shared drives, license audits, backups, and access control, in either one or both. Ongoing management is part of the Care plan and above.' },
    ],
  },
  {
    slug: 'search',
    label: '03 · Search',
    title: 'Local search and technical SEO in San Antonio | VIIS Partners',
    description:
      'Technical SEO, local search, Google Business Profile, conversion tracking, and content that answers real questions. San Antonio. You fund any ads directly.',
    heading: 'Get found for what people actually type.',
    sub: 'Technical SEO, local search, Google Business Profile, analytics and conversion tracking, and content that answers real questions. You fund any campaigns directly; we run the work and show you what it did.',
    problem: {
      eyebrow: 'Why nobody finds you',
      heading: 'Most local sites are invisible for reasons nobody checked.',
      body: 'An unclaimed Business Profile with the wrong hours on it. Pages with no titles, or the same title on every page. No tracking, so nobody knows which inquiries came from where. A blog written for a machine and read by no one. None of it needs a bigger budget. It needs someone to look.',
      close: 'We do the plumbing first, then the content.',
      findings: [
        'Unclaimed Business Profile',
        'Duplicate or missing page titles',
        'No conversion tracking',
        'Slow pages on mobile',
        'Schema missing or wrong',
        'Content that answers nothing',
      ],
    },
    includedHeading: 'What the search work includes.',
    included: [
      { name: 'Technical SEO', text: 'Titles, metadata, structured data, sitemaps, indexability, and speed, fixed at the source.' },
      { name: 'Local search', text: 'Google Business Profile claimed, completed, and kept accurate, with the categories and service area right.' },
      { name: 'Analytics and tracking', text: "GA4 and Search Console set up, with form submissions and calls from the site's phone link tracked, so you can see what worked." },
      { name: 'Content', text: 'Pages and posts written for the questions your customers actually ask, in your voice, reviewed by you.' },
      { name: 'Campaigns', text: 'When ads make sense, we set up and run them. Spend goes from you to the platform, never through us.' },
      { name: 'Reporting', text: 'A plain-language report on what changed and what it did, not a dashboard you need training for.' },
    ],
    practiceHeading: 'How the search work runs.',
    practice: [
      { title: 'Fix the plumbing', text: 'Indexability, titles, schema, speed, and the Business Profile, before a word of new content.' },
      { title: 'Track before spending', text: 'Conversion tracking on the form and the phone link, so every later decision has numbers behind it.' },
      { title: 'Publish what people ask', text: 'Content built from real questions, in your voice, on a schedule you can keep up.' },
    ],
    faq: [
      { id: 'guarantee', question: 'Do you guarantee rankings?', answer: 'No. Nobody can, and we would rather say so. We fix what stops a site from ranking, track what happens, and tell you plainly. The work is the promise, not a position.' },
      { id: 'ads', question: 'Should I run ads?', answer: 'Only once the site can convert the traffic and the tracking can prove it. Before that, ads buy visits you cannot measure. Once both are in place, we set up and manage campaigns, and you pay the platform directly.' },
      { id: 'content', question: 'How does content work?', answer: 'We draft from the questions your customers ask, you correct anything that is not how you would say it, and it goes out under your name. Nothing is published that you have not read.' },
    ],
  },
  {
    slug: 'automation',
    label: '04 · Automation',
    title: 'Lead capture, follow-up, and business automation | VIIS Partners',
    description:
      'Lead capture and routing, follow-up, reporting, and AI-assisted workflows built on the tools you already pay for. San Antonio technology consulting.',
    heading: 'Automate the work that eats your week.',
    sub: 'Lead capture and routing, follow-up, reporting, and AI-assisted workflows, built on the tools you already pay for. Nothing new to buy, and nothing that runs without someone watching it.',
    problem: {
      eyebrow: 'Where the week goes',
      heading: 'The inquiry came in. Then it sat there.',
      body: 'A form that emails one inbox. A spreadsheet someone updates on Fridays. A follow-up that depends on remembering. Most of the repetitive work in a small business is not hard; it is unowned, so it happens late or not at all. The tools to fix it are usually already inside the Workspace or the Microsoft 365 you pay for.',
      close: 'We wire what you already have, so the work happens the same way every time.',
      findings: [
        'Form sends to one inbox',
        'Follow-up that depends on memory',
        'Reports assembled by hand',
        'Data re-typed between tools',
        'Automation features paid for and never turned on',
        'A workflow only one person understands',
      ],
    },
    includedHeading: 'What we build and keep running.',
    included: [
      { name: 'Lead capture and routing', text: 'Every inquiry logged, acknowledged at once, and sent to the right person, with a notification you will actually see.' },
      { name: 'Follow-up', text: 'Sequences that go out on time and stop the moment someone replies.' },
      { name: 'Reporting', text: 'The numbers you check each week, assembled for you from the systems that hold them.' },
      { name: 'AI-assisted workflows', text: 'Drafting, sorting, and summarizing where it saves real time, with a person deciding, never the model alone.' },
      { name: 'Built on your stack', text: 'Workspace, Microsoft 365, and the tools you already pay for, not a new subscription.' },
      { name: 'Maintenance', text: 'Health checks and fixes as part of the Care plan and above, because automations break when the things around them change.', link: plans },
    ],
    practiceHeading: 'How an automation project runs.',
    practice: [
      { title: 'Find the repeat', text: 'We look for the tasks that happen the same way every week and cost someone real time each time.' },
      { title: 'Wire it, then watch it', text: 'Built on your existing tools, tested with real data, and monitored, because an automation that fails silently is worse than none.' },
      { title: 'Hand it over', text: 'Written down in plain language: what it does, what it touches, and what to do when it stops.' },
    ],
    faq: [
      { id: 'software', question: 'Do I need to buy new software?', answer: 'Usually not. Most of what we build runs on Google Workspace, Microsoft 365, and the tools you already have. If something is genuinely missing, we say so and you buy it in your name.' },
      { id: 'ai', question: 'What about AI?', answer: 'Useful for drafting, sorting, and summarizing, and we use it where it saves real time. A person still decides. We do not put a model in front of your customers without you knowing exactly what it can say.' },
      { id: 'breaks', question: 'What happens when an automation breaks?', answer: 'It gets fixed by the person who built it. Health checks are part of the Care plan and above, and every automation is documented, so it is not a mystery to anyone.' },
    ],
  },
];

export const serviceBySlug = (slug: Service['slug']): Service => {
  const found = services.find((s) => s.slug === slug);
  if (!found) throw new Error(`services: no entry for "${slug}"`);
  return found;
};
