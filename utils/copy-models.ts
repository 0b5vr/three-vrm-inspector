/* eslint-env node */

import fs from 'fs-extra';
import path from 'path';

const src = path.resolve( __dirname, '../assets' );
const dst = path.resolve( __dirname, '../dist/assets' );

fs.copySync( src, dst );
