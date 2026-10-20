#!/bin/sh
# Tek hastalıklı klinik kart → uyarı → Git akışını test eder (koyu mod)
cd "$(dirname "$0")/.." || exit 1
STEPS='[
 {"eval":"App.open(\"step\",{pw:\"glikoliz\",idx:2})"},{"wait":700},
 {"eval":"document.querySelector(\".tab-scene.is-active .page:last-child .pw-clin\").scrollIntoView({block:\"center\"})"},
 {"tap":".tab-scene.is-active .page:last-child .pw-clin-more"},{"wait":300},
 {"eval":"!document.querySelector(\".tab-scene.is-active .page:last-child .pw-clin-full\").hidden"},
 {"tap":".tab-scene.is-active .page:last-child .pw-clin-title"},{"wait":600},
 {"shot":"shots/k4.png"},
 {"tap":".alert-btn.is-default"},{"wait":900},
 {"eval":"[App.current.id, App.topPage().spec.title, document.querySelectorAll(\".alert\").length]"}
]'
node tools/shot.js - --dark --steps "$STEPS"
