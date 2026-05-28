# Simple Band Graph Card

<img width="1448" height="1086" alt="Simple Card Schematic" src="https://github.com/user-attachments/assets/bbbe2cf6-450c-4c98-af0e-f9070a986101" />


A Home Assistant custom card for clean, configurable line and area graphs with coloured threshold bands.

It is designed for sensors where values are easier to understand with context: CO₂, air quality, temperature, humidity, battery level, energy use, solar generation, temperature difference, import/export power, and anything else with meaningful thresholds.

[![Open your Home Assistant instance and add this repository to HACS.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=Future-Surfer&repository=simple-band-graph-card&category=plugin)

## Highlights

- **Threshold bands**: define coloured value ranges with optional labels and messages.
- **Line, area and band styling**: colour the line or area by band, use stepped or smooth gradients, and control opacity, width and layering.
- **Polished visuals**: add card shadows, borders, rounded plot areas, soft axes, line shadows, marker chips and connector lines.
- **Contextual headers and footers**: show the current value, band label, message, duration, min/max values, custom text or debug output.
- **Flexible history handling**: use raw history, long-term statistics, or hybrid history for longer time windows.
- **Visual editor support**: configure common options directly in the Home Assistant UI, with advanced YAML available when needed.

## Features

### Threshold-based graphing

- Display recent Home Assistant entity history as a clean, responsive graph
- Define coloured threshold bands using `from`, `to`, `color`, `label` and `message`
- Show bands as stepped blocks or as a smooth vertical gradient
- Show, hide or layer band labels independently of the graph data
- Use band colours even when visible bands are hidden

### Line and area rendering

- Customise line colour, width and opacity
- Colour line segments by threshold band
- Use smooth band gradients for the line with `line_color_mode: gradient`
- Add optional line outline, halo or shadow effects
- Show an optional area fill between the graph line and the zero point
- Use static, gradient, vertical band or horizontal band area fills
- Smooth or step band-coloured area fills with `area_band_blend`
- Limit area gradient stops for smoother performance and appearance

### Visual polish

- Configure card background, opacity, border and shadow
- Add a subtle card shine effect
- Configure plot background colour, opacity and corner radius
- Use soft-ended axes for a less boxy look
- Use spike or stick axis ticks
- Add configurable grid lines and band separators
- Add band surface styles such as flat, soft, glass or glow

### Markers and labels

- Show latest, minimum and maximum markers
- Configure marker dot fill, stroke, opacity, glow and shadow
- Use band-coloured marker dots
- Add marker label chips with configurable padding, radius, background, border and shadow
- Use one-line or two-line marker labels
- Show value, value + unit, band label, band message, time, age or custom text
- Add marker connector lines with solid, dashed or dotted styles
- Use smart marker placement with edge, overlap and line avoidance

### Headers, footers and messages

- Configure header and footer slots independently
- Show name, current value, band, message, duration, min, max, entity, unit, custom text or debug output
- Use band-specific messages to turn sensor values into readable status text
- Apply band-driven colours to header, footer, card or plot backgrounds
- Use a position-aware layout so left, centre and right slots stay balanced
- Older `top_*` and `bottom_*` ribbon options remain supported for backwards compatibility

### Axes, labels and layout

- Configure X/Y axis lines and labels independently
- Place the X-axis line at the top, bottom or zero value
- Place X-axis labels independently at the top, middle or bottom
- Add a Y-axis title such as `{unit}`
- Configure axis gaps, soft starts/ends, tick shapes, label colours and opacity
- Resize cleanly in Home Assistant Sections layouts, including compact status-card layouts

### Home Assistant integration and diagnostics

- Supports standard card interactions with `tap_action`, `hold_action` and `double_tap_action`
- Includes a visual editor for common configuration options
- Automatically downsamples large history responses for better performance
- Provides optional debug and performance diagnostics
- Appends the current live value so the chart reaches “now” between full history refreshes

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

Simple Band Graph Card includes a Home Assistant visual editor for common configuration options.

The visual editor can configure:

- Entity, name, history source, history window, fallback graph height and value decimal places
- Raw, statistics and hybrid history options
- Y-axis range
- X/Y axis lines, tick labels, positions, gaps, soft ends and styling
- X-axis zero-line positioning and independent X-axis label positioning
- Y-axis title display and positioning
- Grid visibility, colour, width, opacity and line style
- Card background, border, shadow, shine, radius and padding
- Plot background colour, opacity and radius
- Band visibility, stepped/gradient band fill, band surface style and band separators
- Band labels, layer, alignment and text styling
- Raw band definitions
- Line colour, width, opacity, band-driven colouring, gradient colouring, outline, halo and shadow
- Area visibility, colour, opacity, static gradients, vertical/horizontal band modes and smooth/stepped area band blends
- Latest, minimum and maximum markers
- Marker dot styling, marker label content, marker label chips and connector lines
- Header and footer visibility, slot content, text styling and backgrounds
- Standard card interactions
- Debug and history refresh settings

Some advanced YAML options, especially detailed per-slot header/footer text overrides and complex styling combinations, may still be easier to edit directly in YAML.

## Examples

The examples below are grouped from simple to advanced. Start with the minimal example, then copy features across as needed.

<details open>
<summary>Minimal threshold graph</summary>

<img width="718" height="411" alt="Simple Band Graph Card minimal example" src="https://github.com/user-attachments/assets/7b392cd7-310e-47ee-8c85-eebd75916142" />

A simple graph with one entity and a few coloured threshold bands.

```yaml
type: custom:simple-band-graph-card
entity: sensor.example_co2
name: Office CO₂
hours_to_show: 24
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
<summary>Compact status card</summary>

<img width="328" height="282" alt="Simple Band Graph Card compact status example" src="https://github.com/user-attachments/assets/9667e07c-c4b1-47c2-829a-7dd83b4f9a82" />

A compact layout that behaves more like a status tile.

```yaml
type: custom:simple-band-graph-card
entity: sensor.example_co2
name: Office CO₂
hours_to_show: 12
y_min: 400
y_max: 2000

grid_options:
  columns: 6
  rows: 3

show_header: true
header_left: none
header_center: current
header_right: none

show_footer: false

header_background_color_mode: band
header_background_opacity: 0.7
ribbon_background_radius: 10

show_bands: true
band_opacity: 0.18

show_line: true
line_color_mode: band
line_width: 3

show_x_axis: false
show_x_axis_labels: false
show_y_axis: false
show_y_axis_labels: false

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
<summary>Header, footer and band message</summary>

<img width="721" height="507" alt="Simple Band Graph Card ribbon message example" src="https://github.com/user-attachments/assets/c8beef94-b952-4374-95f5-5673f7fd0e10" />

Shows the current value, graph duration and a message from the current threshold band.

```yaml
type: custom:simple-band-graph-card
entity: sensor.example_co2
name: Office CO₂
hours_to_show: 12
y_min: 400
y_max: 2000

show_header: true
header_left: name
header_center: none
header_right: duration

show_footer: true
footer_left: none
footer_center: message
footer_right: current

duration_format: short

footer_background_color_mode: band
footer_background_opacity: 0.35
ribbon_background_radius: 10

footer_font_size: 15
footer_font_weight: 700
footer_opacity: 1

band_opacity: 0.18

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
<summary>Band-coloured line</summary>

<img width="730" height="433" alt="Simple Band Graph Card band-coloured line example" src="https://github.com/user-attachments/assets/3d434498-f8f8-4862-b816-b32883007bfc" />

Uses translucent bands with a stronger band-coloured line on top.

```yaml
type: custom:simple-band-graph-card
entity: sensor.example_co2
name: CO₂ Band Line
hours_to_show: 24
y_min: 400
y_max: 2000

show_header: true
header_left: name
header_center: band
header_right: current

show_bands: true
band_opacity: 0.14

show_line: true
line_color_mode: band
line_width: 4
line_opacity: 1

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
<summary>Smooth gradient line</summary>

Uses the configured band colours to create a smooth line gradient.

```yaml
type: custom:simple-band-graph-card
entity: sensor.example_temperature
name: Temperature Gradient Line
hours_to_show: 24
height: 240
y_min: 14
y_max: 28

show_header: true
header_left: name
header_center: band
header_right: current

show_bands: true
band_fill_mode: gradient
band_opacity: 0.16

show_line: true
line_color_mode: gradient
line_width: 4
line_opacity: 1

show_area: false

band_label_mode: label
band_label_position: middle
band_label_align: center
band_label_layer: below

bands:
  - from: 14
    to: 17
    color: "#3b82f6"
    label: Cool
  - from: 17
    to: 21
    color: "#22c55e"
    label: Comfortable
  - from: 21
    to: 24
    color: "#eab308"
    label: Warm
  - from: 24
    to: 28
    color: "#ef4444"
    label: Hot
```

</details>

<details>
<summary>Static area gradient</summary>

A simple area fill using one colour that fades down.

```yaml
type: custom:simple-band-graph-card
entity: sensor.example_temperature
name: Temperature Area
hours_to_show: 24
height: 240
y_min: 14
y_max: 28

show_bands: false

show_line: true
line_color: "#ef4444"
line_color_mode: static
line_width: 3

show_area: true
area_color: "#ef4444"
area_color_mode: static
area_fill_style: gradient
area_gradient_direction: vertical
area_gradient_opacity_start: 0.32
area_gradient_opacity_end: 0

show_x_axis: true
show_x_axis_labels: true
show_y_axis: true
show_y_axis_labels: true
```

</details>

<details>
<summary>Vertical band area</summary>

Colours the area under the line using vertical time slices. This is useful when you want the area to follow the changing value over time.

```yaml
type: custom:simple-band-graph-card
entity: sensor.example_temperature
name: Vertical Band Area
hours_to_show: 24
height: 260
y_min: 14
y_max: 28

show_bands: false

show_line: true
line_color_mode: band
line_width: 3

show_area: true
area_color_mode: band
area_band_mode: vertical
area_band_blend: stepped
area_opacity: 0.35

band_label_mode: label
band_label_position: middle
band_label_align: center
band_label_layer: above

bands:
  - from: 14
    to: 17
    color: "#3b82f6"
    label: Cool
  - from: 17
    to: 21
    color: "#22c55e"
    label: Comfortable
  - from: 21
    to: 24
    color: "#eab308"
    label: Warm
  - from: 24
    to: 28
    color: "#ef4444"
    label: Hot
```

</details>

<details>
<summary>Horizontal band area</summary>

Colours the area under the line using horizontal value bands. This gives a strong “filled threshold zone” effect.

```yaml
type: custom:simple-band-graph-card
entity: sensor.example_temperature
name: Horizontal Band Area
hours_to_show: 24
height: 260
y_min: 14
y_max: 28

show_bands: true
band_opacity: 0

show_line: true
line_color_mode: band
line_width: 3

show_area: true
area_color_mode: band
area_band_mode: horizontal
area_band_blend: stepped
area_opacity: 0.45

band_label_mode: label
band_label_position: middle
band_label_align: center
band_label_layer: above

bands:
  - from: 14
    to: 17
    color: "#3b82f6"
    label: Cool
  - from: 17
    to: 21
    color: "#22c55e"
    label: Comfortable
  - from: 21
    to: 24
    color: "#eab308"
    label: Warm
  - from: 24
    to: 28
    color: "#ef4444"
    label: Hot
```

</details>

<details>
<summary>Smooth band area gradients</summary>

Uses `area_band_blend: gradient` to smooth the band-coloured area. Use `area_band_gradient_max_stops` to control how closely vertical gradients follow the plotted data.

```yaml
type: custom:simple-band-graph-card
entity: sensor.example_temperature
name: Smooth Band Area
hours_to_show: 24
height: 260
y_min: 14
y_max: 28

show_bands: false

show_line: true
line_color_mode: band
line_width: 3

show_area: true
area_color_mode: band
area_band_mode: vertical
area_band_blend: gradient
area_band_gradient_max_stops: 50
area_opacity: 0.55

band_label_mode: label
band_label_position: middle
band_label_align: center
band_label_layer: above

bands:
  - from: 14
    to: 17
    color: "#3b82f6"
    label: Cool
  - from: 17
    to: 21
    color: "#22c55e"
    label: Comfortable
  - from: 21
    to: 24
    color: "#eab308"
    label: Warm
  - from: 24
    to: 28
    color: "#ef4444"
    label: Hot
```

To smooth by value band instead of by time, change:

```yaml
area_band_mode: horizontal
```

</details>

<details>
<summary>Area-only graph</summary>

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
area_band_mode: vertical
area_band_blend: stepped
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
<summary>Premium visual polish</summary>

A more styled card using shadows, soft axes, marker chips, line shadow and connector lines.

```yaml
type: custom:simple-band-graph-card
entity: sensor.example_temperature
name: Polished Temperature Card
hours_to_show: 24
height: 320
y_min: 14
y_max: 28

background_color_mode: static
background_color: white
card_padding: 26
card_border_width: 1.5
card_border_opacity: 0.15
card_shadow: true
card_shadow_blur: 18
card_shadow_spread: -7
card_shadow_offset_x: 4
card_shadow_offset_y: 4

show_header: true
header_left: name
header_center: none
header_right: current

show_footer: false

show_bands: true
band_fill_mode: stepped
band_opacity: 0

band_label_mode: label
band_label_position: middle
band_label_align: center
band_label_layer: above
band_label_unit: false

show_line: true
line_color_mode: band
line_width: 3
line_opacity: 0.95
line_shadow: true
line_shadow_blur: 2
line_shadow_offset_x: 1
line_shadow_offset_y: 1
line_shadow_opacity: 0.7

show_area: true
area_color_mode: band
area_band_mode: horizontal
area_band_blend: gradient
area_opacity: 0.55

show_x_axis: true
show_x_axis_labels: true
x_axis_position: bottom
x_axis_label_position: bottom
x_axis_label_mode: relative
x_axis_ticks: 5
x_axis_gap: 9
x_axis_soft_start: true
x_axis_soft_end: true
x_axis_tick_shape: spike

show_y_axis: true
show_y_axis_labels: true
y_axis_position: left
y_axis_ticks: 5
y_axis_gap: 9
y_axis_soft_start: true
y_axis_soft_end: true
y_axis_tick_shape: spike

show_y_axis_title: true
y_axis_title: "{unit}"
y_axis_title_position: middle
y_axis_title_gap: 48

show_latest: true
show_latest_label: true
latest_marker_size: 5

show_min: true
show_max: true
show_extrema_labels: true
extrema_marker_size: 0

marker_dot_fill_color_mode: band
marker_dot_stroke_color: var(--card-background-color)
marker_dot_stroke_color_mode: static
marker_dot_stroke_width: 2

marker_label_line_1_mode: value_unit
marker_label_line_2_mode: band
marker_label_text_line_gap: 1
marker_label_line_1_size: 12
marker_label_line_2_size: 9
marker_label_weight: 600
marker_label_color: white
marker_label_color_mode: static

marker_label_background_color: black
marker_label_background_mode: static
marker_label_background_opacity: 0.92
marker_label_radius: 7
marker_label_padding_x: 7
marker_label_padding_y: 4

marker_label_shadow: true
marker_label_shadow_blur: 3
marker_label_shadow_offset_x: 1
marker_label_shadow_offset_y: 1
marker_label_shadow_color: black
marker_label_shadow_opacity: 0.5

marker_connector: true
marker_connector_color_mode: band
marker_connector_width: 2.5
marker_connector_opacity: 0.35
marker_connector_style: dashed
marker_connector_dasharray: 3 4

marker_label_position: smart
marker_label_avoid_edges: true
marker_label_avoid_overlap: true
marker_label_avoid_line: true
marker_label_line_gap: 8
marker_label_min_gap: 10

bands:
  - from: 14
    to: 17
    color: "#3b82f6"
    label: Cool
  - from: 17
    to: 21
    color: "#22c55e"
    label: Comfortable
  - from: 21
    to: 24
    color: "#eab308"
    label: Warm
  - from: 24
    to: 28
    color: "#ef4444"
    label: Hot
```

</details>

<details>
<summary>Axes, grid and zero line</summary>

Shows configurable axes, tick labels, grid lines and a zero-position X-axis.

```yaml
type: custom:simple-band-graph-card
entity: sensor.example_temperature_delta
name: Temperature Delta
hours_to_show: 24
height: 240

y_min: -10
y_max: 10
value_decimals: 1

show_header: true
header_left: name
header_center: band
header_right: current

show_x_axis: true
show_x_axis_labels: true
x_axis_position: zero
x_axis_label_position: bottom
x_axis_label_mode: relative
x_axis_ticks: 5
x_axis_line_width: 3
x_axis_tick_shape: spike

show_y_axis: true
show_y_axis_labels: true
y_axis_position: left
y_axis_ticks: 5
y_axis_tick_shape: spike

show_x_grid: true
show_y_grid: true
grid_opacity: 0.22
grid_line_style: dashed

show_line: true
line_color_mode: band
line_width: 3

show_area: true
area_color_mode: band
area_band_mode: vertical
area_band_blend: stepped
area_opacity: 0.22

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
<summary>Long-term hybrid history</summary>

Uses hybrid history for longer time ranges: older long-term statistics plus recent raw history.

```yaml
type: custom:simple-band-graph-card
entity: sensor.example_co2
name: CO₂ Long History
hours_to_show: 480
height: 240

history_mode: hybrid
statistics_type: mean
statistics_period: hour
hybrid_raw_hours: 240

max_history_points: auto

y_min: 400
y_max: 2000

show_header: true
header_left: name
header_center: duration
header_right: current

show_footer: true
footer_left: debug
footer_center: none
footer_right: none

debug_level: basic
debug_multiline: true

show_line: true
line_color_mode: band
line_width: 3

show_area: true
area_color_mode: band
area_band_mode: vertical
area_band_blend: gradient
area_band_gradient_max_stops: 50
area_opacity: 0.18

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
<summary>Debug and performance diagnostics</summary>

<img width="720" height="793" alt="Simple Band Graph Card performance debug example" src="https://github.com/user-attachments/assets/a363b212-0363-4f1f-aa7c-bf2ef49880d8" />

Shows detailed debug and performance output, including fetch timings, downsampling, render counts, history source information and path information.

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

show_header: true
header_left: name
header_center: duration
header_right: current

show_footer: true
footer_left: debug
footer_center: none
footer_right: none

debug_level: performance
debug_multiline: true

footer_font_size: 11
footer_font_weight: 400
footer_opacity: 0.75

show_line: true
line_color_mode: band
line_width: 4
line_opacity: 1

show_area: true
area_color_mode: band
area_band_mode: vertical
area_band_blend: gradient
area_band_gradient_max_stops: 50
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

marker_label_background_mode: card
marker_label_background_opacity: 0.8
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

The most important options are shown first. More detailed option groups are collapsed so the README stays readable.

### Core options

| Option | Required | Default | Description |
|---|---:|---:|---|
| `entity` | Yes |  | The Home Assistant entity to graph. |
| `name` | No | Entity ID | Custom card title. |
| `hours_to_show` | No | `24` | Number of hours of history to display. |
| `height` | No | `160` | Graph height in pixels. |
| `y_min` | No | `0` | Minimum Y-axis value. |
| `y_max` | No | `100` | Maximum Y-axis value. |
| `value_decimals` | No | `auto` | Decimal places for displayed values. Options: `auto`, `0`, `1`, `2`, `3`. |
| `bands` | No | Starter bands | List of coloured threshold bands. |

`value_decimals` affects displayed values such as axis labels, marker labels, band ranges and current values shown in header/footer slots.

### Bands

Each band supports:

| Option | Description |
|---|---|
| `from` | Lower value for the band. |
| `to` | Upper value for the band. |
| `color` | Band colour. Solid colours are recommended, e.g. `#2ecc71`, with transparency controlled using options such as `band_opacity` or `area_opacity`. |
| `label` | Optional label for the band. |
| `message` | Optional message or instruction for the band. This can be shown in a header/footer slot using `message`, `band_message`, `instruction` or `instructions`. |

Example:

```yaml
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

<details>
<summary>History and performance options</summary>

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

</details>

<details>
<summary>Band display options</summary>

| Option | Default | Description |
|---|---:|---|
| `show_bands` | `true` | Show or hide the visible coloured band areas. Bands can still be used for labels, messages and colour logic when hidden. |
| `band_opacity` | `0.24` | Opacity for the coloured band backgrounds, from `0` to `1`. |
| `band_fill_mode` | `stepped` | Band background fill mode. Options: `stepped`, `gradient`. |

Band fill modes:

| Mode | Behaviour |
|---|---|
| `stepped` | Draws each band as a separate flat-colour threshold block. |
| `gradient` | Draws one smooth vertical gradient through the configured band colours. This is useful for continuous ranges such as temperature, humidity, battery level or air quality. |

</details>

<details>
<summary>Band surface options</summary>

Band surfaces add subtle visual treatments to visible band backgrounds.

| Option | Default | Description |
|---|---:|---|
| `band_surface_style` | `flat` | Band surface treatment. Options: `flat`, `soft`, `glass`, `glow`. |
| `band_surface_highlight_opacity` | `0.06` | Highlight strength for surface effects. |
| `band_surface_shadow_opacity` | `0.1` | Shadow strength for surface effects. |
| `band_surface_border_width` | `0` | Optional internal band border width. |
| `band_surface_border_opacity` | `0.12` | Optional internal band border opacity. |
| `band_surface_glow` | `false` | Adds a subtle band glow. |
| `band_surface_glow_opacity` | `0.08` | Band glow opacity. |
| `band_surface_glow_blur` | `18` | Band glow blur size. |

Example:

```yaml
band_surface_style: glass
band_surface_highlight_opacity: 0.08
band_surface_shadow_opacity: 0.12
band_surface_border_width: 1
band_surface_border_opacity: 0.16
```

</details>

<details>
<summary>Band label options</summary>

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

</details>

<details>
<summary>Band separator options</summary>

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

</details>

<details>
<summary>Colour modes</summary>

Several options support a matching `*_color_mode`.

| Mode | Behaviour |
|---|---|
| `static` | Use the configured colour. |
| `band` | Use a band colour. For card/plot/header/footer backgrounds and header/footer text this uses the current value’s band. For marker labels and dots this uses the marker value’s own band. For line colour it uses the band the line section passes through. For area colour it depends on the configured area band mode. |
| `gradient` | Smoothly blend between configured band colours. Supported by `line_color_mode`. |
| `none` | Use transparent/no colour. |

Examples:

```yaml
background_color_mode: band
plot_background_color_mode: band
header_background_color_mode: band
footer_background_color_mode: band
ribbon_color_mode: band
marker_label_color_mode: band
marker_dot_fill_color_mode: band
line_color_mode: band
line_color_mode: gradient
area_color_mode: band
```

Gradient band backgrounds are controlled separately with:

```yaml
band_fill_mode: gradient
```

Area band gradients are controlled with:

```yaml
area_color_mode: band
area_band_mode: vertical
area_band_blend: gradient
```

</details>

<details>
<summary>Line options</summary>

| Option | Default | Description |
|---|---:|---|
| `show_line` | `true` | Show or hide the graph line. |
| `line_color` | `var(--primary-color)` | Graph line colour. Used when `line_color_mode: static`, and as a fallback. |
| `line_color_mode` | `static` | Line colour mode. Options: `static`, `band`, `gradient`, `none`. |
| `line_width` | `2.5` | Graph line width. |
| `line_opacity` | `0.9` | Graph line opacity. |

When `line_color_mode: band` is used, the line is coloured according to the configured bands. Line sections are split at threshold boundaries, then consecutive same-colour sections are grouped into fewer SVG paths for better performance.

When `line_color_mode: gradient` is used, the line blends smoothly through the configured band colours.

Example:

```yaml
show_line: true
line_color_mode: band
line_width: 4
line_opacity: 1
```

</details>

<details>
<summary>Line effect options</summary>

| Option | Default | Description |
|---|---:|---|
| `line_outline` | `false` | Draw an outline behind the main line. |
| `line_outline_color` | `#ffffff` | Line outline colour. |
| `line_outline_width` | `1` | Line outline width. |
| `line_outline_opacity` | `0.65` | Line outline opacity. |
| `line_halo` | `false` | Draw a soft halo behind the line. |
| `line_halo_color` | `#ffffff` | Line halo colour. |
| `line_halo_width` | `8` | Line halo width. |
| `line_halo_blur` | `4` | Line halo blur. |
| `line_halo_opacity` | `0.18` | Line halo opacity. |
| `line_shadow` | `false` | Draw a shadow behind the line. |
| `line_shadow_color` | `rgba(0, 0, 0, 0.45)` | Line shadow colour. |
| `line_shadow_blur` | `6` | Line shadow blur. |
| `line_shadow_offset_x` | `0` | Line shadow horizontal offset. |
| `line_shadow_offset_y` | `2` | Line shadow vertical offset. |
| `line_shadow_opacity` | `0.35` | Line shadow opacity. |

Example:

```yaml
line_shadow: true
line_shadow_blur: 2
line_shadow_offset_x: 1
line_shadow_offset_y: 1
line_shadow_opacity: 0.7
```

</details>

<details>
<summary>Area options</summary>

| Option | Default | Description |
|---|---:|---|
| `show_area` | `false` | Show or hide the filled area. |
| `area_color` | `var(--primary-color)` | Area fill colour. Used when `area_color_mode: static`, and as a fallback. |
| `area_color_mode` | `static` | Area colour mode. Options: `static`, `band`, `none`. |
| `area_opacity` | `0.18` | Area fill opacity. |
| `area_fill_style` | `solid` | Static area fill style. Options: `solid`, `gradient`. |
| `area_gradient_direction` | `vertical` | Static area gradient direction. Options: `vertical`, `horizontal`. |
| `area_gradient_opacity_start` | `0.24` | Starting opacity for static area gradients. |
| `area_gradient_opacity_end` | `0` | Ending opacity for static area gradients. |
| `area_band_mode` | `vertical` | Band area mode. Options: `vertical`, `horizontal`. |
| `area_band_blend` | `stepped` | Band area blend. Options: `stepped`, `gradient`. |
| `area_band_gradient_max_stops` | `50` | Maximum number of gradient stops used for smooth vertical band area gradients. |

The area is drawn between the plotted history value and the zero point on the Y-axis. This means it works naturally for graphs with positive and negative values, such as temperature difference, battery charge/discharge, import/export, or balance-style sensors.

If zero is outside the visible Y-axis range, the baseline is clamped to the nearest edge of the plot.

The area can be shown independently of the line:

```yaml
show_line: false
show_area: true
```

Static gradient area:

```yaml
show_area: true
area_color_mode: static
area_fill_style: gradient
area_gradient_direction: vertical
area_gradient_opacity_start: 0.3
area_gradient_opacity_end: 0
```

Band-coloured area:

```yaml
show_area: true
area_color_mode: band
area_band_mode: vertical
area_band_blend: stepped
area_opacity: 0.25
```

</details>

<details>
<summary>Area band modes</summary>

| Mode | Behaviour |
|---|---|
| `area_band_mode: vertical` | Colours the area across time, based on the band of the value as the line moves through the history window. |
| `area_band_mode: horizontal` | Colours the area by horizontal value bands, clipped underneath the line. |

| Blend | Behaviour |
|---|---|
| `area_band_blend: stepped` | Uses hard colour transitions. |
| `area_band_blend: gradient` | Uses smooth colour transitions. For vertical mode, `area_band_gradient_max_stops` controls how many gradient stops are used. |

Examples:

```yaml
area_color_mode: band
area_band_mode: vertical
area_band_blend: stepped
```

```yaml
area_color_mode: band
area_band_mode: vertical
area_band_blend: gradient
area_band_gradient_max_stops: 50
```

```yaml
area_color_mode: band
area_band_mode: horizontal
area_band_blend: stepped
```

```yaml
area_color_mode: band
area_band_mode: horizontal
area_band_blend: gradient
```

</details>

<details>
<summary>Background and card appearance options</summary>

| Option | Default | Description |
|---|---:|---|
| `background_color` | `var(--card-background-color)` | Outer card background colour. |
| `background_opacity` | `1` | Outer card background opacity. |
| `background_color_mode` | `static` | Options: `static`, `band`, `none`. |
| `card_radius` | `var(--ha-card-border-radius, 12px)` | Outer card corner radius. |
| `card_padding` | `16` | Internal card padding. |
| `card_border_width` | `0` | Outer card border width. |
| `card_border_color` | `var(--divider-color)` | Outer card border colour. |
| `card_border_opacity` | `0` | Outer card border opacity. |

Card shadow options:

| Option | Default | Description |
|---|---:|---|
| `card_shadow` | `false` | Enable or disable the outer card shadow. |
| `card_shadow_color` | `rgba(0, 0, 0, 0.25)` | Shadow colour. |
| `card_shadow_blur` | `24` | Shadow blur size. |
| `card_shadow_spread` | `0` | Shadow spread. |
| `card_shadow_offset_x` | `0` | Horizontal shadow offset. |
| `card_shadow_offset_y` | `8` | Vertical shadow offset. |

Card shine options:

| Option | Default | Description |
|---|---:|---|
| `card_shine` | `false` | Add a subtle shine overlay. |
| `card_shine_opacity` | `0.12` | Shine opacity. |
| `card_shine_size` | `55` | Shine size as a percentage. |
| `card_shine_position` | `0` | Shine position as a percentage. |
| `card_shine_angle` | `155` | Shine angle in degrees. |

Example:

```yaml
background_color_mode: static
background_color: white
card_padding: 26
card_border_width: 1.5
card_border_opacity: 0.15
card_shadow: true
card_shadow_blur: 18
card_shadow_spread: -7
card_shadow_offset_x: 4
card_shadow_offset_y: 4
```

</details>

<details>
<summary>Plot background options</summary>

| Option | Default | Description |
|---|---:|---|
| `plot_background_color` | `transparent` | Plot area background colour. |
| `plot_background_opacity` | `0` | Plot area background opacity. |
| `plot_background_color_mode` | `none` | Options: `static`, `band`, `none`. |
| `plot_background_radius` | `8` | Plot area background corner radius. Bands and line content are clipped to this rounded plot shape. |

Example:

```yaml
plot_background_color_mode: band
plot_background_opacity: 0.12
plot_background_radius: 10
```

</details>

<details>
<summary>Header and footer background options</summary>

| Option | Default | Description |
|---|---:|---|
| `header_background_color` | `transparent` | Header background colour. |
| `header_background_opacity` | `0` | Header background opacity. |
| `header_background_color_mode` | `static` | Options: `static`, `band`, `none`. |
| `footer_background_color` | `transparent` | Footer background colour. |
| `footer_background_opacity` | `0` | Footer background opacity. |
| `footer_background_color_mode` | `static` | Options: `static`, `band`, `none`. |
| `ribbon_background_radius` | `8` | Header/footer background corner radius. |

Example:

```yaml
header_background_color_mode: band
header_background_opacity: 0.2

footer_background_color_mode: band
footer_background_opacity: 0.35

ribbon_background_radius: 10
```

Legacy `top_ribbon_background_*` and `bottom_ribbon_background_*` options are still supported for backwards compatibility, but `header_background_*` and `footer_background_*` are preferred for new YAML.

</details>

<details>
<summary>Axis options</summary>

X-axis and Y-axis lines are controlled separately from their labels. For example, you can hide the axis line while keeping the labels visible, or place the X-axis line at zero while leaving X-axis labels at the bottom.

| Option | Default | Description |
|---|---:|---|
| `show_x_axis` | `true` | Show or hide the X-axis line. |
| `show_x_axis_labels` | `true` | Show or hide X-axis labels. |
| `x_axis_position` | `bottom` | X-axis line position. Options: `bottom`, `top`, `zero`. |
| `x_axis_label_position` | `bottom` | X-axis label position. Options: `bottom`, `middle`, `top`. |
| `x_axis_label_mode` | `relative` | X-axis label mode. Options: `relative`, `time`. |
| `x_axis_ticks` | `3` | Number of X-axis tick labels. |
| `x_axis_gap` | `0` | Gap between the X-axis and the plot edge or zero line. |
| `x_axis_soft_start` | `false` | Softly fade the start of the X-axis line. |
| `x_axis_soft_end` | `false` | Softly fade the end of the X-axis line. |
| `x_axis_soft_size` | `24` | Size of the soft axis fade. |

X-axis line, tick and label styling:

| Option | Default | Description |
|---|---:|---|
| `x_axis_line_color` | `var(--divider-color)` | X-axis line colour. |
| `x_axis_line_width` | `1` | X-axis line width. |
| `x_axis_line_opacity` | `1` | X-axis line opacity. |
| `x_axis_tick_position` | `crossing` | Tick position. Options: `above`, `below`, `crossing`. |
| `x_axis_tick_shape` | `stick` | Tick shape. Options: `stick`, `spike`. |
| `x_axis_tick_length` | `6` | Tick length. |
| `x_axis_tick_width` | `1` | Tick width. |
| `x_axis_tick_color` | `var(--divider-color)` | Tick colour. |
| `x_axis_tick_color_mode` | `axis` | Options: `axis`, `static`, `none`. |
| `x_axis_tick_opacity` | `1` | Tick opacity. |
| `x_axis_label_size` | `11` | X-axis label font size. |
| `x_axis_label_weight` | `400` | X-axis label font weight. |
| `x_axis_label_color` | `var(--secondary-text-color)` | X-axis label colour. |
| `x_axis_label_color_mode` | `static` | Options: `static`, `band`, `none`. |
| `x_axis_label_opacity` | `0.8` | X-axis label opacity. |

Y-axis display options:

| Option | Default | Description |
|---|---:|---|
| `show_y_axis` | `true` | Show or hide the Y-axis line. |
| `show_y_axis_labels` | `true` | Show or hide Y-axis labels. |
| `y_axis_position` | `left` | Y-axis position. Options: `left`, `right`. |
| `y_axis_ticks` | `2` | Number of Y-axis tick labels. |
| `y_axis_gap` | `0` | Gap between the Y-axis and the plot edge. |
| `y_axis_soft_start` | `false` | Softly fade the start of the Y-axis line. |
| `y_axis_soft_end` | `false` | Softly fade the end of the Y-axis line. |
| `y_axis_soft_size` | `24` | Size of the soft axis fade. |

Y-axis line, tick and label styling:

| Option | Default | Description |
|---|---:|---|
| `y_axis_line_color` | `var(--divider-color)` | Y-axis line colour. |
| `y_axis_line_width` | `1` | Y-axis line width. |
| `y_axis_line_opacity` | `1` | Y-axis line opacity. |
| `y_axis_tick_position` | `crossing` | Tick position. Options: `left`, `right`, `crossing`. |
| `y_axis_tick_shape` | `stick` | Tick shape. Options: `stick`, `spike`. |
| `y_axis_tick_length` | `6` | Tick length. |
| `y_axis_tick_width` | `1` | Tick width. |
| `y_axis_tick_color` | `var(--divider-color)` | Tick colour. |
| `y_axis_tick_color_mode` | `axis` | Options: `axis`, `static`, `none`. |
| `y_axis_tick_opacity` | `1` | Tick opacity. |
| `y_axis_label_size` | `11` | Y-axis label font size. |
| `y_axis_label_weight` | `400` | Y-axis label font weight. |
| `y_axis_label_color` | `var(--secondary-text-color)` | Y-axis label colour. |
| `y_axis_label_color_mode` | `static` | Options: `static`, `band`, `none`. |
| `y_axis_label_opacity` | `0.8` | Y-axis label opacity. |

When `x_axis_position: zero` is used, the X-axis line is drawn at the Y-axis value of `0`. If zero is outside the current visible Y-axis range, the line is clamped to the nearest plot edge.

When both axis lines are visible, the card slightly overlaps the line ends so thicker X/Y axes form a clean joined corner.

Example:

```yaml
show_x_axis: true
show_x_axis_labels: true
x_axis_position: zero
x_axis_label_position: bottom
x_axis_gap: 9
x_axis_soft_start: true
x_axis_soft_end: true
x_axis_tick_shape: spike

show_y_axis: true
show_y_axis_labels: true
y_axis_position: left
y_axis_gap: 9
y_axis_soft_start: true
y_axis_soft_end: true
y_axis_tick_shape: spike
```

Legacy shared axis label options are still supported for backwards compatibility:

| Legacy option | Description |
|---|---|
| `axis_label_size` | Applies to both X and Y labels unless the newer X/Y-specific option is set. |
| `axis_label_weight` | Applies to both X and Y labels unless the newer X/Y-specific option is set. |
| `axis_label_color` | Applies to both X and Y labels unless the newer X/Y-specific option is set. |
| `axis_label_color_mode` | Applies to both X and Y labels unless the newer X/Y-specific option is set. |
| `axis_label_opacity` | Applies to both X and Y labels unless the newer X/Y-specific option is set. |

</details>

<details>
<summary>Y-axis title options</summary>

The Y-axis title is useful for showing a compact unit label, such as `°C`, `%`, `ppm` or `kWh`.

| Option | Default | Description |
|---|---:|---|
| `show_y_axis_title` | `false` | Show or hide the Y-axis title. |
| `y_axis_title` | `{unit}` | Y-axis title text. Supports `{unit}` and `{name}`. |
| `y_axis_title_position` | `top` | Title position. Options: `top`, `middle`. |
| `y_axis_title_gap` | `10` | Horizontal distance between the Y-axis title and the plot edge. |
| `y_axis_title_size` | `13` | Y-axis title font size. |
| `y_axis_title_weight` | `500` | Y-axis title font weight. |
| `y_axis_title_color` | `var(--secondary-text-color)` | Y-axis title colour. |
| `y_axis_title_color_mode` | `static` | Options: `static`, `band`, `none`. |
| `y_axis_title_opacity` | `0.8` | Y-axis title opacity. |

Example:

```yaml
show_y_axis_title: true
y_axis_title: "{unit}"
y_axis_title_position: middle
y_axis_title_gap: 48
```

</details>

<details>
<summary>Grid options</summary>

| Option | Default | Description |
|---|---:|---|
| `show_x_grid` | `false` | Show vertical grid lines. |
| `show_y_grid` | `false` | Show horizontal grid lines. |
| `grid_color` | `var(--divider-color)` | Grid line colour. |
| `grid_width` | `1` | Grid line width. |
| `grid_opacity` | `0.25` | Grid line opacity. |
| `grid_line_style` | `solid` | Grid line style. Options: `solid`, `dashed`, `dotted`. |

Grid lines use the same intervals as `x_axis_ticks` and `y_axis_ticks`, but skip the first and last ticks so grid lines appear inside the plot area rather than on the outer boundary.

Example:

```yaml
show_x_grid: true
show_y_grid: true
grid_opacity: 0.22
grid_line_style: dashed
```

</details>

<details>
<summary>Header and footer options</summary>

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
| `header_right` | `duration` | Content for the header-right slot. |
| `footer_left` | `none` | Content for the footer-left slot. |
| `footer_center` | `message` | Content for the footer-centre slot. |
| `footer_right` | `current` | Content for the footer-right slot. |
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

</details>

<details>
<summary>Header and footer text styling</summary>

Shared header/footer text controls:

| Option | Default | Description |
|---|---:|---|
| `header_font_size` | `16` | Header slot font size. |
| `header_font_weight` | `600` | Header slot font weight. |
| `header_opacity` | `1` | Header slot text opacity. |
| `header_multiline` | `false` | Allow header slot text to wrap onto multiple lines. |
| `header_max_lines` | `2` | Maximum number of header text lines when multiline is enabled. |
| `footer_font_size` | `14` | Footer slot font size. |
| `footer_font_weight` | `500` | Footer slot font weight. |
| `footer_opacity` | `0.8` | Footer slot text opacity. |
| `footer_multiline` | `false` | Allow footer slot text to wrap onto multiple lines. |
| `footer_max_lines` | `2` | Maximum number of footer text lines when multiline is enabled. |

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

</details>

<details>
<summary>Interaction options</summary>

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

</details>

<details>
<summary>Latest, minimum and maximum markers</summary>

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

Minimum and maximum markers are calculated from real Home Assistant history only, not from the artificial current-at-now point.

</details>

<details>
<summary>Marker dot options</summary>

| Option | Default | Description |
|---|---:|---|
| `marker_dot_fill_color` | `var(--primary-color)` | Marker dot fill colour. |
| `marker_dot_fill_color_mode` | `static` | Options: `card`, `static`, `band`, `none`. |
| `marker_dot_stroke_color` | `var(--card-background-color)` | Marker dot stroke colour. |
| `marker_dot_stroke_color_mode` | `static` | Options: `card`, `static`, `band`, `none`. |
| `marker_dot_stroke_width` | `2` | Marker dot stroke width. |
| `marker_dot_opacity` | `0.95` | Marker dot opacity. |
| `marker_dot_glow` | `false` | Add a glow around marker dots. |
| `marker_dot_glow_color` | `var(--primary-color)` | Marker dot glow colour. |
| `marker_dot_glow_color_mode` | `static` | Options: `static`, `band`, `none`. |
| `marker_dot_glow_blur` | `8` | Marker dot glow blur. |
| `marker_dot_glow_opacity` | `0.35` | Marker dot glow opacity. |
| `marker_dot_shadow` | `false` | Add a shadow behind marker dots. |
| `marker_dot_shadow_color` | `rgba(0, 0, 0, 0.35)` | Marker dot shadow colour. |
| `marker_dot_shadow_blur` | `4` | Marker dot shadow blur. |
| `marker_dot_shadow_offset_x` | `0` | Marker dot shadow horizontal offset. |
| `marker_dot_shadow_offset_y` | `2` | Marker dot shadow vertical offset. |
| `marker_dot_shadow_opacity` | `0.35` | Marker dot shadow opacity. |

Example:

```yaml
marker_dot_fill_color_mode: band
marker_dot_stroke_color: var(--card-background-color)
marker_dot_stroke_color_mode: static
marker_dot_stroke_width: 2
```

</details>

<details>
<summary>Marker label content options</summary>

Marker labels can use one or two lines of text.

| Option | Default | Description |
|---|---:|---|
| `marker_label_line_1_mode` | `value` | Content for the first marker label line. |
| `marker_label_line_2_mode` | `none` | Content for the second marker label line. |
| `marker_label_custom_line_1` | `""` | Custom text for line 1 when using `custom`. |
| `marker_label_custom_line_2` | `""` | Custom text for line 2 when using `custom`. |
| `marker_label_text_line_gap` | `2` | Gap between marker label text lines. |
| `marker_label_line_1_size` | `11` | First line font size. |
| `marker_label_line_2_size` | `10` | Second line font size. |
| `marker_label_size` | `11` | Legacy/shared marker label font size. Used as a fallback. |

Supported marker label line modes:

| Mode | Example |
|---|---|
| `none` | No line |
| `value` | `24.6` |
| `value_unit` | `24.6 °C` |
| `prefixed` | `Max 24.6` |
| `compact` | `↑ 24.6` |
| `band` | `Warm` |
| `message` | `Room is warm` |
| `time` | `14:30` |
| `date_time` | `Mon 14:30` |
| `age_auto` | `~2h ago` |
| `age_hours_minutes` | `2h 15m ago` |
| `custom` | Custom text |

Example:

```yaml
marker_label_line_1_mode: value_unit
marker_label_line_2_mode: band
marker_label_text_line_gap: 1
marker_label_line_1_size: 12
marker_label_line_2_size: 9
```

</details>

<details>
<summary>Marker label chip options</summary>

| Option | Default | Description |
|---|---:|---|
| `marker_label_weight` | `400` | Marker label font weight. |
| `marker_label_color` | `var(--primary-text-color)` | Marker label text colour. |
| `marker_label_color_mode` | `static` | Options: `static`, `band`, `none`. |
| `marker_label_opacity` | `0.9` | Marker label opacity. |
| `marker_label_background_color` | `#ffffff` | Marker label background colour. |
| `marker_label_background_opacity` | `0.8` | Marker label background opacity. |
| `marker_label_background_mode` | `static` | Background mode. Options: `card`, `static`, `band`, `none`. |
| `marker_label_radius` | `3` | Marker label chip corner radius. |
| `marker_label_padding_x` | `3` | Horizontal padding inside the marker label chip. |
| `marker_label_padding_y` | `3` | Vertical padding inside the marker label chip. |
| `marker_label_border_width` | `0` | Marker label chip border width. |
| `marker_label_border_color` | `var(--divider-color)` | Marker label chip border colour. |
| `marker_label_border_color_mode` | `static` | Options: `card`, `static`, `band`, `none`. |
| `marker_label_border_opacity` | `0` | Marker label chip border opacity. |
| `marker_label_shadow` | `false` | Add a shadow behind marker label chips. |
| `marker_label_shadow_color` | `rgba(0, 0, 0, 0.35)` | Marker label shadow colour. |
| `marker_label_shadow_blur` | `10` | Marker label shadow blur. |
| `marker_label_shadow_offset_x` | `0` | Marker label shadow horizontal offset. |
| `marker_label_shadow_offset_y` | `3` | Marker label shadow vertical offset. |
| `marker_label_shadow_opacity` | `0.35` | Marker label shadow opacity. |

Use this to match marker label backgrounds to the relevant marker value band:

```yaml
marker_label_background_mode: band
```

Use this to match marker label text to the relevant marker value band:

```yaml
marker_label_color_mode: band
```

If the marker value is outside all configured bands, band-driven marker label colours fall back to the configured static colour.

Example:

```yaml
marker_label_color: white
marker_label_color_mode: static
marker_label_background_color: black
marker_label_background_mode: static
marker_label_background_opacity: 0.92
marker_label_radius: 7
marker_label_padding_x: 7
marker_label_padding_y: 4
marker_label_shadow: true
marker_label_shadow_blur: 3
marker_label_shadow_offset_x: 1
marker_label_shadow_offset_y: 1
marker_label_shadow_opacity: 0.5
```

</details>

<details>
<summary>Marker connector and smart placement options</summary>

Marker connectors draw a line between a marker label and its data point. Smart placement can move marker labels around to avoid edges, overlaps and the plotted line.

| Option | Default | Description |
|---|---:|---|
| `marker_connector` | `false` | Show connector lines between marker labels and points. |
| `marker_connector_color` | `var(--secondary-text-color)` | Marker connector colour. |
| `marker_connector_color_mode` | `static` | Options: `static`, `band`, `muted_band`, `none`. |
| `marker_connector_width` | `1` | Marker connector line width. |
| `marker_connector_opacity` | `0.45` | Marker connector opacity. |
| `marker_connector_style` | `solid` | Options: `solid`, `dashed`, `dotted`. |
| `marker_connector_dasharray` | `3 4` | Custom SVG dash array used when connector style is dashed or dotted. |
| `marker_label_position` | `smart` | Label position. Options: `smart`, `above`, `below`, `left`, `right`. |
| `marker_label_preferred_positions` | `above, below, right, left` | Preferred placement order for general marker labels. |
| `latest_marker_label_preferred_positions` | `above, below` | Preferred placement order for latest marker labels. |
| `min_marker_label_preferred_positions` | `below, right, left, above` | Preferred placement order for minimum marker labels. |
| `max_marker_label_preferred_positions` | `above, right, left, below` | Preferred placement order for maximum marker labels. |
| `marker_label_offset` | `12` | Distance between marker point and label. |
| `marker_label_avoid_edges` | `true` | Keep marker labels inside the graph/card area where possible. |
| `marker_label_avoid_overlap` | `true` | Avoid overlap between marker labels. |
| `marker_label_avoid_line` | `true` | Try to avoid placing marker labels over the graph line. |
| `marker_label_line_gap` | `6` | Minimum gap between marker labels and the plotted line when avoiding line overlap. |
| `marker_label_min_gap` | `8` | Minimum gap between marker labels when avoiding overlap. |

Example:

```yaml
marker_connector: true
marker_connector_color_mode: band
marker_connector_width: 2.5
marker_connector_opacity: 0.35
marker_connector_style: dashed
marker_connector_dasharray: 3 4

marker_label_position: smart
marker_label_avoid_edges: true
marker_label_avoid_overlap: true
marker_label_avoid_line: true
marker_label_line_gap: 8
marker_label_min_gap: 10
```

</details>

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

<details>
<summary>Example performance debug output</summary>

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

Line debug values:

| Value | Meaning |
|---|---|
| `segments 500/543` | Original line segments / threshold-split line segments. |
| `grouped paths 45` | Number of actual SVG line paths rendered after grouping same-colour sections. |

History debug values:

| Value | Meaning |
|---|---|
| `history auto→hybrid` | Configured mode was `auto`, resolved mode was `hybrid`. |
| `stats 240` | Number of long-term statistics points fetched. |
| `raw 500` | Number of raw history points fetched. |
| `merged 740` | Final combined point count before downsampling. |

</details>

## Notes

Home Assistant history records state changes rather than regular samples. This card requests detailed history for the selected time window and then downsamples locally when needed.

When `max_history_points` is set to `auto`, the card currently targets about `500` plotted history points. The downsampling keeps the first and last points and tries to preserve local highs and lows, which helps retain short spikes.

The card appends the current live value at `now` when drawing the graph, so the line reaches the live edge of the chart without requiring a full history refresh every time the entity state changes.

Minimum and maximum markers are calculated from real Home Assistant history only, not from the artificial current-at-now point.

If you use `*_color_mode: band`, the configured `bands` are still required even when `show_bands: false`.

New YAML should prefer `header_*` and `footer_*` options, but older `top_*`, `bottom_*`, `top_ribbon_background_*` and `bottom_ribbon_background_*` options remain supported for backwards compatibility.

## Status

Simple Band Graph Card is functional and actively evolving.

It can load Home Assistant history, optionally combine long-term statistics with recent raw history, and render a configurable threshold-banded graph with optional line, area fill, markers, axes, grid lines, header/footer content, band-driven colours, interactions and debug diagnostics.

A Home Assistant visual editor is included for common configuration options, including data and range, history mode, axes, grid, appearance, bands, line, area, markers, header, footer, interactions and advanced/debug settings. Detailed per-slot overrides and complex styling combinations may still be easier to configure directly in YAML.

## Roadmap

Planned or possible future features:

### Usability and editing

- Better UI controls for editing individual bands
- Optional band templates for common sensors such as CO₂, humidity, battery, temperature and air quality
- Optional dynamic defaults based on entity device class
- More compact presets
- More screenshots and example cards
- Better documentation for visual editor support versus YAML-only options

### Graph and interaction features

- Optional hover/touch tooltips
- More detailed point inspection on hover or tap
- Ribbon background value-fill mode, where header/footer backgrounds fill left-to-right based on the current value within the configured band range
- Better handling for marker values outside configured bands
- More debug information for responsive layout, SVG path generation and rendered dimensions

### Visual polish

- More marker dot styling presets
- More area fill styles
- More line and band surface presets
- Optional animation support, such as line draw-in, area fade-in, marker pop-in, threshold-crossing highlights, animated refresh transitions or subtle gradient movement

### Packaging

- Wider HACS release polish
- Example screenshot refresh
- Possible release notes / changelog improvements

## License

MIT License.

MIT License.
