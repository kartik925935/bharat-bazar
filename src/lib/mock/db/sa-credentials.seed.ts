export interface SACredential {
  adminId: string;
  email: string;
  password: string;
}

export const MOCK_SA_CREDENTIALS: SACredential[] = [
  { adminId: 'adm_000', email: 'superadmin@bharatbazaar.com',  password: 'Super@123' },
  { adminId: 'adm_001', email: 'vikram.singh@bharatbazaar.com', password: 'Senior@123' },
  { adminId: 'adm_002', email: 'neha.kapoor@bharatbazaar.com',  password: 'Finance@123' },
  { adminId: 'adm_003', email: 'rahul.d@bharatbazaar.com',      password: 'OpsAdmin@123' },
  { adminId: 'adm_007', email: 'pradeep.k@bharatbazaar.com',    password: 'Support@123' },
  { adminId: 'adm_005', email: 'arun.nair@bharatbazaar.com',    password: 'Content@123' },
  { adminId: 'adm_006', email: 'divya.rao@bharatbazaar.com',    password: 'Delivery@123' },
  { adminId: 'adm_009', email: 'kabir.a@bharatbazaar.com',      password: 'Custom@123' },
  // Edge-case accounts — used to test that blocked statuses cannot log in:
  { adminId: 'adm_004', email: 'sanya.m@bharatbazaar.com',      password: 'Suspended@123' }, // status: suspended
  { adminId: 'adm_008', email: 'aisha.p@bharatbazaar.com',      password: 'Inactive@123' },  // status: inactive
];
