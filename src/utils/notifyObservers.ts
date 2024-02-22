/**
 * A bare function to notify observers.
 * The incredibly cheap implementation of the observer pattern.
 *
 * @example
 * ```ts
 * const observers = new Set<( text: string ) => void>();
 *
 * observers.add( ( text ) => console.log( text ) );
 * observers.add( ( text ) => alert( text ) );
 *
 * notifyObservers( observers, 'wenis' );
 * ```
 *
 * @param observers The iterator of observers
 * @param param The param you want to give to observers
 */
export function notifyObservers( observers: Iterable<() => void> ): void;
export function notifyObservers<T>( observers: Iterable<( arg: T ) => void>, param: T ): void;
export function notifyObservers( observers: Iterable<( arg: any ) => void>, param?: any ): void {
  for ( const observer of observers ) {
    observer( param );
  }
}
