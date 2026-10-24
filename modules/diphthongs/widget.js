(() => {
  "use strict";
  const SCRIPT = document.currentScript;
  const base = new URL(".", SCRIPT.src);
  const dictionary = {
    uk: {
      pairsTab: "⚖️ Батл звуків",
      articTab: "👄 Артикулятор",
      dictTab: "🎧 Аудіодиктант",
      pairsIntro:
        "Порівнюй звучання слів. Це звукові контрасти, не завжди строгі мінімальні пари.",
      dictIntro:
        "Слухай слово й визнач групу звуків. ij/ei та ou/au об’єднані: на слух їх не відрізнити.",
      badge: "Фонетика нідерландської",
      title: "🛹 Дифтонги: Звукова гірка",
      subtitle: "Навчися розрізняти ковзні звуки й пастки",
      language: "Мова",
      theoryTab: "📖 Теорія та звуки",
      quizTab: "🎮 Тренажер",
      whatTitle: "💡 Що таке дифтонг?",
      whatText:
        "Це плавний перехід від одного голосного до іншого в межах одного складу.",
      choose: "Обери звук і послухай приклад:",
      trap1: "⚠️ Пастка: oe, ie, eu — монофтонги.",
      trap2: "Trema (ï, ë) позначає роздільну вимову сусідніх голосних.",
      goQuiz: "Перейти до тренажера 🚀",
      wordLabel: "Слово",
      points: "Бали",
      listen: "🔊 Послухати вимову",
      yes: "🏂 Це дифтонг!",
      no: "🚶 Не дифтонг",
      next: "Наступне слово →",
      finished: "🎉 Раунд завершено!",
      result: "Результат",
      best: "Найкращий результат",
      again: "Спробувати ще раз 🔄",
      correct: "✅ Правильно!",
      wrong: "❌ Помилка!",
      noVoice: "Озвучування недоступне у цьому браузері.",
      loadError: "Не вдалося завантажити слова. Перевір шлях до файлів.",
      trema: "Дві крапки (trema) показують межу складів.",
      mono: "Це один голосний звук, а не дифтонг.",
      diph: "У цьому слові є ковзний звук — дифтонг.",
    },
    en: {
      pairsTab: "⚖️ Sound battle",
      articTab: "👄 Articulation",
      dictTab: "🎧 Audio dictation",
      pairsIntro:
        "Compare word sounds. These are contrasts, not always strict minimal pairs.",
      dictIntro:
        "Listen and choose the sound group. ij/ei and ou/au sound identical within each pair.",
      badge: "Dutch phonetics",
      title: "🛹 Diphthongs: Sound Slide",
      subtitle: "Learn to recognize gliding vowels and tricky exceptions",
      language: "Language",
      theoryTab: "📖 Theory & sounds",
      quizTab: "🎮 Practice quiz",
      whatTitle: "💡 What is a diphthong?",
      whatText:
        "A smooth glide from one vowel sound to another within one syllable.",
      choose: "Choose a sound and listen:",
      trap1: "⚠️ Trap: oe, ie, eu are monophthongs.",
      trap2:
        "A diaeresis (ï, ë) marks separate vowel pronunciation across syllables.",
      goQuiz: "Start practice 🚀",
      wordLabel: "Word",
      points: "Points",
      listen: "🔊 Listen",
      yes: "🏂 Diphthong!",
      no: "🚶 Not a diphthong",
      next: "Next word →",
      finished: "🎉 Round complete!",
      result: "Score",
      best: "Best score",
      again: "Try again 🔄",
      correct: "✅ Correct!",
      wrong: "❌ Incorrect!",
      noVoice: "Speech is not available in this browser.",
      loadError: "Could not load word data. Check the file paths.",
      trema: "The diaeresis marks a syllable boundary.",
      mono: "This is a single vowel sound, not a diphthong.",
      diph: "This word contains a gliding vowel sound.",
    },
    fr: {
      pairsTab: "⚖️ Bataille des sons",
      articTab: "👄 Articulation",
      dictTab: "🎧 Dictée audio",
      pairsIntro:
        "Comparez les sons. Ces contrastes ne sont pas toujours des paires minimales strictes.",
      dictIntro:
        "Écoutez et choisissez le groupe sonore. ij/ei et ou/au sont indiscernables à l’oreille.",
      badge: "Phonétique néerlandaise",
      title: "🛹 Diphtongues : glissade sonore",
      subtitle: "Apprenez à distinguer les sons glissants des pièges",
      language: "Langue",
      theoryTab: "📖 Théorie et sons",
      quizTab: "🎮 Quiz",
      whatTitle: "💡 Une diphtongue, c’est quoi ?",
      whatText:
        "Une transition fluide entre deux sons vocaliques dans une même syllabe.",
      choose: "Choisissez un son et écoutez :",
      trap1: "⚠️ Attention : oe, ie, eu sont des monophtongues.",
      trap2:
        "Le tréma (ï, ë) indique que les voyelles se prononcent séparément.",
      goQuiz: "Commencer le quiz 🚀",
      wordLabel: "Mot",
      points: "Points",
      listen: "🔊 Écouter",
      yes: "🏂 Diphtongue !",
      no: "🚶 Pas une diphtongue",
      next: "Mot suivant →",
      finished: "🎉 Série terminée !",
      result: "Score",
      best: "Meilleur score",
      again: "Réessayer 🔄",
      correct: "✅ Correct !",
      wrong: "❌ Erreur !",
      noVoice: "La synthèse vocale est indisponible.",
      loadError: "Impossible de charger les mots. Vérifiez les chemins.",
      trema: "Le tréma marque une séparation des syllabes.",
      mono: "C’est un seul son vocalique, pas une diphtongue.",
      diph: "Ce mot contient un son vocalique glissant.",
    },
    ar: {
      pairsTab: "⚖️ مقارنة الأصوات",
      articTab: "👄 النطق",
      dictTab: "🎧 إملاء صوتي",
      pairsIntro: "قارن الأصوات؛ ليست كلها أزواجًا صغرى بالمعنى الدقيق.",
      dictIntro:
        "استمع واختر مجموعة الصوت؛ ij/ei و ou/au لهما النطق نفسه في كل زوج.",
      badge: "أصوات اللغة الهولندية",
      title: "🛹 الأصوات المزدوجة: الزحليقة الصوتية",
      subtitle: "تعلّم التمييز بين الأصوات المتحركة والفخاخ",
      language: "اللغة",
      theoryTab: "📖 النظرية والأصوات",
      quizTab: "🎮 التدريب",
      whatTitle: "💡 ما هو الصوت المزدوج؟",
      whatText: "انتقال سلس من صوت علة إلى آخر ضمن مقطع واحد.",
      choose: "اختر صوتًا واستمع:",
      trap1: "⚠️ انتبه: oe وie وeu أصوات علة مفردة.",
      trap2: "تشير النقطتان (ï، ë) إلى نطق الحروف المتحركة بشكل منفصل.",
      goQuiz: "ابدأ التدريب 🚀",
      wordLabel: "الكلمة",
      points: "النقاط",
      listen: "🔊 استمع",
      yes: "🏂 صوت مزدوج!",
      no: "🚶 ليس صوتًا مزدوجًا",
      next: "الكلمة التالية ←",
      finished: "🎉 انتهت الجولة!",
      result: "النتيجة",
      best: "أفضل نتيجة",
      again: "حاول مجددًا 🔄",
      correct: "✅ صحيح!",
      wrong: "❌ خطأ!",
      noVoice: "النطق غير متاح في هذا المتصفح.",
      loadError: "تعذر تحميل الكلمات. تحقق من مسارات الملفات.",
      trema: "تشير النقطتان إلى فصل المقاطع.",
      mono: "هذا صوت علة واحد وليس صوتًا مزدوجًا.",
      diph: "تحتوي هذه الكلمة على صوت علة متحرك.",
    },
  };
  const demos = {
    ui: ["Е-подібний", "І-подібний", "huis", "будинок"],
    ij: ["Широке [Е]", "Коротке [Й]", "kijken", "дивитися"],
    ou: ["Звук [О/А]", "Коротке [У/В]", "koud", "холодний"],
    eeuw: ["Довге [Е:]", "Звук [W/В]", "leeuw", "лев"],
  };
  const demoLocales = {
    en: {
      ui: ["Front rounded vowel", "Raised tongue", "huis", "house"],
      ij: ["Open vowel", "Narrower vowel", "kijken", "to look"],
      ou: ["Open vowel", "Rounded lips", "koud", "cold"],
      eeuw: ["Long [eː]", "[w] glide", "leeuw", "lion"],
    },
    fr: {
      ui: ["Voyelle antérieure arrondie", "Langue relevée", "huis", "maison"],
      ij: ["Voyelle ouverte", "Voyelle plus fermée", "kijken", "regarder"],
      ou: ["Voyelle ouverte", "Lèvres arrondies", "koud", "froid"],
      eeuw: ["[eː] long", "Glissement vers [w]", "leeuw", "lion"],
    },
    ar: {
      ui: ["صائت أمامي مع تدوير الشفتين", "ارتفاع اللسان", "huis", "منزل"],
      ij: ["صائت مفتوح", "صائت أضيق", "kijken", "ينظر"],
      ou: ["صائت مفتوح", "تدوير الشفتين", "koud", "بارد"],
      eeuw: ["[eː] طويل", "انتقال إلى [w]", "leeuw", "أسد"],
    },
  };
  const articLocales = {
    en: {
      ui: [
        "Rounded lips; tongue forward",
        "Less rounded lips; tongue rises",
        "Start with a front rounded vowel and smoothly move the tongue. Keep the glide in one syllable.",
        "Do not pronounce ui as two separate vowels.",
      ],
      ij: [
        "Jaw more open; lips neutral",
        "Tongue rises; mouth narrows",
        "ij and ei sound the same; learn their spelling separately.",
        "Do not split the glide into two syllables.",
      ],
      ou: [
        "Mouth more open",
        "Lips round and narrow",
        "ou and au sound the same; make a smooth glide within one syllable.",
        "Do not pause between the vowel positions.",
      ],
    },
    fr: {
      ui: [
        "Lèvres arrondies ; langue en avant",
        "Lèvres moins arrondies ; langue relevée",
        "Commencez par une voyelle antérieure arrondie puis déplacez la langue sans coupure, dans une seule syllabe.",
        "Ne prononcez pas ui comme deux voyelles séparées.",
      ],
      ij: [
        "Mâchoire plus ouverte ; lèvres neutres",
        "La langue monte ; la bouche se ferme",
        "ij et ei ont le même son ; apprenez leur orthographe séparément.",
        "Ne séparez pas le glissement en deux syllabes.",
      ],
      ou: [
        "Bouche plus ouverte",
        "Les lèvres s’arrondissent et se resserrent",
        "ou et au ont le même son ; faites une transition fluide dans une seule syllabe.",
        "Ne faites pas de pause entre les positions.",
      ],
    },
    ar: {
      ui: [
        "الشفتان مستديرتان واللسان إلى الأمام",
        "تقل استدارة الشفتين ويرتفع اللسان",
        "ابدأ بصائت أمامي مع تدوير الشفتين ثم حرّك اللسان بسلاسة في مقطع واحد.",
        "لا تنطق ui كصائتين منفصلين.",
      ],
      ij: [
        "الفك أكثر انفتاحًا والشفتان محايدتان",
        "يرتفع اللسان ويضيق الفم",
        "نطق ij وei واحد؛ تعلّم الكتابة بشكل منفصل.",
        "لا تقسّم الانتقال إلى مقطعين.",
      ],
      ou: [
        "الفم أكثر انفتاحًا",
        "تستدير الشفتان وتضيقان",
        "نطق ou وau واحد؛ انتقل بسلاسة ضمن مقطع واحد.",
        "لا تتوقف بين موضعي الصائت.",
      ],
    },
  };
  const instances = new Set();
  const storageKey = "lerenbe.diphthongs.best.v1";
  const shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  function init(root, words) {
    if (root.dataset.ready) return;
    root.dataset.ready = "1";
    const $ = (s) => root.querySelector(s),
      $$ = (s) => [...root.querySelectorAll(s)];
    let lang = "uk",
      deck = [],
      index = 0,
      score = 0,
      answered = false,
      lastCorrect = null,
      demo = "ui";
    const tr = (k) =>
      (dictionary[lang] || dictionary.uk)[k] || dictionary.uk[k] || k;
    function setLanguage(next) {
      lang = dictionary[next] ? next : "uk";
      root.lang = lang;
      root.dir = lang === "ar" ? "rtl" : "ltr";
      $("[data-role=language]").value = lang;
      $$("[data-i18n]").forEach((el) => {
        el.textContent = tr(el.dataset.i18n);
      });
      updateDemo();
      renderArtic();
      const item = deck[index];
      if (item) {
        $("[data-role=translation]").textContent =
          item.translations?.[lang] || item.tr;
        if (answered) paintFeedback(lastCorrect);
      }
    }
    function speak(word, automatic = false) {
      if (window.LerenLessonWidgets) {
        window.LerenLessonWidgets.speak(word, automatic);
        return;
      }
      if (
        !("speechSynthesis" in window) ||
        !("SpeechSynthesisUtterance" in window)
      ) {
        $("[data-role=status]").textContent = tr("noVoice");
        return;
      }
      const synth = window.speechSynthesis;
      const voices = synth.getVoices();
      const voice =
        voices.find((v) => v.lang.toLowerCase() === "nl-be") ||
        voices.find((v) => v.lang.toLowerCase().startsWith("nl"));
      synth.cancel();
      const u = new SpeechSynthesisUtterance(word);
      u.lang = voice?.lang || "nl-BE";
      if (voice) u.voice = voice;
      u.rate = 0.85;
      u.onerror = () => {
        $("[data-role=status]").textContent = tr("noVoice");
      };
      synth.speak(u);
    }
    function updateDemo() {
      const d = (demoLocales[lang] || demos)[demo];
      $("[data-role=start]").textContent = d[0];
      $("[data-role=end]").textContent = d[1];
      $("[data-role=demo-word]").textContent = d[2];
      $("[data-role=demo-tr]").textContent = d[3];
      $$("[data-demo]").forEach((b) =>
        b.setAttribute("aria-pressed", String(b.dataset.demo === demo)),
      );
    }
    function tab(name) {
      $$("[data-tab]").forEach((b) =>
        b.setAttribute("aria-selected", String(b.dataset.tab === name)),
      );
      $$("[data-pane]").forEach((p) => (p.hidden = p.dataset.pane !== name));
      if (name === "quiz" && !deck.length) start();
    }
    function start() {
      deck = shuffle([...words]).slice(0, Math.min(10, words.length));
      index = 0;
      score = 0;
      answered = false;
      $("[data-role=finished]").hidden = true;
      $("[data-role=quiz-area]").hidden = false;
      render(false);
    }
    function render(autoSpeak) {
      const item = deck[index];
      if (!item) return;
      $("[data-role=word]").textContent = item.word;
      $("[data-role=translation]").textContent =
        item.translations?.[lang] || item.tr;
      $("[data-role=current]").textContent = String(index + 1);
      $("[data-role=total]").textContent = String(deck.length);
      $("[data-role=score]").textContent = String(score);
      $("[data-role=feedback]").hidden = true;
      $("[data-action=next]").hidden = true;
      $$("[data-answer]").forEach((b) => (b.disabled = false));
      answered = false;
      if (autoSpeak) speak(item.word, true);
    }
    function answer(choice) {
      if (answered) return;
      answered = true;
      const item = deck[index],
        correct = choice === item.isDiph;
      if (correct) score += 10;
      $$("[data-answer]").forEach((b) => (b.disabled = true));
      lastCorrect = correct;
      paintFeedback(correct);
      $("[data-role=score]").textContent = String(score);
      $("[data-action=next]").hidden = false;
    }
    function paintFeedback(correct) {
      const item = deck[index];
      const fb = $("[data-role=feedback]");
      fb.className = "lbe-feedback " + (correct ? "correct" : "wrong");
      fb.replaceChildren();
      const strong = document.createElement("strong");
      strong.textContent = tr(correct ? "correct" : "wrong") + " ";
      const detail = document.createElement("span");
      detail.textContent =
        lang === "uk"
          ? item.exp
          : tr(
              item.pattern === "trema"
                ? "trema"
                : item.isDiph
                  ? "diph"
                  : "mono",
            ) +
            " (" +
            item.pattern +
            ")";
      fb.append(strong, detail);
      fb.hidden = false;
      $("[data-role=score]").textContent = String(score);
      $("[data-action=next]").hidden = false;
    }
    function next() {
      if (!answered) return;
      index++;
      if (index < deck.length) {
        render(true);
        return;
      }
      $("[data-role=quiz-area]").hidden = true;
      $("[data-role=finished]").hidden = false;
      const total = deck.length * 10;
      $("[data-role=final]").textContent = score + " / " + total;
      let best = 0;
      try {
        best = Math.max(0, Math.min(total, Number(localStorage.getItem(storageKey)) || 0));
        if (score > best) {
          best = score;
          localStorage.setItem(storageKey, String(best));
        }
      } catch (_e) {}
      $("[data-role=best]").textContent = best + " / " + total;
      root.dispatchEvent(
        new CustomEvent("lerenbe:diphthongs:complete", {
          bubbles: true,
          detail: {
            score,
            maxScore: total,
            percent: Math.round((score / total) * 100),
          },
        }),
      );
    }
    const contrasts = [
      [
        ["huis", "🏠", "ui"],
        ["haas", "🐇", "aa"],
        ["hoed", "🎩", "oe"],
      ],
      [
        ["ijs", "🍦", "ij/ei"],
        ["is", "✔️", "i"],
      ],
      [
        ["koud", "🥶", "ou/au"],
        ["koot", "🦴", "oo"],
      ],
    ];
    const artic = {
      ui: {
        start: "Губи округлені; язик спереду",
        end: "Губи менш округлені, язик піднімається",
        bridge:
          "Почни з переднього округленого голосного й плавно зміни положення язика. Українське «у-і» — не правильний звук.",
        trap: "🚫 ui НЕ читається як українське «у-і».",
        word: "huis",
      },
      ij: {
        start: "Щелепа відкритіша, губи нейтральні",
        end: "Язик піднімається, рот звужується",
        bridge: "ij та ei мають однакове звучання; написання вивчай окремо.",
        trap: "🚫 Не вимовляй ij як два окремі звуки «і-й».",
        word: "trein",
      },
      ou: {
        start: "Рот більш відкритий",
        end: "Губи округлюються й звужуються",
        bridge: "ou та au звучать однаково; плавний перехід в одному складі.",
        trap: "🚫 Не роби паузи між двома голосними.",
        word: "koud",
      },
    };
    let articKey = "ui";
    function renderArtic() {
      const original = artic[articKey],
        translated = articLocales[lang]?.[articKey];
      const a = translated
        ? {
            start: translated[0],
            end: translated[1],
            bridge: translated[2],
            trap: translated[3],
            word: original.word,
          }
        : original;
      $("[data-role=artic-start]").textContent = a.start;
      $("[data-role=artic-end]").textContent = a.end;
      $("[data-role=artic-bridge]").textContent = a.bridge;
      $("[data-role=artic-trap]").textContent = a.trap;
      $("[data-role=artic-word]").textContent = a.word;
      $$("[data-artic]").forEach((b) =>
        b.setAttribute("aria-pressed", String(b.dataset.artic === articKey)),
      );
    }
    const pairsBox = $("[data-role=pairs]");
    contrasts.forEach((group) => {
      const row = document.createElement("div");
      row.className = "lbe-pair-row";
      group.forEach(([word, emoji, sound]) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "lbe-pair-button";
        b.textContent = emoji + " " + word + " [" + sound + "] 🔊";
        b.addEventListener("click", () => speak(word));
        row.appendChild(b);
      });
      pairsBox.appendChild(row);
    });
    renderArtic();
    const dictSource = [
      ["trein", "ij/ei"],
      ["huis", "ui"],
      ["koud", "ou/au"],
      ["kijken", "ij/ei"],
      ["blauw", "ou/au"],
      ["muis", "ui"],
      ["boek", "oe"],
      ["fiets", "ie"],
      ["neus", "eu"],
      ["ijs", "ij/ei"],
    ];
    let dictDeck = [],
      di = 0,
      ds = 0,
      dictAnswered = false;
    const dictGroups = ["ui", "ij/ei", "ou/au", "oe", "ie", "eu"];
    function startDict() {
      dictDeck = shuffle([...dictSource]).slice(0, 8);
      di = 0;
      ds = 0;
      $("[data-role=dict-finished]").hidden = true;
      renderDict();
    }
    function renderDict() {
      dictAnswered = false;
      const item = dictDeck[di];
      $("[data-role=dict-index]").textContent = di + 1;
      $("[data-role=dict-total]").textContent = dictDeck.length;
      $("[data-role=dict-score]").textContent = ds;
      $("[data-role=dict-feedback]").hidden = true;
      $("[data-action=dict-next]").hidden = true;
      const box = $("[data-role=dict-options]");
      box.replaceChildren();
      const choices = shuffle([
        item[1],
        ...shuffle(dictGroups.filter((x) => x !== item[1])).slice(0, 3),
      ]);
      choices.forEach((c) => {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = c;
        b.addEventListener("click", () => {
          if (dictAnswered) return;
          dictAnswered = true;
          const ok = c === item[1];
          if (ok) ds += 10;
          box.querySelectorAll("button").forEach((x) => (x.disabled = true));
          const fb = $("[data-role=dict-feedback]");
          fb.hidden = false;
          fb.className = "lbe-feedback " + (ok ? "correct" : "wrong");
          fb.textContent = (ok ? "✅ " : "❌ ") + item[0] + " — " + item[1];
          $("[data-role=dict-score]").textContent = ds;
          $("[data-action=dict-next]").hidden = false;
        });
        box.appendChild(b);
      });
    }
    function nextDict() {
      if (!dictAnswered) return;
      di++;
      if (di < dictDeck.length) {
        renderDict();
        speak(dictDeck[di][0], true);
      } else {
        $("[data-role=dict-options]").replaceChildren();
        $("[data-action=dict-next]").hidden = true;
        $("[data-role=dict-feedback]").hidden = true;
        $("[data-role=dict-finished]").hidden = false;
        $("[data-role=dict-final]").textContent =
          ds + " / " + dictDeck.length * 10;
        root.dispatchEvent(
          new CustomEvent("lerenbe:diphthongs:dictation-complete", {
            bubbles: true,
            detail: { score: ds, maxScore: dictDeck.length * 10 },
          }),
        );
      }
    }
    root.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b || !root.contains(b)) return;
      if (b.dataset.tab) {
        tab(b.dataset.tab);
        if (b.dataset.tab === "dict" && !dictDeck.length) {
          startDict();
          speak(dictDeck[0][0]);
        }
      } else if (b.dataset.artic) {
        articKey = b.dataset.artic;
        renderArtic();
        speak(artic[articKey].word);
      } else if (b.dataset.action === "artic-speak")
        speak(artic[articKey].word);
      else if (b.dataset.action === "dict-speak" && dictDeck[di])
        speak(dictDeck[di][0]);
      else if (b.dataset.action === "dict-next") nextDict();
      else if (b.dataset.action === "dict-restart") {
        startDict();
        speak(dictDeck[0][0]);
      } else if (b.dataset.demo) {
        demo = b.dataset.demo;
        updateDemo();
        speak(demos[demo][2]);
      } else if (b.dataset.answer !== undefined)
        answer(b.dataset.answer === "true");
      else if (b.dataset.action === "go-quiz") tab("quiz");
      else if (b.dataset.action === "demo-speak") speak(demos[demo][2]);
      else if (b.dataset.action === "word-speak" && deck[index])
        speak(deck[index].word);
      else if (b.dataset.action === "next") next();
      else if (b.dataset.action === "restart") start();
    });
    $("[data-role=language]").addEventListener("change", (e) =>
      setLanguage(e.target.value),
    );
    instances.add({ root, setLanguage });
    const globalLang = (
      window.LerenLessonWidgets?.getLanguage() ||
      document.documentElement.lang ||
      ""
    ).toLowerCase();
    setLanguage(
      globalLang.startsWith("fr")
        ? "fr"
        : globalLang.startsWith("ar")
          ? "ar"
          : globalLang.startsWith("en")
            ? "en"
            : "uk",
    );
    updateDemo();
  }
  async function mount(target) {
    const host =
      typeof target === "string" ? document.querySelector(target) : target;
    if (!host) return;
    try {
      const [html, words] = await Promise.all([
        fetch(new URL("widget.html", base)).then((r) => {
          if (!r.ok) throw Error("html");
          return r.text();
        }),
        fetch(new URL("words.json", base)).then((r) => {
          if (!r.ok) throw Error("json");
          return r.json();
        }),
      ]);
      if (!document.querySelector("link[data-lbe-diph-css]")) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = new URL("widget.css", base).href;
        link.dataset.lbeDiphCss = "1";
        document.head.appendChild(link);
      }
      host.innerHTML = html;
      init(host.querySelector("[data-lbe-diph]"), words);
    } catch (err) {
      host.textContent =
        "Не вдалося завантажити модуль. Перевірте розміщення файлів і запуск через HTTP(S).";
      console.error("Leren.be diphthongs:", err);
    }
  }
  window.LerenbeDiphthongs = {
    mount,
    setLanguage(lang) {
      for (const instance of instances) {
        if (instance.root.isConnected) instance.setLanguage(lang);
        else instances.delete(instance);
      }
    },
  };
  document.querySelectorAll("[data-lerenbe-diphthongs]").forEach(mount);
})();
