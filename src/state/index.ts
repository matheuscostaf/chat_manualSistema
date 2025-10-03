import { Action, ACTION_TYPE, State } from "../types";

export const initialState: State = {
  messages: [],
  loading: false,
}

export const chatReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ACTION_TYPE.SEND_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case ACTION_TYPE.RECEIVE_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case ACTION_TYPE.SET_SESSION:
      return {
        ...state,
        sessionId: action.payload,
      };
    case ACTION_TYPE.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case ACTION_TYPE.RESET:
      return initialState;
    default:
      return state;
  }
}
