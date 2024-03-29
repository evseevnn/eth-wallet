import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MongooseModule } from '@nestjs/mongoose';
import { environment } from '../environments/environment';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { WalletModule } from './wallet/wallet.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    MongooseModule.forRoot(environment.MONGODB_URL),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: !environment.production,
      autoSchemaFile: 'apps/api/schema.graphql',
      sortSchema: true,
    }),
    AuthModule,
    UsersModule,
    WalletModule,
    TransactionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
