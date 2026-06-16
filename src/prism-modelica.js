/**
 * Prism.js language definition for Modelica
 *
 * Derived from:
 *   - BorisChumichev/modelicaSublimeTextPackage (MIT)
 *   - Modelica Language Specification 3.6/3.7
 *
 * Supports: .mo files (Modelica 3.x, including CDL/OBC subset)
 * Usage:    <code class="language-modelica">...</code>
 *
 * Token order matters: more specific patterns must precede general ones.
 */

import { Prism } from 'prism-react-renderer';

Prism.languages.modelica = {

  // ── Comments ──────────────────────────────────────────────────────────────

  'comment': [
    { pattern: /\/\*[\s\S]*?\*\//, greedy: true },  // /* ... */
    { pattern: /\/\/.*/, greedy: true }              // // ...
  ],

  // ── Strings ───────────────────────────────────────────────────────────────
  // Must precede keywords so annotation strings are not rescanned.

  'string': {
    pattern: /"(?:[^"\\]|\\.)*"/,
    greedy: true
  },

  // ── Booleans ──────────────────────────────────────────────────────────────

  'boolean': /\b(?:true|false)\b/,

  // ── Numbers ───────────────────────────────────────────────────────────────
  // Covers: 42  1.0  .5  1e3  1.5e-2  0xFF

  'number': /\b(?:0[xX][0-9a-fA-F]+|(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?)\b/,

  // ── Class names ───────────────────────────────────────────────────────────
  // Four distinct contexts where a (possibly dotted) type/class name appears.

  'class-name': [

    // 1. After class-defining keywords:
    //      model Foo   block Buildings.Templates.Plants.Controls.HeatPumps.X
    {
      pattern: /(\b(?:block|class|connector|expandable\s+connector|function|model|operator\s+(?:function|record)|package|record|type)\s+)((?:\w+\.)*\w+)/,
      lookbehind: true
    },

    // 2. After reference keywords:
    //      extends Buildings.Controls.OBC.CDL.Interfaces.PartialController
    //      import  Modelica.SIunits
    //      within  Buildings.Templates
    //      constrainedby Buildings.Templates.Interfaces.Foo
    {
      pattern: /(\b(?:constrainedby|extends|import|within)\s+)((?:\w+\.)*\w+)/,
      lookbehind: true
    },

    // 3. After "end" (but NOT end if / end for / end when / end while):
    //      end StagingEventSequencing
    //      end Buildings.Templates.Plants.Controls.HeatPumps.StagingEventSequencing
    {
      pattern: /(\bend\s+)(?!(?:if|for|when|while)\b)((?:\w+\.)*\w+)/,
      lookbehind: true
    },

    // 4. Component declarations — dotted type name followed by a component name:
    //      Buildings.Controls.OBC.CDL.Interfaces.BooleanInput u1Hea
    //      Buildings.Controls.OBC.CDL.Reals.Subtract dT(k1=+1)
    //      Buildings.Controls.OBC.CDL.Interfaces.BooleanInput u1[nHp]
    //
    // Heuristic guards to avoid false positives:
    //   • The path must start with an uppercase letter (Modelica package convention).
    //   • \b before the first segment prevents matching mid-identifier (e.g. u1Hea.y).
    //   • The lookahead (?=\s+\w) requires whitespace + identifier after the type name;
    //     this excludes bare field access (a.b.c) and function calls (Foo.bar()).
    {
      pattern: /\b((?:[A-Z]\w*\.)+\w+)(?=\s+\w)/
    }

  ],

  // ── Primitive / built-in types ─────────────────────────────────────────────

  'builtin': /\b(?:Real|Integer|Boolean|String|enumeration)\b/,

  // ── Keywords ───────────────────────────────────────────────────────────────

  'keyword': [
    // Compound control end-keywords must precede plain 'end'.
    { pattern: /\bend\s+(?:if|for|when|while)\b/ },
    { pattern: /\b(?:algorithm|and|annotation|assert|block|break|class|connect|connector|constant|constrainedby|der|discrete|each|else|elseif|elsewhen|encapsulated|end|enumeration|equation|expandable|extends|external|final|flow|for|function|if|import|impure|in|initial|inner|input|loop|model|not|operator|or|outer|output|package|parameter|partial|protected|public|pure|record|redeclare|replaceable|return|stream|then|type|when|while|within)\b/ }
  ],

  // ── Built-in functions ─────────────────────────────────────────────────────
  // Aliased to 'function' (distinct from 'builtin') so themes can colour them
  // differently from primitive type names and literal values.
  // All require a following '(' to avoid matching bare identifiers.

  'function': [
    {
      // Mathematical
      pattern: /\b(?:abs|acos|asin|atan|atan2|ceil|cos|cosh|div|exp|floor|integer|log|log10|max|min|mod|product|rem|sign|sin|sinh|sqrt|sum|tan|tanh)\b(?=\s*\()/
    },
    {
      // Array / matrix
      pattern: /\b(?:cardinality|cross|diagonal|fill|getInstanceName|identity|linspace|matrix|ndims|ones|outerProduct|scalar|size|skew|symmetric|transpose|vector|zeros)\b(?=\s*\()/
    },
    {
      // Event / simulation
      pattern: /\b(?:actualStream|change|delay|edge|homotopy|inStream|noEvent|pre|reinit|sample|semiLinear|smooth|spatialDistribution|terminal|terminate)\b(?=\s*\()/
    }
  ],

  // ── Operators ──────────────────────────────────────────────────────────────

  'operator': [
    { pattern: /<>|<=|>=|==|<|>/ },            // comparison
    { pattern: /:=/ },                          // assignment (before bare =)
    { pattern: /=/ },                           // equation
    { pattern: /\.\+|\.\-|\.\*|\.\/|\.\^/ },   // element-wise (before plain .)
    { pattern: /[+\-*/^]/ },                    // arithmetic
    { pattern: /\b(?:and|not|or)\b/ }           // logical
  ],

  // ── Punctuation ────────────────────────────────────────────────────────────

  'punctuation': /[()[\]{}.,:;]/,

  // ── Annotation blocks ──────────────────────────────────────────────────────
  // Visually de-emphasised (aliased to 'comment').
  // Handles one level of nested parens, sufficient for real-world annotations.

  'annotation': {
    pattern: /\bannotation\s*\((?:[^()"]|"(?:[^"\\]|\\.)*"|\((?:[^()"]|"(?:[^"\\]|\\.)*")*\))*\)/,
    greedy: false,
    alias: 'comment'
  }

};

Prism.languages.mo = Prism.languages.modelica;
