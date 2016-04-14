#!/usr/bin/env node

/* Project Synaptic 2.0: General Intelligence Project
 * Copyright Linus Lee 2015, All rights reserved.
 *
 * For inquires please contact linus@thelifelongtraveler.com
 *
 */

// each neuron index associated with its key
var keys = {
    0: "0",
    1: "1",
    2: "f",
};

var rkeys = {},
    scale = 0;

for (i in keys) {
    if (!Object.prototype.hasOwnProperty.call(keys, i)) {
        continue;
    }

    rkeys[keys[i]] = i;

    scale += 1;
};

// init global varibles
var threshold = 2, // firing threshold
    pace = 1.3, // learning pace, which 1 being static, nothing learned
    depreciation = 0.8, // how fast individual neurons (and thus the system) loses neurotransmitters
    variation = 0.25, // neuron firing perturbation
    n_dist = 1.0, // neurontransmitter distribution density, a float around the value of 1
    neuronlist,
    mind;

// define neuron connections as 2D array
var map = [
    [0, 1, 1],
    [1, 0, 1],
    [0, 0, 0]
];

// Neuron object
function Neuron() {
    
    this.state = 0.0;

    this.s = [];
    
    // this creates index, key, c
    this.init = function(index, key) {
        this.index = index;
        this.key = key;
        this.c = map[index];

        // counting connections
        liveConnections = 0;
        this.c.forEach(function(link) {
            if (link) {
                liveConnections ++ ;
            }
        });

        // initialize this.s
        for (n = 0; n < scale; n++) {
            if (this.c[n]) {
                this.s.push(parseFloat(1) / liveConnections);
            } else {
                this.s.push(0.0);
            }
        }

    };
    
    this.on = function(val) {
        this.state += val;
    };

    this.clear = function() {
        this.state = 0.0;
    };

    this.learn = function() {
        for (i = 0; i < scale; i++) {
            this.s[i] *= n_dist;
        }
    };

    this.fire = function() {
        if (this.state >= threshold) {
            
            // state * weight added to neuron state
            for (i = 0; i < scale; i++) {
                if (this.c[i] == "1") {
                    click = this.state * this.s[i] + Math.random() * variation;
                    mind.network[i].on(click);
                }
            }

            // clear the neuron activation state
            this.clear();

            // learn for this neuron
            this.learn();

            // output (dev purposes)
            console.log("Fired: " + this.key);
        }
                    
    };

};

function Mind() {
    
    this.init = function(list) {
        this.network = list;
    };

    // set neurons from input on
    this.cycle = function(input) {
        
        if (input) {
            var self = this;
            input.split("").forEach(function(id) {
                if (id != '\n') {
                    self.network[parseInt(rkeys[id])].on(0.75); // this 0.75 is ... arbitrary
                }
            });

            this.network.forEach(function(neuron) {
                neuron.fire();
            });
        }

    };

    this.learn = function(response) {
        // response is a variable from -1 to 1 inclusive
        // this function is also super arbitrary, for now

        n_dist *= 2 / (1 + Math.pow(Math.E, -5 * response)) - 1;
    };

    this.tick = function() {
        
        console.log("Tick...");
        var self = this;

        var input = "";


        // receive input
        process.stdin.resume();
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', function(data) {
            
            input = data;

            self.cycle(input);

            // useful debugging log; don't delete
            mind.network.forEach(function(neuron) {
                console.log(neuron.key + " | " + neuron.state);
            });

            //world.simulate();
            //self.learn(world.respond());

        });

    };

};

// generate netwiork
var neuronlist = [];
for (i = 0; i < scale; i++) {
    neuronlist.push(new Neuron());
    neuronlist[i].init(i, keys[i]);
};

mind = new Mind();
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

