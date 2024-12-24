import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsBufferConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    return Buffer.isBuffer(value);
  }

  defaultMessage() {
    return 'Must be a valid buffer.';
  }
}

export function IsBuffer(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsBufferConstraint,
    });
  };
}
