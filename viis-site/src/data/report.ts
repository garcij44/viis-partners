/**
 * The published sample report: report 002, the audit of athlonjiujitsu.com
 * dated October 6, 2026. It is the hero artifact (brief §2.1) and the object
 * of the proof section (brief §2.5), so its facts live here once and both
 * render from it.
 *
 * Every statement about the audit is transcribed from the report itself,
 * never derived: the business name as the cover prints it, the count of
 * checks, the tally, the three finding headlines, and each finding's cost
 * line (the first sentence of its "What it costs you" paragraph, verbatim).
 * The page count and file size are properties of the PDF file, decimal
 * kilobytes as Finder reports them. The date is the one printed on the report.
 *
 * Report 002 replaced report 001 (September 12, 2026) because a sent report
 * is frozen: 001 carried the template's old speed wording, so the fix ships
 * as a new dated audit, never a regenerated old one. The 001 PDF redirects
 * here (public/staticwebapp.config.json). Athlon is named with the owner's
 * approval; no other client is named on the site.
 *
 * The PDF is a static file in public/reports/, named by domain and date so
 * a second report for the same site cannot overwrite it.
 */
export interface ReportFinding {
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  title: string;
  /** The first sentence of the report's "What it costs you" paragraph. */
  cost: string;
}

export interface ReportArea {
  label: string;
  /** What the area produced, in the receipt's words: severities, or "None". */
  value: string;
}

export const SAMPLE_REPORT = {
  href: '/reports/viis-audit-athlonjiujitsu.com-2026-10-06.pdf',
  number: '002',
  business: 'Athlon Jiu-Jitsu',
  website: 'athlonjiujitsu.com',
  /** The live site. The receipt links to it: a real client, so the link is
   *  followed on purpose (no nofollow) and the small equity is Athlon's. */
  websiteHref: 'https://athlonjiujitsu.com',
  date: 'October 6, 2026',
  dateIso: '2026-10-06',
  /** Who the subject is to VIIS, stated on the receipt so a reader does not
   *  merge Athlon with the anonymous practice in the outcome beside it. */
  relationship: 'Athlon Jiu-Jitsu is a site VIIS built and maintains. Published with the owner\'s approval.',
  pages: 9,
  sizeKb: 296,
  checks: 15,
  findingCount: 3,
  passed: 12,
  areas: [
    { label: 'Site', value: '1 medium · 1 low' },
    { label: 'Foundation', value: 'None' },
    { label: 'Search', value: 'None' },
    { label: 'Risk', value: '1 low' },
  ] satisfies ReportArea[],
  findings: [
    {
      severity: 'Medium',
      title: 'Your site takes 3.3 seconds to become usable on a phone',
      cost: 'Most visitors arriving from a phone leave before the page finishes rendering.',
    },
    {
      severity: 'Low',
      title: 'Your server reports success for addresses that do not exist',
      cost: 'Search engines and link checkers read the status code rather than the message on the page.',
    },
    {
      severity: 'Low',
      title: 'Your site omits several standard browser protections',
      cost: 'These headers are how a site tells a browser what to refuse: which other sites may embed your pages, and what may load inside them.',
    },
  ] satisfies ReportFinding[],
} as const;

/** One line for link labels and alt text: what the file is, before it opens. */
export const SAMPLE_REPORT_FILE = `PDF · ${SAMPLE_REPORT.pages} pages · ${SAMPLE_REPORT.sizeKb} KB`;
