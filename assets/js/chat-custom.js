$(document).ready(function () {
  const chatContent = document.querySelector(".chat-plugin-content");
  const btnCloseChatForm = document.querySelector(".chat-plugin-close");
  const btnToggleChatForm = document.querySelector(".chat-plugin_icons");
  if (btnToggleChatForm) {
    btnToggleChatForm.addEventListener("click", () => {
      chatContent.classList.toggle("chatshow");
      btnToggleChatForm.classList.toggle("chatshow");
    });
    btnCloseChatForm.addEventListener("click", () => {
      chatContent.classList.remove("chatshow");
      btnToggleChatForm.classList.toggle("chatshow");
    });
  }

  // scrollbar
  jQuery(document).ready(function () {
    jQuery(".messager-list").scrollbar();
    jQuery(".chat-body").scrollbar();
    jQuery(".user-info-scroll").scrollbar();
    jQuery(".modal-contact-list").scrollbar();
    jQuery(".modal-contact-select-list").scrollbar();
  });
  // resize
  (function () {
    "use strict";

    // horizontal direction
    (function resizableX() {
      const resizer = document.querySelector(".resizer-x");
      resizer.addEventListener("mousedown", onmousedown);

      // for desktop
      function onmousedown(e) {
        e.preventDefault();
        document.addEventListener("mousemove", onmousemove);
        document.addEventListener("mouseup", onmouseup);
      }

      function onmousemove(e) {
        e.preventDefault();
        const clientX = e.clientX;

        const deltaX = clientX - (resizer._clientX || clientX);
        resizer._clientX = clientX;
        const l = resizer.previousElementSibling;
        const r = resizer.nextElementSibling;
        // LEFT

        if (deltaX < 0) {
          const w = Math.round(parseInt(getComputedStyle(l).width) + deltaX);
          if (w > 380) {
            l.style.flex = `0 ${w < 10 ? 0 : w}px`;
            r.style.flex = "1 0";
          }

          console.log(w);
        }
        // RIGHT
        if (deltaX > 0) {
          const w = Math.round(parseInt(getComputedStyle(l).width) + deltaX);
          if (w < 450) {
            l.style.flex = `0 ${w < 10 ? 0 : w}px`;
            r.style.flex = "1 0";
          }
        }
      }

      function onmouseup(e) {
        e.preventDefault();
        document.removeEventListener("mousemove", onmousemove);
        document.removeEventListener("mouseup", onmouseup);
        delete e._clientX;
      }
    })();
  })();
  // resposive info right
  let chatInfoToggle = document.querySelector(".btn-chat-info-toggle");
  let aside = document.querySelector("aside");
  chatInfoToggle.addEventListener("click", () => {
    aside.classList.toggle("show");
  });
  window.addEventListener("click", (e) => {
    if (aside.contains(e.target) || chatInfoToggle.contains(e.target)) {
      return;
    } else {
      aside.classList.remove("show");
    }
  });
  let messagerItem = document.querySelectorAll(".messager-item");
  let chatMain = document.querySelector("main");
  let chatBack = document.querySelector(".chat-back");
  messagerItem.forEach((item) => {
    item.addEventListener("click", () => {
      chatMain.classList.add("show");
    });
  });
  chatBack.addEventListener("click", () => {
    chatMain.classList.remove("show");
  });
});
