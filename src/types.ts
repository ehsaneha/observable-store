import { Override } from "@ehsaneha/utils";


export type Observer<S, TReturn = void> = (current: S, prev: S) => TReturn;
export type ObserverDeps<S> = (s: S) => any;
export type ObserverWithDeps<S> = {
  observer: Observer<S>;
  deps?: ObserverDeps<S>;
};

export type Actions = Record<string, Function>;
export type SetInputFunc<S> = (current: S) => S;

export type StoreCore<S> = {
  get: () => S;
  set: (v: S | SetInputFunc<S>) => void;
  onChange: (func: Observer<S>, deps?: ObserverDeps<S>) => void;
};

export type Store<S, TActions extends Actions = {}> = Override<StoreCore<S>, TActions>;

export type CreateActionsFunc<S, TActions> = (props: {
  get: () => S;
  set: (v: S | SetInputFunc<S>) => void;
  notifyObservers: (v: S, prev: S) => void;
  addObserver: (o: ObserverWithDeps<S>) => void;
  removeObserver: (o: ObserverWithDeps<S>) => void;
  onChange: (func: Observer<S>, deps?: ObserverDeps<S>) => void;
}) => TActions;

export type CreateStore = {
  (): Store<undefined>;
  <S>(): Store<S | undefined>;
  <S>(initState: S): Store<S>;
  <S, TActions extends Actions>(
    initState: S,
    actions?: CreateActionsFunc<S, TActions>
  ): Store<S, TActions>;
};
