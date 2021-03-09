let browserSync = require("browser-sync"),
    browser_sync_config = require('../../browsersync.config'),
    http = require("http"),
    us = require("./update-stack"),
    UpdateStack = us.UpdateStack,
    update_stack = us.update_stack_arr;


let bs = browserSync.create();
let last_js_timeout;
let inner_js_timeout;

// update_stack.watch(500);

bs.watch("./js/*.js").on("change", function (file_name, file) {
    // console.log(file_name, file);
    // console.log('file_name', file_name);
    // console.log('file', file);

    bs.pause();

    clearTimeout(last_js_timeout);

    last_js_timeout = setTimeout(function () {
        bs.resume();
        bs.reload();
    }, 3000);
    //
    // last_js_timeout = setTimeout(function () {
    //     clearTimeout(inner_js_timeout);
    //
    //     if (update_stack.getCountByName(file_name) > 1) {
    //         setTimeout(function () {
    //             bs.reload();
    //         }, 500);
    //     } else {
    //         bs.reload();
    //     }
    //
    // }, 500);
    //
    //
    // update_stack.push(new UpdateStack(file_name));

    // console.log('change', file_name);
});

function reload() {

}

bs.init({
    host: 'localhost',
    proxy: browser_sync_config.host,
    port: browser_sync_config.port,
    open: false,
    ui: false,
    notify: true,
    reloadDelay: 500,
    reloadThrottle: 500,
    watchEvents: [
        "change",
        "add"
    ],
    injectChanges: true,
    files: [
        "./css/*.css",
        // "./js/*.js",
        "../../**/*.php",
        "../../**/*.twig"
    ]
});

// browserSync({
//     host: 'localhost',
//     proxy: browser_sync_config.host,
//     port: browser_sync_config.port,
//     open: false,
//     ui: false,
//     notify: true,
//     reloadDelay: 2000,
//     reloadDebounce: 1000,
//     reloadThrottle: 2000,
//     watchEvents: [
//         "change",
//         "add"
//     ],
//     injectChanges: true,
//     files: [
//         "./css/*.css",
//         "./js/*.js",
//         "../../**/*.php",
//         "../../**/*.twig"
//     ]
// });