import { CancelToken } from 'axios';
import type { FiscalData, ReceiptDetails, ReceiptShort } from 'fns-api';

export interface ClientInterface {
  addReceipt(
    fiscalData: FiscalData,
    cancelToken?: CancelToken
  ): Promise<ReceiptShort>;
  addReceipt(qr: string, cancelToken?: CancelToken): Promise<ReceiptShort>;
  getReceipt(id: string, cancelToken?: CancelToken): Promise<ReceiptDetails>;
  getReceipts(cancelToken?: CancelToken): Promise<ReceiptShort[]>;
  removeReceipt(id: string, cancelToken?: CancelToken): Promise<void>;
}
