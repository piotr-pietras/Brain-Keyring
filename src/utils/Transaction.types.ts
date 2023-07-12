export interface TxSeed {
  inputAddress: string;
  outputAddress: string;
  value: number;
}

interface TxPut {
  value: number;
  addresses: string[];
}
export interface TxSekeleton {
  errors?: unknown[];
  error?: unknown[];
  tx: {
    fees: number;
    addresses: string[];
    outputs: TxPut[];
    inputs: TxPut[];
  };
  tosign: string[];
}

export interface TxSigned extends TxSekeleton {
  pubkeys: string[];
  signatures: string[];
}

export interface TxCompleted extends TxSekeleton {
  tosign: [];
}
