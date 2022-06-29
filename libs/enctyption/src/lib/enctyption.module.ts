import { DynamicModule, Module } from '@nestjs/common';
import { EncryptionService } from './encryption.service';
import { EncryptionConfig } from '@fonbnk/types';

@Module({
  controllers: [],
  providers: [EncryptionService],
  exports: [],
})
export class EnctyptionModule {
  static register(options: EncryptionConfig): DynamicModule {
    return {
      module: EnctyptionModule,
      providers: [
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options,
        },
        EncryptionService,
      ],
      exports: [EncryptionService],
    };
  }
}
