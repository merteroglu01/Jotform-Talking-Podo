const protocol = "http://";
const domain = "api.jotform.com";
const port = ':80/';
const rootDocFolder = '';
const apiURL = protocol + domain + port;
const userFolder = apiURL + 'user/';
const jfLogin = userFolder + 'login';

function login(username, password) {
    // Get a token from api server using the fetch api
    var data = new FormData();
    data.append("username", username);
    data.append("password", password);
    data.append("access", "full");
    data.append("appName", "JotformSpeech");
    return fetch(jfLogin, {
        method: 'POST',
        body: data
    }).then(res => {
        return res.json()
    }).then(json => {
        console.log(json);
        if (json.responseCode == 200) {
            setToken(json.content.appKey)
            window.location = "/podo"
        }
        else{
            $('#errMsg').textContent = "error";

        }
    }).catch((error) => {
        console.log(error);
    });
}

function setToken(idToken) {
    // Saves user token to localStorage
    localStorage.setItem('jf_token', idToken)
}

function getToken() {
    // Retrieves the user token from localStorage
    return localStorage.getItem('jf_token')
}

function logout() {
    // Clear user token and profile data from localStorage
    localStorage.removeItem('jf_token');
}