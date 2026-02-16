import { Info } from 'lucide-react';

export default function AffiliateDisclosure() {
  return (
    <section className="border-t border-border/40 bg-muted/30 py-8">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <div className="flex gap-4 rounded-lg border border-border/40 bg-card p-6">
            <Info className="h-5 w-5 flex-shrink-0 text-primary" />
            <div className="text-sm text-muted-foreground">
              <p className="mb-2 font-semibold text-foreground">Affiliate Disclosure</p>
              <p>
                Luxeoushub is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com. As an Amazon Associate, we earn from qualifying purchases. This means that when you click on certain links on this site and make a purchase, we may receive a small commission at no additional cost to you. We only recommend products we believe will add value to our readers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
