#!/usr/bin/env node

/* Project Synaptic 2.0: General Intelligence Project
 * Main thread build
 * Copyright Linus Lee 2015-2016, All rights reserved.
 *
 * For inquires please contact linus@thelifelongtraveler.com
 *
 */

var Syn = require("../synaptic.js");

// each neuron index associated with its key
Syn.keys = {
};

// this as array of arrays
Syn.map = [
];

Syn.actions = {
};

// no debugging messages are needed here...
Syn.quiet = true;
Syn.cyclesPerResponse = 3;

// generate netwiork
var neuronlist = [];
var mind = new Syn.Mind();

for (i = 0; i < Syn.scale; i++) {
    neuronlist.push(new Syn.Neuron(i, Syn.keys[i], mind));
};

mind.init(neuronlist);

mind.tick();

/* World design as JS object
 *
 * init: this.benefit: function
 *       this.harm: function
 *
 * simulate: function
 * respond: function
 */

