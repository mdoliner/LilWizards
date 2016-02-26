/**
 * Created by Justin on 2016-02-26.
 */
'use strict';

// Add support for all files in the test directory
const testsContext = require.context('.', true, /\.spec\.js$/);
testsContext.keys().forEach(testsContext);
