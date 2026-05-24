# Simple Band Graph Card

<img width="699" height="400" alt="image" src="https://github.com/user-attachments/assets/5e072bc8-392e-4a6c-92f5-d10527977368" />

A Home Assistant custom card for simple line and area graphs with configurable coloured threshold bands.

It is designed for sensors where coloured context bands make the graph easier to read, such as CO₂, air quality, temperature, humidity, battery level, energy use, solar generation, temperature difference, or anything else with meaningful thresholds.

[![Open your Home Assistant instance and add this repository to HACS.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=Future-Surfer&repository=simple-band-graph-card&category=plugin)

## Features

- Display recent Home Assistant entity history as a clean, responsive graph
- Define custom coloured threshold bands with configurable labels and messages
- Set graph duration and Y-axis range with `hours_to_show`, `y_min` and `y_max`
- Use raw history, long-term statistics, or hybrid history for longer time windows
- Resize cleanly in Home Assistant Sections layouts, including compact one-row status cards
- Configure header and footer content slots, including name, current value, band, min/max, debug text, custom text, graph duration and band-specific messages
- Show or hide the header and footer independently
- Use a position-aware ribbon layout so left, centre and right slots share space sensibly
- Style header/footer text, backgrounds and band-driven colours
- Configure separate backgrounds for the card and plot area
- Optionally drive card, plot, header or footer background colours from the current band
- Clip bands and line content to the rounded plot area
- Show, hide and position band labels inside or outside the graph area
- Draw band labels above or below the line/area graphing layer
- Add optional band separator lines with configurable colour, width, opacity and line style
- Show optional latest, minimum and maximum value markers with configurable labels
- Configure X/Y axis lines and labels independently
- Place the X-axis line at the top, bottom, or zero value
- Place X-axis labels independently at the top, middle, or bottom
- Configure axis line colour, width and opacity separately for X and Y axes
- Add optional grid lines with solid, dashed or dotted styles
- Customise graph line colour, width and opacity
- Use `line_color_mode: band` to colour the graph line by threshold band
- Add an optional area fill between the graph line and the zero point
- Use `area_color_mode: band` to colour area segments by threshold band
- Show the area fill even when the line itself is hidden
- Add standard Home Assistant card interactions with `tap_action`, `hold_action` and `double_tap_action`
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

## Visual editor

Simple Band Graph Card includes a Home Assistant visual editor for the most commonly used options.

The visual editor can configure:

- Entity, name, history source, history window, fallback graph height and value decimal places
- Raw, statistics and hybrid history options
- Y-axis range
- X/Y axis lines, tick labels, positions and label styling
- X-axis zero-line positioning and independent X-axis label positioning
- Separate X/Y axis line colour, width and opacity
- Grid visibility, colour, width, opacity and line style
- Card and plot backgrounds
- Band visibility, band labels and band label styling
- Band label layer, allowing labels to appear above or below the line/area graph
- Band separator visibility, colour, width, opacity and style
- Raw band definitions
- Line colour, width, opacity and band-driven line colouring
- Area visibility, colour, opacity and band-driven area colouring
- Current/latest, minimum and maximum markers
- Marker label text and background styling
- Header and footer visibility, slot content, text styling and backgrounds
- Standard card interactions
- Basic debug and history refresh settings

Some advanced YAML options, especially detailed per-slot header/footer text overrides, remain YAML-only for now.

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
<summary>Compact status graph example</summary>

<img width="328" height="282" alt="image" src="https://github.com/user-attachments/assets/9667e07c-c4b1-47c2-829a-7dd83b4f9a82" />

A compact layout that behaves more like a status tile, with a band-coloured value ribbon and a small contextual graph underneath.

```yaml
type: custom:simple-band-graph-card
entity: sensor.example_co2
y_min: 400
y_max: 2000
hours_to_show: 12

grid_options:
  columns: 6
  rows: 3

band_opacity: 0.18

show_x_axis: false
show_x_axis_labels: false
show_y_axis: false
show_y_axis_labels: false

top_left: none
top_center: current
top_right: none

top_ribbon_background_color_mode: band
top_ribbon_background_opacity: 0.7

show_line: true
line_color_mode: band

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
<summary>Band-coloured area example</summary>

Shows an area fill under the graph. The area is drawn between the history value and the zero point on the Y-axis. It can be used with or without the line.

```yaml
type: custom:simple-band-graph-card
entity: sensor.example_temperature_delta
name: Temperature Difference
hours_to_show: 24
height: 220

y_min: -10
y_max: 10
value_decimals: 1

show_bands: true
band_opacity: 0.22

show_line: true
line_color_mode: static
line_color: "#333333"
line_width: 3
line_opacity: 0.75

show_area: true
area_color_mode: band
area_opacity: 0.25

show_x_axis: true
show_x_axis_labels: true
x_axis_position: zero
x_axis_label_position: bottom
x_axis_label_mode: relative
x_axis_ticks: 3
x_axis_line_color: "#111111"
x_axis_line_width: 4
x_axis_line_opacity: 1

show_y_axis: true
show_y_axis_labels: true
y_axis_position: left
y_axis_ticks: 3

bands:
  - from: -10
    to: -5
    color: "#3b82f6"
    label: Much cooler
    message: Inside is much cooler than outside
  - from: -5
    to: -2
    color: "#60a5fa"
    label: Cooler
    message: Inside is cooler than outside
  - from: -2
    to: 2
    color: "#22c55e"
    label: Balanced
    message: Inside and outside temperatures are similar
  - from: 2
    to: 5
    color: "#eab308"
    label: Warmer
    message: Inside is warmer than outside
  - from: 5
    to: 10
    color: "#ef4444"
    label: Much warmer
    message: Inside is much warmer than outside
```

</details>

<details>
<summary>Area-only example</summary>

Hides the line and uses the area fill as the main visual element.

```yaml
type: custom:simple-band-graph-card
entity: sensor.example_battery_power
name: Battery Flow
hours_to_show: 12
height: 180

y_min: -5000
y_max: 5000

show_line: false

show_area: true
area_color_mode: band
area_opacity: 0.35

show_x_axis: true
show_x_axis_labels: true
x_axis_position: zero
x_axis_label_position: bottom
x_axis_line_width: 3

bands:
  - from: -5000
    to: -1000
    color: "#3b82f6"
    label: Exporting
  - from: -1000
    to: 1000
    color: "#22c55e"
    label: Balanced
  - from: 1000
    to: 5000
    color: "#ef4444"
    label: Importing
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
<summary>Band labels above data example</summary>

Draws band labels above the line and area layers. This can be useful when labels are acting as active annotations rather than subtle background labels.

```yaml
type: custom:simple-band-graph-card
entity: sensor.example_co2
name: CO₂ Band Labels Above
hours_to_show: 24
y_min: 400
y_max: 2000

band_opacity: 0.16
band_label_mode: label
band_label_position: middle
band_label_align: center
band_label_layer: above
band_label_size: 18
band_label_weight: 600

show_area: true
area_color_mode: band
area_opacity: 0.2

line_color_mode: static
line_color: "#111111"
line_width: 2

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
x_axis_position: bottom
x_axis_label_position: bottom
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
<summary>Zero-line X-axis example</summary>

Places the X-axis line at the zero value while leaving the X-axis labels at the bottom.

```yaml
type: custom:simple-band-graph-card
entity: sensor.example_temperature_delta
name: Temperature Delta
hours_to_show: 24
height: 220

y_min: -10
y_max: 10

show_x_axis: true
show_x_axis_labels: true
x_axis_position: zero
x_axis_label_position: bottom
x_axis_line_color: "#111111"
x_axis_line_width: 4
x_axis_line_opacity: 1

show_y_axis: true
show_y_axis_labels: true
y_axis_position: left

line_color: "#333333"
line_width: 3

bands:
  - from: -10
    to: -2
    color: "#60a5fa"
    label: Cooler
  - from: -2
    to: 2
    color: "#22c55e"
    label: Balanced
  - from: 2
    to: 10
    color: "#ef4444"
    label: Warmer
```

</details>

<details>
<summary>Long-term hybrid history example</summary>

Uses hybrid history for longer time ranges: older long-term statistics plus recent raw history.

```yaml
type: custom:simple-band-graph-card
entity: sensor.example_co2
name: CO₂ Long History
hours_to_show: 480
height: 220

history_mode: hybrid
statistics_type: mean
statistics_period: hour
hybrid_raw_hours: 240

max_history_points: auto

y_min: 400
y_max: 2000

show_line: true
line_color_mode: static
line_color: "#111111"
line_width: 3

show_area: true
area_color_mode: band
area_opacity: 0.18

debug_level: basic
debug_multiline: true

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
<summary>Advanced customisation example</summary>

<img width="691" height="533" alt="image" src="https://github.com/user-attachments/assets/ba14e359-ef39-4501-9fdb-8fa4bb9ccd35" />

A fuller example showing custom ribbons, band messages, backgrounds, labels, axes, markers, area fill and band-coloured lines.

```yaml
type: custom:simple-band-graph-card
entity: sensor.example_co2
name: Simple Band Graph
height: 190
hours_to_show: 12
y_min: 400
y_max: 2000

history_mode: auto
statistics_type: mean
statistics_period: hour
hybrid_raw_hours: 240

max_history_points: auto
history_refresh_interval: 60

band_opacity: 0.18

background_color_mode: static
background_color: var(--card-background-color)
background_opacity: 1

plot_background_color_mode: none
plot_background_color: transparent
plot_background_opacity: 0
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

show_area: true
area_color_mode: band
area_opacity: 0.18

band_label_mode: label
band_label_position: middle
band_label_align: left
band_label_layer: below
band_label_size: 13
band_label_weight: 500
band_label_opacity: 0.85

show_x_axis: true
show_x_axis_labels: true
x_axis_position: bottom
x_axis_label_position: bottom
x_axis_ticks: 3
x_axis_label_size: 13

show_y_axis: false
show_y_axis_labels: false
y_axis_label_size: 13

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
marker_label_background_mode: none
marker_label_background_color: transparent
marker_label_background_opacity: 0
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

Shows detailed debug and performance output, including fetch timings, downsampling, render counts, history source information and line path information. Useful when testing long history windows or band-coloured lines.

```yaml
type: custom:simple-band-graph-card
entity: sensor.example_co2
name: CO₂ Performance Debug
height: 230
hours_to_show: 480
y_min: 400
y_max: 2000

history_mode: auto
statistics_type: mean
statistics_period: hour
hybrid_raw_hours: 240

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

show_area: true
area_color_mode: band
area_opacity: 0.16

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
| `value_decimals` | No | `auto` | Decimal places for displayed values. Options: `auto`, `0`, `1`, `2`, `3`. |
| `bands` | No | `[]` | List of coloured threshold bands. |
| `show_bands` | No | `true` | Show or hide the visible coloured band areas. Bands can still be used for labels and colour logic when hidden. |

`value_decimals` affects value labels such as axis values, marker labels, band ranges and current values shown in ribbon slots. `auto` uses fewer decimal places for larger numbers.

### History and performance options

| Option | Default | Description |
|---|---:|---|
| `history_mode` | `auto` | History source mode. Options: `auto`, `raw`, `statistics`, `hybrid`. |
| `statistics_type` | `mean` | Long-term statistics value to use. Common options: `mean`, `min`, `max`, `last`, `state`. |
| `statistics_period` | `hour` | Long-term statistics period. Options include `5minute`, `hour`, `day`, `week`, `month`. |
| `hybrid_raw_hours` | `240` | Number of recent hours fetched as raw high-resolution history when using `hybrid` or `auto` mode. |
| `max_history_points` | `auto` | Maximum number of history points to plot after fetching. `auto` currently targets about `500` plotted points. Use a number to override. |
| `history_refresh_interval` | `60` | Minimum time, in seconds, between full history API refreshes. The card can still update the current value between history refreshes. |
| `debug_level` | `basic` | Debug detail level. Options: `off`, `basic`, `performance`, `verbose`. |
| `debug_multiline` | `false` | Shows debug output over multiple lines. Useful with `debug_level: performance` or `debug_level: verbose`. |
| `debug_performance` | `false` | Backwards-compatible shortcut. If set to `true`, defaults `debug_level` to `performance`. |

History modes:

| Mode | Behaviour |
|---|---|
| `raw` | Uses Home Assistant’s detailed recorder history. This is high-resolution, but limited by recorder retention. |
| `statistics` | Uses Home Assistant long-term statistics only. This is lower-resolution, but can cover longer periods when the entity supports long-term statistics. |
| `hybrid` | Uses long-term statistics for the older part of the window and raw recorder history for the recent part. |
| `auto` | Uses `raw` when `hours_to_show` is within `hybrid_raw_hours`, otherwise uses `hybrid`. |

The card requests Home Assistant history and then downsamples locally if needed. This keeps the visible graph responsive while preserving useful spikes and high/low points.

Long-term statistics only work for entities that Home Assistant records as statistics. Most numeric sensors with appropriate state class support this, but not every entity will have long-term statistics available.

### Bands

Each band supports:

| Option | Description |
|---|---|
| `from` | Lower value for the band. |
| `to` | Upper value for the band. |
| `color` | Band colour. Solid colours are recommended, e.g. `#2ecc71`, with transparency controlled using `band_opacity`. |
| `label` | Optional label for the band. |
| `message` | Optional message or instruction for the band. This can be shown in a ribbon slot using `message`, `band_message`, `instruction` or `instructions`. |

### Colour modes

Several options support a matching `*_color_mode`.

| Mode | Behaviour |
|---|---|
| `static` | Use the configured colour. |
| `band` | Use a band colour. For card/plot/ribbon backgrounds and ribbon text this uses the current value’s band. For marker labels this uses the marker value’s own band. For line colour it uses the band the line section passes through. For area colour it uses the band the area section passes through. |
| `none` | Use transparent/no colour. |

Examples:

```yaml
plot_background_color_mode: band
ribbon_color_mode: band
marker_label_color_mode: band
line_color_mode: band
area_color_mode: band
```

If a marker value is outside all configured bands, `marker_label_color_mode: band` falls back to `marker_label_color`.

### Background options

| Option | Default | Description |
|---|---:|---|
| `background_color` | `var(--card-background-color)` | Outer card background colour. |
| `background_opacity` | `1` | Outer card background opacity. |
| `background_color_mode` | `static` | Options: `static`, `band`, `none`. |
| `plot_background_color` | `transparent` | Plot area background colour. |
| `plot_background_opacity` | `0` | Plot area background opacity. |
| `plot_background_color_mode` | `none` | Options: `static`, `band`, `none`. |
| `plot_background_radius` | `8` | Plot area background corner radius. Bands and line content are clipped to this rounded plot shape. |
| `header_background_color` | `transparent` | Header background colour. |
| `header_background_opacity` | `0` | Header background opacity. |
| `header_background_color_mode` | `static` | Options: `static`, `band`, `none`. |
| `footer_background_color` | `transparent` | Footer background colour. |
| `footer_background_opacity` | `0` | Footer background opacity. |
| `footer_background_color_mode` | `static` | Options: `static`, `band`, `none`. |
| `ribbon_background_radius` | `8` | Header/footer background corner radius. |

Legacy `top_ribbon_background_*` and `bottom_ribbon_background_*` options are still supported for backwards compatibility, but `header_background_*` and `footer_background_*` are preferred for new YAML.

### Band label options

| Option | Default | Description |
|---|---:|---|
| `band_label_mode` | `label` | Controls what is shown in each band label. Options: `hide`, `label`, `threshold`, `range`, `label_range`, `label_threshold`. |
| `band_label_unit` | `false` | Adds the entity unit to threshold/range labels. |
| `band_label_position` | `top` | Vertical position. Options: `top`, `middle`, `bottom`. Older aliases `high`, `mid`, `low` also work. |
| `band_label_align` | `left` | Horizontal position. Options: `left`, `center`, `right`, `outside_left`, `outside_right`. |
| `band_label_layer` | `below` | Draw band labels below or above the line/area data layer. Options: `below`, `above`. |
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
| `threshold` | `400+` |
| `range` | `400–800` |
| `label_threshold` | `Good · 400+` |
| `label_range` | `Good · 400–800` |

### Band separator options

Band separators draw horizontal lines at internal band thresholds. They are useful when you want the threshold boundaries to be visible without enabling regular grid lines.

| Option | Default | Description |
|---|---:|---|
| `show_band_separators` | `false` | Draw separator lines between adjacent bands. |
| `band_separator_color` | `var(--divider-color)` | Band separator line colour. |
| `band_separator_width` | `1` | Band separator line width. |
| `band_separator_opacity` | `0.5` | Band separator opacity. |
| `band_separator_style` | `dashed` | Separator style. Options: `solid`, `dashed`, `dotted`. |

Example:

```yaml
show_band_separators: true
band_separator_color: "#111111"
band_separator_width: 2
band_separator_opacity: 0.45
band_separator_style: dashed
```

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

### Area options

| Option | Default | Description |
|---|---:|---|
| `show_area` | `false` | Show or hide the filled area. |
| `area_color` | `var(--primary-color)` | Area fill colour. Used when `area_color_mode: static`, and as a fallback. |
| `area_color_mode` | `static` | Area colour mode. Options: `static`, `band`, `none`. |
| `area_opacity` | `0.18` | Area fill opacity. |

The area is drawn between the plotted history value and the zero point on the Y-axis. This means it works naturally for graphs with positive and negative values, such as temperature difference, battery charge/discharge, import/export, or balance-style sensors.

If zero is outside the visible Y-axis range, the baseline is clamped to the nearest edge of the plot.

The area can be shown independently of the line:

```yaml
show_line: false
show_area: true
```

When `area_color_mode: band` is used, the area is split at band thresholds and coloured according to the configured bands. Adjacent same-colour area sections are grouped to reduce SVG noise.

Example:

```yaml
show_area: true
area_color_mode: band
area_opacity: 0.25
```

### Axis options

X-axis and Y-axis lines are controlled separately from their labels. For example, you can hide the axis line while keeping the labels visible, or place the X-axis line at zero while leaving X-axis labels at the bottom.

| Option | Default | Description |
|---|---:|---|
| `show_x_axis` | `true` | Show or hide the X-axis line. |
| `show_x_axis_labels` | `true` | Show or hide X-axis labels. |
| `x_axis_position` | `bottom` | X-axis line position. Options: `bottom`, `top`, `zero`. |
| `x_axis_label_position` | `bottom` | X-axis label position. Options: `bottom`, `middle`, `top`. |
| `x_axis_label_mode` | `relative` | X-axis label mode. Options: `relative`, `time`. |
| `x_axis_ticks` | `3` | Number of X-axis tick labels. |
| `x_axis_line_color` | `var(--divider-color)` | X-axis line colour. |
| `x_axis_line_width` | `1` | X-axis line width. |
| `x_axis_line_opacity` | `1` | X-axis line opacity. |
| `x_axis_label_size` | `11` | X-axis label font size. |
| `x_axis_label_weight` | `400` | X-axis label font weight. |
| `x_axis_label_color` | `var(--secondary-text-color)` | X-axis label colour. |
| `x_axis_label_color_mode` | `static` | Options: `static`, `band`, `none`. |
| `x_axis_label_opacity` | `0.8` | X-axis label opacity. |
| `show_y_axis` | `true` | Show or hide the Y-axis line. |
| `show_y_axis_labels` | `true` | Show or hide Y-axis labels. |
| `y_axis_position` | `left` | Y-axis position. Options: `left`, `right`. |
| `y_axis_ticks` | `2` | Number of Y-axis tick labels. |
| `y_axis_line_color` | `var(--divider-color)` | Y-axis line colour. |
| `y_axis_line_width` | `1` | Y-axis line width. |
| `y_axis_line_opacity` | `1` | Y-axis line opacity. |
| `y_axis_label_size` | `11` | Y-axis label font size. |
| `y_axis_label_weight` | `400` | Y-axis label font weight. |
| `y_axis_label_color` | `var(--secondary-text-color)` | Y-axis label colour. |
| `y_axis_label_color_mode` | `static` | Options: `static`, `band`, `none`. |
| `y_axis_label_opacity` | `0.8` | Y-axis label opacity. |

When `x_axis_position: zero` is used, the X-axis line is drawn at the Y-axis value of `0`. If zero is outside the current visible Y-axis range, the line is clamped to the nearest plot edge.

When both axis lines are visible, the card slightly overlaps the line ends so thicker X/Y axes form a clean joined corner.

Legacy shared axis label options are still supported for backwards compatibility:

| Legacy option | Description |
|---|---|
| `axis_label_size` | Applies to both X and Y labels unless the newer X/Y-specific option is set. |
| `axis_label_weight` | Applies to both X and Y labels unless the newer X/Y-specific option is set. |
| `axis_label_color` | Applies to both X and Y labels unless the newer X/Y-specific option is set. |
| `axis_label_color_mode` | Applies to both X and Y labels unless the newer X/Y-specific option is set. |
| `axis_label_opacity` | Applies to both X and Y labels unless the newer X/Y-specific option is set. |

### Grid options

| Option | Default | Description |
|---|---:|---|
| `show_x_grid` | `false` | Show vertical grid lines. |
| `show_y_grid` | `false` | Show horizontal grid lines. |
| `grid_color` | `var(--divider-color)` | Grid line colour. |
| `grid_width` | `1` | Grid line width. |
| `grid_opacity` | `0.35` | Grid line opacity. |
| `grid_line_style` | `solid` | Grid line style. Options: `solid`, `dashed`, `dotted`. |

Grid lines use the same intervals as `x_axis_ticks` and `y_axis_ticks`, but skip the first and last ticks so grid lines appear inside the plot area rather than on the outer boundary.

### Header and footer options

The card has two configurable text areas: a header above the graph and a footer below it. Each has left, centre and right slots.

Preferred YAML:

```yaml
header_left: name
header_center: band
header_right: current

footer_left: debug
footer_center: none
footer_right: none
```

| Option | Default | Description |
|---|---:|---|
| `show_header` | `true` | Show or hide the header without clearing its configured slots. |
| `show_footer` | `true` | Show or hide the footer without clearing its configured slots. |
| `header_left` | `name` | Content for the header-left slot. |
| `header_center` | `none` | Content for the header-centre slot. |
| `header_right` | `current` | Content for the header-right slot. |
| `footer_left` | `none` | Content for the footer-left slot. |
| `footer_center` | `none` | Content for the footer-centre slot. |
| `footer_right` | `none` | Content for the footer-right slot. |
| `custom_text` | `""` | Custom text shown when a slot is set to `custom` or `text`. |
| `duration_format` | `short` | Duration label format. Options: `short`, `long`. |
| `ribbon_color_mode` | `static` | Global header/footer text colour mode. Options: `static`, `band`, `none`. |
| `ribbon_styles` | `{}` | Advanced per-slot style overrides. |

Legacy `top_left`, `top_center`, `top_right`, `bottom_left`, `bottom_center` and `bottom_right` options are still supported, but the `header_*` and `footer_*` names are preferred for new YAML.

Ribbon slots use a position-aware layout:

- If only one slot is occupied, it can use the full ribbon width.
- If left and right are occupied, they split the ribbon between them.
- If centre is occupied alongside left or right, the centre remains visually centred in the middle column, with a balancing blank column on the opposite side.
- If all three slots are occupied, each slot uses its own left, centre or right column.

Supported slot values:

| Value | Description |
|---|---|
| `none` | Empty slot. |
| `name` | Card name. |
| `current` | Current entity value and unit. |
| `band` | Current threshold band label. |
| `message` | Message from the current threshold band. |
| `band_message` | Alias for `message`. |
| `instruction` | Alias for `message`. |
| `instructions` | Alias for `message`. |
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
footer_left: duration
duration_format: short
```

This shows `30m`.

```yaml
hours_to_show: 48
footer_left: duration
duration_format: long
```

This shows `2 days`.

Shared header/footer text controls:

| Option | Default | Description |
|---|---:|---|
| `header_font_size` | `16` | Header slot font size. |
| `header_font_weight` | `600` | Header slot font weight. |
| `header_opacity` | `1` | Header slot text opacity. |
| `footer_font_size` | `12` | Footer slot font size. |
| `footer_font_weight` | `500` | Footer slot font weight. |
| `footer_opacity` | `0.8` | Footer slot text opacity. |

Legacy per-slot font controls are still supported for backwards compatibility and advanced YAML use:

```yaml
top_left_font_size: 16
top_left_font_weight: 600
bottom_center_font_size: 15
bottom_center_font_weight: 700
```

For more advanced styling, each slot can also be overridden with `ribbon_styles`:

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

Supported advanced style options:

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

### Interaction options

The card supports standard Home Assistant card interactions.

| Option | Default | Description |
|---|---:|---|
| `tap_action` | `{ action: more-info }` | Action to run when the card is tapped. |
| `hold_action` | `{ action: none }` | Action to run when the card is pressed and held. |
| `double_tap_action` | `{ action: none }` | Action to run when the card is double tapped. |

Supported actions include `more-info`, `navigate`, `url`, `call-service`, `toggle` and `none`.

Example:

```yaml
tap_action:
  action: navigate
  navigation_path: /dashboard-air-quality

hold_action:
  action: more-info

double_tap_action:
  action: none
```

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
| `marker_label_background_color` | `#ffffff` | Marker label background colour. |
| `marker_label_background_opacity` | `0.8` | Marker label background opacity. |
| `marker_label_background_mode` | `static` | Background mode. Options: `card`, `static`, `band`, `none`. |

Use this to match marker label backgrounds to the relevant marker value band:

```yaml
marker_label_background_mode: band
```

Use this to match marker label text to the relevant marker value band:

```yaml
marker_label_color_mode: band
```

If the marker value is outside all configured bands, band-driven marker label colours fall back to the configured static colour.

## Debug output

The debug slot can be added to any header or footer position:

```yaml
footer_left: debug
debug_multiline: true
debug_level: performance
```

Debug levels:

| Level | Description |
|---|---|
| `off` | No debug output. |
| `basic` | Shows history window, fetch age, raw/plotted/path point counts, history mode, source counts, refresh interval and axis range. |
| `performance` | Adds layout details, fetch/API/downsample/render timings, render count, downsampling ratio and point density. |
| `verbose` | Adds configuration details, entity details, first/last history point age and requested history window details. |

Example performance output:

```text
debug · 480h · fetched 12s ago
raw 740 · plotted 500 · path 501 · segments 500/543 · grouped paths 45 · max auto/500
history auto→hybrid · stats type mean · period hour · raw window 240h
stats 240 · raw 500 · merged 740
refresh 60s · hybrid history request
y 400-2000 · x relative · line band · area band
fetch 418ms · api 220ms · downsample 1ms
render 3ms · renders 79
downsample yes · ratio 68% · density 1.5/h
```

In the line debug:

| Value | Meaning |
|---|---|
| `segments 500/543` | Original line segments / threshold-split line segments. |
| `grouped paths 45` | Number of actual SVG line paths rendered after grouping same-colour sections. |

In the history debug:

| Value | Meaning |
|---|---|
| `history auto→hybrid` | Configured mode was `auto`, resolved mode was `hybrid`. |
| `stats 240` | Number of long-term statistics points fetched. |
| `raw 500` | Number of raw history points fetched. |
| `merged 740` | Final combined point count before downsampling. |

## Notes

Home Assistant history records state changes rather than regular samples. This card requests detailed history for the selected time window and then downsamples locally when needed.

When `max_history_points` is set to `auto`, the card currently targets about `500` plotted history points. The downsampling keeps the first and last points and tries to preserve local highs and lows, which helps retain short spikes.

The card appends the current live value at `now` when drawing the graph, so the line reaches the live edge of the chart without requiring a full history refresh every time the entity state changes.

Minimum and maximum markers are calculated from real Home Assistant history only, not from the artificial current-at-now point.

If you use `*_color_mode: band`, the configured `bands` are still required even when `show_bands: false`.

New YAML should prefer `header_*` and `footer_*` options, but older `top_*`, `bottom_*`, `top_ribbon_background_*` and `bottom_ribbon_background_*` options remain supported for backwards compatibility.

## Status

Work in progress, but functional. The card can load Home Assistant history, optionally combine long-term statistics with recent raw history, and render a configurable threshold-banded graph with optional line, area fill, markers, axes, grid lines, header/footer content, band-driven colours, interactions and debug diagnostics.

A Home Assistant visual editor is included for common configuration options, including data and range, history mode, axes, grid, appearance, bands, line, area, markers, header, footer, interactions and advanced/debug settings. Detailed per-slot overrides and complex band editing may still require YAML.

## Roadmap

Planned or possible future features:

- Better UI controls for editing individual bands
- More marker dot styling options
- Optional hover / tooltip features
- More compact presets
- Optional dynamic defaults based on entity device class
- Optional band templates for common sensors such as CO₂, humidity, battery and temperature
- Ribbon background value-fill mode, where header/footer backgrounds fill left-to-right based on the current value within the configured band range
- More debug information for responsive layout, SVG path generation and rendered dimensions
- More examples and screenshots
- Better handling for marker values outside configured bands
- Packaging/polish for a wider HACS release

## License

MIT License.
