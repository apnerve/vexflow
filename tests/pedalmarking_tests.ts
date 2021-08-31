// [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
// MIT License
//
// PedalMarking Tests

/* eslint-disable */
// @ts-nocheck

// TODO: Fix Error => Type 'Tickable' is not assignable to type 'StaveNote'.

import { Factory } from 'factory';
import { Tickable } from 'tickable';
import { TestOptions, VexFlowTests } from './vexflow_test_helpers';

const PedalMarkingTests = {
  Start(): void {
    QUnit.module('PedalMarking');

    const run = VexFlowTests.runTests;
    run('Simple Pedal 1', this.simple1);
    run('Simple Pedal 2', this.simple2);
    run('Simple Pedal 3', this.simple3);
    run('Release and Depress on Same Note 1', this.releaseDepress1);
    run('Release and Depress on Same Note 2', this.releaseDepress2);
    run('Custom Text 1', this.customTest1);
    run('Custom Text 2', this.customTest2);
  },

  simple1: createTest(withSimplePedal('text')),

  simple2: createTest(withSimplePedal('bracket')),

  simple3: createTest(withSimplePedal('mixed')),

  releaseDepress1: createTest(withReleaseAndDepressedPedal('bracket')),

  releaseDepress2: createTest(withReleaseAndDepressedPedal('mixed')),

  customTest1: createTest((factory, notes0, notes1) => {
    const pedal = factory.PedalMarking({
      notes: [notes0[0], notes1[3]],
      options: { style: 'text' },
    });
    pedal.setCustomText('una corda', 'tre corda');
    return pedal;
  }),

  customTest2: createTest((factory, notes0, notes1) => {
    const pedal = factory.PedalMarking({
      notes: [notes0[0], notes1[3]],
      options: { style: 'mixed' },
    });
    pedal.setCustomText('Sost. Ped.');
    return pedal;
  }),
};

//#region Helper Functions

function createTest(makePedal: (f: Factory, v1: Tickable[], v2: Tickable[]) => void) {
  return (options: TestOptions) => {
    const f = VexFlowTests.makeFactory(options, 550, 200);
    const score = f.EasyScore();

    const stave0 = f.Stave({ width: 250 }).addTrebleGlyph();
    const voice0 = score.voice(score.notes('b4/4, b4, b4, b4[stem="down"]', { stem: 'up' }));
    f.Formatter().joinVoices([voice0]).formatToStave([voice0], stave0);

    const stave1 = f.Stave({ width: 260, x: 250 });
    const voice1 = score.voice(score.notes('c4/4, c4, c4, c4', { stem: 'up' }));
    f.Formatter().joinVoices([voice1]).formatToStave([voice1], stave1);

    makePedal(f, voice0.getTickables(), voice1.getTickables());

    f.draw();

    ok(true, 'Must render');
  };
}

function withSimplePedal(style: string) {
  return (factory: Factory, notes0: Tickable[], notes1: Tickable[]) =>
    factory.PedalMarking({
      notes: [notes0[0], notes0[2], notes0[3], notes1[3]],
      options: { style },
    });
}

function withReleaseAndDepressedPedal(style: string) {
  return (factory: Factory, notes0: Tickable[], notes1: Tickable[]) =>
    factory.PedalMarking({
      notes: [notes0[0], notes0[3], notes0[3], notes1[1], notes1[1], notes1[3]],
      options: { style },
    });
}

//#endregion Helper Functions

export { PedalMarkingTests };
