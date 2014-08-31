document.getElementById('changeMail').onclick = function () {
    if (document.getElementById("mailForm").style.display == "none") {
        document.getElementById("mailForm").style.display = "block";
    } else {
        document.getElementById("mailForm").style.display = "none";
    }
};

document.getElementById('changePass').onclick = function () {
    if (document.getElementById("passForm").style.display == "none") {
        document.getElementById("passForm").style.display = "block";
    } else {
        document.getElementById("passForm").style.display = "none";
    }
}; 

document.getElementById('changeDob').onclick = function () {
    if (document.getElementById("dobForm").style.display == "none") {
        document.getElementById("dobForm").style.display = "block";
    } else {
        document.getElementById("dobForm").style.display = "none";
    }
};

function validatePass () {
    if (document.getElementById('retype').value !== document.getElementById('newPass').value) {
        document.getElementById('match').innerHTML = "* Your passwords does not match";
        return false;
    } else {
        document.getElementById('match').innerHTML = '';
        return true;
    }
}