// ==UserScript==
// @name         EmojiScript
// @namespace    https://emojiscript.github.io/
// @version      1.0
// @description  A Better List of Emojis
// @author       forester2015/coding-bot-1 & Wukong/KindaBadCoder
// @match        https://artofproblemsolving.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// ==/UserScript==

(function () {
  // This is the URL of the JSON emoji file
  // Use valid JSON! Go to https://jsonlint.com/ to validate
  // Make sure you have spaces before and after your emoji short-hand text
  // Make sure you include the whole URL for the second parameter
  // For exmaple, use https://i.imgur.com/xtwJIzL.png instead of i.imgur.com/xtwJIzL.png
  const emoji_json_url =
    "https://raw.githubusercontent.com/EmojiScript/main/main/emoji-list.json";

  String.prototype.cleanup = function () {
    if (
      this.replaceAll(":", "-")
        .replaceAll(";", "---")
        .replaceAll("(", "---")
        .replaceAll(")", "---")
        .replaceAll("!", "---")
        .replaceAll("|", "---")
        .replaceAll("?", "---")[0] == "-"
    ) {
      return (
        "AAAA" +
        this.replaceAll(":", "-")
          .replaceAll(";", "---")
          .replaceAll("(", "---")
          .replaceAll(")", "---")
          .replaceAll("!", "---")
          .replaceAll("|", "---")
          .replaceAll("?", "---")
      );
    } else {
      return this.replaceAll(":", "-")
        .replaceAll(";", "---")
        .replaceAll("(", "---")
        .replaceAll(")", "---")
        .replaceAll("!", "---")
        .replaceAll("|", "---")
        .replaceAll("?", "---");
    }
  };

  function submit(shortcuts) {
    if ($(".cmty-posting-environ-buttons > input").length) {
      $(".cmty-posting-environ-buttons > input")[1].onfocus = function () {
        $(".cmty-post-textarea").each(function (index) {
          for (var prop in shortcuts) {
            var post_content = $(".cmty-post-textarea")[index].value;
            $(".cmty-post-textarea")[index].value = post_content.replaceAll(
              prop,
              ` [img width=2]${shortcuts[prop]}[/img] `
            );
          }
        });
      };
    }
  }

  function emoji_click(shortcut) {
    const textarea_divs = document.querySelectorAll(".cmty-post-textarea");
    const current_textarea = textarea_divs[textarea_divs.length - 1];
    current_textarea.value += ` ${shortcut} `;
    current_textarea.focus();
  }

  function update_emojis(emojis) {
    const smiley_holders = document.querySelectorAll(
      ".cmty-posting-smiley-holder"
    );

    // make sure it's not null
    if (smiley_holders) {
      // loop through each smiley
      for (i = 0; i < smiley_holders.length; i++) {
        if (
          !smiley_holders[i].innerHTML.includes(
            `<span style="display:none;">Completed</span>`
          )
        ) {
          // remove existing emojis
          smiley_holders[i].innerHTML = "";

          // looop through json
          for (var key in emojis) {
            const value = emojis[key];
            smiley_holders[
              i
            ].innerHTML += `<img src="${value}" id="${key.cleanup()}" style="cursor: pointer; margin: 4px;">`;
          }

          // indication to show that it has completed
          smiley_holders[
            i
          ].innerHTML += `<span style="display:none;">Completed</span>`;

          const keys = Object.keys(emojis);
          // console.log(keys);
          keys.forEach((x) => {
            document
              .querySelector(`#${x.cleanup()}`)
              .addEventListener("click", function () {
                emoji_click(x);
              });
          });
        }
      }
    }
  }

  const main_interval = async () => {
    const fetched_data = await fetch(emoji_json_url);
    const emojis = await fetched_data.json();

    update_emojis(emojis);
    submit(emojis);
  };

  window.onload = setInterval(main_interval, 200);
})();
