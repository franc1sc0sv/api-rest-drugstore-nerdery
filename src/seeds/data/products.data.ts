import * as fs from 'fs';
import * as path from 'path';
import { CreateProductInput } from 'src/modules/products/dtos/request/create-products.input';

const filePathImage1 = path.join(
  process.cwd(),
  './src/seeds/data/images/base64_image1.txt',
);

const filePathImage2 = path.join(
  process.cwd(),
  './src/seeds/data/images/base64_image2.txt',
);

const images1 = fs.readFileSync(filePathImage1, 'utf8').toString();

const images2 = fs.readFileSync(filePathImage2, 'utf8').toString();

const images = [{ fileBuffer: images1 }, { fileBuffer: images2 }];

export const products: CreateProductInput[] = [
  {
    name: 'Pain Reliever X100',
    description: 'An effective pain reliever for headaches and muscle pain.',
    price: 19.99,
    stock: 100,
    categoryId: 'fbb9be5f-359e-4f56-941c-f00333592e52',
    images,
  },
  {
    name: 'Cough Syrup X200',
    description: 'A syrup for relieving cough and throat irritation.',
    price: 15.49,
    stock: 150,
    categoryId: 'fbb9be5f-359e-4f56-941c-f00333592e52',
    images,
  },
  {
    name: 'Vitamin C 500mg',
    description:
      'A dietary supplement providing 500mg of Vitamin C per tablet.',
    price: 9.99,
    stock: 200,
    categoryId: 'fbb9be5f-359e-4f56-941c-f00333592e52',
    images,
  },
  {
    name: 'Antibiotic X500',
    description: 'An antibiotic to fight bacterial infections.',
    price: 49.99,
    stock: 75,
    categoryId: 'fbb9be5f-359e-4f56-941c-f00333592e52',
    images,
  },
  {
    name: 'Anti-Aging Cream',
    description:
      'A cream that reduces the appearance of fine lines and wrinkles.',
    price: 29.99,
    stock: 120,
    categoryId: '8184cc5b-09fc-4a69-8760-5c5e574197a4',
    images,
  },
  {
    name: 'Shampoo X300',
    description: 'A nourishing shampoo for dry and damaged hair.',
    price: 12.99,
    stock: 180,
    categoryId: '8184cc5b-09fc-4a69-8760-5c5e574197a4',
    images,
  },
  {
    name: 'Body Lotion X400',
    description: 'A moisturizing lotion for soft and smooth skin.',
    price: 14.49,
    stock: 140,
    categoryId: '8184cc5b-09fc-4a69-8760-5c5e574197a4',
    images,
  },
  {
    name: 'Toothpaste X50',
    description: 'A fluoride toothpaste for strong and healthy teeth.',
    price: 6.99,
    stock: 250,
    categoryId: '8184cc5b-09fc-4a69-8760-5c5e574197a4',
    images,
  },
  {
    name: 'Fitness Tracker',
    description:
      'A wearable fitness tracker that monitors your activity and health.',
    price: 99.99,
    stock: 100,
    categoryId: 'eea13947-49f5-4cf6-95b3-5b601b456113',
    images,
  },
  {
    name: 'Protein Powder',
    description:
      'A protein supplement to boost muscle recovery after workouts.',
    price: 34.99,
    stock: 150,
    categoryId: '5c2e42d3-bdc0-47ba-8f63-6af764189fae',
    images,
  },
  {
    name: 'Herbal Tea',
    description: 'A soothing herbal tea for relaxation and stress relief.',
    price: 9.99,
    stock: 200,
    categoryId: '5c2e42d3-bdc0-47ba-8f63-6af764189fae',
    images,
  },
  {
    name: 'Sleep Aid Supplement',
    description:
      'A supplement designed to promote better sleep and relaxation.',
    price: 19.99,
    stock: 180,
    categoryId: 'eea13947-49f5-4cf6-95b3-5b601b456113',
    images,
  },
  {
    name: 'Baby Food X10',
    description: 'A nutritious baby food for infants and toddlers.',
    price: 4.99,
    stock: 300,
    categoryId: '673be6ee-707f-448f-9d75-4d33fbfcaefb',
    images,
  },
  {
    name: 'Diapers X200',
    description: 'Soft and absorbent diapers for babies.',
    price: 24.99,
    stock: 100,
    categoryId: '673be6ee-707f-448f-9d75-4d33fbfcaefb',
    images,
  },
  {
    name: 'Baby Health Supplement',
    description:
      'A health supplement for babies to support their growth and development.',
    price: 15.99,
    stock: 150,
    categoryId: '673be6ee-707f-448f-9d75-4d33fbfcaefb',
    images,
  },
  {
    name: 'Hair Loss Treatment',
    description: 'A hair loss treatment to strengthen and revitalize hair.',
    price: 29.99,
    stock: 80,
    categoryId: 'de94211a-1d25-4afd-8780-75cbe5a1ef13',
    images,
  },
  {
    name: 'Testosterone Booster',
    description: 'A supplement designed to boost testosterone levels.',
    price: 39.99,
    stock: 90,
    categoryId: 'de94211a-1d25-4afd-8780-75cbe5a1ef13',
    images,
  },
  {
    name: 'Prostate Health Supplement',
    description: 'A supplement designed to promote prostate health.',
    price: 25.99,
    stock: 110,
    categoryId: 'de94211a-1d25-4afd-8780-75cbe5a1ef13',
    images,
  },
  {
    name: 'Feminine Care Wipes',
    description: 'Feminine hygiene wipes for everyday freshness.',
    price: 5.99,
    stock: 200,
    categoryId: '9f555144-60fd-4572-8789-17d460223c43',
    images,
  },
  {
    name: 'Pregnancy Test Kit',
    description: 'A reliable pregnancy test kit for accurate results.',
    price: 9.99,
    stock: 300,
    categoryId: '9f555144-60fd-4572-8789-17d460223c43',
    images,
  },
  {
    name: 'Menopause Relief Supplement',
    description: 'A supplement to ease menopause symptoms.',
    price: 18.99,
    stock: 150,
    categoryId: '9f555144-60fd-4572-8789-17d460223c43',
    images,
  },
  {
    name: 'Pre-Workout Supplement',
    description:
      'A supplement to boost energy and performance before workouts.',
    price: 22.99,
    stock: 120,
    categoryId: '5c2e42d3-bdc0-47ba-8f63-6af764189fae',
    images,
  },
  {
    name: 'Post-Workout Recovery Drink',
    description:
      'A recovery drink to replenish energy and repair muscles after a workout.',
    price: 14.99,
    stock: 130,
    categoryId: '5c2e42d3-bdc0-47ba-8f63-6af764189fae',
    images,
  },
  {
    name: 'Organic Green Tea',
    description:
      'A healthy, organic green tea to boost metabolism and provide antioxidants.',
    price: 12.99,
    stock: 200,
    categoryId: '5c2e42d3-bdc0-47ba-8f63-6af764189fae',
    images,
  },
  {
    name: 'Collagen Supplements',
    description: 'A supplement to promote healthy skin, hair, and joints.',
    price: 29.99,
    stock: 130,
    categoryId: '5c2e42d3-bdc0-47ba-8f63-6af764189fae',
    images,
  },
  {
    name: 'Instant Oatmeal',
    description: 'Quick and easy oatmeal for a healthy breakfast.',
    price: 6.99,
    stock: 250,
    categoryId: '673be6ee-707f-448f-9d75-4d33fbfcaefb',
    images,
  },
  {
    name: 'Baby Formula X15',
    description:
      'A nutritious baby formula to ensure proper growth and development.',
    price: 22.99,
    stock: 180,
    categoryId: '673be6ee-707f-448f-9d75-4d33fbfcaefb',
    images,
  },
  {
    name: 'Organic Baby Food',
    description:
      'Healthy and organic food for babies, made with natural ingredients.',
    price: 8.99,
    stock: 220,
    categoryId: '673be6ee-707f-448f-9d75-4d33fbfcaefb',
    images,
  },
  {
    name: 'Sensitive Skin Body Wash',
    description:
      'A gentle body wash for sensitive skin, free from harsh chemicals.',
    price: 15.99,
    stock: 160,
    categoryId: '8184cc5b-09fc-4a69-8760-5c5e574197a4',
    images,
  },
  {
    name: 'Electric Toothbrush',
    description:
      'An advanced electric toothbrush for efficient cleaning and plaque removal.',
    price: 39.99,
    stock: 100,
    categoryId: '8184cc5b-09fc-4a69-8760-5c5e574197a4',
    images,
  },
  {
    name: "Men's Grooming Kit",
    description:
      'A complete grooming kit for men, including trimmer, razor, and shaving cream.',
    price: 29.99,
    stock: 110,
    categoryId: '8184cc5b-09fc-4a69-8760-5c5e574197a4',
    images,
  },
  {
    name: 'Herbal Facial Mask',
    description:
      'A soothing herbal facial mask that revitalizes and moisturizes the skin.',
    price: 18.99,
    stock: 150,
    categoryId: '8184cc5b-09fc-4a69-8760-5c5e574197a4',
    images,
  },
  {
    name: 'Hydrating Night Cream',
    description:
      'A rich night cream to deeply hydrate and rejuvenate the skin overnight.',
    price: 22.99,
    stock: 130,
    categoryId: '8184cc5b-09fc-4a69-8760-5c5e574197a4',
    images,
  },
  {
    name: 'Smartwatch X200',
    description:
      'A stylish smartwatch with health tracking and fitness features.',
    price: 129.99,
    stock: 90,
    categoryId: 'eea13947-49f5-4cf6-95b3-5b601b456113',
    images,
  },
  {
    name: 'Wireless Earbuds',
    description: 'High-quality wireless earbuds with noise cancellation.',
    price: 79.99,
    stock: 120,
    categoryId: 'eea13947-49f5-4cf6-95b3-5b601b456113',
    images,
  },
  {
    name: 'Bluetooth Speaker',
    description:
      'Portable Bluetooth speaker with high-quality sound and long battery life.',
    price: 59.99,
    stock: 140,
    categoryId: 'eea13947-49f5-4cf6-95b3-5b601b456113',
    images,
  },
  {
    name: 'Fitness Resistance Bands',
    description:
      'Durable resistance bands for strength training and home workouts.',
    price: 18.99,
    stock: 160,
    categoryId: '5c2e42d3-bdc0-47ba-8f63-6af764189fae',
    images,
  },
  {
    name: 'Yoga Mat X2',
    description:
      'Non-slip yoga mat designed for comfort and stability during practice.',
    price: 25.99,
    stock: 170,
    categoryId: '5c2e42d3-bdc0-47ba-8f63-6af764189fae',
    images,
  },
  {
    name: 'Jump Rope',
    description: 'A lightweight and durable jump rope for cardio workouts.',
    price: 9.99,
    stock: 200,
    categoryId: '5c2e42d3-bdc0-47ba-8f63-6af764189fae',
    images,
  },
  {
    name: 'Resistance Loop Bands',
    description:
      'Set of resistance loop bands for stretching and strength exercises.',
    price: 14.99,
    stock: 150,
    categoryId: '5c2e42d3-bdc0-47ba-8f63-6af764189fae',
    images,
  },
  {
    name: 'Portable Blender',
    description: 'A portable blender for smoothies and shakes on the go.',
    price: 39.99,
    stock: 110,
    categoryId: 'eea13947-49f5-4cf6-95b3-5b601b456113',
    images,
  },
  {
    name: 'Smart Water Bottle',
    description: 'A smart water bottle that tracks your hydration levels.',
    price: 24.99,
    stock: 90,
    categoryId: 'eea13947-49f5-4cf6-95b3-5b601b456113',
    images,
  },
];
