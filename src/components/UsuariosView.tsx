import React from 'react';

export const UsuariosView: React.FC = () => {
  const users = [
    { name: 'João Silva', role: 'Administrador Geral', unit: 'Fazenda São João', status: 'Ativo', email: 'joao.silva@agroguard.com' },
    { name: 'Carlos Eduardo', role: 'Chefe de Oficina', unit: 'Oficina Central', status: 'Ativo', email: 'carlos.eduardo@agroguard.com' },
    { name: 'Mariana Costa', role: 'Gestora Financeira', unit: 'Sede Administrativa', status: 'Ativo', email: 'mariana.costa@agroguard.com' },
    { name: 'Lucas Pereira', role: 'Técnico de Campo', unit: 'Fazenda São João', status: 'Ativo', email: 'lucas.pereira@agroguard.com' },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-title-md text-[24px] font-semibold text-on-surface tracking-tight">Usuários & Permissões</h2>
          <p className="font-body-sm text-[13px] text-on-surface-variant/70 mt-0.5">Membros da equipe e controle de acesso por unidade.</p>
        </div>
      </div>

      <div className="glass-card rounded-xl border border-white/5 overflow-hidden">
        <table className="w-full text-[13px] text-left border-collapse">
          <thead>
            <tr className="text-on-surface-variant/60 font-mono-label text-[11px] uppercase bg-surface-container-highest/30 border-b border-white/5">
              <th className="p-4">NOME</th>
              <th className="p-4">E-MAIL</th>
              <th className="p-4">CARGO</th>
              <th className="p-4">UNIDADE</th>
              <th className="p-4">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((u, i) => (
              <tr key={i} className="hover:bg-surface-container-highest/30 transition-colors">
                <td className="p-4 font-medium text-on-surface">{u.name}</td>
                <td className="p-4 text-on-surface-variant/80 font-mono-label text-[12px]">{u.email}</td>
                <td className="p-4 text-on-surface-variant">{u.role}</td>
                <td className="p-4 text-on-surface-variant">{u.unit}</td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono-label bg-primary/10 text-primary border border-primary/20">
                    {u.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
