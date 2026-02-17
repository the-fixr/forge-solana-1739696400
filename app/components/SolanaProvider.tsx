'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { FarcasterSolanaProvider } from '@farcaster/mini-app-solana';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

const SOLANA_RPC = 'https://api.mainnet-beta.solana.com';

interface SolanaContextType {
  publicKey: string | null;
  solBalance: number | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  connection: Connection;
  refreshBalance: () => Promise<void>;
}

const SolanaContext = createContext<SolanaContextType | null>(null);

const connection = new Connection(SOLANA_RPC, 'confirmed');

function SolanaState({ children }: { children: ReactNode }) {
  const wallet = useWallet();
  const [solBalance, setSolBalance] = useState<number | null>(null);

  const publicKeyStr = wallet.publicKey?.toBase58() ?? null;

  const fetchBalance = useCallback(async () => {
    if (!wallet.publicKey) {
      setSolBalance(null);
      return;
    }
    try {
      const balance = await connection.getBalance(wallet.publicKey);
      setSolBalance(balance / LAMPORTS_PER_SOL);
    } catch (err) {
      console.error('[SolanaProvider] Balance fetch error:', err);
    }
  }, [wallet.publicKey]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  const connect = useCallback(async () => {
    try {
      await wallet.select('Farcaster' as any);
      await wallet.connect();
    } catch (err) {
      console.error('[SolanaProvider] Connect error:', err);
    }
  }, [wallet]);

  const disconnect = useCallback(() => {
    try {
      wallet.disconnect();
      setSolBalance(null);
    } catch (err) {
      console.error('[SolanaProvider] Disconnect error:', err);
    }
  }, [wallet]);

  const value: SolanaContextType = {
    publicKey: publicKeyStr,
    solBalance,
    isConnected: wallet.connected,
    isConnecting: wallet.connecting,
    connect,
    disconnect,
    connection,
    refreshBalance: fetchBalance,
  };

  return (
    <SolanaContext.Provider value={value}>
      {children}
    </SolanaContext.Provider>
  );
}

export function SolanaProvider({ children }: { children: ReactNode }) {
  return (
    <FarcasterSolanaProvider endpoint={SOLANA_RPC}>
      <SolanaState>
        {children}
      </SolanaState>
    </FarcasterSolanaProvider>
  );
}

export function useSolana(): SolanaContextType {
  const context = useContext(SolanaContext);

  if (!context) {
    return {
      publicKey: null,
      solBalance: null,
      isConnected: false,
      isConnecting: false,
      connect: async () => {
        console.warn('[useSolana] SolanaProvider not found');
      },
      disconnect: () => {},
      connection,
      refreshBalance: async () => {},
    };
  }

  return context;
}

export { connection as solanaConnection };
export default SolanaProvider;
