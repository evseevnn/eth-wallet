import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import graphqlTypeJson from 'graphql-type-json';
import { BigNumber } from 'ethers';

export type UserDocument = Wallet & Document;

@Schema()
@ObjectType()
export class Wallet {
  @Field(() => String)
  _id: ObjectId;

  @Prop({ required: true })
  @Field(() => String)
  address: string;

  @Prop({ default: '0' })
  @Field(() => String)
  balance: String;

  @Prop(
    raw({
      iv: { type: String },
      content: { type: String },
    })
  )
  @Field(() => graphqlTypeJson, { nullable: false })
  encrypted_pk: Record<string, any>;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
WalletSchema.pre(
  'save',
  { document: true, query: true },
  async function (next, opts) {
    this.balance = BigNumber.from(this.balance).toString();
    next();
  }
);
