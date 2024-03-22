import sgMail from '@sendgrid/mail';
import { SendGrid } from '../../clients';
import { AppError } from '../../errors/AppError';
import { Errors } from '../../types/Errors';

jest.mock('@sendgrid/mail');

describe('sgSendMail', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send email successfully and return true', async () => {
    const options = {
      subject: 'Test Subject',
      text: 'Test Text',
      to: 'recipient@example.com',
    };

    const sendMock = jest.fn().mockResolvedValue([{ statusCode: 202 }]);
    (sgMail.send as jest.Mock).mockImplementation(sendMock);

    const result = await SendGrid.sgSendMail(options);

    expect(sgMail.send).toHaveBeenCalledWith({
      to: options.to,
      from: '', // TODO add your mail address here.
      subject: options.subject,
      text: options.text,
    });

    expect(result).toBe(true);
  });

  it('should return false if sending email fails', async () => {
    const options = {
      subject: 'Test Subject',
      text: 'Test Text',
      to: 'recipient@example.com',
    };

    const sendMock = jest.fn().mockRejectedValue(new AppError(Errors.CANNOT_SEND_MAIL, 400));
    (sgMail.send as jest.Mock).mockImplementation(sendMock);

    try {
      await SendGrid.sgSendMail(options);
    } catch (error) {
      const err = error as Error;
      expect(err.message).toBe(Errors.CANNOT_SEND_MAIL);
    }
  });
});
