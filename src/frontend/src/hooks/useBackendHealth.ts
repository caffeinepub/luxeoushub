import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useBackendHealth() {
  const { actor, isFetching: isActorFetching } = useActor();

  const query = useQuery<string>({
    queryKey: ['backend', 'health'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.healthCheck();
    },
    enabled: !!actor && !isActorFetching,
    retry: 2,
    retryDelay: 1000,
  });

  return {
    ...query,
    isHealthy: query.isSuccess && query.data === 'OK',
    isUnreachable: query.isError,
  };
}
