---
sidebar_position: 1
---

# Guide

## Interface Class: What Shall Be Declared? {#interface-class}

### Outside Connectors Needed by Any Derived Class

:::danger Important

All [outside connectors](https://specification.modelica.org/maint/3.5/connectors-and-connections.html#inside-and-outside-connectors) must be declared within the interface class&mdash;with the suitable conditional instance statements.

(Each class extending an interface class shall not declare any outside connector&mdash;it may only conditionally remove inherited connectors.)
:::

This ensures the [plug-compatibility](https://specification.modelica.org/maint/3.5/interface-or-type-relationships.html#plug-compatibility-or-restricted-subtyping) of each derived class, and implies a fixed connectivity structure for each instantiated subsystem model, allowing these instances to be connected to each other without worrying about the actual configuration of each subsystem.
This applies to connecting components within a template, or connecting templates to each other to create a whole-building model.


<details>

*How does it comply with the [Modelica Language Specification](https://specification.modelica.org/maint/3.5/scoping-name-lookup-and-flattening.html#generation-of-the-flat-equation-system)?*

Type compatibility:

> Each reference is checked, whether it is a valid reference, e.g. the referenced object belongs to or is an instance, where all *existing conditional declaration expressions evaluate to true|false*, or it is a constant in a package.

So checking that the redeclared component is a subtype of the constraining class is done with all the conditional connectors considered present (even if the redeclared component removes them).

*How does it differ from interface classes in MBL?*

Interface classes are usually implemented with the minimum set of connectors (and other variables) and derived classes extend that set, which ensures *type* compatibility.
See for instance:

```mo title="Fluid/Boilers/BaseClasses/PartialBoiler.mo"
extends Interfaces.TwoPortHeatMassExchanger(...); // Interface class used by the model

Modelica.Blocks.Interfaces.RealInput y(...)       // Additional connector not declared in the interface class
  "Part load ratio";
Modelica.Blocks.Interfaces.RealOutput T(...)      // Additional connector not declared in the interface class
  "Temperature of the fluid";
Modelica.Thermal.HeatTransfer.Interfaces.HeatPort_a heatPort  // Additional connector not declared in the interface class
  "Heat port, can be used to connect to ambient";
```
</details>


### Both the [Parameter Record](#parameter-record) and Locally Accessible Design Parameters

The parameter record is for propagation across the instance tree.

The local design parameter declarations ensure that we have a standard set of parameters available in each template or component, whatever the configuration. For instance an evaporator coil still has `mChiWat_flow_nominal` defined with a final assignment to `0`.

Most of the local design parameters have `final` assignments to the parameters from the record.

<details>

<summary>Example</summary>

```mo title="Templates/AirHandlersFans/Interfaces/PartialAirHandler.mo"
final parameter Modelica.Units.SI.MassFlowRate mAirSup_flow_nominal=
  dat.mAirSup_flow_nominal
  "Supply air mass flow rate"
  annotation (Dialog(group="Nominal condition"));
final parameter Modelica.Units.SI.MassFlowRate mAirRet_flow_nominal=
  dat.mAirRet_flow_nominal
  "Return air mass flow rate"
  annotation (Dialog(group="Nominal condition"));
parameter Modelica.Units.SI.MassFlowRate mChiWat_flow_nominal
  "Total CHW mass flow rate"
  annotation (Dialog(group="Nominal condition"));
parameter Modelica.Units.SI.MassFlowRate mHeaWat_flow_nominal
  "Total HHW mass flow rate"
  annotation (Dialog(group="Nominal condition"));
parameter Modelica.Units.SI.HeatFlowRate QChiWat_flow_nominal
  "Total CHW heat flow rate"
  annotation (Dialog(group="Nominal condition"));
parameter Modelica.Units.SI.HeatFlowRate QHeaWat_flow_nominal
  "Total HHW heat flow rate"
  annotation (Dialog(group="Nominal condition"));
```
And the derived class:
```mo title="Templates/AirHandlersFans/VAVMultiZone.mo"

extends Buildings.Templates.AirHandlersFans.Interfaces.PartialAirHandler(
  ...
  final mChiWat_flow_nominal=if coiCoo.have_sou then dat.coiCoo.mWat_flow_nominal else 0,
  final mHeaWat_flow_nominal=(if coiHeaPre.have_sou then dat.coiHeaPre.mWat_flow_nominal else 0) +
    (if coiHeaReh.have_sou then dat.coiHeaReh.mWat_flow_nominal else 0),
  final QChiWat_flow_nominal=if coiCoo.have_sou then dat.coiCoo.Q_flow_nominal else 0,
  final QHeaWat_flow_nominal=(if coiHeaPre.have_sou then dat.coiHeaPre.Q_flow_nominal else 0) +
    (if coiHeaReh.have_sou then dat.coiHeaReh.Q_flow_nominal else 0));
```

</details>


### Configuration Parameters

All configuration parameters are declared in the interface class, see the [admonition below](#admonConfigParam) for the proposed structure.


### Nested Expandable Connectors

The interface class of the [main controller](#main-controller) should have protected instances of all sub-buses, connected to the corresponding variables from the main control bus as follows.

```mo title="Templates/ChilledWaterPlants/Components/Interfaces/PartialController.mo"
  Buildings.Templates.ChilledWaterPlants.Interfaces.Bus bus
    "Plant control bus";
protected
  Buildings.Templates.Components.Interfaces.Bus busValChiWatChiIso[nChi]
    if typValChiWatChiIso<>Buildings.Templates.Components.Types.Valve.None
    "Chiller CHW isolation valve control bus";
equation
  connect(busValChiWatChiIso, bus.valChiWatChiIso)
```

This is particularly important in the case of array sub-buses. We avoid pre-declaring these sub-buses in the main bus definition because this would require including structural parameters for the array size inside the bus, and thus binding these parameters for each bus instance. Instead, we use instances of sub-buses *in the interface class of the controller* and the connect statement `connect(bus<Component>, bus.<component>)` provides a hint to Modelica compilers to assign the correct dimensions to `bus.<component>` (which is not predeclared in the bus definition).


## Replaceable Component

No `choicesAllMatching` annotation is currently allowed in the `Templates` package (to maximize support across various Modelica tools).
Expand into an explicit `choices` annotation with proper description strings and the following rules.

Systematically use `redeclare replaceable` in the `choices` annotation to allow
- further redeclaration by the user,
- visiting the parameter dialog box of the redeclared component (this is Dymola's behavior, although this behavior is automatically enabled if the redeclared component contains replaceable components).


## Section

A so-called section is needed whenever there is a hard constraint on the allowed choices for two replaceable components that are on the same composition level.

<details>

<summary>Example</summary>

In the case of a multiple-zone VAV with an air economizer, a return fan should require a modulating relief damper. However, we cannot bind the redeclaration of the damper component to the redeclaration of the return fan component. So we introduce a section `Templates.AirHandlersFans.Components.ReliefReturnSection` that contains the two components, so that the whole section component can be redeclared with the proper inside fan and damper components.
</details>

The interface class for a section should use the same class for the control bus as the one used by the system template.
This is different from the base components, which have their own class for the control bus, that is `Templates.Components.Interfaces.Bus`.
The motivation is to avoid nesting expandable connectors and to allow seamless traversal of the composition levels when connecting signal variables, see for instance:

```mo title="Templates/AirHandlersFans/VAVMultiZone.mo"
connect(secOutRel.bus, bus);            // secOutRel is a section
connect(ctl.bus, bus);                  // ctl is a controller

// Buildings.Templates.AirHandlersFans.Components.OutdoorReliefReturnSection
connect(damRet.bus, bus.damRet);        // connection to the damper bus inside the section

// Buildings.Templates.AirHandlersFans.Components.Controls.G36VAVMultiZone
connect(ctl.yRetDamPos, bus.damRet.y);  // accessing the damper control variable inside the controller
```

## Main Controller

### Control Section

We instantiate all control blocks that form the control sequence of a system into one single class that is similar to a [section](#section), see for instance [`Templates.AirHandlersFans.Components.Controls.G36VAVMultiZone`](https://github.com/lbl-srg/modelica-buildings/blob/14449dcb92a641b48b056cedcf58f446be2249b9/Templates/AirHandlersFans/Components/Controls/G36VAVMultiZone.mo).

Particularly this control section uses the same class for the control bus as the one used by the system template.

As opposed to the CDL implementation of the SOO, we only declare design and operating parameters strictly required by the SOO and propagated by means of the [parameter record](#parameter-record)&mdash;final bindings of the local parameters with the parameters from the record are used, see Section [Interface Class](#interface-class).


### Control Point Connections

Connect statements between signal (control) variables do not have graphical annotations.
Instead, a dedicated section is used at the top of the `equation` section.

```mo title="Templates/AirHandlersFans/VAVMultiZone.mo"
equation
  /* Control point connection - start */
  // Inputs from AHU bus
  connect(bus.pAirSup_rel, ctl.dpDuc);
  connect(bus.TOut, ctl.TOut);
  ...
  // Inputs from terminal bus
  connect(busTer.yReqZonPreRes, reqZonPreRes.u);
  connect(busTer.yReqZonTemRes, reqZonTemRes.u);
  ...
  // Outputs to AHU bus
  connect(ctl.yMinOutDam, bus.damOutMin.y);
  connect(ctl.y1MinOutDam, bus.damOutMin.y1);
  ...
  // Outputs to terminal unit bus
  connect(TAirSupSet.y, busTer.TAirSupSet);
  connect(TAirSup.y, busTer.TAirSup);
  ...
  /* Control point connection - stop */
```

:::tip
Use the same name for the signal variable and for the component it originates from.
:::

Inside the control section, connections to variables within nested expandable connectors should be done by means of the [local instances of these sub-buses](#nested-expandable-connectors) to guarantee that Modelica compilers assign correct dimensions to these variables.
See the example in [Gautier (2023)](/more/references#Gautier23) Section&nbsp;5. See also:

```mo title="Templates/ChilledWaterPlants/Components/Controls.G36.mo"
equation
  /* Control point connection - start */
  connect(busChi.y1ChiWatReq, ctl.uChiWatReq);  // as opposed to connect(bus.chi.y1ChiWatReq, ctl.uChiWatReq)
```

### Equipment Status

Most of the component models (such as `Templates.Components.Chillers.Compression`) compute the [status signal](/more/glossary/#status) using the `pre` operator applied to the [command signal](/more/glossary/#command).

This is unless the equipment model that is wrapped inside the component (such as `Fluid.Actuators.Dampers.Exponential`) already provides a status as an output (for instance `y_actual` for actuator and mover models) ***and*** `use_inputFilter=true`.
If `use_inputFilter=false` then `y_actual` is connected to the input signal `y`, which likely yields an algebraic loop if the control logic uses the equipment status.

:::caution Open Issue

Switching to using `pre(y)` instead of `y_actual` if `use_inputFilter=false` is being implemented through [#3499](https://github.com/lbl-srg/modelica-buildings/issues/3499).

:::

This convention implies the following requirement for the SOO implementation.

> The `pre` operator should not be applied to the command signal when comparing it with the feedback signal.<br />
> See the issue reported at https://github.com/lbl-srg/modelica-buildings/pull/2299#issuecomment-1446417462.


## Parameter Record

All design and operating parameters are declared within a Modelica record class. This record is used to

- assign design and operating parameter values for all subcomponents,
- support parameter propagation from a top-level, whole HVAC system parameter record,
- populate the [equipment schedule in the UI](https://docs.google.com/document/d/16Z8HqTi3vNV3HUaa4ijBPVSQvA4MyGTu8bxoGTBD2YI/edit?usp=sharing).

### Implementation Rules

#### Use Only One Nesting Level

If needed, component records must extend (not instantiate) subcomponent records.
For instance in `Templates.Components.Coils.Interfaces.Data`:

- the class cannot extend `Templates.Components.Valves.Interfaces.Data` because of the colliding declarations of `typ`,
- so `dpValve_nominal` is declared locally and a protected record with the type `Templates.Components.Valves.Interfaces.Data` is constructed to pass in parameters to the valve component.

#### Configuration Parameters Must Be Set Through the Component Model, Not Through the Record

Parameter propagation is implemented as follows.

- Structural (configuration) parameters are assigned ***from*** the component model ***to*** the record, and propagated ***up*** the instance tree.
- Design and operating parameters are assigned ***from*** the record ***to*** the component model, and propagated ***down*** the instance tree.

The record for the [controller section](#control-section) needs to be instantiated (not extended) in the master record because it requires many structural parameters (such as `typFanSup`) that have duplicates in the master record.

At the component level, we instantiate the component record and bind (`final`) local parameters to the record elements.

<details>

This implementation is similar to the one from `Fluid.Chillers.ElectricEIR`.

However, other classes such as `Fluid.Actuators.BaseClasses.PartialTwoWayValve` extend the parameter class `Fluid.Actuators.BaseClasses.ValveParameters` to integrate the parameter definitions in a flat structure.

</details>

This allows simpler propagation (only the record is passed in) which is agnostic from the parameter structure of the constraining class (for instance `mWat_flow_nominal` is not defined in `Templates.Components.Coils.Interfaces.PartialCoil`).

<a id="admonConfigParam"></a>

:::caution Subrecord with Configuration Parameters

Currently, all configuration parameters are included in the master record with a flat structure. This makes binding or propagating these parameters impractical, as shown below.

```mo title="Templates/AirHandlersFans/Validation/UserProject/Data/AllSystems.mo"
parameter Buildings.Templates.AirHandlersFans.Data.VAVMultiZone dat_VAV_1(
  final typ=VAV_1.typ,
  final typFanSup=VAV_1.typFanSup,
  final typFanRet=VAV_1.typFanRet,
  final typFanRel=VAV_1.typFanRel,
  ...
  final typCtl=VAV_1.ctl.typ,
  final typSecOut=VAV_1.ctl.typSecOut,
  final buiPreCon=VAV_1.ctl.buiPreCon,
  final stdVen=VAV_1.ctl.stdVen, ...
```

Through issue [#3500](https://github.com/lbl-srg/modelica-buildings/issues/3500) a subrecord `cfg` will be introduced and include all configuration parameters.
This subrecord can be considered as the "signature" for a given system configuration, accessible from any component and any template.

Ongoing template developments should adopt the same construct with a subrecord `cfg` for configuration parameters.
:::

#### Do Not Use Final Bindings for Configuration Parameters

This is because some Modelica tools (Dymola sometimes see SRF00860858, OCT never) trigger a "final overriding" error when a record instance contains final bindings and the record itself is propagated from a higher composition level.

Use `annotation(Dialog(enable=false))` instead when declaring the parameters (configuration parameters are for development use only and should not be exposed to the user).


### Exposed Parameters

#### Design and Operating Parameters

In addition to the configuration parameters, the record contains all design and operating parameters required

1. by the sequence of operation for all possible system configurations, see [ASHRAE (2021)](/more/references#Ashrae21) Section 3,
2. for sizing equipment models (most of these parameters are already included in 1.).

Modeling and advanced parameters ***shall not be included*** in this record.
The record should be viewed as a digital avatar of the manufacturer’s data sheet for a given system, and as such, should only contain equipment and control parameters that HVAC designers are familiar with.


#### System Tags

System tags are optional parameters that are not used for simulation but nevertheless included in the parameter record of each template to support future workflow automation (e.g., parameterization of a template by means of an external [equipment schedule](https://docs.google.com/document/d/16Z8HqTi3vNV3HUaa4ijBPVSQvA4MyGTu8bxoGTBD2YI/edit?usp=sharing)).

```mo title="Templates/AirHandlersFans/Data/PartialAirHandler.mo"
  parameter String id=""
    "System tag"
    annotation (Dialog(tab="Advanced"));
  parameter String id_souChiWat=""
    "CHW supply system tag"
    annotation (Dialog(tab="Advanced", enable=have_souChiWat));
  parameter String id_souHeaWat=""
    "HHW supply system tag"
    annotation (Dialog(tab="Advanced", enable=have_souHeaWat));
```

## System Schematic

Refer to the [specification for the generation of engineering schematics](https://lbl-srg.github.io/ctrl-flow/requirements.html#engineering-schematic) if needed.

### Example

Below is an illustration of the kind of schematic (or control diagram) we want to generate, taken from `Templates.HeatingPlants.HotWater.Validation.BoilerPlant` in branch `issue3266_template_HW_plant`, using Dymola's feature "Show Component".

![schmatic](/img/HWPlant.png)


### Component Icons

:::caution Modelica tool support

Currently the SVG graphics integrated using class annotations such as `Icon(graphics={Bitmap(fileName=<svg-file-path>, visible=<boolean-expression>))` are
- not supported by Modelon Impact: ticket open at Modelon#2022042039000931 on the roadmap for the 2023.1 release,
- not fully supported by OMEdit: most likely due to `<boolean-expression>` not being evaluated at UI runtime,
- entirely supported by Dymola `>=2022.x`.
:::

The master SVG document containing all raw icons provided by Taylor Engineering and used in [ASHRAE (2021)](/more/references#Ashrae21) is currently located at [`Resources/Images/Templates/Icons.svg`](https://github.com/lbl-srg/modelica-buildings/blob/master/Resources/Images/Templates/Icons.svg).

Those raw icons must be processed as described below for Inkscape `>=1.1` before being used in the icon layers of Modelica classes.

<details>

The requirements below stem from the following observations.

- The [Modelica Language Specification](https://specification.modelica.org/maint/3.5/annotations.html#common-definitions) specifies `type DrawingUnit = Real(final unit="mm")`.
- The default icon layer size in Dymola is $200 \times 200$&nbsp;mm (`{{-100,-100},{100,100}}`). This corresponds to $10 \times 10$&nbsp;cells in the icon view. So one cell corresponds to $20 \times 20$&nbsp;mm.
- When instantiated, a component has its icon scaled by a factor $1/10$ in the diagram layer. For instance, a `Line` object with `thickness=5` in the icon layer is rendered as a `Line` object with `thickness=0.5` in the diagram layer.
- When `thickness < 0.25`, the stroke width remains unchanged in Dymola: so $0.2$ and $0.1$ yield the same stroke width.
- It seems that Dymola handles Bitmap objects as squares, i.e., the objects are scaled by the minimum of the `x` and `y` dimensions. Having external SVG files with equal height and width makes it easier to position and scale the graphical objects.

</details>

- Select object, copy to new file.
- Change stroke color to black and stroke width to $1$&nbsp;mm.
- Account for $20$&nbsp;mm for each grid cell in Dymola icon layer.
  - So the default icon layer size of $10 \times 10$&nbsp;cells in Dymola corresponds to a page size of $200 \times 200$&nbsp;mm in Inkscape.
- For most of the AHU components, lock width/height ratio and change height to $200$&nbsp;mm.
  - For transducers, $200$&nbsp;mm is for the probe, $80$&nbsp;mm is for the sensor casing.
- For polygons, the different segments will typically not be connected together (gap at each corner), so select each segment with `Node` tool and use `Node` functionalities to
  - `Convert selected objects to path`
  - `Join selected nodes`
  - For the last corner use `Path/Union`
- Text should be in sans-serif with font size of $120$.
  - If needed (typically in case of specific text orientation), select text object and transform to path with `Path/Object to Path`.
- Set the page size with the same height and width (typically $200 \times 200$&nbsp;mm) and center icons in the page.
- Save as Inkscape SVG.


### Graphical Primitives

In addition to external SVG files, the schematics may use Modelica graphical primitives with the following conventions.

 | Equipment                                                         | Primitive            | Icon layer                         | Diagram layer                     |
 | ----------------------------------------------------------------- | -------------------- | ---------------------------------- | --------------------------------- |
 | Supply pipe (*)                                                   | Line, solid          | Thickness $0.5$                      | Thickness $5$                       |
 | Return pipe (*)                                                   | Line, dashed         | Thickness $0.5$                      | Thickness $5$                       |
 | Duct wall                                                         | Line, solid          | Default thickness ($0.25$)           | Default thickness ($0.25$)          |
 | Capillary tube (pressure sensor)                                  | Polygon or rectangle | Default thickness ($0.25$), width $10$ | Default thickness ($0.25$), width $1$ |
 | Motor shaft (actuator), connection between sensor and transmitter | Line, solid          | Default thickness ($0.25$)           | Default thickness ($0.25$)          |

*(\*) This should be specified as a graphical annotation to the corresponding connect statement.*

Graphical primitives that need to be pruned to generate the system schematic shall use the annotation `visible=viewDiagramAll` where `viewDiagramAll` is declared in the template interface class with:

```mo
inner parameter Boolean viewDiagramAll=false
  "Set to true to view all component icons in diagram view"
  annotation (Dialog(tab="Graphics"));
```


## Vendor Specific Annotations

All vendor annotations are hierarchical annotations in the form of `"__ctrlFlow" class-modification`. Strict camel case formatting is used for any argument in the class modification. No simple annotation in the form of `"__ctrlFlow" "_" IDENT` is used.

### Class Annotations

#### `__ctrlFlow(template=true|false)`

:::danger FIXME

It is uncanny to use a hierarchical annotation here because `__ctrlFlow(template=false)` will never be used. Prefer `__ctrlFlow_template` which is also easier to test for?
:::

Ctrl-flow greps for this annotation and returns a list of files which are then treated as entry points to build the tree of system types. Both packages (corresponding to system types such as `Templates.AirHandlersFans`) and template classes (such as `Templates.AirHandlersFans.VAVMultiZone`) shall contain this annotation.

So the file arborescence:

```sh
Templates
├── AirHandlersFans
│   ├── ...
│   ├── package.mo  # Contains __ctrlFlow_template annotation
│   └── VAVMultiZone.mo  # Contains __ctrlFlow_template annotation
├── Components
│   └── ...
├── Data
│   ├── AllSystems.mo
│   ├── package.mo
│   └── ...
├── package.mo
├── package.order
├── Types.mo
├── UsersGuide.mo
└── ZoneEquipment
    ├── ...
    ├── package.mo  # Contains __ctrlFlow_template annotation
    ├── VAVBoxCoolingOnly.mo  # Contains __ctrlFlow_template annotation
    └── VAVBoxReheat.mo  # Contains __ctrlFlow_template annotation
```

yields the following UI objects:

![control](/img/list_systems_ui.png)


:::caution Currently patched

Currently, (as of MBL commit `88b6ccdd08`) this annotation is not included in the Modelica classes but rather patched when preprocessing the Templates package to serve ctrl-flow app.
The necessary refactoring is tracked at [#357](https://github.com/lbl-srg/ctrl-flow-dev/issues/357).

:::

<details>

<summary>Alternative Approach Discussed With DEPT but Not Implemented</summary>

> We should rather use a flag indicating that a package (in our case `Templates`) is to be considered as the "root" for all template URIs, for instance: `__ctrlFlow(routing="root")`. And for each template class (for instance `Templates.AirHandlersFans.VAVMultiZone`): `__ctrlFlow(routing="template")`. The contract for the template developer will then be that the class URI dictates the explorer tree structure, starting from the "root" package (necessarily unique inside a library). So for instance the template `Templates.AirHandlersFans.VAVMultiZone` with the above annotation would yield the following tree structure.
> ```sh
> AirHandlersFans
> └── VAVMultiZone
> ```
> Without having to add any annotation to the subpackage `Templates.AirHandlersFans`. So we would implicitly consider each folder between `routing="template"` and `routing="root"` to be a template category (like "Air Handlers and Fans").

</details>

### Declaration Annotations


#### `__ctrlFlow(enable=true|false)`

Each declaration or `extends` statement may have a hierarchical annotation `"__ctrlFlow" "(" "enable" "=" logical-expression ")"` that allows disabling input fields in ctrl-flow configuration dialog. This is similar to Modelica annotation `Dialog(enable=true|false)` but provides additional flexibility and allows disabling all parameter input fields that are brought in by an `extends` statement.

It takes precedence on the standard annotation `Dialog(enable)`.

Typical use cases include classes from the Modelica Buildings Library that contain definitions of detailed simulation parameters and that are extended to define template components, or package classes used to specify the fluid properties.

<details>

<summary>Boolean Literal or Expression?</summary>

Although only Boolean literals are used in the templates as of commit 675801b669, the expression evaluation engine is invoked when parsing `__ctrlFlow(enable...)`, see https://github.com/lbl-srg/ctrl-flow-dev/blob/main/server/src/parser/parser.ts#L296-L317. So in practice, Boolean expressions could be used.

</details>

## Code Base

### Git Workflow

Each new development should start by branching out from the master branch of MBL.

The current development branches are

- `issue1374_template_CHW_final`
- `issue3266_template_HW_plant`

### Code Tags

The development of templates usually requires several iterations with the author of the CDL implementation of the SOO.
This takes time. Code tags have proven useful in this context.

We adopt the code tags from [PEP 350](https://peps.python.org/pep-0350/#mnemonics) to reference issues and feature enhancements directly in the Modelica code base.
All tags should include one of the tag names below in all caps, followed by the name, e-mail address, or other identifier of the person with the best context about the problem, and the GH issue number if available.
We keep it simple and only use:

- `BUG` for what prevents from translating or simulating a model: ***should prevent merging***
- `FIXME` for any problematic code not suitable for production: ***should prevent merging***, include [PEP 350](https://peps.python.org/pep-0350/#mnemonics) `TODO` under that code tag
- `HACK` mainly for workarounds related to Modelica tools' limitations: reference the ticket number from the Modelica tool provider if available
- `RFE` for a clearly identified development need (as opposed to an idea)

For example:
```mo
// FIXME(AntoineGautier #1913): Should be conditional, depending on have_fanRel.
```

So we can collect all code tags with:

```sh
grep -nER '(^|/(\*|/)|<!--|")\s*(BUG|FIXME|HACK|RFE)' Templates/.
```
