import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form'); 
const chatContainer = document.querySelector('#chat_container');

let loadInterval;


// the 3 dots for loading ...
function loader(element) { 
  element.textContent = '';

  loadInterval = setInterval (() => {
    element.textContent += '.';
    if (element.textContent === '....'){
      element.textContent = '';
    }
  },300)
}

//function for typing the text caracter by caracter
function typeText (element, text){
  let index = 0;
  let interval = setInterval(()=>{
    if (index < text.length){  //we are still typing
      element.innerHTML += text.charAt(index);
      index++;
    }else{
      clearInterval(interval);
    }

  },20)
}

// function that generates a unique random id 
function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

//to generate stripes according to the text being an ai response or the entery question
function chatStripe (isAi,value, uniqueId) {
  return (
    //template string 
    `  
      <div class="wrapper ${isAi && 'ai'}">
        <div class="chat">
         <div class="profile">
           <img
              src="${isAi ? bot : user }"
              alt="${isAi ? 'bot' : 'user'}"
           />
         </div>
         <div class="message" id=${uniqueId}>${value}</div>
        </div>
      </div>
    `
  )
}

const handleSubmit = async (e) => {
  e.preventDefault();
  const data = new FormData(form);

  //user's chat stripe
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));
  form.reset();

  //bot's chatsripe
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight; //puts the new message in view

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);

  //fetch data from server => bot's response

  const response = await fetch ('https://smarty.onrender.com/',{
    method:'POST',
    headers:{
      'content-Type':'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
  })

  clearInterval(loadInterval);
  messageDiv.innerHTML ='';

  if (response.ok){
    const data = await response.json();
    const parsedData =data.bot.trim();

    typeText(messageDiv,parsedData);
  }else{
    const err = await response.text();
    messageDiv.innerHTML = "something went wrong";
    alert(err)
  }
}

//to see the changes that we made to our handle submit
form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
})