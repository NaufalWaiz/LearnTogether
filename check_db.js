const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function main() {
  const { data: users, error: usersErr } = await supabase.from('users').select('*');
  console.log('Users Err:', usersErr);
  
  const { data: teams, error: teamsErr } = await supabase.from('teams').select('*');
  console.log('Teams Err:', teamsErr);
}

main();
