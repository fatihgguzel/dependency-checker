import { SendGrid } from '../../clients';
import { AppError } from '../../errors/AppError';
import * as MailService from '../../services/mailService';
import { Errors } from '../../types/Errors';

jest.mock('../../clients/SendGrid', () => ({
  SendGrid: {
    sgSendMail: jest.fn(),
  },
}));

describe('sendMail', () => {
  it('should send mail to each recipient with outdated dependencies', async () => {
    const sendTo = ['test1@example.com', 'test2@example.com'];
    const outdatedDependencies = [
      { name: 'dependency1', version: '1.0.0', latestVersion: '1.1.0' },
      { name: 'dependency2', version: '2.0.0', latestVersion: '2.1.0' },
    ];
    const repository = 'example/repository';

    await MailService.sendMail({ sendTo, outdatedDependencies, repository });

    expect(SendGrid.sgSendMail).toHaveBeenCalledTimes(sendTo.length);
    sendTo.forEach((recipient) => {
      expect(SendGrid.sgSendMail).toHaveBeenCalledWith({
        to: recipient,
        subject: `${repository} Outdated Dependencies Alert`,
        text: `dependency1: 1.0.0 ---> 1.1.0\ndependency2: 2.0.0 ---> 2.1.0`,
      });
    });
  });

  it('should return true after sending mail successfully', async () => {
    const sendTo = ['test@example.com'];
    const outdatedDependencies = [{ name: 'dependency', version: '1.0.0', latestVersion: '1.1.0' }];
    const repository = 'example/repository';

    const result = await MailService.sendMail({ sendTo, outdatedDependencies, repository });

    expect(result).toBe(true);
  });

  it('should throw AppError.CANNOT_SEND_MAIL if sending mail fails', async () => {
    (SendGrid.sgSendMail as jest.Mock).mockRejectedValueOnce(new AppError(Errors.CANNOT_SEND_MAIL, 400));

    await expect(
      MailService.sendMail({
        sendTo: ['test@example.com'],
        outdatedDependencies: [],
        repository: 'example/repository',
      }),
    ).rejects.toThrow(AppError);
  });
});
