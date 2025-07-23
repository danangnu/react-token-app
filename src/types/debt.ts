export interface DebtRecord {
  id: number;
  debtor: string;
  creditor: string;
  amount: number;
  remarks?: string;
  isSettled: boolean;
}