import { ReceiptStatus } from 'fns-api';

export const ReceiptStatusUtil = {
  isSuccess(status: number): boolean {
    return (
      ReceiptStatus.NPD_FOUND.includes(status) ||
      ReceiptStatus.HAVE_COPY.includes(status)
    );
  },

  isPending(status: number): boolean {
    return (
      ReceiptStatus.COPY_REQUESTED.includes(status) ||
      ReceiptStatus.HSM_REQUESTED.includes(status)
    );
  },

  isError(status: number): boolean {
    return (
      ReceiptStatus.NPD_NOT_FOUND.includes(status) ||
      ReceiptStatus.HSM_NOK.includes(status) ||
      ReceiptStatus.RETRIEVE_FAILED.includes(status) ||
      ReceiptStatus.UNSUPPORTED_DOCUMENT_TYPE.includes(status) ||
      ReceiptStatus.STANDALONE_CASH.includes(status) ||
      ReceiptStatus.ERROR.includes(status)
    );
  },

  isOther(status: number): boolean {
    return (
      !this.isSuccess(status) &&
      !this.isPending(status) &&
      !this.isError(status)
    );
  }
};
