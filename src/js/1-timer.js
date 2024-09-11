import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const datetimePicker = document.querySelector('#datetime-picker');
const startButton = document.querySelector('#start-button');
const timerFields = {
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]')
};

let userSelectedDate = null;
let timerInterval = null;

flatpickr(datetimePicker, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    
    userSelectedDate = selectedDates[0];
    
    if (userSelectedDate && userSelectedDate > new Date()) {
      startButton.disabled = false;
    } else {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
      });
      startButton.disabled = true;
    }
  }
});

const addLeadingZero = (value) => {
  return value.toString().padStart(2, '0');
};

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}


const updateTimer = () => {
  const now = new Date();
  const timeLeft = userSelectedDate - now;

  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    Object.values(timerFields).forEach(field => field.textContent = '00');
    startButton.disabled = false;
    datetimePicker.disabled = false;
    return;
  }

  const { days, hours, minutes, seconds } = convertMs(timeLeft);
  timerFields.days.textContent = addLeadingZero(days);
  timerFields.hours.textContent = addLeadingZero(hours);
  timerFields.minutes.textContent = addLeadingZero(minutes);
  timerFields.seconds.textContent = addLeadingZero(seconds);
};


startButton.addEventListener('click', () => {
  startButton.disabled = true;
  datetimePicker.disabled = true;

  timerInterval = setInterval(updateTimer, 1000);
});


updateTimer();