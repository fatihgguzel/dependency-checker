import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

interface ISGSendMailOptions {
  subject: string;
  text: string;
  to: string;
}
export async function sgSendMail(options: ISGSendMailOptions) {
  const response = await sgMail.send({
    to: options.to,
    from: '', // TODO add your mail address here.
    subject: options.subject,
    text: options.text,
  });

  return response[0].statusCode === 202;
}
