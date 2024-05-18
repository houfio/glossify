export type SuccessfulResponse<T> = {
  success: true,
  data: T,
  issues: undefined
};

export type UnsuccessfulResponse = {
  success: false,
  data: undefined,
  issues: Issue[]
};

export type Issue = {
  field: string,
  message: string
};

export type MessageType = 'info' | 'success' | 'error';
