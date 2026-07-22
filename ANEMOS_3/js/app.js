/*
 * ==========================================================
 * ANEMOS 3.0
 * App Bootstrap
 * ==========================================================
 */

import { createEmptyBreath } from "./model.js";

const App = {

    currentBreath: null,

    init() {

        this.currentBreath = createEmptyBreath();

        console.log("================================");
        console.log("ANEMOS 3.0");
        console.log("Applicazione avviata");
        console.log("================================");

        console.log(this.currentBreath);

    }

};

document.addEventListener("DOMContentLoaded", () => {

    App.init();

});
