export const seedUsers = [
  {
    id: 'user-1',
    email: 'customer@test.com',
    password: 'Test@123',
    name: 'Priya Sharma',
    role: 'customer',
    avatar: undefined,
    phone: '+91 98765 43210',
    createdAt: '2024-01-15'
  },
  {
    id: 'seller-1',
    email: 'seller@test.com',
    password: 'Test@123',
    name: 'Ravi Kumar',
    role: 'seller',
    avatar: undefined,
    phone: '+91 87654 32109',
    createdAt: '2024-01-10'
  },
  {
    id: 'admin-1',
    email: 'admin@bharatbazaar.com',
    password: 'Admin@123',
    name: 'Admin User',
    role: 'admin',
    avatar: undefined,
    phone: '+91 76543 21098',
    createdAt: '2024-01-01'
  }
];

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
