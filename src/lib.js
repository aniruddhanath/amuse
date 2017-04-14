const monthNames = [
  "January", "February", "March",
  "April", "May", "June", "July",
  "August", "September", "October",
  "November", "December"
];
  
export const dateFormat = timestamp => {
  let date = new Date(timestamp);
  return date.getDate() +  " " +  monthNames[date.getMonth()] + " " +  date.getFullYear();
};

export const formatTime = time => {
  if (!time || isNaN(time) || time === Infinity) {
    return '';
  }
  let minutes = Math.floor(time / 60);
  let seconds = parseInt(time - (minutes * 60));
  seconds = (seconds < 10) ? `0${seconds}` : seconds;
  return minutes + ":" + seconds;
}