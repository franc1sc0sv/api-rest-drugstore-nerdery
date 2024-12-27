import { products } from './data/products.data';
import { ProductsService } from 'src/modules/products/products.service';
import { ImagesService } from 'src/modules/images/images.service';
import { PrismaService } from 'nestjs-prisma';

const prisma = new PrismaService();

const imagesService = new ImagesService();
const productService = new ProductsService(prisma, imagesService);

export const seedProducts = async () => {
  try {
    console.log('Seeding products...');

    const existingProducts = await prisma.product.count();
    console.log('Products already seeded.');

    if (!(existingProducts > 0)) {
      await Promise.all(
        products.map((product) => productService.createProduct(product)),
      );
    }

    console.log('Seeding products completed.');
  } catch (error) {
    console.error('Error seeding products:', error);
  } finally {
    await prisma.$disconnect();
  }
};
