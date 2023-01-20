export const basicActions = (type?: any, payload?: any) => ({ type, payload })

export type BasicActions = {
  dispatch: (actions: { type: string; payload: any }) => void
}
