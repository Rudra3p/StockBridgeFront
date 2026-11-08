import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-white to-slate-50 py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200 mb-6">
            B2B Surplus Inventory Marketplace
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Sell leftover stock without damaging your brand
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            StockBridge connects manufacturers, distributors, and wholesalers with verified retailers to liquidate surplus inventory discreetly, profitably, and without channel conflict.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-emerald-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              Register Business
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-8 py-3.5 text-base font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              Log In
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            How It Works
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            A secure 3-step pipeline designed for genuine business-to-business inventory liquidation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="flex flex-col items-start p-6 bg-white rounded-xl border border-slate-200 shadow-sm transition hover:border-emerald-300 hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 font-bold text-lg mb-4">
              1
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              List Surplus Inventory
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Manufacturers and distributors list leftover production runs, discontinued batches, or overstock units with full control over minimum order quantities.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-start p-6 bg-white rounded-xl border border-slate-200 shadow-sm transition hover:border-emerald-300 hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 font-bold text-lg mb-4">
              2
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Verified Retailers Browse
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Only GST-verified retailers, shop owners, and resellers can view wholesale pricing and place bids, preventing consumer price erosion and protecting brand value.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-start p-6 bg-white rounded-xl border border-slate-200 shadow-sm transition hover:border-emerald-300 hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 font-bold text-lg mb-4">
              3
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Clear Storage & Recover Capital
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Complete transactions seamlessly, free up costly warehouse space, and unlock tied-up working capital back into your active operations.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
