import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateUserInput {
  @IsNotEmpty()
  @Field(() => String, { description: 'User full name' })
  fullname: string;

  @IsEmail()
  @Field(() => String, { description: 'Email of the user' })
  email: string;

  @IsNotEmpty()
  @Field(() => String, { description: 'User password' })
  password: string;
}
