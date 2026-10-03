import React from 'react';

export default function Footer() {
  return (
    <footer className="relative z-50 text-gray-700 px-8 py-12 bg-gray-50 w-full dark:bg-slate-950 dark:text-slate-300">
      <div className="mx-auto grid md:grid-cols-5 gap-8 container">
        {/* العمود الأول: وصف المتجر */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-4">ShopMart</h2>
          <p className="mb-2">وجهتك الشاملة لأحدث المنتجات التقنية والموضة ونمط الحياة.</p>
          <p className="mb-2">123 Shop Street, Octoper City, DC 12345</p>
<p className="mb-2 flex items-center gap-2">
  <a 
    href="https://wa.me/201102555369" 
    target="_blank" 
    rel="noopener noreferrer" 
    className="flex items-center gap-2 hover:text-green-500 transition-all duration-200"
  >
    {/* أيقونة الواتساب */}
    <svg className="w-5 h-5 fill-current text-green-500" viewBox="0 0 24 24">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
    </svg>
    <span>(+20) 1102555369</span>
  </a>
  <span>YoussefKhalifa - Front-End & Oracle Developer</span>
</p>
<p className="mb-2">
  📧 <a href="mailto:za011022183901@gmail.com" className="hover:underline transition-all">
    za011022183901@gmail.com
  </a>
</p>        </div>

        {/* SHOP */}
        <div>
          <h3 className="font-semibold mb-3">SHOP</h3>
          <ul className="space-y-2">
            {["Electronics", "Fashion", "Home & Garden", "Sports", "Deals"].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="block px-2 py-1 rounded-md transition duration-200 hover:bg-gray-100 hover:text-green-500 dark:hover:bg-slate-800"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* CUSTOMER SERVICE */}
        <div>
          <h3 className="font-semibold mb-3">CUSTOMER SERVICE</h3>
          <ul className="space-y-2">
            {["Contact Us", "Help Center", "Track Your Order", "Returns & Exchanges", "Size Guide"].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="block px-2 py-1 rounded-md transition duration-200 hover:bg-gray-100 hover:text-green-500"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* POLICIES */}
        <div>
          <h3 className="font-semibold mb-3">POLICIES</h3>
          <ul className="space-y-2">
            {["Privacy Policy", "Terms of Service", "Cookie Policy", "Shipping Policy", "Refund Policy"].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="block px-2 py-1 rounded-md transition duration-200 hover:bg-gray-100 hover:text-green-500"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
