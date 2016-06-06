/* Project Synaptic 2.0: General Intelligence Project
 * NodeJS / JavaScript module version
 * Copyright Linus Lee 2015-2016, All rights reserved.
 *
 * For inquires please contact linus@thelifelongtraveler.com
 *
 */

var exports = module.exports = {};

// init global varibles
exports.keys = {};
exports.rkeys = {};

// define neuron connections as 2D array of ints 0 and 1
// map[n] is the list of neurons the nth neuron can fire to
exports.map = [];

exports.actions = {
    // JSON hash, links keys to action functions
    // this includes 
};

exports.world = {
    
    respond: function() {
        return null;
    },

    simulate: function() {
        return null;
    }

}


exports.cycleTimer;

// exports.quiet = true means no output besides neuron fire actions
exports.quiet = false;

exports.scale = 0;
exports.cyclesPerResponse = 1;
exports.threshold = 2, // firing threshold
exports.decay = 0.95, // how fast individual neurons (and thus the system) loses neurotransmitters
exports.variation = 0.25, // neuron firing perturbation
exports.n_dist = 1.0, // neurontransmitter distribution density, a float around the value of 1

// define neuron connections as 2D array of ints 0 and 1
// map[n] is the list of neurons the nth neuron can fire to
exports.map = [];

exports.generateRKeys = function() {

    for (i in exports.keys) {
        if (!Object.prototype.hasOwnProperty.call(exports.keys, i)) {
            continue;
        }

        exports.rkeys[exports.keys[i]] = i;

        exports.scale += 1;
    };

}

// Neuron object
exports.Neuron = function() {
    
    this.state = 0.0;

    this.s = [];
    
    // this creates index, key, c
    this.init = function(index, key) {
        this.index = index;
        this.key = key;
        this.c = exports.map[index];

        // counting connections
        liveConnections = 0;
        this.c.forEach(function(link) {
            if (link) {
                liveConnections ++ ;
            }
        });

        // initialize this.s
        for (n = 0; n < exports.scale; n++) {
            if (this.c[n]) {
                this.s.push(parseFloat(1) / liveConnections);
            } else {
                this.s.push(0.0);
            }
        }

        // tie neuron output action to neuron
        if (exports.actions[this.key]) {
            this.action = exports.actions[this.key];
        }

    };
    
    this.on = function(val) {
        this.state += val;
    };

    this.clear = function() {
        this.state = 0.0;
    };

    this.learn = function() {
        for (i = 0; i < exports.scale; i++) {
            this.s[i] *= exports.n_dist;
        }
    };

    this.fire = function() {
        if (this.state >= exports.threshold) {

            tempstate = this.state;

            // clear the neuron activation state
            this.clear();

            // state * weight added to neuron state
            for (i = 0; i < exports.scale; i++) {
                if (this.c[i] == "1") {
                    click = tempstate * this.s[i] + Math.random() * exports.variation;
                    mind.network[i].on(click);
                }

            }

            // output (dev purposes)
            if (!exports.quiet) {
                console.log(": " + this.key + " =>");
            }

            if (this.action ) {
                for (i = 0; i < this.state; i ++) {
                    this.action();
                }
            }

            // clear it one more time, because the action was fired
            this.clear();

            // learn for this neuron
            this.learn();
        }
                    
    };

};

exports.Mind = function() {
    
    this.init = function(list) {
        this.network = list;
        if (exports.key == {}) {
            console.error("A key-value hash for neurons was note provided!");
        } else if (exports.map.length == 0) {
            console.error("An inter-neuron mapping array was not provided!");
        } else if (exports.rkeys == {}) {
            console.error("Reverse-lookup key hash was not provided!");
        }
    };

    // set neurons from input on
    this.cycle = function(input) {
        
        if (input) {
            var self = this;
            input.split("").forEach(function(id) {
                if (id != '\n') {
                    self.network[parseInt(exports.rkeys[id])].on(0.75); // this 0.75 is ... arbitrary
                }
            });
        }

        this.network.forEach(function(neuron) {
            neuron.fire();
        });

        exports.n_dist *= exports.decay;

    };

    this.learn = function(response) {
        // response is a variable from -1 to 1 inclusive
        // this function is also super arbitrary, for now, as a logistical curve


        // TODO: Sometimes this code generates NaN as the new neuron.s[i]
        // needs to be fixed!
        exports.n_dist *= 2 / (1 + Math.pow(Math.E, -5 * response)) - 1;
    };

    this.tick = function(string) {
        
        exports.generateRKeys();

        var self = this;

        var input = string || "";

        // receive input
        process.stdin.resume();
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', function(data) {
            
            input += data;

            // this also includes the neuron.fire() actions
            self.cycle(input);
            exports.cycleCounter = 1;
            exports.cycleTimer = setInterval(function() {
            
                self.cycle();
            
                if (!exports.quiet) {
                    mind.network.forEach(function(neuron) {
                        console.log(neuron.key + " | " + neuron.state);
                    });
                }

                if (exports.cycleCounter == exports.cyclesPerResponse) {
                    clearInterval(exports.cycleTimer);
                }

                exports.cycleCounter ++;
            
            }, 800);
               
            exports.world.simulate();
            
            response = exports.world.respond();
            if (!exports.quiet) console.log("World response: " + response.toString());
            self.learn(response);

            if (!exports.quiet) console.log("N DIST: " + exports.n_dist.toString());

            if (!exports.quiet) {
                console.log("Connection strenghts");
                self.network.forEach(function(neuron) {
                    console.log(neuron.s);
                });
                
            }

        });

    };

};

