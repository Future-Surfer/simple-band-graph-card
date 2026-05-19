# Simple Band Graph Card

Early work-in-progress Home Assistant custom card for simple line graphs with configurable coloured threshold bands.

## Planned features

- Select a Home Assistant entity
- Show recent history as a simple line graph
- Define custom coloured threshold bands
- Set the graph duration
- Set minimum and maximum Y-axis values

## Example

```yaml
type: custom:simple-band-graph-card
entity: sensor.example_co2
name: Office CO₂
hours_to_show: 24
y_min: 400
y_max: 2000
bands:
  - from: 0
    to: 800
    color: "#2ecc7133"
    label: Good
  - from: 800
    to: 1100
    color: "#f1c40f33"
    label: OK
  - from: 1100
    to: 1500
    color: "#e67e2233"
    label: Stale
  - from: 1500
    to: 9999
    color: "#e74c3c33"
    label: Poor
