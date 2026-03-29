import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clear existing data (in correct order due to FKs)
  await prisma.productImage.deleteMany()
  await prisma.productVariant.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()

  // Categories
  const clothing = await prisma.category.create({
    data: {
      name: 'Clothing',
      slug: 'clothing',
      description: 'Apparel for all seasons',
      isFeatured: true,
      displayOrder: 1,
    },
  })

  const outerwear = await prisma.category.create({
    data: {
      name: 'Outerwear',
      slug: 'outerwear',
      parentId: clothing.id,
      displayOrder: 1,
    },
  })

  const equipment = await prisma.category.create({
    data: {
      name: 'Equipment',
      slug: 'equipment',
      description: 'Gear for your next adventure',
      isFeatured: true,
      displayOrder: 2,
    },
  })

  // Product 1
  const jacket = await prisma.product.create({
    data: {
      name: 'Alpine Traverse Jacket',
      slug: 'alpine-traverse-jacket',
      description: 'Durable, waterproof jacket suitable for extreme conditions.',
      price: 199.99,
      brand: 'SummitGear',
      categoryId: outerwear.id,
      variants: {
        create: [
          { sku: 'ATV-NAV-M', color: 'Navy', colorHex: '#000080', size: 'M', isAvailable: true },
          { sku: 'ATV-NAV-L', color: 'Navy', colorHex: '#000080', size: 'L', isAvailable: true },
          { sku: 'ATV-RED-M', color: 'Red', colorHex: '#FF0000', size: 'M', isAvailable: false },
        ],
      },
    },
  })

  // Product 2
  const backpack = await prisma.product.create({
    data: {
      name: 'Daypack Explorer 30L',
      slug: 'daypack-explorer-30l',
      description: 'Lightweight daytime backpack with optimal weight distribution.',
      price: 89.50,
      brand: 'Nomad',
      categoryId: equipment.id,
      variants: {
        create: [
          { sku: 'DPX-BLK-OS', color: 'Black', colorHex: '#000000', size: 'One Size', isAvailable: true },
        ],
      },
    },
  })

  console.log('Database seeding completed successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
