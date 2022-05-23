export const basicActions = (type: string, payload?: any) => ({
  type,
  payload,
});

export type BasicActions<T = any, K = any> = {
  dispatch: (actions: { type: T; payload?: K }) => void;
};
