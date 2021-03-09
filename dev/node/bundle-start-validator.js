const fs = require('fs');
const readline = require('readline');
const os = require("os");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function check() {
    let port = 8001;
    let host = 'andrey.dagamma.dagam.ma';

    if (!fs.existsSync('./browsersync.config.js')) {

        rl.question('browsersync.config.js не найден. Создаем: ' + os.EOL + 'Укажите порт: (8001) ', (port_answer) => {
            if (port_answer) port = port_answer;

            rl.question('Укажите хост: (andrey.dagamma.dagam.ma) ', (host_answer) => {
                if (host_answer) host = host_answer;

                rl.close();
                write();
            });
        });

    } else {
        console.log('browsersync.config.js:', '\x1b[32m', 'success', '\x1b[0m');
        rl.close();
        return true;
    }

    function write() {
        let newfile =
            `module.exports = {
    port: ${port},
    host: '${host}'
}`;

        fs.writeFileSync('./browsersync.config.js', newfile);

        console.log(`Файл успешно создан. Порт: ${port} Хост: ${host}`);
    }
}

check();