import { IsNotEmpty, MinLength } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateTransactionInput {
  @Field({ description: 'Address of the recipient' })
  address: string;

  @Field({ description: 'Amount to send' })
  amount: string;

  @Field({ description: 'Password for proof transaction' })
  @IsNotEmpty()
  password: string;
}
