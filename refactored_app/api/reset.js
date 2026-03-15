const { supabase } = require('./_supabase');

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

/**
 * POST /api/reset  — delete all rows from tasks, goals, and jobs.
 */
module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Delete tasks first (they may reference goals/jobs via foreign keys)
    const { error: e1 } = await supabase.from('tasks').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    const { error: e2 } = await supabase.from('goals').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    const { error: e3 } = await supabase.from('jobs').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    if (e1) throw e1;
    if (e2) throw e2;
    if (e3) throw e3;

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('reset API error:', err);
    return res.status(500).json({ error: err.message });
  }
};
