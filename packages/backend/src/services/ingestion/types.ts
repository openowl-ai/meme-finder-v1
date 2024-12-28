export interface SocialMediaPost {
  id: string;
  source: 'twitter' | 'reddit' | 'discord' | 'telegram';
  content: string;
  author: string;
  timestamp: Date;
  metadata: Record<string, any>;
}

export interface OnChainTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: Date;
  chain: string;
}

export interface PriceData {
  symbol: string;
  price: number;
  volume: number;
  timestamp: Date;
}
