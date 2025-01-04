import { validate } from 'class-validator';
import { IsBase64Image } from './IsBase64Image.decorator';

class ImageDto {
  @IsBase64Image({ message: 'The image must be in base64 format' })
  image: string;
}

describe('IsBase64Image Decorator', () => {
  it('should validate correctly a valid base64 image string', async () => {
    const validBase64Image =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...';

    const dto = new ImageDto();
    dto.image = validBase64Image;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should invalidate an invalid base64 image string', async () => {
    const invalidBase64Image = 'data:text/plain;base64,SGVsbG8gd29ybGQ=';

    const dto = new ImageDto();
    dto.image = invalidBase64Image;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.IsBase64Image).toBe(
      'The image must be in base64 format',
    );
  });

  it('should invalidate a non-base64 string', async () => {
    const nonBase64String = 'this is not base64';

    const dto = new ImageDto();
    dto.image = nonBase64String;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.IsBase64Image).toBe(
      'The image must be in base64 format',
    );
  });

  it('should invalidate an empty string', async () => {
    const emptyString = '';

    const dto = new ImageDto();
    dto.image = emptyString;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.IsBase64Image).toBe(
      'The image must be in base64 format',
    );
  });
});
