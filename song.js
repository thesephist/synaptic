#!/usr/bin/env node

/* Project Synaptic 2.0: General Intelligence Project
 * Main thread build
 * Copyright Linus Lee 2015-2016, All rights reserved.
 *
 * For inquires please contact linus@thelifelongtraveler.com
 *
 */

var Syn = require("./synaptic.js");
var fs = require("fs");
// var midi = require("midi-note");

// global MIDI file object

// each neuron index associated with its key
Syn.keys = {
    0: "c",
    1: "d",
    2: "f",
    3: "g",
    4: "a",
    5: "x" // x marks the spot; the more the x in the next input, the closer it was
};

// this as array of arrays
// the AI should generate melody to some baseline
Syn.map = [
    [1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0],
];

Syn.actions = {
    "x": function() {
        mind.learn();
        console.log("Lesson acknowledged!");
    },
    
    "a": function() {
        console("A played");
    },
    
};

Syn.world.respond = function() {
    // resolve harmonies

    return 0;
}

// verbose for now
Syn.quiet = false;
Syn.cyclesPerResponse = 3;

// generate network
var neuronlist = [];
var mind = new Syn.Mind();

for (i = 0; i < Syn.scale; i++) {
    neuronlist.push(new Syn.Neuron(i, Syn.keys[i], mind));
};

mind.init(neuronlist);

mind.tick();



