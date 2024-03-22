interface IDecodeBase64Options {
  encodedString: string;
}
export function decodeBase64(options: IDecodeBase64Options) {
  return Buffer.from(options.encodedString, 'base64').toString('utf-8');
}
