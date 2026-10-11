
const her = 'Kristine';
const me = 'Bill';

const CHUNKS = [
  "Happy 1 Year and 1 Month, My Love! Hi, baby! I have so much to tell you, and I don't even know where to start.",

  "First of all, thank you for staying with me on my worst days and loving me anyway. Thank you for every laugh, every late-night talk, and every little thing you do for me.",

  "Maybe I don't always say it, but I notice them, love, and I appreciate you more than you know. You made me softer, happier, and braver in ways I never expected.",

  "LOvee.., alam ko na dami kong pagkukulang. I know sometimes mahirap akong pakisamahan, especially with my laziness and the things I still struggle to improve.",

  "May mga gabi na naiisip ko lahat ng pagkukulang ko, and sometimes I cry because I feel like you deserve so much more than what I'm giving you right now. I'm sorry gid, love, sa mga sala ko, sa bare minimum, kag sa mga times nga wala ko napabatyag sa imo kung daw ano ka ka-special sa akon.",

  "But please know that I'm trying. I'm not there yet, baby, but I'm slowly building myself and learning how to become a better person. I want to improve, not just through my words but through my actions, too. I don't want to keep saying sorry for the same mistakes without actually changing.",

  "I know I don't have much money right now, and I wish I could give you more. That's why I made this little code for you. It's not an expensive gift, but it's something I made with my own effort and love, just for you. For now, this is one of the ways I can show you how much you mean to me. And who knows, someday, basi ara kita sa Switzerland, enjoying a nice, long jacuzzi bath while laughing about all the little things we used to dream about hahahahahaha itot. Imagine lang ta anay lovee ahh.",

  "I'm also trying to learn how to love you better because I know we don't always express love the same way. Gina try ko gid intindihon kung paano mo gusto mabatyagan ang akon love. I want to understand you more, learn about the little things that make you happy, and become someone who makes you feel loved and appreciated. Bisan tamad ako usahay, willing ako magtuon about you, because loving you means being willing to understand you, too.",

  "I'm sorry for my shortcomings, love. I know love isn't just about saying sweet words; it's about showing up, making an effort, and choosing to improve. I can't promise that I'll never make mistakes, but I want to keep learning from them and becoming better for myself and for us.",

  "Loveee. I love you Kristine. More than yesterday, less than tomorrow. Thank you for being part of my life and for loving me even when I'm still figuring things out. I hope you continue loving me as much as you do, and I hope we keep growing together, supporting each other's dreams, and making beautiful memories."
];

// Shown only in the final full letter
const CLOSE = "Happy 1 year and 1 month my loveee, lovee na lovee ta gid ikaw, sobra pa sa masarangan ko ihambal. I'm still a work in progress, but one thing I'm sure of is that my love for you is real. Thank you for being you, my lovee. Here's to us and all the little moments we have yet to share.";

const SIGN = "Always yours, your baby";

const TOTAL = CHUNKS.length;


/* =========================================================
   2. HELPERS
   ========================================================= */
const $ = selector => document.querySelector(selector);
const stage = $('#stage');

const state = {
  step: 0,      // 0 = intro, 1-10 = games, 11 = final letter
  timers: []    // tracked so they can be cleared between screens
};

/* ---------- Timers (auto-cleared when the screen changes) ---------- */
function later(fn, ms) {
  const id = setTimeout(fn, ms);
  state.timers.push(id);
  return id;
}

function every(fn, ms) {
  const id = setInterval(fn, ms);
  state.timers.push(id);
  return id;
}

function clearTimers() {
  state.timers.forEach(id => {
    clearTimeout(id);
    clearInterval(id);
  });
  state.timers = [];
}

/* ---------- Small effects ---------- */
function buzz() {
  try {
    if (navigator.vibrate) navigator.vibrate(30);
  } catch (e) { /* ignore */ }
}

function shuffle(arr) {
  return arr.slice().sort(() => Math.random() - 0.5);
}

function shakeButton(btn) {
  btn.classList.remove('x');
  void btn.offsetWidth;  // restart the animation
  btn.classList.add('x');
}

function confetti(count = 30) {
  const emojis = ['💖', '💕', '🌹', '✨', '💗'];

  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'conf';
    piece.textContent = emojis[i % emojis.length];
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.animationDelay = Math.random() * 1.5 + 's';
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 5200);
  }
}

/* ---------- Title + hint used at the top of every game ---------- */
function head(title, subtitle) {
  stage.innerHTML = `<h2>${title}</h2><p class="sub">${subtitle}</p>`;
}


/* =========================================================
   3. SCREEN FLOW
   ========================================================= */

/* Move to a screen: 0 = intro, 1-10 = games, 11 = final */
function go(n) {
  clearTimers();
  state.step = n;
  drawDots();
  stage.innerHTML = '';

  if (n === 0) showIntro();
  else if (n <= TOTAL) GAMES[n - 1]();
  else showFinal();
}

function drawDots() {
  $('#dots').innerHTML = Array.from({ length: TOTAL }, (_, i) =>
    `<i class="${state.step > i ? 'on' : ''}"></i>`
  ).join('');
}

/* ---------- Intro screen ---------- */
function showIntro() {
  stage.innerHTML = `
    <div class="center" style="flex:1">
      <h1>This letter is for ${her} JoyJoy </h1>
      <p class="sub">Play ${TOTAL} tiny games. Each one unlocks a piece of what I want to say.</p>
      <div class="card">
        <p style="font-family:Caveat,cursive;font-size:30px;text-align:center;margin:0">
          From ${me} Alexander N. Espinosa
        </p>
        <button class="go" id="st">Start</button>
      </div>
    </div>`;

  $('#st').onclick = () => go(1);
}

/* ---------- Called by a game when it is finished ---------- */
function win() {
  buzz();
  later(() => revealChunk(state.step - 1), 350);
}

/* ---------- Unlock screen: letter text appears word by word ---------- */
function revealChunk(index) {
  confetti(14);

  const words = CHUNKS[index].split(' ');
  const delay = Math.min(280, Math.floor(9000 / words.length)); // long parts show faster
  const isLast = index === TOTAL - 1;

  stage.innerHTML = `
    <div class="center" style="flex:1;min-height:0">
      <h2>Unlocked 🔓</h2>
      <div class="card" id="cd" style="max-height:62vh;overflow-y:auto;margin-top:8px">
        <div class="line" id="ln"></div>
      </div>
    </div>
    <button class="go" id="nx" style="visibility:hidden">
      ${isLast ? 'Open my letter' : 'Next game'}
    </button>`;

  words.forEach((word, k) => {
    later(() => {
      const span = document.createElement('span');
      span.textContent = word;
      $('#ln').appendChild(span);

      const box = $('#cd');
      box.scrollTop = box.scrollHeight;
      if (k % 3 === 0) buzz();
    }, k * delay);
  });

  later(() => { $('#nx').style.visibility = 'visible'; }, words.length * delay + 300);
  $('#nx').onclick = () => go(state.step + 1);
}

/* ---------- Final screen: the whole letter ---------- */
function showFinal() {
  confetti(60);

  stage.innerHTML = `
    <h1>For ${her} 💌</h1>
    <div class="letter">
      ${CHUNKS.map(c => `<p>${c}</p>`).join('')}
      <p>${CLOSE}</p>
      <p style="color:var(--pink);text-align:center;font-size:30px">${SIGN}<br>— ${me} 💕</p>
      <div style="text-align:center">
        <button class="go" id="re" style="max-width:260px">Play again</button>
      </div>
    </div>`;

  $('#re').onclick = () => go(0);
  every(() => confetti(6), 2500);
}


/* =========================================================
   4. THE 10 GAMES
   Each game draws itself into the stage, then calls win().
   To add a game: add a function here AND one more chunk
   of text to CHUNKS above.
   ========================================================= */
const GAMES = [

  /* ---------- 1. Catch my heart ---------- */
  function catchHearts() {
    head('Game 1: Catch my heart', 'Tap 8 hearts before they float away');
    stage.insertAdjacentHTML('beforeend',
      '<div class="play" id="pl"></div>' +
      '<p class="sub" id="ct" style="margin-top:10px">0 / 8</p>');

    const GOAL = 8;
    const emojis = ['❤️', '💖', '💗', '💕'];
    let caught = 0;

    every(() => {
      const heart = document.createElement('div');
      heart.className = 'heart';
      heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      heart.style.left = Math.random() * 80 + '%';

      heart.onpointerdown = () => {
        if (heart.dead) return;
        heart.dead = true;
        heart.remove();
        buzz();
        $('#ct').textContent = ++caught + ' / ' + GOAL;
        if (caught >= GOAL) win();
      };

      $('#pl').appendChild(heart);
      setTimeout(() => heart.remove(), 4300);
    }, 650);
  },


  /* ---------- 2. Match our memories ---------- */
  function memoryMatch() {
    head('Game 2: Match our memories', 'Find all 4 pairs');
    stage.insertAdjacentHTML('beforeend',
      '<div class="play"><div class="grid" id="gr"></div></div>');

    const symbols = ['💌', '🌹', '🧸', '🌙'];
    const deck = shuffle([...symbols, ...symbols]);
    let flipped = [];
    let locked = false;
    let pairsFound = 0;

    deck.forEach(symbol => {
      const card = document.createElement('div');
      card.className = 'c';
      card.innerHTML = `<span>${symbol}</span>`;

      card.onclick = () => {
        if (locked || card.classList.contains('f')) return;
        card.classList.add('f');
        flipped.push(card);

        if (flipped.length < 2) return;
        const [a, b] = flipped;

        if (a.textContent === b.textContent) {
          a.classList.add('m');
          b.classList.add('m');
          flipped = [];
          buzz();
          if (++pairsFound === symbols.length) win();
        } else {
          locked = true;
          later(() => {
            a.classList.remove('f');
            b.classList.remove('f');
            flipped = [];
            locked = false;
          }, 700);
        }
      };

      $('#gr').appendChild(card);
    });
  },


  /* ---------- 3. Charge my love (press and hold) ---------- */
  function holdToCharge() {
    head('Game 3: Charge my love', 'Press and hold the heart until it is full');
    stage.insertAdjacentHTML('beforeend',
      '<div class="play center">' +
      '<button class="big" id="hb">💗</button>' +
      '<div class="bar"><b id="pb"></b></div></div>');

    const button = $('#hb');
    let power = 0;
    let holding = false;
    let finished = false;

    button.onpointerdown = e => { holding = true; e.preventDefault(); };
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(evt =>
      button.addEventListener(evt, () => { holding = false; })
    );
    button.oncontextmenu = e => e.preventDefault();

    every(() => {
      if (finished) return;
      power = Math.max(0, Math.min(100, power + (holding ? 1.6 : -2.2)));
      $('#pb').style.width = power + '%';
      button.style.transform = `scale(${1 + power / 150})`;

      if (power >= 100) {
        finished = true;
        win();
      }
    }, 30);
  },


  /* ---------- 4. Scratch the card ---------- */
  function scratchCard() {
    head('Game 4: Scratch it', 'Scratch the card to reveal a secret');
    stage.insertAdjacentHTML('beforeend',
      '<div class="play"><div class="scr">' +
      '<div>ITOT</div>' +
      '<canvas id="cv" width="320" height="200"></canvas>' +
      '</div></div>');

    const canvas = $('#cv');
    const ctx = canvas.getContext('2d');

    // Paint the scratch-off cover
    const gradient = ctx.createLinearGradient(0, 0, 320, 200);
    gradient.addColorStop(0, '#ff8fa8');
    gradient.addColorStop(1, '#ffb88c');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 320, 200);
    ctx.fillStyle = '#fff';
    ctx.font = '700 22px Quicksand, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('scratch here ✨', 160, 106);

    let pressing = false;
    let moves = 0;
    let finished = false;

    // What fraction of the cover has been scratched off?
    function scratchedFraction() {
      const data = ctx.getImageData(0, 0, 320, 200).data;
      let clear = 0, total = 0;
      for (let i = 3; i < data.length; i += 64) {
        total++;
        if (data[i] === 0) clear++;
      }
      return clear / total;
    }

    function scratch(e) {
      if (!pressing || finished) return;

      const rect = canvas.getBoundingClientRect();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(
        (e.clientX - rect.left) * 320 / rect.width,
        (e.clientY - rect.top) * 200 / rect.height,
        22, 0, 7
      );
      ctx.fill();

      if (++moves % 8 === 0 && scratchedFraction() > 0.5) {
        finished = true;
        canvas.style.transition = 'opacity .6s';
        canvas.style.opacity = 0;
        win();
      }
    }

    canvas.onpointerdown = e => {
      pressing = true;
      canvas.setPointerCapture(e.pointerId);
      scratch(e);
    };
    canvas.onpointermove = scratch;
    canvas.onpointerup = () => { pressing = false; };
  },


  /* ---------- 5. Say it with me (tap words in order) ---------- */
  function wordOrder() {
    head('Game 5: Say it with me', 'Tap the words in the right order');
    stage.insertAdjacentHTML('beforeend',
      '<div class="play center">' +
      '<div class="line" id="ans" style="min-height:70px;font-size:48px;text-align:center">&nbsp;</div>' +
      '<div class="tiles" id="tl"></div></div>');

    const correct = ['I', 'LOVE', 'YOU'];
    let next = 0;

    ['YOU', 'I', 'LOVE'].forEach(word => {
      const btn = document.createElement('button');
      btn.className = 'tile';
      btn.textContent = word;

      btn.onclick = () => {
        if (word !== correct[next]) return shakeButton(btn);

        btn.classList.add('d');
        next++;
        $('#ans').textContent = correct.slice(0, next).join(' ');
        buzz();

        if (next === correct.length) {
          $('#ans').textContent += ' 💖';
          win();
        }
      };

      $('#tl').appendChild(btn);
    });
  },


  /* ---------- 6. Open my heart (slider) ---------- */
  function slideToOpen() {
    head('Game 6: Open my heart', 'Slide all the way to the right');
    stage.insertAdjacentHTML('beforeend',
      '<div class="play center">' +
      '<div style="font-size:90px;text-align:center" id="se">🔒</div>' +
      '<input type="range" class="rng" id="sl" min="0" max="100" value="0"></div>');

    const slider = $('#sl');
    let finished = false;

    function iconFor(v) {
      if (v < 35) return '🔒';
      if (v < 70) return '💔';
      if (v < 100) return '❤️‍🩹';
      return '💖';
    }

    slider.oninput = () => {
      if (finished) return;
      const v = +slider.value;
      $('#se').textContent = iconFor(v);

      if (v >= 100) {
        finished = true;
        slider.disabled = true;
        win();
      }
    };

    // If she lets go before the end, the lock closes again
    slider.onchange = () => {
      if (finished) return;
      slider.value = 0;
      $('#se').textContent = '🔒';
    };
  },


  /* ---------- 7. Feel my heartbeat (tap 20 times) ---------- */
  function heartbeatTaps() {
    head('Game 7: Feel my heartbeat', 'Tap the heart 20 times');
    stage.insertAdjacentHTML('beforeend',
      '<div class="play center">' +
      '<button class="big" id="hb" style="margin:0 auto">💓</button>' +
      '<p class="sub" id="tc" style="margin-top:20px">0 / 20</p></div>');

    const GOAL = 20;
    const button = $('#hb');
    let taps = 0;
    let finished = false;

    button.onpointerdown = e => {
      e.preventDefault();
      if (finished) return;

      taps++;
      buzz();
      $('#tc').textContent = taps + ' / ' + GOAL;

      button.style.transform = 'scale(1.25)';
      setTimeout(() => { button.style.transform = 'scale(1)'; }, 90);

      if (taps >= GOAL) {
        finished = true;
        win();
      }
    };
  },


  /* ---------- 8. Spell my favorite name ---------- */
  function spellName() {
    head('Game 8: Spell my favorite name', 'Tap the letters in the right order');
    stage.insertAdjacentHTML('beforeend',
      '<div class="play center">' +
      '<div class="line" id="ans" style="font-size:52px;letter-spacing:4px;min-height:70px;text-align:center">&nbsp;</div>' +
      '<div class="tiles" id="tl"></div></div>');

    const name = her.toUpperCase();
    let next = 0;

    shuffle(name.split('')).forEach(letter => {
      const btn = document.createElement('button');
      btn.className = 'tile';
      btn.textContent = letter;

      btn.onclick = () => {
        if (letter !== name[next]) return shakeButton(btn);

        btn.classList.add('d');
        next++;
        $('#ans').textContent = name.slice(0, next);
        buzz();

        if (next === name.length) {
          $('#ans').textContent += ' 💖';
          win();
        }
      };

      $('#tl').appendChild(btn);
    });
  },


  /* ---------- 9. How well do you know us? (quiz) ---------- */
  function usQuiz() {
    head('Game 9: How well do you know us?', 'Answer 3 questions');
    stage.insertAdjacentHTML('beforeend',
      '<div class="play"><div class="q" id="qq"></div><div class="opts" id="op"></div></div>');

    // [question, [answers], index of the correct answer]
    const questions = [
      ['Where do we dream of going someday?', ['Switzerland', 'Japan', 'Spain'], 0],
      ['How long have we been together?', ['6 months', '1 year and 1 month', '2 years'], 1],
      ['Who loves you more than yesterday, less than tomorrow?', [me, 'Rene Baterbonia', 'Justine Nabunturan'], 0]
    ];

    let current = 0;

    function showQuestion() {
      const [text, answers, correctIndex] = questions[current];
      $('#qq').textContent = text;
      $('#op').innerHTML = '';

      shuffle(answers.map((label, index) => ({ label, index }))).forEach(({ label, index }) => {
        const btn = document.createElement('button');
        btn.className = 'tile';
        btn.textContent = label;

        btn.onclick = () => {
          if (index !== correctIndex) return shakeButton(btn);

          buzz();
          current++;
          if (current === questions.length) win();
          else showQuestion();
        };

        $('#op').appendChild(btn);
      });
    }

    showQuestion();
  },


  /* ---------- 10. Find my heart (3 rounds) ---------- */
  function findHeart() {
    head('Game 10: Find my heart', 'Find the hidden heart 3 times');
    stage.insertAdjacentHTML('beforeend',
      '<div class="play"><div class="grid g3" id="gr"></div></div>' +
      '<p class="sub" id="rd" style="margin-top:10px">Round 1 / 3</p>');

    const ROUNDS = 3;
    let round = 1;

    function startRound() {
      const heartAt = Math.floor(Math.random() * 9);
      $('#gr').innerHTML = '';
      $('#rd').textContent = `Round ${round} / ${ROUNDS}`;

      for (let k = 0; k < 9; k++) {
        const cell = document.createElement('button');
        cell.className = 'cell';
        cell.textContent = '🎁';

        cell.onclick = () => {
          cell.classList.add('o');

          if (k !== heartAt) {
            cell.textContent = '🍃';
            return;
          }

          cell.textContent = '💖';
          buzz();

          if (round === ROUNDS) win();
          else {
            round++;
            later(startRound, 700);
          }
        };

        $('#gr').appendChild(cell);
      }
    }

    startRound();
  }
];


/* =========================================================
   5. START-UP
   ========================================================= */

/* Soft floating hearts in the background */
function addBackgroundHearts() {
  const icons = ['💗', '✨', '🌸'];

  for (let i = 0; i < 10; i++) {
    const el = document.createElement('div');
    el.className = 'bg';
    el.textContent = icons[i % icons.length];
    el.style.left = Math.random() * 95 + 'vw';
    el.style.animationDuration = 14 + Math.random() * 12 + 's';
    el.style.animationDelay = -Math.random() * 20 + 's';
    document.body.appendChild(el);
  }
}

addBackgroundHearts();
go(0);