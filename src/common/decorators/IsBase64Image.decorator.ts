import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsBase64Image(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsBase64Image',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const base64ImageRegex =
            /^data:image\/(jpeg|png|gif|bmp|webp);base64,/;
          return typeof value === 'string' && base64ImageRegex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid base64 image.`;
        },
      },
    });
  };
}
