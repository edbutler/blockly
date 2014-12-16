#!/usr/bin/env python

import errno, json, os, subprocess, sys

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), 'dist')

def mkdir_p(path):
    try:
        os.makedirs(path)
    except OSError as e:
        if e.errno == errno.EEXIST and os.path.isdir(path): pass
        else: raise

def check(code):
    if code != 0:
        raise Exception('step failed')

mkdir_p(OUTPUT_DIR)

def build_blockly():
    namespaces = [
        'Blockly',
        'Blockly.Msg.en',
        'Blockly.Blocks.colour',
        'Blockly.Blocks.lists',
        'Blockly.Blocks.logic',
        'Blockly.Blocks.loops',
        'Blockly.Blocks.math',
        'Blockly.Blocks.procedures',
        'Blockly.Blocks.text',
        'Blockly.Blocks.variables'
    ]

    fname = 'blockly.js'
    outf = 'dist/' + fname
    args = [
        'java', '-client', '-jar', 'compiler.jar',
        '--create_source_map=' + outf + '.map',
        '--source_map_format=V3',
        '--only_closure_dependencies=true',
        '--js=../closure-library/closure/**.js',
        '--js=core/**.js',
        '--js=blocks/**.js',
        '--js=msg/messages.js',
    ] + ['--closure_entry_point=' + x for x in namespaces]
    with open(outf, 'w') as f:
        check(subprocess.call(args, stdout=f))
        f.write("//# sourceMappingURL=%s.map\n" % fname)

build_blockly()

