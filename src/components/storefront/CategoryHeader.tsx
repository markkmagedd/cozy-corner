import prisma from "@/lib/prisma"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Breadcrumbs } from "./Breadcrumbs"
import { SubcategoryNav } from "./SubcategoryNav"

interface CategoryHeaderProps {
  slug: string
}

export async function CategoryHeader({ slug }: CategoryHeaderProps) {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: { 
      parent: {
        include: {
          children: {
            orderBy: { displayOrder: 'asc' }
          }
        }
      },
      children: {
        orderBy: { displayOrder: 'asc' }
      }
    }
  })

  if (!category) {
    notFound()
  }

  const breadcrumbs = [
    ...(category.parent ? [{ name: category.parent.name, href: `/category/${category.parent.slug}` }] : []),
    { name: category.name, href: `/category/${category.slug}` }
  ]

  return (
    <div className="bg-slate-50 py-12 border-b border-slate-200 overflow-hidden">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start">
          <div className="flex-1 space-y-4">
            <Breadcrumbs items={breadcrumbs} />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-slate-900 tracking-tight">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed">
                {category.description}
              </p>
            )}
            {((category.children.length > 0) || (category.parent && category.parent.children.length > 1)) && (
              <div className="pt-4">
                <SubcategoryNav 
                  subcategories={(category.children.length > 0 ? category.children : category.parent?.children || []) as any} 
                  activeSlug={slug}
                />
              </div>
            )}
          </div>
          
          {category.imageUrl && (
            <div className="w-full lg:w-[400px] aspect-[4/3] relative rounded-2xl overflow-hidden shadow-xl ring-1 ring-slate-200">
              <Image
                src={category.imageUrl}
                alt={category.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
