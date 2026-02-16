import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import {
  useGetCallerRole,
  useAddProduct,
  useUpdateProduct,
  useDeleteProduct,
  useGetAllProductsForSeller,
} from '../hooks/useSellerProducts';
import LoginButton from '../components/auth/LoginButton';
import SiteFooter from '../components/layout/SiteFooter';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Skeleton } from '../components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import { Home, Plus, Edit, Trash2, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { Product } from '../backend';

const AVAILABLE_SECTIONS = [
  'Recommended',
  'Best Bags Deals',
  'Trending Clothes',
  'Top Jewelry Picks',
  'New Finds',
  'Offers',
  'Best Sellers',
];

interface SellerDashboardPageProps {
  onNavigateToHome: () => void;
}

export default function SellerDashboardPage({ onNavigateToHome }: SellerDashboardPageProps) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  const { data: userRole, isLoading: roleLoading } = useGetCallerRole();
  const { data: products = [], isLoading: productsLoading } = useGetAllProductsForSeller();
  const addProductMutation = useAddProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    amazonUrl: '',
    badge: '',
    sectionTags: [] as string[],
  });

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState<Product | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const isAuthorized = isAuthenticated && (userRole === 'user' || userRole === 'admin');

  const handleSectionToggle = (section: string) => {
    setFormData((prev) => ({
      ...prev,
      sectionTags: prev.sectionTags.includes(section)
        ? prev.sectionTags.filter((s) => s !== section)
        : [...prev.sectionTags, section],
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      imageUrl: '',
      amazonUrl: '',
      badge: '',
      sectionTags: [],
    });
    setEditingProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!formData.title.trim() || !formData.imageUrl.trim() || !formData.amazonUrl.trim()) {
      setErrorMessage('Title, Image URL, and Amazon URL are required.');
      return;
    }

    if (formData.sectionTags.length === 0) {
      setErrorMessage('Please select at least one section tag.');
      return;
    }

    try {
      if (editingProduct) {
        await updateProductMutation.mutateAsync({
          id: editingProduct.id,
          title: formData.title,
          imageUrl: formData.imageUrl,
          amazonUrl: formData.amazonUrl,
          sectionTags: formData.sectionTags,
          badge: formData.badge.trim() || null,
        });
        setSuccessMessage('Product updated successfully!');
      } else {
        await addProductMutation.mutateAsync({
          title: formData.title,
          imageUrl: formData.imageUrl,
          amazonUrl: formData.amazonUrl,
          sectionTags: formData.sectionTags,
          badge: formData.badge.trim() || null,
        });
        setSuccessMessage('Product added successfully!');
      }
      resetForm();
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error: any) {
      const errorMsg = error?.message || 'An error occurred. Please try again.';
      setErrorMessage(errorMsg);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      imageUrl: product.imageUrl,
      amazonUrl: product.amazonUrl,
      badge: product.badge || '',
      sectionTags: [...product.sectionTags],
    });
    setSuccessMessage('');
    setErrorMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async () => {
    if (!deleteConfirmProduct) return;

    setSuccessMessage('');
    setErrorMessage('');

    try {
      await deleteProductMutation.mutateAsync(deleteConfirmProduct.id);
      setSuccessMessage('Product deleted successfully!');
      setDeleteConfirmProduct(null);
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to delete product. Please try again.';
      setErrorMessage(errorMsg);
      setDeleteConfirmProduct(null);
    }
  };

  const isSubmitting = addProductMutation.isPending || updateProductMutation.isPending;

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
                <h1 className="text-xl font-bold tracking-tight text-foreground">Seller Dashboard</h1>
                <p className="text-xs text-muted-foreground">Manage your products</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={onNavigateToHome} className="gap-2">
                <Home className="h-4 w-4" />
                Back to Store
              </Button>
              <LoginButton />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Authentication & Authorization Check */}
        {!isAuthenticated && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please log in to access the seller dashboard. Only authorized sellers can create and manage products.
            </AlertDescription>
          </Alert>
        )}

        {isAuthenticated && roleLoading && (
          <div className="mb-6">
            <Skeleton className="h-16 w-full" />
          </div>
        )}

        {isAuthenticated && !roleLoading && !isAuthorized && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You do not have seller access. Please contact the administrator to request seller permissions.
            </AlertDescription>
          </Alert>
        )}

        {/* Success/Error Messages */}
        {successMessage && (
          <Alert className="mb-6 border-green-500 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        {errorMessage && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {/* Product Form */}
        {isAuthorized && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </CardTitle>
              <CardDescription>
                {editingProduct
                  ? 'Update the product details below'
                  : 'Fill in the details to add a new product to your store'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      Product Title <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter product title"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="badge">Badge (Optional)</Label>
                    <Input
                      id="badge"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      placeholder="e.g., Best Seller, New"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">
                      Image URL <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="imageUrl"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amazonUrl">
                      Amazon URL <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="amazonUrl"
                      value={formData.amazonUrl}
                      onChange={(e) => setFormData({ ...formData, amazonUrl: e.target.value })}
                      placeholder="https://amazon.com/..."
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>
                    Section Tags <span className="text-destructive">*</span>
                  </Label>
                  <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                    {AVAILABLE_SECTIONS.map((section) => (
                      <div key={section} className="flex items-center space-x-2">
                        <Checkbox
                          id={section}
                          checked={formData.sectionTags.includes(section)}
                          onCheckedChange={() => handleSectionToggle(section)}
                          disabled={isSubmitting}
                        />
                        <Label
                          htmlFor={section}
                          className="cursor-pointer text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {section}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </Button>
                  {editingProduct && (
                    <Button type="button" variant="outline" onClick={resetForm} disabled={isSubmitting}>
                      Cancel Edit
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Products List */}
        {isAuthorized && (
          <Card>
            <CardHeader>
              <CardTitle>Your Products</CardTitle>
              <CardDescription>Manage and edit your existing products</CardDescription>
            </CardHeader>
            <CardContent>
              {productsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">No products yet. Add your first product above!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {products.map((product) => (
                    <div
                      key={product.id.toString()}
                      className="flex items-center gap-4 rounded-lg border border-border p-4"
                    >
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="h-20 w-20 rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{product.title}</h3>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {product.sectionTags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        {product.badge && (
                          <span className="mt-1 inline-block rounded bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
                            {product.badge}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(product)}
                          disabled={isSubmitting || deleteProductMutation.isPending}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setDeleteConfirmProduct(product)}
                          disabled={isSubmitting || deleteProductMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirmProduct} onOpenChange={() => setDeleteConfirmProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{deleteConfirmProduct?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleteProductMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
