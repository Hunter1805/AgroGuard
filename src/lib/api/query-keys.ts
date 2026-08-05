export const queryKeys = {
  organizations: {
    all: ['organizations'] as const,
    detail: (id: string) => ['organizations', id] as const,
  },
  masterData: {
    all: ['masterData'] as const,
  },
  users: {
    all: ['users'] as const,
    list: (params: Record<string, any>) => ['users', 'list', params] as const,
    detail: (id: string) => ['users', 'detail', id] as const,
    roles: ['users', 'roles'] as const,
  },
  equipment: {
    all: ['equipment'] as const,
    list: (params: Record<string, any>) => ['equipment', 'list', params] as const,
    detail: (id: string) => ['equipment', 'detail', id] as const,
  },
  workOrders: {
    all: ['workOrders'] as const,
    list: (params: Record<string, any>) => ['workOrders', 'list', params] as const,
    detail: (id: string) => ['workOrders', 'detail', id] as const,
  },
  stock: {
    all: ['stock'] as const,
    list: (params: Record<string, any>) => ['stock', 'list', params] as const,
  },
};
