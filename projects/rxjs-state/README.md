# rxjs-state
![rxjs-state logo](https://raw.githubusercontent.com/BioPhoton/rxjs-state/master/projects/rxjs-state/images/rxjs-state_logo.png)

#### Flexible Reactive State Written in RxJS 

RxJsState is a light-weight reactive state management service especially useful for component state in Angular.
Furthermore, a global service is provided and can act as a small global state manager.

## Description

A general class to handle state reactively.

Find an implementation into a framework here: (@ngx-rx/state)[https://github.com/BioPhoton/ngx-rx/tree/master/libs/state]

TOC

- Install
- Setup
- API

---

## Install

`npm i rxjs-state -S`

## Setup

As the RxJsState class is just a plain vanilla Javascript Class

```typescript
import { RxJsState } from 'rxjs-state';

interface MyState {
  foo: string;
  bar: number;
  loo: {
    boo: string;
    baz: number;
  };
}

const state = new RxJsState<MyState>();
const subscription = state.subscribe();
```

## API

The API in a nutshell
- `$` - The complete state observable
- `set` - Set state imperatively
- `connect` - Connect state reactively 
- `get` - Get current state imperatively
- `select` - Select state changes reactively
- `hold` - maintaining the subscription of a side effect

The best practices in a nutshell
- **Don't nest one of `set`, `connect`, `get`, `select` or `hold` into each other**
- Use `connect` over `set` 
- In most of the cases `get` is not needed. The old state is always available.



### set

**Add new slices to the state by providing an object**

```typescript
const state = new RxJsState<{ foo: string; bar: number }>();
const subscription = state.subscribe();

state.setState({ foo: 'boo' });
// new base-state => { foo: 'boo' }

state.setState({ bar: 2 });
// new base-state => { foo: 'boo', bar: 2 }
```

**Add new Slices to the state by providing a projection function**

```typescript
const state = new RxJsState<{ bar: number }>();
const subscription = state.subscribe();

state.setState({ bar: 1 });
state.setState(currentState => ({ bar: currentState.bar + 2 }));
// new base-state => {bar: 3}
```

### connect

Connect is one of the really cool thingy of this service.
It helps to write the output of an `Observable` to the state and  
handles subscription as well as unsubscription.

**Connect to a single property**

To understand that lets take a look at a normal implementation first:

```typescript
const state = new RxJsState<{ bar: number }>();
const subscription = state.subscribe();

const newBar$ = range(1, 5);
const subscription = newBar$.subscribe(bar => state.setState({ bar }));
subscription.unsubscribe();
```

Now lets compare that example with the connect usage:

```typescript
state.connect('bar', newBar$);
// the property bar will get values 1, 2, 3, 4, 5
```

**Connect multiple properties**

```typescript
const state = new RxJsState<{ foo: string; bar: number }>();
const subscription = state.subscribe();

const slice$ = of({
  bar: 5,
  foo: 'foo'
});
state.connect(slice$);
// new base-state => { foo: 'foo', bar: 5}
```

### select

Selecting state and extend the selection behavior with RxJS operators.
Other state management libs provide selector functions like react. The downside is they are not compossable.
`RxJsState` provides state selection fully reactive.

**State is lazy!**

State is lazy! If nothing is set yet, nothing will emit.
This comes in especially handy for lazy view rendering!

```typescript
const state = new RxJsState<{ foo: string; bar: number }>();
const subscription = state.subscribe();

const bar$ = state.select();
bar$.subscribe(console.log);
// Never emits
```

**Selecting the full state**

```typescript
const state = new RxJsState<{ foo: string; bar: number }>();
const subscription = state.subscribe();

const bar$ = state.select();
bar$.subscribe(console.log);
// Does not emit
state.setState({ foo: 'boo' });
// emits { foo: 'boo'} for all old ane new subscriber
```

**Access a single property**

```typescript
const state = new RxJsState<{ bar: number }>();
const subscription = state.subscribe();

state.setState({ bar: 3 });

const bar$ = state.select('bar');
bar$.subscribe(console.log); // 3
```

**Access a nested property**

```typescript
const state = new RxJsState<{ loo: { boo: number } }>();
const subscription = state.subscribe();

state.setState({ loo: { boo: 42 } });

const boo$ = state.select('loo', 'boo');
boo$.subscribe(console.log); // '42'
```

**Access by providing rxjs operators**

```typescript
const state = new RxJsState<{ loo: { bar: string } }>();
const subscription = state.subscribe();

state.setState({ bar: 'boo' });

const customProp$ = state.select(map(state => state?.loo?.bar));
customProp$.subscribe(console.log); // 'boo'

const customProp$ = state.select(map(state => ({ customProp: state.bar })));
customProp$.subscribe(console.log); // { customProp: 'boo' }
```

### hold

Managing side effects is core of every application.
The `hold` method takes care of handling them.

It helps to handles subscription as well as unsubscription od side-effects

**Hold a local observable side-effect**

To understand that lets take a look at a normal implementation first:

```typescript
const sideEffect$ = btnClick$.pipe(
  tap(clickEvent => this.store.dispatch(loadAction()))
);
const subscription = sideEffect$.subscribe();
subscription.unsubscribe();
```

If you would hold to achieve the same thing it would look like this:

```typescript
const subscription = state.subscribe();
const state = new RxJsState<{ loo: { bar: string } }>();

const sideEffect$ = btnClick$.pipe(
  tap(clickEvent => this.store.dispatch(loadAction()))
);

state.hold(sideEffect$);
```

**Connect an observable trigger and provide an project function that runs the side effect**

```typescript
import { fromEvent } from 'rxjs/observable';
state.hold(btnClick$, clickEvent => console.log(clickEvent));
```

---

**Resources**

Videos:

- [🎥 Tackling Component State Reactively (Live Demo at 24:47)](https://www.youtube.com/watch?v=I8uaHMs8rw0)

Articles:

- [💾 Research on Reactive Ephemeral State](https://dev.to/rxjs/research-on-reactive-ephemeral-state-in-component-oriented-frameworks-38lk)

---
