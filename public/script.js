const loginButton = document.querySelector('.login-btn');
const sendButton = document.querySelector('.send-button');
const messageInput = document.querySelector('.message-input');
const incognitoBtn = document.querySelector('.incognito-btn');
const attachmentInput = document.getElementById('attachment');
const attachButton = document.querySelector('.attach-button');

const socket = io("https://alignbox-chat-new.onrender.com/");
let userName;
let incognito = false;

loginButton.addEventListener('click', () => {
    userName = document.querySelector('.username').value || "Guest";
    document.querySelector('.login').style.display = 'none';
    document.querySelector('.chat-application').style.display = 'block';
    document.querySelector('.current-user').innerText = userName;
    socket.emit('newuseradded', {
        username: userName,
        socketId: socket.id
    });
});

// Toggle incognito mode
incognitoBtn.addEventListener('click', () => {
    incognito = !incognito;
    if (incognito) {
        incognitoBtn.innerText = "Incognito ON";
        alert("You are now in incognito mode! Messages won’t be saved.");
    } else {
        incognitoBtn.innerText = "Go Incognito";
    }
});

// Attach file
attachButton.addEventListener('click', () => {
    attachmentInput.click();
});

sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    if (!message && !attachmentInput.files[0]) return;

    const data = {
        message: message,
        socketId: socket.id,
        username: incognito ? "Anonymous" : userName,
        incognito: incognito
    };

    // If file is attached
    if (attachmentInput.files[0]) {
        data.attachment = attachmentInput.files[0].name; // just filename for now
        attachmentInput.value = "";
    }

    messageInput.value = '';
    socket.emit('newmessage', data);
});

// Receive message
socket.on('messagereceived', ({ message, username, socketId, incognito, attachment }) => {
    const chats = document.querySelector('.chats');
    const wrapper = document.createElement('div');
    wrapper.classList.add('chat');
  
    // Check if it's my message
    if (socketId === socket.id) {
      wrapper.classList.add('chat-user');
    } else {
      wrapper.classList.add('chat-other');
  
      // Avatar
      const avatar = document.createElement('img');
  
      if (incognito) {
        // Anonymous profile
        avatar.src = "./assets/anonymous-profile.jpg";
      } else {
        // All normal users use person-profile
        avatar.src = "./assets/person-profile.jpg";
      }
      
      wrapper.appendChild(avatar);
      wrapper.appendChild(avatar);
    }
  
    // Message bubble
    const msg = document.createElement('div');
    msg.classList.add('chat-message');
    msg.innerHTML = `
      <strong>${incognito ? "Anonymous" : username}</strong><br>
      ${message}
      ${attachment ? `<div>📎 ${attachment}</div>` : ""}
      <small>${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
    `;
  
    wrapper.appendChild(msg);
    chats.appendChild(wrapper);
  
    // Auto-scroll
    chats.scrollTop = chats.scrollHeight;
  });
  
  
