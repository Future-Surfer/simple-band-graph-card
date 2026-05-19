# Simple Band Graph Card

A Home Assistant custom card for simple line graphs with configurable coloured threshold bands.

It is designed for sensors where coloured context bands make the graph easier to read, such as CO₂, air quality, temperature, humidity, battery level, energy use, or anything else with meaningful thresholds.

[![Open your Home Assistant instance and add this repository to HACS.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=Future-Surfer&repository=simple-band-graph-card&category=plugin)

## Features

- Select a Home Assistant entity
- Show recent Home Assistant history as a simple line graph
- Define custom coloured threshold bands
- Set the graph duration with `hours_to_show`
- Set minimum and maximum Y-axis values
- Display the current entity value and unit
- Show the current threshold band in the ribbon
- Configure top and bottom ribbon content
- Style each ribbon segment independently
- Configure band label content, position, alignment and styling
- Place band labels inside or outside the graph area
- Show optional latest, minimum and maximum value markers
- Style marker labels and marker label backgrounds
- Optionally match marker label backgrounds to the current band colour
- Configure X-axis and Y-axis visibility, position, tick count and label styling
- Add optional X-grid and Y-grid lines
- Configure graph line colour, width and opacity

## Installation

### HACS custom repository

Use the button above, or add the repository manually:

1. Open **HACS** in Home Assistant.
2. Open the three-dot menu in the top right.
3. Select **Custom repositories**.
4. Add this repository URL:

```text
https://github.com/Future-Surfer/simple-band-graph-card
```

5. Select the category/type:

```text
Dashboard
```

6. Click **Add**.
7. Search HACS for **Simple Band Graph Card**.
8. Download/install it.
9. Refresh your browser.

If the card is not added to your dashboard resources automatically, add this resource manually:

```yaml
url: /hacsfiles/simple-band-graph-card/simple-band-graph-card.js
type: module
```

### Manual installation

Download `simple-band-graph-card.js` and place it in:

```text
/config/www/simple-band-graph-card.js
```

Then add this dashboard resource:

```yaml
url: /local/simple-band-graph-card.js
type: module
```

## Examples

<details>
<summary>Basic example</summary>

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

</details>

<details>
<summary>Advanced example</summary>

```yaml
type: custom:simple-band-graph-card
entity: sensor.example_co2
name: Office CO₂
height: 180
hours_to_show: 10
y_min: 400
y_max: 2000

show_line: true
line_color: var(--primary-color)
line_width: 3
line_opacity: 1

show_x_grid: false
show_y_grid: true
grid_color: var(--divider-color)
grid_width: 1
grid_opacity: 0.25

band_label_mode: threshold
band_label_unit: false
band_label_position: middle
band_label_align: outside_left
band_label_outside_width: auto
band_label_outside_gap: 6
band_label_size: 11
band_label_weight: 600
band_label_color: var(--secondary-text-color)
band_label_opacity: 0.8
hide_small_band_labels: true
min_band_label_height: 18

marker_label_size: 10
marker_label_weight: 600
marker_label_color: var(--primary-text-color)
marker_label_opacity: 0.95
marker_label_background_mode: band
marker_label_background_opacity: 0.85

show_x_axis: true
show_x_axis_labels: true
x_axis_position: bottom
x_axis_label_mode: relative
x_axis_ticks: 5

show_y_axis: true
show_y_axis_labels: true
y_axis_position: right
y_axis_ticks: 5

axis_label_size: 11
axis_label_weight: 400
axis_label_color: var(--secondary-text-color)
axis_label_opacity: 0.8

top_left: name
top_center: band
top_right: current
bottom_left: debug
bottom_center: none
bottom_right: none

ribbon_styles:
  top_left:
    font_size: 16
    font_weight: 600
    color: var(--primary-text-color)
  top_center:
    font_size: 15
    font_weight: 600
    color: var(--secondary-text-color)
    opacity: 0.9
  top_right:
    font_size: 22
    font_weight: 700
    color: var(--primary-text-color)
  bottom_left:
    font_size: 12
    font_weight: 400
    color: var(--secondary-text-color)
    opacity: 0.65

show_latest: true
show_latest_label: true
latest_marker_size: 4

show_min: false
show_max: true
hide_recent_min: true
hide_recent_max: false
recent_extrema_minutes: 30
show_extrema_labels: true
extrema_marker_size: 4

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

</details>

## Configuration

### Core options

| Option | Required | Default | Description |
|---|---:|---:|---|
| `entity` | Yes |  | The Home Assistant entity to graph. |
| `name` | No | Entity ID | Custom card title. |
| `hours_to_show` | No | `24` | Number of hours of history to display. |
| `height` | No | `180` | Graph height in pixels. |
| `y_min` | No | `0` | Minimum Y-axis value. |
| `y_max` | No | `100` | Maximum Y-axis value. |
| `bands` | No | `[]` | List of coloured threshold bands. |

### Bands

Each band supports:

| Option | Description |
|---|---|
| `from` | Lower value for the band. |
| `to` | Upper value for the band. |
| `color` | Band colour. Hex colours with alpha work well, e.g. `#2ecc7133`. |
| `label` | Optional label for the band. |

### Band label options

| Option | Default | Description |
|---|---:|---|
| `band_label_mode` | `label` | Controls what is shown in each band label. Options: `hide`, `label`, `threshold`, `range`. |
| `band_label_unit` | `false` | Adds the entity unit to threshold/range labels. |
| `band_label_position` | `top` | Vertical position. Options: `top`, `middle`, `bottom`. Older aliases `high`, `mid`, `low` also work. |
| `band_label_align` | `left` | Horizontal position. Options: `left`, `center`, `right`, `outside_left`, `outside_right`. |
| `band_label_outside_width` | `auto` | Reserved width for outside band labels. Use `auto` or a number. |
| `band_label_outside_gap` | `6` | Gap between outside band labels and the graph area. |
| `band_label_size` | `11` | Band label font size. |
| `band_label_weight` | `400` | Band label font weight. |
| `band_label_color` | `var(--secondary-text-color)` | Band label text colour. |
| `band_label_opacity` | `0.75` | Band label opacity. |
| `hide_small_band_labels` | `false` | Hide labels where the band is too small. |
| `min_band_label_height` | `18` | Minimum band height before labels are hidden, when `hide_small_band_labels` is enabled. |

### Line options

| Option | Default | Description |
|---|---:|---|
| `show_line` | `true` | Show or hide the graph line. |
| `line_color` | `var(--primary-color)` | Graph line colour. |
| `line_width` | `3` | Graph line width. |
| `line_opacity` | `1` | Graph line opacity. |

### Axis options

| Option | Default | Description |
|---|---:|---|
| `show_x_axis` | `true` | Show or hide the X-axis line. |
| `show_x_axis_labels` | `true` | Show or hide X-axis labels. |
| `x_axis_position` | `bottom` | X-axis position. Options: `bottom`, `top`. |
| `x_axis_label_mode` | `relative` | X-axis label mode. Options: `relative`, `time`. |
| `x_axis_ticks` | `3` | Number of X-axis tick labels. |
| `show_y_axis` | `true` | Show or hide the Y-axis line. |
| `show_y_axis_labels` | `true` | Show or hide Y-axis labels. |
| `y_axis_position` | `left` | Y-axis position. Options: `left`, `right`. |
| `y_axis_ticks` | `2` | Number of Y-axis tick labels. |
| `axis_label_size` | `11` | Shared axis label font size. |
| `axis_label_weight` | `400` | Shared axis label font weight. |
| `axis_label_color` | `var(--secondary-text-color)` | Shared axis label colour. |
| `axis_label_opacity` | `0.8` | Shared axis label opacity. |

### Grid options

| Option | Default | Description |
|---|---:|---|
| `show_x_grid` | `false` | Show vertical grid lines. |
| `show_y_grid` | `false` | Show horizontal grid lines. |
| `grid_color` | `var(--divider-color)` | Grid line colour. |
| `grid_width` | `1` | Grid line width. |
| `grid_opacity` | `0.35` | Grid line opacity. |

### Ribbon options

The card has six configurable ribbon slots:

```yaml
top_left: name
top_center: band
top_right: current
bottom_left: debug
bottom_center: none
bottom_right: none
```

Supported slot values:

| Value | Description |
|---|---|
| `none` | Empty slot. |
| `name` | Card name. |
| `current` | Current entity value and unit. |
| `band` | Current threshold band label. |
| `debug` | Debug/status information. |
| `status` | Alias for `debug`, kept for backwards compatibility. |
| `entity` | Entity ID. |
| `unit` | Entity unit. |

### Latest, minimum and maximum markers

| Option | Default | Description |
|---|---:|---|
| `show_latest` | `false` | Show a marker for the current live value. |
| `show_latest_label` | `true` | Show a label for the latest marker. |
| `latest_marker_size` | `4` | Latest marker dot size. |
| `show_min` | `false` | Show a marker for the minimum value in the displayed history. |
| `show_max` | `false` | Show a marker for the maximum value in the displayed history. |
| `show_extrema_labels` | `true` | Show labels for min/max markers. |
| `extrema_marker_size` | `4` | Min/max marker dot size. |
| `hide_recent_min` | `true` | Hide the min marker when it is very recent. |
| `hide_recent_max` | `false` | Hide the max marker when it is very recent. |
| `recent_extrema_minutes` | `30` | Time window used by `hide_recent_min` and `hide_recent_max`. |

## Notes

Home Assistant history only records changes. If an entity has not changed recently, the latest history point may be some distance before the current time. This card appends the current live value at `now` when drawing the graph, so the line reaches the live edge of the chart.

Minimum and maximum markers are calculated from real Home Assistant history only, not from the artificial current-at-now point.

## Status

Work in progress, but functional. The card can load Home Assistant history and render a configurable threshold-banded line graph.

## Roadmap

Planned or possible future features:

- Visual editor support in the Home Assistant UI
- More marker dot styling options
- Optional dynamic messages based on the current threshold band
- More compact presets
- More examples and screenshots
- Packaging/polish for a wider HACS release

## License

MIT License.
