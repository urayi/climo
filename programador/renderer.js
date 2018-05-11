/*Declaraci[on de Variables para escritura y lectura de archivos*/
const { dialog } = require('electron').remote // Load the dialogs component of the OS
const fs = require('fs') // Load the File System to execute our common tasks (CRUD)
let arrData = []
/*Declaracion de Funciones para escritura y lectura de archivos*/
// Lectura de Archivos

function readFile(filepath) {
    fs.readFile(filepath, 'utf-8', function (err, data) {
        if (err) {
            alert("Un error ha ocurrido leyendo el archivo: " + err.message)
            return;
        }
        arrData = csvToArray(data)
        console.log(arrData)
        document.getElementById("content-editor").value = arrData

    });
}

// Borrado de Archivos
function deleteFile(filepath) {
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
}

// Escritura de archivo para nuevo y actualizaciones
function saveChanges(filepath, content) {
    fs.writeFile(filepath, content, function (err) {
        if (err) {
            alert("Un error ha ocurrido actualizando el archivo" + err.message);
            console.log(err);
            return;
        }

        alert("El archivo se guardo satisfactoriamente");
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

        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        // Se verifica si es una comilla o no
        if (arrMatches[2] != undefined) {

            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            strMatchedValue = arrMatches[2].replace(
                new RegExp("\"\"", "g"),
                "\""
            );

        } else {

            // Se encontro un valor.
            strMatchedValue = arrMatches[3];

        }


        // Now that we have our value string, let's add
        // it to the data array.
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

// R Boton para selecionar archivo
document.getElementById('select-file').addEventListener('click', function () {
    dialog.showOpenDialog(function (fileNames) {
        if (fileNames === undefined) {
            console.log("No hay archivos Seleccionados");
            document.getElementById('number-id').disabled = true;
            document.getElementById('flashing').disabled = true;
        } else {
            document.getElementById("actual-file").value = fileNames[0];
            document.getElementById('number-id').disabled = false;
            readFile(fileNames[0]);
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
                document.getElementById("show-key").textContent = dato[1];
                document.getElementById("show-mac").textContent = dato[2];
                checkExist.push(true)
            } else {
                checkExist.push(false)
            }
        }
        if (checkExist.every(item => item === false)) {
            document.getElementById("show-key").textContent = '';
            document.getElementById("show-mac").textContent = '';
        } else {
            document.getElementById('flashing').disabled = false;
        }
    } else {
        document.getElementById('flashing').disabled = true;
        alert("Escriba el ID del dispositivo a configurar");
    }

}, false);

document.getElementById('flashing').addEventListener('click', function () {

    alert("Esto inicia el flasheo");

}, false);