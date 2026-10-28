/* One runtime for the standalone clock and the lesson iframe. */
(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const bridge =
    window.parent !== window &&
    window.parent.location.origin === location.origin
      ? window.parent.LerenLessonWidgets
      : null;
  const copy = {
    uk: {
      learn: "🖐️ Навчання",
      quiz: "🎯 Вистав час",
      caption: "Послухай або прочитай час і вистав стрілки",
      task: "🔊 Послухати завдання",
      score: "Правильно",
      wait: "Вистав години й хвилини окремими стрілками та відпусти — перевірка через 1 секунду.",
      checking: "⏳ Перевіряємо через 1 секунду…",
      correct: "🎉 Правильно! Наступне завдання через 2 секунди.",
      wrong: "❌ Спробуй ще раз! Перевір годину та хвилини.",
      hour: "година",
      unavailable: "Озвучування недоступне.",
    },
    en: {
      learn: "🖐️ Learn",
      quiz: "🎯 Set the time",
      caption: "Listen or read the time and set the hands",
      task: "🔊 Listen to the task",
      score: "Correct",
      wait: "Set the hours and minutes with their hands, then release — checked after 1 second.",
      checking: "⏳ Checking after 1 second…",
      correct: "🎉 Correct! Next task in 2 seconds.",
      wrong: "❌ Try again! Check the hour and minutes.",
      hour: "hour",
      unavailable: "Speech is unavailable.",
    },
    fr: {
      learn: "🖐️ Apprendre",
      quiz: "🎯 Régler l’heure",
      caption: "Écoutez ou lisez l’heure et réglez les aiguilles",
      task: "🔊 Écouter la consigne",
      score: "Correct",
      wait: "Réglez les heures et les minutes avec leurs aiguilles, puis relâchez — vérification après 1 seconde.",
      checking: "⏳ Vérification après 1 seconde…",
      correct: "🎉 Bravo ! Prochaine question dans 2 secondes.",
      wrong: "❌ Réessayez ! Vérifiez l’heure et les minutes.",
      hour: "heure",
      unavailable: "La synthèse vocale est indisponible.",
    },
    ar: {
      learn: "🖐️ تعلّم",
      quiz: "🎯 اضبط الوقت",
      caption: "استمع أو اقرأ الوقت ثم اضبط العقارب",
      task: "🔊 استمع إلى السؤال",
      score: "الصحيح",
      wait: "اضبط الساعات والدقائق بعقربيهما ثم ارفع إصبعك — التحقق بعد ثانية.",
      checking: "⏳ التحقق بعد ثانية…",
      correct: "🎉 صحيح! السؤال التالي بعد ثانيتين.",
      wrong: "❌ حاول مرة أخرى! تحقق من الساعة والدقائق.",
      hour: "ساعة",
      unavailable: "النطق غير متاح.",
    },
  };
  let lang =
    bridge?.getLanguage() ||
    new URLSearchParams(location.search).get("lang") ||
    "uk";
  if (!copy[lang]) lang = "uk";
  const u = copy[lang],
    core = LerenClock.text(lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.querySelector(".clock-tabs").setAttribute("aria-label", core.title);
  $("clockLearnTab").textContent = u.learn;
  $("clockQuizTab").textContent = u.quiz;
  document.querySelector(".clock-quiz-caption").textContent = u.caption;
  document.querySelector(".clock-quiz-actions button").textContent = u.task;
  document.querySelector(".lbe-speak-btn").textContent = "🔊 " + core.listen;
  document.querySelector(".lbe-clock-header h2").textContent = core.title;
  document.querySelector(".lbe-clock-header p").textContent = core.intro;
  document
    .querySelectorAll(".lbe-quick-hours button")
    .forEach((b, i) => (b.textContent = (i ? "+1 " : "−1 ") + u.hour));
  const dial = $("clockDial");
  dial.setAttribute("aria-label", core.title + " — " + core.keys);
  let total = 860,
    raw = total,
    previous = 0,
    pointer = null,
    activeHand = "minute",
    mode = "learn",
    target = 150,
    answered = false,
    attempts = 0,
    correct = 0;
  let actionTimer = null,
    nextTimer = null;
  const wrap = (n) => ((n % 1440) + 1440) % 1440;
  function cancelTimers() {
    clearTimeout(actionTimer);
    clearTimeout(nextTimer);
    actionTimer = nextTimer = null;
  }
  function stopSpeech() {
    if (bridge) bridge.stop();
    else if (window.speechSynthesis) window.speechSynthesis.cancel();
  }
  function speak(text, automatic = false) {
    if (bridge) {
      bridge.speak(text, automatic);
      return;
    }
    if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
      $("clockQuizFeedback").textContent = u.unavailable;
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "nl-BE";
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  }
  function render() {
    const t = LerenClock.timeInfo(total, lang);
    total = t.total;
    $("minuteHand").style.transform = `rotate(${t.m * 6}deg)`;
    $("hourHand").style.transform = `rotate(${(t.h % 12) * 30 + t.m / 2}deg)`;
    $("digitalTime").textContent = t.digital;
    $("dutchTime").textContent = t.phrase;
    $("uaHint").textContent = "💡 " + t.hint;
    dial.setAttribute("aria-valuenow", total);
    dial.setAttribute("aria-valuetext", t.digital + " — " + t.phrase);
    $("clockScore").textContent = `${u.score}: ${correct} / ${attempts}`;
    notifyHeight();
  }
  function schedule() {
    clearTimeout(actionTimer);
    if (mode === "quiz" && !answered) {
      $("clockQuizFeedback").textContent = u.checking;
      actionTimer = setTimeout(check, 1000);
    } else if (mode === "learn")
      actionTimer = setTimeout(
        () => speak(LerenClock.timeInfo(total).phrase, true),
        1000,
      );
  }
  function next() {
    cancelTimers();
    answered = false;
    let nextTarget;
    do {
      nextTarget = Math.floor(Math.random() * 144) * 5;
    } while (nextTarget === target);
    target = nextTarget;
    total = 0;
    $("clockTarget").textContent = LerenClock.timeInfo(target).phrase;
    $("clockQuizFeedback").textContent = u.wait;
    render();
  }
  function check() {
    if (answered || mode !== "quiz" || pointer !== null) return;
    attempts++;
    answered = total % 720 === target;
    if (answered) {
      correct++;
      $("clockQuizFeedback").textContent = u.correct;
      speak(LerenClock.timeInfo(target).phrase, true);
      nextTimer = setTimeout(next, 2000);
    } else $("clockQuizFeedback").textContent = u.wrong;
    render();
  }
  function setMode(value) {
    cancelTimers();
    stopSpeech();
    pointer = null;
    mode = value;
    $("clockLearnTab").classList.toggle("active", mode === "learn");
    $("clockQuizTab").classList.toggle("active", mode === "quiz");
    $("clockQuizPanel").hidden = mode !== "quiz";
    $("clockLearnOutput").hidden = mode === "quiz";
    if (mode === "quiz") next();
    else render();
  }
  const angle = (e) => {
    const r = dial.getBoundingClientRect();
    return (
      ((Math.atan2(
        e.clientY - r.top - r.height / 2,
        e.clientX - r.left - r.width / 2,
      ) *
        180) /
        Math.PI +
        450) %
      360
    );
  };
  function move(e) {
    if (e.pointerId !== pointer) return;
    const a = angle(e);
    raw = activeHand === "hour"
      ? LerenClock.dragHourTime(raw, previous, a)
      : LerenClock.dragTime(raw, previous, a);
    previous = a;
    total = LerenClock.timeInfo(raw).total;
    render();
  }
  dial.addEventListener("pointerdown", (e) => {
    if (
      pointer !== null ||
      !e.isPrimary ||
      e.button !== 0 ||
      (mode === "quiz" && answered)
    )
      return;
    cancelTimers();
    stopSpeech();
    pointer = e.pointerId;
    previous = angle(e);
    activeHand = e.target.closest?.("#hourHand") ? "hour" : "minute";
    raw = activeHand === "hour"
      ? total
      : Math.floor(total / 60) * 60 + previous / 6;
    if (activeHand === "minute") total = LerenClock.timeInfo(raw).total;
    dial.setPointerCapture(pointer);
    render();
    e.preventDefault();
  });
  dial.addEventListener("pointermove", move);
  dial.addEventListener("pointerup", (e) => {
    if (e.pointerId !== pointer) return;
    move(e);
    pointer = null;
    dial.releasePointerCapture(e.pointerId);
    activeHand = "minute";
    schedule();
  });
  const cancelPointer = () => {
    pointer = null;
    activeHand = "minute";
  };
  dial.addEventListener("pointercancel", cancelPointer);
  dial.addEventListener("lostpointercapture", cancelPointer);
  dial.addEventListener("keydown", (e) => {
    const delta = {
      ArrowUp: 5,
      ArrowRight: 5,
      ArrowDown: -5,
      ArrowLeft: -5,
      PageUp: 60,
      PageDown: -60,
    }[e.key];
    if (delta === undefined || (mode === "quiz" && answered)) return;
    e.preventDefault();
    cancelTimers();
    stopSpeech();
    total = wrap(total + delta);
    render();
    schedule();
  });
  function notifyHeight() {
    if (window.parent === window) return;
    requestAnimationFrame(() =>
      window.parent.postMessage(
        { type: "lerenbe-clock-height", height: document.body.scrollHeight },
        location.origin,
      ),
    );
  }
  window.clockSetMode = setMode;
  window.changeHour = (delta) => {
    if (mode === "quiz" && answered) return;
    cancelTimers();
    stopSpeech();
    total = wrap(total + delta * 60);
    render();
    schedule();
  };
  window.speakCurrentTime = () => speak(LerenClock.timeInfo(total).phrase);
  window.clockSpeakTarget = () => speak(LerenClock.timeInfo(target).phrase);
  window.addEventListener("pagehide", () => {
    cancelTimers();
    stopSpeech();
  });
  window.addEventListener("load", notifyHeight);
  if (window.ResizeObserver)
    new ResizeObserver(notifyHeight).observe(document.body);
  $("clockQuizFeedback").textContent = u.wait;
  render();
})();
