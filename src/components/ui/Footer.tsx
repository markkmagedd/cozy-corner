export function Footer() {
  return (
    <footer className="bg-muted py-20 mt-20">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 flex items-center justify-center rounded-2xl bg-black text-white italic font-black text-lg">H</div>
            <span className="font-extrabold text-xl tracking-tighter uppercase italic">Hotel Shop</span>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Curated premium clothing and sports equipment for those who love to explore and stay active. Modern design meets functional excellence.
          </p>
        </div>
        
        <div>
          <h4 className="font-bold text-lg mb-6">Shop Categories</h4>
          <ul className="space-y-4 text-muted-foreground">
            {['Men\'s Clothing', 'Women\'s Clothing', 'Outerwear', 'Footwear', 'Equipment'].map(item => (
              <li key={item} className="hover:text-black cursor-pointer transition-colors">{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6">Customer Care</h4>
          <ul className="space-y-4 text-muted-foreground">
            {['Shipping Policy', 'Returns & Exchanges', 'Size Guide', 'Contact Us'].map(item => (
              <li key={item} className="hover:text-black cursor-pointer transition-colors">{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6">Stay Connected</h4>
          <p className="text-muted-foreground mb-4 leading-relaxed">Subscribe to receive updates, access to exclusive deals, and more.</p>
          <div className="flex flex-col gap-2">
            <input 
              type="email" 
              placeholder="Email address" 
              className="bg-white border-none rounded-2xl h-14 px-6 focus:ring-2 focus:ring-black outline-none transition-all"
            />
            <button className="bg-black text-white h-14 rounded-2xl font-bold hover:scale-[1.01] transition-all">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-20 pt-8 border-t flex flex-col md:flex-row items-center justify-between text-muted-foreground text-sm gap-4">
        <p>&copy; {new Date().getFullYear()} Hotel Shop. All rights reserved.</p>
        <div className="flex gap-8">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}
