export type Message = {
  timestamp: string;
  sender: 'bot' | 'user';
  text: string;
};

export type State = {
  messages: Message[];
  sessionId?: string;
  loading: boolean;
};

export enum ACTION_TYPE {
  SEND_MESSAGE = 'SEND_MESSAGE',
  RECEIVE_MESSAGE = 'RECEIVE_MESSAGE',
  SET_SESSION = 'SET_SESSION',
  SET_LOADING = 'SET_LOADING',
  RESET = 'RESET',
}

export type Action = {
  type: ACTION_TYPE.SEND_MESSAGE | ACTION_TYPE.RECEIVE_MESSAGE;
  payload: Message;
} | {
  type: ACTION_TYPE.SET_SESSION;
  payload: string;
} | {
  type: ACTION_TYPE.SET_LOADING;
  payload: boolean;
} | {
  type: ACTION_TYPE.RESET;
}