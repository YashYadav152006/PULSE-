

var liveTimeEl     = document.getElementById("liveTime");
var liveDateEl     = document.getElementById("liveDate");
var greetingBadge  = document.getElementById("greetingBadge");

function updateClock() {

  
    var now = new Date();

   
    var hours   = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();

    var hh = String(hours).padStart(2, "0");
    var mm = String(minutes).padStart(2, "0");
    var ss = String(seconds).padStart(2, "0");


    liveTimeEl.textContent = hh + ":" + mm + ":" + ss;


    liveDateEl.textContent = now.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric"
    });


    if (hours >= 5 && hours < 12) {
        greetingBadge.textContent = "🌅 Good Morning";
    } else if (hours >= 12 && hours < 17) {
        greetingBadge.textContent = "☀️ Good Afternoon";
    } else if (hours >= 17 && hours < 21) {
        greetingBadge.textContent = "🌇 Good Evening";
    } else {
        greetingBadge.textContent = "🌙 Good Night";
    }
}


updateClock();

setInterval(updateClock, 1000);

var themeBtnEl = document.getElementById("themeBtn");
var htmlEl     = document.documentElement; 

var savedTheme = localStorage.getItem("focus-theme") || "dark";
applyTheme(savedTheme);

function applyTheme(mode) {

 
    htmlEl.setAttribute("data-theme", mode);

  
    if (mode === "dark") {
        themeBtnEl.textContent = "☽"; // moon
    } else {
        themeBtnEl.textContent = "☀"; // sun
    }

 
    localStorage.setItem("focus-theme", mode);
}


themeBtnEl.addEventListener("click", function () {


    var current = htmlEl.getAttribute("data-theme");


    if (current === "dark") {
        applyTheme("light");
    } else {
        applyTheme("dark");
    }
});





var tasks   = JSON.parse(localStorage.getItem("focus-tasks") || "[]");
var taskId  = 1;
var todofil = "all"; 


if (tasks.length > 0) {
    taskId = tasks[tasks.length - 1].id + 1;
}


var todoInputEl  = document.getElementById("todoInput");
var todoAddBtnEl = document.getElementById("todoAddBtn");
var todoListEl   = document.getElementById("todoList");
var clearDoneEl  = document.getElementById("clearDoneBtn");

function saveTasks() {
    localStorage.setItem("focus-tasks", JSON.stringify(tasks));
}


function renderTasks() {
    todoListEl.innerHTML = "";

    
    var filtered = tasks.filter(function (t) {
        if (todofil === "all")     return true;
        if (todofil === "pending") return !t.done;
        if (todofil === "starred") return t.starred;
        if (todofil === "done")    return t.done;
        return true;
    });

  
    if (filtered.length === 0) {
        todoListEl.innerHTML = '<li class="empty-msg">Nothing here yet.</li>';
        updateTodoStats();
        return;
    }

  
    filtered.slice().reverse().forEach(function (task) {

        var li = document.createElement("li");
        li.className = "task-item"
            + (task.done ? " done" : "")
            + (task.starred ? " starred" : "");

        li.innerHTML =
            // Check button
            '<button class="task-check ' + (task.done ? "checked" : "") + '" '
            + 'data-id="' + task.id + '" data-action="check">'
            + (task.done ? "✓" : "") + '</button>'

            // Title
            + '<span class="task-title">' + escapeText(task.title) + '</span>'

            // Star button
            + '<button class="task-star ' + (task.starred ? "starred" : "") + '" '
            + 'data-id="' + task.id + '" data-action="star">'
            + (task.starred ? "★" : "☆") + '</button>'

          
            + '<button class="task-del" data-id="' + task.id + '" data-action="del">✕</button>';

        todoListEl.appendChild(li);
    });

    updateTodoStats();
}


function updateTodoStats() {
    var pending = tasks.filter(function (t) { return !t.done; }).length;
    var done    = tasks.filter(function (t) { return  t.done; }).length;

    document.getElementById("todoPending").textContent = pending;
    document.getElementById("todoDone").textContent    = done;
}


function addTask() {
    var title = todoInputEl.value.trim();
    if (title === "") return; 

    tasks.push({
        id:      taskId,
        title:   title,
        done:    false,
        starred: false
    });

    taskId++;
    saveTasks();
    renderTasks();

    todoInputEl.value = "";
    todoInputEl.focus();
}


todoAddBtnEl.addEventListener("click", addTask);


todoInputEl.addEventListener("keydown", function (e) {
    if (e.key === "Enter") addTask();
});


todoListEl.addEventListener("click", function (e) {

  
    var btn = e.target.closest("button[data-action]");
    if (!btn) return; 

    var id     = Number(btn.getAttribute("data-id"));
    var action = btn.getAttribute("data-action");

   
    var idx = tasks.findIndex(function (t) { return t.id === id; });
    if (idx === -1) return;

    if (action === "check") {
        tasks[idx].done = !tasks[idx].done; // toggle
    }
    if (action === "star") {
        tasks[idx].starred = !tasks[idx].starred; // toggle
    }
    if (action === "del") {
        tasks.splice(idx, 1); 
    }

    saveTasks();
    renderTasks();
});


document.querySelectorAll(".filter-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
     
        document.querySelectorAll(".filter-btn").forEach(function (b) {
            b.classList.remove("active");
        });
       
        btn.classList.add("active");
        todofil = btn.getAttribute("data-filter");
        renderTasks();
    });
});


clearDoneEl.addEventListener("click", function () {
    tasks = tasks.filter(function (t) { return !t.done; });
    saveTasks();
    renderTasks();
});


renderTasks();





var MODES = {
    work:  25 * 60,  
    short:  5 * 60,  
    long:  15 * 60   
};

var SESSION_NAMES = {
    work:  "WORK SESSION",
    short: "SHORT BREAK",
    long:  "LONG BREAK"
};


var currentMode   = "work";
var timeLeft      = MODES.work;
var totalTime     = MODES.work;
var isRunning     = false;
var timerInterval = null;  
var sessionsCount = 0;


var RING_LENGTH = 377;


var pomoDisplayEl = document.getElementById("pomoDisplay");
var pomoTagEl     = document.getElementById("pomoTag");
var pomoRingEl    = document.getElementById("pomoRing");
var pomoStartEl   = document.getElementById("pomoStart");
var pomoPauseEl   = document.getElementById("pomoPause");
var pomoResetEl   = document.getElementById("pomoReset");
var sessionDotsEl = document.getElementById("sessionDots");
var sbPomoTime    = document.getElementById("sbPomoTime");


pomoRingEl.style.strokeDasharray  = RING_LENGTH;
pomoRingEl.style.strokeDashoffset = 0;


function formatTime(seconds) {
    var m = Math.floor(seconds / 60);
    var s = seconds % 60;
    return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}

function updatePomoUI() {
    var timeText = formatTime(timeLeft);
    pomoDisplayEl.textContent = timeText;

    
    var progress   = timeLeft / totalTime; 
    var dashOffset = RING_LENGTH * (1 - progress);
    pomoRingEl.style.strokeDashoffset = dashOffset;
}

function setMode(mode) {
   
    clearInterval(timerInterval);
    isRunning = false;

    currentMode = mode;
    timeLeft    = MODES[mode];
    totalTime   = MODES[mode];

    pomoTagEl.textContent = SESSION_NAMES[mode];

  
    document.querySelectorAll(".mode-btn").forEach(function (btn) {
        btn.classList.toggle("active", btn.getAttribute("data-mode") === mode);
    });

   
    pomoStartEl.disabled = false;
    pomoPauseEl.disabled = true;

    updatePomoUI();
}


document.querySelectorAll(".mode-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
        setMode(btn.getAttribute("data-mode"));
    });
});


pomoStartEl.addEventListener("click", function () {
    if (isRunning) return; 
    isRunning = true;
    pomoStartEl.disabled = true;
    pomoPauseEl.disabled = false;


    timerInterval = setInterval(function () {
        timeLeft--;
        updatePomoUI();

   
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            isRunning = false;

           
            if (currentMode === "work") {
                sessionsCount++;
                updateSessionDots();
            }

            alert(currentMode === "work"
                ? "⏱ Work session done! Take a break."
                : "✅ Break over! Ready to work?"
            );

         
            if (currentMode === "work") {
                setMode("short");
            } else {
                setMode("work");
            }
        }
    }, 1000);
});


pomoPauseEl.addEventListener("click", function () {
    clearInterval(timerInterval);
    isRunning = false;
    pomoStartEl.disabled = false;
    pomoPauseEl.disabled = true;
});


pomoResetEl.addEventListener("click", function () {
    clearInterval(timerInterval);
    isRunning = false;
    setMode(currentMode);
});

function updateSessionDots() {
    var dots = sessionDotsEl.querySelectorAll(".dot");
    dots.forEach(function (dot, i) {
        dot.classList.toggle("completed", i < (sessionsCount % 4));
    });
}

updatePomoUI();





var fallbackQuotes = [
    { q: "The secret of getting ahead is getting started.",         a: "Mark Twain" },
    { q: "Focus on being productive instead of busy.",             a: "Tim Ferriss" },
    { q: "Done is better than perfect.",                           a: "Sheryl Sandberg" },
    { q: "Small daily improvements lead to stunning results.",     a: "Robin Sharma" },
    { q: "Either you run the day or the day runs you.",            a: "Jim Rohn" },
    { q: "Deep work is the superpower of the 21st century.",       a: "Cal Newport" },
    { q: "You don't have to be great to start, but you have to start to be great.", a: "Zig Ziglar" }
];

var quoteTextEl    = document.getElementById("quoteText");
var quoteAuthorEl  = document.getElementById("quoteAuthor");
var quoteRefreshEl = document.getElementById("quoteRefreshBtn");


function fetchQuote() {

   
    quoteTextEl.classList.add("loading");
    quoteTextEl.textContent = "Loading...";
    quoteRefreshEl.disabled = true;

   
    fetch("https://api.quotable.io/random?maxLength=120")
        .then(function (response) {

        
            return response.json();
        })
        .then(function (data) {

            quoteTextEl.textContent   = data.content;
            quoteAuthorEl.textContent = "— " + data.author;

            quoteTextEl.classList.remove("loading");
            quoteRefreshEl.disabled = false;
        })
        .catch(function () {

          
            var random = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
            quoteTextEl.textContent   = random.q;
            quoteAuthorEl.textContent = "— " + random.a;

            quoteTextEl.classList.remove("loading");
            quoteRefreshEl.disabled = false;
        });
}


quoteRefreshEl.addEventListener("click", fetchQuote);


fetchQuote();




var wxRefreshBtn = document.getElementById("wxRefreshBtn");
var wxContentEl  = document.getElementById("wxContent");

function getWeatherInfo(code) {
    if (code === 0)        return { emoji: "☀️", desc: "Clear Sky" };
    if (code <= 2)         return { emoji: "🌤", desc: "Partly Cloudy" };
    if (code === 3)        return { emoji: "☁️", desc: "Overcast" };
    if (code <= 49)        return { emoji: "🌫", desc: "Foggy" };
    if (code <= 55)        return { emoji: "🌦", desc: "Drizzle" };
    if (code <= 65)        return { emoji: "🌧", desc: "Rain" };
    if (code <= 77)        return { emoji: "❄️", desc: "Snow" };
    if (code <= 82)        return { emoji: "🌧", desc: "Rain Showers" };
    if (code <= 99)        return { emoji: "⛈", desc: "Thunderstorm" };
    return { emoji: "🌡", desc: "Unknown" };
}

function fetchWeather() {

    wxContentEl.innerHTML = '<p class="wx-loading">Detecting location...</p>';

   
    navigator.geolocation.getCurrentPosition(

   
        function (position) {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;

            
            fetch("https://nominatim.openstreetmap.org/reverse?lat=" + lat + "&lon=" + lon + "&format=json")
                .then(function (r) { return r.json(); })
                .then(function (geoData) {

                    var city = geoData.address.city
                        || geoData.address.town
                        || geoData.address.village
                        || "Your Location";

                 
                    var wxUrl = "https://api.open-meteo.com/v1/forecast"
                        + "?latitude=" + lat
                        + "&longitude=" + lon
                        + "&current_weather=true"
                        + "&hourly=relativehumidity_2m,apparent_temperature"
                        + "&timezone=auto"
                        + "&forecast_days=1";

                    return fetch(wxUrl)
                        .then(function (r) { return r.json(); })
                        .then(function (wxData) {
                            showWeather(city, wxData);
                        });
                })
                .catch(function () {
                    wxContentEl.innerHTML = '<p class="wx-loading">Could not fetch weather data.</p>';
                });
        },


        function (err) {
            if (err.code === 1) {
                wxContentEl.innerHTML = '<p class="wx-loading">⚠ Location permission denied. Please allow in browser.</p>';
            } else {
                wxContentEl.innerHTML = '<p class="wx-loading">⚠ Could not detect location.</p>';
            }
        },

     
        { timeout: 8000 }
    );
}


function showWeather(city, wxData) {
    var cw      = wxData.current_weather;
    var info    = getWeatherInfo(cw.weathercode);
    var temp    = Math.round(cw.temperature);
    var wind    = Math.round(cw.windspeed);
    var humidity = wxData.hourly.relativehumidity_2m[0];
    var feels    = Math.round(wxData.hourly.apparent_temperature[0]);

    wxContentEl.innerHTML =
        '<div class="wx-city-name">' + city + '</div>'

        + '<div class="wx-main-row">'
        +   '<div class="wx-temperature">' + temp + '°</div>'
        +   '<div class="wx-right-col">'
        +     '<span class="wx-emoji">' + info.emoji + '</span>'
        +     '<div class="wx-condition">' + info.desc + '</div>'
        +   '</div>'
        + '</div>'

        + '<div class="wx-details-grid">'
        +   '<div class="wx-detail-box">'
        +     '<span class="wx-detail-label">Humidity</span>'
        +     '<span class="wx-detail-val">' + humidity + '%</span>'
        +   '</div>'
        +   '<div class="wx-detail-box">'
        +     '<span class="wx-detail-label">Wind</span>'
        +     '<span class="wx-detail-val">' + wind + ' km/h</span>'
        +   '</div>'
        +   '<div class="wx-detail-box">'
        +     '<span class="wx-detail-label">Feels</span>'
        +     '<span class="wx-detail-val">' + feels + '°</span>'
        +   '</div>'
        + '</div>';
}


wxRefreshBtn.addEventListener("click", fetchWeather);


fetchWeather();





var goals  = JSON.parse(localStorage.getItem("focus-goals") || "[]");
var goalId = 1;

if (goals.length > 0) {
    goalId = goals[goals.length - 1].id + 1;
}


var goalInputEl = document.getElementById("goalInput");
var goalAddEl   = document.getElementById("goalAddBtn");
var goalListEl  = document.getElementById("goalList");

function saveGoals() {
    localStorage.setItem("focus-goals", JSON.stringify(goals));
}

function renderGoals() {
    goalListEl.innerHTML = "";

    if (goals.length === 0) {
        goalListEl.innerHTML = '<li class="empty-msg">No goals yet.</li>';
        updateGoalsProgress();
        return;
    }

    goals.forEach(function (goal) {
        var li = document.createElement("li");
        li.className = "goal-item" + (goal.done ? " done" : "");

        li.innerHTML =
            '<button class="goal-check ' + (goal.done ? "checked" : "") + '" '
            + 'data-id="' + goal.id + '" data-action="check">'
            + (goal.done ? "✓" : "") + '</button>'

            + '<span class="goal-text">' + escapeText(goal.title) + '</span>'

            + '<button class="goal-del" data-id="' + goal.id + '" data-action="del">✕</button>';

        goalListEl.appendChild(li);
    });

    updateGoalsProgress();
}

function updateGoalsProgress() {
    var done  = goals.filter(function (g) { return g.done; }).length;
    var total = goals.length;
    var pct   = total > 0 ? Math.round((done / total) * 100) : 0;

    document.getElementById("goalsProgressBar").style.width = pct + "%";


    document.getElementById("goalsPct").textContent = pct + "%";

 
    document.getElementById("goalsCountLabel").textContent = done + " of " + total + " done";
}


function addGoal() {
    var title = goalInputEl.value.trim();
    if (title === "") return;

    goals.push({ id: goalId, title: title, done: false });
    goalId++;
    saveGoals();
    renderGoals();

    goalInputEl.value = "";
    goalInputEl.focus();
}

goalAddEl.addEventListener("click", addGoal);
goalInputEl.addEventListener("keydown", function (e) {
    if (e.key === "Enter") addGoal();
});


goalListEl.addEventListener("click", function (e) {
    var btn = e.target.closest("button[data-action]");
    if (!btn) return;

    var id     = Number(btn.getAttribute("data-id"));
    var action = btn.getAttribute("data-action");
    var idx    = goals.findIndex(function (g) { return g.id === id; });
    if (idx === -1) return;

    if (action === "check") goals[idx].done = !goals[idx].done;
    if (action === "del")   goals.splice(idx, 1);

    saveGoals();
    renderGoals();
});

renderGoals();




var plannerScrollEl = document.getElementById("plannerScroll");
var plannerDateEl   = document.getElementById("plannerDate");


plannerDateEl.textContent = new Date().toLocaleDateString("en-US", {
    month: "short",
    day:   "numeric"
});

var currentHour = new Date().getHours(); 


for (var h = 0; h < 24; h++) {

    
    var period = h < 12 ? "AM" : "PM";
    var h12    = h % 12 === 0 ? 12 : h % 12;
    var label  = String(h12).padStart(2, "0") + " " + period;


    var slot = document.createElement("div");
    slot.className = "hour-slot" + (h === currentHour ? " current-hour" : "");


    var timeLabel = document.createElement("div");
    timeLabel.className   = "slot-time";
    timeLabel.textContent = h === currentHour ? label + " ◂" : label;


    var textarea = document.createElement("textarea");
    textarea.className   = "slot-input";
    textarea.placeholder = h === currentHour ? "Right now..." : "Add plan...";


    var savedNote = localStorage.getItem("focus-plan-" + h);
    if (savedNote) {
        textarea.value = savedNote;
    }


    textarea.addEventListener("input", function (e) {
        var hourKey = e.target.getAttribute("data-hour");
        localStorage.setItem("focus-plan-" + hourKey, e.target.value);
    });


    textarea.setAttribute("data-hour", h);

    slot.appendChild(timeLabel);
    slot.appendChild(textarea);
    plannerScrollEl.appendChild(slot);
}


setTimeout(function () {
    var nowSlot = plannerScrollEl.querySelector(".current-hour");
    if (nowSlot) {
        nowSlot.scrollIntoView({
            behavior: "smooth",
            inline:   "center",
            block:    "nearest"
        });
    }
}, 400);




function escapeText(str) {
    return String(str)
        .replace(/&/g,  "&amp;")
        .replace(/</g,  "&lt;")
        .replace(/>/g,  "&gt;")
        .replace(/"/g,  "&quot;");
}