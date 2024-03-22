import { SendGrid } from '../clients';
import { IRegistryDependency } from '../clients';
import { AppError } from '../errors/AppError';
import { Errors } from '../types/Errors';

interface ISendMailOptions {
  sendTo: string[];
  outdatedDependencies: IRegistryDependency[];
  repository: string;
}
export async function sendMail(options: ISendMailOptions) {
  try {
    const promises = options.sendTo.map(async (recipient) => {
      return SendGrid.sgSendMail({
        to: recipient,
        subject: `${options.repository} Outdated Dependencies Alert`,
        text: formatMailText({ outdatedDependencies: options.outdatedDependencies }),
      });
    });

    await Promise.all(promises);

    return true;
  } catch (err) {
    throw new AppError(Errors.CANNOT_SEND_MAIL, 400);
  }
}

interface IFormatMailTextOptions {
  outdatedDependencies: IRegistryDependency[];
}
function formatMailText(options: IFormatMailTextOptions) {
  if (options.outdatedDependencies.length) {
    return options.outdatedDependencies
      .map((dep) => `${dep.name}: ${dep.version} ---> ${dep.latestVersion}`)
      .join('\n');
  }

  return 'All dependencies are up to date';
}
