const socket = io();

// Elements
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = document.querySelector("input");
const $messageFormButton = document.querySelector("button");
const $sendLocationButton = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");
const $locationMessages = document.querySelector("#location-messages");

// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationMessageTemplate = document.querySelector(
  "#location-message-template"
).innerHTML;

socket.on("message", (message) => {
  console.log(message);
  const html = Mustache.render(messageTemplate, { message });
  $messages.insertAdjacentHTML("beforeend", html);
});

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  $messageFormButton.setAttribute("disabled", "disabled");

  socket.emit("sendMessage", $messageFormInput.value, (error) => {
    $messageFormButton.removeAttribute("disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();

    if (error) return console.log(error);
    console.log("Message Delivered");
  });
});

socket.on("locationMessage", (url) => {
  console.log(url);
  const html = Mustache.render(locationMessageTemplate, { url });
  $locationMessages.insertAdjacentHTML("beforeend", html);
});

$sendLocationButton.addEventListener("click", () => {
  if (!navigator.geolocation) return alert("Gelocation is not supported");

  $sendLocationButton.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition(({ coords }) => {
    socket.emit(
      "locationMessage",
      { latitude: coords.latitude, longitude: coords.longitude },
      () => {
        $sendLocationButton.removeAttribute("disabled");
      }
    );
  });
});
