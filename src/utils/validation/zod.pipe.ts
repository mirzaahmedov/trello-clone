import { Injectable, PipeTransform } from '@nestjs/common';
import { ZodSchema } from 'zod';

@Injectable()
export class ZodPipe<T extends ZodSchema> implements PipeTransform {
  constructor(private readonly schema: T) {}

  transform(value: any) {
    console.log(value);
    return this.schema.parse(value);
  }
}
