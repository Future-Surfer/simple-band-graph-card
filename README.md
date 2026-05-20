# Simple Band Graph Card

<img width="699" height="400" alt="image" src="https://github.com/user-attachments/assets/5e072bc8-392e-4a6c-92f5-d10527977368" />



A Home Assistant custom card for simple line graphs with configurable coloured threshold bands.

It is designed for sensors where coloured context bands make the graph easier to read, such as CO₂, air quality, temperature, humidity, battery level, energy use, solar generation, or anything else with meaningful thresholds.

[![Open your Home Assistant instance and add this repository to HACS.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=Future-Surfer&repository=simple-band-graph-card&category=plugin)

## Features

- Display recent Home Assistant entity history as a clean line graph
- Define custom coloured threshold bands with configurable labels
- Set graph duration and Y-axis range with `hours_to_show`, `y_min` and `y_max`
- Configure top and bottom ribbon content, including name, current value, band, min/max, debug text, custom text and graph duration
- Style ribbon text, backgrounds and band-driven colours
- Configure separate backgrounds for the card, plot area, top ribbon and bottom ribbon
- Optionally drive card, plot or ribbon background colours from the current band
- Show, hide and position band labels inside or outside the graph area
- Show optional latest, minimum and maximum value markers with configurable labels
- Configure X/Y axes, tick labels and optional grid lines
- Customise graph line colour, width and opacity
- Use `line_color_mode: band` to colour the graph line by threshold band
- Automatically downsample large history responses for better performance
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

## Examples

<details open>
<summary>Minimal example</summary>
<img width="718" height="411" alt="image" src="https://github.com/user-attachments/assets/7b392cd7-310e-47ee-8c85-eebd75916142" />

The smallest useful card: one entity, one graph, and a few coloured bands.

```yaml
type: custom:simple-band-graph-card
entity: sensor.example_co2
name: Office CO₂
y_min: 400
y_max: 2000

band_opacity: 0.18

show_x_axis: false
show_x_axis_labels: false
show_y_axis: false
show_y_axis_labels: false

bands:
  - from: 400
    to: 800
    color: "#2ecc71"
  - from: 800
    to: 1100
    color: "#f1c40f"
  - from: 1100
    to: 1500
    color: "#e67e22"
  - from: 1500
    to: 2000
    color: "#e74c3c"
```

</details>

<details>
<summary>Ribbon message example</summary>
<img width="721" height="507" alt="image" src="https://github.com/user-attachments/assets/c8beef94-b952-4374-95f5-5673f7fd0e10" />

Shows a band-specific message in the bottom ribbon.

```yaml
type: custom:simple-band-graph-card
entity: sensor.example_co2
name: Office CO₂
hours_to_show: 12
y_min: 400
y_max: 2000

band_opacity: 0.18

top_left: name
top_center: none
top_right: duration

bottom_left: none
bottom_center: message
bottom_right: none

duration_format: short

bottom_ribbon_background_color_mode: band
bottom_ribbon_background_opacity: 0.35
ribbon_background_radius: 10

bottom_center_font_size: 15
bottom_center_font_weight: 700
bottom_center_opacity: 1

bands:
  - from: 400
    to: 800
    color: "#2ecc71"
    label: Good
    message: Air quality is good
  - from: 800
    to: 1100
    color: "#f1c40f"
    label: OK
    message: Air quality is OK
  - from: 1100
    to: 1500
    color: "#e67e22"
    label: Stale
    message: Air is getting stale
  - from: 1500
    to: 2000
    color: "#e74c3c"
    label: Poor
    message: Open a window
```

</details>

<details>
<summary>Band-coloured line example</summary>
<img width="730" height="433" alt="image" src="https://github.com/user-attachments/assets/3d434498-f8f8-4862-b816-b32883007bfc" />

Uses translucent bands with a stronger band-coloured line on top.

```yaml
type: custom:simple-band-graph-card
entity: sensor.example_co2
name: CO₂ Band Line
hours_to_show: 24
y_min: 400
y_max: 2000

band_opacity: 0.14

line_color_mode: band
line_width: 4
line_opacity: 1

top_left: name
top_center: band
top_right: current

bands:
  - from: 400
    to: 800
    color: "#2ecc71"
    label: Good
  - from: 800
    to: 1100
    color: "#f1c40f"
    label: OK
  - from: 1100
    to: 1500
    color: "#e67e22"
    label: Stale
  - from: 1500
    to: 2000
    color: "#e74c3c"
    label: Poor
```

</details>

<details>
<summary>Band-driven background example</summary>
<img width="721" height="452" alt="image" src="https://github.com/user-attachments/assets/78cf9770-c893-4344-83d5-a66930b0948d" />

Hides the visible band stripes and uses the current band to colour the plot and ribbon backgrounds.

```yaml
type: custom:simple-band-graph-card
entity: sensor.example_co2
name: Office CO₂
hours_to_show: 12
y_min: 400
y_max: 2000

show_bands: false

plot_background_color_mode: band
plot_background_opacity: 0.12

top_ribbon_background_color_mode: band
top_ribbon_background_opacity: 0.22
ribbon_background_radius: 10

top_left: name
top_center: band
top_right: current

bands:
  - from: 400
    to: 800
    color: "#2ecc71"
    label: Good
  - from: 800
    to: 1100
    color: "#f1c40f"
    label: OK
  - from: 1100
    to: 1500
    color: "#e67e22"
    label: Stale
  - from: 1500
    to: 2000
    color: "#e74c3c"
    label: Poor
```

</details>

<details>
<summary>Outside band labels example</summary>
<img width="719" height="423" alt="image" src="https://github.com/user-attachments/assets/b3f69fec-0fd4-4270-bde2-57df90f6ea89" />

Places band labels outside the graph area. This is useful when bands are narrow or when you want a cleaner plot.

```yaml
type: custom:simple-band-graph-card
entity: sensor.living_room_temperature
name: Living Room Temperature
hours_to_show: 48
y_min: 14
y_max: 24

band_opacity: 0.18

top_left: name
top_center: band
top_right: current

band_label_mode: range
band_label_unit: true
band_label_position: middle
band_label_align: outside_right
band_label_outside_width: auto

bands:
  - from: 14
    to: 17
    color: "#3498db"
    label: Cool
  - from: 17
    to: 20
    color: "#2ecc71"
    label: Comfortable
  - from: 20
    to: 22
    color: "#f1c40f"
    label: Warm
  - from: 22
    to: 24
    color: "#e67e22"
    label: Hot
```

</details>

<details>
<summary>Markers example</summary>
<img width="732" height="427" alt="image" src="https://github.com/user-attachments/assets/508b2104-dd46-46e4-ae81-5af7530e832a" />

Shows the latest value and maximum value directly on the graph.

```yaml
type: custom:simple-band-graph-card
entity: sensor.example_co2
name: CO₂ Markers
hours_to_show: 24
y_min: 400
y_max: 2000

band_opacity: 0.18

top_left: name
top_center: band
top_right: current

show_latest: true
show_latest_label: true
latest_marker_size: 3

show_min: false
show_max: true
show_extrema_labels: true
extrema_label_mode: compact

marker_label_color_mode: static
marker_label_background_mode: card
marker_label_background_opacity: 0.8
marker_label_size: 12
marker_label_weight: 600

bands:
  - from: 400
    to: 800
    color: "#2ecc71"
    label: Good
  - from: 800
    to: 1100
    color: "#f1c40f"
    label: OK
  - from: 1100
    to: 1500
    color: "#e67e22"
    label: Stale
  - from: 1500
    to: 2000
    color: "#e74c3c"
    label: Poor
```

</details>

<details>
<summary>Axes and grid example</summary>
<img width="715" height="429" alt="image" src="https://github.com/user-attachments/assets/ecb380e5-0733-4add-829e-7bc930420524" />

Shows configurable axes, tick labels and grid lines.

```yaml
type: custom:simple-band-graph-card
entity: sensor.example_co2
name: CO₂ Axes and Grid
hours_to_show: 24
y_min: 400
y_max: 2000

band_opacity: 0.18

top_left: name
top_center: band
top_right: current

show_x_axis: true
show_x_axis_labels: true
x_axis_ticks: 5

show_y_axis: true
show_y_axis_labels: true
y_axis_position: right
y_axis_ticks: 5

show_x_grid: true
show_y_grid: true
grid_opacity: 0.25

plot_background_color: "#ffffff"
plot_background_opacity: 1

band_label_mode: label
band_label_position: middle
band_label_size: 20
band_label_weight: 600

bands:
  - from: 1500
    to: 2000
    color: "#e74c3c"
    label: Poor
```

</details>

<details>
<summary>Advanced customisation example</summary>
<img width="691" height="533" alt="image" src="https://github.com/user-attachments/assets/ba14e359-ef39-4501-9fdb-8fa4bb9ccd35" />

A fuller example showing custom ribbons, band messages, backgrounds, labels, axes, markers and band-coloured lines.

```yaml
type: custom:simple-band-graph-card
entity: sensor.example_co2
name: Simple Band Graph
height: 190
hours_to_show: 12
y_min: 400
y_max: 2000

max_history_points: auto
history_refresh_interval: 60

band_opacity: 0.18

background_color_mode: static
background_color: var(--card-background-color)
background_opacity: 1

plot_background_color_mode: static
plot_background_color: var(--card-background-color)
plot_background_opacity: 0.35
plot_background_radius: 10

bottom_ribbon_background_color_mode: band
bottom_ribbon_background_opacity: 0.35
ribbon_background_radius: 10

top_left: name
top_center: none
top_right: duration

bottom_left: none
bottom_center: message
bottom_right: none

duration_format: short

top_left_font_size: 16
top_right_font_size: 16
bottom_center_font_size: 15

top_left_font_weight: 700
top_right_font_weight: 700
bottom_center_font_weight: 700

ribbon_color_mode: static
ribbon_styles:
  top_right:
    color: var(--primary-text-color)
    color_mode: static
  bottom_center:
    color: var(--primary-text-color)
    color_mode: static

show_line: true
line_color_mode: band
line_width: 3
line_opacity: 1

band_label_mode: label
band_label_position: middle
band_label_align: left
band_label_size: 13
band_label_weight: 500
band_label_opacity: 0.85

show_x_axis: true
show_x_axis_labels: true
x_axis_ticks: 3
axis_label_size: 13

show_y_axis: false
show_y_axis_labels: false

show_x_grid: false
show_y_grid: false

show_latest: true
show_latest_label: true
latest_marker_size: 3

show_min: false
show_max: true
show_extrema_labels: true
extrema_label_mode: compact
hide_recent_max: false

marker_label_color_mode: static
marker_label_background_mode: card
marker_label_background_opacity: 0.8
marker_label_size: 13
marker_label_weight: 600

bands:
  - from: 400
    to: 800
    color: "#2ecc71"
    label: Good
    message: Air quality is good
  - from: 800
    to: 1100
    color: "#f1c40f"
    label: OK
    message: Air quality is OK
  - from: 1100
    to: 1500
    color: "#e67e22"
    label: Stale
    message: Air is getting stale
  - from: 1500
    to: 2000
    color: "#e74c3c"
    label: Poor
    message: Open a window
```

</details>

<details>
<summary>Basic debug example</summary>
<img width="734" height="611" alt="image" src="https://github.com/user-attachments/assets/68c486ce-e417-4327-bad7-1d04ba614119" />

Shows basic debug output in the bottom ribbon.

```yaml
type: custom:simple-band-graph-card
entity: sensor.example_co2
name: CO₂ Debug
hours_to_show: 24
y_min: 400
y_max: 2000

band_opacity: 0.18

top_left: name
top_center: band
top_right: current

bottom_left: debug
bottom_center: none
bottom_right: none

debug_level: basic
debug_multiline: true

bottom_left_font_size: 11
bottom_left_font_weight: 400
bottom_left_opacity: 0.75

bands:
  - from: 400
    to: 800
    color: "#2ecc71"
    label: Good
  - from: 800
    to: 1100
    color: "#f1c40f"
    label: OK
  - from: 1100
    to: 1500
    color: "#e67e22"
    label: Stale
  - from: 1500
    to: 2000
    color: "#e74c3c"
    label: Poor
```

</details>
<details>
<summary>Complex debug and performance example</summary>
<img width="720" height="793" alt="image" src="https://github.com/user-attachments/assets/a363b212-0363-4f1f-aa7c-bf2ef49880d8" />

Shows detailed debug and performance output, including fetch timings, downsampling, render counts and line path information. Useful when testing long history windows or band-coloured lines.

```yaml
type: custom:simple-band-graph-card
entity: sensor.example_co2
name: CO₂ Performance Debug
height: 230
hours_to_show: 100
y_min: 400
y_max: 2000

max_history_points: auto
history_refresh_interval: 60

band_opacity: 0.12

top_left: name
top_center: duration
top_right: current

bottom_left: debug
bottom_center: none
bottom_right: none

duration_format: short

debug_level: performance
debug_multiline: true

bottom_left_font_size: 11
bottom_left_font_weight: 400
bottom_left_opacity: 0.75

show_line: true
line_color_mode: band
line_width: 4
line_opacity: 1

show_x_axis: true
show_x_axis_labels: true
x_axis_ticks: 6

show_y_axis: true
show_y_axis_labels: true
y_axis_position: right
y_axis_ticks: 5

show_y_grid: true
grid_opacity: 0.25

show_latest: true
show_latest_label: true
latest_marker_size: 3

show_min: true
show_max: true
show_extrema_labels: true
extrema_label_mode: compact
hide_recent_min: true
hide_recent_max: false
recent_extrema_minutes: 30

marker_label_color_mode: static
marker_label_background_mode: card
marker_label_background_opacity: 0.8
marker_label_size: 11
marker_label_weight: 600

bands:
  - from: 400
    to: 800
    color: "#2ecc71"
    label: Good
    message: Air quality is good
  - from: 800
    to: 1100
    color: "#f1c40f"
    label: OK
    message: Air quality is OK
  - from: 1100
    to: 1500
    color: "#e67e22"
    label: Stale
    message: Air is getting stale
  - from: 1500
    to: 2000
    color: "#e74c3c"
    label: Poor
    message: Open a window
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
| `show_bands` | No | `true` | Show or hide the visible coloured band areas. Bands can still be used for labels and colour logic when hidden. |

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
| `color` | Band colour. Hex colours with alpha work well for visible bands/backgrounds, e.g. `#2ecc7133`. Solid colours work better for text and line colour modes, e.g. `#2ecc71`. |
| `label` | Optional label for the band. |

### Colour modes

Several options support a matching `*_color_mode`.

| Mode | Behaviour |
|---|---|
| `static` | Use the configured colour. |
| `band` | Use a band colour. For card/plot/ribbon backgrounds and ribbon text this uses the current value’s band. For marker labels this uses the marker value’s own band. For line colour it uses the band the line section passes through. |
| `none` | Use transparent/no colour. |

Examples:

```yaml
plot_background_color_mode: band
ribbon_color_mode: band
marker_label_color_mode: band
line_color_mode: band
```

If a marker value is outside all configured bands, `marker_label_color_mode: band` falls back to `marker_label_color`.

### Background options

| Option | Default | Description |
|---|---:|---|
| `background_color` | `var(--card-background-color)` | Outer card background colour. |
| `background_opacity` | `1` | Outer card background opacity. |
| `background_color_mode` | `static` | Options: `static`, `band`, `none`. |
| `plot_background_color` | `var(--card-background-color)` | Plot area background colour. |
| `plot_background_opacity` | `0.35` | Plot area background opacity. |
| `plot_background_color_mode` | `static` | Options: `static`, `band`, `none`. |
| `plot_background_radius` | `8` | Plot area background corner radius. |
| `top_ribbon_background_color` | `transparent` | Top ribbon background colour. |
| `top_ribbon_background_opacity` | `0` | Top ribbon background opacity. |
| `top_ribbon_background_color_mode` | `static` | Options: `static`, `band`, `none`. |
| `bottom_ribbon_background_color` | `transparent` | Bottom ribbon background colour. |
| `bottom_ribbon_background_opacity` | `0` | Bottom ribbon background opacity. |
| `bottom_ribbon_background_color_mode` | `static` | Options: `static`, `band`, `none`. |
| `ribbon_background_radius` | `8` | Ribbon background corner radius. |

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
| `band_label_color_mode` | `static` | Options: `static`, `band`, `none`. |
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
| `line_color` | `var(--primary-color)` | Graph line colour. Used when `line_color_mode: static`, and as a fallback. |
| `line_color_mode` | `static` | Line colour mode. Options: `static`, `band`, `none`. |
| `line_width` | `3` | Graph line width. |
| `line_opacity` | `1` | Graph line opacity. |

When `line_color_mode: band` is used, the line is coloured according to the configured bands. Line sections are split at threshold boundaries, then consecutive same-colour sections are grouped into fewer SVG paths for better performance.

Example:

```yaml
line_color_mode: band
line_width: 4
line_opacity: 1
```

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
| `axis_label_color_mode` | `static` | Options: `static`, `band`, `none`. |
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
| `custom_text` | `""` | Custom text shown when a ribbon slot is set to `custom` or `text`. |
| `duration_format` | `short` | Duration label format. Options: `short`, `long`. |
| `ribbon_color_mode` | `static` | Global ribbon text colour mode. Options: `static`, `band`, `none`. |
| `ribbon_styles` | `{}` | Advanced per-slot style overrides. |

Supported slot values:

| Value | Description |
|---|---|
| `none` | Empty slot. |
| `name` | Card name. |
| `current` | Current entity value and unit. |
| `band` | Current threshold band label. |
| `custom` | Custom text from `custom_text`. |
| `text` | Alias for `custom`. |
| `duration` | Selected graph duration based on `hours_to_show`. |
| `hours` | Alias for `duration`. |
| `range` | Alias for `duration`. |
| `debug` | Debug/status information. |
| `status` | Alias for `debug`, kept for backwards compatibility. |
| `entity` | Entity ID. |
| `unit` | Entity unit. |
| `min` | Minimum value in the displayed history. |
| `minimum` | Alias for `min`. |
| `max` | Maximum value in the displayed history. |
| `maximum` | Alias for `max`. |

Duration labels are based on `hours_to_show`.

```yaml
hours_to_show: 0.5
bottom_left: duration
duration_format: short

This shows 30m.

hours_to_show: 48
bottom_left: duration
duration_format: long

This shows 2 days.

Each ribbon position has simple font size, weight and opacity options:

| Option | Default | Description |
|---|---:|---|
| `top_left_font_size` | `16` | Top-left ribbon font size. |
| `top_center_font_size` | `16` | Top-centre ribbon font size. |
| `top_right_font_size` | `16` | Top-right ribbon font size. |
| `bottom_left_font_size` | `12` | Bottom-left ribbon font size. |
| `bottom_center_font_size` | `12` | Bottom-centre ribbon font size. |
| `bottom_right_font_size` | `12` | Bottom-right ribbon font size. |
| `top_left_font_weight` | `600` | Top-left ribbon font weight. |
| `top_center_font_weight` | `600` | Top-centre ribbon font weight. |
| `top_right_font_weight` | `600` | Top-right ribbon font weight. |
| `bottom_left_font_weight` | `500` | Bottom-left ribbon font weight. |
| `bottom_center_font_weight` | `500` | Bottom-centre ribbon font weight. |
| `bottom_right_font_weight` | `500` | Bottom-right ribbon font weight. |
| `top_left_opacity` | `1` | Top-left ribbon text opacity. |
| `top_center_opacity` | `1` | Top-centre ribbon text opacity. |
| `top_right_opacity` | `1` | Top-right ribbon text opacity. |
| `bottom_left_opacity` | `0.8` | Bottom-left ribbon text opacity. |
| `bottom_center_opacity` | `0.8` | Bottom-centre ribbon text opacity. |
| `bottom_right_opacity` | `0.8` | Bottom-right ribbon text opacity. |

Example:

```yaml
top_left_font_size: 16
top_center_font_size: 16
top_right_font_size: 18

bottom_left_font_size: 12
bottom_center_font_size: 12
bottom_right_font_size: 12

top_left_font_weight: 600
top_center_font_weight: 600
top_right_font_weight: 700
```

For more advanced styling, each ribbon position can also be overridden with `ribbon_styles`:

```yaml
ribbon_styles:
  top_left:
    font_size: 16
    font_weight: 600
    color: var(--primary-text-color)
  top_center:
    font_size: 16
    font_weight: 700
    color_mode: band
  top_right:
    font_size: 22
    font_weight: 700
    color_mode: band
  bottom_left:
    font_size: 11
    font_weight: 400
    color: var(--secondary-text-color)
    opacity: 0.7
```

Supported advanced ribbon style options:

| Option | Description |
|---|---|
| `font_size` | Font size in pixels, or a CSS value. |
| `font_weight` | Font weight. |
| `color` | Text colour. |
| `color_mode` | Options: `static`, `band`, `none`. Overrides `ribbon_color_mode` for that slot. |
| `color_opacity` | Colour opacity. |
| `opacity` | Backwards-compatible opacity value. |
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
| `extrema_label_mode` | `value` | Options: `value`, `compact`, `prefixed`. |
| `hide_recent_min` | `true` | Hide the min marker when it is very recent. |
| `hide_recent_max` | `false` | Hide the max marker when it is very recent. |
| `recent_extrema_minutes` | `30` | Time window used by `hide_recent_min` and `hide_recent_max`. |

Extrema label modes:

| Mode | Example |
|---|---|
| `value` | `1729ppm` |
| `compact` | `↑ 1729ppm` |
| `prefixed` | `Max 1729ppm` |

### Marker label options

| Option | Default | Description |
|---|---:|---|
| `marker_label_size` | `11` | Marker label font size. |
| `marker_label_weight` | `400` | Marker label font weight. |
| `marker_label_color` | `var(--primary-text-color)` | Marker label text colour. |
| `marker_label_color_mode` | `static` | Options: `static`, `band`, `none`. |
| `marker_label_opacity` | `0.9` | Marker label opacity. |
| `marker_label_background_color` | `var(--card-background-color)` | Marker label background colour. |
| `marker_label_background_opacity` | `0.75` | Marker label background opacity. |
| `marker_label_background_mode` | `card` | Background mode. Options: `card`, `band`. |

Use this to match marker label backgrounds to the relevant marker value band:

```yaml
marker_label_background_mode: band
```

Use this to match marker label text to the relevant marker value band:

```yaml
marker_label_color_mode: band
```

If the marker value is outside all configured bands, it falls back to `marker_label_color`.

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
raw 1315 · plotted 500 · path 501 · segments 500/543 · grouped paths 45 · max auto/500
refresh 60s · full history request
y 400-2000 · x relative · line band
fetch 418ms · api 417ms · downsample 0ms
render 1ms · renders 79
downsample yes · ratio 38% · density 13/h
```

In the line debug:

| Value | Meaning |
|---|---|
| `segments 500/543` | Original line segments / threshold-split line segments. |
| `grouped paths 45` | Number of actual SVG line paths rendered after grouping same-colour sections. |

## Notes

Home Assistant history records state changes rather than regular samples. This card requests detailed history for the selected time window and then downsamples locally when needed.

When `max_history_points` is set to `auto`, the card currently targets about `500` plotted history points. The downsampling keeps the first and last points and tries to preserve local highs and lows, which helps retain short spikes.

The card appends the current live value at `now` when drawing the graph, so the line reaches the live edge of the chart without requiring a full history refresh every time the entity state changes.

Minimum and maximum markers are calculated from real Home Assistant history only, not from the artificial current-at-now point.

If you use `*_color_mode: band`, the configured `bands` are still required even when `show_bands: false`.

## Status

Work in progress, but functional. The card can load Home Assistant history and render a configurable threshold-banded line graph with optional markers, axes, grid lines, ribbon content, band-driven colours and debug diagnostics.

## Roadmap

Planned or possible future features:

- Visual editor support in the Home Assistant UI
- More marker dot styling options
- Optional area graph / line graph toggle
- Area fill colour modes, including band-driven area fill
- Optional hover / tooltip features
- More compact presets
- Optional dynamic messages based on the current threshold band
- More examples and screenshots
- Better handling for marker values outside configured bands
- Packaging/polish for a wider HACS release

## License

MIT License.
