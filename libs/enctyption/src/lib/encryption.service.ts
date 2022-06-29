import { EncryptedData, EncryptionConfig } from '@fonbnk/types';
import { Inject, Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const ENCRYPTION_ALGORYTHM = 'aes-256-ctr';

@Injectable()
export class EncryptionService {
  constructor(@Inject('CONFIG_OPTIONS') private options: EncryptionConfig) {}

  /**
   * Return generated key with user passphrase
   * @param passphrase
   * @returns
   */
  private async getEncryptionKey(passphrase: string): Promise<Buffer> {
    return (await promisify(scrypt)(
      this.options.secret,
      passphrase,
      32
    )) as Buffer;
  }

  /**
   * Will return encrypted text as EncryptedData object
   * @param text Text that should be encrypted
   * @returns
   */
  async encrypt(text: string, passphrase: string): Promise<EncryptedData> {
    const key = await this.getEncryptionKey(passphrase);
    const iv = randomBytes(16);
    const cipher = createCipheriv(ENCRYPTION_ALGORYTHM, key, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return {
      iv: iv.toString('hex'),
      content: encrypted.toString('hex'),
    };
  }

  /**
   * Return decrypted data
   * @param encrypredData
   * @param passphrase
   * @returns
   */
  async decrypt(
    encrypredData: EncryptedData,
    passphrase: string
  ): Promise<string> {
    const key = await this.getEncryptionKey(passphrase);
    const decipher = createDecipheriv(
      ENCRYPTION_ALGORYTHM,
      key,
      Buffer.from(encrypredData.iv, 'hex')
    );
    const decrpyted = Buffer.concat([
      decipher.update(Buffer.from(encrypredData.content, 'hex')),
      decipher.final(),
    ]);

    return decrpyted.toString();
  }
}
