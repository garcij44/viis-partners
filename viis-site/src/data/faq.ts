/**
 * FAQ copy (brief §2.9): the ten questions the brief requires, in its
 * order. One source for the rendered accordion and the FAQPage structured
 * data, so the two cannot drift.
 *
 * PROVISIONAL: every answer is a draft awaiting Jadrin's review, except
 * answer 8, whose figures are the signed SLA's response targets as Jadrin
 * supplied them (2026-09-06) and must not be rounded or restated. Each
 * other claim is kept to what the brief already states (ownership, the
 * plans, the audit, ad spend funded by the client, the no-BAA position)
 * and nothing quotes a price or a result.
 */
export interface FaqItem {
  /** Stable id for the details element and the heading. */
  id: string;
  question: string;
  answer: string;
}

export const faq: FaqItem[] = [
  {
    id: 'cost',
    question: 'What does a website cost?',
    answer:
      'It depends on what needs building and what is broken underneath it, so we quote after the free audit, once we know what actually needs doing. A build is a project, not a plan: design, build, migration, launch, and the foundation work found along the way. You see the scope and the figure before any work starts.',
  },
  {
    id: 'ownership',
    question: 'Do I own the site?',
    answer:
      'Yes. The code, the domain, and the hosting account are yours, in your name: from the start on a new build, or moved into your name as part of the work on a migration. If you leave, you take everything with you and nothing has to be rebuilt.',
  },
  {
    id: 'existing-site',
    question: 'What if I already have a website?',
    answer:
      'Start with the audit. Often the site is fine and the problem is underneath it: email landing in spam, DNS records pointing at an old vendor, a Workspace nobody configured. If the site does need replacing, we rebuild it and move you off any rented platform, and you keep the domain and the content.',
  },
  {
    id: 'outside-san-antonio',
    question: 'Do you work with businesses outside San Antonio?',
    answer:
      'Yes. Nearly all of the work is done remotely, so where you are rarely matters. San Antonio is home, and local businesses have the option of meeting in person.',
  },
  {
    id: 'workspace-365',
    question: 'Do you manage Google Workspace and Microsoft 365?',
    answer:
      'Yes, both. Setup, security settings, shared drives, email authentication, license audits, backups, and access control. Many of the businesses we look at are paying for licenses nobody uses and running on defaults nobody chose.',
  },
  {
    id: 'ads',
    question: 'Do you run ads?',
    answer:
      'Yes, when they make sense for you. We set up and manage search campaigns, along with the tracking that shows whether they are working. Ad spend is paid by you, directly to the platform, and is never marked up through us. We do not promise traffic or results, and we will say so when ads are the wrong place for the money.',
  },
  {
    id: 'after-launch',
    question: 'What happens after launch?',
    answer:
      'The site keeps working because someone is looking after it. Watch covers hosting, monitoring, backups, updates, and break/fix response. Care adds a monthly allowance of changes and management of Google Workspace and Microsoft 365. Growth adds priority response and a quarterly audit and roadmap. Partner adds defined project capacity each month, with VIIS as your technical lead.',
  },
  {
    id: 'response',
    question: 'How fast do you respond when something breaks?',
    answer:
      'You have a named person, not a ticket queue, during business hours: Monday to Friday, 9 to 5 Central, excluding US federal holidays. If the site is down or compromised, we acknowledge within four business hours and work it the same business day until it is restored. Broken lead capture, such as forms not submitting or notifications not arriving, is acknowledged within one business day, and everything else within two business days. This is not a 24/7 on-call arrangement.',
  },
  {
    id: 'accounts',
    question: 'Who owns the domain and hosting accounts?',
    answer:
      'You do. On a new build they are set up in your name and billed to you from the start; on a migration we move them into your name as part of the work. Either way we act as an administrator you can remove at any time, and we will not register anything on your behalf that you cannot take back.',
  },
  {
    id: 'regulated',
    question: 'Do you work with medical or regulated businesses?',
    answer:
      'Yes. What we build for you, the site, the forms, and the systems around them, is designed to keep patient information out of it: forms collect non-clinical contact details only, such as a name, an email address, and a message. That is a deliberate choice. It means no business associate agreement (BAA) is needed between us, and one less thing for you to manage. Anything that would involve patient information is scoped separately, so the boundary is always explicit.',
  },
];

/** schema.org FAQPage for a page head; the text is the visible answer. */
export function faqSchema(items: FaqItem[] = faq): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };
}
