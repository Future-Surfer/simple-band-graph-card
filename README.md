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
- Downsample large history responses automatically for performance
- Show optional debug and performance diagnostics

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
<summary>Basic CO₂ example</summary>

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
<summary>Temperature example</summary>

```yaml
type: custom:simple-band-graph-card
entity: sensor.living_room_temperature
name: Living Room Temperature
height: 150
hours_to_show: 48
y_min: 14
y_max: 24

top_left: name
top_center: band
top_right: current

band_label_mode: range
band_label_unit: true
band_label_position: middle
band_label_align: outside_right
band_label_outside_width: auto

show_y_axis_labels: true
y_axis_position: left
y_axis_ticks: 6

show_x_axis_labels: true
x_axis_ticks: 5

show_y_grid: true

show_latest: true
show_latest_label: true
show_min: true
show_max: true
marker_label_background_mode: band

bands:
  - from: 14
    to: 17
    color: "#3498db33"
    label: Cool
  - from: 17
    to: 20
    color: "#2ecc7133"
    label: Comfortable
  - from: 20
    to: 22
    color: "#f1c40f33"
    label: Warm
  - from: 22
    to: 24
    color: "#e67e2233"
    label: Hot
```

</details>

<details>
<summary>Solar generation example</summary>

```yaml
type: custom:simple-band-graph-card
entity: sensor.example_solar_generation
name: Solar Generation
height: 155
hours_to_show: 48
y_min: 0
y_max: 2500

top_left: name
top_center: band
top_right: current

band_label_mode: threshold
band_label_position: middle
band_label_align: outside_left
band_label_outside_width: auto

show_y_axis_labels: true
y_axis_position: right
y_axis_ticks: 6

show_x_axis_labels: true
x_axis_ticks: 5

show_y_grid: true

show_latest: true
show_latest_label: true
show_max: true
show_min: false
marker_label_background_mode: band

bands:
  - from: 0
    to: 250
    color: "#95a5a633"
    label: Minimal
  - from: 250
    to: 1000
    color: "#f1c40f33"
    label: Useful
  - from: 1000
    to: 1800
    color: "#2ecc7133"
    label: Good
  - from: 1800
    to: 2500
    color: "#27ae6033"
    label: Excellent
```

</details>

<details>
<summary>Debug and performance example</summary>

```yaml
type: custom:simple-band-graph-card
entity: sensor.example_co2
name: CO₂ Debug Test
height: 190
hours_to_show: 100
y_min: 400
y_max: 2000

max_history_points: auto
history_refresh_interval: 60

top_left: name
top_center: band
top_right: current
bottom_left: debug

debug_multiline: true
debug_level: performance

ribbon_styles:
  bottom_left:
    font_size: 11
    font_weight: 400
    color: var(--secondary-text-color)
    opacity: 0.7

band_label_mode: threshold
band_label_position: middle
band_label_align: outside_left
band_label_outside_width: auto

show_y_axis_labels: true
y_axis_position: right
y_axis_ticks: 5

show_x_axis_labels: true
x_axis_ticks: 6

show_y_grid: true
grid_opacity: 0.25

show_latest: true
show_latest_label: true
show_max: true
marker_label_background_mode: band

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

max_history_points: auto
history_refresh_interval: 60

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

debug_multiline: true
debug_level: performance

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
    font_size: 11
    font_weight: 400
    color: var(--secondary-text-color)
    opacity: 0.7

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

### History and performance options

| Option | Default | Description |
|---|---:|---|
| `max_history_points` | `auto` | Maximum number of history points to plot after fetching. `auto` currently targets about `500` plotted points. Use a number to override. |
| `history_refresh_interval` | `60` | Minimum time, in seconds, between full history API refreshes. The card can still update the current value between history refreshes. |
| `debug_level` | `basic` | Debug detail level. Options: `off`, `basic`, `performance`, `verbose`. |
| `debug_multiline` | `false` | Shows debug output over multiple lines. Useful with `debug_level: performance` or `debug_level: verbose`. |
| `debug_performance` | `false` | Backwards-compatible shortcut. If set to `true`, defaults `debug_level` to `performance`. |

The card requests detailed Home Assistant history and then downsamples locally if needed. This keeps the visible graph responsive while preserving useful spikes and high/low points.

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

Band label modes:

| Mode | Example |
|---|---|
| `hide` | No label |
| `label` | `Good` |
| `threshold` | `Good 400+` |
| `range` | `Good 400–800` |

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

Grid lines use the same intervals as `x_axis_ticks` and `y_axis_ticks`.

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

| Option | Default | Description |
|---|---:|---|
| `top_left` | `name` | Content for the top-left ribbon slot. |
| `top_center` | `none` | Content for the top-centre ribbon slot. |
| `top_right` | `current` | Content for the top-right ribbon slot. |
| `bottom_left` | `none` | Content for the bottom-left ribbon slot. |
| `bottom_center` | `none` | Content for the bottom-centre ribbon slot. |
| `bottom_right` | `none` | Content for the bottom-right ribbon slot. |
| `ribbon_styles` | `{}` | Per-slot style overrides. |

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

Each ribbon position can be styled:

```yaml
ribbon_styles:
  top_left:
    font_size: 16
    font_weight: 600
    color: var(--primary-text-color)
  top_right:
    font_size: 22
    font_weight: 700
    color: var(--primary-text-color)
  bottom_left:
    font_size: 11
    font_weight: 400
    color: var(--secondary-text-color)
    opacity: 0.7
```

Supported ribbon style options:

| Option | Description |
|---|---|
| `font_size` | Font size in pixels, or a CSS value. |
| `font_weight` | Font weight. |
| `color` | Text colour. |
| `opacity` | Text opacity. |
| `text_transform` | CSS text transform, e.g. `uppercase`. |
| `letter_spacing` | CSS letter spacing. |

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

### Marker label options

| Option | Default | Description |
|---|---:|---|
| `marker_label_size` | `11` | Marker label font size. |
| `marker_label_weight` | `400` | Marker label font weight. |
| `marker_label_color` | `var(--primary-text-color)` | Marker label text colour. |
| `marker_label_opacity` | `0.9` | Marker label opacity. |
| `marker_label_background_color` | `var(--card-background-color)` | Marker label background colour. |
| `marker_label_background_opacity` | `0.75` | Marker label background opacity. |
| `marker_label_background_mode` | `card` | Background mode. Options: `card`, `band`. |

Use this to match marker label backgrounds to the relevant band colour:

```yaml
marker_label_background_mode: band
```

## Debug output

The debug slot can be added to any ribbon position:

```yaml
bottom_left: debug
debug_multiline: true
debug_level: performance
```

Debug levels:

| Level | Description |
|---|---|
| `off` | No debug output. |
| `basic` | Shows history window, fetch age, raw/plotted/path point counts, refresh interval and axis range. |
| `performance` | Adds fetch/API/downsample/render timings, render count, downsampling ratio and point density. |
| `verbose` | Adds first/last history point age and requested history window details. |

Example performance output:

```text
debug · 100h · fetched 12s ago
raw 1294 · plotted 500 · path 501 · max auto/500
refresh 60s · full history request
y 400-2000 · x relative
fetch 82ms · api 76ms · downsample 2ms
render 9ms · renders 14
downsample yes · ratio 39% · density 12.9/h
```

## Notes

Home Assistant history records state changes rather than regular samples. This card requests detailed history for the selected time window and then downsamples locally when needed.

When `max_history_points` is set to `auto`, the card currently targets about `500` plotted history points. The downsampling keeps the first and last points and tries to preserve local highs and lows, which helps retain short spikes.

The card appends the current live value at `now` when drawing the graph, so the line reaches the live edge of the chart without requiring a full history refresh every time the entity state changes.

Minimum and maximum markers are calculated from real Home Assistant history only, not from the artificial current-at-now point.

## Status

Work in progress, but functional. The card can load Home Assistant history and render a configurable threshold-banded line graph with optional markers, axes, grid lines, ribbon content and debug diagnostics.

## Roadmap

Planned or possible future features:

- Visual editor support in the Home Assistant UI
- More marker dot styling options
- Optional prefixed min/max labels, e.g. `Max 1234ppm`
- Optional dynamic messages based on the current threshold band
- More compact presets
- Additional data-source modes for longer-range statistics
- More examples and screenshots
- Packaging/polish for a wider HACS release

## License

MIT License.
