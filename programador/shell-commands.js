const { exec } = require('child_process');

document.getElementById('flashing').addEventListener('click', function () {

    alert("Esto inicia el flasheo");
    exec('export PATH="$PATH:$HOME/esp/xtensa-esp32-elf/bin"', (error, stdout, stderr) => {
        if (error) { 
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
    });
    exec('make /home/urayi/Documents/climo/CLIMO_Pagina_Configuracion/', (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
    });
    exec('make /home/urayi/Documents/climo/CLIMO_Pagina_Configuracion/','flash', (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
    });
}, false);

document.getElementById('config').addEventListener('click', function () {

    alert("Esto configura y carga la pagina web");
    /* exec('cd /home/urayi/Documents/climo/CLIMO_Pagina_Configuracion/VESAT_mkspiffs_ESP32/ make dist', (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
    }); */

    exec('/home/urayi/Documents/climo/CLIMO_Pagina_Configuracion/spiffs_image', (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
    });

}, false);