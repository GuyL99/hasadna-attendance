function attemptAuth(event) {
    if (event.preventDefault) {
        event.preventDefault();
    }
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function () {
        window.location.href = '/index.html';
    }).catch(function (error) {
        if (error && error.code === 'auth/user-not-found') {
            if (password.length < 7) {
                document.getElementById('error').textContent = 'על הסיסמה לכלול לפחות 7 תווים';
                return false;
            }

            return firebase.auth().createUserWithEmailAndPassword(email, password).then(function (user) {
                firebase.database().ref('/users/' + email.split('.').join(',')).set({
                    uid: user.uid
                }).then(function () {
                    window.location.href = '/profile.html?attend';
                });
            }).catch(function (error) {
                console.log(error.code, error.message);
            });
        } else if (error) {

            if (error.code === 'auth/wrong-password') {
                document.getElementById('error').textContent = 'סיסמה לא נכונה';
            }

            console.log(error.code, error.message);
        }
    });
    return false;
}

var form = document.getElementById('attempt-form');
if (form.attachEvent) {
    form.attachEvent('submit', attemptAuth);
} else {
    form.addEventListener('submit', attemptAuth);
}
