// ==UserScript==
// @name         Gmail - Expand All Messages
// @description  Automatically expand all Gmail messages after a thread is opened.
// @version      0.2.0
// @match        *://mail.google.com/mail/u/*
// @icon         https://www.google.com/gmail/about/static/favicon.ico
// @run-at       document-idle
// @homepage     https://github.com/warren-bank/crx-Gmail-auto-expand-messages/tree/greasemonkey-userscript
// @supportURL   https://github.com/warren-bank/crx-Gmail-auto-expand-messages/issues
// @downloadURL  https://github.com/warren-bank/crx-Gmail-auto-expand-messages/raw/greasemonkey-userscript/greasemonkey-userscript/Gmail-auto-expand-messages.user.js
// @updateURL    https://github.com/warren-bank/crx-Gmail-auto-expand-messages/raw/greasemonkey-userscript/greasemonkey-userscript/Gmail-auto-expand-messages.user.js
// @namespace    warren-bank
// @author       Warren Bank
// @copyright    Warren Bank
// ==/UserScript==

// https://www.chromium.org/developers/design-documents/user-scripts

var user_options = {
  "script_injection_delay_ms": 0,
  "expand_interval_delay_ms":  2500,
  "scroll_timeout_delay_ms":   2500,
  "scroll_to_last_message":    true
}

var payload = function(){
  const perform_scroll = () => {
    if (window.scroll_to_last_message) {
      setTimeout(() => {
        const container = document.getElementById(':3')

        if (container) {
          container.scrollTo(0, container.scrollHeight)
        }
      }, window.scroll_timeout_delay_ms)
    }
  }

  const expand_all = () => {
    const el = document.querySelector('div[role="button"][data-tooltip="Expand all"]')

    if (el && (el.parentNode.style.display !== 'none')) {
      el.click()
      perform_scroll()
    }
  }

  setInterval(
    expand_all,
    window.expand_interval_delay_ms
  )
}

var get_hash_code = function(str){
  var hash, i, char
  hash = 0
  if (str.length == 0) {
    return hash
  }
  for (i = 0; i < str.length; i++) {
    char = str.charCodeAt(i)
    hash = ((hash<<5)-hash)+char
    hash = hash & hash  // Convert to 32bit integer
  }
  return Math.abs(hash)
}

var inject_function = function(_function){
  var inline, script, head

  inline = _function.toString()
  inline = '(' + inline + ')()' + '; //# sourceURL=crx_extension.' + get_hash_code(inline)
  inline = document.createTextNode(inline)

  script = document.createElement('script')
  script.appendChild(inline)

  head = document.head
  head.appendChild(script)
}

var inject_options = function(){
  var _function = `function(){
    window.expand_interval_delay_ms = ${user_options['expand_interval_delay_ms']}
    window.scroll_timeout_delay_ms  = ${user_options['scroll_timeout_delay_ms']}
    window.scroll_to_last_message   = ${user_options['scroll_to_last_message']}
  }`
  inject_function(_function)
}

var bootstrap = function(){
  inject_options()
  inject_function(payload)
}

setTimeout(
  bootstrap,
  user_options['script_injection_delay_ms']
)
