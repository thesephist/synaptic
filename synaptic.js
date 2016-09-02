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
        return 0;                 // range -1 to 1, inclusive
    },

    simulate: function() {
        return null;
    }

}

// exports defaults
exports.cycleTimer;
exports.quiet = false;            // quiet = true means no output besides neuron actions
exports.scale = 0;                // number of neurons in the network
exports.cyclesPerResponse = 1;    // how many firing cycles per response input? 
exports.threshold = 2;            // firing threshold
exports.decay = 0.95;             // how fast individual neurons (and thus the system) loses neurotransmitters
exports.variation = 0.25;         // neuron firing perturbation
exports.n_dist = 1.0;             // neurotransmitter distribution density, a float around the value of 1

// define neuron connections as 2D array of ints 0 and 1
// map[n] is the list of neurons the nth neuron can fire to
exports.map = [];

exports.generateRKeys = function() {

    for (i in exports.keys) {
        if (!Object.prototype.hasOwnProperty.call(exports.keys, i)) {
            continue;
        }

        exports.rkeys[exports.keys[i]] = i;
    };

}

// Neuron object
exports.Neuron = function(index, key, mind) {

    if (!(index !== undefined && key !== undefined && mind)) throw "Missing parameter for Neuron constructor!";
    if (!exports.map.length) throw "Synaptic neuron map missing!";

    this.state = 0;
    this.s = [];
    
    this.index = index;
    this.key = key;
    this.c = exports.map[index];
    this.mind = mind;

    // counting connections
    var liveConnections = 0;
    this.c.forEach(function(link) {
        if (link) {
            liveConnections ++;
        }
    });

    // initialize this.s
    exports.scale = exports.map.length;
    for (n = 0; n < exports.scale; n++) {
        if (this.c[n]) {
            this.s.push(1 / liveConnections);
        } else {
            this.s.push(0);
        }
    }

    // tie neuron output action to neuron
    if (exports.actions[this.key]) {
        this.action = exports.actions[this.key];
    }

    // class functions

    this.on = function(val) {
        this.state += val;
    };

    this.clear = function() {
        this.state = 0;
    };

    this.learn = function() {
        for (i = 0; i < exports.scale; i++) {
            this.s[i] *= exports.n_dist;
        }
    };

    this.fire = function() {
        if (this.state >= exports.threshold) {

            var tempstate = this.state;
            this.clear();

            // state * weight added to neuron state
            for (i = 0; i < exports.scale; i++) {
                if (this.c[i] == "1") {
                    click = tempstate * this.s[i] + Math.random() * exports.variation;
                    this.mind.network[i].on(click);
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

exports.Mind = function(list) {
  
    this.network = list; // if a neuron list is given, assign it in the constructor

    this.inputQueue = "";

    this.init = function(list) {
        this.network = list;
        exports.generateRKeys();

        if (exports.key == {}) {
            console.error("A key-value hash for neurons was note provided!");
        } else if (exports.map.length == 0) {
            console.error("An inter-neuron mapping array was not provided!");
        } else if (exports.rkeys == {}) {
            console.error("Reverse-lookup key hash was not provided!");
        }
    };

    this.importFrom = function(path) {
        if (!path) throw "No path was provided for data import!";

        console.log("Functionality in construction.");
    };

    this.export = function(path) {
        var content = JSON.stringify(this);
        
        if (path) {
            fs.writeFile(path, content, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(`Export to ${path} successful!`);
                }
            });
        } else {
            process.stdout.write(content);
        }
    };

    this.setInput = function(data, execute) {
        this.inputQueue = data; // should it be += ?
        if (execute) this.tick();
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

        this.network.forEach(neuron => neuron.fire());

        exports.n_dist *= exports.decay;
    };

    this.learn = function(response) {
        // response is a variable from -1 to 1 inclusive
        // this function is also super arbitrary, for now, as a logistical curve

        // TODO the status quo doesn't allow n_dist to come back up after death, 
        // when in reality an equilibrum should be maintained in the long run.

        if (response === undefined) throw "Response undefined!";
        exports.n_dist *= 1 / (1 + Math.pow(Math.E, -5 * response));
    };

    this.processCSV = function(data) {
        var rows = data.split("\n");
        var pair;
        
        rows.forEach(function(row) {
            pair = row.split(",");
            this.tick(pair[0], pair[1]);
        });
    };

    this.tick = function(string) {
        
        var self = this;

        var input = string || this.inputQueue;
        this.inputQueue = "";

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
                    self.network.forEach(neuron => console.log(neuron.key + " | " + neuron.state));
                }

                if (exports.cycleCounter == exports.cyclesPerResponse) {
                    clearInterval(exports.cycleTimer);
                }

                exports.cycleCounter ++;
            
            }, 800);
              
            if (!exports.quiet) console.log("N DIST: " + exports.n_dist);

            if (!exports.quiet) {
                console.log("Connection strengths");
                self.network.forEach(neuron => console.log(neuron.s));
            }

        });

    };

};

