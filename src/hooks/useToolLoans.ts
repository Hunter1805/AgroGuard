import { useState, useEffect, useCallback } from 'react';
import type { ToolLoan, ToolLoanFilter } from '../types/tool-loan';
import { toolLoanService } from '../services/tool-loan.service';

export function useToolLoans() {
  const [loans, setLoans] = useState<ToolLoan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<ToolLoanFilter>({
    search: '',
    status: 'todos',
  });

  const fetchLoans = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const list = await toolLoanService.getToolLoans(filters);
      setLoans(list);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar empréstimos de ferramentas.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  const createLoan = async (params: Parameters<typeof toolLoanService.createToolLoan>[0]) => {
    const loan = await toolLoanService.createToolLoan(params);
    fetchLoans();
    return loan;
  };

  const registerReturn = async (params: Parameters<typeof toolLoanService.registerToolReturn>[0]) => {
    const updated = await toolLoanService.registerToolReturn(params);
    fetchLoans();
    return updated;
  };

  const extendLoan = async (loanId: string, newDate: string, notes?: string) => {
    const updated = await toolLoanService.extendToolLoan(loanId, newDate, notes);
    fetchLoans();
    return updated;
  };

  return {
    loans,
    loading,
    error,
    filters,
    setFilters,
    createLoan,
    registerReturn,
    extendLoan,
    refetch: fetchLoans,
  };
}
