// Описаний в документації
import flatpickr from 'flatpickr';
// Додатковий імпорт стилів
import 'flatpickr/dist/flatpickr.min.css';

// Описаний у документації
import iziToast from 'izitoast';
// Додатковий імпорт стилів
import 'izitoast/dist/css/iziToast.min.css';

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

function addZero(value) {
    return String(value).padStart(2, '0');
  }

const inputEl = document.querySelector('#datetime-picker');
const startButton = document.querySelector('[data-start]');

let userSelectedDate = null;
let countdownInterval;
startButton.disabled = true;
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];

    if (userSelectedDate && userSelectedDate < new Date()) {
      iziToast.error({
        message: 'Please choose a date in the future',
        position: 'topRight',
       
      });
      startButton.disabled = true;
    } else if (userSelectedDate) {
      startButton.disabled = false;
    }
  },
};

flatpickr(inputEl, options);

startButton.addEventListener('click', () => {
  if (!userSelectedDate) return;
  inputEl.disabled = true;
  startButton.disabled = true;

  countdownInterval = setInterval(() => {
    const currentTime = new Date();
    const remainingTime = userSelectedDate - currentTime;

    if (remainingTime <= 0) {
      clearInterval(countdownInterval);
      document.querySelector('[data-days]').textContent = '00';
      document.querySelector('[data-hours]').textContent = '00';
      document.querySelector('[data-minutes]').textContent = '00';
      document.querySelector('[data-seconds]').textContent = '00';
      inputEl.disabled = false;
    } else {
      const { days, hours, minutes, seconds } = convertMs(remainingTime);

      document.querySelector('[data-days]').textContent = addZero(days);
      document.querySelector('[data-hours]').textContent = addZero(hours);
      document.querySelector('[data-minutes]').textContent = addZero(minutes);
      document.querySelector('[data-seconds]').textContent = addZero(seconds);
    }
  }, 1000);
});
