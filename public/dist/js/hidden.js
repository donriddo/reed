if (document.getElementById("title").innerHTML == 'Reed') {
    document.getElementById('home').className = 'active';
} else if (document.getElementById("title").innerHTML == 'Sign in') {
    document.getElementById('in').className = 'active';
} else if (document.getElementById("title").innerHTML == 'Sign up - Step 1' || document.getElementById("title").innerHTML == 'Sign up - Step 2') {
    document.getElementById('up').className = 'active';
} else {
    document.getElementById('about').className = 'active';
}

if (document.getElementById('errMsg').innerHTML != "") {
    document.getElementById('error').style.display = "block";
} else {
    document.getElementById('error').style.display = "none";
}