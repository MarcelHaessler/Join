
function getCurrentTime() {
  const now = new Date(); // lokale Zeit
  return now.toLocaleTimeString(); // z.B. "14:37:05"
}

const currentTime = getCurrentTime();
