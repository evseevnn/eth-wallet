import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MongooseModule } from '@nestjs/mongoose';
import { environment } from '../environments/environment';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    MongooseModule.forRoot(environment.mongodbUrl),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: !environment.production,
      autoSchemaFile: true,
      sortSchema: true,
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
