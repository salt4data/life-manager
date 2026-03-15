const { supabase } = require('./_supabase');

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

/**
 * GET /api/data  — returns all tasks, goals, and work items in a single payload.
 * Useful for initial page load so the frontend only needs one fetch.
 */
module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const [tasksRes, goalsRes, jobsRes] = await Promise.all([
      supabase.from('tasks').select('*').order('due_date', { ascending: true }),
      supabase.from('goals').select('*').order('created_at', { ascending: false }),
      supabase.from('jobs').select('*').order('created_at', { ascending: false })
    ]);

    if (tasksRes.error) throw tasksRes.error;
    if (goalsRes.error) throw goalsRes.error;
    if (jobsRes.error) throw jobsRes.error;

    return res.status(200).json({
      tasks: tasksRes.data,
      goals: goalsRes.data,
      jobs: jobsRes.data
    });
  } catch (err) {
    console.error('data API error:', err);
    return res.status(500).json({ error: err.message });
  }
};
