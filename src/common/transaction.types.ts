export interface TXSeed {
  inputAddress: string;
  outputAddress: string;
  value: number;
}

export interface TXSekeleton {
  errors?: unknown[];
  tx: {
    fees: number;
    addresses: string[];
  };
  tosign: string[];
}

export interface TXSigned extends TXSekeleton {
  pubkeys: string[];
  signatures: string[];
}

export interface TXCompleted extends TXSekeleton {
  tosing: [];
}
