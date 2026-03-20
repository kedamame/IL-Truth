import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const VALID_ID_PATTERN = /^[a-z0-9-]+(,[a-z0-9-]+)*$/;

export async function GET(req: NextRequest) {
  const ids = req.nextUrl.searchParams.get('ids');
  if (!ids) return NextResponse.json({ error: 'ids required' }, { status: 400 });
  if (!VALID_ID_PATTERN.test(ids)) {
    return NextResponse.json({ error: 'invalid ids format' }, { status: 400 });
  }

  try {
    const res = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: { ids, vs_currencies: 'usd' },
    });
    return NextResponse.json(res.data);
  } catch {
    return NextResponse.json({ error: 'CoinGecko error' }, { status: 502 });
  }
}
