import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { BigNumber } from 'ethers';

export type TransactionDocument = Transaction & Document;

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETE',
  FAILED = 'FAILED',
}
registerEnumType(TransactionStatus, {
  name: 'TransactionStatus',
  description: 'Transaction status',
});

@Schema()
@ObjectType()
export class Transaction {
  @Field(() => String)
  _id: ObjectId;

  @Prop()
  @Field(() => Number)
  block: number;

  @Prop({ required: true, unique: true })
  @Field(() => String)
  hash: string;

  @Prop({ required: true })
  @Field(() => String)
  from: string;

  @Prop({ required: true })
  @Field(() => String)
  to: String;

  @Prop({
    enum: Object.values(TransactionStatus),
    required: true,
  })
  @Field(() => TransactionStatus)
  status: TransactionStatus;

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
