const { shell } = require('electron');
const $ = require('jquery');
const fs = require('fs');
const { dir } = require('console');
const node_path = require('path');

let Paths = [];
let directory;
let type_Struct;

/*==| Functions for drag and drop files |==*/
$('#drop-zone').on('dragover', (event) => {
    event.preventDefault();
    $('#drop-zone').css('border-color', '#017AFF');
});

$('#drop-zone').on('drop', (event) => {
    event.preventDefault();
    $('#drop-zone').css('border-color', '#BBBBBB');

    let files_count = event.originalEvent.dataTransfer.files.length;
    
    $('#upload-button').css({
        "left": '10px',
        "top": "10px",
        "height": "50px",
        "width": "50px",
    });

    $('#upload-text').css({
        "display": "none",
        "visibility": "hidden"
    });
    
    for (let i = 0; i < files_count; i++) {
        let path = event.originalEvent.dataTransfer.files.item(i).path;
        Paths.push(path);

        createNewPathOnDisplay(path);
    }

    // console.log(Paths);
});

/*==| Buttons handlers |== */
$('#button-start').on('click', () => {
    if (Paths.length != 0) {
        let value = $('input[name="rad-type"]:checked').val();
        type_Struct = value;

        $('#finish-directory-path').css({
            "visibility": "visible",
            "display": "block",
        });
    }
});

$('#close').on('click', () => {
    $('#finish-directory-path').css({
        "visibility": "hidden",
        "display": "none",
    });
});

const createNewPathOnDisplay = (path) => {
    let newSpan = document.createElement('span');
    newSpan.classList.add('uploaded-path');
    newSpan.innerText = path;

    document.getElementById('drop-zone').appendChild(newSpan);
    document.getElementById('drop-zone').appendChild(document.createElement('br'));
}

/*==| Inputs handlers |== */
$('#upload-button').on('change', (event) => {
    // console.log($('#upload-button').val());
    let count_of_files = event.originalEvent.target.files.length;

    $('#upload-button').css({
        "left": '10px',
        "top": "10px",
        "height": "50px",
        "width": "50px",
    });

    $('#upload-text').css({
        "display": "none",
        "visibility": "hidden"
    });

    for (let i = 0; i < count_of_files; i++) {
        let path = event.originalEvent.target.files.item(i).path;
        Paths.push(path);

        createNewPathOnDisplay(path);
    }
});

$('#finishButton').on('change', (event) => {
    // console.log($('#upload-button').val());

    $('#upload-button').css({
        "left": '10px',
        "top": "10px",
        "height": "50px",
        "width": "50px",
    });

    $('#upload-text').css({
        "display": "none",
        "visibility": "hidden"
    });

    let buffer_path = event.originalEvent.target.files[0].path;
    let dirPath = buffer_path.slice(0, buffer_path.lastIndexOf('\\') + 1);
    directory = dirPath;
});

const checkDirectoryExisting = (dir_path) => {
    if (!fs.existsSync(dir_path)) {
        fs.mkdirSync(dir_path);
    }
}


$('#FinButton').on('click', () => {

    document.getElementById('FinButton').innerText = "Wait...";
    Paths.forEach(path => {
        const file_name = node_path.basename(path);
        fs.stat(path, (err, stats) => {
            if (err) throw err;

            let buff_path;

            switch (type_Struct) {
                case 'rdoc':
                    /* Create folder by time of changing */
                    const date = new Date(stats.mtime);
                    const day = date.getDate();
                    const month = date.getMonth() + 1; // Add 1 to convert from 0-based to 1-based indexing
                    const year = date.getFullYear();
        
                    const formattedDate = `${day}.${month}.${year}`;
                    
                    buff_path = directory + formattedDate;

                    break;

                case 'rir':
                    buff_path = directory + stats.uid;
                    break;
            }
            
            checkDirectoryExisting(buff_path);
            fs.copyFileSync(path, buff_path + '/' + file_name);

        });
    });

    document.getElementById('FinButton').innerText = "Finished!";
});


// Open urls in browser
$(document).on('click', 'a[href^="https"]', (event) => {
    event.preventDefault();
    shell.openExternal(this.href);
});
