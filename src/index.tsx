import isEqual from "lodash.isequal";
import {
  Store,
  Actions,
  Observer,
  CreateStore,
  SetInputFunc,
  ObserverDeps,
  ObserverWithDeps,
  CreateActionsFunc,
} from "./types";
export * from "./types";

export class ObservableStoreClass<S> {
  protected _observers: ObserverWithDeps<S | undefined>[] = [];
  protected _state: S | undefined;

  constructor(state?: S) {
    this._state = state;
  }

  get = () => {
    return this._state;
  };

  set = (newState: S | undefined | SetInputFunc<S | undefined>) => {
    const _prev = this.get();

    let _v = newState as S | undefined;
    if (typeof newState === "function") {
      _v = (newState as SetInputFunc<S | undefined>)?.(_prev);
    }

    if (!isEqual(_prev, _v)) {
      this._state = _v;
      this.notifyObservers(_v, _prev);
    }
  };

  onChange = (
    observer: Observer<S | undefined>,
    deps?: ObserverDeps<S | undefined>
  ) => {
    this.addObserver({ observer, deps });
  };

  notifyObservers = (current: S | undefined, prev: S | undefined) => {
    this._observers
      .filter((e) => !e.deps || !isEqual(e.deps(current), e.deps(prev)))
      .forEach((e) => e.observer(current, prev));
  };

  addObserver = (o: ObserverWithDeps<S | undefined>) => {
    this._observers = [...this._observers.filter((e) => e !== o), o];
  };

  removeObserver = (o: ObserverWithDeps<S | undefined>) => {
    this._observers = this._observers.filter((e) => e !== o);
  };
}

export const createStore: CreateStore = <S, TActions extends Actions>(
  initState?: S,
  actions?: CreateActionsFunc<S | undefined, TActions>
) => {
  const _store = new ObservableStoreClass(initState);

  return Object.assign(_store, actions?.(_store)) as Store<
    S | undefined,
    TActions
  >;
};
