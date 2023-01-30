import { useLayoutEffect } from 'react';
import create, { StoreApi } from 'zustand';
import createContext from 'zustand/context';
import { IUser } from '../types';

interface StoreState {
  user?: IUser;
  updateUser: (admin: IUser) => void;
}

let store: StoreApi<StoreState>;

const getDefaultInitialState = () => ({
  user: undefined,
});

const zustandContext = createContext<StoreApi<StoreState>>();

export const { Provider } = zustandContext;

export const { useStore } = zustandContext;

export const initializeStore = (preloadedState?: IUser) =>
  create<StoreState>(set => ({
    ...getDefaultInitialState(),
    user: preloadedState,
    updateUser: (user: IUser) => set(state => ({ ...state, user })),
  }));

export function useCreateStore(user?: IUser) {
  if (typeof window === 'undefined') {
    return () => initializeStore(user);
  }

  const isReusingStore = Boolean(store);
  store = store ?? initializeStore(user);

  useLayoutEffect(() => {
    if (user && isReusingStore && store) {
      store.setState(
        {
          ...store.getState(),
          user,
        },
        true,
      );
    }
  });

  return () => store;
}
