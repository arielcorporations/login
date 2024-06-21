function openForm(evt, formName) {
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(formName).style.display = "block";
    evt.currentTarget.className += " active";
}

document.getElementById("defaultOpen").click();

document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var username = document.getElementById('new-username').value;
    var email = document.getElementById('email').value;
    var dob = new Date(document.getElementById('dob').value);
    var password = document.getElementById('new-password').value;

    if (!isValidAge(dob)) {
        alert("You must be at least 13 years old to sign up.");
        return;
    }

    if (!isValidPassword(password)) {
        alert("Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.");
        return;
    }

    fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, email: email, dob: dob, password: password })
    }).then(response => response.json()).then(data => {
        alert(data.message);
        if (data.message === 'User registered successfully') {
            window.location.href = 'https://arielthegeek.github.io/ariel-site/home.html';
        }
    });
});

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, password: password })
    }).then(response => response.json()).then(data => {
        alert(data.message);
        if (data.message === 'Login successful') {
            window.location.href = 'https://arielthegeek.github.io/ariel-site/home.html';
        }
    });
});

function isValidAge(dob) {
    var today = new Date();
    var age = today.getFullYear() - dob.getFullYear();
    var monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    return age >= 13;
}

function isValidPassword(password) {
    var re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
}