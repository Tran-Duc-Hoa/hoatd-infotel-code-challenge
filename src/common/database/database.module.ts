import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';
import { DbMigrationService } from './db-migration';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.getOrThrow('MONGODB_URI'),
      }),
    }),
  ],
  providers: [DbMigrationService],
})
export class DatabaseModule {
  static forFeature(models: ModelDefinition[]) {
    return MongooseModule.forFeature(models);
  }
}
