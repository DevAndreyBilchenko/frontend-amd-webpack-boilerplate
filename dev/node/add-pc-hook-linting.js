const fs = require('fs');

function check() {
    const path_to_git_hooks = __dirname.match('(/.+/public_html)')[1] + '/.git/hooks';
    const path_to_library = __dirname.match('.+/public_html/(.+)/dev/node');
    const template = `
    
npm_linting() {
    cd $PWD"/${path_to_library[1]}"

    node --optimize_for_size --max_old_space_size=460 --gc_interval=100 node_modules/.bin/sass-lint -c .sass-lint.yml -v 2>/dev/null

    exit $?
}

npm_linting
    `;

    const path_to_git_hook = path_to_git_hooks + '/pre-commit';

    if (!fs.existsSync(path_to_git_hook)) {
        fs.writeFileSync(path_to_git_hook, `#!/bin/bash ${template}`);
        fs.chmodSync(path_to_git_hook, '770');
    } else {
        let pc_hook = fs.readFileSync(path_to_git_hook);

        if (pc_hook.indexOf(template) === -1) {
            fs.writeFileSync(path_to_git_hook, pc_hook + template);
            fs.chmodSync(path_to_git_hook, '770');
        }
    }
}

check();