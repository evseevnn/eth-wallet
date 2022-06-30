import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { BigNumber } from 'ethers';
import { Exclude } from 'class-transformer';

export type WalletDocument = Wallet & Document;

@Schema()
@ObjectType()
export class Wallet {
  _id: ObjectId;

  @Prop({ required: true })
  @Field(() => String)
  address: string;

  @Prop({ default: '0' })
  @Field(() => String)
  balance: String;

  @Exclude()
  @Prop(
    raw({
      iv: { type: String },
      content: { type: String },
    })
  )
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
