// Local sample data only. Nothing here comes from DynamoDB or CloudWatch.
const H = 3600 * 1000;
const ago = (h) => new Date(Date.now() - h * H).toISOString();

// [name, email, subject, body, priority, status, hoursAgo]
const raw = [
  ['Priya Raman', 'priya.raman@northwind.io', 'Partnership inquiry for Q4 launch', 'Hi team, we are planning a product launch in Q4 and would love to explore a co-marketing partnership. Could we schedule a 30-minute call next week to discuss scope and timelines? Happy to share our deck beforehand.', 'high', 'new', 1.5],
  ['Marcus Bell', 'marcus@bellandsons.com', 'Invoice #4821 shows the wrong amount', 'The invoice we received yesterday lists 12 seats but we only subscribed to 8. Please send a corrected invoice so our finance team can process it before month end.', 'high', 'new', 4],
  ['Elena Petrova', 'elena.p@studiofold.design', 'Question about API rate limits', 'We are integrating your service into a small internal tool. Is there a documented limit on requests per minute, and can it be raised for a short migration window?', 'medium', 'in_progress', 9],
  ['Daniel Okafor', 'd.okafor@gmail.com', 'Feature request: export to CSV', 'It would be really helpful to export the message list as CSV. We review submissions weekly in a spreadsheet and copy-pasting is slow.', 'low', 'new', 15],
  ['Sofia Marin', 'sofia@lumenlabs.co', 'Unable to reset my password', 'The reset email arrives but the link says it has expired immediately. I tried three times from two different browsers.', 'high', 'in_progress', 22],
  ['Tom Whitfield', 'tom.whitfield@outlook.com', 'Thanks for the quick support!', 'Just wanted to say thank you. Your team resolved our onboarding issue within an hour. Really appreciated the clear instructions.', 'low', 'resolved', 30],
  ['Aisha Khan', 'aisha.khan@brightpath.edu', 'Student discount availability', 'Our computer science department is considering CloudInbox for a class project. Do you offer educational pricing for groups of about 40 students?', 'medium', 'in_progress', 41],
  ['Lucas Ferreira', 'lucas@ferreira.dev', 'Security disclosure: exposed header', 'While testing I noticed a verbose server header on one of your staging endpoints. Not critical, but you may want to review it. Happy to share details privately.', 'high', 'new', 52],
  ['Hannah Schultz', 'h.schultz@kleinwerk.de', 'Data residency requirements', 'We operate in the EU and need to confirm where message data is stored. Could you share your data processing documentation?', 'medium', 'in_progress', 66],
  ['Ravi Menon', 'ravi.menon@zenstack.in', 'Webhook delivery delays', 'Over the last two days webhook notifications have arrived 5 to 10 minutes late. Is there a known incident or should we adjust our retry settings?', 'medium', 'new', 80],
  ['Chloe Dubois', 'chloe@atelierdubois.fr', 'Request for a product demo', 'We run a small design agency and would like a walkthrough of the dashboard, especially the filtering and team notes.', 'low', 'resolved', 96],
  ['Omar Haddad', 'omar.haddad@cedarcap.com', 'Contract renewal terms', 'Our annual agreement renews next month. Could you send the updated terms and confirm whether the current pricing tier is locked in?', 'high', 'in_progress', 110],
  ['Grace Liu', 'grace.liu@hey.com', 'Typo on the pricing page', 'On the pricing page the Team plan says "unlimitd" users. Small thing but thought you would want to know.', 'low', 'resolved', 130],
  ['Ethan Brooks', 'ethan@brooksfit.co', 'Cannot upload attachment over 5 MB', 'When I attach a PDF larger than 5 MB the form shows a generic error. Is there a file size limit I should know about?', 'medium', 'resolved', 150],
  ['Mei Tanaka', 'mei.tanaka@sakurawave.jp', 'Localization: Japanese support', 'Are there plans to support Japanese in the admin interface? Several of our teammates would benefit from it.', 'low', 'new', 175],
  ['Jonas Lindqvist', 'jonas@lindqvist.se', 'Account access for new team member', 'Please add a new colleague to our workspace with read-only permissions. Her work email is below in the signature.', 'medium', 'resolved', 200],
  ['Nadia Rahman', 'nadia.rahman@civicworks.org', 'Accessibility audit feedback', 'We ran an accessibility review on your contact form and found two contrast issues in the error messages. Report attached on request.', 'medium', 'new', 230],
  ['Victor Alvarez', 'victor@alvarezlogistics.mx', 'Outage on Tuesday morning', 'Our team could not load the dashboard for roughly 20 minutes on Tuesday. Could you share a short summary of what happened?', 'high', 'resolved', 260],
];

export const seedMessages = raw.map(([name, email, subject, body, priority, status, h], i) => ({
  id: `msg_${String(i + 1).padStart(3, '0')}`,
  name, email, subject, body, priority, status,
  receivedAt: ago(h),
  notes: status === 'in_progress'
    ? [{ id: `n_${i}`, author: 'Alex Morgan', text: 'Looking into this, will reply by end of day.', createdAt: ago(Math.max(h - 2, 0.5)) }]
    : [],
}));

// Clearly labeled sample figures for the analytics page.
export const sampleVolume = [6, 9, 7, 12, 10, 4, 3, 8, 11, 13, 9, 14, 6, 5].map((count, i) => {
  const d = new Date(Date.now() - (13 - i) * 24 * H);
  return { day: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), count };
});
export const sampleResponseTimes = { firstResponse: '2h 14m', median: '1h 48m', p90: '6h 05m', resolutionRate: '68%' };
