export interface TxSeed {
  destination: string;
  amount: string;
}

export interface UTXO {
  id: string;
  index: number;
  amount: number;
}

export interface TxUnsigned {
  id: string;
  unsigned_tx: string;
}
