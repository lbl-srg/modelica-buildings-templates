---
sidebar_position: 1
---

# Glossary

## Templating

### System

See [below](#component-system).

### Configuration

A system configuration corresponds to the specification of the type and layout of the equipment and the corresponding control logic. Systems with different capacities may have the same configuration, provided they have the same control software and hardware type.

### Parameterization

By parameterization we mean all possible class modifications, such as changing parameter values and redeclaring components or classes, which we refer to as class parameterization.

### Structural and value parameters

We use the term structural parameters if a parameter affects the number and structure of the equations, and value parameters if they do not. An example of a structural parameter is a parameter used to specify an array size.

###  Template

A template, or template class, is defined as a Modelica model that can be parameterized (as defined above) to represent a particular system configuration.


## HVAC Systems

### Source, Load

We adopt the definitions from [ASHRAE (2021)](./references#Ashrae21) Section 5.1.19.1.

> A component is a “source” if it provides resources to a downstream component, such as a chiller providing chilled water (CHW) to an AHU.<br />
> A component is a “load” if it receives resources from an upstream component, such as an AHU that receives CHW from a chiller.<br />
> The same component may be both a load (receiving resources from an upstream source) and a source (providing resources to a downstream load).

### Component, System

We adopt the definitions from [ASHRAE (2021)](./references#Ashrae21) Section 5.1.19.1.

> A set of components is a system if they share a load in common (i.e., collectively act as a source to downstream equipment, such as a set of chillers in a lead/lag relationship serving air handlers).
> - Each air handler constitutes its own separate system because they do not share a load in common. Each AHU is a load to the CHW pump system and a source to its own VAV boxes.
> - Each VAV box constitutes its own system because they do not share a load in common. Each VAV box is a load to its AHU only (no relationship to the other AHUs) and a source to the rooms that it serves.


### Command

Command is used for the DO signal sent to switch On/Off an equipment.

- Abbreviated as `y1<instance-name>`

See also [Enable](#enable).


### Enable

For VFDs, Enable is a special contact on the VFD panel typically hardwired to a relay logic for safety (see [ASHRAE (2021)](./references#Ashrae21) Figure A-9 for instance). This is not the same as the DO point that actually starts the equipment (On/Off command or Start signal) which is wired to VFD Run contact.

Enable is used differently for an equipment with built-in control (e.g. chiller or boiler) where the On/Off command is wired to the Enable contact on the control panel (see [ASHRAE (2021)](./references#Ashrae21) Section 4.11.1). There is no Run contact in that case: Enable is used in lieu of Run.

- Abbreviated as `y1<instance-name>`

### Status

Status is used for the current On/Off state of a device as reported by the hardware itself. It is thus a DI signal returned by an equipment that can be switched On and Off such as a pump, fan or chiller.

- Abbreviated as `y1<instance-name>_actual`

For 2-position actuators: ***open or closed end switch status*** is used.

- Abbreviated as `y1<instance-name>_actual` and `y0<instance-name>_actual` for open and closed end switch status, respectively

### Commanded (Position | Speed)

Used for the AO signal sent to an equipment.

- Abbreviated as `y<instance-name>`

### Position Feedback

Position feedback is used for the AI signal returned by a modulating actuator.

- Abbreviated as `y<instance-name>_actual`

For two-position actuators, use [open or closed end switch status](#status).

### Setpoint

It is defined as the desired value of the process variable which is controlled.

Spelled in ***one word***, that is "setpoint" as opposed to "set point".

<details>

This varies across ASHRAE’s publications: [ASHRAE (2021)](./references#Ashrae21) uses one word but FUNDAMENTALS OF CONTROL uses two words. Most sources (including Aström’s PID Controllers) use one word though.
</details>

### Supply, Return, Entering, Leaving

For the attributes pertaining to a quantity, use supply or return, and entering or leaving.

### Inlet, Outlet

Restrict the use of inlet and outlet for a location, such as inlet sensor or outlet valve.
