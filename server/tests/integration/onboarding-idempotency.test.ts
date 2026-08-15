import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// State store para simular o banco de dados em memória
const store = {
  users: [] as any[],
  organizations: [] as any[],
  companies: [] as any[],
  units: [] as any[],
  memberships: [] as any[],
  roles: [] as any[],
  userRoles: [] as any[],
  organizationScopes: [] as any[],
  userPreferences: [] as any[],
  organizationSettings: [] as any[],
  onboardingStates: [] as any[],
  numberSequences: [] as any[],
  auditLogs: [] as any[],
};

function resetStore() {
  store.users.length = 0;
  store.organizations.length = 0;
  store.companies.length = 0;
  store.units.length = 0;
  store.memberships.length = 0;
  store.roles.length = 0;
  store.userRoles.length = 0;
  store.organizationScopes.length = 0;
  store.userPreferences.length = 0;
  store.organizationSettings.length = 0;
  store.onboardingStates.length = 0;
  store.numberSequences.length = 0;
  store.auditLogs.length = 0;
}

// Mock do @prisma/client mantendo os enums reais através de importOriginal
vi.mock('@prisma/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@prisma/client')>();

  const createTxObject = () => ({
    $executeRaw: vi.fn(async () => []),
    user: {
      findUnique: vi.fn(async ({ where, include }: any) => {
        const user = store.users.find(
          (u) =>
            (where.authUserId && u.authUserId === where.authUserId) ||
            (where.email && u.email === where.email) ||
            (where.id && u.id === where.id)
        );
        if (!user) return null;
        const result = { ...user };
        if (include?.memberships) {
          result.memberships = store.memberships
            .filter(
              (m) =>
                m.userId === user.id &&
                (!include.memberships.where?.status || m.status === include.memberships.where.status)
            )
            .map((m) => ({
              ...m,
              organization: store.organizations.find((o) => o.id === m.organizationId),
            }));
        }
        return result;
      }),
      create: vi.fn(async ({ data }: any) => {
        const newUser = { id: `user-id-${Date.now()}-${Math.random()}`, status: 'ativo', ...data };
        store.users.push(newUser);
        return newUser;
      }),
      update: vi.fn(async ({ where, data }: any) => {
        const user = store.users.find((u) => u.id === where.id || u.authUserId === where.authUserId);
        if (user) {
          Object.assign(user, data);
        }
        return user;
      }),
    },
    organizationMembership: {
      findFirst: vi.fn(async ({ where }: any) => {
        return (
          store.memberships.find(
            (m) => m.userId === where.userId && (!where.status || m.status === where.status)
          ) || null
        );
      }),
      create: vi.fn(async ({ data }: any) => {
        const newMem = { id: `mem-id-${Date.now()}-${Math.random()}`, status: 'ativo', ...data };
        store.memberships.push(newMem);
        return newMem;
      }),
    },
    organization: {
      create: vi.fn(async ({ data }: any) => {
        const newOrg = { id: `org-id-${Date.now()}-${Math.random()}`, status: 'ativo', ...data };
        store.organizations.push(newOrg);
        return newOrg;
      }),
    },
    company: {
      create: vi.fn(async ({ data }: any) => {
        const newComp = { id: `comp-id-${Date.now()}-${Math.random()}`, status: 'ativo', ...data };
        store.companies.push(newComp);
        return newComp;
      }),
    },
    unit: {
      create: vi.fn(async ({ data }: any) => {
        const newUnit = { id: `unit-id-${Date.now()}-${Math.random()}`, status: 'ativo', ...data };
        store.units.push(newUnit);
        return newUnit;
      }),
    },
    role: {
      findUnique: vi.fn(async ({ where }: any) => {
        return store.roles.find((r) => r.code === where.code) || null;
      }),
      create: vi.fn(async ({ data }: any) => {
        const newRole = { id: `role-id-${Date.now()}-${Math.random()}`, ...data };
        store.roles.push(newRole);
        return newRole;
      }),
    },
    userRole: {
      findUnique: vi.fn(async ({ where }: any) => {
        return (
          store.userRoles.find(
            (ur) => ur.userId === where.userId_roleId.userId && ur.roleId === where.userId_roleId.roleId
          ) || null
        );
      }),
      create: vi.fn(async ({ data }: any) => {
        const newUserRole = { ...data };
        store.userRoles.push(newUserRole);
        return newUserRole;
      }),
    },
    organizationScope: {
      create: vi.fn(async ({ data }: any) => {
        const newScope = { id: `scope-id-${Date.now()}-${Math.random()}`, ...data };
        store.organizationScopes.push(newScope);
        return newScope;
      }),
    },
    userPreference: {
      create: vi.fn(async ({ data }: any) => {
        const newPref = { id: `pref-id-${Date.now()}-${Math.random()}`, ...data };
        store.userPreferences.push(newPref);
        return newPref;
      }),
    },
    organizationSetting: {
      create: vi.fn(async ({ data }: any) => {
        const newSetting = { id: `setting-id-${Date.now()}-${Math.random()}`, ...data };
        store.organizationSettings.push(newSetting);
        return newSetting;
      }),
    },
    onboardingState: {
      create: vi.fn(async ({ data }: any) => {
        const newState = { id: `onb-id-${Date.now()}-${Math.random()}`, ...data };
        store.onboardingStates.push(newState);
        return newState;
      }),
    },
    numberSequence: {
      upsert: vi.fn(async ({ where, create, update }: any) => {
        let seq = store.numberSequences.find((s) => s.entityType === where.entityType);
        if (!seq) {
          seq = { id: `seq-id-${Date.now()}-${Math.random()}`, ...create };
          store.numberSequences.push(seq);
        } else {
          Object.assign(seq, update);
        }
        return seq;
      }),
    },
    auditLog: {
      create: vi.fn(async ({ data }: any) => {
        const newLog = { id: `audit-id-${Date.now()}-${Math.random()}`, ...data };
        store.auditLogs.push(newLog);
        return newLog;
      }),
    },
  });

  const MockPrismaClient = vi.fn().mockImplementation(() => {
    const txObj = createTxObject();
    return {
      ...txObj,
      user: {
        ...txObj.user,
        findFirst: vi.fn(async ({ where, include }: any) => {
          const user = store.users.find((u) => {
            if (where.OR) {
              return where.OR.some(
                (cond: any) =>
                  (cond.authUserId && u.authUserId === cond.authUserId) ||
                  (cond.email && u.email === cond.email)
              );
            }
            return (where.authUserId && u.authUserId === where.authUserId) || (where.email && u.email === where.email);
          });
          if (!user) return null;
          const result = { ...user };
          if (include?.userRoles) {
            result.userRoles = store.userRoles
              .filter((ur) => ur.userId === user.id)
              .map((ur) => ({
                ...ur,
                role: store.roles.find((r) => r.id === ur.roleId) || { code: 'admin' },
              }));
          }
          return result;
        }),
      },
      organizationMembership: {
        ...txObj.organizationMembership,
        findFirst: vi.fn(async ({ where, include }: any) => {
          const mem = store.memberships.find(
            (m) => m.userId === where.userId && (!where.status || m.status === where.status)
          );
          if (!mem) return null;
          const result = { ...mem };
          if (include?.scope) {
            result.scope = store.organizationScopes.find((s) => s.membershipId === mem.id);
          }
          return result;
        }),
      },
      company: {
        ...txObj.company,
        findMany: vi.fn(async ({ where }: any) => {
          return store.companies.filter((c) => c.organizationId === where.organizationId);
        }),
      },
      unit: {
        ...txObj.unit,
        findMany: vi.fn(async ({ where }: any) => {
          return store.units.filter((u) => u.organizationId === where.organizationId);
        }),
      },
      farm: {
        findMany: vi.fn(async () => []),
      },
      onboardingState: {
        ...txObj.onboardingState,
        findUnique: vi.fn(async ({ where }: any) => {
          return store.onboardingStates.find((o) => o.organizationId === where.organizationId) || null;
        }),
        update: vi.fn(async ({ where, data }: any) => {
          const state = store.onboardingStates.find((o) => o.organizationId === where.organizationId);
          if (state) {
            Object.assign(state, data);
          }
          return state;
        }),
      },
      $transaction: vi.fn(async (cb: any) => {
        return await cb(createTxObject());
      }),
    };
  });

  return {
    ...actual,
    PrismaClient: MockPrismaClient,
  };
});

// Mock do @supabase/supabase-js
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn().mockReturnValue({
    auth: {
      getUser: vi.fn(async (_token: string) => {
        return {
          data: {
            user: {
              id: 'auth-user-piloto-001',
              email: 'teste.piloto@agroguard.com',
            },
          },
          error: null,
        };
      }),
      admin: {
        getUserById: vi.fn(async (id: string) => {
          return {
            data: {
              user: {
                id,
                email: 'teste.piloto@agroguard.com',
                user_metadata: {
                  name: 'Teste Piloto',
                },
              },
            },
            error: null,
          };
        }),
      },
    },
  }),
}));

import { buildApp } from '../../src/app';

describe('Teste Automatizado de Idempotência do Onboarding (POST /api/v1/onboarding/provision)', () => {
  let app: Awaited<ReturnType<typeof buildApp>>;

  beforeEach(async () => {
    resetStore();
    app = await buildApp();
  });

  afterEach(async () => {
    await app.close();
  });

  it('deve garantir a idempotência executando 3 chamadas consecutivas e uma 4ª chamada com onboarding concluído', async () => {
    const authHeaders = { authorization: 'Bearer mock-jwt-token-piloto' };
    const payload = {
      ownerName: 'Teste Piloto',
      organizationName: 'Fazenda Piloto Zero',
      workspaceName: 'Workspace Piloto Zero',
    };

    // --- EXECUÇÃO 1: PRIMEIRA CHAMADA (Criando o ambiente) ---
    const response1 = await app.inject({
      method: 'POST',
      url: '/api/v1/onboarding/provision',
      headers: authHeaders,
      payload,
    });

    expect(response1.statusCode).toBe(201);
    const body1 = JSON.parse(response1.body);
    expect(body1.data).toBeDefined();
    expect(body1.data.message).toBe('Ambiente criado com sucesso!');
    const organizationId1 = body1.data.organizationId;
    expect(organizationId1).toBeDefined();

    // Verificação de entidades criadas após a 1ª chamada
    expect(store.organizations.length).toBe(1);
    expect(store.memberships.length).toBe(1);
    expect(store.companies.length).toBe(1);

    // --- EXECUÇÃO 2: SEGUNDA CHAMADA CONSECUTIVA (Idempotente) ---
    const response2 = await app.inject({
      method: 'POST',
      url: '/api/v1/onboarding/provision',
      headers: authHeaders,
      payload,
    });

    expect(response2.statusCode).toBe(200);
    const body2 = JSON.parse(response2.body);
    expect(body2.data.message).toBe('Ambiente já criado. Continuando seu acesso...');
    const organizationId2 = body2.data.organizationId;
    expect(organizationId2).toBe(organizationId1);

    // Verificação que NENHUMA segunda entidade foi criada
    expect(store.organizations.length).toBe(1);
    expect(store.memberships.length).toBe(1);
    expect(store.companies.length).toBe(1);

    // --- EXECUÇÃO 3: TERCEIRA CHAMADA CONSECUTIVA (Idempotente) ---
    const response3 = await app.inject({
      method: 'POST',
      url: '/api/v1/onboarding/provision',
      headers: authHeaders,
      payload,
    });

    expect(response3.statusCode).toBe(200);
    const body3 = JSON.parse(response3.body);
    expect(body3.data.message).toBe('Ambiente já criado. Continuando seu acesso...');
    const organizationId3 = body3.data.organizationId;
    expect(organizationId3).toBe(organizationId1);

    // Verificação que NENHUMA segunda entidade foi criada
    expect(store.organizations.length).toBe(1);
    expect(store.memberships.length).toBe(1);
    expect(store.companies.length).toBe(1);

    // --- EXECUÇÃO 4: QUARTA CHAMADA APÓS ONBOARDING CONCLUÍDO ---
    // Simular que o usuário concluiu todas as etapas do onboarding
    if (store.onboardingStates.length > 0) {
      store.onboardingStates[0].completed = true;
      store.onboardingStates[0].currentStep = 4;
      store.onboardingStates[0].stepsCompleted = {
        step1: true,
        step2: true,
        step3: true,
        step4: true,
      };
    }

    const response4 = await app.inject({
      method: 'POST',
      url: '/api/v1/onboarding/provision',
      headers: authHeaders,
      payload,
    });

    expect(response4.statusCode).toBe(200);
    const body4 = JSON.parse(response4.body);
    expect(body4.data.message).toBe('Ambiente já criado. Continuando seu acesso...');
    const organizationId4 = body4.data.organizationId;
    expect(organizationId4).toBe(organizationId1);

    // Verificação final do estado das entidades no sistema:
    // Deve haver EXATAMENTE 1 Organization, 1 Membership principal e 1 Company/workspace
    expect(store.organizations.length).toBe(1);
    expect(store.memberships.length).toBe(1);
    expect(store.companies.length).toBe(1);

    console.log('✅ TESTE DE IDEMPOTÊNCIA DO ONBOARDING CONCLUÍDO COM SUCESSO:');
    console.log(`- 1ª Chamada (Status ${response1.statusCode}): Organization ID = ${organizationId1}`);
    console.log(`- 2ª Chamada (Status ${response2.statusCode}): Reutilizou Organization ID = ${organizationId2}`);
    console.log(`- 3ª Chamada (Status ${response3.statusCode}): Reutilizou Organization ID = ${organizationId3}`);
    console.log(`- 4ª Chamada (Onboarding Concluído, Status ${response4.statusCode}): Reutilizou Organization ID = ${organizationId4}`);
    console.log(`- Total de Organizations: ${store.organizations.length}`);
    console.log(`- Total de Memberships: ${store.memberships.length}`);
    console.log(`- Total de Companies/Workspaces: ${store.companies.length}`);
  });
});
