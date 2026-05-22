/*
  Simple Band Graph Card
  ----------------------
  Home Assistant Lovelace custom card for plotting an entity against configurable
  coloured bands, optional axes, markers, ribbons, and debug information.
*/

class SimpleBandGraphCard extends HTMLElement {
  /*
    ============================================================================
    CONFIGURATION
    ============================================================================
    This section handles Home Assistant card configuration.

    getStubConfig provides Home Assistant with a starter YAML configuration when
    the card is added through the visual editor.

    getConfigElement tells Home Assistant which custom editor element to open when
    the user edits this card through the visual editor.

    setConfig is called by Home Assistant when the card is loaded or when the YAML
    changes. This section defines defaults, handles backwards-compatible options,
    and initialises runtime state used by history fetching and rendering.
  */

  /*
    --------------------------------------------------------------------------
    Visual editor starter configuration
    --------------------------------------------------------------------------
    Used by Home Assistant when the user adds the card from the visual editor.

    It tries to pick a sensible starter entity, prioritising battery/SOC-style
    percentage entities, then humidity, then other percentage entities, then any
    numeric entity.

    Keep these starter defaults aligned with the main setConfig defaults so the
    visual editor toggles and selectors reflect what the rendered card is already
    doing.
  */
  static getStubConfig(hass) {
    const entities = Object.keys(hass.states || {});

    const isNumericEntity = (entityId) => {
      const state = hass.states[entityId];
      return state && Number.isFinite(Number(state.state));
    };

    const getUnit = (entityId) =>
      hass.states[entityId]?.attributes?.unit_of_measurement || "";

    const getDeviceClass = (entityId) =>
      hass.states[entityId]?.attributes?.device_class || "";

    const getSearchText = (entityId) => {
      const state = hass.states[entityId];
      return `${entityId} ${state?.attributes?.friendly_name || ""}`.toLowerCase();
    };

    const batterySocEntity = entities.find((entityId) => {
      if (!isNumericEntity(entityId)) return false;

      const unit = getUnit(entityId);
      const deviceClass = getDeviceClass(entityId);
      const text = getSearchText(entityId);

      return (
        unit === "%" &&
        (
          deviceClass === "battery" ||
          text.includes("battery") ||
          text.includes("soc") ||
          text.includes("state of charge") ||
          text.includes("state_of_charge")
        )
      );
    });

    const humidityEntity = entities.find((entityId) => {
      if (!isNumericEntity(entityId)) return false;

      return getUnit(entityId) === "%" && getDeviceClass(entityId) === "humidity";
    });

    const percentageEntity = entities.find((entityId) => {
      if (!isNumericEntity(entityId)) return false;

      return getUnit(entityId) === "%";
    });

    const numericEntity =
      batterySocEntity ||
      humidityEntity ||
      percentageEntity ||
      entities.find(isNumericEntity) ||
      "";

    return {
      entity: numericEntity,
      name: numericEntity || "Simple Band Graph",

      // Core card and data range settings
      hours_to_show: 24,
      height: 160,
      y_min: 0,
      y_max: 100,
      value_decimals: "auto",

      // Axis settings
      show_x_axis: false,
      show_x_axis_labels: true,
      x_axis_position: "bottom",
      x_axis_label_mode: "relative",
      x_axis_ticks: 3,

      show_y_axis: false,
      show_y_axis_labels: true,
      y_axis_position: "left",
      y_axis_ticks: 2,

      // X-axis label settings
      x_axis_label_size: 11,
      x_axis_label_weight: 400,
      x_axis_label_color: "var(--secondary-text-color)",
      x_axis_label_color_mode: "static",
      x_axis_label_opacity: 0.8,

      // Y-axis label settings
      y_axis_label_size: 11,
      y_axis_label_weight: 400,
      y_axis_label_color: "var(--secondary-text-color)",
      y_axis_label_color_mode: "static",
      y_axis_label_opacity: 0.8,

      // Grid-line settings
      show_x_grid: false,
      show_y_grid: false,
      grid_color: "var(--divider-color)",
      grid_width: 1,
      grid_opacity: 0.25,

      // Whole-card background settings
      background_color: "var(--card-background-color)",
      background_color_mode: "static",
      background_opacity: 1,

      // Plot-area background settings
      plot_background_color: "var(--card-background-color)",
      plot_background_color_mode: "static",
      plot_background_opacity: 0.35,
      plot_background_radius: 8,

      // Band display settings
      show_bands: true,
      band_opacity: 0.14,
      band_label_mode: "label",
      band_label_unit: false,
      band_label_position: "top",
      band_label_align: "left",
      hide_small_band_labels: false,
      min_band_label_height: 18,

      // Band label settings
      band_label_size: 11,
      band_label_weight: 400,
      band_label_color: "var(--secondary-text-color)",
      band_label_color_mode: "static",
      band_label_opacity: 0.75,

      // Line appearance settings
      show_line: true,
      line_color: "var(--primary-color)",
      line_color_mode: "static",
      line_width: 2.5,
      line_opacity: 0.9,

      // Marker settings
      show_latest: false,
      show_latest_label: true,
      latest_marker_size: 4,

      show_min: false,
      show_max: false,
      show_extrema_labels: true,
      extrema_marker_size: 4,
      extrema_label_mode: "value",

      hide_recent_min: true,
      hide_recent_max: false,
      recent_extrema_minutes: 30,

      // Marker label settings
      marker_label_size: 11,
      marker_label_weight: 400,
      marker_label_color: "var(--primary-text-color)",
      marker_label_color_mode: "static",
      marker_label_opacity: 0.9,

      // Marker label background settings
      marker_label_background_color: "var(--card-background-color)",
      marker_label_background_mode: "card",
      marker_label_background_opacity: 0.75,


      // Ribbon slot settings
      top_left: "name",
      top_center: "none",
      top_right: "duration",
      bottom_left: "none",
      bottom_center: "message",
      bottom_right: "current",
      custom_text: "",
      duration_format: "short",

      // Ribbon background settings
      top_ribbon_background_color: "transparent",
      top_ribbon_background_color_mode: "static",
      top_ribbon_background_opacity: 0,

      bottom_ribbon_background_color: "transparent",
      bottom_ribbon_background_color_mode: "static",
      bottom_ribbon_background_opacity: 0,

      ribbon_background_radius: 8,

      // History and debug settings
      history_refresh_interval: 60,
      max_history_points: "auto",
      debug_level: "basic",
      debug_multiline: false,

      bands: [
        {
          from: 0,
          to: 20,
          color: "#ef4444",
          label: "Low",
          message: "Battery is low",
        },
        {
          from: 20,
          to: 50,
          color: "#eab308",
          label: "Moderate",
          message: "Battery is moderate",
        },
        {
          from: 50,
          to: 80,
          color: "#84cc16",
          label: "Good",
          message: "Battery level is good",
        },
        {
          from: 80,
          to: 100,
          color: "#22c55e",
          label: "High",
          message: "Battery level is high",
        },
      ],
    };
  }

  /*
    --------------------------------------------------------------------------
    Visual editor configuration form
    --------------------------------------------------------------------------
    Uses Home Assistant's built-in form editor rather than a custom editor
    element. This gives us native entity pickers, number controls, dropdowns, and
    documented expandable sections without maintaining our own editor lifecycle.

    The expandable panels use flatten: true so the values remain at the top level
    of the card YAML, preserving the existing configuration format.
  */
  static getConfigForm() {
    const ribbonSlotOptions = [
      { value: "none", label: "None" },
      { value: "name", label: "Name" },
      { value: "current", label: "Current value" },
      { value: "band", label: "Current band" },
      { value: "message", label: "Band message / instruction" },
      { value: "min", label: "Minimum" },
      { value: "max", label: "Maximum" },
      { value: "duration", label: "Duration" },
      { value: "entity", label: "Entity ID" },
      { value: "unit", label: "Unit" },
      { value: "custom", label: "Custom text" },
      { value: "debug", label: "Debug / status" },
    ];

    const colourModeOptions = [
      { value: "static", label: "Static colour" },
      { value: "band", label: "Use band colour" },
      { value: "none", label: "No colour / transparent" },
    ];

    const fontWeightOptions = [
      { value: 300, label: "Light" },
      { value: 400, label: "Regular" },
      { value: 500, label: "Medium" },
      { value: 600, label: "Semi-bold" },
      { value: 700, label: "Bold" },
    ];

    return {
      schema: [
        {
          type: "expandable",
          name: "basic",
          title: "Basic",
          flatten: true,
          schema: [
            {
              name: "entity",
              required: true,
              selector: {
                entity: {
                  filter: [
                    { domain: "sensor" },
                    { domain: "number" },
                    { domain: "input_number" },
                  ],
                },
              },
            },
            {
              name: "name",
              selector: {
                text: {},
              },
            },
            {
              name: "hours_to_show",
              selector: {
                number: {
                  min: 0.1,
                  step: 0.5,
                  mode: "box",
                },
              },
            },
            {
              name: "height",
              selector: {
                number: {
                  min: 80,
                  step: 10,
                  mode: "box",
                },
              },
            },
          ],
        },
        {
          type: "expandable",
          name: "scale",
          title: "Scale",
          flatten: true,
          schema: [
            {
              name: "y_min",
              selector: {
                number: {
                  step: 1,
                  mode: "box",
                },
              },
            },
            {
              name: "y_max",
              selector: {
                number: {
                  step: 1,
                  mode: "box",
                },
              },
            },
            {
              name: "value_decimals",
              selector: {
                select: {
                  mode: "dropdown",
                  options: [
                    { value: "auto", label: "Auto" },
                    { value: 0, label: "0 decimal places" },
                    { value: 1, label: "1 decimal place" },
                    { value: 2, label: "2 decimal places" },
                    { value: 3, label: "3 decimal places" },
                  ],
                },
              },
            },
          ],
        },
        {
          type: "expandable",
          name: "x_axis",
          title: "X-axis",
          flatten: true,
          schema: [
            {
              name: "show_x_axis",
              selector: {
                boolean: {},
              },
            },
            {
              name: "show_x_axis_labels",
              selector: {
                boolean: {},
              },
            },
            {
              name: "x_axis_position",
              selector: {
                select: {
                  mode: "dropdown",
                  options: [
                    { value: "bottom", label: "Bottom" },
                    { value: "top", label: "Top" },
                  ],
                },
              },
            },
            {
              name: "x_axis_label_mode",
              selector: {
                select: {
                  mode: "dropdown",
                  options: [
                    { value: "relative", label: "Relative time" },
                    { value: "time", label: "Clock time" },
                  ],
                },
              },
            },
            {
              name: "x_axis_ticks",
              selector: {
                number: {
                  min: 2,
                  max: 12,
                  step: 1,
                  mode: "slider",
                },
              },
            },
            {
              name: "x_axis_label_size",
              selector: {
                number: {
                  min: 8,
                  max: 24,
                  step: 1,
                  mode: "slider",
                },
              },
            },
            {
              name: "x_axis_label_weight",
              selector: {
                select: {
                  mode: "dropdown",
                  options: fontWeightOptions,
                },
              },
            },
            {
              name: "x_axis_label_color",
              selector: {
                text: {},
              },
            },
            {
              name: "x_axis_label_color_mode",
              selector: {
                select: {
                  mode: "dropdown",
                  options: colourModeOptions,
                },
              },
            },
            {
              name: "x_axis_label_opacity",
              selector: {
                number: {
                  min: 0,
                  max: 1,
                  step: 0.05,
                  mode: "slider",
                },
              },
            },
          ],
        },
        {
          type: "expandable",
          name: "y_axis",
          title: "Y-axis",
          flatten: true,
          schema: [
            {
              name: "show_y_axis",
              selector: {
                boolean: {},
              },
            },
            {
              name: "show_y_axis_labels",
              selector: {
                boolean: {},
              },
            },
            {
              name: "y_axis_position",
              selector: {
                select: {
                  mode: "dropdown",
                  options: [
                    { value: "left", label: "Left" },
                    { value: "right", label: "Right" },
                  ],
                },
              },
            },
            {
              name: "y_axis_ticks",
              selector: {
                number: {
                  min: 2,
                  max: 12,
                  step: 1,
                  mode: "slider",
                },
              },
            },
            {
              name: "y_axis_label_size",
              selector: {
                number: {
                  min: 8,
                  max: 24,
                  step: 1,
                  mode: "slider",
                },
              },
            },
            {
              name: "y_axis_label_weight",
              selector: {
                select: {
                  mode: "dropdown",
                  options: fontWeightOptions,
                },
              },
            },
            {
              name: "y_axis_label_color",
              selector: {
                text: {},
              },
            },
            {
              name: "y_axis_label_color_mode",
              selector: {
                select: {
                  mode: "dropdown",
                  options: colourModeOptions,
                },
              },
            },
            {
              name: "y_axis_label_opacity",
              selector: {
                number: {
                  min: 0,
                  max: 1,
                  step: 0.05,
                  mode: "slider",
                },
              },
            },
          ],
        },
        {
          type: "expandable",
          name: "grid",
          title: "Grid",
          flatten: true,
          schema: [
            {
              name: "show_x_grid",
              selector: {
                boolean: {},
              },
            },
            {
              name: "show_y_grid",
              selector: {
                boolean: {},
              },
            },
            {
              name: "grid_color",
              selector: {
                text: {},
              },
            },
            {
              name: "grid_width",
              selector: {
                number: {
                  min: 0,
                  max: 5,
                  step: 0.5,
                  mode: "slider",
                },
              },
            },
            {
              name: "grid_opacity",
              selector: {
                number: {
                  min: 0,
                  max: 1,
                  step: 0.05,
                  mode: "slider",
                },
              },
            },
          ],
        },
        {
          type: "expandable",
          name: "backgrounds",
          title: "Backgrounds",
          flatten: true,
          schema: [
            {
              name: "background_color",
              selector: {
                text: {},
              },
            },
            {
              name: "background_color_mode",
              selector: {
                select: {
                  mode: "dropdown",
                  options: colourModeOptions,
                },
              },
            },
            {
              name: "background_opacity",
              selector: {
                number: {
                  min: 0,
                  max: 1,
                  step: 0.05,
                  mode: "slider",
                },
              },
            },
            {
              name: "plot_background_color",
              selector: {
                text: {},
              },
            },
            {
              name: "plot_background_color_mode",
              selector: {
                select: {
                  mode: "dropdown",
                  options: colourModeOptions,
                },
              },
            },
            {
              name: "plot_background_opacity",
              selector: {
                number: {
                  min: 0,
                  max: 1,
                  step: 0.05,
                  mode: "slider",
                },
              },
            },
            {
              name: "plot_background_radius",
              selector: {
                number: {
                  min: 0,
                  max: 32,
                  step: 1,
                  mode: "slider",
                },
              },
            },
          ],
        },
        {
          type: "expandable",
          name: "bands",
          title: "Bands",
          flatten: true,
          schema: [
            {
              name: "show_bands",
              selector: {
                boolean: {},
              },
            },
            {
              name: "band_opacity",
              selector: {
                number: {
                  min: 0,
                  max: 1,
                  step: 0.05,
                  mode: "slider",
                },
              },
            },
            {
              name: "band_label_mode",
              selector: {
                select: {
                  mode: "dropdown",
                  options: [
                    { value: "label", label: "Label" },
                    { value: "range", label: "Range" },
                    { value: "threshold", label: "Threshold" },
                    { value: "hide", label: "Hide labels" },
                  ],
                },
              },
            },
            {
              name: "band_label_unit",
              selector: {
                boolean: {},
              },
            },
            {
              name: "band_label_position",
              selector: {
                select: {
                  mode: "dropdown",
                  options: [
                    { value: "top", label: "Top" },
                    { value: "middle", label: "Middle" },
                    { value: "bottom", label: "Bottom" },
                  ],
                },
              },
            },
            {
              name: "band_label_align",
              selector: {
                select: {
                  mode: "dropdown",
                  options: [
                    { value: "left", label: "Left" },
                    { value: "center", label: "Centre" },
                    { value: "right", label: "Right" },
                    { value: "outside_left", label: "Outside left" },
                    { value: "outside_right", label: "Outside right" },
                  ],
                },
              },
            },
            {
              name: "hide_small_band_labels",
              selector: {
                boolean: {},
              },
            },
            {
              name: "min_band_label_height",
              selector: {
                number: {
                  min: 0,
                  max: 80,
                  step: 1,
                  mode: "slider",
                },
              },
            },
            {
              name: "band_label_size",
              selector: {
                number: {
                  min: 8,
                  max: 24,
                  step: 1,
                  mode: "slider",
                },
              },
            },
            {
              name: "band_label_weight",
              selector: {
                select: {
                  mode: "dropdown",
                  options: fontWeightOptions,
                },
              },
            },
            {
              name: "band_label_color",
              selector: {
                text: {},
              },
            },
            {
              name: "band_label_color_mode",
              selector: {
                select: {
                  mode: "dropdown",
                  options: colourModeOptions,
                },
              },
            },
            {
              name: "band_label_opacity",
              selector: {
                number: {
                  min: 0,
                  max: 1,
                  step: 0.05,
                  mode: "slider",
                },
              },
            },
          ],
        },
        {
          type: "expandable",
          name: "band_definitions",
          title: "Band definitions",
          flatten: true,
          schema: [
            {
              name: "bands",
              selector: {
                object: {},
              },
            },
          ],
        },
        {
          type: "expandable",
          name: "line",
          title: "Line",
          flatten: true,
          schema: [
            {
              name: "show_line",
              selector: {
                boolean: {},
              },
            },
            {
              name: "line_color_mode",
              selector: {
                select: {
                  mode: "dropdown",
                  options: colourModeOptions,
                },
              },
            },
            {
              name: "line_color",
              selector: {
                text: {},
              },
            },
            {
              name: "line_width",
              selector: {
                number: {
                  min: 0,
                  max: 12,
                  step: 0.5,
                  mode: "slider",
                },
              },
            },
            {
              name: "line_opacity",
              selector: {
                number: {
                  min: 0,
                  max: 1,
                  step: 0.05,
                  mode: "slider",
                },
              },
            },
          ],
        },
        {
          type: "expandable",
          name: "markers",
          title: "Markers",
          flatten: true,
          schema: [
            {
              name: "show_latest",
              selector: {
                boolean: {},
              },
            },
            {
              name: "show_latest_label",
              selector: {
                boolean: {},
              },
            },
            {
              name: "latest_marker_size",
              selector: {
                number: {
                  min: 0,
                  max: 16,
                  step: 1,
                  mode: "slider",
                },
              },
            },
            {
              name: "show_min",
              selector: {
                boolean: {},
              },
            },
            {
              name: "show_max",
              selector: {
                boolean: {},
              },
            },
            {
              name: "show_extrema_labels",
              selector: {
                boolean: {},
              },
            },
            {
              name: "extrema_marker_size",
              selector: {
                number: {
                  min: 0,
                  max: 16,
                  step: 1,
                  mode: "slider",
                },
              },
            },
            {
              name: "extrema_label_mode",
              selector: {
                select: {
                  mode: "dropdown",
                  options: [
                    { value: "value", label: "Value only" },
                    { value: "prefixed", label: "Prefixed, e.g. Min 42" },
                    { value: "compact", label: "Compact, e.g. ↓ 42" },
                  ],
                },
              },
            },
            {
              name: "hide_recent_min",
              selector: {
                boolean: {},
              },
            },
            {
              name: "hide_recent_max",
              selector: {
                boolean: {},
              },
            },
            {
              name: "recent_extrema_minutes",
              selector: {
                number: {
                  min: 0,
                  max: 240,
                  step: 5,
                  mode: "slider",
                  unit_of_measurement: "min",
                },
              },
            },
            {
              name: "marker_label_size",
              selector: {
                number: {
                  min: 8,
                  max: 24,
                  step: 1,
                  mode: "slider",
                },
              },
            },
            {
              name: "marker_label_weight",
              selector: {
                select: {
                  mode: "dropdown",
                  options: fontWeightOptions,
                },
              },
            },
            {
              name: "marker_label_color",
              selector: {
                text: {},
              },
            },
            {
              name: "marker_label_color_mode",
              selector: {
                select: {
                  mode: "dropdown",
                  options: colourModeOptions,
                },
              },
            },
            {
              name: "marker_label_opacity",
              selector: {
                number: {
                  min: 0,
                  max: 1,
                  step: 0.05,
                  mode: "slider",
                },
              },
            },
            {
              name: "marker_label_background_color",
              selector: {
                text: {},
              },
            },
            {
              name: "marker_label_background_mode",
              selector: {
                select: {
                  mode: "dropdown",
                  options: [
                    { value: "card", label: "Use card background" },
                    { value: "static", label: "Static colour" },
                    { value: "band", label: "Use band colour" },
                    { value: "none", label: "No background / transparent" },
                  ],
                },
              },
            },
            {
              name: "marker_label_background_opacity",
              selector: {
                number: {
                  min: 0,
                  max: 1,
                  step: 0.05,
                  mode: "slider",
                },
              },
            },
          ],
        },
        {
          type: "expandable",
          name: "ribbons",
          title: "Ribbons",
          flatten: true,
          schema: [
            {
              name: "top_left",
              selector: {
                select: {
                  mode: "dropdown",
                  options: ribbonSlotOptions,
                },
              },
            },
            {
              name: "top_center",
              selector: {
                select: {
                  mode: "dropdown",
                  options: ribbonSlotOptions,
                },
              },
            },
            {
              name: "top_right",
              selector: {
                select: {
                  mode: "dropdown",
                  options: ribbonSlotOptions,
                },
              },
            },
            {
              name: "bottom_left",
              selector: {
                select: {
                  mode: "dropdown",
                  options: ribbonSlotOptions,
                },
              },
            },
            {
              name: "bottom_center",
              selector: {
                select: {
                  mode: "dropdown",
                  options: ribbonSlotOptions,
                },
              },
            },
            {
              name: "bottom_right",
              selector: {
                select: {
                  mode: "dropdown",
                  options: ribbonSlotOptions,
                },
              },
            },
            {
              name: "custom_text",
              selector: {
                text: {
                  multiline: false,
                },
              },
            },
            {
              name: "duration_format",
              selector: {
                select: {
                  mode: "dropdown",
                  options: [
                    { value: "short", label: "Short, e.g. 24h" },
                    { value: "long", label: "Long, e.g. 24 hours" },
                  ],
                },
              },
            },
            {
              name: "top_ribbon_background_color",
              selector: {
                text: {},
              },
            },
            {
              name: "top_ribbon_background_color_mode",
              selector: {
                select: {
                  mode: "dropdown",
                  options: colourModeOptions,
                },
              },
            },
            {
              name: "top_ribbon_background_opacity",
              selector: {
                number: {
                  min: 0,
                  max: 1,
                  step: 0.05,
                  mode: "slider",
                },
              },
            },
            {
              name: "bottom_ribbon_background_color",
              selector: {
                text: {},
              },
            },
            {
              name: "bottom_ribbon_background_color_mode",
              selector: {
                select: {
                  mode: "dropdown",
                  options: colourModeOptions,
                },
              },
            },
            {
              name: "bottom_ribbon_background_opacity",
              selector: {
                number: {
                  min: 0,
                  max: 1,
                  step: 0.05,
                  mode: "slider",
                },
              },
            },
            {
              name: "ribbon_background_radius",
              selector: {
                number: {
                  min: 0,
                  max: 32,
                  step: 1,
                  mode: "slider",
                },
              },
            },
          ],
        },
        {
          type: "expandable",
          name: "advanced",
          title: "Advanced",
          flatten: true,
          schema: [
            {
              name: "history_refresh_interval",
              selector: {
                number: {
                  min: 5,
                  step: 5,
                  mode: "box",
                  unit_of_measurement: "s",
                },
              },
            },
            {
              name: "max_history_points",
              selector: {
                text: {},
              },
            },
            {
              name: "debug_level",
              selector: {
                select: {
                  mode: "dropdown",
                  options: [
                    { value: "off", label: "Off" },
                    { value: "basic", label: "Basic" },
                    { value: "performance", label: "Performance" },
                    { value: "verbose", label: "Verbose" },
                  ],
                },
              },
            },
            {
              name: "debug_multiline",
              selector: {
                boolean: {},
              },
            },
          ],
        },
      ],

      computeLabel: (schema) => {
        const labels = {
          entity: "Entity",
          name: "Name",
          hours_to_show: "Hours to show",
          height: "Card height",
          y_min: "Y-axis minimum",
          y_max: "Y-axis maximum",
          value_decimals: "Value decimal places",

          show_x_axis: "Show X-axis",
          show_x_axis_labels: "Show X-axis labels",
          x_axis_position: "X-axis position",
          x_axis_label_mode: "X-axis label mode",
          x_axis_ticks: "X-axis ticks",
          x_axis_label_size: "X-axis label size",
          x_axis_label_weight: "X-axis label weight",
          x_axis_label_color: "X-axis label colour",
          x_axis_label_color_mode: "X-axis label colour mode",
          x_axis_label_opacity: "X-axis label opacity",

          show_y_axis: "Show Y-axis",
          show_y_axis_labels: "Show Y-axis labels",
          y_axis_position: "Y-axis position",
          y_axis_ticks: "Y-axis ticks",
          y_axis_label_size: "Y-axis label size",
          y_axis_label_weight: "Y-axis label weight",
          y_axis_label_color: "Y-axis label colour",
          y_axis_label_color_mode: "Y-axis label colour mode",
          y_axis_label_opacity: "Y-axis label opacity",

          show_x_grid: "Show vertical grid lines",
          show_y_grid: "Show horizontal grid lines",
          grid_color: "Grid colour",
          grid_width: "Grid line width",
          grid_opacity: "Grid opacity",

          background_color: "Card background colour",
          background_color_mode: "Card background colour mode",
          background_opacity: "Card background opacity",
          plot_background_color: "Plot background colour",
          plot_background_color_mode: "Plot background colour mode",
          plot_background_opacity: "Plot background opacity",
          plot_background_radius: "Plot background corner radius",

          show_bands: "Show bands",
          band_opacity: "Band opacity",
          band_label_mode: "Band label mode",
          band_label_unit: "Show units in band labels",
          band_label_position: "Band label position",
          band_label_align: "Band label alignment",
          hide_small_band_labels: "Hide labels in small bands",
          min_band_label_height: "Minimum band label height",
          band_label_size: "Band label size",
          band_label_weight: "Band label weight",
          band_label_color: "Band label colour",
          band_label_color_mode: "Band label colour mode",
          band_label_opacity: "Band label opacity",
          bands: "Band definitions",

          show_line: "Show line",
          line_color_mode: "Line colour mode",
          line_color: "Line colour",
          line_width: "Line width",
          line_opacity: "Line opacity",

          show_latest: "Show current marker",
          show_latest_label: "Show current label",
          latest_marker_size: "Current marker size",
          show_min: "Show minimum marker",
          show_max: "Show maximum marker",
          show_extrema_labels: "Show min/max labels",
          extrema_marker_size: "Min/max marker size",
          extrema_label_mode: "Min/max label mode",
          hide_recent_min: "Hide recent minimum",
          hide_recent_max: "Hide recent maximum",
          recent_extrema_minutes: "Recent threshold",
          marker_label_size: "Marker label size",
          marker_label_weight: "Marker label weight",
          marker_label_color: "Marker label colour",
          marker_label_color_mode: "Marker label colour mode",
          marker_label_opacity: "Marker label opacity",
          marker_label_background_color: "Marker label background colour",
          marker_label_background_mode: "Marker label background mode",
          marker_label_background_opacity: "Marker label background opacity",

          top_left: "Header left",
          top_center: "Header centre",
          top_right: "Header right",
          bottom_left: "Footer left",
          bottom_center: "Footer centre",
          bottom_right: "Footer right",
          custom_text: "Custom text",
          duration_format: "Duration format",

          top_ribbon_background_color: "Header background colour",
          top_ribbon_background_color_mode: "Header background colour mode",
          top_ribbon_background_opacity: "Header background opacity",
          bottom_ribbon_background_color: "Footer background colour",
          bottom_ribbon_background_color_mode: "Footer background colour mode",
          bottom_ribbon_background_opacity: "Footer background opacity",
          ribbon_background_radius: "Ribbon background corner radius",

          history_refresh_interval: "History refresh interval",
          max_history_points: "Max history points",
          debug_level: "Debug level",
          debug_multiline: "Debug multiline",
        };

        return labels[schema.name];
      },

      computeHelper: (schema) => {
        const helpers = {
          entity: "The numeric entity to plot.",
          hours_to_show: "How many hours of history to show.",
          height: "The graph height in pixels.",
          y_min: "The lowest value shown on the y-axis.",
          y_max: "The highest value shown on the y-axis.",
          value_decimals:
            "Controls decimal places for value labels. Auto uses fewer decimals for larger numbers.",

          show_x_axis: "Show or hide the horizontal time axis line.",
          show_x_axis_labels: "Show or hide the time labels on the X-axis.",
          x_axis_position: "Place the X-axis at the top or bottom of the graph.",
          x_axis_label_mode:
            "Relative shows labels such as 24h ago. Clock time shows labels such as 14:30.",
          x_axis_ticks:
            "Number of labelled positions on the X-axis. Vertical grid lines use these same positions.",
          x_axis_label_size: "Text size for X-axis labels.",
          x_axis_label_weight: "Font weight for X-axis labels.",
          x_axis_label_color:
            "CSS colour for X-axis labels, such as var(--secondary-text-color), #666666, or rgba(0,0,0,0.6).",
          x_axis_label_color_mode:
            "Static uses the chosen colour. Use band colour follows the band matching the current value. No colour makes the labels transparent.",
          x_axis_label_opacity: "Opacity of X-axis label text, from 0 to 1.",

          show_y_axis: "Show or hide the vertical value axis line.",
          show_y_axis_labels: "Show or hide the value labels on the Y-axis.",
          y_axis_position: "Place the Y-axis on the left or right of the graph.",
          y_axis_ticks:
            "Number of labelled positions on the Y-axis. Horizontal grid lines use these same positions.",
          y_axis_label_size: "Text size for Y-axis labels.",
          y_axis_label_weight: "Font weight for Y-axis labels.",
          y_axis_label_color:
            "CSS colour for Y-axis labels, such as var(--secondary-text-color), #666666, or rgba(0,0,0,0.6).",
          y_axis_label_color_mode:
            "Static uses the chosen colour. Use band colour follows the band matching the current value. No colour makes the labels transparent.",
          y_axis_label_opacity: "Opacity of Y-axis label text, from 0 to 1.",

          show_x_grid:
            "Show vertical grid lines. The number of lines is controlled by X-axis ticks.",
          show_y_grid:
            "Show horizontal grid lines. The number of lines is controlled by Y-axis ticks.",
          grid_color:
            "CSS colour for grid lines, such as var(--divider-color), #999999, or rgba(0,0,0,0.2).",
          grid_width: "Thickness of the grid lines.",
          grid_opacity: "Opacity of the grid lines, from 0 to 1.",

          background_color:
            "CSS colour for the whole card background, such as var(--card-background-color), transparent, #222222, or rgba(0,0,0,0.2).",
          background_color_mode:
            "Static uses the chosen colour. Use band colour follows the band matching the current value. No colour makes the card background transparent.",
          background_opacity:
            "Opacity of the whole card background, from 0 to 1.",
          plot_background_color:
            "CSS colour for the graph plotting area, such as var(--card-background-color), transparent, #222222, or rgba(0,0,0,0.2).",
          plot_background_color_mode:
            "Static uses the chosen colour. Use band colour follows the band matching the current value. No colour makes the plot background transparent.",
          plot_background_opacity:
            "Opacity of the plot background, from 0 to 1.",
          plot_background_radius:
            "Corner radius for the plot background area.",

          band_opacity: "Opacity for the coloured background bands, from 0 to 1.",
          band_label_mode:
            "Choose whether band labels show the label text, numeric range, threshold, or are hidden.",
          band_label_unit:
            "Add the entity unit to numeric band labels when using range or threshold mode.",
          band_label_position:
            "Place band labels near the top, middle, or bottom of each band.",
          band_label_align:
            "Align band labels inside the plot, or place them just outside the plot area.",
          hide_small_band_labels:
            "Hide labels where the band is too narrow to display text cleanly.",
          min_band_label_height:
            "Minimum band height, in pixels, before a label is shown.",
          band_label_size: "Text size for labels shown inside or beside bands.",
          band_label_weight: "Font weight for band labels.",
          band_label_color:
            "CSS colour for band labels, such as var(--secondary-text-color), #666666, or rgba(0,0,0,0.6).",
          band_label_color_mode:
            "Static uses the chosen colour. Use band colour follows the band matching the current value. No colour makes the labels transparent.",
          band_label_opacity: "Opacity of band label text, from 0 to 1.",
          bands:
            "Edit the raw band definitions. Each band can include from, to, color, label, and message.",

          show_line: "Show or hide the plotted history line.",
          line_color_mode:
            "Static uses the chosen line colour. Use band colour follows the band matching the current value. No colour makes the line transparent.",
          line_color:
            "CSS colour for the line, such as var(--primary-color), #03a9f4, or rgb(3, 169, 244).",
          line_width: "Thickness of the plotted line.",
          line_opacity: "Opacity of the plotted line, from 0 to 1.",

          show_latest:
            "Show a marker at the current/latest plotted value. This uses the existing show_latest YAML option.",
          show_latest_label: "Show or hide the label beside the current marker.",
          latest_marker_size: "Size of the current marker dot.",
          show_min: "Show a marker at the lowest value in the visible history.",
          show_max: "Show a marker at the highest value in the visible history.",
          show_extrema_labels: "Show or hide labels beside the min/max markers.",
          extrema_marker_size: "Size of the minimum and maximum marker dots.",
          extrema_label_mode:
            "Choose whether min/max labels show only the value, use Min/Max prefixes, or compact arrow prefixes.",
          hide_recent_min:
            "Hide the minimum marker if it is too close to the current/latest value.",
          hide_recent_max:
            "Hide the maximum marker if it is too close to the current/latest value.",
          recent_extrema_minutes:
            "How recent a min/max point can be before it is hidden, when recent hiding is enabled.",
          marker_label_size: "Text size for current, min, and max marker labels.",
          marker_label_weight: "Font weight for marker labels.",
          marker_label_color:
            "CSS colour for marker labels, such as var(--primary-text-color), #333333, or rgba(0,0,0,0.8).",
          marker_label_color_mode:
            "Static uses the chosen colour. Use band colour follows the marker value's band. No colour makes the labels transparent.",
          marker_label_opacity: "Opacity of marker label text, from 0 to 1.",
          marker_label_background_color:
            "CSS colour for the background behind marker labels, such as var(--card-background-color), #222222, or rgba(0,0,0,0.2).",
          marker_label_background_mode:
            "Card uses the card background colour. Static uses the chosen colour. Use band colour follows the marker value's band. No background makes it transparent.",
          marker_label_background_opacity:
            "Opacity of the marker label background, from 0 to 1.",


          top_left: "Choose what appears in the left position of the header ribbon.",
          top_center: "Choose what appears in the centre position of the header ribbon.",
          top_right: "Choose what appears in the right position of the header ribbon.",
          bottom_left: "Choose what appears in the left position of the footer ribbon.",
          bottom_center: "Choose what appears in the centre position of the footer ribbon.",
          bottom_right: "Choose what appears in the right position of the footer ribbon.",
          custom_text:
            "Text used by any ribbon slot set to Custom text. This is shared by all custom slots.",
          duration_format:
            "Controls whether duration text is shown in short form, such as 24h, or long form, such as 24 hours.",

          top_ribbon_background_color:
            "CSS colour for the header ribbon background, such as transparent, var(--card-background-color), #222222, or rgba(0,0,0,0.2).",
          top_ribbon_background_color_mode:
            "Static uses the chosen colour. Use band colour follows the band matching the current value. No colour makes the header background transparent.",
          top_ribbon_background_opacity:
            "Opacity of the header ribbon background, from 0 to 1.",
          bottom_ribbon_background_color:
            "CSS colour for the footer ribbon background, such as transparent, var(--card-background-color), #222222, or rgba(0,0,0,0.2).",
          bottom_ribbon_background_color_mode:
            "Static uses the chosen colour. Use band colour follows the band matching the current value. No colour makes the footer background transparent.",
          bottom_ribbon_background_opacity:
            "Opacity of the footer ribbon background, from 0 to 1.",
          ribbon_background_radius:
            "Corner radius for header and footer ribbon background areas.",

          history_refresh_interval: "How often the card refreshes history data.",
          max_history_points: "Use auto, or enter a number to limit plotted history points.",
          debug_level:
            "Controls how much status information is shown when a ribbon slot uses debug or status.",
        };

        return helpers[schema.name];
      },
    };
  }

  /*
    --------------------------------------------------------------------------
    User configuration loading
    --------------------------------------------------------------------------
    Called whenever Home Assistant gives the card a YAML configuration.
  */
  setConfig(config) {
    if (!config.entity) {
      throw new Error("You need to define an entity");
    }

    /*
      --------------------------------------------------------------------------
      User configuration + defaults
      --------------------------------------------------------------------------
      Keep these grouped by feature area so new YAML options can be added in the
      right place and documented more easily.
    */
    this.config = {
      // Core card and data range settings
      name: config.name || config.entity,
      height: config.height || 180,
      hours_to_show: config.hours_to_show ?? 24,
      y_min: config.y_min ?? 0,
      y_max: config.y_max ?? 100,
      bands: config.bands || [],
      value_decimals: config.value_decimals ?? "auto",

      // Band display settings
      show_bands: config.show_bands ?? true,
      band_opacity: config.band_opacity ?? 0.2,

      // Whole-card background settings
      background_color: config.background_color ?? "var(--card-background-color)",
      background_opacity: config.background_opacity ?? 1,
      background_color_mode: config.background_color_mode ?? "static",

      // Plot-area background settings
      plot_background_color: config.plot_background_color ?? "var(--card-background-color)",
      plot_background_opacity: config.plot_background_opacity ?? 0.35,
      plot_background_color_mode: config.plot_background_color_mode ?? "static",
      plot_background_radius: config.plot_background_radius ?? 8,

      // Top ribbon background settings
      top_ribbon_background_color:
        config.top_ribbon_background_color ?? "transparent",
      top_ribbon_background_opacity:
        config.top_ribbon_background_opacity ?? 0,
      top_ribbon_background_color_mode:
        config.top_ribbon_background_color_mode ?? "static",

      // Bottom ribbon background settings
      bottom_ribbon_background_color:
        config.bottom_ribbon_background_color ?? "transparent",
      bottom_ribbon_background_opacity:
        config.bottom_ribbon_background_opacity ?? 0,
      bottom_ribbon_background_color_mode:
        config.bottom_ribbon_background_color_mode ?? "static",

      ribbon_background_radius: config.ribbon_background_radius ?? 8,
      ribbon_color_mode: config.ribbon_color_mode ?? "static",

      // Ribbon slot default text styling
      // These set predictable defaults for the six ribbon positions.
      // More specific per-slot styling can still be applied through ribbon_styles.
      top_left_font_size: config.top_left_font_size ?? 16,
      top_center_font_size: config.top_center_font_size ?? 16,
      top_right_font_size: config.top_right_font_size ?? 16,

      bottom_left_font_size: config.bottom_left_font_size ?? 12,
      bottom_center_font_size: config.bottom_center_font_size ?? 12,
      bottom_right_font_size: config.bottom_right_font_size ?? 12,

      top_left_font_weight: config.top_left_font_weight ?? 600,
      top_center_font_weight: config.top_center_font_weight ?? 600,
      top_right_font_weight: config.top_right_font_weight ?? 600,

      bottom_left_font_weight: config.bottom_left_font_weight ?? 500,
      bottom_center_font_weight: config.bottom_center_font_weight ?? 500,
      bottom_right_font_weight: config.bottom_right_font_weight ?? 500,

      top_left_opacity: config.top_left_opacity ?? 1,
      top_center_opacity: config.top_center_opacity ?? 1,
      top_right_opacity: config.top_right_opacity ?? 1,

      bottom_left_opacity: config.bottom_left_opacity ?? 0.8,
      bottom_center_opacity: config.bottom_center_opacity ?? 0.8,
      bottom_right_opacity: config.bottom_right_opacity ?? 0.8,

      // History fetching and downsampling settings
      max_history_points: config.max_history_points ?? "auto",
      history_refresh_interval: config.history_refresh_interval ?? 60,

      // Debug/status settings
      debug_multiline: config.debug_multiline ?? false,
      debug_performance: config.debug_performance ?? false,
      debug_level:
        config.debug_level ??
        (config.debug_performance ? "performance" : "basic"),

      // Line appearance settings
      show_line: config.show_line ?? true,
      line_color: config.line_color ?? "var(--primary-color)",
      line_color_mode: config.line_color_mode ?? "static",
      line_width: config.line_width ?? 3,
      line_opacity: config.line_opacity ?? 1,

      // Grid-line settings
      show_x_grid: config.show_x_grid ?? false,
      show_y_grid: config.show_y_grid ?? false,
      grid_color: config.grid_color ?? "var(--divider-color)",
      grid_width: config.grid_width ?? 1,
      grid_opacity: config.grid_opacity ?? 0.35,

      // Band label settings
      band_label_mode: config.band_label_mode ?? "label",
      band_label_unit: config.band_label_unit ?? false,
      band_label_position: config.band_label_position ?? "top",
      band_label_align: config.band_label_align ?? "left",
      band_label_outside_width: config.band_label_outside_width ?? "auto",
      band_label_outside_gap: config.band_label_outside_gap ?? 6,
      band_label_size: config.band_label_size ?? 11,
      band_label_weight: config.band_label_weight ?? 400,
      band_label_color: config.band_label_color ?? "var(--secondary-text-color)",
      band_label_color_mode: config.band_label_color_mode ?? "static",
      band_label_opacity: config.band_label_opacity ?? 0.75,
      hide_small_band_labels: config.hide_small_band_labels ?? false,
      min_band_label_height: config.min_band_label_height ?? 18,

      // Marker label settings
      marker_label_size: config.marker_label_size ?? 11,
      marker_label_weight: config.marker_label_weight ?? 400,
      marker_label_color: config.marker_label_color ?? "var(--primary-text-color)",
      marker_label_color_mode: config.marker_label_color_mode ?? "static",
      marker_label_opacity: config.marker_label_opacity ?? 0.9,
      marker_label_background_color:
        config.marker_label_background_color ?? "var(--card-background-color)",
      marker_label_background_opacity:
        config.marker_label_background_opacity ?? 0.75,
      marker_label_background_mode: config.marker_label_background_mode ?? "card",

      // Axis settings
      show_x_axis: config.show_x_axis ?? true,
      show_x_axis_labels: config.show_x_axis_labels ?? true,
      x_axis_position: config.x_axis_position ?? "bottom",
      x_axis_label_mode: config.x_axis_label_mode ?? "relative",
      x_axis_ticks: config.x_axis_ticks ?? 3,

      show_y_axis: config.show_y_axis ?? true,
      show_y_axis_labels: config.show_y_axis_labels ?? true,
      y_axis_position: config.y_axis_position ?? "left",
      y_axis_ticks: config.y_axis_ticks ?? 2,

      // Shared axis label settings
      // Kept for backwards compatibility. New configs should prefer the separate
      // x_axis_label_* and y_axis_label_* options below.
      axis_label_size: config.axis_label_size ?? 11,
      axis_label_weight: config.axis_label_weight ?? 400,
      axis_label_color: config.axis_label_color ?? "var(--secondary-text-color)",
      axis_label_color_mode: config.axis_label_color_mode ?? "static",
      axis_label_opacity: config.axis_label_opacity ?? 0.8,

      // X-axis label settings
      x_axis_label_size:
        config.x_axis_label_size ?? config.axis_label_size ?? 11,
      x_axis_label_weight:
        config.x_axis_label_weight ?? config.axis_label_weight ?? 400,
      x_axis_label_color:
        config.x_axis_label_color ??
        config.axis_label_color ??
        "var(--secondary-text-color)",
      x_axis_label_color_mode:
        config.x_axis_label_color_mode ??
        config.axis_label_color_mode ??
        "static",
      x_axis_label_opacity:
        config.x_axis_label_opacity ?? config.axis_label_opacity ?? 0.8,

      // Y-axis label settings
      y_axis_label_size:
        config.y_axis_label_size ?? config.axis_label_size ?? 11,
      y_axis_label_weight:
        config.y_axis_label_weight ?? config.axis_label_weight ?? 400,
      y_axis_label_color:
        config.y_axis_label_color ??
        config.axis_label_color ??
        "var(--secondary-text-color)",
      y_axis_label_color_mode:
        config.y_axis_label_color_mode ??
        config.axis_label_color_mode ??
        "static",
      y_axis_label_opacity:
        config.y_axis_label_opacity ?? config.axis_label_opacity ?? 0.8,

      // Top/bottom ribbon slot settings
      top_left: config.top_left ?? "name",
      top_center: config.top_center ?? "none",
      top_right: config.top_right ?? "current",
      bottom_left: config.bottom_left ?? "none",
      bottom_center: config.bottom_center ?? "none",
      bottom_right: config.bottom_right ?? "none",

      // Extra ribbon slot content
      custom_text: config.custom_text ?? "",
      duration_format: config.duration_format ?? "short",

      ribbon_styles: config.ribbon_styles || {},

      // Current value and point marker settings
      show_current: config.show_current ?? true,
      current_position: config.current_position ?? null,

      show_latest: config.show_latest ?? false,
      show_latest_label: config.show_latest_label ?? true,
      latest_marker_size: config.latest_marker_size ?? 4,

      // Min/max marker settings
      show_min: config.show_min ?? config.show_extrema ?? false,
      show_max: config.show_max ?? config.show_extrema ?? false,

      show_extrema_labels: config.show_extrema_labels ?? true,
      extrema_marker_size: config.extrema_marker_size ?? 4,
      extrema_label_mode: config.extrema_label_mode ?? "value",

      hide_recent_min: config.hide_recent_min ?? config.hide_recent_extrema ?? true,
      hide_recent_max: config.hide_recent_max ?? config.hide_recent_extrema ?? false,
      recent_extrema_minutes: config.recent_extrema_minutes ?? 30,

      // Allow unknown/future config options through for compatibility.
      ...config,
    };

    /*
      --------------------------------------------------------------------------
      Backwards-compatible axis label styling
      --------------------------------------------------------------------------
      Older YAML used shared axis_label_* options for both X and Y labels.

      New YAML can use x_axis_label_* and y_axis_label_* independently. If those
      newer options are not set, the old shared axis_label_* options are applied
      to both axes.
    */
    this.config.x_axis_label_size =
      config.x_axis_label_size ?? config.axis_label_size ?? 11;
    this.config.x_axis_label_weight =
      config.x_axis_label_weight ?? config.axis_label_weight ?? 400;
    this.config.x_axis_label_color =
      config.x_axis_label_color ??
      config.axis_label_color ??
      "var(--secondary-text-color)";
    this.config.x_axis_label_color_mode =
      config.x_axis_label_color_mode ??
      config.axis_label_color_mode ??
      "static";
    this.config.x_axis_label_opacity =
      config.x_axis_label_opacity ?? config.axis_label_opacity ?? 0.8;

    this.config.y_axis_label_size =
      config.y_axis_label_size ?? config.axis_label_size ?? 11;
    this.config.y_axis_label_weight =
      config.y_axis_label_weight ?? config.axis_label_weight ?? 400;
    this.config.y_axis_label_color =
      config.y_axis_label_color ??
      config.axis_label_color ??
      "var(--secondary-text-color)";
    this.config.y_axis_label_color_mode =
      config.y_axis_label_color_mode ??
      config.axis_label_color_mode ??
      "static";
    this.config.y_axis_label_opacity =
      config.y_axis_label_opacity ?? config.axis_label_opacity ?? 0.8;

    /*
      --------------------------------------------------------------------------
      Backwards-compatible current_position handling
      --------------------------------------------------------------------------
      Older YAML could place the current value using current_position. This maps
      that setting onto the newer ribbon slot system.
    */
    if (this.config.current_position) {
      this.config.top_left = "name";
      this.config.top_center = "none";
      this.config.top_right = "none";
      this.config.bottom_left = "none";
      this.config.bottom_center = "none";
      this.config.bottom_right = "none";

      if (this.config.show_current && this.config.current_position !== "hidden") {
        this.config[this.config.current_position.replace("-", "_")] = "current";
      }

      if (!["top-left", "bottom-left"].includes(this.config.current_position)) {
        this.config.top_left = "name";
      }
    }
    /*
      --------------------------------------------------------------------------
      Runtime state
      --------------------------------------------------------------------------
      These are internal values, not user-facing config. They track fetched history,
      performance/debug information, render statistics, and measured layout size.
    */
    this._history = [];
    this._rawHistoryCount = 0;
    this._plottedHistoryCount = 0;
    this._historyKey = "";
    this._isFetchingHistory = false;
    this._lastHistoryFetch = null;

    this._lastFetchDurationMs = null;
    this._lastHistoryApiDurationMs = null;
    this._lastDownsampleDurationMs = null;
    this._lastRenderDurationMs = null;
    this._lastWasDownsampled = false;
    this._lastRequestMode = "full history request";
    this._lastHistoryStartTime = null;
    this._lastHistoryEndTime = null;
    this._lastHistoryFirstPointTime = null;
    this._lastHistoryLastPointTime = null;
    this._lastPlotDataCount = 0;
    this._lastLineSegmentCount = 0;
    this._lastLineSplitSegmentCount = 0;
    this._lastLinePathCount = 0;
    this._renderCount = 0;

    // Responsive layout state
    this._cardWidth = 600;
    this._cardHeight = null;

    this._plotWidth = 600;
    this._plotHeight = Number(this.config.height) || 180;

    this._resizeObserver = null;
    this._plotResizeObserver = null;
    this._resizeRenderQueued = false;
  }

  /*
    ============================================================================
    HOME ASSISTANT STATE HANDLING
    ============================================================================
    Called whenever Home Assistant provides updated state. This decides whether
    history needs to be refreshed and then triggers a render.
  */

  /*
    --------------------------------------------------------------------------
    Responsive layout lifecycle
    --------------------------------------------------------------------------
    Watches the host card size and, once rendered, the actual plot area.

    The host measurement gives a reliable width fallback. The plot-area
    measurement is the important one for native resizing, because it measures the
    real space left between the top and bottom ribbons.
  */
  connectedCallback() {
    if (this._resizeObserver) return;

    this._resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];

      const measuredWidth = Math.round(entry?.contentRect?.width || 0);
      const measuredHeight = Math.round(entry?.contentRect?.height || 0);

      const widthChanged =
        measuredWidth && Math.abs(measuredWidth - this._cardWidth) >= 2;

      const heightChanged =
        measuredHeight &&
        Math.abs(measuredHeight - Number(this._cardHeight || 0)) >= 2;

      if (widthChanged) {
        this._cardWidth = measuredWidth;
      }

      if (heightChanged) {
        this._cardHeight = measuredHeight;
      }

      if (widthChanged || heightChanged) {
        this._scheduleResponsiveRender();
      }
    });

    this._resizeObserver.observe(this);
  }

  disconnectedCallback() {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }

    if (this._plotResizeObserver) {
      this._plotResizeObserver.disconnect();
      this._plotResizeObserver = null;
    }

    this._resizeRenderQueued = false;
  }

  _scheduleResponsiveRender() {
    if (!this._hass || this._resizeRenderQueued) return;

    this._resizeRenderQueued = true;

    requestAnimationFrame(() => {
      this._resizeRenderQueued = false;

      if (this._hass) {
        this.render();
      }
    });
  }

  _observePlotArea() {
    const plotWrap = this.querySelector(".sbgc-plot-wrap");

    if (!plotWrap) return;

    if (this._plotResizeObserver) {
      this._plotResizeObserver.disconnect();
    }

    this._plotResizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];

      const measuredPlotWidth = Math.round(entry?.contentRect?.width || 0);
      const measuredPlotHeight = Math.round(entry?.contentRect?.height || 0);

      const plotWidthChanged =
        measuredPlotWidth && Math.abs(measuredPlotWidth - this._plotWidth) >= 2;

      const plotHeightChanged =
        measuredPlotHeight &&
        Math.abs(measuredPlotHeight - this._plotHeight) >= 2;

      if (plotWidthChanged) {
        this._plotWidth = measuredPlotWidth;
      }

      if (plotHeightChanged) {
        this._plotHeight = measuredPlotHeight;
      }

      if (plotWidthChanged || plotHeightChanged) {
        this._scheduleResponsiveRender();
      }
    });

    this._plotResizeObserver.observe(plotWrap);
  }

  set hass(hass) {
    this._hass = hass;

    const key = [
      this.config.entity,
      this.config.hours_to_show,
      this.config.max_history_points,
    ].join("-");

    const refreshIntervalMs =
      Number(this.config.history_refresh_interval) * 1000 || 60000;

    const historyIsStale =
      !this._lastHistoryFetch ||
      Date.now() - this._lastHistoryFetch.getTime() > refreshIntervalMs;

    if ((this._historyKey !== key || historyIsStale) && !this._isFetchingHistory) {
      this._historyKey = key;
      this.fetchHistory();
    }

    this.render();
  }
  /*
    ============================================================================
    HISTORY HELPERS
    ============================================================================
    Functions for deciding how much history to plot and reducing dense histories
    without losing the visible high/low shape of the line.
  */
  getMaxHistoryPoints() {
    if (this.config.max_history_points === "auto") {
      return 500;
    }

    const max = Number(this.config.max_history_points);

    if (!Number.isFinite(max) || max <= 0) {
      return Infinity;
    }

    return Math.max(2, Math.floor(max));
  }

  downsampleHistory(points, maxPoints) {
    if (!Array.isArray(points) || points.length <= maxPoints) {
      return points;
    }

    if (!Number.isFinite(maxPoints)) {
      return points;
    }

    const result = [points[0]];
    const bucketCount = Math.max(1, Math.floor((maxPoints - 2) / 2));
    const bucketSize = (points.length - 2) / bucketCount;

    for (let bucketIndex = 0; bucketIndex < bucketCount; bucketIndex++) {
      const start = Math.floor(1 + bucketIndex * bucketSize);
      const end = Math.min(
        points.length - 1,
        Math.floor(1 + (bucketIndex + 1) * bucketSize)
      );

      const bucket = points.slice(start, end);

      if (bucket.length === 0) continue;

      let minPoint = bucket[0];
      let maxPoint = bucket[0];

      for (const point of bucket) {
        if (point.state < minPoint.state) minPoint = point;
        if (point.state > maxPoint.state) maxPoint = point;
      }

      if (minPoint.time < maxPoint.time) {
        result.push(minPoint, maxPoint);
      } else if (maxPoint.time < minPoint.time) {
        result.push(maxPoint, minPoint);
      } else {
        result.push(minPoint);
      }
    }

    result.push(points[points.length - 1]);

    return result
      .filter(Boolean)
      .sort((a, b) => a.time - b.time)
      .filter((point, index, array) => {
        if (index === 0) return true;
        return point.time !== array[index - 1].time;
      });
  }

  /*
    ============================================================================
    HISTORY FETCHING
    ============================================================================
    Pulls historical state from the Home Assistant history API, parses numeric
    values, downsamples where required, and stores debug/performance metadata.
  */
  async fetchHistory() {
    this._isFetchingHistory = true;

    const fetchStarted = performance.now();

    const entityId = this.config.entity;
    const hoursToShow = Number(this.config.hours_to_show);

    const end = new Date();
    const start = new Date(end.getTime() - hoursToShow * 60 * 60 * 1000);

    this._lastHistoryStartTime = start.getTime();
    this._lastHistoryEndTime = end.getTime();
    this._lastRequestMode = "full history request";

    try {
      const apiStarted = performance.now();

      const history = await this._hass.callApi(
        "GET",
        `history/period/${start.toISOString()}?filter_entity_id=${encodeURIComponent(
          entityId
        )}&end_time=${encodeURIComponent(
          end.toISOString()
        )}&minimal_response=false&significant_changes_only=false&no_attributes=false`
      );

      this._lastHistoryApiDurationMs = Math.round(performance.now() - apiStarted);

      const entityHistory =
        Array.isArray(history) && Array.isArray(history[0]) ? history[0] : [];

      const rawHistory = entityHistory
        .map((item) => ({
          state: Number(item.state),
          time: new Date(item.last_changed).getTime(),
        }))
        .filter((item) => Number.isFinite(item.state) && Number.isFinite(item.time));

      this._rawHistoryCount = rawHistory.length;

      this._lastHistoryFirstPointTime = rawHistory[0]?.time || null;
      this._lastHistoryLastPointTime = rawHistory[rawHistory.length - 1]?.time || null;

      const maxHistoryPoints = this.getMaxHistoryPoints();

      const downsampleStarted = performance.now();

      this._history = this.downsampleHistory(rawHistory, maxHistoryPoints);

      this._lastDownsampleDurationMs = Math.round(
        performance.now() - downsampleStarted
      );

      this._plottedHistoryCount = this._history.length;
      this._lastWasDownsampled = this._history.length < rawHistory.length;

      this._lastHistoryFetch = new Date();
      this._lastFetchDurationMs = Math.round(performance.now() - fetchStarted);
    } catch (error) {
      console.error("Simple Band Graph Card: failed to fetch history", error);

      this._history = [];
      this._rawHistoryCount = 0;
      this._plottedHistoryCount = 0;

      this._lastFetchDurationMs = Math.round(performance.now() - fetchStarted);
      this._lastHistoryApiDurationMs = null;
      this._lastDownsampleDurationMs = null;
      this._lastWasDownsampled = false;
      this._lastHistoryFirstPointTime = null;
      this._lastHistoryLastPointTime = null;
    }

    this._isFetchingHistory = false;
    this.render();
  }

  /*
    ============================================================================
    RENDERING
    ============================================================================
    Builds the complete card HTML/SVG. Most helper functions in this method are
    deliberately local because they depend heavily on the current config, entity
    state, dimensions, and render-time layout values.
  */
  render() {
    const renderStarted = performance.now();

    if (!this._hass) return;
    /*
      --------------------------------------------------------------------------
      Entity state and basic card dimensions
      --------------------------------------------------------------------------
    */
    const entityId = this.config.entity;
    const state = this._hass.states[entityId];

    const name = this.config.name || entityId;
    const rawValue = state ? Number(state.state) : NaN;
    const value = state ? state.state : "unknown";
    const unit = state?.attributes?.unit_of_measurement || "";

    /*
      Use measured plot dimensions when Home Assistant has provided an explicit
      grid height via grid_options.

      In vertical stacks and older/masonry-style layouts, there may be no useful
      allocated row height. In those cases, the plot wrapper can measure as tiny
      or zero. We therefore fall back to the configured graph height so stacked
      cards keep a healthy default size.

      In Sections layouts with grid_options.rows, measured plot height is allowed
      to drive the SVG height, including compact 1-row status-tile layouts.
    */
    const configuredHeight = Number(this.config.height) || 180;

    const gridRows = Number(this.config.grid_options?.rows);
    const hasExplicitGridRows = Number.isFinite(gridRows) && gridRows > 0;

    const measuredPlotWidth = Number(this._plotWidth);
    const measuredPlotHeight = Number(this._plotHeight);
    const measuredCardWidth = Number(this._cardWidth);

    const width =
      Number.isFinite(measuredPlotWidth) && measuredPlotWidth > 0
        ? Math.max(260, Math.round(measuredPlotWidth))
        : Number.isFinite(measuredCardWidth) && measuredCardWidth > 0
          ? Math.max(260, Math.round(measuredCardWidth))
          : 600;

    const height =
      hasExplicitGridRows &&
      Number.isFinite(measuredPlotHeight) &&
      measuredPlotHeight > 0
        ? Math.max(40, Math.round(measuredPlotHeight))
        : configuredHeight;

    /*
      The plot wrapper needs a real minimum height in stacks/older layouts, but
      must be allowed to shrink in Sections layouts where grid rows control the
      allocated height.
    */
    const plotWrapMinHeight = hasExplicitGridRows ? 0 : configuredHeight;
    /*
      --------------------------------------------------------------------------
      General render helpers
      --------------------------------------------------------------------------
    */
    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    const cssValue = (value, fallback, suffix = "") => {
      if (value === undefined || value === null) return fallback;
      return typeof value === "number" ? `${value}${suffix}` : value;
    };

    const normaliseOpacity = (opacity) => {
      const value = Number(opacity);
      if (!Number.isFinite(value)) return 1;
      return clamp(value, 0, 1);
    };

    const applyOpacityToColour = (colour, opacity) => {
      const resolvedOpacity = normaliseOpacity(opacity);

      if (
        resolvedOpacity <= 0 ||
        !colour ||
        colour === "none" ||
        colour === "transparent"
      ) {
        return "transparent";
      }

      if (resolvedOpacity >= 1) {
        return colour;
      }

      return `color-mix(in srgb, ${colour} ${Math.round(
        resolvedOpacity * 100
      )}%, transparent)`;
    };

    const boxesOverlap = (a, b) => {
      if (!a || !b) return false;

      return !(
        a.right < b.left ||
        a.left > b.right ||
        a.bottom < b.top ||
        a.top > b.bottom
      );
    };

    /*
      --------------------------------------------------------------------------
      Value, marker, and band label formatting
      --------------------------------------------------------------------------
      formatValue is the shared formatter for graph values, axis values, band
      ranges, marker labels, and the current value used in ribbon slots.
    */
    const formatValue = (number) => {
      if (!Number.isFinite(number)) return "–";

      if (this.config.value_decimals !== "auto") {
        const decimals = Math.min(
          3,
          Math.max(0, Number(this.config.value_decimals))
        );

        if (Number.isFinite(decimals)) {
          return number.toFixed(decimals);
        }
      }

      if (Math.abs(number) >= 100) {
        return number.toFixed(0);
      }

      if (Math.abs(number) >= 10) {
        return number.toFixed(1);
      }

      return number.toFixed(2);
    };

    const currentText = Number.isFinite(rawValue)
      ? `${formatValue(rawValue)}${unit}`
      : `${value}${unit}`;

    const formatMarkerLabel = (point, markerType = "value") => {
      if (!point) return "";

      const valueText = `${formatValue(point.state)}${unit}`;
      const mode = this.config.extrema_label_mode || "value";

      if (markerType === "latest") {
        return valueText;
      }

      if (mode === "prefixed") {
        if (markerType === "min") return `Min ${valueText}`;
        if (markerType === "max") return `Max ${valueText}`;
      }

      if (mode === "compact") {
        if (markerType === "min") return `↓ ${valueText}`;
        if (markerType === "max") return `↑ ${valueText}`;
      }

      return valueText;
    };

    const formatBandValue = (number, suffix = "") => {
      const formatted = formatValue(number);
      const unitText = this.config.band_label_unit && unit ? unit : "";
      return `${formatted}${suffix}${unitText}`;
    };

    const formatBandLabel = (band) => {
      const mode = this.config.band_label_mode;
      const label = band.label || "";

      if (mode === "hide") return "";
      if (mode === "label") return label;

      const from = Number(band.from);
      const to = Number(band.to);

      const thresholdText = formatBandValue(from, "+");
      const rangeText = `${formatValue(from)}–${formatBandValue(to)}`;

      if (mode === "threshold") {
        return label ? `${label} ${thresholdText}` : thresholdText;
      }

      if (mode === "range") {
        return label ? `${label} ${rangeText}` : rangeText;
      }

      return label;
    };

    /*
      --------------------------------------------------------------------------
      Band lookup helpers
      --------------------------------------------------------------------------
    */
    const getBandForValue = (numericValue) => {
      if (!Number.isFinite(numericValue)) return null;

      return (
        this.config.bands.find((band) => {
          const from = Number(band.from);
          const to = Number(band.to);
          return numericValue >= from && numericValue <= to;
        }) || null
      );
    };

    const getBandForRange = (fromValue, toValue) => {
      const midpoint = (fromValue + toValue) / 2;
      return getBandForValue(midpoint) || getBandForValue(toValue) || getBandForValue(fromValue);
    };

    const getBandThresholds = () => {
      const thresholds = new Set();

      this.config.bands.forEach((band) => {
        const from = Number(band.from);
        const to = Number(band.to);

        if (Number.isFinite(from)) thresholds.add(from);
        if (Number.isFinite(to)) thresholds.add(to);
      });

      return Array.from(thresholds).sort((a, b) => a - b);
    };

    /*
      --------------------------------------------------------------------------
      Colour and background resolution
      --------------------------------------------------------------------------
      Modes such as "static", "band", and "none" are resolved here so drawing
      code can use final CSS colour strings.
    */
    const currentBand = getBandForValue(rawValue);
    const currentBandText = currentBand?.label || "";
    const currentBandMessage = currentBand?.message || "";

    const resolveColour = (
      configuredColour,
      mode = "static",
      opacity = 1,
      bandOverride = undefined
    ) => {
      if (mode === "none") {
        return "transparent";
      }

      if (mode === "band") {
        const bandForColour =
          bandOverride === undefined ? currentBand : bandOverride;

        return applyOpacityToColour(
          bandForColour?.color || configuredColour || "transparent",
          opacity
        );
      }

      return applyOpacityToColour(configuredColour, opacity);
    };

    const resolveBackgroundColour = (zone) => {
      const mode = this.config[`${zone}_color_mode`] || "static";
      const configuredColour = this.config[`${zone}_color`];
      const configuredOpacity = this.config[`${zone}_opacity`];

      return resolveColour(configuredColour, mode, configuredOpacity);
    };

    const getBackgroundInfo = (zone) => {
      const colour = resolveBackgroundColour(zone);
      return {
        colour,
        hasBackground: colour !== "transparent",
      };
    };

    const cardBackground = getBackgroundInfo("background");
    const plotBackground = getBackgroundInfo("plot_background");
    const topRibbonBackground = getBackgroundInfo("top_ribbon_background");
    const bottomRibbonBackground = getBackgroundInfo("bottom_ribbon_background");

    /*
      --------------------------------------------------------------------------
      Option normalisation
      --------------------------------------------------------------------------
      Converts old/alias option values into the internal names used by layout
      calculations.
    */
    const normaliseBandLabelAlign = (align) => {
      if (align === "outside-left") return "outside_left";
      if (align === "outside-right") return "outside_right";
      if (align === "left_outside") return "outside_left";
      if (align === "right_outside") return "outside_right";
      return align;
    };

    const normaliseBandLabelPosition = (position) => {
      if (position === "high") return "top";
      if (position === "mid") return "middle";
      if (position === "low") return "bottom";
      return position;
    };

    const normaliseAxisPosition = (position, fallback) => {
      if (position === "right") return "right";
      if (position === "top") return "top";
      if (position === "bottom") return "bottom";
      if (position === "left") return "left";
      return fallback;
    };

    const bandLabelAlign = normaliseBandLabelAlign(this.config.band_label_align);
    const yAxisPosition = normaliseAxisPosition(this.config.y_axis_position, "left");
    const xAxisPosition = normaliseAxisPosition(this.config.x_axis_position, "bottom");

    /*
      --------------------------------------------------------------------------
      Layout measurements and padding
      --------------------------------------------------------------------------
      Calculates how much room is needed around the plot for axes and outside band
      labels before deriving the final plot rectangle.
    */
    const hasOutsideLeftBandLabels = bandLabelAlign === "outside_left";
    const hasOutsideRightBandLabels = bandLabelAlign === "outside_right";

    const effectiveShowYAxisLabels = this.config.show_y_axis_labels;

    const estimateTextWidth = (text, fontSize) => {
      return String(text || "").length * fontSize * 0.62;
    };

    const bandLabelFontSize = Number(this.config.band_label_size) || 11;
    const bandLabelOutsideGap = Number(this.config.band_label_outside_gap) || 6;
    const bandLabelTexts = this.config.bands.map((band) => formatBandLabel(band));

    const longestBandLabelWidth =
      bandLabelTexts.length > 0
        ? Math.max(
            ...bandLabelTexts.map((text) =>
              estimateTextWidth(text, bandLabelFontSize)
            )
          )
        : 0;

    const calculatedOutsideWidth = clamp(
      longestBandLabelWidth + bandLabelOutsideGap + 8,
      40,
      160
    );

    const bandLabelOutsideWidth =
      this.config.band_label_outside_width === "auto"
        ? calculatedOutsideWidth
        : Number(this.config.band_label_outside_width) || calculatedOutsideWidth;

    const yAxisLabelPadding = 42;

    const baseLeftPadding =
      effectiveShowYAxisLabels && yAxisPosition === "left" ? yAxisLabelPadding : 14;

    const baseRightPadding =
      effectiveShowYAxisLabels && yAxisPosition === "right" ? yAxisLabelPadding : 14;

    const xAxisLabelPadding = 34;

    const baseTopPadding =
      this.config.show_x_axis_labels && xAxisPosition === "top"
        ? xAxisLabelPadding
        : 14;

    const baseBottomPadding =
      this.config.show_x_axis_labels && xAxisPosition === "bottom"
        ? xAxisLabelPadding
        : 24;

    const padding = {
      top: baseTopPadding,
      right: baseRightPadding + (hasOutsideRightBandLabels ? bandLabelOutsideWidth : 0),
      bottom: baseBottomPadding,
      left: baseLeftPadding + (hasOutsideLeftBandLabels ? bandLabelOutsideWidth : 0),
    };

    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;

    const yMin = Number(this.config.y_min);
    const yMax = Number(this.config.y_max);

    /*
      --------------------------------------------------------------------------
      SVG coordinate mapping
      --------------------------------------------------------------------------
      Converts entity values and timestamps into x/y positions within the plot.
    */
    const yToSvg = (y) => {
      const clamped = clamp(y, yMin, yMax);
      const ratio = (clamped - yMin) / (yMax - yMin);
      return padding.top + plotHeight - ratio * plotHeight;
    };

    const now = Date.now();
    const hoursToShow = Number(this.config.hours_to_show);
    const startTime = now - hoursToShow * 60 * 60 * 1000;

    const xToSvg = (timestamp) => {
      const ratio = (timestamp - startTime) / (now - startTime);
      return padding.left + clamp(ratio, 0, 1) * plotWidth;
    };

    /*
      --------------------------------------------------------------------------
      Plot data preparation
      --------------------------------------------------------------------------
      Uses fetched history, then appends the current state if the latest history
      point is not already effectively current.
    */
    const plotData = [...this._history];

    const latestHistoryPoint = plotData[plotData.length - 1];
    const latestHistoryIsCurrent =
      latestHistoryPoint && now - latestHistoryPoint.time < 5000;

    if (Number.isFinite(rawValue) && !latestHistoryIsCurrent) {
      plotData.push({
        state: rawValue,
        time: now,
      });
    }

    const points = plotData
      .map((point) => `${xToSvg(point.time)},${yToSvg(point.state)}`)
      .join(" ");

    this._lastPlotDataCount = plotData.length;
    this._lastLineSegmentCount = Math.max(0, plotData.length - 1);
    this._lastLineSplitSegmentCount = this._lastLineSegmentCount;

    /*
      --------------------------------------------------------------------------
      Band label positioning
      --------------------------------------------------------------------------
    */
    const getBandLabelY = (bandTopY, bandBottomY) => {
      const position = normaliseBandLabelPosition(this.config.band_label_position);
      const inset = 14;

      if (position === "bottom") {
        return {
          y: bandBottomY - inset,
          baseline: "middle",
        };
      }

      if (position === "middle") {
        return {
          y: bandTopY + (bandBottomY - bandTopY) / 2,
          baseline: "middle",
        };
      }

      return {
        y: bandTopY + inset,
        baseline: "middle",
      };
    };

    const getBandLabelX = () => {
      if (bandLabelAlign === "outside_left") {
        return {
          x: padding.left - bandLabelOutsideGap,
          anchor: "end",
        };
      }

      if (bandLabelAlign === "outside_right") {
        return {
          x: padding.left + plotWidth + bandLabelOutsideGap,
          anchor: "start",
        };
      }

      if (
        bandLabelAlign === "center" ||
        bandLabelAlign === "middle" ||
        bandLabelAlign === "mid"
      ) {
        return {
          x: padding.left + plotWidth / 2,
          anchor: "middle",
        };
      }

      if (bandLabelAlign === "right") {
        return {
          x: padding.left + plotWidth - 8,
          anchor: "end",
        };
      }

      return {
        x: padding.left + 8,
        anchor: "start",
      };
    };

    /*
      --------------------------------------------------------------------------
      Time and debug text formatting
      --------------------------------------------------------------------------
    */
    const formatHoursAgo = (hours) => {
      if (hours <= 0) return "now";

      if (hours < 1) {
        const minutes = Math.round(hours * 60);
        return `${minutes}m ago`;
      }

      if (hours % 24 === 0 && hours >= 24) {
        const days = hours / 24;
        return `${days}d ago`;
      }

      const rounded = Number.isInteger(hours)
        ? String(hours)
        : hours.toFixed(1).replace(/\.0$/, "");

      return `${rounded}h ago`;
    };

    const formatClockTime = (timestamp) => {
      return new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const formatXAxisLabel = (timestamp, hoursAgo, isNow = false) => {
      if (isNow) return "now";

      if (this.config.x_axis_label_mode === "time") {
        return formatClockTime(timestamp);
      }

      return formatHoursAgo(hoursAgo);
    };

    const formatDurationLabel = () => {
      const hours = Number(this.config.hours_to_show);
    
      if (!Number.isFinite(hours) || hours <= 0) return "";
    
      if (this.config.duration_format === "long") {
        if (hours < 1) {
          const minutes = Math.round(hours * 60);
          return `${minutes} minute${minutes === 1 ? "" : "s"}`;
        }
    
        if (hours % 24 === 0 && hours >= 24) {
          const days = hours / 24;
          return `${days} day${days === 1 ? "" : "s"}`;
        }
    
        return `${hours} hour${hours === 1 ? "" : "s"}`;
      }
    
      if (hours < 1) {
        return `${Math.round(hours * 60)}m`;
      }
    
      if (hours % 24 === 0 && hours >= 24) {
        return `${hours / 24}d`;
      }
    
      return Number.isInteger(hours) ? `${hours}h` : `${hours.toFixed(1)}h`;
    };

    const formatRelativeFetchTime = () => {
      if (!this._lastHistoryFetch) return "not fetched";

      const seconds = Math.round(
        (Date.now() - this._lastHistoryFetch.getTime()) / 1000
      );

      if (seconds < 60) return `${seconds}s ago`;

      const minutes = Math.round(seconds / 60);

      if (minutes < 60) return `${minutes}m ago`;

      const hours = Math.round(minutes / 60);
      return `${hours}h ago`;
    };

    const formatDuration = (durationMs) => {
      if (durationMs === null || durationMs === undefined) return "–";
      return `${durationMs}ms`;
    };

    const formatRelativeTimestamp = (timestamp) => {
      if (!timestamp) return "–";

      const ageSeconds = Math.round((Date.now() - timestamp) / 1000);

      if (ageSeconds < 60) return `${ageSeconds}s ago`;

      const ageMinutes = Math.round(ageSeconds / 60);

      if (ageMinutes < 60) return `${ageMinutes}m ago`;

      const ageHours = Math.round(ageMinutes / 60);

      if (ageHours < 48) return `${ageHours}h ago`;

      const ageDays = Math.round(ageHours / 24);
      return `${ageDays}d ago`;
    };

    const formatDensity = () => {
      const hours = Number(this.config.hours_to_show);

      if (!Number.isFinite(hours) || hours <= 0 || !this._rawHistoryCount) {
        return "–";
      }

      const density = this._rawHistoryCount / hours;

      if (density >= 10) return `${density.toFixed(0)}/h`;
      if (density >= 1) return `${density.toFixed(1)}/h`;

      return `${density.toFixed(2)}/h`;
    };

    const formatDownsampleRatio = () => {
      if (!this._rawHistoryCount) return "–";

      const ratio = (this._plottedHistoryCount / this._rawHistoryCount) * 100;
      return `${ratio.toFixed(0)}%`;
    };

    /*
      --------------------------------------------------------------------------
      Axis tick generation and shared label colours
      --------------------------------------------------------------------------
      Generates X/Y tick positions and resolves label colours.

      X-axis and Y-axis label styling are now handled separately. The older
      shared axis_label_* settings are still supported through setConfig
      fallbacks, so existing YAML remains compatible.
    */
    const yAxisTicks = Math.max(2, Number(this.config.y_axis_ticks) || 2);
    const xAxisTicks = Math.max(2, Number(this.config.x_axis_ticks) || 3);

    const yTickValues = Array.from({ length: yAxisTicks }).map((_, index) => {
      const ratio = yAxisTicks === 1 ? 0 : index / (yAxisTicks - 1);
      return yMax - ratio * (yMax - yMin);
    });

    const xTickValues = Array.from({ length: xAxisTicks }).map((_, index) => {
      const ratio = xAxisTicks === 1 ? 0 : index / (xAxisTicks - 1);
      return {
        ratio,
        timestamp: startTime + ratio * (now - startTime),
        hoursAgo: hoursToShow * (1 - ratio),
        isNow: index === xAxisTicks - 1,
        index,
      };
    });

    const xAxisLabelColour = resolveColour(
      this.config.x_axis_label_color,
      this.config.x_axis_label_color_mode,
      this.config.x_axis_label_opacity
    );

    const yAxisLabelColour = resolveColour(
      this.config.y_axis_label_color,
      this.config.y_axis_label_color_mode,
      this.config.y_axis_label_opacity
    );

    const bandLabelColour = resolveColour(
      this.config.band_label_color,
      this.config.band_label_color_mode,
      this.config.band_label_opacity
    );

    /*
      --------------------------------------------------------------------------
      Grid SVG
      --------------------------------------------------------------------------
    */
    const yGridHtml = this.config.show_y_grid
      ? yTickValues
          .map((value) => {
            const y = yToSvg(value);

            return `
              <line
                x1="${padding.left}"
                y1="${y}"
                x2="${padding.left + plotWidth}"
                y2="${y}"
                stroke="${cssValue(this.config.grid_color, "var(--divider-color)")}"
                stroke-width="${cssValue(this.config.grid_width, 1)}"
                opacity="${cssValue(this.config.grid_opacity, 0.35)}"
              ></line>
            `;
          })
          .join("")
      : "";

    const xGridHtml = this.config.show_x_grid
      ? xTickValues
          .map((tick) => {
            const x = padding.left + tick.ratio * plotWidth;

            return `
              <line
                x1="${x}"
                y1="${padding.top}"
                x2="${x}"
                y2="${padding.top + plotHeight}"
                stroke="${cssValue(this.config.grid_color, "var(--divider-color)")}"
                stroke-width="${cssValue(this.config.grid_width, 1)}"
                opacity="${cssValue(this.config.grid_opacity, 0.35)}"
              ></line>
            `;
          })
          .join("")
      : "";

    /*
      --------------------------------------------------------------------------
      Y-axis SVG
      --------------------------------------------------------------------------
      Renders the vertical axis line and its value labels.

      Y-axis labels use the dedicated y_axis_label_* settings, which are resolved
      from either modern y_axis_label_* YAML or legacy shared axis_label_* YAML in
      setConfig.
    */
    const yAxisX =
      yAxisPosition === "right" ? padding.left + plotWidth : padding.left;

    const yAxisHtml = this.config.show_y_axis
      ? `
        <line
          x1="${yAxisX}"
          y1="${padding.top}"
          x2="${yAxisX}"
          y2="${padding.top + plotHeight}"
          stroke="var(--divider-color)"
          stroke-width="1"
        ></line>
      `
      : "";

    const yAxisLabelsHtml = effectiveShowYAxisLabels
      ? yTickValues
          .map((value) => {
            const y = yToSvg(value);

            const x =
              yAxisPosition === "right"
                ? padding.left + plotWidth + 8
                : padding.left - 8;

            const anchor = yAxisPosition === "right" ? "start" : "end";

            return `
              <text
                x="${x}"
                y="${y}"
                text-anchor="${anchor}"
                dominant-baseline="middle"
                font-size="${cssValue(this.config.y_axis_label_size, 11, "px")}"
                font-weight="${cssValue(this.config.y_axis_label_weight, 400)}"
                fill="${yAxisLabelColour}"
              >
                ${formatValue(value)}
              </text>
            `;
          })
          .join("")
      : "";

    /*
      --------------------------------------------------------------------------
      Band background rectangles and band labels
      --------------------------------------------------------------------------
    */
    const bands = this.config.show_bands
      ? this.config.bands
          .map((band) => {
            const from = Number(band.from);
            const to = Number(band.to);

            const y1 = yToSvg(to);
            const y2 = yToSvg(from);
            const bandHeight = y2 - y1;
            const bandLabel = formatBandLabel(band);
            const bandLabelY = getBandLabelY(y1, y2);
            const bandLabelX = getBandLabelX();

            const shouldHideSmallLabel =
              this.config.hide_small_band_labels &&
              bandHeight < Number(this.config.min_band_label_height);

            if (bandHeight <= 0) return "";

            return `
              <rect
                x="${padding.left}"
                y="${y1}"
                width="${plotWidth}"
                height="${bandHeight}"
                fill="${applyOpacityToColour(
                  band.color || "rgba(128,128,128,0.15)",
                  this.config.band_opacity
                )}"
              ></rect>

              ${
                bandLabel && !shouldHideSmallLabel
                  ? `
                    <text
                      x="${bandLabelX.x}"
                      y="${bandLabelY.y}"
                      text-anchor="${bandLabelX.anchor}"
                      dominant-baseline="${bandLabelY.baseline}"
                      font-size="${cssValue(this.config.band_label_size ?? 11, 11, "px")}"
                      font-weight="${cssValue(this.config.band_label_weight, 400)}"
                      fill="${bandLabelColour}"
                    >
                      ${bandLabel}
                    </text>
                  `
                  : ""
              }
            `;
          })
          .join("")
      : "";

    /*
      --------------------------------------------------------------------------
      Extrema detection
      --------------------------------------------------------------------------
      Finds historical min/max points for optional markers and ribbon slot values.
    */
    const extrema =
      this._history.length > 0
        ? this._history.reduce(
            (result, point) => {
              if (!result.min || point.state < result.min.state) {
                result.min = point;
              }

              if (!result.max || point.state > result.max.state) {
                result.max = point;
              }

              return result;
            },
            { min: null, max: null }
          )
        : { min: null, max: null };

    const recentExtremaMinutes = Number(this.config.recent_extrema_minutes);
    const recentCutoff = now - recentExtremaMinutes * 60 * 1000;

    const isRecent = (point) => {
      if (!point) return false;
      return point.time >= recentCutoff;
    };

    /*
      --------------------------------------------------------------------------
      Marker rendering
      --------------------------------------------------------------------------
      Builds latest/min/max marker SVG, including simple label placement and
      overlap avoidance against previously placed marker labels.
    */
    const buildValueMarker = (point, options = {}) => {
      if (!point) {
        return {
          html: "",
          labelBox: null,
        };
      }

      const markerSize = Number(options.markerSize ?? 4);
      const requestedShowLabel = options.showLabel ?? true;
      const markerType = options.markerType ?? "value";
      const hideLabelIfOverlapsBoxes = options.hideLabelIfOverlapsBoxes || [];

      const x = xToSvg(point.time);
      const y = yToSvg(point.state);

      const labelText = formatMarkerLabel(point, markerType);

      const markerLabelSize = Number(this.config.marker_label_size) || 11;
      const markerLabelHeight = markerLabelSize + 8;
      const estimatedLabelWidth = labelText.length * markerLabelSize * 0.62;
      const gap = 8;

      const plotRight = padding.left + plotWidth;
      const plotTop = padding.top;
      const plotBottom = padding.top + plotHeight;

      const midpoint = yMin + (yMax - yMin) / 2;
      const preferredLabelY = point.state >= midpoint ? y - 18 : y + 18;

      const labelY = clamp(
        preferredLabelY,
        plotTop + markerLabelHeight / 2,
        plotBottom - markerLabelHeight / 2
      );

      const buildLabelPlacement = (forceLeft = false) => {
        const wouldOverflowRight = x + gap + estimatedLabelWidth > plotRight;
        const placeLeft = forceLeft || wouldOverflowRight;

        const labelX = placeLeft ? x - gap - estimatedLabelWidth : x + gap;

        const backgroundX = labelX - 4;
        const backgroundY = labelY - markerLabelHeight / 2;

        const labelBox = {
          left: backgroundX,
          top: backgroundY,
          right: backgroundX + estimatedLabelWidth + 8,
          bottom: backgroundY + markerLabelHeight,
        };

        return {
          labelX,
          labelY,
          backgroundX,
          backgroundY,
          labelBox,
        };
      };

      let labelPlacement = buildLabelPlacement(false);

      const overlapsBlockedLabel = (box) =>
        hideLabelIfOverlapsBoxes.some((blockedBox) =>
          boxesOverlap(box, blockedBox)
        );

      let resolvedShowLabel =
        requestedShowLabel && !overlapsBlockedLabel(labelPlacement.labelBox);

      if (requestedShowLabel && !resolvedShowLabel && markerType !== "latest") {
        const leftPlacement = buildLabelPlacement(true);

        if (!overlapsBlockedLabel(leftPlacement.labelBox)) {
          labelPlacement = leftPlacement;
          resolvedShowLabel = true;
        }
      }

      const markerBand = getBandForValue(point.state);

      const markerLabelColour = resolveColour(
        this.config.marker_label_color,
        this.config.marker_label_color_mode,
        this.config.marker_label_opacity,
        markerBand
      );

      const markerBackgroundColor =
        this.config.marker_label_background_mode === "band" && markerBand?.color
          ? markerBand.color
          : cssValue(
              this.config.marker_label_background_color,
              "var(--card-background-color)"
            );

      return {
        labelBox: resolvedShowLabel ? labelPlacement.labelBox : null,
        html: `
          <circle
            cx="${x}"
            cy="${y}"
            r="${markerSize}"
            fill="var(--primary-color)"
            stroke="var(--card-background-color)"
            stroke-width="2"
            opacity="0.95"
          ></circle>

          ${
            resolvedShowLabel
              ? `
                <rect
                  x="${labelPlacement.backgroundX}"
                  y="${labelPlacement.backgroundY}"
                  width="${estimatedLabelWidth + 8}"
                  height="${markerLabelHeight}"
                  rx="4"
                  fill="${markerBackgroundColor}"
                  opacity="${cssValue(this.config.marker_label_background_opacity, 0.75)}"
                ></rect>

                <text
                  x="${labelPlacement.labelX}"
                  y="${labelPlacement.labelY}"
                  dominant-baseline="middle"
                  font-size="${cssValue(this.config.marker_label_size ?? 11, 11, "px")}"
                  font-weight="${cssValue(this.config.marker_label_weight, 400)}"
                  fill="${markerLabelColour}"
                >
                  ${labelText}
                </text>
              `
              : ""
          }
        `,
      };
    };

    const showMin =
      this.config.show_min &&
      extrema.min &&
      !(this.config.hide_recent_min && isRecent(extrema.min));

    const showMax =
      this.config.show_max &&
      extrema.max &&
      extrema.max !== extrema.min &&
      !(this.config.hide_recent_max && isRecent(extrema.max));

    const latestPoint = Number.isFinite(rawValue)
      ? {
          state: rawValue,
          time: now,
        }
      : null;

    const latestMarkerInfo = this.config.show_latest
      ? buildValueMarker(latestPoint, {
          markerSize: Number(this.config.latest_marker_size),
          showLabel: this.config.show_latest_label,
          markerType: "latest",
        })
      : {
          html: "",
          labelBox: null,
        };

    const minMarkerInfo = showMin
      ? buildValueMarker(extrema.min, {
          markerSize: Number(this.config.extrema_marker_size),
          showLabel: this.config.show_extrema_labels,
          markerType: "min",
          hideLabelIfOverlapsBoxes: [latestMarkerInfo.labelBox],
        })
      : {
          html: "",
          labelBox: null,
        };

    const maxMarkerInfo = showMax
      ? buildValueMarker(extrema.max, {
          markerSize: Number(this.config.extrema_marker_size),
          showLabel: this.config.show_extrema_labels,
          markerType: "max",
          hideLabelIfOverlapsBoxes: [latestMarkerInfo.labelBox],
        })
      : {
          html: "",
          labelBox: null,
        };

    const extremaMarkers = `
      ${minMarkerInfo.html}
      ${maxMarkerInfo.html}
    `;

    const latestMarker = latestMarkerInfo.html;

    /*
      --------------------------------------------------------------------------
      X-axis SVG
      --------------------------------------------------------------------------
      Renders the horizontal time axis line and its time labels.

      X-axis labels now use the dedicated x_axis_label_* settings rather than the
      older shared axis_label_* settings.
    */
    const xAxisY =
      xAxisPosition === "top" ? padding.top : padding.top + plotHeight;

    const xAxisLabelY = xAxisPosition === "top" ? xAxisY - 14 : xAxisY + 18;

    const xAxisLabelsHtml = this.config.show_x_axis_labels
      ? xTickValues
          .map((tick) => {
            const anchor =
              tick.index === 0
                ? "start"
                : tick.index === xAxisTicks - 1
                  ? "end"
                  : "middle";

            return `
              <text
                x="${padding.left + tick.ratio * plotWidth}"
                y="${xAxisLabelY}"
                text-anchor="${anchor}"
                dominant-baseline="middle"
                font-size="${cssValue(this.config.x_axis_label_size, 11, "px")}"
                font-weight="${cssValue(this.config.x_axis_label_weight, 400)}"
                fill="${xAxisLabelColour}"
              >
                ${formatXAxisLabel(tick.timestamp, tick.hoursAgo, tick.isNow)}
              </text>
            `;
          })
          .join("")
      : "";

    const xAxisHtml = this.config.show_x_axis
      ? `
        <line
          x1="${padding.left}"
          y1="${xAxisY}"
          x2="${padding.left + plotWidth}"
          y2="${xAxisY}"
          stroke="var(--divider-color)"
          stroke-width="1"
        ></line>

        ${xAxisLabelsHtml}
      `
      : "";

    /*
      --------------------------------------------------------------------------
      Line rendering
      --------------------------------------------------------------------------
      Static line mode draws one polyline. Band colour mode splits the line at
      band thresholds and groups adjacent segments that share the same colour.
    */
    const buildGroupedBandLineHtml = () => {
      if (plotData.length < 2) {
        this._lastLinePathCount = 0;
        this._lastLineSplitSegmentCount = 0;
        return "";
      }

      const thresholds = getBandThresholds();
      const paths = [];

      let splitSegmentCount = 0;
      let currentColour = null;
      let currentPoints = [];

      const toSvgPoint = (point) => `${xToSvg(point.time)},${yToSvg(point.state)}`;

      const flushCurrentPath = () => {
        if (currentPoints.length < 2 || !currentColour) return;

        paths.push({
          colour: currentColour,
          points: currentPoints.join(" "),
        });
      };

      const getCrossingsForSegment = (startPoint, endPoint) => {
        const startValue = startPoint.state;
        const endValue = endPoint.state;

        if (startValue === endValue) return [];

        const low = Math.min(startValue, endValue);
        const high = Math.max(startValue, endValue);

        return thresholds
          .filter((threshold) => threshold > low && threshold < high)
          .map((threshold) => {
            const ratio = (threshold - startValue) / (endValue - startValue);
            return {
              state: threshold,
              time: startPoint.time + ratio * (endPoint.time - startPoint.time),
              ratio,
            };
          })
          .sort((a, b) => a.ratio - b.ratio);
      };

      for (let index = 1; index < plotData.length; index += 1) {
        const previousPoint = plotData[index - 1];
        const point = plotData[index];

        const subPoints = [
          previousPoint,
          ...getCrossingsForSegment(previousPoint, point),
          point,
        ];

        for (let subIndex = 1; subIndex < subPoints.length; subIndex += 1) {
          const startPoint = subPoints[subIndex - 1];
          const endPoint = subPoints[subIndex];

          if (startPoint.time === endPoint.time && startPoint.state === endPoint.state) {
            continue;
          }

          const segmentBand = getBandForRange(startPoint.state, endPoint.state);

          const segmentColour = resolveColour(
            this.config.line_color,
            "band",
            this.config.line_opacity,
            segmentBand
          );

          const startSvgPoint = toSvgPoint(startPoint);
          const endSvgPoint = toSvgPoint(endPoint);

          splitSegmentCount += 1;

          if (segmentColour !== currentColour) {
            flushCurrentPath();

            currentColour = segmentColour;
            currentPoints = [startSvgPoint, endSvgPoint];
          } else {
            const lastPoint = currentPoints[currentPoints.length - 1];

            if (lastPoint !== startSvgPoint) {
              currentPoints.push(startSvgPoint);
            }

            currentPoints.push(endSvgPoint);
          }
        }
      }

      flushCurrentPath();

      this._lastLineSplitSegmentCount = splitSegmentCount;
      this._lastLinePathCount = paths.length;

      return paths
        .map(
          (path) => `
            <polyline
              points="${path.points}"
              fill="none"
              stroke="${path.colour}"
              stroke-width="${cssValue(this.config.line_width, 3)}"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></polyline>
          `
        )
        .join("");
    };

    let lineHtml = "";

    if (this.config.show_line && points) {
      if (this.config.line_color_mode === "band") {
        lineHtml = buildGroupedBandLineHtml();
      } else {
        this._lastLinePathCount = 1;
        this._lastLineSplitSegmentCount = this._lastLineSegmentCount;

        lineHtml = `
          <polyline
            points="${points}"
            fill="none"
            stroke="${cssValue(this.config.line_color, "var(--primary-color)")}"
            stroke-width="${cssValue(this.config.line_width, 3)}"
            opacity="${cssValue(this.config.line_opacity, 1)}"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></polyline>
        `;
      }
    } else {
      this._lastLinePathCount = 0;
      this._lastLineSplitSegmentCount = 0;
    }

    /*
      --------------------------------------------------------------------------
      Debug/status text
      --------------------------------------------------------------------------
    */
    const maxHistoryPointsText =
      this.config.max_history_points === "auto"
        ? "auto/500"
        : String(this.config.max_history_points);

    const debugLevel = this.config.debug_level || "basic";

    let debugLines = [];

    if (debugLevel === "off") {
      debugLines = [];
    } else if (this._isFetchingHistory) {
      debugLines = ["debug · loading history"];
    } else {
      const basicDebugLines = [
        `debug · ${this.config.hours_to_show}h · fetched ${formatRelativeFetchTime()}`,
        `raw ${this._rawHistoryCount} · plotted ${this._plottedHistoryCount} · path ${this._lastPlotDataCount} · segments ${this._lastLineSegmentCount}/${this._lastLineSplitSegmentCount} · grouped paths ${this._lastLinePathCount} · max ${maxHistoryPointsText}`,
        `refresh ${this.config.history_refresh_interval}s · ${this._lastRequestMode}`,
        `y ${yMin}-${yMax} · x ${this.config.x_axis_label_mode} · line ${this.config.line_color_mode}`,
      ];

      const performanceDebugLines = [
        `fetch ${formatDuration(this._lastFetchDurationMs)} · api ${formatDuration(this._lastHistoryApiDurationMs)} · downsample ${formatDuration(this._lastDownsampleDurationMs)}`,
        `render ${formatDuration(this._lastRenderDurationMs)} · renders ${this._renderCount}`,
        `downsample ${this._lastWasDownsampled ? "yes" : "no"} · ratio ${formatDownsampleRatio()} · density ${formatDensity()}`,
      ];

      const verboseDebugLines = [
        `first ${formatRelativeTimestamp(this._lastHistoryFirstPointTime)} · last ${formatRelativeTimestamp(this._lastHistoryLastPointTime)}`,
        `window ${formatRelativeTimestamp(this._lastHistoryStartTime)} → ${formatRelativeTimestamp(this._lastHistoryEndTime)}`,
      ];

      if (debugLevel === "performance") {
        debugLines = [...basicDebugLines, ...performanceDebugLines];
      } else if (debugLevel === "verbose") {
        debugLines = [
          ...basicDebugLines,
          ...performanceDebugLines,
          ...verboseDebugLines,
        ];
      } else {
        debugLines = basicDebugLines;
      }
    }

    const debugText = this.config.debug_multiline
      ? debugLines.join("\n")
      : debugLines.join(" · ");

    /*
      --------------------------------------------------------------------------
      Ribbon slot content
      --------------------------------------------------------------------------
      Slot names map to rendered text. This keeps the slot renderer simple and
      makes it easier to add new slot keywords later.
    */
    const minText = extrema.min ? formatMarkerLabel(extrema.min, "min") : "";
    const durationText = formatDurationLabel();
    const maxText =
      extrema.max && extrema.max !== extrema.min
        ? formatMarkerLabel(extrema.max, "max")
        : "";

    const slotContent = {
      none: "",
      name,
      current: currentText,
      band: currentBandText,
      message: currentBandMessage,
      band_message: currentBandMessage,
      instruction: currentBandMessage,
      instructions: currentBandMessage,
      debug: debugText,
      status: debugText,
      entity: entityId,
      unit,
      min: minText,
      minimum: minText,
      max: maxText,
      maximum: maxText,
    
      // Extra ribbon slot content
      custom: this.config.custom_text,
      text: this.config.custom_text,
      duration: durationText,
      hours: durationText,
      range: durationText,
    };

    const renderSlot = (slotName, alignment, positionKey) => {
      const content = slotContent[slotName] ?? "";

      if (!content) {
        return `<div></div>`;
      }

      const isDebug = slotName === "debug" || slotName === "status";

      const defaultFontSize = this.config[`${positionKey}_font_size`] ?? 16;
      const defaultFontWeight = this.config[`${positionKey}_font_weight`] ?? 600;
      const defaultOpacity = this.config[`${positionKey}_opacity`] ?? 1;

      const defaultColor = isDebug
        ? "var(--secondary-text-color)"
        : "var(--primary-text-color)";

      const style = this.config.ribbon_styles?.[positionKey] || {};

      const fontSize = cssValue(style.font_size ?? defaultFontSize, defaultFontSize, "px");
      const fontWeight = cssValue(style.font_weight, defaultFontWeight);
      const colourMode = style.color_mode ?? this.config.ribbon_color_mode ?? "static";
      const colourOpacity =
        style.color_opacity ?? style.opacity ?? defaultOpacity;
      const color = resolveColour(style.color ?? defaultColor, colourMode, colourOpacity);
      const opacity = 1;
      const textTransform = cssValue(style.text_transform, "none");
      const letterSpacing = cssValue(style.letter_spacing, "normal");

      return `
        <div
          style="
            text-align: ${alignment};
            font-size: ${fontSize};
            font-weight: ${fontWeight};
            color: ${color};
            opacity: ${opacity};
            text-transform: ${textTransform};
            letter-spacing: ${letterSpacing};
            min-width: 0;
            overflow: hidden;
            text-overflow: ${this.config.debug_multiline && isDebug ? "clip" : "ellipsis"};
            white-space: ${this.config.debug_multiline && isDebug ? "pre-line" : "nowrap"};
            line-height: ${this.config.debug_multiline && isDebug ? "1.35" : "normal"};
          "
        >
          ${content}
        </div>
      `;
    };

    /*
      --------------------------------------------------------------------------
      Ribbon layout
      --------------------------------------------------------------------------
      Renders top/bottom ribbons using only the occupied slots, adjusting the grid
      template so left/centre/right combinations stay balanced.
    */
    const renderRibbon = (left, center, right, marginTop = 0, prefix = "top") => {
      const hasLeft = (slotContent[left] ?? "") !== "";
      const hasCenter = (slotContent[center] ?? "") !== "";
      const hasRight = (slotContent[right] ?? "") !== "";

      if (!hasLeft && !hasCenter && !hasRight) return "";

      const backgroundInfo =
        prefix === "top" ? topRibbonBackground : bottomRibbonBackground;

      const ribbonPadding = backgroundInfo.hasBackground ? "8px 10px" : "0";
      const ribbonRadius = Number(this.config.ribbon_background_radius) || 0;

      let gridTemplateColumns = "1fr";
      let leftColumn = "1";
      let centerColumn = "1";
      let rightColumn = "1";

      if (hasLeft && hasCenter && hasRight) {
        gridTemplateColumns = "1fr auto 1fr";
        leftColumn = "1";
        centerColumn = "2";
        rightColumn = "3";
      } else if (hasLeft && hasCenter && !hasRight) {
        gridTemplateColumns = "1fr auto";
        leftColumn = "1";
        centerColumn = "2";
      } else if (hasLeft && !hasCenter && hasRight) {
        gridTemplateColumns = "1fr 1fr";
        leftColumn = "1";
        rightColumn = "2";
      } else if (!hasLeft && hasCenter && hasRight) {
        gridTemplateColumns = "auto 1fr";
        centerColumn = "1";
        rightColumn = "2";
      }

      return `
        <div
          style="
            display: grid;
            grid-template-columns: ${gridTemplateColumns};
            align-items: baseline;
            gap: 12px;
            margin-top: ${marginTop}px;
            padding: ${ribbonPadding};
            border-radius: ${ribbonRadius}px;
            background: ${backgroundInfo.colour};
          "
        >
          ${
            hasLeft
              ? `<div style="grid-column: ${leftColumn}; min-width: 0;">${renderSlot(
                  left,
                  "left",
                  `${prefix}_left`
                )}</div>`
              : ""
          }

          ${
            hasCenter
              ? `<div style="grid-column: ${centerColumn}; min-width: 0;">${renderSlot(
                  center,
                  "center",
                  `${prefix}_center`
                )}</div>`
              : ""
          }

          ${
            hasRight
              ? `<div style="grid-column: ${rightColumn}; min-width: 0;">${renderSlot(
                  right,
                  "right",
                  `${prefix}_right`
                )}</div>`
              : ""
          }
        </div>
      `;
    };

    const topRibbonHtml = renderRibbon(
      this.config.top_left,
      this.config.top_center,
      this.config.top_right,
      0,
      "top"
    );

    const bottomRibbonHtml = renderRibbon(
      this.config.bottom_left,
      this.config.bottom_center,
      this.config.bottom_right,
      6,
      "bottom"
    );

    /*
      --------------------------------------------------------------------------
      Final card HTML
      --------------------------------------------------------------------------
      Layer order inside the SVG matters: background, grid, labels/bands, axes,
      then line and markers.

      The host/card/wrapper styles allow the card to participate properly in
      Home Assistant's resizable Sections layout.

      The plot wrapper is the important responsive layer: it fills the remaining
      space between the top and bottom ribbons, then ResizeObserver measures it
      so the SVG viewBox can be recalculated using the real plot area size.
    */
    this.innerHTML = `
      <style>
        :host {
          display: block;
          height: 100%;
          min-height: 0;
        }

        ha-card {
          height: 100%;
          box-sizing: border-box;
          background: ${cardBackground.colour};
        }

        .sbgc-inner {
          height: 100%;
          box-sizing: border-box;
          padding: 16px;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        .sbgc-plot-wrap {
          flex: 1 1 0;
          min-height: ${plotWrapMinHeight}px;
          margin-top: 12px;
          min-width: 0;
          overflow: visible;
        }

        .sbgc-svg {
          width: 100%;
          height: 100%;
          display: block;
          min-width: 0;
          min-height: 0;
        }
      </style>

      <ha-card>
        <div class="sbgc-inner">
          ${topRibbonHtml}

          <div class="sbgc-plot-wrap">
            <svg
              class="sbgc-svg"
              viewBox="0 0 ${width} ${height}"
              preserveAspectRatio="none"
            >
              <rect
                x="${padding.left}"
                y="${padding.top}"
                width="${plotWidth}"
                height="${plotHeight}"
                rx="${Number(this.config.plot_background_radius) || 0}"
                fill="${plotBackground.colour}"
              ></rect>

              ${yGridHtml}
              ${xGridHtml}

              ${yAxisLabelsHtml}

              ${bands}

              ${yAxisHtml}
              ${xAxisHtml}

              ${
                points
                  ? `
                    ${lineHtml}
                    ${extremaMarkers}
                    ${latestMarker}
                  `
                  : `
                    <text
                      x="${padding.left + plotWidth / 2}"
                      y="${padding.top + plotHeight / 2}"
                      text-anchor="middle"
                      font-size="13"
                      fill="var(--secondary-text-color)"
                    >
                      No data
                    </text>
                  `
              }
            </svg>
          </div>

          ${bottomRibbonHtml}
        </div>
      </ha-card>
    `;

    this._observePlotArea();

    this._lastRenderDurationMs = Math.round(performance.now() - renderStarted);
    this._renderCount += 1;
  }

  /*
    ============================================================================
    HOME ASSISTANT CARD SIZE
    ============================================================================
    Used by Home Assistant layouts as sizing metadata.

    getGridOptions is used by the newer Sections layout so the card can be
    resized sensibly in the dashboard grid.

    getCardSize is used by older masonry layouts as a rough height estimate.
  */
  getGridOptions() {
    return {
      columns: 6,
      rows: 4,
      min_columns: 1,
      min_rows: 1,
      max_columns: 12,
      max_rows: 12,
    };
  }

  getCardSize() {
    return 4;
  }
}
/*
  ============================================================================
  CUSTOM ELEMENT REGISTRATION
  ============================================================================
  Registers the card once, avoiding duplicate-definition errors during reloads.
*/
if (!customElements.get("simple-band-graph-card")) {
  customElements.define("simple-band-graph-card", SimpleBandGraphCard);
}

/*
  ============================================================================
  CARD PICKER REGISTRATION
  ============================================================================
  Adds the card to Home Assistant's "Add card" picker.

  This is separate from customElements.define. The custom element registration
  makes the card usable when YAML says type: custom:simple-band-graph-card.
  The window.customCards entry makes it discoverable in the visual card picker.
*/
window.customCards = window.customCards || [];

window.customCards.push({
  type: "simple-band-graph-card",
  name: "Simple Band Graph",
  preview: true,
  description:
    "Plot a numeric entity against configurable coloured bands, with optional axes, markers, ribbons, and debug information.",
  documentationURL:
    "https://github.com/Future-Surfer/simple-band-graph-card",
});
