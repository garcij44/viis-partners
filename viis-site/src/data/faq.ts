/**
 * FAQ copy (brief §2.9): the ten questions the brief requires, in its
 * order. One source for the rendered accordion and the FAQPage structured
 * data, so the two cannot drift.
 *
 * PROVISIONAL: every answer is a draft awaiting Jadrin's review. Each
 * claim is kept to what the brief already states (ownership, packages,
 * the audit, ad spend funded by the client, the no-BAA position) and
 * nothing here quotes a price, a response time, or a result.
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
      'It depends on what needs building and what is broken underneath it, so we quote after the free audit, against what you are paying now. The Build package covers design, build, migration, launch, and the foundation work found along the way. You see the scope and the figure before any work starts.',
  },
  {
    id: 'ownership',
    question: 'Do I own the site?',
    answer:
      'Yes. The code, the domain, and the hosting account are yours, in your name, from the day we start. If you leave, you take everything with you and nothing has to be rebuilt.',
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
      'Yes, both. Setup, security settings, shared drives, email authentication, licence audits, backups, and access control. Many of the businesses we look at are paying for licences nobody uses and running on defaults nobody chose.',
  },
  {
    id: 'ads',
    question: 'Do you run ads?',
    answer:
      'We set up and manage search campaigns when they make sense for you, along with the tracking that shows whether they are working. Ad spend is paid by you, directly to the platform, and is never marked up through us. We do not promise traffic or results, and we will say so when ads are the wrong place for the money.',
  },
  {
    id: 'after-launch',
    question: 'What happens after launch?',
    answer:
      'The site keeps working because someone is looking after it. The Care package covers hosting, monitoring, backups, updates, and small changes, with a named person who answers. Partner adds search, automation, and systems management, with defined project capacity each month.',
  },
  {
    id: 'response',
    question: 'How fast do you respond when something breaks?',
    answer:
      'You have a named person, not a ticket queue. Response targets are written into your Care or Partner agreement, and anything that stops the business, such as the site being down or email not sending, comes first.',
  },
  {
    id: 'accounts',
    question: 'Who owns the domain and hosting accounts?',
    answer:
      'You do. Both are registered in your name and billed to you, and we work as an administrator you can remove at any time. We will not register anything on your behalf that you cannot take back.',
  },
  {
    id: 'regulated',
    question: 'Do you work with medical or regulated businesses?',
    answer:
      'Yes, within clear limits. VIIS builds forms that collect non-clinical contact information only, such as a name, an email address, and a message. We do not handle patient records, so no business associate agreement (BAA) is required between the parties. Systems that store patient data are outside what we build, and we will tell you so.',
  },
];

/** schema.org FAQPage for the homepage head; the text is the visible answer. */
export function faqSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };
}
