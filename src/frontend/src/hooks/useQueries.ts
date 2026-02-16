import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Product } from '../backend';

export function useGetAllProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProductsBySection(section: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products', 'section', section],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProductsBySection(section);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProductById(id: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<Product | null>({
    queryKey: ['products', 'id', id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProductById(id);
    },
    enabled: !!actor && !isFetching,
  });
}
