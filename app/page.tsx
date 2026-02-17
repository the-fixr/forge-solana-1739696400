'use client';

import { useState, useEffect, useCallback } from 'react';
import { FrameSDKProvider, useFrameSDK } from './components/FrameSDK';
import { WalletProvider, useWallet } from './components/WalletProvider';
import { SolanaProvider, useSolana, solanaConnection } from './components/SolanaProvider';

interface NetworkStats {
  tps: number;
  slot: number;
  epoch: number;
  epochProgress: number;
  blockHeight: number;
}

interface SolPrice {
  price: number | null;
  change24h: number | null;
}

function PriceCard({ price }: { price: SolPrice }) {
  return (
    <div className="bg-surface rounded-2xl p-5 border border-border">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold">
            S
          </div>
          <span className="text-sm text-gray-400">SOL / USD</span>
        </div>
        <div className="text-xs text-gray-500">Live</div>
      </div>
      <div className="text-3xl font-bold text-white">
        {price.price !== null
          ? `$${price.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
          : '---'}
      </div>
    </div>
  );
}

function WalletCard() {
  const { publicKey, solBalance, isConnected, isConnecting, connect, disconnect, refreshBalance } = useSolana();

  const truncateAddress = (addr: string) =>
    `${addr.slice(0, 4)}...${addr.slice(-4)}`;

  if (!isConnected) {
    return (
      <div className="bg-surface rounded-2xl p-5 border border-border">
        <h3 className="text-sm text-gray-400 mb-3">Wallet</h3>
        <button
          onClick={connect}
          disabled={isConnecting}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isConnecting ? 'Connecting...' : 'Connect Solana Wallet'}
        </button>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Connect via Farcaster to see your SOL balance
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-2xl p-5 border border-border">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm text-gray-400">Your Wallet</h3>
        <button
          onClick={disconnect}
          className="text-xs text-gray-500 hover:text-red-400 transition-colors"
        >
          Disconnect
        </button>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        <span className="text-xs font-mono text-gray-300">
          {publicKey ? truncateAddress(publicKey) : '---'}
        </span>
      </div>
      <div className="text-2xl font-bold text-white">
        {solBalance !== null
          ? `${solBalance.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })} SOL`
          : 'Loading...'}
      </div>
      <button
        onClick={refreshBalance}
        className="mt-2 text-xs text-primary hover:text-primary-300 transition-colors"
      >
        Refresh
      </button>
    </div>
  );
}

function NetworkCard({ stats }: { stats: NetworkStats | null }) {
  return (
    <div className="bg-surface rounded-2xl p-5 border border-border">
      <h3 className="text-sm text-gray-400 mb-3">Network Stats</h3>
      {stats ? (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-lg font-bold text-accent">{stats.tps.toLocaleString()}</div>
            <div className="text-xs text-gray-500">TPS</div>
          </div>
          <div>
            <div className="text-lg font-bold text-white">{stats.slot.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Current Slot</div>
          </div>
          <div>
            <div className="text-lg font-bold text-white">{stats.epoch}</div>
            <div className="text-xs text-gray-500">Epoch</div>
          </div>
          <div>
            <div className="text-lg font-bold text-primary">
              {stats.epochProgress.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500">Epoch Progress</div>
          </div>
        </div>
      ) : (
        <div className="text-gray-500 text-sm">Loading network data...</div>
      )}
      {stats && (
        <div className="mt-3">
          <div className="w-full bg-border rounded-full h-1.5">
            <div
              className="bg-gradient-to-r from-primary to-accent h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${stats.epochProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

const DEFI_PROTOCOLS = [
  { name: 'Jito', tvl: '3.00B', category: 'Liquid Staking', color: '#FF6B6B' },
  { name: 'Kamino', tvl: '2.80B', category: 'Lending', color: '#4ECDC4' },
  { name: 'Jupiter', tvl: '2.00B', category: 'DEX Aggregator', color: '#FFE66D' },
  { name: 'Raydium', tvl: '1.84B', category: 'AMM / DEX', color: '#6C5CE7' },
  { name: 'Marinade', tvl: '1.74B', category: 'Liquid Staking', color: '#00B894' },
];

function DefiCard() {
  return (
    <div className="bg-surface rounded-2xl p-5 border border-border">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm text-gray-400">Top DeFi Protocols</h3>
        <span className="text-xs text-accent font-mono">$7.8B+ TVL</span>
      </div>
      <div className="space-y-2.5">
        {DEFI_PROTOCOLS.map((protocol, i) => (
          <div key={protocol.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="text-xs text-gray-500 w-4">{i + 1}</div>
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-black"
                style={{ backgroundColor: protocol.color }}
              >
                {protocol.name[0]}
              </div>
              <div>
                <div className="text-sm font-medium text-white">{protocol.name}</div>
                <div className="text-[10px] text-gray-500">{protocol.category}</div>
              </div>
            </div>
            <div className="text-sm font-mono text-gray-300">${protocol.tvl}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChainFeatures() {
  const features = [
    { label: 'TPS', value: '4,000+', icon: '~' },
    { label: 'Finality', value: '~400ms', icon: '>' },
    { label: 'Avg Fee', value: '$0.00025', icon: '*' },
    { label: 'Validators', value: '1,500+', icon: '#' },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {features.map((f) => (
        <div key={f.label} className="bg-surface rounded-xl p-3 border border-border text-center">
          <div className="text-lg font-bold text-accent">{f.value}</div>
          <div className="text-[10px] text-gray-500 mt-0.5">{f.label}</div>
        </div>
      ))}
    </div>
  );
}

function AppContent() {
  const { context, isLoaded, actions } = useFrameSDK();
  const { address, isConnected: evmConnected } = useWallet();

  const [solPrice, setSolPrice] = useState<SolPrice>({ price: null, change24h: null });
  const [networkStats, setNetworkStats] = useState<NetworkStats | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchPrice = useCallback(async () => {
    try {
      const res = await fetch('/api/solana-price');
      const data = await res.json();
      if (data.price) {
        setSolPrice({ price: data.price, change24h: null });
      }
    } catch (err) {
      console.error('[SolPulse] Price fetch error:', err);
    }
  }, []);

  const fetchNetworkStats = useCallback(async () => {
    try {
      const [slot, epochInfo, perfSamples] = await Promise.all([
        solanaConnection.getSlot(),
        solanaConnection.getEpochInfo(),
        solanaConnection.getRecentPerformanceSamples(1),
      ]);

      const tps = perfSamples[0]
        ? Math.round(perfSamples[0].numTransactions / perfSamples[0].samplePeriodSecs)
        : 0;

      const epochProgress = epochInfo.slotIndex / epochInfo.slotsInEpoch * 100;

      setNetworkStats({
        tps,
        slot,
        epoch: epochInfo.epoch,
        epochProgress,
        blockHeight: epochInfo.absoluteSlot,
      });

      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('[SolPulse] Network stats error:', err);
    }
  }, []);

  useEffect(() => {
    fetchPrice();
    fetchNetworkStats();

    const priceInterval = setInterval(fetchPrice, 30000);
    const statsInterval = setInterval(fetchNetworkStats, 10000);

    return () => {
      clearInterval(priceInterval);
      clearInterval(statsInterval);
    };
  }, [fetchPrice, fetchNetworkStats]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Loading SolPulse...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 pb-20 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            SolPulse
          </h1>
          <p className="text-[10px] text-gray-500">Solana Ecosystem Dashboard</p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-[10px] text-gray-500 font-mono">
            {lastUpdated || 'Loading...'}
          </span>
        </div>
      </div>

      {/* Chain Quick Stats */}
      <ChainFeatures />

      {/* Main Content */}
      <div className="mt-4 space-y-4">
        <PriceCard price={solPrice} />
        <WalletCard />
        <NetworkCard stats={networkStats} />
        <DefiCard />
      </div>

      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="text-[10px] text-gray-600">
          Powered by Solana &middot; Built on Farcaster
        </p>
        {context?.user?.displayName && (
          <p className="text-[10px] text-gray-600 mt-1">
            Hey, {context.user.displayName}!
          </p>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <FrameSDKProvider>
      <WalletProvider>
        <SolanaProvider>
          <AppContent />
        </SolanaProvider>
      </WalletProvider>
    </FrameSDKProvider>
  );
}
