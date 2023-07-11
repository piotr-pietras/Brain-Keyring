export interface Contract {
  name: string;
  address: string;
  abi?: any;
}

export interface ContractReq extends Contract {
  gas_limit: number;
  params: any[];
  private: string;
}
