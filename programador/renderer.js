// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.\\
const { dialog } = require('electron').remote // Load the dialogs component of the OS
const fs = require('fs') // Load the File System to execute our common tasks (CRUD)


document.getElementById('select-file').addEventListener('click', function () {
    dialog.showOpenDialog(function (fileNames) {
        if (fileNames === undefined) {
            console.log("No file selected");
        } else {
            document.getElementById("actual-file").value = fileNames[0];
            readFile(fileNames[0]);
        }
    });
}, false);

document.getElementById('save-changes').addEventListener('click', function () {
    var actualFilePath = document.getElementById("actual-file").value;

    if (actualFilePath) {
        saveChanges(actualFilePath, document.getElementById('content-editor').value);
    } else {
        alert("Please select a file first");
    }
}, false);

document.getElementById('delete-file').addEventListener('click', function () {
    var actualFilePath = document.getElementById("actual-file").value;

    if (actualFilePath) {
        deleteFile(actualFilePath);
        document.getElementById("actual-file").value = "";
        document.getElementById("content-editor").value = "";
    } else {
        alert("Please select a file first");
    }
}, false);

document.getElementById('create-new-file').addEventListener('click', function () {
    var content = document.getElementById("content-editor").value;

    dialog.showSaveDialog(function (fileName) {
        if (fileName === undefined) {
            console.log("You didn't save the file");
            return;
        }

        fs.writeFile(fileName, content, function (err) {
            if (err) {
                alert("An error ocurred creating the file " + err.message)
            }

            alert("The file has been succesfully saved");
        });
    });
}, false);

function deleteFile(filepath) {
    fs.exists(filepath, function (exists) {
        if (exists) {
            // File exists deletings
            fs.unlink(filepath, function (err) {
                if (err) {
                    alert("An error ocurred updating the file" + err.message);
                    console.log(err);
                    return;
                }
            });
        } else {
            alert("This file doesn't exist, cannot delete");
        }
    });
}

function saveChanges(filepath, content) {
    fs.writeFile(filepath, content, function (err) {
        if (err) {
            alert("An error ocurred updating the file" + err.message);
            console.log(err);
            return;
        }

        alert("The file has been succesfully saved");
    });
}

function readFile(filepath) {
    fs.readFile(filepath, 'utf-8', function (err, data) {
        if (err) {
            alert("An error ocurred reading the file :" + err.message)
            return;
        }
        var arrData = csvToArray(data)
        console.log(arrData)
        document.getElementById("content-editor").value = arrData
        
        
    });
}

function csvToArray(strData) {
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = ",";

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
    );


    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;


    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec(strData)) {
        console.log(arrMatches)
        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[1];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length &&
            strMatchedDelimiter !== strDelimiter
        ) {

            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push([]);

        }

        var strMatchedValue;

        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[2]) {

            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            strMatchedValue = arrMatches[2].replace(
                new RegExp("\"\"", "g"),
                "\""
            );

        } else {

            // We found a non-quoted value.
            strMatchedValue = arrMatches[3];

        }


        // Now that we have our value string, let's add
        // it to the data array.
        arrData[arrData.length - 1].push(strMatchedValue);
    }

    // Return the parsed data.
    return (arrData);
}
