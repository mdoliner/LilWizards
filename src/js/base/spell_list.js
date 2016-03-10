/**
 * The Spells Container
 */
'use strict';
export default {};

const spellListContext = require.context('../spell_list', true, /\.js$/);
spellListContext.keys().forEach(spellListContext);
