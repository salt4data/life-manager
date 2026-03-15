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
    // GET
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json(data);
    }

    // POST
    if (req.method === 'POST') {
      const body = req.body;
      const { data, error } = await supabase
        .from('jobs')
        .insert([{
          company: body.company,
          role: body.role,
          status: body.status || 'interested',
          next_action_date: body.next_action_date || null,
          link: body.link || null,
          notes: body.notes || null
        }])
        .select();
      if (error) throw error;
      return res.status(201).json(data[0]);
    }

    // PUT
    if (req.method === 'PUT') {
      const body = req.body;
      if (!body.id) return res.status(400).json({ error: 'Missing id' });
      const { data, error } = await supabase
        .from('jobs')
        .update({
          company: body.company,
          role: body.role,
          status: body.status,
          next_action_date: body.next_action_date,
          link: body.link,
          notes: body.notes
        })
        .eq('id', body.id)
        .select();
      if (error) throw error;
      return res.status(200).json(data[0]);
    }

    // DELETE
    if (req.method === 'DELETE') {
      const { id } = req.body || req.query;
      if (!id) return res.status(400).json({ error: 'Missing id' });
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('work items API error:', err);
    return res.status(500).json({ error: err.message });
  }
};
