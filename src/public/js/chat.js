/*CHAT*/

/*********************************************************CONSTANTES/VARIABLES*************************************************************/
const socket = io();
let URLorigin = window.location.origin,
  UrlU = URLorigin + "/api/users",
  UrlM = URLorigin + "/api/messages",
  UrlLogin = URLorigin + "/api/sessions/",
  UrlCook = URLorigin + "/api/";
let swalActive = "inactive";
let email;
let backMessages = [];

let log = document.querySelector(".chat__container__dinamic");

const chatBox = document.getElementById("chatBox"),
  btnSend = document.getElementById("btnSend"),
  emailLogged = document.querySelector(".nav__container--email-logged u"),
  rolLogged = document.querySelector(".nav__container--email-logged b");

/*****************************************************************CLASES*************************************************************/
class newMessage {
  constructor(user, message) {
    this.user = user;
    this.message = message;
  }
}
/*****************************************************************FUNCIONES*************************************************************/

function loadMessages() {
  /***************************LOAD MSJS DIRECTLY FROM DATABASE***************************/
  /*getData(UrlM).then((data) => {
    let messages = "";
    data.forEach((elem) => {
      messages += `
      <div class="chat__message">
        <div class="chat__message--bubble">
          <div class="chat__message--sender">${elem.user}</div>
          <p>${elem.message}</p>
        </div>
      </div>
      `;
    });
    log.innerHTML = messages;
    const bubbleMessage = document.querySelectorAll(".chat__message--bubble");
    bubbleMessage[bubbleMessage.length - 1].scrollIntoView();
  });
}*/

  /******************************LOAD MSJS FROM ARRAY**************************************/
  let messages = "";
  backMessages.forEach((elem) => {
    messages += `
      <div class="chat__message">
        <div class="chat__message--bubble">
          <div class="chat__message--sender">${elem.user}</div>
          <p>${elem.message}</p>
        </div>
      </div>
      `;
    log.innerHTML = messages;
    focusLastMessage();
  });
}

async function validateSession(role, email) {
  swalActive = "active";
  Swal.fire({
    title: `${role} ACTIVE SESSION`,
    text: "Welcome: " + email,
    icon: "info",
    showDenyButton: true,
    confirmButtonText: "Continue session",
    denyButtonText: "Close session",
    preConfirm: () => {
      swalActive = "inactive";
    },
  }).then(async (result) => {
    if (result.isConfirmed) {
      socket.emit("newUser", { user: email, id: socket.id });
      loadMessages();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Session Started Successfully",
        showConfirmButton: false,
        allowOutsideClick: false,
        timer: 1500,
      });
    } else if (result.isDenied) {
      await closeSession(role, email);
    }
  });
}

async function closeSession(role, email) {
  swalActive = "active";
  Swal.fire({
    title: "ARE YOU SURE TO END YOUR SESSION?",
    text: `${role} SESSION: ${email}`,
    icon: "warning",
    showDenyButton: true,
    confirmButtonColor: "#3085d6",
    denyButtonColor: "#d33",
    confirmButtonText: "Yes, close session.",
    denyButtonText: "Not, cancel.",
    preConfirm: () => {
      swalActive = "inactive";
    },
  }).then(async (result) => {
    if (result.isConfirmed) {
      const msj = await logoutSession();
      if (msj) {
        setTimeout(() => {
          window.location.href = "../login";
        }, 3000),
          Swal.fire({
            position: "center",
            icon: "info",
            title: msj,
            text: "Redirigiendo al login",
            showConfirmButton: false,
            allowOutsideClick: false,
          });
      }
    } else if (result.isDenied) {
      validateSession(role, email);
    }
  });
}

function sendMessage() {
  if (chatBox.value.trim().length > 0) {
    const newmessage = new newMessage(emailLogged.innerHTML, chatBox.value);
    postData(UrlM, newmessage).then(async (data) => {
      if (data.status === 200) {
        console.log("Message send");
        socket.emit("newMessage", data.sessionData);
      } else if (data.status === 401 || 403 || 404) {
        console.warn("Client authorization expired or invalid");
        Swal.fire(data.sessionData.error, "", "error");
      }
    });
    chatBox.value = "";
  }
}

function focusLastMessage() {
  const bubbleMessage = document.querySelectorAll(".chat__message--bubble");
  if (bubbleMessage.length > 0) {
    bubbleMessage[bubbleMessage.length - 1].scrollIntoView();
  }
}

async function focusbtn() {
  const buttonsMax = document.querySelectorAll(".div__container--focusBtn a");
  const buttonsMin = document.querySelectorAll(".asideSD__dropdown--contain a");
  buttonsMax.forEach((button) => {
    button.href == window.location.href
      ? button.classList.add("active")
      : button.classList.remove("active");
  });
  buttonsMin.forEach((button) => {
    button.href == window.location.href
      ? button.classList.add("active")
      : button.classList.remove("active");
  });
}

/*INICIO FUNCIONES CRUD*/
async function getData(url) {
  try {
    let response = await fetch(url, {
      method: "GET",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      mode: "cors",
    });
    const data = await response.json();
    return data;
  } catch {
    console.log(Error);
  }
}

async function postData(url, data) {
  try {
    const token = await getDataCookie("getTokenCookie");
    let response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      mode: "cors",
      body: JSON.stringify(data),
    });
    const dataRes = await response.json();
    return { status: response.status, sessionData: dataRes };
  } catch {
    console.log(Error);
  }
}

/*FIN FUNCIONES CRUD*/

async function getDataCookie(name) {
  try {
    let response = await fetch(UrlCook + name, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      mode: "cors",
    });
    if (response.status == 400) {
      console.warn("Client authorization expired or invalid");
      return;
    } else if (response.status == 200) {
      return response.json();
    }
  } catch {
    console.log(Error);
  }
}

/*****************************************************************SOCKETS*************************************************************/
socket.on("backMessages", (getMessages) => {
  Object.assign(backMessages, getMessages);
  focusbtn();
  focusLastMessage();
  validateSession(rolLogged.innerHTML, emailLogged.innerHTML);
  console.log("SUMMARY OF MESSAGES: " + backMessages.length);
});

socket.on("newUser-connected", (userNew) => {
  if (swalActive == "inactive") {
    if (userNew.id !== socket.id)
      Swal.fire({
        html: `<b class="chat__login--notification">${userNew.user} has connected to the chat<b>`,
        toast: true,
        position: "top-end",
        timer: 2000,
        background: "linear-gradient(to right, #00b09b, #96c93d)",
      });
  }
});

socket.on("messageLogs", (lastMessage) => {
  backMessages.push(lastMessage);
  console.log("SUMMARY OF MESSAGES: " + backMessages.length);
  let log = document.querySelector(".chat__container__dinamic");
  const { user, message } = lastMessage;
  const newBubble = `
      <div class="chat__message">
      <div class="chat__message--bubble">
        <div class="chat__message--sender">${user}</div>
        <p>${message}</p>
        </div>
      </div>
    `;
  log.innerHTML += newBubble;
  focusLastMessage();
});

/*****************************************************************EVENTOS*************************************************************/
chatBox.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});

btnSend.addEventListener("click", () => {
  sendMessage();
});

emailLogged.addEventListener("click", () => {
  validateSession(rolLogged.innerHTML, emailLogged.innerHTML);
});

async function logoutSession() {
  try {
    let response = await fetch(UrlLogin + "logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      mode: "cors",
    });
    if (response.status == 400) {
      console.warn("Error en el cliente");
      return;
    } else if (response.status == 200) {
      return response.json();
    }
  } catch {
    console.log(Error);
  }
}

async function delDataCookie(name) {
  try {
    fetch(UrlCook + "delCookie", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      mode: "cors",
      body: JSON.stringify(name),
    });
  } catch (error) {
    console.log(error);
  }
}
