# @ehsaneha/observable-store

A simple yet powerful state management library inspired by `zustand` which allows you to create observable stores in your JavaScript or TypeScript projects. It provides a reactive store that supports state management with built-in observer pattern capabilities, enabling the registration of observers that will be notified when the store's state changes.

**_NOTE:_** If you want to use this package in a react app its better to use the `@ehsaneha/react-observable-store` package instead due to rerenders of functional components.

## Features

- **State management**: Easily store and retrieve the state.
- **Observability**: Register observers that are notified when the state changes.
- **State mutation**: Modify the store's state either directly or through a setter function.
- **Observer dependencies**: Notify observers only when the state changes in a way that their dependencies have changed.
- **Custom actions**: Easily integrate custom actions into your store with `createStore`.

## Installation

```bash
npm install @ehsaneha/observable-store
```

or if you are using Yarn:

```bash
yarn add @ehsaneha/observable-store
```

## Usage

### Creating a Store

You can create a store by using the `createStore` function, which optionally accepts an initial state and custom actions.

```ts
import { createStore } from "@ehsaneha/observable-store";

// Simply without initial data and types would be Store<undefined>.
const store = createStore();

// Or again without initial data but this time types would be Store<number | undefined>.
const store = createStore<number>();

// Or with initial data and types would be Store<number>.
const store = createStore(0);

// Or with initial data and type for making the types more clear Store<number | string>.
const store = createStore<number | string>(0);

// Or if you want to add some additional actions.
// Now types would be Store<number, { increment: () => void, decrement: () => void }>
const store = createStore(0, (store) => ({
  increment: () => store.set(store.get() + 1),
  decrement: () => store.set(store.get() - 1),
}));
```

### Accessing and Modifying State

You can retrieve the state of the store using the `get()` method and set the state using the `set()` method. You can either provide a direct state value or a function to mutate the state.

```ts
// Get the current state
const currentState = store.get();

// Set the new state directly
store.set(5);

// Set the new state using a function
store.set((prevState) => prevState + 1);
```

### Observers

To reactively listen to state changes, you can add an observer to the store using the `onChange` method. The observer function will be called whenever the state changes.

```ts
store.onChange((current, previous) => {
  console.log("State changed from", previous, "to", current);
});
```

Observers can optionally specify dependencies. This ensures they are only notified if the specified state properties change.

```ts
store.onChange(
  (current, previous) => {
    console.log("State changed");
  },
  (current) => current % 2 === 0
);
```

### Removing Observers

If you no longer need an observer, you can remove it by using the `removeObserver` method.

```ts
store.removeObserver(observer);
```

### Example: Counter Store

Here’s a full example of using `@ehsaneha/observable-store` to create a counter store with increment and decrement actions:

```ts
import { createStore } from "@ehsaneha/observable-store";

const store = createStore(0, (store) => ({
  increment: () => store.set(store.get() + 1),
  decrement: () => store.set(store.get() - 1),
}));

// Observing changes
store.onChange((current) => console.log("Current state:", current));

// Triggering actions
store.increment(); // Logs: "Current state: 1"
store.decrement(); // Logs: "Current state: 0"
```

## API

### `createStore<S, TActions>(initState?, actions?)`

- **`initState`**: (optional) The initial state of the store.
- **`actions`**: (optional) A function that defines custom actions. The function is called with the store instance, allowing you to access the state and modify it.

Returns a store object that has:

- `get()`: Retrieves the current state.
- `set(newState)`: Sets a new state or updates it based on a function.
- `onChange(observer, deps?)`: Registers an observer that will be notified when the state changes.
- `removeObserver(observer)`: Removes an observer.

### `ObservableStoreClass<S>`

This is the core class used in the store. It provides methods to manage state and notify observers and you can inherite it to add more functionalities to it.

#### Methods:

- **`get()`**: Retrieves the current state.
- **`set(newState)`**: Sets the new state or updates it using a function.
- **`onChange(observer, deps?)`**: Registers an observer to listen for changes to the state.
- **`removeObserver(observer)`**: Removes an observer.
- **`notifyObservers(current, previous)`**: Notifies all observers when the state has changed.
- **`addObserver(observer)`**: Adds an observer to the store.

### Dependencies

The package uses `lodash.isequal` for deep equality checking of state and observer dependencies and also some utilities from `@ehsaneha/utils`.

## License

This package is licensed under the MIT License. See LICENSE for more information.

---

Feel free to modify this package or contribute to it!
