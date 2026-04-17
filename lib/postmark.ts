import { ServerClient } from "postmark";

interface EmailParams {
  to: string;
  subject: string;
  textBody: string;
  htmlBody?: string;
}

export async function sendEmail({ to, subject, textBody, htmlBody }: EmailParams) {
  if (!process.env.POSTMARK_SERVER_TOKEN) {
    console.warn("POSTMARK_SERVER_TOKEN not set — skipping email to:", to);
    return;
  }

  const client = new ServerClient(process.env.POSTMARK_SERVER_TOKEN);
  return client.sendEmail({
    From: process.env.POSTMARK_FROM_EMAIL!,
    To: to,
    Subject: subject,
    TextBody: textBody,
    HtmlBody: htmlBody,
  });
}

export function buildEmailHtml(body: string, ctaLabel?: string, ctaUrl?: string) {
  const cta =
    ctaLabel && ctaUrl
      ? `<p style="margin: 24px 0;"><a href="${ctaUrl}" style="background:#111827;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">${ctaLabel}</a></p>`
      : "";
  return `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:32px;color:#111827;">
    ${body}
    ${cta}
    <p style="color:#6b7280;font-size:12px;margin-top:40px;">HiredByAgents.com — Human fallback API for AI agents</p>
  </body></html>`;
}
