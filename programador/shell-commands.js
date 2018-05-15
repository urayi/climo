const { exec } = require('child_process')

document.getElementById('flashing').addEventListener('click', function () {

    alert("Esto inicia el flasheo")
    document.getElementById('flashing').disabled = true
    document.getElementById('config').disabled = true
    console.log('Flashing...')
    exec('flasher', (error, stdout, stderr) => {
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
    })

}, false);

document.getElementById('config').addEventListener('click', function () {

    alert("Esto configura y carga la pagina web");
    document.getElementById('flashing').disabled = true
    document.getElementById('config').disabled = true
    console.log('Flashing...')
    exec('config', (error, stdout, stderr) => {
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
    })

}, false)