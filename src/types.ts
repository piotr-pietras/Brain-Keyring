export interface TXSeed {
  inputAddress: string;
  outputAddress: string;
  value: number;
}

export interface TXSekeleton {
  errors?: unknown[];
  tx: unknown;
  tosign: string[];
}

export interface TXSigned extends TXSekeleton {
  pubkeys: string[];
  signatures: string[];
}

export interface TXCompleted extends TXSekeleton {
  tosing: [];
}
