import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { BigNumber } from 'ethers';

export type TransactionDocument = Transaction & Document;

@Schema()
@ObjectType()
export class Transaction {
  @Field(() => String)
  _id: ObjectId;

  @Prop({ required: true })
  @Field(() => String)
  from: string;

  @Prop({ required: true })
  @Field(() => String)
  to: String;

  @Prop()
  @Field(() => String)
  amount: String;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
TransactionSchema.pre(
  'save',
  { document: true, query: true },
  async function (next, opts) {
    this.amount = BigNumber.from(this.amount).toString();
    next();
  }
);
