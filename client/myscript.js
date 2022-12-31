import bot from "./assets/bot.svg";
import user from './assets/user.svg';

const form = document.querySelector("form");	
const chatContainer = document.querySelector("#chat_container");

let loadInterval;

const loader = (element) => {
  element.textContent = ''

    loadInterval = setInterval(() => {
        // Update the text content of the loading indicator
        element.textContent += '.';

        // If the loading indicator has reached three dots, reset it
        if (element.textContent === '...') {
            element.textContent = '';
        }
    }, 300);
 
}

// const loader = (element, intervalDuration = 200) => {
//   // Make sure the element is not null or undefined
//   if (!element) return;

//   element.textContent = '';

//   // Declare the intervalId outside of the interval function
//   // so that we can use it to stop the interval later
//   let intervalId;

//   const updateText = () => {
//     element.textContent = ".";

//     if (element.textContent === "...") {
//       element.textContent = "";
//     }
//   }

//   intervalId = setInterval(updateText, 300);

//   return () => {
//     clearInterval(intervalId);
//   }
// }


const typeText = (element, text) => {
  let index = 0;

  let interval = setInterval(() => {
    if(index < text.length){
      element.innerHtml += text.charAt(index);
      index++;
    }else {
      clearInterval(interval);
    }
  }, 20)
}

const generateUniqueId =() => {
  const timestamp = Date.now();
  const randNumber = Math.random();
  const hexadecimalString = randNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

const chatStripe = (isAi, value, uniqueId) => {
  return (
    `
    <div class="wrapper ${isAi && 'ai'}">
      <div class="chat">
        <div class="profile">
          <img 
            src="${isAi ? bot : user}"
            alt="${isAi ? 'bot' : 'user'}
          />
        </div>
        <div class="message" id=${uniqueId}>
          ${value}
        </div>
      </div>
    </div>
    `
  )
}

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  //generate the users chat
  chatContainer.innerHtml += chatStripe(false, data.get('prompt'))

  form.reset()

  //bots stripe

  const uniqueId = generateUniqueId()

  chatContainer.innerHtml += chatStripe(true, " ", uniqueId)

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId)

  loader(messageDiv);

  // fetch data from server

  const response = await fetch("http://localhost:5000", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        prompt: data.get('prompt')
    })
  });

  

}

const enterSend = (e)=>{
  if (e.code === "Enter"){
    handleSubmit(e);
  }
}

form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", enterSend);