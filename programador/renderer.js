/*Declaraci[on de Variables para escritura y lectura de archivos*/
const { dialog } = require('electron').remote // Load the dialogs component of the OS
const fs = require('fs') // Load the File System to execute our common tasks (CRUD)
const { exec } = require('child_process');
let arrData = []

/* document.getElementById("target-file").value = "~/CLIMO_Pagina_ConfiguracionCLIMO/components/include/secrets.h"
readTargetFile("~/CLIMO_Pagina_Configuracion/CLIMO/components/include/secrets.h") */
/*Declaracion de Funciones para escritura y lectura de archivos*/
// Lectura de Archivos
function readFile(filepath) {

    fs.readFile(filepath, 'utf-8', function (err, data) {
        if (err) {
            alert("Un error ha ocurrido leyendo el archivo: " + err.message)
            return
        }
        // console.log("Leido:" + data)
    });

}

function readBDFile(filepath) {

    fs.readFile(filepath, 'utf-8', function (err, data) {
        if (err) {
            alert("Un error ha ocurrido leyendo el archivo: " + err.message)
            return
        }
        arrData = csvToArray(data)
        document.getElementById("content-editor").value = arrData
    });

}

function readTargetFile(filepath) {

    fs.readFile(filepath, 'utf-8', function (err, data) {
        if (err) {
            alert("Un error ha ocurrido leyendo el archivo: " + err.message)
            return;
        }
        document.getElementById("content-target-editor").value = data
    });

}

function readSpiffsFile(filepath) {

    fs.readFile(filepath, 'utf-8', function (err, data) {
        if (err) {
            alert("Un error ha ocurrido leyendo el archivo: " + err.message)
            return;
        }
        document.getElementById("content-spiffs").textContent = data
    });

}

function readSdkConfigFile(filepath) {

    fs.readFile(filepath, 'utf-8', function (err, data) {
        if (err) {
            alert("Un error ha ocurrido leyendo el archivo: " + err.message)
            return;
        }
        document.getElementById("content-sdk").textContent = data
    });

}

// Borrado de Archivos
/* function deleteFile(filepath) {
    fs.exists(filepath, function (exists) {
        if (exists) {
            // File exists deletings
            fs.unlink(filepath, function (err) {
                if (err) {
                    alert("Un error ha ocurrido borrando el archivo: " + err.message);
                    console.log(err);
                    return;
                }
            });
        } else {
            alert("El archivo no existe, no se puede borrar");
        }
    });
} */

// Escritura de archivo para nuevo y actualizaciones
function saveChanges(filepath, content) {
    fs.writeFile(filepath, content, function (err) {
        if (err) {
            alert("Un error ha ocurrido actualizando el archivo" + err.message);
            // console.log(err);
            return;
        }

        console.log("El archivo se guardo satisfactoriamente");
        readFile(filepath)
    });
}

/*Declaracion de funciones para convertir csv en Array*/
function csvToArray(strData) {
    //El delimitaror de datos es una coma ","
    const strDelimiter = ",";

    // Expresi[on regular para parsear el CSV
    var objPattern = new RegExp(
        (
            // Delimitador fields
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

            // Comillas fields
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
    );

    // Array para Contener la data. Por defecto tiene un primer elemento vacio
    arrData = [[]];

    // Array para mantener las conincidencias de la expresion regular en cada grupo.
    var arrMatches = null;

    // Loop que se mantiene mientras exista una coincidencia en la expresion regular
    while (arrMatches = objPattern.exec(strData)) {

        // Encuentra el delimitador
        var strMatchedDelimiter = arrMatches[1];

        //Chequea si hay un cambio de fila
        if (
            strMatchedDelimiter.length &&
            strMatchedDelimiter !== strDelimiter
        ) {

            // Agrega un nuevo array vacio al array de datos
            arrData.push([]);

        }

        // Variable que tendra el Valor encontrado que no es un delimitador
        var strMatchedValue;

        // Se verifica si es una comilla o no
        if (arrMatches[2] != undefined) {

            // Encuentra comillas. y si son dobles las quita
            strMatchedValue = arrMatches[2].replace(
                new RegExp("\"\"", "g"),
                "\""
            );

        } else {

            // Se encontro un valor.
            strMatchedValue = arrMatches[3];

        }

        // Se le agrega a arrData el valor encontrado
        arrData[arrData.length - 1].push(strMatchedValue);
    }
    // Se borra el primer elemento ya que son los ID
    // arrData.splice(0, 1);
    // Se borra el ultimo elemento ya que queda vacio
    arrData.splice(arrData.length - 1, 1);
    // Return the parsed data.
    return (arrData);
}

/* Eventos De los componentes de la Aplicacion*/

/*
// C Boton para crear Archivo
document.getElementById('create-new-file').addEventListener('click', function () {
    var content = document.getElementById("content-editor").value;

    dialog.showSaveDialog(function (fileName) {
        if (fileName === undefined) {
            console.log("No se puede salvar el archivo");
            return;
        }

        fs.writeFile(fileName, content, function (err) {
            if (err) {
                alert("Un error ha ocurrido creando el archivo " + err.message)
            }

            alert("El archivo se guardo satisfactoriamente");
        });
    });
}, false);
*/

// R Boton para selecionar archivo de Base de Datos
document.getElementById('select-file').addEventListener('click', function () {
    dialog.showOpenDialog(function (fileNames) {
        if (fileNames === undefined) {
            // console.log("No hay archivos Seleccionados");
            document.getElementById('number-id').disabled = true;
            document.getElementById('flashing').disabled = true;
        } else {
            readBDFile(fileNames[0]);
            document.getElementById("actual-file").value = fileNames[0];
            document.getElementById('number-id').disabled = false;
            if (document.getElementById("select-target-file").value &&
                document.getElementById('number-id').value) {
                document.getElementById('flashing').disabled = false;
                document.getElementById('config').disabled = false;
            }

        }
    });
}, false);

document.getElementById('select-target-file').addEventListener('click', function () {
    dialog.showOpenDialog(function (fileNames) {
        if (fileNames === undefined) {
            var targetPath = "~/CLIMO_Pagina_Configuracion/CLIMO/components/include/secrets.h"
            document.getElementById("target-file").value = targetPath
            readTargetFile(targetPath);
            document.getElementById('flashing').disabled = true;
            document.getElementById('config').disabled = true;
            if (document.getElementById("actual-file").value &&
                document.getElementById('number-id').value) {
                document.getElementById('flashing').disabled = false;
                document.getElementById('config').disabled = false;
            }

        } else {
            document.getElementById("target-file").value = fileNames[0]
            readTargetFile(fileNames[0]);
            if (document.getElementById("actual-file").value &&
                document.getElementById('number-id').value)
                document.getElementById('flashing').disabled = false;
            document.getElementById('config').disabled = false;
        }
    });
}, false);

/*
// U Boton para salvado de archivos
document.getElementById('save-changes').addEventListener('click', function () {
    var actualFilePath = document.getElementById("actual-file").value;

    if (actualFilePath) {
        saveChanges(actualFilePath, document.getElementById('content-editor').value);
    } else {
        alert("Por favor, selecciona un archivo");
    }
}, false);

// D Boton para borrar archivos
document.getElementById('delete-file').addEventListener('click', function () {
    var actualFilePath = document.getElementById("actual-file").value;

    if (actualFilePath) {
        deleteFile(actualFilePath);
        document.getElementById("actual-file").value = "";
        document.getElementById("content-editor").value = "";
    } else {
        alert("Por favor, selecciona un archivo");
    }
}, false);
*/

// Buscar los parametros asociados al ID
document.getElementById('number-id').addEventListener('keyup', function () {

    if (this.value && document.getElementById("actual-file").value) {
        const checkExist = []
        for (let dato of arrData) {
            if (dato[0] == this.value) {
                document.getElementById("number-key").textContent = dato[1];
                document.getElementById("number-mac").textContent = dato[2];
                checkExist.push(true)
            } else {
                checkExist.push(false)
            }
        }
        if (checkExist.every(item => item === false)) {
            document.getElementById("number-key").textContent = '';
            document.getElementById("number-mac").textContent = '';
            document.getElementById('flashing').disabled = true;
            document.getElementById('config').disabled = true;
        } else {
            if (document.getElementById("target-file").value) {
                // Actualizacion de archivo target o secrets.h
                var contentTarget = document.getElementById("content-target-editor").value
                var numberId = document.getElementById("number-id").value
                var idTarget = new RegExp("(AP_SSID\\s\"CLIMO-)\\w+", "g")
                var id2Target = new RegExp("(CLIMOID\\s\")\\w+", "g")
                var numberKey = document.getElementById("number-key").textContent
                var keyTarget = new RegExp("(KEY\\s\")\\w+", "g")
                var numberMac = document.getElementById("number-mac").textContent
                var macTarget = new RegExp("(MAC\\s\")\\w+", "g")
                var filepath = document.getElementById("target-file").value
                var content = contentTarget

                //Reemplazo de contenido
                content = content.replace(id2Target, "CLIMOID \"" + numberId)
                content = content.replace(idTarget, "AP_SSID \"CLIMO-" + numberId)
                content = content.replace(keyTarget, "KEY \"" + numberKey)
                content = content.replace(macTarget, "MAC \"" + numberMac)

                // Guardar Cambios
                saveChanges(filepath, content)
                document.getElementById("content-target-editor").value = content


                //Modificacion Puerto
                var port = document.getElementById("number-port").value | 0
                document.getElementById("number-port").value = port
                var spiffsPath = "~/CLIMO_Pagina_Configuracion/spiffs_image"
                var sdkConfigPath = "~/CLIMO_Pagina_Configuracion/sdkconfig"
                readSpiffsFile(spiffsPath)
                readSdkConfigFile(sdkConfigPath)
                setTimeout(() => {
                    var portTarget = new RegExp("ttyUSB\\w+", "g")
                    var contentSpiffs = document.getElementById("content-spiffs").value
                    var contentSdkConfig = document.getElementById("content-sdk").value
                    contentSpiffs = contentSpiffs.replace(portTarget, "ttyUSB" + port)
                    contentSdkConfig = contentSdkConfig.replace(portTarget, "ttyUSB" + port)
                    saveChanges(spiffsPath, contentSpiffs)
                    saveChanges(sdkConfigPath, contentSdkConfig)
                    readSpiffsFile(spiffsPath)
                    readSdkConfigFile(sdkConfigPath)
                }, 1000)

                //Habilitar Boton "Procesar"
                document.getElementById('flashing').disabled = false;
                document.getElementById('config').disabled = false;
            }

        }
    } else {
        document.getElementById('flashing').disabled = true;
        document.getElementById('config').disabled = true;
        // console.log("Escriba el ID del dispositivo a configurar");
    }

}, false);

//Cambio de Puerto

document.getElementById('number-port').addEventListener('change', function () {

    var port = document.getElementById("number-port").value | 0
    var spiffsPath = "~/CLIMO_Pagina_Configuracion/spiffs_image"
    var sdkConfigPath = "~/CLIMO_Pagina_Configuracion/sdkconfig"
    readSpiffsFile(spiffsPath)
    readSdkConfigFile(sdkConfigPath)
    setTimeout(() => {
        var portTarget = new RegExp("ttyUSB\\w+", "g")
        var contentSpiffs = document.getElementById("content-spiffs").value
        var contentSdkConfig = document.getElementById("content-sdk").value
        contentSpiffs = contentSpiffs.replace(portTarget, "ttyUSB" + port)
        contentSdkConfig = contentSdkConfig.replace(portTarget, "ttyUSB" + port)
        saveChanges(spiffsPath, contentSpiffs)
        saveChanges(sdkConfigPath, contentSdkConfig)
        readSpiffsFile(spiffsPath)
        readSdkConfigFile(sdkConfigPath)
    }, 1000)


}, false)

// Flashear el Dispositivo
/* document.getElementById('flashing').addEventListener('click', function () {

    //1st Actualiza el archivo secrets.h
    alert("Esto inicia el flasheo");
//ejecuta comandos de programacion
//make menuconfig
//make
//make flash
//make dist

}, false); */
