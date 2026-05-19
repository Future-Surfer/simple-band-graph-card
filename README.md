# Simple Band Graph Card

A work-in-progress Home Assistant custom card for simple line graphs with configurable coloured threshold bands.

It is designed for sensors where coloured context bands make the graph easier to read, such as CO₂, air quality, temperature, humidity, battery level, energy use, or anything else with meaningful thresholds.

## Features

- Select a Home Assistant entity
- Show recent history as a simple line graph
- Define custom coloured threshold bands
- Set the graph duration with `hours_to_show`
- Set minimum and maximum Y-axis values
- Display the current entity value and unit

## Example

```yaml
type: custom:simple-band-graph-card
entity: sensor.example_co2
name: Office CO₂
hours_to_show: 24
y_min: 400
y_max: 2000
bands:
  - from: 400
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
    to: 2000
    color: "#e74c3c33"
    label: Poor
```

## Configuration

| Option | Required | Description |
|---|---:|---|
| `entity` | Yes | The Home Assistant entity to graph. |
| `name` | No | Custom card title. Defaults to the entity ID. |
| `hours_to_show` | No | Number of hours of history to display. Defaults to `24`. |
| `height` | No | Graph height in pixels. Defaults to `180`. |
| `y_min` | No | Minimum Y-axis value. Defaults to `0`. |
| `y_max` | No | Maximum Y-axis value. Defaults to `100`. |
| `bands` | No | List of coloured threshold bands. |

Each band supports:

| Option | Description |
|---|---|
| `from` | Lower value for the band. |
| `to` | Upper value for the band. |
| `color` | Band colour. Hex colours with alpha work well, e.g. `#2ecc7133`. |
| `label` | Optional label shown inside the band. |

## Status

Early work in progress. The card can now load Home Assistant history and render a basic threshold-banded graph.

## License

MIT License.
