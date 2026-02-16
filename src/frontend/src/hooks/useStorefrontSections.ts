import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Product } from '../backend';

export function useStorefrontSections() {
  const { actor, isFetching: isActorFetching } = useActor();

  const query = useQuery<Product[]>({
    queryKey: ['products', 'all'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isActorFetching,
    retry: 2,
    retryDelay: 1000,
  });

  const getSectionProducts = (sectionTag: string): Product[] => {
    return (query.data || []).filter((product) =>
      product.sectionTags.some((tag) => tag === sectionTag)
    );
  };

  return {
    allProducts: query.data || [],
    getSectionProducts,
    isLoading: query.isLoading || isActorFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
