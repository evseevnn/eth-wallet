import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document, ObjectId } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
@ObjectType()
export class User {
  @Field(() => String)
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ required: true, maxlength: 100 })
  @Field(() => String)
  fullname: string;

  @Prop({ unique: true, minlength: 3, maxlength: 32 })
  @Field(() => String)
  email: string;

  @Prop({ maxlength: 128 })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
