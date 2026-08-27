import React, { useState } from 'react';
import { LockKeyhole, Mail } from 'lucide-react';
import { supabase } from '../../lib/supabase/supabase-client';
import { useAuth } from '../../context/AuthContext';

export const SecuritySettings: React.FC = () => {
  const { profile, logout } = useAuth();
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [confirm, setConfirm] = useState(''); const [message, setMessage] = useState('');
  const changeEmail = async (event: React.FormEvent) => { event.preventDefault(); setMessage(''); const { error } = await supabase.auth.updateUser({ email: email.trim() }); setMessage(error ? error.message : 'Solicitação enviada. Confirme o novo endereço de e-mail.'); };
  const changePassword = async (event: React.FormEvent) => { event.preventDefault(); setMessage(''); if (password.length < 8) return setMessage('A nova senha deve ter pelo menos 8 caracteres.'); if (password !== confirm) return setMessage('A confirmação da senha não confere.'); const { error } = await supabase.auth.updateUser({ password });   setMessage(error ? error.message : 'Senha alterada com sucesso.'); if (!error) { setPassword(''); setConfirm(''); }
  };
  return <div className="max-w-2xl space-y-5">
    <section className="rounded-xl border-white/10 bg-surface-container p-5"><div className="flex items-center gap-2 border-b border-white/10 pb-3"><LockKeyhole size={18} className="text-primary" /><h3 className="font-bold text-on-surface">Segurança</h3></div><p className="mt-4 text-xs text-on-surface-variant">E-mail da conta: <strong className="text-on-surface">{profile?.email || 'Não disponível'}</strong></p><p className="mt-2 text-xs text-on-surface-variant">Última alteração de senha: informação não fornecida pelo Supabase.</p></section>
    <form onSubmit={changeEmail} className="rounded-xl border-white/10 bg-surface-container p-5 space-y-3"><h4 className="flex items-center gap-2 font-semibold text-on-surface"><Mail size={16} />Alterar e-mail</h4><input required type="email" placeholder="Novo e-mail" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border-white/10 bg-surface-container-highest p-2.5 text-sm text-on-surface" /><button className="rounded-md bg-primary px-4 py-2 text-xs font-semibold text-white">Solicitar alteração</button></form>
    <form onSubmit={changePassword} className="rounded-xl border-white/10 bg-surface-container p-5 space-y-3"><h4 className="font-semibold text-on-surface">Alterar senha</h4><input required type="password" placeholder="Nova senha (mínimo 8 caracteres)" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-md border-white/10 bg-surface-container-highest p-2.5 text-sm text-on-surface" /><input required type="password" placeholder="Confirmar nova senha" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full rounded-md border-white/10 bg-surface-container-highest p-2.5 text-sm text-on-surface" /><button className="rounded-md bg-primary px-4 py-2 text-xs font-semibold text-white">Alterar senha</button></form>
    <p role="status" className="text-xs text-primary">{message}</p><button type="button" onClick={logout} className="rounded-md border-white/10 px-4 py-2 text-xs text-on-surface">Encerrar sessão atual</button>
  </div>;
};
