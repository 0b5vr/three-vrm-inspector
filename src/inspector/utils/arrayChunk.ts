/**
 * ```js
 * arrayChunk( [ 1, 2, 3, 4, 5, 6 ], 2 )
 * // will be
 * [ [ 1, 2 ], [ 3, 4 ], [ 5, 6 ] ]
 * ```
 */
export function arrayChunk<T>( array: ArrayLike<T>, every: number ): T[][] {
  const ret: T[][] = [];

  let current: T[] = [];
  let remaining = 0;

  Array.from( array ).forEach( ( el ) => {
    if ( remaining <= 0 ) {
      remaining = every;
      current = [];
      ret.push( current );
    }

    current.push( el );
    remaining --;
  } );

  return ret;
}
