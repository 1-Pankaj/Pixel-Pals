/* ============================================================
 * PIXEL PALS — sprite engine
 * ------------------------------------------------------------
 * All pets are hand-authored pixel art on a 32x32 grid.
 * Body/head maps are written as LEFT HALVES (16 px) and mirrored,
 * so pets are perfectly symmetric by construction.
 * Asymmetric pieces (tails, gloss, sprout) are separate overlays.
 * Rows are built with row() spans so lengths are provably right.
 * ============================================================ */
(function () {
  'use strict';

  /* ---------- tiny span-builder: row(['.',4],['o',1]) -> "....o" ---------- */
  function row() {
    var out = '';
    for (var i = 0; i < arguments.length; i++) {
      var sp = arguments[i];
      out += sp[0].repeat(sp[1]);
    }
    return out;
  }
  var _ = function (n) { return ['.', n]; };

  /* ============================================================
   * PET DEFINITIONS
   * ============================================================ */

  /* ---------------- MOCHI — orange tabby cat ---------------- */
  var MOCHI_HEAD = [
    row(_(16)),
    row(_(16)),
    row(_(16)),
    row(_(6), ['o', 2], _(8)),                       // ear tip
    row(_(5), ['o', 1], ['f', 2], ['o', 1], _(7)),   // ear
    row(_(4), ['o', 1], ['p', 1], ['f', 3], ['o', 1], _(6)),
    row(_(4), ['o', 1], ['p', 2], ['f', 3], ['o', 1], ['o', 5]), // ear + dome outline
    row(_(4), ['o', 1], ['p', 2], ['f', 3], ['o', 1], ['f', 5]),
    row(_(5), ['o', 1], ['f', 5], ['s', 2], ['f', 2], ['s', 1]), // forehead stripes
    row(_(5), ['o', 1], ['f', 5], ['s', 2], ['f', 2], ['s', 1]),
    row(_(4), ['o', 1], ['f', 11]),
    row(_(3), ['o', 1], ['f', 12]),
    row(_(3), ['o', 1], ['s', 2], ['f', 9], ['n', 1]),           // cheek stripe + nose top
    row(_(3), ['o', 1], ['s', 2], ['f', 7], ['w', 2], ['n', 1]), // cheek stripe + muzzle
    row(_(3), ['o', 1], ['f', 2], ['p', 2], ['f', 4], ['w', 4]), // blush
    row(_(4), ['o', 1], ['f', 1], ['p', 2], ['f', 3], ['w', 5]), // blush
    row(_(4), ['o', 1], ['f', 6], ['w', 5]),
    row(_(5), ['o', 1], ['f', 6], ['w', 4]),
    row(_(6), ['o', 1], ['f', 9]),
    row(_(8), ['o', 1], ['f', 7]),
    row(_(11), ['o', 5]),                                        // chin
    row(_(16)), row(_(16)), row(_(16)), row(_(16)),
    row(_(16)), row(_(16)), row(_(16)), row(_(16)),
    row(_(16)), row(_(16)), row(_(16))
  ];

  var MOCHI_BODY = [
    row(_(16)), row(_(16)), row(_(16)), row(_(16)),
    row(_(16)), row(_(16)), row(_(16)), row(_(16)),
    row(_(16)), row(_(16)), row(_(16)), row(_(16)),
    row(_(16)), row(_(16)), row(_(16)), row(_(16)),
    row(_(16)), row(_(16)), row(_(16)),
    row(_(5), ['o', 1], ['f', 10]),                  // shoulders
    row(_(5), ['o', 1], ['f', 10]),
    row(_(4), ['o', 1], ['f', 6], ['w', 5]),         // haunches + belly
    row(_(4), ['o', 1], ['f', 6], ['w', 5]),
    row(_(4), ['o', 1], ['f', 6], ['w', 5]),
    row(_(4), ['o', 1], ['f', 6], ['w', 5]),
    row(_(4), ['o', 1], ['f', 6], ['w', 5]),
    row(_(5), ['o', 1], ['f', 5], ['w', 5]),
    row(_(6), ['o', 1], ['f', 4], ['w', 5]),
    row(_(7), ['o', 1], ['w', 7], ['o', 1]),         // paws
    row(_(7), ['o', 9]),                             // bottom
    row(_(16)), row(_(16))
  ];

  var MOCHI_TAIL_A = [
    row(_(7), ['o', 2], _(1)),
    row(_(6), ['o', 1], ['f', 2], ['o', 1]),
    row(_(6), ['o', 1], ['f', 2], ['o', 1]),
    row(_(5), ['o', 1], ['f', 2], ['o', 1], _(1)),
    row(_(5), ['o', 1], ['f', 2], ['o', 1], _(1)),
    row(_(4), ['o', 1], ['f', 2], ['o', 1], _(2)),
    row(_(4), ['o', 1], ['f', 2], ['o', 1], _(2)),
    row(_(3), ['o', 1], ['f', 2], ['o', 1], _(3)),
    row(_(3), ['o', 1], ['f', 2], ['o', 1], _(3)),
    row(_(2), ['o', 1], ['f', 2], ['o', 1], _(4)),
    row(_(2), ['o', 1], ['f', 2], ['o', 1], _(4)),
    row(_(2), ['o', 1], ['f', 2], ['o', 1], _(4)),
    row(_(2), ['o', 1], ['f', 1], ['o', 1], _(5)),
    row(_(2), ['o', 3], _(5))
  ];
  var MOCHI_TAIL_B = [
    row(_(8), ['o', 2]),
    row(_(7), ['o', 1], ['f', 1], ['o', 1]),
    row(_(7), ['o', 1], ['f', 1], ['o', 1]),
    row(_(6), ['o', 1], ['f', 2], ['o', 1]),
    row(_(6), ['o', 1], ['f', 2], ['o', 1]),
    row(_(5), ['o', 1], ['f', 2], ['o', 1], _(1)),
    row(_(5), ['o', 1], ['f', 2], ['o', 1], _(1)),
    row(_(4), ['o', 1], ['f', 2], ['o', 1], _(2)),
    row(_(4), ['o', 1], ['f', 2], ['o', 1], _(2)),
    row(_(3), ['o', 1], ['f', 2], ['o', 1], _(3)),
    row(_(3), ['o', 1], ['f', 2], ['o', 1], _(3)),
    row(_(3), ['o', 1], ['f', 2], ['o', 1], _(3)),
    row(_(3), ['o', 1], ['f', 1], ['o', 1], _(4)),
    row(_(3), ['o', 3], _(4))
  ];

  /* ---------------- BISCUIT — shiba inu ---------------- */
  var BISCUIT_HEAD = [
    row(_(16)), row(_(16)),
    row(_(7), ['o', 2], _(7)),                                 // tall pointy ear tip
    row(_(6), ['o', 1], ['f', 2], ['o', 1], _(6)),
    row(_(6), ['o', 1], ['p', 1], ['f', 2], ['o', 1], _(5)),
    row(_(5), ['o', 1], ['p', 2], ['f', 3], ['o', 1], _(4)),
    row(_(5), ['o', 1], ['p', 2], ['f', 3], ['o', 5]),         // ear merges with dome
    row(_(5), ['o', 1], ['f', 10]),                            // ear base / head fur
    row(_(6), ['o', 1], ['f', 9]),
    row(_(5), ['o', 1], ['f', 10]),
    row(_(4), ['o', 1], ['f', 4], ['w', 2], ['f', 5]),         // cream brow
    row(_(3), ['o', 1], ['f', 5], ['w', 2], ['f', 4]),         // cream brow
    row(_(3), ['o', 1], ['f', 12]),
    row(_(3), ['o', 1], ['f', 7], ['w', 4], ['n', 1]),         // muzzle + nose
    row(_(3), ['o', 1], ['f', 1], ['p', 2], ['f', 3], ['w', 5], ['n', 1]), // blush
    row(_(3), ['o', 1], ['f', 1], ['p', 2], ['f', 2], ['w', 6], ['n', 1]), // blush
    row(_(4), ['o', 1], ['f', 2], ['w', 9]),
    row(_(5), ['o', 1], ['f', 3], ['w', 7]),
    row(_(6), ['o', 1], ['f', 9]),
    row(_(8), ['o', 1], ['f', 7]),
    row(_(11), ['o', 5]),
    row(_(16)), row(_(16)), row(_(16)), row(_(16)),
    row(_(16)), row(_(16)), row(_(16)), row(_(16)),
    row(_(16)), row(_(16)), row(_(16))
  ];

  var BISCUIT_BODY = [
    row(_(16)), row(_(16)), row(_(16)), row(_(16)),
    row(_(16)), row(_(16)), row(_(16)), row(_(16)),
    row(_(16)), row(_(16)), row(_(16)), row(_(16)),
    row(_(16)), row(_(16)), row(_(16)), row(_(16)),
    row(_(16)), row(_(16)), row(_(16)),
    row(_(5), ['o', 1], ['f', 10]),
    row(_(5), ['o', 1], ['f', 10]),
    row(_(4), ['o', 1], ['f', 6], ['w', 5]),
    row(_(4), ['o', 1], ['f', 6], ['w', 5]),
    row(_(4), ['o', 1], ['f', 6], ['w', 5]),
    row(_(4), ['o', 1], ['f', 6], ['w', 5]),
    row(_(4), ['o', 1], ['f', 6], ['w', 5]),
    row(_(5), ['o', 1], ['f', 5], ['w', 5]),
    row(_(6), ['o', 1], ['f', 4], ['w', 5]),
    row(_(7), ['o', 1], ['w', 7], ['o', 1]),
    row(_(7), ['o', 9]),
    row(_(16)), row(_(16))
  ];

  var BISCUIT_TAIL_A = [   // curly shiba tail (right side)
    row(_(2), ['o', 4], _(2)),
    row(_(1), ['o', 1], ['f', 4], ['o', 1], _(1)),
    row(['o', 1], ['f', 2], ['w', 2], ['f', 1], ['o', 1], _(1)),
    row(['o', 1], ['f', 2], ['w', 2], ['f', 1], ['o', 1], _(1)),
    row(_(1), ['o', 1], ['f', 4], ['o', 1], _(1)),
    row(_(2), ['o', 4], _(2))
  ];
  var BISCUIT_TAIL_B = [
    row(_(8)),
    row(_(2), ['o', 4], _(2)),
    row(_(1), ['o', 1], ['f', 4], ['o', 1], _(1)),
    row(['o', 1], ['f', 2], ['w', 2], ['f', 1], ['o', 1], _(1)),
    row(['o', 1], ['f', 2], ['w', 2], ['f', 1], ['o', 1], _(1)),
    row(_(1), ['o', 1], ['f', 4], ['o', 1], _(1)),
    row(_(2), ['o', 4], _(2))
  ];

  /* ---------------- PUDDING — mint slime ---------------- */
  var PUDDING_BODY = [
    row(_(16)), row(_(16)), row(_(16)), row(_(16)),
    row(_(14), ['o', 2]),                            // tip
    row(_(13), ['o', 1], ['g', 2]),
    row(_(12), ['o', 1], ['g', 3]),
    row(_(11), ['o', 1], ['g', 4]),
    row(_(10), ['o', 1], ['g', 5]),
    row(_(9), ['o', 1], ['g', 6]),
    row(_(9), ['o', 1], ['g', 6]),
    row(_(8), ['o', 1], ['g', 7]),
    row(_(8), ['o', 1], ['g', 7]),
    row(_(7), ['o', 1], ['g', 8]),
    row(_(7), ['o', 1], ['g', 8]),
    row(_(6), ['o', 1], ['g', 9]),
    row(_(6), ['o', 1], ['g', 9]),
    row(_(5), ['o', 1], ['g', 10]),
    row(_(5), ['o', 1], ['g', 10]),
    row(_(5), ['o', 1], ['g', 10]),
    row(_(4), ['o', 1], ['g', 11]),
    row(_(4), ['o', 1], ['g', 11]),
    row(_(4), ['o', 1], ['g', 2], ['p', 3], ['g', 6]),   // blush
    row(_(4), ['o', 1], ['g', 2], ['p', 3], ['g', 6]),   // blush
    row(_(4), ['o', 1], ['g', 4], ['s', 7]),             // shade
    row(_(4), ['o', 1], ['g', 7], ['s', 4]),
    row(_(5), ['o', 1], ['g', 5], ['s', 5]),
    row(_(6), ['o', 1], ['g', 1], ['s', 8]),
    row(_(7), ['o', 1], ['s', 8]),
    row(_(8), ['o', 8]),                                  // bottom
    row(_(16)), row(_(16))
  ];

  var PUDDING_GLOSS = [
    row(['h', 3], _(3)),
    row(['h', 4], _(2)),
    row(['h', 4], _(2)),
    row(['h', 4], _(2)),
    row(_(1), ['h', 3], _(2)),
    row(_(2), ['h', 1], _(3))
  ];
  var PUDDING_DOT = [row(['h', 1]), row(['h', 1])];

  var PUDDING_SPROUT_A = [
    row(_(2), ['l', 1], _(1), ['l', 1], _(2)),
    row(_(1), ['l', 3], ['l', 2], _(1)),
    row(_(2), ['t', 1], ['l', 1], ['t', 1], _(2)),
    row(_(3), ['t', 1], _(3)),
    row(_(3), ['t', 1], _(3))
  ];
  var PUDDING_SPROUT_B = [
    row(_(2), ['l', 1], _(1), ['l', 1], _(2)),
    row(_(2), ['l', 4], _(1)),
    row(_(3), ['t', 1], ['l', 1], _(2)),
    row(_(4), ['t', 1], _(2)),
    row(_(4), ['t', 1], _(2))
  ];

  /* ---------------- LUNA — little ghost (floats!) ---------------- */
  var LUNA_BODY = [
    row(_(16)), row(_(16)),
    row(_(12), ['o', 2], _(2)),                      // dome tip
    row(_(11), ['o', 1], ['f', 2]),
    row(_(10), ['o', 1], ['f', 4]),
    row(_(9), ['o', 1], ['h', 1], ['f', 4]),
    row(_(8), ['o', 1], ['h', 2], ['f', 5]),
    row(_(7), ['o', 1], ['h', 2], ['f', 6]),
    row(_(6), ['o', 1], ['h', 2], ['f', 7]),
    row(_(5), ['o', 1], ['h', 1], ['f', 9]),
    row(_(5), ['o', 1], ['f', 9]),
    row(_(4), ['o', 1], ['f', 11]),                  // widest x4
    row(_(4), ['o', 1], ['f', 11]),
    row(_(4), ['o', 1], ['f', 11]),
    row(_(4), ['o', 1], ['f', 11]),
    row(_(4), ['o', 1], ['f', 2], ['p', 2], ['f', 7]),   // blush
    row(_(4), ['o', 1], ['f', 2], ['p', 2], ['f', 7]),   // blush
    row(_(2), ['o', 1], ['f', 1], ['o', 1], ['f', 11]),  // stubby arm (left)
    row(_(2), ['o', 1], ['f', 1], ['o', 1], ['f', 11]),  // stubby arm
    row(_(4), ['o', 1], ['f', 11]),
    row(_(4), ['o', 1], ['f', 11]),
    row(_(4), ['o', 1], ['f', 10], ['s', 1]),            // shade begins
    row(_(4), ['o', 1], ['f', 10], ['s', 1]),
    row(_(4), ['o', 1], ['f', 3], ['s', 2], ['f', 3], ['s', 3]),   // wave shade
    row(_(4), ['o', 1], ['f', 4], _(2), ['f', 5]),                 // scallop: gap x9-10
    row(_(5), ['f', 3], _(2), ['f', 3]),                           // tips
    row(_(6), ['f', 1], _(4), ['f', 1])                            // last tips
  ];

  /* ---------------- CLOVER — bunny (ears are a mirrored underlay) ---------------- */
  var CLOVER_EAR = [
    row(_(1), ['o', 1], ['f', 2], ['o', 1]),
    row(_(1), ['o', 1], ['p', 2], ['o', 1]),
    row(_(1), ['o', 1], ['p', 2], ['o', 1]),
    row(_(1), ['o', 1], ['p', 2], ['o', 1]),
    row(_(1), ['o', 1], ['p', 2], ['o', 1]),
    row(['o', 1], ['p', 3], ['o', 1]),
    row(['o', 1], ['p', 3], ['o', 1]),
    row(['o', 1], ['p', 2], ['f', 1], ['o', 1]),
    row(['o', 1], ['f', 3], ['o', 1]),
    row(_(1), ['o', 3])
  ];

  var CLOVER_HEAD = [
    row(_(16)), row(_(16)), row(_(16)), row(_(16)),
    row(_(16)), row(_(16)), row(_(16)), row(_(16)),
    row(_(16)),
    row(_(8), ['o', 7]),                             // dome top
    row(_(6), ['o', 1], ['f', 9]),
    row(_(5), ['o', 1], ['f', 10]),
    row(_(4), ['o', 1], ['f', 11]),                  // widest x4
    row(_(3), ['o', 1], ['f', 12]),                  // widest x3
    row(_(3), ['o', 1], ['f', 2], ['p', 2], ['f', 8]),   // blush
    row(_(3), ['o', 1], ['f', 8], ['w', 3], ['n', 1]),   // nose top
    row(_(3), ['o', 1], ['f', 7], ['w', 4], ['n', 1]),   // muzzle
    row(_(3), ['o', 1], ['f', 7], ['w', 5]),             // muzzle
    row(_(4), ['o', 1], ['f', 1], ['p', 2], ['f', 3], ['w', 5]), // blush low
    row(_(4), ['o', 1], ['f', 6], ['w', 5]),
    row(_(6), ['o', 1], ['f', 9]),
    row(_(8), ['o', 1], ['f', 7]),
    row(_(11), ['o', 5]),
    row(_(16)), row(_(16)), row(_(16)), row(_(16)),
    row(_(16)), row(_(16)), row(_(16)), row(_(16)),
    row(_(16)), row(_(16))
  ];

  var CLOVER_PUFF_A = [                            // fluffy tail puff
    row(_(2), ['o', 3]),
    row(_(1), ['o', 1], ['f', 3], ['o', 1]),
    row(_(1), ['o', 1], ['f', 1], ['h', 1], ['f', 1], ['o', 1]),
    row(_(1), ['o', 1], ['f', 3], ['o', 1]),
    row(_(2), ['o', 3])
  ];
  var CLOVER_PUFF_B = [
    row(_(2), ['o', 3]),
    row(_(1), ['o', 1], ['f', 3], ['o', 1]),
    row(_(1), ['o', 1], ['h', 1], ['f', 2], ['o', 1]),
    row(_(1), ['o', 1], ['f', 3], ['o', 1]),
    row(_(2), ['o', 3])
  ];

  /* ---------------- MISO — axolotl (gills are mirrored underlays) ---------------- */
  var MISO_GILL = [
    row(_(1), ['o', 1], ['c', 2], _(6)),             // top frond tip
    row(['o', 1], ['c', 4], ['o', 1], _(3)),
    row(['o', 1], ['c', 6], _(2)),                   // base (hidden under body)
    row(['o', 1], ['c', 5], _(3)),
    row(_(1), ['o', 1], ['c', 3], _(5)),
    row(_(10)),
    row(['o', 1], ['c', 7], _(1)),                   // middle frond
    row(['o', 1], ['c', 7], _(1)),
    row(['o', 1], ['c', 6], _(2)),
    row(_(10)),
    row(['o', 1], ['c', 5], _(3)),                   // bottom frond
    row(['o', 1], ['c', 4], _(4)),
    row(_(1), ['o', 1], ['c', 2], _(6))
  ];

  var MISO_TAIL = [                                // tiny tail nub (right side)
    row(_(1), ['o', 2]),
    row(['o', 1], ['f', 2], ['o', 1]),
    row(['o', 1], ['f', 1], ['s', 1], ['o', 1]),
    row(_(1), ['o', 3])
  ];

  var MISO_BODY = [
    row(_(16)), row(_(16)), row(_(16)), row(_(16)),
    row(_(16)),
    row(_(14), ['o', 2]),                            // dome tip x14-15
    row(_(13), ['o', 1], ['f', 2]),
    row(_(12), ['o', 1], ['h', 1], ['f', 2]),
    row(_(11), ['o', 1], ['h', 1], ['f', 3]),
    row(_(10), ['o', 1], ['h', 1], ['f', 4]),
    row(_(9), ['o', 1], ['h', 1], ['f', 5]),
    row(_(8), ['o', 1], ['f', 7]),
    row(_(7), ['o', 1], ['f', 8]),
    row(_(6), ['o', 1], ['f', 9]),
    row(_(5), ['o', 1], ['f', 10]),
    row(_(4), ['o', 1], ['f', 11]),
    row(_(3), ['o', 1], ['f', 12]),                  // widest x3
    row(_(3), ['o', 1], ['f', 12]),
    row(_(3), ['o', 1], ['f', 2], ['p', 3], ['f', 7]),   // blush
    row(_(3), ['o', 1], ['f', 2], ['p', 3], ['f', 7]),   // blush
    row(_(3), ['o', 1], ['f', 5], ['w', 7]),             // belly
    row(_(3), ['o', 1], ['f', 4], ['w', 8]),
    row(_(3), ['o', 1], ['f', 4], ['w', 8]),
    row(_(3), ['o', 1], ['f', 5], ['w', 7]),
    row(_(4), ['o', 1], ['f', 5], ['w', 6]),
    row(_(4), ['o', 1], ['f', 7], ['s', 4]),             // shade
    row(_(5), ['o', 1], ['f', 5], ['s', 5]),
    row(_(6), ['o', 1], ['s', 9]),
    row(_(8), ['o', 8]),                                 // bottom
    row(_(16)), row(_(16)), row(_(16)), row(_(16))
  ];

  /* ---------------- face stamps ---------------- */
  var EYE_OPEN_5 = [           // 5x5 sparkle eye
    row(_(1), ['k', 3], _(1)),
    row(['k', 1], ['w', 1], ['k', 3]),
    row(['k', 1], ['w', 1], ['k', 3]),
    row(['k', 3], ['w', 1], ['k', 1]),
    row(_(1), ['k', 3], _(1))
  ];
  var EYE_OPEN_6 = [           // 6x7 big sparkle eye (slime)
    row(_(1), ['k', 4], _(1)),
    row(['k', 1], ['w', 1], ['k', 4]),
    row(['k', 1], ['w', 1], ['k', 4]),
    row(['k', 6]),
    row(['k', 4], ['w', 1], ['k', 1]),
    row(['k', 6]),
    row(_(1), ['k', 4], _(1))
  ];
  var EYE_WIDE = [             // 7x7 shocked ring
    row(_(1), ['k', 5], _(1)),
    row(['k', 2], _(3), ['k', 2]),
    row(['k', 1], _(5), ['k', 1]),
    row(['k', 1], _(1), ['w', 1], _(3), ['k', 1]),
    row(['k', 1], _(5), ['k', 1]),
    row(['k', 2], _(3), ['k', 2]),
    row(_(1), ['k', 5], _(1))
  ];
  var EYE_HAPPY = [            // 5x3 closed happy ^
    row(_(2), ['k', 1], _(2)),
    row(_(1), ['k', 3], _(1)),
    row(['k', 1], _(3), ['k', 1])
  ];
  var EYE_BLINK = [            // 5x2 closed lid
    row(['k', 1], _(3), ['k', 1]),
    row(_(1), ['k', 3], _(1))
  ];

  var MOUTH_W = [              // 5x2 tiny cat "w" mouth
    row(['k', 1], _(3), ['k', 1]),
    row(_(1), ['k', 1], _(1), ['k', 1], _(1))
  ];
  var MOUTH_SMILE = [          // 4x2 small smile
    row(['k', 1], _(2), ['k', 1]),
    row(_(1), ['k', 2], _(1))
  ];
  var MOUTH_OPEN = [           // 5x4 open happy mouth w/ tongue
    row(_(1), ['k', 3], _(1)),
    row(['k', 1], ['p', 3], ['k', 1]),
    row(['k', 1], ['p', 3], ['k', 1]),
    row(_(1), ['k', 3], _(1))
  ];
  var MOUTH_FLAT = [row(['k', 4])];
  var MOUTH_OPEN_6 = [         // 6x3 slime open smile
    row(_(1), ['k', 4], _(1)),
    row(['k', 1], ['p', 4], ['k', 1]),
    row(_(1), ['k', 4], _(1))
  ];

  /* ============================================================
   * PET META + ASSEMBLY CONFIG
   * eyes are anchored by CENTER (eyeAnchor) so every face state
   * (open/blink/happy/wide) pivots around the same point.
   * underlays: baked BEHIND the body (ears, gills, tail nubs).
   * ============================================================ */
  var PETS = {
    mochi: {
      name: 'Mochi', species: 'Orange Tabby',
      tagline: 'Professional napper. Will judge your playlist, lovingly.',
      accent: '#f7a65e',
      palette: { o: '#6b4226', f: '#f7a65e', s: '#d97f35', w: '#fff4e3', p: '#ffb1bf', n: '#e56d84' },
      eyeColor: '#402a1f',
      eyeAnchor: { x: 10, y: 14 },
      head: MOCHI_HEAD, body: MOCHI_BODY,
      tails: [{ map: MOCHI_TAIL_A, x: 22, y: 13 }, { map: MOCHI_TAIL_B, x: 22, y: 13 }],
      mouths: { idle: { map: MOUTH_W, x: 13, y: 15 }, smile: { map: MOUTH_SMILE, x: 13, y: 16 }, open: { map: MOUTH_OPEN, x: 13, y: 15 } },
      tracking: { dx: 2, dyUp: 1, dyDown: 2 }
    },
    biscuit: {
      name: 'Biscuit', species: 'Shiba Inu',
      tagline: 'Maximum loyalty, minimum chill. 10/10 would fetch.',
      accent: '#edbb70',
      palette: { o: '#7a4a21', f: '#edbb70', w: '#fff6e6', p: '#f4a6b4', n: '#4a2c17' },
      eyeColor: '#402a1f',
      eyeAnchor: { x: 11, y: 14 },
      head: BISCUIT_HEAD, body: BISCUIT_BODY,
      tails: [{ map: BISCUIT_TAIL_A, x: 23, y: 14 }, { map: BISCUIT_TAIL_B, x: 23, y: 15 }],
      mouths: { idle: { map: MOUTH_W, x: 13, y: 17 }, smile: { map: MOUTH_SMILE, x: 13, y: 18 }, open: { map: MOUTH_OPEN, x: 13, y: 17 } },
      tracking: { dx: 2, dyUp: 1, dyDown: 2 }
    },
    pudding: {
      name: 'Pudding', species: 'Mint Slime',
      tagline: 'Small, squishy, full of big dreams and jelly.',
      accent: '#62cf9f',
      palette: { o: '#256b52', g: '#62cf9f', s: '#3ba87c', h: '#eafff4', p: '#ff9fb2', l: '#8fe08f', t: '#4d9e63' },
      eyeColor: '#173f31',
      eyeAnchor: { x: 12, y: 18 },
      bigEyes: true,
      head: null, body: PUDDING_BODY,
      tails: null,
      gloss: { map: PUDDING_GLOSS, x: 9, y: 8 },
      dot: { map: PUDDING_DOT, x: 17, y: 10 },
      sprouts: [{ map: PUDDING_SPROUT_A, x: 12, y: 0 }, { map: PUDDING_SPROUT_B, x: 12, y: 0 }],
      mouths: { idle: { map: MOUTH_SMILE, x: 14, y: 23 }, smile: { map: MOUTH_SMILE, x: 14, y: 23 }, open: { map: MOUTH_OPEN_6, x: 13, y: 22 } },
      tracking: { dx: 2, dyUp: 1, dyDown: 2 }
    },
    luna: {
      name: 'Luna', species: 'Little Ghost',
      tagline: 'Mostly here for the cozy vibes and gentle hovering.',
      accent: '#b8b0e8',
      palette: { o: '#8f87c9', f: '#fdfbff', s: '#d9d3f2', h: '#ffffff', p: '#ffb1c9', w: '#ffffff' },
      eyeColor: '#4b4368',
      eyeAnchor: { x: 10, y: 12 },
      head: null, body: LUNA_BODY,
      tails: null,
      float: true,
      mouths: { idle: { map: MOUTH_SMILE, x: 14, y: 16 }, smile: { map: MOUTH_SMILE, x: 14, y: 16 }, open: { map: MOUTH_OPEN, x: 13, y: 15 } },
      tracking: { dx: 2, dyUp: 1, dyDown: 2 }
    },
    clover: {
      name: 'Clover', species: 'Bunny',
      tagline: 'Ears at maximum altitude. Heart at maximum softness.',
      accent: '#f5d9b8',
      palette: { o: '#a8845f', f: '#fdf6ea', s: '#eeddc6', w: '#fffdf8', p: '#ffc4d0', n: '#e08898', h: '#ffffff' },
      eyeColor: '#4a3628',
      eyeAnchor: { x: 10, y: 15 },
      head: CLOVER_HEAD, body: MOCHI_BODY,
      tails: [{ map: CLOVER_PUFF_A, x: 24, y: 15 }, { map: CLOVER_PUFF_B, x: 24, y: 15 }],
      underlays: [{ map: CLOVER_EAR, x: 5, y: 1, mirror: true }],
      mouths: { idle: { map: MOUTH_W, x: 13, y: 17 }, smile: { map: MOUTH_SMILE, x: 13, y: 17 }, open: { map: MOUTH_OPEN, x: 13, y: 16 } },
      tracking: { dx: 2, dyUp: 1, dyDown: 2 }
    },
    miso: {
      name: 'Miso', species: 'Axolotl',
      tagline: 'Always smiling. Scientifically unable to frown.',
      accent: '#ffb7c5',
      palette: { o: '#b26b7f', f: '#ffc9d4', s: '#f0a8b8', h: '#ffe9ee', p: '#ff8fa8', c: '#ff96ab', w: '#fff3f5' },
      eyeColor: '#5c3a47',
      eyeAnchor: { x: 10, y: 15 },
      head: null, body: MISO_BODY,
      tails: null,
      underlays: [
        { map: MISO_GILL, x: 0, y: 12, mirror: true },
        { map: MISO_TAIL, x: 27, y: 20, mirror: false }
      ],
      mouths: { idle: { map: MOUTH_SMILE, x: 14, y: 20 }, smile: { map: MOUTH_SMILE, x: 14, y: 20 }, open: { map: MOUTH_OPEN, x: 13, y: 19 } },
      tracking: { dx: 2, dyUp: 1, dyDown: 2 }
    }
  };

  /* ============================================================
   * LAYER BAKING
   * ============================================================ */
  function makeCanvas(w, h) {
    var c = document.createElement('canvas');
    c.width = w; c.height = h;
    return c;
  }

  function bakeMap(rowsFull, palette, ox, oy) {
    // rowsFull: array of FULL-width strings (already mirrored if needed)
    var c = makeCanvas(32, 32);
    var g = c.getContext('2d');
    for (var ri = 0; ri < rowsFull.length; ri++) {
      var r = rowsFull[ri];
      for (var ci = 0; ci < r.length; ci++) {
        var ch = r[ci];
        if (ch === '.' || ch === ' ') continue;
        var col = palette[ch];
        if (!col) throw new Error('Unknown palette char "' + ch + '" in row ' + ri);
        g.fillStyle = col;
        g.fillRect(ox + ci, oy + ri, 1, 1);
      }
    }
    return c;
  }

  // bake a small overlay map at (ox,oy); optionally also mirrored (for ears/gills)
  function bakeOverlay(map, palette, ox, oy, mirror) {
    var w = 0;
    map.forEach(function (r) { if (r.length > w) w = r.length; });
    var stamp = bakeMap(fullRows(map, w), palette, 0, 0);
    var c = makeCanvas(32, 32);
    var g = c.getContext('2d');
    g.drawImage(stamp, ox, oy);
    if (mirror) {
      g.save();
      g.translate(32, 0); g.scale(-1, 1);
      g.drawImage(stamp, ox, oy);
      g.restore();
    }
    return c;
  }

  function compositeUnderlays(pet, bodyLayer) {
    if (!pet.underlays || !pet.underlays.length) return bodyLayer;
    var c = makeCanvas(32, 32);
    var g = c.getContext('2d');
    pet.underlays.forEach(function (u) {
      g.drawImage(bakeOverlay(u.map, pet.palette, u.x, u.y, u.mirror), 0, 0);
    });
    g.drawImage(bodyLayer, 0, 0);
    return c;
  }

  function mirrorRows(rows) {
    // rows are LEFT HALVES of width<=16 -> pad to 16 then mirror to 32
    return rows.map(function (r) {
      if (r.length > 16) throw new Error('Half row too long: ' + r.length + ' -> "' + r + '"');
      var padded = r + '.'.repeat(16 - r.length);
      return padded + padded.split('').reverse().join('');
    });
  }

  function fullRows(map, w) {
    // small overlay maps: pad rows to given width
    return map.map(function (r) {
      if (r.length > w) throw new Error('Overlay row too long');
      return r + '.'.repeat(w - r.length);
    });
  }

  function pairEyes(stampMap, palette, ex, ey, mirror) {
    // draws left eye at (ex,ey) and mirrored right eye, on a 32x32 layer
    var c = makeCanvas(32, 32);
    var g = c.getContext('2d');
    var h = stampMap.length, w = stampMap[0].length;
    var left = bakeStamp(stampMap, palette);
    g.drawImage(left, ex, ey);
    g.save();
    g.translate(32, 0); g.scale(-1, 1);
    g.drawImage(left, ex, ey);
    g.restore();
    return c;
    function bakeStamp(map, pal) {
      var cc = makeCanvas(w, h);
      var gg = cc.getContext('2d');
      for (var ri = 0; ri < map.length; ri++) {
        for (var ci = 0; ci < map[ri].length; ci++) {
          var ch = map[ri][ci];
          if (ch === '.' || ch === ' ') continue;
          gg.fillStyle = pal[ch];
          gg.fillRect(ci, ri, 1, 1);
        }
      }
      return cc;
    }
  }

  function build(id) {
    var pet = PETS[id];
    if (!pet) throw new Error('No pet: ' + id);
    var facePal = { k: pet.eyeColor, w: '#ffffff', p: (pet.palette.p || '#ff9fb2') };

    var layers = {};
    layers.body = compositeUnderlays(pet, bakeMap(mirrorRows(pet.body), pet.palette, 0, 0));
    if (pet.head) layers.head = bakeMap(mirrorRows(pet.head), pet.palette, 0, 0);
    if (pet.tails) layers.tail = pet.tails.map(function (t) {
      return bakeMap(fullRows(t.map, 10), pet.palette, t.x, t.y);
    });
    if (pet.gloss) layers.gloss = bakeMap(fullRows(pet.gloss.map, 6), pet.palette, pet.gloss.x, pet.gloss.y);
    if (pet.dot) layers.dot = bakeMap(fullRows(pet.dot.map, 1), pet.palette, pet.dot.x, pet.dot.y);
    if (pet.sprouts) layers.sprout = pet.sprouts.map(function (s) {
      return bakeMap(fullRows(s.map, 7), pet.palette, s.x, s.y);
    });

    // ---- eyes: every state baked CENTERED on eyeAnchor so faces align ----
    var anchor = pet.eyeAnchor || { x: 10, y: 14 };
    var eyeDefs = pet.eyes || {
      open: { map: pet.bigEyes ? EYE_OPEN_6 : EYE_OPEN_5 },
      blink: { map: EYE_BLINK },
      happy: { map: EYE_HAPPY },
      wide: { map: EYE_WIDE }
    };
    layers.eyes = {};
    ['open', 'blink', 'happy', 'wide'].forEach(function (k) {
      var e = eyeDefs[k];
      var w = e.map[0].length;
      var h = e.map.length;
      var pal = { k: pet.eyeColor, w: '#ffffff' };
      var stamp = makeCanvas(w, h);
      var sg = stamp.getContext('2d');
      for (var ri = 0; ri < h; ri++) {
        for (var ci = 0; ci < e.map[ri].length; ci++) {
          var ch = e.map[ri][ci];
          if (ch === '.' || ch === ' ') continue;
          sg.fillStyle = pal[ch];
          sg.fillRect(ci, ri, 1, 1);
        }
      }
      var ox = anchor.x - Math.floor(w / 2);
      var oy = anchor.y - Math.floor(h / 2);
      var c = makeCanvas(32, 32);
      var g = c.getContext('2d');
      g.drawImage(stamp, ox, oy);
      g.save();
      g.translate(32, 0); g.scale(-1, 1);
      g.drawImage(stamp, ox, oy);
      g.restore();
      layers.eyes[k] = c;
    });

    layers.mouths = {};
    Object.keys(pet.mouths).forEach(function (k) {
      var m = pet.mouths[k];
      var w = m.map[0].length;
      var stamp = makeCanvas(w, m.map.length);
      var sg = stamp.getContext('2d');
      for (var ri = 0; ri < m.map.length; ri++) {
        for (var ci = 0; ci < m.map[ri].length; ci++) {
          var ch = m.map[ri][ci];
          if (ch === '.' || ch === ' ') continue;
          sg.fillStyle = facePal[ch] || pet.eyeColor;
          sg.fillRect(ci, ri, 1, 1);
        }
      }
      var c = makeCanvas(32, 32);
      var g = c.getContext('2d');
      g.drawImage(stamp, m.x, m.y);
      layers.mouths[k] = c;
    });

    function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

    return {
      id: id,
      meta: pet,
      layers: layers,
      draw: function (g, opts) {
        opts = opts || {};
        var face = opts.face || 'open';
        var mouth = opts.mouth;
        var bob = opts.bob || 0;
        var t = opts.tail || 0;
        if (layers.tail) g.drawImage(layers.tail[t], 0, 0);
        if (layers.gloss) g.drawImage(layers.gloss, 0, 0);
        if (layers.dot) g.drawImage(layers.dot, 0, 0);
        g.drawImage(layers.body, 0, 0);
        if (layers.head) g.drawImage(layers.head, 0, bob);
        if (layers.sprout) g.drawImage(layers.sprout[opts.sprout || 0], 0, bob);
        if (face === 'open') {
          var tr = pet.tracking;
          var dx = clamp(opts.dx || 0, -tr.dx, tr.dx);
          var dy = clamp(opts.dy || 0, -tr.dyUp, tr.dyDown);
          g.drawImage(layers.eyes.open, dx, dy);
        } else if (layers.eyes[face]) {
          g.drawImage(layers.eyes[face], 0, 0);
        }
        if (mouth && layers.mouths[mouth]) g.drawImage(layers.mouths[mouth], 0, 0);
      },
      renderToCanvas: function (scale, opts) {
        var c = makeCanvas(32 * scale, 32 * scale);
        var g = c.getContext('2d');
        g.imageSmoothingEnabled = false;
        g.save();
        g.scale(scale, scale);
        this.draw(g, opts);
        g.restore();
        return c;
      }
    };
  }

  window.PIXEL_PALS = { PETS: PETS, build: build, row: row };
})();
export const PIXEL_PALS = window.PIXEL_PALS;
