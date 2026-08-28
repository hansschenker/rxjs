import { Subject } from './Subject';
import { Subscriber } from './Subscriber';
import { Subscription } from './Subscription';

/**
 * A variant of Subject that requires an initial value and emits its current
 * value whenever it is subscribed to.
 */
export class BehaviorSubject<T> extends Subject<T> {
  constructor(private _value: T) {
    super();
  }

  /** @internal */
  protected _subscribe(subscriber: Subscriber<T>): Subscription {
    const subscription = super._subscribe(subscriber);
    !subscription.closed && subscriber.next(this._value);
    return subscription;
  }

  getValue(): T {
    const { hasError, thrownError, _value } = this;
    if (hasError) {
      throw thrownError;
    }
    this._throwIfClosed();
    return _value;
  }

  next(value: T): void {
    super.next((this._value = value));
  }
}

/**
 * ES3 downlevel experiment: keep the public `value` property in the type
 * surface while expressing the accessor without TypeScript accessor syntax.
 */
export interface BehaviorSubject<T> {
  readonly value: T;
}

Object.defineProperty(BehaviorSubject.prototype, 'value', {
  configurable: true,
  enumerable: false,
  get: function (this: BehaviorSubject<any>) {
    return this.getValue();
  },
});
