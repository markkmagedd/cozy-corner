import { Navbar } from "@/components/storefront/Navbar"
import { Footer } from "@/components/storefront/Footer"

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
           <div className="animate-pulse flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/2 h-[500px] bg-slate-200 rounded-lg"></div>
              <div className="w-full md:w-1/2 flex flex-col gap-4 mt-8 md:mt-0">
                 <div className="h-10 bg-slate-200 w-3/4 rounded"></div>
                 <div className="h-6 bg-slate-200 w-1/4 rounded"></div>
                 <div className="h-32 bg-slate-200 w-full rounded mt-6"></div>
              </div>
           </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
