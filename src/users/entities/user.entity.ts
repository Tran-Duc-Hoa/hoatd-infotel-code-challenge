import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractEntity } from 'src/common/database/abtract.entity';

@Schema()
export class User extends AbstractEntity {
  @Prop()
  email: string;

  @Prop()
  password?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
