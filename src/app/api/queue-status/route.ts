import { NextApiRequest, NextApiResponse } from 'next';
import { logQueue } from '../../lib/queue';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const [waiting, active, completed, failed] = await Promise.all([
      logQueue.getWaitingCount(),
      logQueue.getActiveCount(),
      logQueue.getCompletedCount(),
      logQueue.getFailedCount(),
    ]);

    res.status(200).json({
      waiting,
      active,
      completed,
      failed,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch queue status' });
  }
} 