const { supabase } = require('./_supabase');

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // GET — list all tasks
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('due_date', { ascending: true });
      if (error) throw error;
      return res.status(200).json(data);
    }

    // POST — create a task
    if (req.method === 'POST') {
      const body = req.body;
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          title: body.title,
          status: body.status || 'todo',
          due_date: body.due_date || null,
          reminder_date_time: body.reminder_date_time || null,
          priority: body.priority || 'medium',
          goal_id: body.goal_id || null,
          job_id: body.job_id || null,
          notes: body.notes || null
        }])
        .select();
      if (error) throw error;
      return res.status(201).json(data[0]);
    }

    // PUT — update a task
    if (req.method === 'PUT') {
      const body = req.body;
      if (!body.id) return res.status(400).json({ error: 'Missing id' });
      const { data, error } = await supabase
        .from('tasks')
        .update({
          title: body.title,
          status: body.status,
          due_date: body.due_date,
          reminder_date_time: body.reminder_date_time,
          priority: body.priority,
          goal_id: body.goal_id,
          job_id: body.job_id,
          notes: body.notes
        })
        .eq('id', body.id)
        .select();
      if (error) throw error;
      return res.status(200).json(data[0]);
    }

    // DELETE — delete a task
    if (req.method === 'DELETE') {
      const { id } = req.body || req.query;
      if (!id) return res.status(400).json({ error: 'Missing id' });
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('tasks API error:', err);
    return res.status(500).json({ error: err.message });
  }
};
