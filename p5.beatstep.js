// thanks to dbarrett: https://editor.p5js.org/dbarrett/sketches/HJhBG-LI7

WebMidi.enable()
  .then(onEnabled)
  .catch((err) => alert(err));

function onEnabled() {
  // Inputs
  WebMidi.inputs.forEach((input) =>
    console.log(input.manufacturer, input.name)
  );

  // Outputs
  WebMidi.outputs.forEach((output) =>
    console.log(output.manufacturer, output.name)
  );
}

// dial ctrl values as encoded into BeatStep firmware.
dialMap = [10, 74, 71, 76, 77, 93, 73, 75, 114, 18, 19, 16, 17, 91, 79, 72];
let padMap = [44, 45, 46, 47, 48, 49, 50, 51, 36, 37, 38, 39, 40, 41, 42, 43];
class BeatStep {
  constructor(type) {
    this.device = type;
    this.init(this);
    this.avg = 33;
    this.dialsHis = [];
    this.dialsAvg = [];
    this.encoder = 0;
    this.dials = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.notesOn = [];
    this.MIDIon = [];
    this.pads = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.play = 0;
    this.synth = false;
    this.print = false;
    this.stop = 0;
    this.initAvg();
    this.initDom();
  }
  initAvg() {
    for (let i = 0; i < 16; i++) {
      this.dialsHis[i] = new Array();
    }
  }
  updatePad(data) {
    let n = data[1];
    let v = data[2];
    for (let i = 0; i < 16; i++) {
      if (n == padMap[i]) {
        this.pads[i] = v;
      }
    }
  }
  updateCtrl(data) {
    let n = data[1];
    let v = data[2];
    for (let i = 0; i < 16; i++) {
      if (n == dialMap[i]) {
        this.dials[i] = v;
      }
    }
    if (n == 7) {
      this.encoder = v;
    }
  }
  avgCtrl() {
    if (this.avg > 1) {
      for (let i = 0; i < 16; i++) {
        this.dialsHis[i].push(this.dials[i]);
        if (this.dialsHis[i].length >= this.avg) {
          this.dialsHis[i].splice(0, 1);
        }

        let t = 0;
        for (let s = 0; s < this.dialsHis[i].length; s++) {
          t += this.dialsHis[i][s];
        }
        t /= this.dialsHis[i].length;
        this.dialsAvg[i] = t;
      }
    }
  }
  updateSeq(data) {
    let n = data[1];
    let v = data[2];
  }
  initDom() {
    this.dialsDom = createP("");
    this.notes = createP("");
  }
  display() {
    this.dialsDom.html("dials = " + this.dials);
    //  this.dialsDom.html("notes on = " + this.notesOn);
  }
  init(ref) {
    WebMidi.enable(function (err) {
      //check if WebMidi.js is enabled

      if (err) {
        console.log("WebMidi could not be enabled.", err);
      } else {
        console.log("WebMidi enabled!");
      }
    })
      .then(function () {
        //name our visible MIDI input and output ports
        console.log("---");
        console.log("Inputs Ports: ");
        for (let i = 0; i < WebMidi.inputs.length; i++) {
          console.log(i + ": " + WebMidi.inputs[i].name);
        }
      })
      .then(function () {
        // take JS object argument to look for device name
        let index = WebMidi.inputs.findIndex((x) => x.name === ref.device);
        ref.inputSoftware = WebMidi.inputs[index];

        if (ref.inputSoftware) {
          console.log("connected to " + ref.device);
        } else {
          console.log("error connecting to MIDI device");
        }
      })
      .then(function () {
        // Listen to control change message on all channels
        ref.inputSoftware.addListener("controlchange", "all", function (e) {
          ref.ctrl = e;
          if (ref.print) {
            console.log(e.data);
          }
          ref.updateCtrl(e.data);
          ref.display();
        });

        // Listen to control change message on all channels
        ref.inputSoftware.addListener("noteon", "all", function (e) {
          ref.MIDIon.push(e.data[1]);
          ref.notesOn.push(e.note.identifier);
          if (e.data[1] >= 36 && e.data[1] <= 51) {
            ref.updatePad(e.data);
          }

          if (ref.print) {
            console.log(e.note.identifier, "on", e.message.channel);
            console.log(e.data[1], "on");
          }
          if (ref.synth) {
            polySynth.noteAttack(e.note.identifier, ref.synthVel);
          }
        });

        // Listen to control change message on all channels
        ref.inputSoftware.addListener("noteoff", "all", function (e) {
          if (ref.print) {
            console.log(e.note.identifier, "off", e.message.channel);

            console.log(e.data[1], "off");
          }
          let match = (element) => element == e.noteIdentifier;
          let index = ref.notesOn.findIndex(match);
          ref.notesOn.splice(index, 1);

          if (ref.synth) {
            polySynth.noteRelease(e.note.identifier, ref.synthVel);
          }

          match = (element) => element == e.data[1];
          index = ref.notesOn.findIndex(match);
          ref.MIDIon.splice(index, 1);
        });
      });

    //
    //end of MIDI setup
    //
  }
}