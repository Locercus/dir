dir
===

dir is a 2D, directory-based esolang.

Each program consists of a directory with the program's name containing a file for each unique character in the program (and `a` if not present in program's code).

Every program starts in a file named `a` by reading the first character on the first line. That character is expected to be an arrow (←, ↑, → or ↓) pointing to a character. That character is the first character of the program. The interpreter then goes into the file by the name of the character and looks for an arrow at the same coordinates as the character in the referring file.

If a file refers to itself (for example as seen in `l` in the hello world example), the y coordinate will be incremented by 1.

Please note that you're limited to using the characters that your operating system allows in filenames. However, to achieve support for all ASCII characters on *nix, you can simply write ↗ to use a dot (as *nix doesn't allow files named just `.`).

This process continues until an ↔ is encountered at which point the interpreter writes the code to a file by the same name as the directory appended by `.js`

While dir in itself isn't a language, but merely a medium for another language and therefore would work with any language, I've chosen JavaScript as the language used for no particular reason (other than the fact that Python would suck because of indentation).

A very simple program that simply outputs `hi` could be written as:

**File: a**
```
→h
```

**File: h**
```
i←
```

**File: i**
```
↔
```

Naturally, larger code projects that reuse the same character multiple times will get very complicated very quickly.

For an overly complicated hello world-example, see the the directory named `hello_world` in this repo.

## Compiling and testing
To compile, simply run `./dir.py <DIRECTORY_NAME>` with Python (or execute it on *nix). Then to run, use `node <DIRECTORY_NAME>/<DIRECTORY_NAME>.js`

To automate the above process, on *nix you can simply use the `buildrun` shell script provided by running `./buildrun <DIRECTORY_NAME>`.

