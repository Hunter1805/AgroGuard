import React, { useEffect, useState } from 'react';
import { Save, UserRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ProfileSettings: React.FC = () => {
  const { profile, profileLoading, updateProfile } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  useEffect(() => { setName(profile?.name || ''); setPhone(profile?.phone || ''); }, [profile]);
  const save = async (event: React.FormEvent) => {
    event.preventDefault(); setMessage('');
    const result = await updateProfile({ name, phone });
    setMessage(result.error ? (result.error.message || 'Não foi possível salvar o perfil.') : 'Perfil atualizado com sucesso.');
  };
  if (profileLoading && !profile) return <div role="status" className="p-5 text-sm text-on-surface-variant">Carregando perfil...</div>;
  return <form onSubmit={save} className="max-w-2xl space-y-5 rounded-xl border-white/10 bg-surface-container p-5">
    <div className="flex items-center gap-3 border-b border-white/10 pb-4"><UserRound className="text-primary" size={20} /><div><h3 className="font-bold text-on-surface">Meu Perfil</h3><p className="text-xs text-on-surface-variant">Atualize os dados pessoais da sua conta.</p></div></div>
    <label className="block text-xs text-on-surface-variant">Nome completo<input required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-md border-white/10 bg-surface-container-highest p-2.5 text-sm text-on-surface" /></label>
    <label className="block text-xs text-on-surface-variant">E-mail<input readOnly value={profile?.email || ''} className="mt-1 w-full rounded-md border-white/10 bg-surface-container-highest p-2.5 text-sm text-on-surface-variant" /></label>
    <label className="block text-xs text-on-surface-variant">Telefone<input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 w-full rounded-md border-white/10 bg-surface-container-highest p-2.5 text-sm text-on-surface" /></label>
    <div className="text-xs text-on-surface-variant">Cargo/função: <strong className="text-on-surface">{profile?.role || 'Não informado'}</strong></div>
    <div className="flex items-center justify-between"><span role="status" className="text-xs text-primary">{message}</span><button type="submit" className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-white"><Save size={14} />Salvar alterações</button></div>
  </form>;
};
