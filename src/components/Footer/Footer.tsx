import React from 'react';

export default function Footer() {
  return (
    <footer className="relative z-50 text-gray-700 px-8 py-12 bg-gray-50 w-full">
      <div className="mx-auto grid md:grid-cols-5 gap-8 container">
        {/* العمود الأول: وصف المتجر */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-4">ShopMart</h2>
          <p className="mb-2">وجهتك الشاملة لأحدث المنتجات التقنية والموضة ونمط الحياة.</p>
          <p className="mb-2">123 Shop Street, Octoper City, DC 12345</p>
          <p className="mb-2">📞 (+20) 1102555369 YoussefKhalifa </p>
          <p>📧 support@shopmart.com</p>
        </div>

        {/* SHOP */}
        <div>
          <h3 className="font-semibold mb-3">SHOP</h3>
          <ul className="space-y-2">
            {["Electronics", "Fashion", "Home & Garden", "Sports", "Deals"].map((item) => (
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
