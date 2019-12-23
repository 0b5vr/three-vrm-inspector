/* eslint-env node */

import fs from 'fs-extra';
import path from 'path';

const src = path.resolve( __dirname, '../models' );
const dst = path.resolve( __dirname, '../dist/models' );

fs.copySync( src, dst );
