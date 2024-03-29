import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Transform, Type } from 'class-transformer';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Wallet } from './wallet.entity';

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
  @Exclude()
  password: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' })
  @Field(() => Wallet)
  @Type(() => Wallet)
  wallet: Wallet;
}

export const UserSchema = SchemaFactory.createForClass(User);
