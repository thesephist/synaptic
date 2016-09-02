#!/usr/bin/env node

/* Project Synaptic 2.0: General Intelligence Project
 * Main thread build
 * Copyright Linus Lee 2015-2016, All rights reserved.
 *
 * For inquires please contact linus@thelifelongtraveler.com
 *
 */

var AI = require("../s.js"); // doesn't initiate the tick process
var response;
AI.Syn.world.respond = function() {
    return response;
}

const n = 20; // iterations
const stepTypes = ["w", "a", "s", "d"];

function makeSteps() {
    var steps = "";
    
    for (i = 0; i < 20; i ++) {
        steps += stepTypes[parseInt(Math.random() * 4)];
    }

    return steps;
}

var trainer;
trainer = setInterval(function() {

    console.log("Run number", i + 1);

    AI.mind.motion = "";

    AI.mind.setInput(makeSteps(), true);

    // TODO need to delay this learning action. How does biology do this in real time?
    setTimeout(function() {
        AI.mind.learn(AI.Syn.world.respond());
    }, 800);
    
    if (!n) clearInterval(trainer);
    n--;

}, 1000);






