import { httpPost } from '@roothub/helper/http';

export async function fakeSubmitForm(params: any) {
  return httpPost('/api/basicForm', {
    method: 'POST',
    data: params,
  });
}
