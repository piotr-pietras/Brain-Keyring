export interface TXSeed {
  inputAddress: string;
  outputAddress: string;
  value: number;
}

interface TXPut {
  value: number;
  addresses: string[];
}
export interface TXSekeleton {
  errors?: unknown[];
  tx: {
    fees: number;
    addresses: string[];
    outputs: TXPut[];
    inputs: TXPut[];
  };
  tosign: string[];
}

export interface TXSigned extends TXSekeleton {
  pubkeys: string[];
  signatures: string[];
}

export interface TXCompleted extends TXSekeleton {
  tosign: [];
}
