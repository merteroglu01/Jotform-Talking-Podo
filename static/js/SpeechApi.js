var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList

var recognition = new SpeechRecognition();
let formid = 0;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;
let transaction = '';
let firstException = false;
const msg = new SpeechSynthesisUtterance();
const speechSynthesis = window.speechSynthesis;
const jf_token = localStorage.getItem('jf_token');
if (!jf_token) alert("token not valid");
document.body.onclick = function () {
  recognition.start();
  console.log('Ready to receive speech.');
}
const words = document.querySelector(".speechBubbleText");

recognition.onresult = function (event) {
  var last = event.results.length - 1;
  transaction = event.results[last][0].transcript;

  words.textContent = transaction;

}
let sentence = '';
recognition.onend = async function () {
  console.log(transaction);
  recognition.stop();
  if (!transaction) {
    recognition.start();
    return;
  }
  if (includes("hello")) {
    console.log("hello");
    sentence = "Hello";
    setSentence(sentence);

  }
  else if (includes("show")) {

    if (includes("link")) {
      sentence = "Your link is ready!";
      setSentence(sentence);
      const infoPrefix = document.querySelector("#formPrefix");
      var formLink = "https://jotform.com/" + formid;
      const formLinkElement = document.querySelector("#formLink");
      infoPrefix.textContent = "Form : ";
      formLinkElement.textContent = formLink;
      formLinkElement.setAttribute("href", formLink);
    }

    else if(includes("forms")){
      sentence = "Showing your forms.";
      setSentence(sentence);
      let iframe = document.getElementById('JotFormIFrame');
      iframe.src = "myforms.html";
    }

  }
  else if (includes("form")) {
    if (includes("create") ||  includes("need")) {
      console.log("create form");
      await createForm();
    }
  }
  else if (includes("add")) {
    if (includes("field") ||  includes("failed")) {
      if (includes("address")) {
        await addQuestion("Address");
      }
      else if (includes("name")) {
        await addQuestion("Name");
      }
      else if (includes("email")) {
        await addQuestion("Email");
      }
      else if (includes("submit")) {
        await addQuestion("Submit");
      }
      else {
        sentence = "Invalid field type";
        setSentence(sentence);
      }
    }
    else if (includes("button")) {
      if (includes("submit")) {
        await addQuestion("Submit");
      }
    }

  }
  else if (includes("what") || includes("who") || includes("which") || includes("where")
    || includes("how many") || includes("how much") || includes("when") || includes("how")) {

    if (includes("who")) {
      console.log("who");
      if (includes("you")) {
        console.log("you");
        if (includes("design")) {
          console.log("design");
          sentence = "I am designed by the JotForm Design Team & thanks to Mert i am talking now.";
          setSentence(sentence);

        }
        if (includes("are")) {
          console.log("are");
          sentence = "I am Podo";
          setSentence(sentence);

        }
      }
    }
    else if (includes("how many")) {
      console.log("how many");
      if (includes("language") && (includes("you") || includes("to"))) {
        sentence = "Jestem biegły w ponad 18 językach. (Polish for \“I\’m fluent in 18 different languages\")";
        setSentence(sentence);
      }
    }
    else if (includes("what")) {
      console.log("what");
      if (includes("you")) {
        if (includes("hobby") || includes("like")) {
          sentence = "There’s nothing in the world I enjoy more than helping JotForm users. And tuna. I LOVE tuna.";
          setSentence(sentence);
        }
        else if (includes("name")) {
          sentence = "My name is Podo";
          setSentence(sentence);
        }
      }
    }
    else if (includes("how")) {
      if (includes("you")) {
        if (includes("cute")) {
          sentence = "I’m dangerously cute. Obviously";
          setSentence(sentence);
        }
      }
    }
  }
  else if(includes("log out")){
    localStorage.setItem("jf_token",null);
    window.location = "/podo/login.html";
  }
  else {
    if (!firstException) {
      sentence = "I didn't get that. Maybe i should read more books to learn people's world.";
      setSentence(sentence);
      firstException = true;
    }
    else {
      sentence = "I didn't get that.";
      setSentence(sentence);
    }

  }
  recognition.stop();
  speechSynthesis.speak(msg);
  transaction = '';
}

recognition.onspeechend = function () {
  recognition.stop();
}

function setSentence(sentence) {
  words.textContent = sentence;
  msg.text = sentence;
}

function includes(word) {
  return transaction.includes(word);
}



// */*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/

const protocol = "http://";
const domain = "api.jotform.com";
const port = ':80/';
const rootDocFolder = '';
const apiURL = protocol + domain + port;
const userFolder = apiURL + 'user';
const formFolder = apiURL + 'form';
const qFolder = apiURL + 'question';
const qsFolder = apiURL + 'questions';

function getURL(url, type = 0) {
  if (type) return url;
  return url + '?apikey=' + jf_token;
}

function createForm() {
  var data = new FormData();
  return fetch(getURL(formFolder), {
    method: 'POST',
    body: data
  }).then(res => {
    return res.json()
  }).then(json => {
    console.log(json);
    if (json.responseCode == 200) {
      sentence = "Form created";
      setSentence(sentence);
      formid = json.content.id;
      let iframe = document.getElementById('JotFormIFrame');
      iframe.src = "https://form.jotform.com/" + formid;

    }
    else {
      sentence = "Error during creating form details:" + json.message;
      setSentence(sentence);
    }
  }).catch((error) => {
    console.log(error);
  });
}

function addQuestion(type) {
  var data = new FormData();
  if (type == "Email") {
    data.append("question[text]", "Email Address");
    data.append("question[type]", "control_email");
    data.append("question[name]", "example@example.com");
  }
  else if (type == "Name") {
    data.append("question[text]", "Full Name");
    data.append("question[type]", "control_fullname");
    data.append("question[name]", "Jon Doe");
  }
  else if (type == "Address") {
    data.append("question[text]", "Address");
    data.append("question[type]", "control_address");
  }
  else if (type == "Submit") {
    data.append("question[text]", "Submit");
    data.append("question[type]", "control_button");
  }
  return fetch(getURL(formFolder, 1) + '/' + formid + '/questions' + '?apiKey=' + jf_token, {
    method: 'POST',
    body: data
  }).then(res => {
    return res.json()
  }).then(json => {
    console.log(json);
    if (json.responseCode == 200) {
      sentence = type + " field added.";
      setSentence(sentence);
      let iframe = document.getElementById('JotFormIFrame');
      iframe.src = "https://form.jotform.com/" + formid;

    }
    else {
      sentence = "Error during adding a new field" + json.message;
      setSentence(sentence);
    }
  }).catch((error) => {
    console.log(error);
  });
}
