import { decodeBase64 } from '../../../services/utils';

describe('decodeBase64', () => {
  it('should decode a valid base64 input', () => {
    const encodedString = Buffer.from('Hello World').toString('base64');
    const decodedString = decodeBase64({ encodedString });
    expect(decodedString).toEqual('Hello World');
  });

  // Everything is base64 basically, so no negative path.
});
