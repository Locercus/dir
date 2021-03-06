#!/usr/bin/env node

const path = require('path');
const fs   = require('fs');

var dirname, programname;
var programs = {};
var code = "";

const LEFT  = '\u2190'
const UP    = '\u2191'
const RIGHT = '\u2192'
const DOWN  = '\u2193'
const END   = '\u2194'
const NL    = '\u2196'
const DOT   = '\u2197'

function main() {
    if(process.argv.length < 3) {
        console.error('Error: Missing operand');
        process.exit(1);
    }

    dirname = process.argv[2];
    programname = path.basename(path.normalize(dirname));

    if (!fs.lstatSync(dirname).isDirectory()) {
        console.error("Error: Operand isn't a directory");
        process.exit(1);
    }

    console.log('Reading files ...');

    var files = fs.readdirSync(dirname);

    for (var index in files) {
        var f = files[index];

        if (f === programname + ".js")
            continue;

        if (f.length != 1) {
            console.error("Error: %s isn't one character long", f);
            process.exit(1);
        }

        console.log("Reading %s ...", f);

        var c = fs.readFileSync(path.join(dirname, f), "utf8");
        var lines = c.split('\n');
        var program = [];

        lines.forEach(function(line) {
            program.push(line.split(''));
        });

        programs[f] = program;
    }

    console.log('Interpreting ...\n');

    var nextProgram = ["a", 0, 0, "init"];

    while (nextProgram != null)
        nextProgram = interpretProgram.apply(interpretProgram, nextProgram);
}

function interpretProgram(f, x, y, parent) {
    var c = '';

    if (f === DOT)
        c = '.';
    else if (f === NL)
        c = '\n';
    else if (parent != 'init')
        c = f;

    process.stdout.write(c);
    code += c;

    if (!(f in programs)) {
        console.error("\n\nError: Cannot find %s referenced by %s at (%s, %s)", f, parent, x, y);
        process.exit(1);
        return null;
    }

    var p = programs[f];

    if (y > p.length - 1 || x > p[y].length - 1) {
        console.error("\n\nError: %s has no character at (%s, %s) as referenced by %s", f, x, y, parent);
        process.exit(1);
        return null;
    }

    var arrow = p[y][x];

    if (arrow === LEFT)
        x--;
    else if (arrow === RIGHT)
        x++;
    else if (arrow === UP)
        y--;
    else if (arrow === DOWN)
        y++;
    else if (arrow === END) {
        console.log('\n');
        writeFile();
        process.exit(1);
        return null;
    }
    else {
        console.error("\n\nError: Expected (%s, %s) in %s to be %s, %s, %s, %s or %s. Found %s", x, y, f, UP, RIGHT, DOWN, LEFT, END, arrow);
        process.exit(1);
        return null;
    }

    if (y > p.length - 1 || x > p[y].length - 1) {
        console.error("\n\nError: Arrow at (%s, %s) in %s points to nothing", x, y, f);
        process.exit(1);
        return null;
    }

    var i = p[y][x];

    if (i in [END, UP, DOWN, LEFT, RIGHT]) {
        console.error("\n\nError: Expected instruction at (%s, %s) in %s, found %s", x, y, f, i);
        process.exit(1);
        return null;
    }

    if (i === f)
        y++;

    return [i, x, y, f];
}

function writeFile() {
    var p = path.join(dirname, programname + '.js');
    var output = '#!/usr/bin/env node\n\n/* Generated by dir https://github.com/Locercus/dir */\n\n' + code;

    fs.writeFileSync(p, output);
    fs.chmodSync(p, '744'); // Only works on *nix

    console.error("Saved as %s", p)
}

main();
console.log('');
