const { copySync } = require('fs-extra');

/** copying photo gallery swiper script, required to library internal imports */
copySync(__dirname + '/../node_modules/photoswipe/dist/photoswipe.esm.js', __dirname + '/../src/assets/scripts/photoswipe.esm.js', { overwrite: true });
