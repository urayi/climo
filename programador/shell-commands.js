// const { exec } = require('child_process')
const { spawn } = require('child_process')
var x = ''

document.getElementById('flashing').addEventListener('click', function () {

    document.getElementById('flashing').disabled = true
    document.getElementById('config').disabled = true
    const flasher = spawn('./flasher');
    /*     alert("Esto inicia el flasheo")
        document.getElementById('flashing').disabled = true
        document.getElementById('config').disabled = true
        console.log('Flashing...')
        exec('./flasher', (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                document.getElementById('flashing').disabled = false
                document.getElementById('config').disabled = false
                return;
            }
            console.log(`stdout: ${stdout}`)
            console.log(`stderr: ${stderr}`)
            if (stdout && !(stderr == '')) {
                alert("Dispositivo configurado")
            } else {
                alert("Es posible que ocurriera un error:" + stderr)
            }
            document.getElementById('flashing').disabled = false
            document.getElementById('config').disabled = false
        }) */

    // stream
    flasher.stdout.on('data', (data) => {
        x = document.getElementById('terminal').value
        document.getElementById('terminal').innerHTML = x + data
        document.getElementById('terminal').scrollTop =  document.getElementById('terminal').scrollHeight
    });

    flasher.stderr.on('data', (data) => {
        x = document.getElementById('terminal').value
        document.getElementById('terminal').innerHTML = x + data
        document.getElementById('terminal').scrollTop =  document.getElementById('terminal').scrollHeight
    });

    flasher.on('close', (code) => {
        x = document.getElementById('terminal').value
        document.getElementById('terminal').innerHTML = x + code
        document.getElementById('flashing').disabled = false
        document.getElementById('config').disabled = false
        document.getElementById('terminal').scrollTop =  document.getElementById('terminal').scrollHeight
    });

}, false);

document.getElementById('config').addEventListener('click', function () {

    document.getElementById('flashing').disabled = true
    document.getElementById('config').disabled = true
    const config = spawn('./config');
    /*     alert("Esto configura y carga la pagina web");
        document.getElementById('flashing').disabled = true
        document.getElementById('config').disabled = true
        console.log('Flashing...')
        exec('./config', (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                document.getElementById('flashing').disabled = false
                document.getElementById('config').disabled = false
                return;
            }
            console.log(`stdout: ${stdout}`);
            alert("Dispositivo configurado");
            console.log(`stderr: ${stderr}`);
            document.getElementById('flashing').disabled = false
            document.getElementById('config').disabled = false
        }) */

    config.stdout.on('data', (data) => {
        x = document.getElementById('terminal').value
        document.getElementById('terminal').innerHTML = x + data
        document.getElementById('terminal').scrollTop =  document.getElementById('terminal').scrollHeight
    });

    config.stderr.on('data', (data) => {
        x = document.getElementById('terminal').value
        document.getElementById('terminal').innerHTML = x + data
        document.getElementById('terminal').scrollTop =  document.getElementById('terminal').scrollHeight
    });

    config.on('close', (code) => {
        x = document.getElementById('terminal').value
        document.getElementById('terminal').innerHTML = x + code
        document.getElementById('flashing').disabled = false
        document.getElementById('config').disabled = false
        document.getElementById('terminal').scrollTop =  document.getElementById('terminal').scrollHeight
    });

}, false)