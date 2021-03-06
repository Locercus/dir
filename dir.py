#!/usr/bin/env python2
# Encoding: utf-8

import sys, os, stat

dirname = u""
programname = u""
programs = {}
code = u""

LEFT  = u'←'
RIGHT = u'→'
UP    = u'↑'
DOWN  = u'↓'
END   = u'↔'
DOT   = u'↗'
NL    = u'↖'

def main():
    global dirname, programname

    if len(sys.argv) < 2:
        print "Error: Missing operand"
        sys.exit(1)

    dirname = sys.argv[1].decode("utf-8")
    programname = os.path.basename(os.path.normpath(dirname))

    if not os.path.isdir(dirname):
        print "Error: Operand isn't a directory"
        sys.exit(1)

    print "Reading files ..."

    files = os.listdir(dirname)

    for f in files:
        if f == programname + ".js":
            continue

        if(len(f) != 1):
            print "Error: %s isn't one character long" % f
            sys.exit(1)

        print "Reading %s ..." % f

        with open(os.path.join(dirname, f), 'r') as c:
            lines = c.read().decode("utf-8").splitlines()
            program = []
            for line in lines:
                program.append([c for c in line])

            programs[f] = program

    print "Interpreting ...\n"

    nextProgram = ("a", 0, 0, "init")
    while nextProgram != None:
        nextProgram = interpretProgram(*nextProgram)


def interpretProgram(f, x, y, parent):
    global code

    char = ''
    if f == DOT:
        char = '.'
    elif f == NL:
        char = '\n'
    elif parent != "init":
        char = f

    sys.stdout.write(char)
    code += char

    if not f in programs:
        print "\n\nError: Cannot find %s referenced by %s at (%s, %s)" % (f, parent, x, y)
        sys.exit(1)
        return None

    p = programs[f]

    if y > len(p) - 1 or x > len(p[y]) - 1:
        print "\n\nError: %s has no character at (%s, %s) as referenced by %s" % (f, x, y, parent)
        sys.exit(1)
        return None

    arrow = p[y][x]

    if arrow == LEFT:
        x -= 1
    elif arrow == RIGHT:
        x += 1
    elif arrow == UP:
        y -= 1
    elif arrow == DOWN:
        y += 1
    elif arrow == END:
        print "\n"
        writeFile()
        sys.exit(0)
        return None
    else:
        print u"\n\nError: Expected (%s, %s) in %s to be %s, %s, %s, %s or %s. Found %s" % (x, y, f, UP, RIGHT, DOWN, LEFT, END, arrow)
        sys.exit(1)
        return None

    if y > len(p) - 1 or x > len(p[y]) - 1:
        print "\n\nError: Arrow at (%s, %s) in %s points to nothing" % (x, y, f)
        sys.exit(1)
        return None

    i = p[y][x]

    if i in [END, UP, DOWN, LEFT, RIGHT]:
        print "\n\nError: Expected instruction at (%s, %s) in %s, found %s" % (x, y, f, i)
        sys.exit(1)
        return None

    if i == f:
        y += 1

    return (i, x, y, f)

def writeFile():
    path = os.path.join(dirname, programname + ".js")

    with open(path, 'w') as output:
        output.write("#!/usr/bin/env node\n\n/* Generated by dir https://github.com/Locercus/dir */\n\n" + code)

    st = os.stat(path)
    os.chmod(path, st.st_mode | stat.S_IEXEC) # Only works on *nix

    print "Saved as %s" % path


main()
print
