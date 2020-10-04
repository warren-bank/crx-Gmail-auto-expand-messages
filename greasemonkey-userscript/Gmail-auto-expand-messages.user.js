// ==UserScript==
// @name         Gmail - Expand All Messages
// @description  Automatically expand all Gmail messages after a thread is opened.
// @version      0.1.0
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
  "script_injection_delay_ms": 0
}

var payload = function(){
  const expand_all = () => {
    const el = document.querySelector('div[role="button"][data-tooltip="Expand all"]')

    if (el && (el.parentNode.style.display !== 'none'))
      el.click()
  }

  setInterval(
    expand_all,
    2500
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

var bootstrap = function(){
  inject_function(payload)
}

setTimeout(
  bootstrap,
  user_options['script_injection_delay_ms']
)
