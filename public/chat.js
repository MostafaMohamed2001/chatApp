const socket = io();

// Elements
const $form = document.getElementById("form");
const $formInput = $form.querySelector("input");
const $formBtn = $form.querySelector("button");
const $btnLocation = document.getElementById("my-location");
const $messages = document.getElementById("messages");

// Tamplates
const messageTemplate = `<div class="message">
<p>
 <span class="message__name">{{username}}</span>
  <span class="message__meta">{{createAt}}</span>
 </p>
 <p>{{message}}</p>
 </div>`;
const locationTamplate = `<div class="message">
<p>
 <span class="message__name">{{username}}</span>
  <span class="message__meta">{{createAt}}</span>
 </p>
<p>
<a href="{{url}}" target="_blank">Location</a>
</p>
</div>`;


const sidebarTamplate = `
<h2 class="room-title">{{room}}</h2>
<h3 class="list-title">Users</h3>
<ul class="users">
  {{#users}}
  <li>{{username}}</li>
  {{/users}}
  </ul>
`

//oprerations
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });  

const autoscroll = () => {
  // New message element
  const $newMessage = $messages.lastElementChild
  // Height of the new message
  const newMessageStyles = getComputedStyle($newMessage)
  const newMessageMargin = parseInt(newMessageStyles.marginBottom)
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin
  // Visible height
  const visibleHeight = $messages.offsetHeight
  // Height of messages container
  const containerHeight = $messages.scrollHeight
  // How far have I scrolled?
  const scrollOffset = $messages.scrollTop + visibleHeight
  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight
  }
}

// Listening for server events
socket.on("message", (message) => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.txt,
    createAt: moment(message.createAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll()
});

// Sending location
socket.on("locationMessage", (message) => {
  console.log(message);
  const html = Mustache.render(locationTamplate, {
    username: message.username,
    url:message.url,
    createAt: moment(message.createAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll()
});

socket.on('roomData', ({ room, users }) => {
  const html = Mustache.render(sidebarTamplate, {
    room,
    users,
  })
  document.getElementById('sidebar').innerHTML = html
})

// Sending message
$form.addEventListener("submit", (e) => { 

  e.preventDefault();

  $formBtn.setAttribute("disabled", "disabled");


  const msgInput = e.target.elements.msgg.value;

  socket.emit("sendMessage", msgInput, (err) => {
    $formBtn.removeAttribute("disabled");
    $formInput.value = "";
    $formInput.focus();
    if (err) {
      return console.log(err);
    }
    console.log("The Message was dilvered .. ");
  });
});

// Get user's location
$btnLocation.addEventListener("click", () => {
  if (!navigator.geolocation) {
    alert(`Your browser don't support this feature . `);
  }

  $btnLocation.setAttribute("disabled", "disabled");
  navigator.geolocation.getCurrentPosition((pos) => {
    socket.emit(
      "shareLocationUser",
      {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      },
      () => {
        $btnLocation.removeAttribute("disabled");

        console.log("Location shared .. ");
      }
    );
  });
});

socket.emit('join', { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});