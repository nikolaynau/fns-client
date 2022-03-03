export interface ClientInterface {
  addReceipt(): Promise<any>;
  getReceipt(): Promise<any>;
  getRceiptList(): Promise<any>;
  removeReceipt(): Promise<any>;
}
