export const seedUsers = ([] as any[]);

export function initializeUserDatabase() {
  if (typeof window !== 'undefined') {
    const existing = localStorage.getItem('bb-users');
    const users = existing ? JSON.parse(existing) : [];
    // Always ensure seed accounts exist by merging — never overwrite custom accounts
    let changed = false;
    for (const seed of seedUsers) {
      if (!users.find((u: any) => u.email === seed.email)) {
        users.push(seed);
        changed = true;
      }
    }
    if (changed || !existing) {
      localStorage.setItem('bb-users', JSON.stringify(users));
    }
  }
}
