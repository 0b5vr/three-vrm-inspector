export const bytesToDisplayBytes = ( bytes: number ): string => {
  if ( bytes < 1024 ) { return bytes + ' B'; }
  else if ( bytes < 1048576 ) { return ( bytes / 1024.0 ).toFixed( 3 ) + ' KB'; }
  else { return ( bytes / 1048576.0 ).toFixed( 3 ) + ' MB'; }
};
