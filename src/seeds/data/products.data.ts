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
    categoryId: 'Pain Relievers',
    images,
  },
  {
    name: 'Cough Syrup X200',
    description: 'A syrup for relieving cough and throat irritation.',
    price: 15.49,
    stock: 150,
    categoryId: 'Cough and Cold',
    images,
  },
  {
    name: 'Vitamin C 500mg',
    description:
      'A dietary supplement providing 500mg of Vitamin C per tablet.',
    price: 9.99,
    stock: 200,
    categoryId: 'Vitamins and Supplements',
    images,
  },
  {
    name: 'Antibiotic X500',
    description: 'An antibiotic to fight bacterial infections.',
    price: 49.99,
    stock: 75,
    categoryId: 'Antibiotics',
    images,
  },
  {
    name: 'Anti-Aging Cream',
    description:
      'A cream that reduces the appearance of fine lines and wrinkles.',
    price: 29.99,
    stock: 120,
    categoryId: 'Skincare',
    images,
  },
  {
    name: 'Shampoo X300',
    description: 'A nourishing shampoo for dry and damaged hair.',
    price: 12.99,
    stock: 180,
    categoryId: 'Haircare',
    images,
  },
  {
    name: 'Body Lotion X400',
    description: 'A moisturizing lotion for soft and smooth skin.',
    price: 14.49,
    stock: 140,
    categoryId: 'Body Care',
    images,
  },
  {
    name: 'Toothpaste X50',
    description: 'A fluoride toothpaste for strong and healthy teeth.',
    price: 6.99,
    stock: 250,
    categoryId: 'Oral Care',
    images,
  },
  {
    name: 'Fitness Tracker',
    description:
      'A wearable fitness tracker that monitors your activity and health.',
    price: 99.99,
    stock: 100,
    categoryId: 'Fitness',
    images,
  },
  {
    name: 'Protein Powder',
    description:
      'A protein supplement to boost muscle recovery after workouts.',
    price: 34.99,
    stock: 150,
    categoryId: 'Protein Supplements',
    images,
  },
  {
    name: 'Herbal Tea',
    description: 'A soothing herbal tea for relaxation and stress relief.',
    price: 9.99,
    stock: 200,
    categoryId: 'Herbal Supplements',
    images,
  },
  {
    name: 'Sleep Aid Supplement',
    description:
      'A supplement designed to promote better sleep and relaxation.',
    price: 19.99,
    stock: 180,
    categoryId: 'Sleep & Relaxation',
    images,
  },
  {
    name: 'Baby Food X10',
    description: 'A nutritious baby food for infants and toddlers.',
    price: 4.99,
    stock: 300,
    categoryId: 'Baby Foods',
    images,
  },
  {
    name: 'Diapers X200',
    description: 'Soft and absorbent diapers for babies.',
    price: 24.99,
    stock: 100,
    categoryId: 'Diapers & Wipes',
    images,
  },
  {
    name: 'Baby Health Supplement',
    description:
      'A health supplement for babies to support their growth and development.',
    price: 15.99,
    stock: 150,
    categoryId: 'Baby Health',
    images,
  },
  {
    name: 'Hair Loss Treatment',
    description: 'A hair loss treatment to strengthen and revitalize hair.',
    price: 29.99,
    stock: 80,
    categoryId: 'Hair Loss Treatment',
    images,
  },
  {
    name: 'Testosterone Booster',
    description: 'A supplement designed to boost testosterone levels.',
    price: 39.99,
    stock: 90,
    categoryId: 'Testosterone',
    images,
  },
  {
    name: 'Prostate Health Supplement',
    description: 'A supplement designed to promote prostate health.',
    price: 25.99,
    stock: 110,
    categoryId: 'Prostate Health',
    images,
  },
  {
    name: 'Feminine Care Wipes',
    description: 'Feminine hygiene wipes for everyday freshness.',
    price: 5.99,
    stock: 200,
    categoryId: 'Feminine Care',
    images,
  },
  {
    name: 'Pregnancy Test Kit',
    description: 'A reliable pregnancy test kit for accurate results.',
    price: 9.99,
    stock: 300,
    categoryId: 'Pregnancy',
    images,
  },
  {
    name: 'Menopause Relief Supplement',
    description: 'A supplement to ease menopause symptoms.',
    price: 18.99,
    stock: 150,
    categoryId: 'Menopause',
    images,
  },
  {
    name: 'Pre-Workout Supplement',
    description:
      'A supplement to boost energy and performance before workouts.',
    price: 22.99,
    stock: 120,
    categoryId: 'Energy Supplements',
    images,
  },
  {
    name: 'Post-Workout Recovery Drink',
    description:
      'A recovery drink to replenish energy and repair muscles after a workout.',
    price: 14.99,
    stock: 130,
    categoryId: 'Protein Supplements',
    images,
  },
  {
    name: 'Organic Green Tea',
    description:
      'A healthy, organic green tea to boost metabolism and provide antioxidants.',
    price: 12.99,
    stock: 200,
    categoryId: 'Herbal Supplements',
    images,
  },
  {
    name: 'Collagen Supplements',
    description: 'A supplement to promote healthy skin, hair, and joints.',
    price: 29.99,
    stock: 130,
    categoryId: 'Skincare',
    images,
  },
  {
    name: 'Instant Oatmeal',
    description: 'Quick and easy oatmeal for a healthy breakfast.',
    price: 6.99,
    stock: 250,
    categoryId: 'Diet & Nutrition',
    images,
  },
  {
    name: 'Baby Formula X15',
    description:
      'A nutritious baby formula to ensure proper growth and development.',
    price: 22.99,
    stock: 180,
    categoryId: 'Baby Foods',
    images,
  },
  {
    name: 'Organic Baby Food',
    description:
      'Healthy and organic food for babies, made with natural ingredients.',
    price: 8.99,
    stock: 220,
    categoryId: 'Baby Foods',
    images,
  },
  {
    name: 'Sensitive Skin Body Wash',
    description:
      'A gentle body wash for sensitive skin, free from harsh chemicals.',
    price: 15.99,
    stock: 160,
    categoryId: 'Body Care',
    images,
  },
  {
    name: 'Electric Toothbrush',
    description:
      'An advanced electric toothbrush for efficient cleaning and plaque removal.',
    price: 39.99,
    stock: 100,
    categoryId: 'Oral Care',
    images,
  },
  {
    name: "Men's Grooming Kit",
    description:
      'A complete grooming kit for men, including trimmer, razor, and shaving cream.',
    price: 29.99,
    stock: 110,
    categoryId: 'Men’s Health',
    images,
  },
  {
    name: 'Herbal Facial Mask',
    description:
      'A soothing herbal facial mask that revitalizes and moisturizes the skin.',
    price: 18.99,
    stock: 150,
    categoryId: 'Skincare',
    images,
  },
  {
    name: 'Hydrating Night Cream',
    description:
      'A rich night cream to deeply hydrate and rejuvenate the skin overnight.',
    price: 22.99,
    stock: 130,
    categoryId: 'Skincare',
    images,
  },
  {
    name: 'Smartwatch X200',
    description:
      'A stylish smartwatch with health tracking and fitness features.',
    price: 129.99,
    stock: 90,
    categoryId: 'Fitness',
    images,
  },
  {
    name: 'Wireless Earbuds',
    description: 'High-quality wireless earbuds with noise cancellation.',
    price: 79.99,
    stock: 120,
    categoryId: 'Fitness',
    images,
  },
  {
    name: 'Bluetooth Speaker',
    description:
      'Portable Bluetooth speaker with high-quality sound and long battery life.',
    price: 59.99,
    stock: 140,
    categoryId: 'Fitness',
    images,
  },
  {
    name: 'Fitness Resistance Bands',
    description:
      'Durable resistance bands for strength training and home workouts.',
    price: 18.99,
    stock: 160,
    categoryId: 'Fitness',
    images,
  },
  {
    name: 'Yoga Mat X2',
    description:
      'Non-slip yoga mat designed for comfort and stability during practice.',
    price: 25.99,
    stock: 170,
    categoryId: 'Fitness',
    images,
  },
  {
    name: 'Jump Rope',
    description: 'A lightweight and durable jump rope for cardio workouts.',
    price: 9.99,
    stock: 200,
    categoryId: 'Fitness',
    images,
  },
  {
    name: 'Resistance Loop Bands',
    description:
      'Set of resistance loop bands for stretching and strength exercises.',
    price: 14.99,
    stock: 150,
    categoryId: 'Fitness',
    images,
  },
  {
    name: 'Portable Blender',
    description: 'A portable blender for smoothies and shakes on the go.',
    price: 39.99,
    stock: 110,
    categoryId: 'Fitness',
    images,
  },
  {
    name: 'Smart Water Bottle',
    description: 'A smart water bottle that tracks your hydration levels.',
    price: 24.99,
    stock: 90,
    categoryId: 'Fitness',
    images,
  },
];
