/* main.js - hardened boot */
(function () {
  console.log("[INK] main.js loaded");

  // 1) storyContent var mı?
  if (typeof storyContent === "undefined") {
    console.error("[INK] storyContent is undefined. story JS file didn't load or variable name mismatch.");
    return;
  }

  // 2) inkjs var mı?
  if (typeof inkjs === "undefined" || !inkjs.Story) {
    console.error("[INK] inkjs.Story is missing. ink.js didn't load.");
    return;
  }

  // 3) Story oluştur
  var inkStory;
  try {
    inkStory = new inkjs.Story(storyContent);
  } catch (e) {
    console.error("[INK] Failed to create story from storyContent:", e);
    return;
  }

  // Global olarak da koy (debug için)
  window.inkStory = inkStory;
  console.log("[INK] Story created:", inkStory);

  // 4) UI container’ı bul
  var storyContainer = document.querySelector("#story .container") || document.getElementById("story") || document.body;

  // 5) Basit renderer: metni akıt + seçenekleri buton yap
  function render() {
    // metin akıt
    while (inkStory.canContinue) {
      var p = document.createElement("p");
      p.textContent = inkStory.Continue();
      storyContainer.appendChild(p);
    }

    // eski seçenekleri temizle
    var oldChoices = document.querySelectorAll(".choice");
    oldChoices.forEach(function (c) { c.remove(); });

    // seçenekleri yaz
    if (inkStory.currentChoices.length > 0) {
      inkStory.currentChoices.forEach(function (choice, i) {
        var a = document.createElement("a");
        a.href = "#";
        a.className = "choice";
        a.textContent = choice.text;
        a.style.display = "block";
        a.style.margin = "10px 0";
        a.onclick = function (ev) {
          ev.preventDefault();
          inkStory.ChooseChoiceIndex(i);
          render();
        };
        storyContainer.appendChild(a);
      });
    } else {
      console.log("[INK] No choices left. End of story?");
    }
  }

  // 6) Başlat
  render();

  // restart butonu varsa bağla
  var rewind = document.getElementById("rewind");
  if (rewind) {
    rewind.addEventListener("click", function () {
      inkStory.ResetState();
      // ekranı temizle
      storyContainer.innerHTML = "";
      render();
    });
  }
})();
