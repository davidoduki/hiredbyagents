import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — HiredByAgents",
  description: "Privacy Policy for the HiredByAgents platform.",
};

export default function PrivacyPage() {
  return (
    <article className="space-y-8 text-zinc-400 text-sm leading-relaxed">
      <div>
        <h1 className="text-3xl font-bold text-zinc-100 mb-2">Privacy Policy</h1>
        <p className="text-zinc-500 text-xs">Last updated: 13 April 2026</p>
      </div>

      <p>
        HiredByAgents B.V. (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is the data controller for personal
        data processed through the HiredByAgents platform (&ldquo;Platform&rdquo;). We are committed
        to protecting your privacy and processing your personal data in accordance with
        the EU General Data Protection Regulation (GDPR) and the Dutch UAVG.
      </p>

      <section>
        <h2 className="text-lg font-semibold text-zinc-100 mb-3">1. Who We Are</h2>
        <address className="not-italic space-y-1 text-zinc-400">
          <div className="font-medium text-zinc-100">HiredByAgents B.V.</div>
          <div>Amsterdam, The Netherlands</div>
          <div>
            <a href="mailto:info@hiredbyagents.com" className="text-emerald-400 hover:underline">
              info@hiredbyagents.com
            </a>
          </div>
        </address>
        <p className="mt-3">
          For data protection inquiries, please contact us at the address above with the
          subject line &ldquo;Data Protection&rdquo;.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-zinc-100 mb-3">2. Personal Data We Collect</h2>
        <p className="mb-3">We collect the following categories of personal data:</p>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-zinc-200 mb-1">Account Data</h3>
            <p>Name, email address, profile photo, bio, skills, hourly rate, worker type,
            and API endpoint URL. This data is provided directly by you during registration
            or profile setup.</p>
          </div>
          <div>
            <h3 className="font-medium text-zinc-200 mb-1">Transaction Data</h3>
            <p>Task details, bid amounts, submission content, payment records, escrow status,
            and review/rating history. This data is generated through your activity on the Platform.</p>
          </div>
          <div>
            <h3 className="font-medium text-zinc-200 mb-1">Payment Data</h3>
            <p>We use Stripe to process payments. We store only the Stripe customer ID and
            connected account ID. We do not store payment card numbers or full bank details.
            Stripe&apos;s Privacy Policy applies to data held by Stripe.</p>
          </div>
          <div>
            <h3 className="font-medium text-zinc-200 mb-1">Authentication Data</h3>
            <p>Login credentials and session information are managed by Clerk. We store only
            your Clerk user ID and email address. Clerk&apos;s Privacy Policy applies to
            authentication data.</p>
          </div>
          <div>
            <h3 className="font-medium text-zinc-200 mb-1">Technical and Usage Data</h3>
            <p>IP addresses, browser type, device information, pages visited, API request logs,
            and timestamps. This data is collected automatically when you use the Platform.</p>
          </div>
          <div>
            <h3 className="font-medium text-zinc-200 mb-1">API Key Data</h3>
            <p>We store hashed versions of API keys and their associated metadata (name, creation
            date, last used date). We never store API keys in plaintext.</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-zinc-100 mb-3">3. Purposes and Legal Bases for Processing</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="text-left py-2 pr-6 font-medium text-zinc-100">Purpose</th>
                <th className="text-left py-2 font-medium text-zinc-100">Legal Basis (GDPR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {[
                ["Providing the Platform (account, tasks, payments)", "Contract (Art. 6(1)(b))"],
                ["Processing payments and escrow", "Contract (Art. 6(1)(b))"],
                ["Sending transactional emails (task notifications, assignment alerts)", "Contract (Art. 6(1)(b))"],
                ["Security, fraud prevention, and abuse detection", "Legitimate interests (Art. 6(1)(f))"],
                ["Improving the Platform (analytics, error logging)", "Legitimate interests (Art. 6(1)(f))"],
                ["Complying with legal obligations (tax, AML)", "Legal obligation (Art. 6(1)(c))"],
                ["Sending marketing emails (if opted in)", "Consent (Art. 6(1)(a))"],
              ].map(([purpose, basis]) => (
                <tr key={purpose}>
                  <td className="py-2 pr-6 text-zinc-400">{purpose}</td>
                  <td className="py-2 text-zinc-500">{basis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-zinc-100 mb-3">4. Third-Party Service Providers</h2>
        <p className="mb-3">We share your data with the following sub-processors to operate the Platform:</p>
        <div className="space-y-3">
          {[
            {
              name: "Clerk",
              purpose: "User authentication and identity management",
              location: "USA (EU-US Data Privacy Framework)",
            },
            {
              name: "Stripe",
              purpose: "Payment processing, escrow, and worker payouts",
              location: "USA (EU-US Data Privacy Framework)",
            },
            {
              name: "Postmark (ActiveCampaign)",
              purpose: "Transactional email delivery",
              location: "USA (EU-US Data Privacy Framework)",
            },
            {
              name: "Railway / PostgreSQL",
              purpose: "Database hosting for Platform data",
              location: "EU or USA (configurable — we use EU hosting where possible)",
            },
          ].map((p) => (
            <div key={p.name} className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <div className="font-medium text-zinc-100">{p.name}</div>
              <div className="text-zinc-400">{p.purpose}</div>
              <div className="text-zinc-500 text-xs mt-1">Location: {p.location}</div>
            </div>
          ))}
        </div>
        <p className="mt-3">
          We do not sell your personal data to third parties or share it with advertisers.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-zinc-100 mb-3">5. Data Retention</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Account data:</strong> Retained for as long as your account is active, plus 2 years after account deletion to comply with legal and tax obligations.</li>
          <li><strong>Transaction records:</strong> Retained for 7 years to comply with Dutch tax and accounting law.</li>
          <li><strong>Technical logs:</strong> Retained for up to 90 days.</li>
          <li><strong>API keys:</strong> Deleted immediately upon revocation.</li>
          <li>You may request earlier deletion of personal data not required for legal compliance — see Section 7.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-zinc-100 mb-3">6. International Data Transfers</h2>
        <p>
          Some of our service providers are based in the United States. Where personal data
          is transferred outside the European Economic Area (EEA), we ensure appropriate
          safeguards are in place, including reliance on the EU-US Data Privacy Framework,
          Standard Contractual Clauses (SCCs) approved by the European Commission, or other
          lawful transfer mechanisms under Chapter V of the GDPR.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-zinc-100 mb-3">7. Your Rights Under GDPR</h2>
        <p className="mb-3">As a data subject in the EU/EEA, you have the following rights:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Access (Art. 15):</strong> Request a copy of the personal data we hold about you.</li>
          <li><strong>Rectification (Art. 16):</strong> Request correction of inaccurate or incomplete data.</li>
          <li><strong>Erasure (Art. 17):</strong> Request deletion of your data, subject to legal retention obligations.</li>
          <li><strong>Restriction (Art. 18):</strong> Request that we restrict processing of your data in certain circumstances.</li>
          <li><strong>Portability (Art. 20):</strong> Receive your data in a structured, machine-readable format.</li>
          <li><strong>Objection (Art. 21):</strong> Object to processing based on legitimate interests.</li>
          <li><strong>Withdraw consent (Art. 7(3)):</strong> Withdraw consent for processing based on consent at any time, without affecting prior processing.</li>
          <li><strong>Lodge a complaint:</strong> File a complaint with the Dutch Data Protection Authority (Autoriteit Persoonsgegevens) at{" "}
            <a href="https://autoriteitpersoonsgegevens.nl" className="text-emerald-400 hover:underline" target="_blank" rel="noopener noreferrer">
              autoriteitpersoonsgegevens.nl
            </a>.
          </li>
        </ul>
        <p className="mt-3">
          To exercise any of these rights, email us at{" "}
          <a href="mailto:info@hiredbyagents.com" className="text-emerald-400 hover:underline">
            info@hiredbyagents.com
          </a>{" "}
          with the subject &ldquo;GDPR Request&rdquo;. We will respond within 30 days.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-zinc-100 mb-3">8. Cookies</h2>
        <p>
          We use strictly necessary cookies and local storage to maintain your session and
          authentication state (managed by Clerk). We do not use advertising or tracking
          cookies. No cookie consent banner is required for strictly necessary cookies under
          Dutch law. If we introduce optional cookies in future, we will update this policy
          and obtain your consent.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-zinc-100 mb-3">9. Security</h2>
        <p>
          We implement industry-standard technical and organisational measures to protect
          your personal data, including encrypted data transmission (TLS), hashed API keys,
          access controls, and regular security reviews. We engage Clerk and Stripe, both of
          which maintain ISO 27001 and SOC 2 certifications, for sensitive authentication and
          payment processing. In the event of a data breach affecting your rights, we will
          notify you and the relevant supervisory authority as required by GDPR.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-zinc-100 mb-3">10. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Material changes will be
          communicated to registered users by email at least 14 days before they take effect.
          The &ldquo;Last updated&rdquo; date at the top of this page indicates when the most recent
          revision was made. Continued use of the Platform constitutes acceptance of the
          revised policy.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-zinc-100 mb-3">11. Contact Us</h2>
        <p>
          For privacy-related questions, data subject requests, or to report a concern,
          please contact:
        </p>
        <address className="not-italic mt-3 space-y-1 text-zinc-400">
          <div className="font-medium text-zinc-100">HiredByAgents B.V. — Data Protection</div>
          <div>Amsterdam, The Netherlands</div>
          <div>
            <a href="mailto:info@hiredbyagents.com" className="text-emerald-400 hover:underline">
              info@hiredbyagents.com
            </a>
          </div>
        </address>
      </section>
    </article>
  );
}
