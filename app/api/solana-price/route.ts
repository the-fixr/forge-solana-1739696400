import { NextResponse } from 'next/server';

const JUPITER_PRICE_API = 'https://api.jup.ag/price/v2';
const SOL_MINT = 'So11111111111111111111111111111111111111112';

export async function GET() {
  try {
    const res = await fetch(`${JUPITER_PRICE_API}?ids=${SOL_MINT}`, {
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      throw new Error(`Jupiter API returned ${res.status}`);
    }

    const data = await res.json();
    const solData = data.data?.[SOL_MINT];

    return NextResponse.json({
      price: solData?.price ? parseFloat(solData.price) : null,
      timestamp: Date.now(),
    });
  } catch (err) {
    console.error('[solana-price] Error:', err);
    return NextResponse.json(
      { price: null, error: 'Failed to fetch price' },
      { status: 500 }
    );
  }
}
