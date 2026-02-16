import { Truck, ShieldCheck, MessageCircle } from 'lucide-react';

export default function TrustInfo() {
  return (
    <section className="border-y border-border/40 bg-muted/30 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Amazon Fast Delivery */}
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Truck className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">Amazon Fast Delivery</h3>
            <p className="text-sm text-muted-foreground">
              Enjoy fast, reliable shipping with Amazon Prime and standard delivery options on all products.
            </p>
          </div>

          {/* Trusted Products */}
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">Trusted Products</h3>
            <p className="text-sm text-muted-foreground">
              Every product is carefully curated from Amazon's trusted marketplace with verified sellers and quality guarantees.
            </p>
          </div>

          {/* Support & Reviews */}
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">Support & Reviews</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Check detailed Amazon customer reviews and ratings before you buy. Need help? Contact us at:
            </p>
            <p className="text-sm font-medium text-foreground">support@luxeoushub.example</p>
          </div>
        </div>
      </div>
    </section>
  );
}
