import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MongooseModule } from '@nestjs/mongoose';
import { environment } from '../environments/environment';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [
    MongooseModule.forRoot(environment.MONGODB_URL),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: !environment.production,
      autoSchemaFile: true,
      sortSchema: true,
    }),
    AuthModule,
    UsersModule,
    WalletModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
