function setCookie(name, value, days = 30) {
  const d = new Date();
  d.setTime(d.getTime() + (days * 86400000));
  document.cookie = `${name}=${value}; expires=${d.toUTCString()}; path=/`;
}

function getCookie(name) {
  const cookies = document.cookie.split(';');
  for (let c of cookies) {
      const [key, val] = c.trim().split('=');
      if (key === name) return val;
  }
  return null;
}

window.onload = () => {
  const username = getCookie("snakeUser");
  const highscore = getCookie("snakeHighScore") || 0;

  if (username) {
      document.getElementById("greeting").textContent = `Welcome back, ${username}! 🐍`;
  }

  document.getElementById("highscore").textContent = highscore;
};

document.getElementById("usernameForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  var gameMode = document.getElementById("gameMode").value;
  if (/^[A-Za-z0-9]+$/.test(username)) {
      setCookie("snakeUser", username);
      setCookie("snakeHighScore", 0);
      setCookie("gameMode", gameMode); // Store the selected difficulty
      window.location.href = "index.html";
  } else {
      alert("Invalid username! Letters and numbers only.");
  }
});