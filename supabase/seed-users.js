const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

async function seed() {
  console.log('Reading environment variables...');
  const envPath = path.join(__dirname, '../.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('Error: .env.local file not found at', envPath);
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};
  envContent.split(/\r?\n/).forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let value = match[2] || '';
      if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
        value = value.substring(1, value.length - 1);
      }
      env[match[1]] = value.trim();
    }
  });

  const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
  const serviceRoleKey = env['SUPABASE_SERVICE_ROLE_KEY'];

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing in .env.local');
    process.exit(1);
  }

  console.log(`Connecting to Supabase at: ${supabaseUrl}`);
  // Create client with service role key to bypass RLS and use auth.admin APIs
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  // Load roles to map roles to IDs
  console.log('Fetching roles from database...');
  const { data: roles, error: rolesError } = await supabase
    .from('roles')
    .select('id, name');

  if (rolesError) {
    console.error('Error fetching roles:', rolesError.message);
    process.exit(1);
  }

  console.log('Found roles:', roles);
  const roleMap = {};
  roles.forEach(r => {
    roleMap[r.name] = r.id;
  });

  const usersToSeed = [
    {
      email: 'customer@test.com',
      password: 'Test@123',
      name: 'Priya Sharma',
      role: 'customer',
      phone: '+919876543210'
    },
    {
      email: 'seller@test.com',
      password: 'Test@123',
      name: 'Ravi Kumar',
      role: 'seller',
      phone: '+918765432109'
    },
    {
      email: 'admin@bharatbazaar.com',
      password: 'Admin@123',
      name: 'admin',
      phone: '+917654321098'
    }
  ];

  for (const user of usersToSeed) {
    console.log(`\nProcessing user: ${user.email} (${user.role || 'admin'})`);

    // 1. Check if user already exists in auth.users by email
    const { data: listData, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      console.error('Error listing users:', listError.message);
      continue;
    }

    let existingUser = listData.users.find(u => u.email === user.email);
    let userId;

    if (existingUser) {
      console.log(`User already exists in Auth with ID: ${existingUser.id}`);
      userId = existingUser.id;
    } else {
      // Create user in Auth
      console.log('Creating user in Auth...');
      const { data: createData, error: createError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          first_name: user.name.split(' ')[0],
          last_name: user.name.split(' ').slice(1).join(' ') || '',
          role: user.role || 'admin'
        }
      });

      if (createError) {
        console.error(`Failed to create auth user for ${user.email}:`, createError.message);
        continue;
      }

      userId = createData.user.id;
      console.log(`Successfully created Auth user with ID: ${userId}`);
    }

    // 2. Ensure profile exists in public.profiles table
    console.log('Ensuring profile exists in public.profiles table...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    if (profileError) {
      console.error('Error checking profile:', profileError.message);
      continue;
    }

    if (!profile) {
      console.log('Profile does not exist. Creating profile...');
      const { error: insertProfileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          full_name: user.name,
          phone: user.phone,
          status: 'active'
        });

      if (insertProfileError) {
        console.error('Error inserting profile:', insertProfileError.message);
        continue;
      }
      console.log('Profile created successfully.');
    } else {
      console.log('Profile already exists.');
    }

    // 3. Ensure role is assigned in public.user_roles table
    const targetRole = user.role || 'admin';
    const roleId = roleMap[targetRole];

    if (!roleId) {
      console.error(`Error: Role "${targetRole}" not found in roles table mapping.`);
      continue;
    }

    console.log(`Ensuring user has role "${targetRole}" (ID: ${roleId})...`);
    const { data: userRole, error: userRoleError } = await supabase
      .from('user_roles')
      .select('id')
      .eq('user_id', userId)
      .eq('role_id', roleId)
      .maybeSingle();

    if (userRoleError) {
      console.error('Error checking user role:', userRoleError.message);
      continue;
    }

    if (!userRole) {
      console.log('Role not assigned. Assigning role...');
      const { error: insertRoleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role_id: roleId
        });

      if (insertRoleError) {
        console.error('Error assigning role:', insertRoleError.message);
        continue;
      }
      console.log('Role assigned successfully.');
    } else {
      console.log('Role already assigned.');
    }
  }

  console.log('\nSeed execution complete.');
}

seed().catch(err => {
  console.error('Seed script crashed:', err);
});
