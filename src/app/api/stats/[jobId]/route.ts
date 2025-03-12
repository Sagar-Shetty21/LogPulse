import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { jobId } = req.query;

  try {
    const { data, error } = await supabase
      .from('log_stats')
      .select('*')
      .eq('job_id', jobId)
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching job stats:', error);
    res.status(500).json({ error: 'Failed to fetch job stats' });
  }
} 