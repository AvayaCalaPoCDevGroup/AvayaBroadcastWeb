/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

console.log('LogIn.js');

var absolutepath = getAbsolutePath();
console.log(absolutepath);
function getAbsolutePath() {
    var loc = window.location;
    var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
    return loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
}

document.cookie = "JWT= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";



document.getElementById('submitbtn').addEventListener('click', function (e) {

    e.preventDefault();
    document.getElementById('loaderDisplay').classList.add('is-active');
    document.getElementById("loaderDisplay").setAttribute("data-text", "Validando Información");

    console.log("Submit");
    var email = validateEmail(document.getElementById('email').value);

    if (document.getElementById('country').value === "" || document.getElementById('country').value.length === 0) {
        Swal({
            type: 'error',
            title: 'Error',
            text: 'Please establish the country of origin.'

        });
        document.getElementById('loaderDisplay').classList.remove('is-active');
    } else if (document.getElementById('cliente').value === "" || document.getElementById('cliente').value.length === 0 || /^\s+$/.test(document.getElementById('cliente').value) || document.getElementById('cliente').value.match(/Avaya/) || document.getElementById('cliente').value.match(/AVAYA/) || document.getElementById('cliente').value.match(/avaya/)) {
        Swal({
            type: 'error',
            title: 'Error',
            text: 'Please do not enter Avaya as a customer.'

        });
        document.getElementById('loaderDisplay').classList.remove('is-active');
    } else if (email !== true) {
        Swal({
            type: 'error',
            title: 'Error',
            text: 'Please enter the email correctly'
        });
        document.getElementById('loaderDisplay').classList.remove('is-active');
    } else if (document.getElementById('pass').value === "" && email !== true) {
        Swal({
            type: 'error',
            title: 'Error',
            text: 'Please enter the password'
        });
        document.getElementById('loaderDisplay').classList.remove('is-active');
    } else {
        // var data = new FormData();
        // data.append("action", "LogIn");
        // data.append("Email", CryptoJS.AES.encrypt(document.getElementById('email').value, "AdminControlPoC"));
        // data.append("Pass", CryptoJS.AES.encrypt(document.getElementById('pass').value, "AdminControlPoC"));
        // data.append("Cliente", CryptoJS.AES.encrypt(document.getElementById('cliente').value, "AdminControlPoC"));
        // data.append("Pais", CryptoJS.AES.encrypt(document.getElementById('country').value, "AdminControlPoC"));
        var data = {
            action: "LogIn",
            email: document.getElementById('email').value,
            pass: document.getElementById('pass').value,
            client: document.getElementById('cliente').value,
            country: document.getElementById('country').value
        };
        var jsondata = JSON.stringify(data);

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                document.getElementById("loaderDisplay").classList.remove("is-active");
                document.getElementById("loaderDisplay").setAttribute("data-text", "");
                try {
                    var result = JSON.parse(this.responseText);
                    if (result.resp == "authorized") {
                        console.log("Result OK");
                        window.location.reload();
                    } else {
                        Swal({
                            type: 'error',
                            title: 'Error',
                            text: result.resp
                        });
                    }
                } catch (error) {
                    console.log(error);
                    Swal({
                        type: 'error',
                        title: 'Error',
                        text: 'Error'
                    });
                }

            }
        });

        xhr.open("POST", absolutepath + "login", true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(jsondata);
    }
});

document.getElementById('forgotten').addEventListener('click', function (e) {
    e.preventDefault();
    console.log("Forgotten");
});


function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

var delete_cookie = function (name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};