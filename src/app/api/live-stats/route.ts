import { QueueEvents } from 'bullmq';
import { WebSocketServer } from 'ws';
import { NextResponse } from 'next/server';
import { IncomingMessage } from 'http';
import { Socket } from 'net';

const wss = new WebSocketServer({ noServer: true });
const queueEvents = new QueueEvents('processingQueue', {
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  }
});

// Track connected clients
const clients = new Set<import('ws').WebSocket>();

// Handle WebSocket connections
wss.on('connection', (ws) => {
  clients.add(ws);

  ws.on('close', () => {
    clients.delete(ws);
  });
});

// Listen for job progress events
queueEvents.on('progress', ({ jobId, data }) => {
  const message = JSON.stringify({
    type: 'progress',
    jobId,
    progress: data
  });
  
  broadcast(message);
});

// Listen for job completion events
queueEvents.on('completed', ({ jobId, returnvalue }) => {
  const message = JSON.stringify({
    type: 'completed',
    jobId,
    result: returnvalue
  });
  
  broadcast(message);
});

// Broadcast message to all connected clients
function broadcast(message: string) {
  for (const client of clients) {
    if (client.readyState === client.OPEN) {
      client.send(message);
    }
  }
}

// Handle WebSocket upgrade
export function GET(req: Request) {
  const upgradeHeader = req.headers.get('upgrade');
  if (upgradeHeader !== 'websocket') {
    return new NextResponse('Expected websocket', { status: 426 });
  }

  wss.handleUpgrade(
    req as unknown as IncomingMessage, 
    (req as unknown as { socket: Socket }).socket,
    Buffer.from(''), 
    (ws) => {
      wss.emit('connection', ws, req);
    }
  );
}
