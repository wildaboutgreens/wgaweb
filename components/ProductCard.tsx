import Link from 'next/link';
import { formatPrice } from '@/lib/format';

interface Variant {
  id: string;
  price_paise: number;
  stock_qty: number;
  is_active: boolean;
}

interface ProductCardProps {
  slug: string;
  name: string;
  category: string;
  description?: string;
  variants: Variant[];
}

export default function ProductCard({ slug, name, category, description, variants }: ProductCardProps) {
  const activeVariants = variants.filter((v) => v.is_active);
  const lowestPrice = activeVariants.length > 0
    ? Math.min(...activeVariants.map((v) => v.price_paise))
    : 0;
  const allOutOfStock = activeVariants.every((v) => v.stock_qty === 0);

  return (
    <Link
      href={`/products/${slug}`}
      className="group block bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      {/* Image placeholder */}
      <div className="aspect-square bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <span className="text-5xl opacity-60">🌿</span>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">{category}</p>
        <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors mb-1">
          {name}
        </h3>
        {description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-2">{description}</p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-green-700">
            {lowestPrice > 0 ? `From ${formatPrice(lowestPrice)}` : 'Price TBD'}
          </span>
          {allOutOfStock && (
            <span className="text-xs font-medium text-red-500 bg-red-50 px-2 py-1 rounded-full">Out of stock</span>
          )}
        </div>
      </div>
    </Link>
  );
}
