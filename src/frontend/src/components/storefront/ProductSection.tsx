import { type LucideIcon } from 'lucide-react';
import ProductCard from './ProductCard';
import type { Product } from '../../backend';

interface ProductSectionProps {
  title: string;
  icon: LucideIcon;
  products: Product[];
  isLoading: boolean;
}

export default function ProductSection({ title, icon: Icon, products, isLoading }: ProductSectionProps) {
  if (isLoading) {
    return (
      <div>
        <div className="mb-6 flex items-center gap-3">
          <Icon className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">{title}</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="overflow-hidden rounded-lg border border-border bg-card">
              <div className="aspect-square animate-pulse bg-muted" />
              <div className="p-4 space-y-3">
                <div className="h-4 animate-pulse rounded bg-muted" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                <div className="h-10 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div>
        <div className="mb-6 flex items-center gap-3">
          <Icon className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">{title}</h2>
        </div>
        <div className="rounded-lg border border-dashed border-border bg-muted/30 p-12 text-center">
          <Icon className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
          <p className="text-muted-foreground">No products available in this section yet. Check back soon!</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Icon className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">{title}</h2>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
