let ring = new Audio();
let click = new Audio();

ring.src = "audio/rington.mp3";
click.src = "audio/click.mp3";

const hours = document.querySelector('.hours');
const minutes = document.querySelector('.minutes');
const seconds = document.querySelector('.seconds');
const message = document.querySelector('.message');

const set = document.querySelector('.set');
const plus = document.querySelector('.plus');
const minus = document.querySelector('.minus');
const start = document.querySelector('.start');
const reset = document.querySelector('.reset');

const MODE_DEFAULT = 0;
const MODE_SECONDS = 1;
const MODE_MINUTES = 2;
const MODE_HOURS = 3;

let countSec = 0;
let countMin = 0;
let countHrs = 0;
let mode = MODE_DEFAULT;
let start_stop = false;
let blink = false;
let timeinterval = 0;
let globaltimer = 0;
let timeblink = 0;

plus.disabled = true;
minus.disabled = true;

// Обновление цифр тамера
function updateText() {
  hours.innerHTML = (0 + String(countHrs)).slice(-2);
  minutes.innerHTML = (0 + String(countMin)).slice(-2);
  seconds.innerHTML = (0 + String(countSec)).slice(-2);
}
updateText();

function startButtonDef() {
    start.innerHTML = 'Старт';
    start_stop = false;
}

function clearMessage(){
	message.innerHTML = ''
}

// Обратный отсчет
function countDown() {
  if (start_stop == false)
    return;
  let total = countSec + countMin * 60 + countHrs * 3600;
  timeinterval = setTimeout(countDown, 1000);
  if (total <= 0)
  {
    clearTimeout(timeinterval);
    message.innerHTML = '<p>Отсчёт закончен...</p>'
    set.disabled = false;
    startButtonDef();
    setTimeout(clearMessage, 5000);
    ring.play();
    return;
  }
  if(countSec > 0)
    countSec--;
  else
  {
    if (countMin > 0)
    {
      countSec = 59;
      countMin--;
    }
    else
    {
      if (countHrs > 0)
      {
        countSec = 59;
        countMin = 59;
        countHrs--;
      }
    }
  }
  updateText();
}

// Мигание часов при установке времени
function timeBlink (){
  if (mode == MODE_SECONDS)
  {
    if (blink == false)
    {
      seconds.style.color = "rgb(65, 44, 132)";
      blink = true;
    }
    else
    {
      seconds.style.color = "rgb(255, 255, 255)";
      blink = false;
    }
  }
  else if (mode == MODE_MINUTES)
  {
    if (blink == false)
    {
      minutes.style.color = "rgb(65, 44, 132)";
      blink = true;
    }
    else
    {
      minutes.style.color = "rgb(255, 255, 255)";
      blink = false;
    }
  }
  else
  {
    if (blink == false)
    {
      hours.style.color = "rgb(65, 44, 132)";
      blink = true;
    }
    else
    {
      hours.style.color = "rgb(255, 255, 255)";
      blink = false;
    }
  }
}

// Установка времени
set.onclick = () =>{
  if (mode == MODE_DEFAULT)
  {
    start.disabled = true;
    reset.disabled = true;
    plus.disabled = false;
	minus.disabled = false;
    mode = MODE_SECONDS;
    blink = false;
    timeblink = setInterval(timeBlink, 500);
  }
  else if (mode == MODE_SECONDS)
  {
    blink = false;
    mode = MODE_MINUTES;
    seconds.style.color = "rgb(255, 255, 255)";
  }
  else if (mode == MODE_MINUTES)
  {
    blink = false;
    mode = MODE_HOURS;
    minutes.style.color = "rgb(255, 255, 255)";
  }
  else
  {
    blink = false;
    mode = MODE_DEFAULT;
    clearInterval(timeblink);
    hours.style.color = "rgb(255, 255, 255)";
    plus.disabled = true;
	minus.disabled = true;
    start.disabled = false;
    reset.disabled = false;
  }
  click.play();
}

// Обработка увеличения значений таймера
function plusButton() {
  if (mode == MODE_SECONDS)
  {
    if (countSec < 59)
      countSec++;
    else if (countSec == 59)
      countSec = 0;
  }
  else if (mode == MODE_MINUTES)
  {
    if(countMin < 59)
      countMin++;
    else if (countMin == 59)
      countMin = 0;
  }
  else if (mode == MODE_HOURS)
  {
    if(countHrs < 23)
      countHrs++;
    else if (countHrs == 23)
      countHrs = 0;
  }
  updateText()
  click.play();
}

// plus.onclick = () =>{
//   if (mode != MODE_DEFAULT)
//     plusButton();
// }

function autoIncrement() {
  globaltimer = setInterval(plusButton,200);
}

// Увеличение значений при удержании кнопки
plus.onmousedown = () =>{
  if (mode != MODE_DEFAULT)
    globaltimer = setTimeout(autoIncrement,1000);
}

// Увеличение значения
plus.onmouseup = () =>{
  plusButton();
  if (globaltimer != 0)
  {
    clearTimeout(globaltimer);
    globaltimer = 0;
  }
}

// Обработка уменьшения значений таймера
function minusButton() {
  if (mode == MODE_SECONDS)
  {
    if (countSec > 0)
      countSec--;
    else if (countSec == 0)
      countSec = 59;
  }
  else if (mode == MODE_MINUTES)
  {
    if (countMin > 0)
      countMin--;
    else if (countMin == 0)
      countMin = 59;
  }
  else if (mode == MODE_HOURS)
  {
    if (countHrs > 0)
      countHrs--;
    else if (countHrs == 0)
      countHrs = 23;
  }
  updateText();
  click.play();
}

// minus.onclick = () =>{
//   if (mode != MODE_DEFAULT)
//     minusButton();
// }

function autoDecrement() {
  globaltimer = setInterval(minusButton,200);
}

// Уменьшение значений при удержании кнопки
minus.onmousedown = () =>{
  if (mode != MODE_DEFAULT)
    globaltimer = setTimeout(autoDecrement,1000);
}

// Уменьшение значения
minus.onmouseup = () =>{
  minusButton();
  if (globaltimer != 0)
  {
    clearTimeout(globaltimer);
    globaltimer = 0;
  }
}

// Старт/Стоп
start.onclick = () => {
  if ((start_stop == false) && ((countSec != 0) || +
     (countMin != 0) || (countHrs != 0)))
  {
    start_stop = true;
    countDown();
    stop.disabled = false;
    set.disabled = true;
    start.innerHTML = 'Стоп'
  }
  else if (start_stop == true)
  {
    set.disabled = false;
    startButtonDef();
  }
  click.play();
}

// Сброс
reset.onclick = () => {
  clearInterval(timeinterval);
  countSec = countMin = countHrs = 0;
  updateText();
  set.disabled = false;
  if (start_stop == true)
    startButtonDef();
  click.play();
}