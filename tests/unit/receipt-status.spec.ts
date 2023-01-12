import { ReceiptStatus } from 'fns-api';
import { ReceiptStatusUtil } from '../..';

describe('ReceiptStatusUtil', () => {
  it('success status', () => {
    checkStatus(ReceiptStatusUtil.isSuccess, [
      ReceiptStatus.NPD_FOUND,
      ReceiptStatus.HAVE_COPY
    ]);
  });

  it('pending status', () => {
    checkStatus(ReceiptStatusUtil.isPending, [
      ReceiptStatus.COPY_REQUESTED,
      ReceiptStatus.HSM_REQUESTED
    ]);
  });

  it('error status', () => {
    checkStatus(ReceiptStatusUtil.isError, [
      ReceiptStatus.NPD_NOT_FOUND,
      ReceiptStatus.HSM_NOK,
      ReceiptStatus.RETRIEVE_FAILED,
      ReceiptStatus.UNSUPPORTED_DOCUMENT_TYPE,
      ReceiptStatus.STANDALONE_CASH,
      ReceiptStatus.ERROR
    ]);
  });

  it('other status', () => {
    const isOther = ReceiptStatusUtil.isOther.bind(ReceiptStatusUtil);
    checkStatus(isOther, [[0xffff]]);
  });
});

function checkStatus(
  method: (status: number) => boolean,
  actual: Array<Array<number>>
): void {
  const flatActual = actual.flat();
  for (const status of getAllStatuses()) {
    const expected = flatActual.includes(status);
    expect(method(status)).toBe(expected);
  }
}

function getAllStatuses(): number[] {
  return Object.keys(ReceiptStatus)
    .map(key => (ReceiptStatus as any)[key])
    .flat();
}
