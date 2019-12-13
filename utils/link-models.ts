/* eslint-env node */

import fs from 'fs';
import path from 'path';

const dist = path.resolve( __dirname, '../dist' );
const target = path.resolve( __dirname, '../models' );
const link = path.resolve( __dirname, '../dist/models' );

if ( !fs.existsSync( link ) ) {
  if ( !fs.existsSync( dist ) ) {
    console.info( 'Creating ./dist' );
    fs.mkdirSync( dist );
  }

  console.info( 'Linking ./dist/models' );
  fs.symlinkSync( target, link, 'junction' );
}
