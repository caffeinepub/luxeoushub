export default function SiteFooter() {
  return (
    <footer className="border-t border-border/40 bg-muted/30 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Luxeoushub. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
