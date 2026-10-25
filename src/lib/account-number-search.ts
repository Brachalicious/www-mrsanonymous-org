export function matchesAccountSearch(account: { nickname: string; accountNumber: string | null }, search: string) {
  const query = search.trim().toLowerCase();
  if (!query) return true;
  return account.nickname.toLowerCase().includes(query)
    || account.accountNumber === query.replace(/^#/, "");
}