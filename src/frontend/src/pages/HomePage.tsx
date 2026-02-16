import { useRef } from 'react';
import { ShoppingBag, Shirt, Gem, Sparkles, Flame, Star, Settings, AlertCircle, RefreshCw } from 'lucide-react';
import ProductSection from '../components/storefront/ProductSection';
import AffiliateDisclosure from '../components/storefront/AffiliateDisclosure';
import TrustInfo from '../components/storefront/TrustInfo';
import SiteFooter from '../components/layout/SiteFooter';
import { useStorefrontSections } from '../hooks/useStorefrontSections';
import { useBackendHealth } from '../hooks/useBackendHealth';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';

const sections = [
  { id: 'recommended', title: 'Shop Recommended Products', icon: Sparkles, tag: 'Recommended' },
  { id: 'bags', title: 'Best Bags Deals', icon: ShoppingBag, tag: 'Best Bags Deals' },
  { id: 'clothes', title: 'Trending Clothes', icon: Shirt, tag: 'Trending Clothes' },
  { id: 'jewelry', title: 'Top Jewelry Picks', icon: Gem, tag: 'Top Jewelry Picks' },
  { id: 'new', title: 'New Finds', icon: Sparkles, tag: 'New Finds' },
  { id: 'offers', title: "Today's Offers", icon: Flame, tag: 'Offers' },
  { id: 'bestsellers', title: 'Best Sellers', icon: Star, tag: 'Best Sellers' },
];

interface HomePageProps {
  onNavigateToDashboard: () => void;
}

export default function HomePage({ onNavigateToDashboard }: HomePageProps) {
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const { getSectionProducts, isLoading, isError, refetch: refetchProducts } = useStorefrontSections();
  const { isUnreachable, refetch: refetchHealth } = useBackendHealth();

  const showConnectivityError = isError || isUnreachable;

  const scrollToSection = (sectionId: string) => {
    sectionRefs.current[sectionId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleRetry = async () => {
    await Promise.all([refetchHealth(), refetchProducts()]);
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="/assets/generated/luxeoushub-logo.dim_512x512.png" 
                alt="Luxeoushub" 
                className="h-10 w-auto"
              />
              <div>
                <h1 className="text-xl font-bold tracking-tight text-foreground">Luxeoushub</h1>
                <p className="text-xs text-muted-foreground">Amazon Affiliate Store</p>
              </div>
            </div>
            <Button variant="outline" onClick={onNavigateToDashboard} className="gap-2">
              <Settings className="h-4 w-4" />
              Seller Dashboard
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="border-t border-border/40 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="nav-link flex items-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <section.icon className="h-4 w-4" />
                  {section.title}
                </button>
              ))}
            </div>
          </div>
        </nav>
      </header>

      {/* Connectivity Error Banner */}
      {showConnectivityError && (
        <div className="border-b border-destructive/20 bg-destructive/5">
          <div className="container mx-auto px-4 py-6">
            <Alert variant="destructive" className="border-destructive/50">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle className="text-lg font-semibold">Unable to Connect</AlertTitle>
              <AlertDescription className="mt-2 space-y-3">
                <p className="text-sm">
                  We're having trouble reaching the Luxeoushub storefront. This could be a temporary network issue or a configuration problem.
                </p>
                <div className="rounded-md bg-background/50 p-3 text-xs font-mono">
                  <div className="mb-1 text-muted-foreground">Current URL:</div>
                  <div className="break-all text-foreground">{currentUrl}</div>
                  <div className="mt-2 text-muted-foreground">Origin:</div>
                  <div className="break-all text-foreground">{currentOrigin}</div>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <Button 
                    onClick={handleRetry} 
                    variant="default"
                    size="sm"
                    className="gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Retry Connection
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    If this persists, please check the troubleshooting guide or contact support.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 opacity-30">
          <img 
            src="/assets/generated/luxeoushub-hero.dim_1600x600.png" 
            alt="" 
            className="h-full w-full object-cover"
          />
        </div>
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-2xl">
            <h2 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Curated Luxury
              <span className="block text-primary">For Every Occasion</span>
            </h2>
            <p className="text-lg text-muted-foreground md:text-xl">
              Discover handpicked products from Amazon's finest collections. Quality, style, and value in every selection.
            </p>
          </div>
        </div>
      </section>

      {/* Product Sections */}
      <main className="container mx-auto px-4 py-12">
        {sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            ref={(el) => {
              sectionRefs.current[section.id] = el;
            }}
            className="mb-16 scroll-mt-32"
          >
            <ProductSection
              title={section.title}
              icon={section.icon}
              products={getSectionProducts(section.tag)}
              isLoading={isLoading}
            />
          </section>
        ))}
      </main>

      {/* Trust Info */}
      <TrustInfo />

      {/* Affiliate Disclosure */}
      <AffiliateDisclosure />

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
