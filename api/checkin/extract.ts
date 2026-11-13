import type { IncomingMessage, ServerResponse } from 'node:http';
import { extractCheckInDocument, type ExtractRequestBody } from '../../lib/checkinExtractor.ts';

interface VercelRequestLike extends IncomingMessage {
  body?: unknown;
}

interface VercelResponseLike extends ServerResponse {
  status?: (code: number) => VercelResponseLike;
  json?: (data: unknown) => void;
}

function sendJson(res: VercelResponseLike, statusCode: number, data: unknown) {
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    res.status(statusCode).json(data);
    return;
  }
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}

async function readJsonBody(req: VercelRequestLike): Promise<ExtractRequestBody> {
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === 'string') {
      return (req.body.trim() ? JSON.parse(req.body) : {}) as ExtractRequestBody;
    }
    if (Buffer.isBuffer(req.body)) {
      const text = req.body.toString('utf8');
      return (text.trim() ? JSON.parse(text) : {}) as ExtractRequestBody;
    }
    if (typeof req.body === 'object') {
      return req.body as ExtractRequestBody;
    }
  }

  const chunks: Buffer[] = [];
  let totalBytes = 0;
  const maxBytes = 15 * 1024 * 1024;

  for await (const chunk of req) {
    const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    totalBytes += buf.length;
    if (totalBytes > maxBytes) {
      throw new Error('Request payload too large.');
    }
    chunks.push(buf);
  }

  const raw = Buffer.concat(chunks).toString('utf8').trim();
  if (!raw) return {};
  return JSON.parse(raw) as ExtractRequestBody;
}

export default async function handler(req: VercelRequestLike, res: VercelResponseLike) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    sendJson(res, 405, { error: 'Method not allowed. Use POST.' });
    return;
  }

  let body: ExtractRequestBody;
  try {
    body = await readJsonBody(req);
  } catch {
    sendJson(res, 400, { error: 'Invalid JSON request body.' });
    return;
  }

  const result = await extractCheckInDocument(body);
  sendJson(res, result.status, result.payload);
}
