import { resend } from '../config/resend/';
import { mailProps } from '../types';

async function sendMail({ to, subject, html }: mailProps) {
  const { data, error } = await resend.emails.send({
    from: `Tube Pay<${process.env.RESEND_EMAIL}>`,
    to: to,
    subject: subject,
    html: html,
  });

  if (error) {
    return console.error({ error });
  }

  console.log({ data });
};

export default sendMail;