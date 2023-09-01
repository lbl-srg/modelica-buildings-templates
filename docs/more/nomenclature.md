---
sidebar_position: 2
---

# Nomenclature

This section provides conventions mainly for variable naming, marginally for component naming.


## Example of Control Point Naming

By way of introduction, here is an example of how the following rules translate into practical nomenclature for the CHW plant template.

<iframe src="https://docs.google.com/document/d/1LeutsY9__ClaIEjmvRHkIAMGX5dlW0Xo1BFGvJTHjs4/preview" frameborder="0" allowfullscreen width="100%" height="500"></iframe>


## Control Points

Damper and valve models
- take
  - `y1` (Boolean) if 2-position, XOR
  - `y` (real, fractional) if modulating
- return
  - `y_actual` (real, fractional) for the position feedback (modulating), XOR
  - `y1_actual` (Boolean, open end switch status) and `y0_actual` (Boolean, closed end switch status)

Fan and pump models
- take
  - `y1` for the On/Off command (Boolean, used for constant speed motor starter, and variable speed VFD Run signal), AND
  - `y` (optional) for the commanded speed (real fractional or integer, used for variable speed or 2-stage fan motor)
- return `y1_actual` (Boolean, status)

(See also [command in Glossary](./glossary.md#command).)


<details>

***Still need to clarify*** the use of `u` and `y` in MBL.

- Is it in reference to the control system (as I/O points) or in reference to the modeled component (either the process—for a sensor—or the controls)?
- Is it at all related to control theory as in the diagram below? Obviously not as we would then use `u` for the controller *output* and `e = ysp - y` so something in the `y` domain for the controller *input*.

![control](/img/control.png)

</details>

## Order of Morphemes

In the CamelCase instance name:

- The first morpheme indicates what the instance represents.

  For instance a controller `ctl`, a fan `fan`, a coil `coi`

  <details>

  This is motivated by the naming of

  - quantity variables: we would not use `SupAirT` for the supply air temperature, but rather `TAirSup`,

  - physical connectors: see `port_a`.

  </details>

- The suffixes stand for the attributes by order of importance.

  For instance `coiCoo` for cooling coil, `fanSupDra` for a supply fan in a draw-through configuration.

  For a quantity

  - the first suffix shall systematically describe the medium (`ChiWat`, `Air`, etc.),
  - the second suffix shall describe the origin of the medium (`ChiWatSup`, `TAirSup`, etc.).

    Exceptions are only allowed if the quantity is a system characteristic for which there is no ambiguity, for instance `dpDamOut_nominal` for the OA damper pressure drop (we don’t mention air) or `dpValCoiCoo` for the cooling coil control valve (we don’t mention CHW).

    Similarly (exhaustive list):

    - `TOut` or `phiOut` (air implied)
    - `TZon` (air implied)
    - `pBui_rel` (air implied)


All CamelCase morphemes should be used before the first underscore&mdash;such as in `mAirSup_flow_nominal`&mdash;with the exception of the physical connectors where we use `port_aChiWat`.


## Do we allow 3-letter capital names such as CHW?

:::danger NO

3-letter capital abbreviations are only allowed&mdash;and encouraged&mdash;in documentation and description strings.

:::


For variable and instance names:

| Rather use | Instead of |
| ---------- | ---------- |
| ChiWat     | CHW        |
| ConWat     | CW         |
| HeaWat     | HHW        |
| HotWat     | DHW        |
| Eco        | WSE        |
| Hex        | HX         |
| AirHan     | AHU        |
| Coo        | CT         |

Tolerated exceptions:

- COP
- VAV
- PLR


## Fixed Position or Non-abbreviated Forms

- `_nominal`, `_min`, `_max` and `_actual` always at the end

  <details>

  `min` and `max` are attributes of primitive types in Modelica, same as `nominal`, and should have the same notation, not Min and Max in CamelCase.

  </details>

- For design conditions use `_nominal` not `Des`

- `_flow` for rate per unit of time

- `have_`, `is_` or `use_` for a structural parameter, always at the beginning

  <details>

  Why not `has_`? Because “Does it have?”, same for “Does it use?”, but “Is it?”

  </details>

- `_a` and `_b` for inlet and outlet ports.


## Reserved

### Physical Quantities

Pressure:

- `p` is used for absolute pressure,
- `p_rel` for relative pressure (duct static, building static, etc.),
- `dp` for a pressure drop across an equipment or a circuit.

Relative humidity: `phi`

From [Buildings.UsersGuide.Conventions](https://simulationresearch.lbl.gov/modelica/releases/v8.1.0/help/Buildings_UsersGuide.html#Buildings.UsersGuide.Conventions):

- Mass fraction
  - Uppercase `X` denotes mass fraction per total mass.
  - Lowercase `x` denotes mass fraction per mass of dry air (absolute humidity).

- `TWetBul` for wet bulb

:::tip
The naming conventions used for variables representing quantities (such as `T` for temperature) should be used in component names (typically sensors) for the sake of concision.

For instance a sensor for supply air temperature should be named `TAirSup` instead of `senTemAirSup`.
:::

### Various

`Set` for a set point, always as the last morpheme: so `TZonHeaOccSet` not `TZonHeaSetOcc`.

The letter `n` is used to represent a number of something (as opposed to `num`).

The letter `y` is used to represent a fractional quantity (speed, opening, load) taking $1$ as maximum value, for instance `yLoa` for PLR.

:::tip

  - Prefer `ctl` to `con` for a controller as the latter is too loose: condenser, configuration, etc.

  - Prefer `cfg` to `con` for a configuration.

  - Prefer `lck` to `loc` for lock-out as the latter is too loose: local, etc.

:::


##  Legacy Exceptions

Mainly for consistency with MSL we allow the following variable names.

- `samplePeriod`
