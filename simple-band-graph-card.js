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

      // History settings:
      history_mode: "auto",
      statistics_type: "mean",
      statistics_period: "hour",
      hybrid_raw_hours: 240,

      // Axis settings
      show_x_axis: false,
      show_x_axis_labels: true,
      x_axis_position: "bottom",
      x_axis_label_position: "bottom",
      x_axis_label_mode: "relative",
      x_axis_ticks: 3,

      show_y_axis: false,
      show_y_axis_labels: true,
      y_axis_position: "left",
      y_axis_ticks: 2,

      // X-axis line settings
      x_axis_line_color: "var(--divider-color)",
      x_axis_line_width: 1,
      x_axis_line_opacity: 1,

      // Y-axis line settings
      y_axis_line_color: "var(--divider-color)",
      y_axis_line_width: 1,
      y_axis_line_opacity: 1,

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
      grid_line_style: "solid",

      // Whole-card background and surface settings
      background_color: "var(--card-background-color)",
      background_color_mode: "static",
      background_opacity: 1,

      card_radius: "var(--ha-card-border-radius, 12px)",
      card_padding: 16,

      card_border_width: 0,
      card_border_color: "var(--divider-color)",
      card_border_opacity: 0,

      card_shadow: false,
      card_shadow_color: "rgba(0, 0, 0, 0.25)",
      card_shadow_blur: 24,
      card_shadow_spread: 0,
      card_shadow_offset_x: 0,
      card_shadow_offset_y: 8,

      card_shine: false,
      card_shine_opacity: 0.12,
      card_shine_size: 55,
      card_shine_position: 0,
      card_shine_angle: 155,

      // Plot-area background settings
      plot_background_color: "transparent",
      plot_background_color_mode: "none",
      plot_background_opacity: 0,
      plot_background_radius: 8,

      // Band display settings
      show_bands: true,
      band_fill_mode: "stepped",
      band_opacity: 0.24,

      // Band separator settings
      show_band_separators: false,
      band_separator_color: "var(--divider-color)",
      band_separator_width: 1,
      band_separator_opacity: 0.5,
      band_separator_style: "dashed",

      band_label_mode: "label",
      band_label_unit: false,
      band_label_position: "top",
      band_label_align: "left",
      hide_small_band_labels: false,
      min_band_label_height: 18,

      // Band label settings
      band_label_layer: "below",
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

      line_outline: false,
      line_outline_color: "#ffffff",
      line_outline_width: 1,
      line_outline_opacity: 0.65,

      line_halo: false,
      line_halo_color: "#ffffff",
      line_halo_width: 8,
      line_halo_blur: 4,
      line_halo_opacity: 0.18,

      line_shadow: false,
      line_shadow_color: "rgba(0, 0, 0, 0.45)",
      line_shadow_blur: 6,
      line_shadow_offset_x: 0,
      line_shadow_offset_y: 2,
      line_shadow_opacity: 0.35,

      // Area appearance settings
      show_area: false,
      area_color: "var(--primary-color)",
      area_color_mode: "static",
      area_opacity: 0.18,

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
      marker_label_background_color: "#ffffff",
      marker_label_background_mode: "static",
      marker_label_background_opacity: 0.8,

      // Header visibility, slot, background, and text settings
      show_header: true,
      header_left: "name",
      header_center: "none",
      header_right: "duration",

      header_background_color: "transparent",
      header_background_color_mode: "static",
      header_background_opacity: 0,

      header_font_size: 16,
      header_font_weight: 600,
      header_opacity: 1,
      header_multiline: false,
      header_max_lines: 2,

      // Footer visibility, slot, background, and text settings
      show_footer: true,
      footer_left: "none",
      footer_center: "message",
      footer_right: "current",

      footer_background_color: "transparent",
      footer_background_color_mode: "static",
      footer_background_opacity: 0,

      footer_font_size: 14,
      footer_font_weight: 500,
      footer_opacity: 0.8,
      footer_multiline: false,
      footer_max_lines: 2,

      // Legacy ribbon slot settings
      // Kept aligned with header/footer defaults for backwards compatibility.
      top_left: "name",
      top_center: "none",
      top_right: "duration",
      bottom_left: "none",
      bottom_center: "message",
      bottom_right: "current",

      // Shared ribbon content settings
      custom_text: "",
      duration_format: "short",

      // Interaction settings
      tap_action: { action: "more-info" },
      hold_action: { action: "none" },
      double_tap_action: { action: "none" },

      // Legacy ribbon background settings
      // Kept aligned with header/footer defaults for backwards compatibility.
      top_ribbon_background_color: "transparent",
      top_ribbon_background_color_mode: "static",
      top_ribbon_background_opacity: 0,

      bottom_ribbon_background_color: "transparent",
      bottom_ribbon_background_color_mode: "static",
      bottom_ribbon_background_opacity: 0,

      ribbon_background_radius: 8,

      // Debug settings
      history_refresh_interval: 60,
      max_history_points: "auto",
      debug_level: "basic",
      debug_multiline: false,

      // Bands
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



    /*
      --------------------------------------------------------------------------
      Editor option lists
      --------------------------------------------------------------------------
      Shared dropdown options used by multiple editor sections.
    */
    const ribbonSlotOptions = [
      { value: "none", label: "None" },
      { value: "area", label: "Area" },
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

    const bandFillModeOptions = [
      { value: "stepped", label: "Stepped bands" },
      { value: "gradient", label: "Smooth gradient" },
    ];

    const lineColourModeOptions = [
      { value: "static", label: "Static colour" },
      { value: "band", label: "Use band colour" },
      { value: "gradient", label: "Smooth gradient" },
      { value: "none", label: "No colour / transparent" },
    ];

    const fontWeightOptions = [
      { value: 300, label: "Light" },
      { value: 400, label: "Regular" },
      { value: 500, label: "Medium" },
      { value: 600, label: "Semi-bold" },
      { value: 700, label: "Bold" },
    ];


    /*
      --------------------------------------------------------------------------
      Editor schema
      --------------------------------------------------------------------------
      Defines the expandable sections shown in the Home Assistant visual editor.
    */
    return {
      schema: [

        /*
          ----------------------------------------------------------------------
          Data & range section
          ----------------------------------------------------------------------
          Core data source, history source, graph height, y-axis range, and
          displayed value precision.
        */
        {
          type: "expandable",
          name: "data_range",
          title: "Data & range",
          icon: "mdi:chart-line",
          flatten: true,
          schema: [
            /*
              Source
            */
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

            /*
              History
            */
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
              name: "history_mode",
              selector: {
                select: {
                  mode: "dropdown",
                  options: [
                    { value: "auto", label: "Auto" },
                    { value: "raw", label: "Raw history" },
                    { value: "statistics", label: "Statistics" },
                    { value: "hybrid", label: "Hybrid" },
                  ],
                },
              },
            },
            {
              name: "statistics_type",
              selector: {
                select: {
                  mode: "dropdown",
                  options: [
                    { value: "mean", label: "Mean" },
                    { value: "min", label: "Minimum" },
                    { value: "max", label: "Maximum" },
                    { value: "last", label: "Last" },
                    { value: "state", label: "State" },
                  ],
                },
              },
            },
            {
              name: "statistics_period",
              selector: {
                select: {
                  mode: "dropdown",
                  options: [
                    { value: "5minute", label: "5 minutes" },
                    { value: "hour", label: "Hour" },
                    { value: "day", label: "Day" },
                    { value: "week", label: "Week" },
                    { value: "month", label: "Month" },
                  ],
                },
              },
            },
            {
              name: "hybrid_raw_hours",
              selector: {
                number: {
                  min: 1,
                  step: 1,
                  mode: "box",
                },
              },
            },

            /*
              Display range
            */
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
        /*
          ----------------------------------------------------------------------
          X-axis section
          ----------------------------------------------------------------------
          X-axis visibility, line position, label position, tick count, and
          styling.
        */
        {
          type: "expandable",
          name: "x_axis",
          title: "X-axis",
          icon: "mdi:axis-arrow",
          flatten: true,
          schema: [
            /*
              Visibility
            */
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

            /*
              Position and ticks
            */
            {
              name: "x_axis_position",
              selector: {
                select: {
                  mode: "dropdown",
                  options: [
                    { value: "bottom", label: "Bottom" },
                    { value: "top", label: "Top" },
                    { value: "zero", label: "Zero line" },
                  ],
                },
              },
            },
            {
              name: "x_axis_label_position",
              selector: {
                select: {
                  mode: "dropdown",
                  options: [
                    { value: "bottom", label: "Bottom" },
                    { value: "middle", label: "Middle" },
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

            /*
              Line style
            */
            {
              name: "x_axis_line_color",
              selector: {
                text: {},
              },
            },
            {
              name: "x_axis_line_width",
              selector: {
                number: {
                  min: 0,
                  max: 8,
                  step: 0.5,
                  mode: "slider",
                },
              },
            },
            {
              name: "x_axis_line_opacity",
              selector: {
                number: {
                  min: 0,
                  max: 1,
                  step: 0.05,
                  mode: "slider",
                },
              },
            },

            /*
              Label style
            */
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
        /*
          ----------------------------------------------------------------------
          Y-axis section
          ----------------------------------------------------------------------
          Y-axis visibility, position, tick count, and styling.
        */
        {
          type: "expandable",
          name: "y_axis",
          title: "Y-axis",
          icon: "mdi:axis-arrow",
          flatten: true,
          schema: [
            /*
              Visibility
            */
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

            /*
              Position and ticks
            */
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

            /*
              Line style
            */
            {
              name: "y_axis_line_color",
              selector: {
                text: {},
              },
            },
            {
              name: "y_axis_line_width",
              selector: {
                number: {
                  min: 0,
                  max: 8,
                  step: 0.5,
                  mode: "slider",
                },
              },
            },
            {
              name: "y_axis_line_opacity",
              selector: {
                number: {
                  min: 0,
                  max: 1,
                  step: 0.05,
                  mode: "slider",
                },
              },
            },

            /*
              Label style
            */
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
        /*
          ----------------------------------------------------------------------
          Grid section
          ----------------------------------------------------------------------
          Vertical and horizontal grid line visibility and styling.
        */
        {
          type: "expandable",
          name: "grid",
          title: "Grid",
          icon: "mdi:grid",
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
              name: "grid_line_style",
              selector: {
                select: {
                  mode: "dropdown",
                  options: [
                    { value: "solid", label: "Solid" },
                    { value: "dashed", label: "Dashed" },
                    { value: "dotted", label: "Dotted" },
                  ],
                },
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
        /*
          ----------------------------------------------------------------------
          Appearance section
          ----------------------------------------------------------------------
          Card surface, background, border, shadow, padding, and plot background
          styling.
        */
        {
          type: "expandable",
          name: "backgrounds",
          title: "Appearance",
          icon: "mdi:palette-outline",
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

            /*
              Card surface
            */
            {
              name: "card_radius",
              selector: {
                text: {},
              },
            },
            {
              name: "card_padding",
              selector: {
                number: {
                  min: 0,
                  max: 40,
                  step: 1,
                  mode: "slider",
                },
              },
            },

            /*
              Card border
            */
            {
              name: "card_border_width",
              selector: {
                number: {
                  min: 0,
                  max: 8,
                  step: 0.5,
                  mode: "slider",
                },
              },
            },
            {
              name: "card_border_color",
              selector: {
                text: {},
              },
            },
            {
              name: "card_border_opacity",
              selector: {
                number: {
                  min: 0,
                  max: 1,
                  step: 0.05,
                  mode: "slider",
                },
              },
            },

            /*
              Card shadow
            */
            {
              name: "card_shadow",
              selector: {
                boolean: {},
              },
            },
            {
              name: "card_shadow_color",
              selector: {
                text: {},
              },
            },
            {
              name: "card_shadow_blur",
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
              name: "card_shadow_spread",
              selector: {
                number: {
                  min: -20,
                  max: 40,
                  step: 1,
                  mode: "slider",
                },
              },
            },
            {
              name: "card_shadow_offset_x",
              selector: {
                number: {
                  min: -40,
                  max: 40,
                  step: 1,
                  mode: "slider",
                },
              },
            },
            {
              name: "card_shadow_offset_y",
              selector: {
                number: {
                  min: -40,
                  max: 40,
                  step: 1,
                  mode: "slider",
                },
              },
            },

            /*
              Card shine
            */
            {
              name: "card_shine",
              selector: {
                boolean: {},
              },
            },
            {
              name: "card_shine_opacity",
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
              name: "card_shine_size",
              selector: {
                number: {
                  min: 0,
                  max: 100,
                  step: 1,
                  mode: "slider",
                  unit_of_measurement: "%",
                },
              },
            },
            {
              name: "card_shine_position",
              selector: {
                number: {
                  min: 0,
                  max: 100,
                  step: 1,
                  mode: "slider",
                  unit_of_measurement: "%",
                },
              },
            },
            {
              name: "card_shine_angle",
              selector: {
                number: {
                  min: 0,
                  max: 360,
                  step: 5,
                  mode: "slider",
                  unit_of_measurement: "°",
                },
              },
            },


            /*
              Plot background
            */
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
        /*
          ----------------------------------------------------------------------
          Bands section
          ----------------------------------------------------------------------
          Band display, separator styling, and band label styling.
        */
        {
          type: "expandable",
          name: "bands",
          title: "Bands",
          icon: "mdi:format-color-fill",
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
              name: "band_fill_mode",
              selector: {
                select: {
                  mode: "dropdown",
                  options: bandFillModeOptions,
                },
              },
            },
            {
              name: "show_band_separators",
              selector: {
                boolean: {},
              },
            },
            {
              name: "band_separator_style",
              selector: {
                select: {
                  mode: "dropdown",
                  options: [
                    { value: "solid", label: "Solid" },
                    { value: "dashed", label: "Dashed" },
                    { value: "dotted", label: "Dotted" },
                  ],
                },
              },
            },
            {
              name: "band_separator_color",
              selector: {
                text: {},
              },
            },
            {
              name: "band_separator_width",
              selector: {
                number: {
                  min: 0,
                  max: 8,
                  step: 0.5,
                  mode: "slider",
                },
              },
            },
            {
              name: "band_separator_opacity",
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
                    { value: "label_range", label: "Label + range" },
                    { value: "label_threshold", label: "Label + threshold" },
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
              name: "band_label_layer",
              selector: {
                select: {
                  mode: "dropdown",
                  options: [
                    { value: "below", label: "Below line/area" },
                    { value: "above", label: "Above line/area" },
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
        /*
          ----------------------------------------------------------------------
          Band definitions section
          ----------------------------------------------------------------------
          Raw band array editor. This is the likely home for band templates.
        */
        {
          type: "expandable",
          name: "band_definitions",
          title: "Band definitions",
          icon: "mdi:tune-variant",
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
        /*
          ----------------------------------------------------------------------
          Line section
          ----------------------------------------------------------------------
          History line visibility, colour mode, colour, width, opacity, and
          premium line effects.
        */
        {
          type: "expandable",
          name: "line",
          title: "Line",
          icon: "mdi:chart-line",
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
                  options: lineColourModeOptions,
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

            /*
              Line outline
            */
            {
              name: "line_outline",
              selector: {
                boolean: {},
              },
            },
            {
              name: "line_outline_color",
              selector: {
                text: {},
              },
            },
            {
              name: "line_outline_width",
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
              name: "line_outline_opacity",
              selector: {
                number: {
                  min: 0,
                  max: 1,
                  step: 0.05,
                  mode: "slider",
                },
              },
            },

            /*
              Line halo
            */
            {
              name: "line_halo",
              selector: {
                boolean: {},
              },
            },
            {
              name: "line_halo_color",
              selector: {
                text: {},
              },
            },
            {
              name: "line_halo_width",
              selector: {
                number: {
                  min: 0,
                  max: 32,
                  step: 0.5,
                  mode: "slider",
                },
              },
            },
            {
              name: "line_halo_blur",
              selector: {
                number: {
                  min: 0,
                  max: 24,
                  step: 1,
                  mode: "slider",
                },
              },
            },
            {
              name: "line_halo_opacity",
              selector: {
                number: {
                  min: 0,
                  max: 1,
                  step: 0.05,
                  mode: "slider",
                },
              },
            },
            /*
              Line shadow
            */
            {
              name: "line_shadow",
              selector: {
                boolean: {},
              },
            },
            {
              name: "line_shadow_color",
              selector: {
                text: {},
              },
            },
            {
              name: "line_shadow_blur",
              selector: {
                number: {
                  min: 0,
                  max: 32,
                  step: 1,
                  mode: "slider",
                },
              },
            },
            {
              name: "line_shadow_offset_x",
              selector: {
                number: {
                  min: -24,
                  max: 24,
                  step: 1,
                  mode: "slider",
                },
              },
            },
            {
              name: "line_shadow_offset_y",
              selector: {
                number: {
                  min: -24,
                  max: 24,
                  step: 1,
                  mode: "slider",
                },
              },
            },
            {
              name: "line_shadow_opacity",
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
        /*
          ----------------------------------------------------------------------
          Area section
          ----------------------------------------------------------------------
          Area fill visibility, colour mode, colour, and opacity.
        */
        {
          type: "expandable",
          name: "area",
          title: "Area",
          icon: "mdi:chart-areaspline",
          flatten: true,
          schema: [
            {
              name: "show_area",
              selector: {
                boolean: {},
              },
            },
            {
              name: "area_color_mode",
              selector: {
                select: {
                  mode: "dropdown",
                  options: colourModeOptions,
                },
              },
            },
            {
              name: "area_color",
              selector: {
                text: {},
              },
            },
            {
              name: "area_opacity",
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
        /*
          ----------------------------------------------------------------------
          Markers section
          ----------------------------------------------------------------------
          Current, minimum, and maximum markers and marker label styling.
        */
        {
          type: "expandable",
          name: "markers",
          title: "Markers",
          icon: "mdi:map-marker-outline",
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
        /*
          ----------------------------------------------------------------------
          Header section
          ----------------------------------------------------------------------
          Header visibility, slot content, text styling, and background styling.
        */
        {
          type: "expandable",
          name: "header",
          title: "Header",
          icon: "mdi:page-layout-header",
          flatten: true,
          schema: [
            {
              name: "show_header",
              selector: {
                boolean: {},
              },
            },
            {
              name: "header_left",
              selector: {
                select: {
                  mode: "dropdown",
                  options: ribbonSlotOptions,
                },
              },
            },
            {
              name: "header_center",
              selector: {
                select: {
                  mode: "dropdown",
                  options: ribbonSlotOptions,
                },
              },
            },
            {
              name: "header_right",
              selector: {
                select: {
                  mode: "dropdown",
                  options: ribbonSlotOptions,
                },
              },
            },
            {
              name: "header_font_size",
              selector: {
                number: {
                  min: 8,
                  max: 32,
                  step: 1,
                  mode: "slider",
                },
              },
            },
            {
              name: "header_font_weight",
              selector: {
                select: {
                  mode: "dropdown",
                  options: fontWeightOptions,
                },
              },
            },
            {
              name: "header_color",
              selector: {
                text: {},
              },
            },
            {
              name: "header_color_mode",
              selector: {
                select: {
                  mode: "dropdown",
                  options: colourModeOptions,
                },
              },
            },
            {
              name: "header_opacity",
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
              name: "header_multiline",
              selector: {
                boolean: {},
              },
            },
            {
              name: "header_max_lines",
              selector: {
                number: {
                  min: 1,
                  max: 5,
                  step: 1,
                  mode: "slider",
                },
              },
            },
            {
              name: "header_background_color",
              selector: {
                text: {},
              },
            },
            {
              name: "header_background_color_mode",
              selector: {
                select: {
                  mode: "dropdown",
                  options: colourModeOptions,
                },
              },
            },
            {
              name: "header_background_opacity",
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
          ],
        },
        /*
          ----------------------------------------------------------------------
          Footer section
          ----------------------------------------------------------------------
          Footer visibility, slot content, text styling, and background styling.
        */
        {
          type: "expandable",
          name: "footer",
          title: "Footer",
          icon: "mdi:page-layout-footer",
          flatten: true,
          schema: [
            {
              name: "show_footer",
              selector: {
                boolean: {},
              },
            },
            {
              name: "footer_left",
              selector: {
                select: {
                  mode: "dropdown",
                  options: ribbonSlotOptions,
                },
              },
            },
            {
              name: "footer_center",
              selector: {
                select: {
                  mode: "dropdown",
                  options: ribbonSlotOptions,
                },
              },
            },
            {
              name: "footer_right",
              selector: {
                select: {
                  mode: "dropdown",
                  options: ribbonSlotOptions,
                },
              },
            },
            {
              name: "footer_font_size",
              selector: {
                number: {
                  min: 8,
                  max: 32,
                  step: 1,
                  mode: "slider",
                },
              },
            },
            {
              name: "footer_font_weight",
              selector: {
                select: {
                  mode: "dropdown",
                  options: fontWeightOptions,
                },
              },
            },
            {
              name: "footer_opacity",
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
              name: "footer_multiline",
              selector: {
                boolean: {},
              },
            },
            {
              name: "footer_max_lines",
              selector: {
                number: {
                  min: 1,
                  max: 5,
                  step: 1,
                  mode: "slider",
                },
              },
            },
            {
              name: "footer_background_color",
              selector: {
                text: {},
              },
            },
            {
              name: "footer_background_color_mode",
              selector: {
                select: {
                  mode: "dropdown",
                  options: colourModeOptions,
                },
              },
            },
            {
              name: "footer_background_opacity",
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
        /*
          ----------------------------------------------------------------------
          Interactions section
          ----------------------------------------------------------------------
          Tap, hold, and double-tap actions.
        */
        {
          type: "expandable",
          name: "interactions",
          title: "Interactions",
          icon: "mdi:gesture-tap",
          flatten: true,
          schema: [
            {
              name: "tap_action",
              selector: {
                ui_action: {
                  actions: ["more-info", "toggle", "navigate", "url", "call-service", "none"],
                },
              },
            },
            {
              name: "hold_action",
              selector: {
                ui_action: {
                  actions: ["more-info", "toggle", "navigate", "url", "call-service", "none"],
                },
              },
            },
            {
              name: "double_tap_action",
              selector: {
                ui_action: {
                  actions: ["more-info", "toggle", "navigate", "url", "call-service", "none"],
                },
              },
            },
          ],
        },
        /*
          ----------------------------------------------------------------------
          Advanced section
          ----------------------------------------------------------------------
          History refresh, point limiting, and debug/status output.
        */
        {
          type: "expandable",
          name: "advanced",
          title: "Advanced",
          icon: "mdi:cog-outline",
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
      /*
        ------------------------------------------------------------------------
        Editor field labels
        ------------------------------------------------------------------------
        Maps raw YAML property names to friendly labels in the visual editor.
      */
      computeLabel: (schema) => {
        const labels = {

          // Content
          entity: "Entity",
          name: "Name",
          hours_to_show: "Hours to show",
          height: "Fallback graph height",

          // Range
          y_min: "Y-axis minimum",
          y_max: "Y-axis maximum",
          value_decimals: "Value decimal places",

          // History
          history_mode: "History mode",
          statistics_type: "Statistics type",
          statistics_period: "Statistics period",
          hybrid_raw_hours: "Hybrid raw hours",

          // X-axis
          show_x_axis: "Show X-axis line",
          show_x_axis_labels: "Show X-axis labels",
          x_axis_position: "X-axis line position",
          x_axis_label_position: "X-axis label position",
          x_axis_label_mode: "X-axis label mode",
          x_axis_ticks: "X-axis ticks",
          x_axis_label_size: "X-axis label size",
          x_axis_label_weight: "X-axis label weight",
          x_axis_label_color: "X-axis label colour",
          x_axis_label_color_mode: "X-axis label colour mode",
          x_axis_label_opacity: "X-axis label opacity",
          x_axis_line_color: "X-axis line colour",
          x_axis_line_width: "X-axis line width",
          x_axis_line_opacity: "X-axis line opacity",

          // X-axis
          show_y_axis: "Show Y-axis line",
          show_y_axis_labels: "Show Y-axis labels",
          y_axis_position: "Y-axis position",
          y_axis_ticks: "Y-axis ticks",
          y_axis_label_size: "Y-axis label size",
          y_axis_label_weight: "Y-axis label weight",
          y_axis_label_color: "Y-axis label colour",
          y_axis_label_color_mode: "Y-axis label colour mode",
          y_axis_label_opacity: "Y-axis label opacity",
          y_axis_line_color: "Y-axis line colour",
          y_axis_line_width: "Y-axis line width",
          y_axis_line_opacity: "Y-axis line opacity",

          // Grid
          show_x_grid: "Show vertical grid lines",
          show_y_grid: "Show horizontal grid lines",
          grid_color: "Grid colour",
          grid_width: "Grid line width",
          grid_opacity: "Grid opacity",
          grid_line_style: "Grid line style",

          // Appearance
          background_color: "Card background colour",
          background_color_mode: "Card background colour mode",
          background_opacity: "Card background opacity",

          card_radius: "Card corner radius",
          card_padding: "Card padding",

          card_border_width: "Card border width",
          card_border_color: "Card border colour",
          card_border_opacity: "Card border opacity",

          card_shadow: "Show card shadow",
          card_shadow_color: "Card shadow colour",
          card_shadow_blur: "Card shadow blur",
          card_shadow_spread: "Card shadow spread",
          card_shadow_offset_x: "Card shadow horizontal offset",
          card_shadow_offset_y: "Card shadow vertical offset",

          card_shine: "Show card shine",
          card_shine_opacity: "Card shine opacity",
          card_shine_size: "Card shine size",
          card_shine_position: "Card shine position",
          card_shine_angle: "Card shine angle",

          plot_background_color: "Plot background colour",
          plot_background_color_mode: "Plot background colour mode",
          plot_background_opacity: "Plot background opacity",
          plot_background_radius: "Plot background corner radius",

          // Bands
          show_bands: "Show bands",
          band_opacity: "Band opacity",
          band_fill_mode: "Band fill mode",
          band_label_mode: "Band label mode",
          band_label_unit: "Show units in band labels",
          band_label_position: "Band label position",
          band_label_align: "Band label alignment",
          band_label_layer: "Band label layer",
          hide_small_band_labels: "Hide labels in small bands",
          min_band_label_height: "Minimum band label height",
          band_label_size: "Band label size",
          band_label_weight: "Band label weight",
          band_label_color: "Band label colour",
          band_label_color_mode: "Band label colour mode",
          band_label_opacity: "Band label opacity",
          bands: "Band definitions",

          // Band separators
          show_band_separators: "Show band separators",
          band_separator_style: "Band separator style",
          band_separator_color: "Band separator colour",
          band_separator_width: "Band separator width",
          band_separator_opacity: "Band separator opacity",

          // Line
          show_line: "Show line",
          line_color_mode: "Line colour mode",
          line_color: "Line colour",
          line_width: "Line width",
          line_opacity: "Line opacity",

          line_outline: "Show line outline",
          line_outline_color: "Line outline colour",
          line_outline_width: "Line outline width",
          line_outline_opacity: "Line outline opacity",

          line_halo: "Show line halo",
          line_halo_color: "Line halo colour",
          line_halo_width: "Line halo width",
          line_halo_blur: "Line halo blur",
          line_halo_opacity: "Line halo opacity",

          line_shadow: "Show line shadow",
          line_shadow_color: "Line shadow colour",
          line_shadow_blur: "Line shadow blur",
          line_shadow_offset_x: "Line shadow horizontal offset",
          line_shadow_offset_y: "Line shadow vertical offset",
          line_shadow_opacity: "Line shadow opacity",

          // Area
          show_area: "Show area",
          area_color_mode: "Area colour mode",
          area_color: "Area colour",
          area_opacity: "Area opacity",

          // Markers
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

          // Header
          show_header: "Show header",
          header_left: "Header left",
          header_center: "Header centre",
          header_right: "Header right",
          header_font_size: "Header text size",
          header_font_weight: "Header text weight",
          header_color: "Header text colour",
          header_color_mode: "Header text colour mode",
          header_opacity: "Header text opacity",
          header_multiline: "Allow multiline header text",
          header_max_lines: "Header maximum lines",
          header_background_color: "Header background colour",
          header_background_color_mode: "Header background colour mode",
          header_background_opacity: "Header background opacity",

          // Footer
          show_footer: "Show footer",
          footer_left: "Footer left",
          footer_center: "Footer centre",
          footer_right: "Footer right",
          footer_font_size: "Footer text size",
          footer_font_weight: "Footer text weight",
          footer_color: "Footer text colour",
          footer_color_mode: "Footer text colour mode",
          footer_opacity: "Footer text opacity",
          footer_multiline: "Allow multiline footer text",
          footer_max_lines: "Footer maximum lines",
          footer_background_color: "Footer background colour",
          footer_background_color_mode: "Footer background colour mode",
          footer_background_opacity: "Footer background opacity",

          // Shared header/footer fields
          custom_text: "Custom text",
          duration_format: "Duration format",
          ribbon_background_radius: "Header/footer background corner radius",

          // Interactions
          tap_action: "Tap behaviour",
          hold_action: "Hold behaviour",
          double_tap_action: "Double tap behaviour",

          // Legacy names retained for backwards compatibility if surfaced.
          top_left: "Header left",
          top_center: "Header centre",
          top_right: "Header right",
          bottom_left: "Footer left",
          bottom_center: "Footer centre",
          bottom_right: "Footer right",
          top_ribbon_background_color: "Header background colour",
          top_ribbon_background_color_mode: "Header background colour mode",
          top_ribbon_background_opacity: "Header background opacity",
          bottom_ribbon_background_color: "Footer background colour",
          bottom_ribbon_background_color_mode: "Footer background colour mode",
          bottom_ribbon_background_opacity: "Footer background opacity",

          // Advanced
          history_refresh_interval: "History refresh interval",
          max_history_points: "Max history points",
          debug_level: "Debug level",
          debug_multiline: "Debug multiline",
        };

        return labels[schema.name];
      },

      /*
        ------------------------------------------------------------------------
        Editor helper text
        ------------------------------------------------------------------------
        Maps raw YAML property names to explanatory helper text.
      */
      computeHelper: (schema) => {
        const helpers = {
          // Data & range: source
          entity:
            "Sensor, number, or input number to plot. The entity should have numeric states.",
          name:
            "Optional display name. If left blank, the entity ID is used.",

          // Data & range: history
          hours_to_show:
            "How much history to display. Longer windows can use statistics or hybrid history.",
          history_mode:
            "Choose the history source. Auto uses raw history for shorter windows and hybrid history for longer windows. Raw is detailed but usually limited by recorder retention. Statistics uses long-term statistics only. Hybrid combines older statistics with recent raw history.",
          statistics_type:
            "Statistic value to use for long-term statistics. Mean is usually best for environmental sensors.",
          statistics_period:
            "Time bucket used for long-term statistics. Hour is usually the best balance for longer charts.",
          hybrid_raw_hours:
            "Recent period fetched as raw high-resolution history when using hybrid or auto mode.",

          // Data & range: display
          height:
            "Fallback graph height in pixels. In resizable Sections layouts, grid rows can control the actual card height.",
          y_min:
            "Minimum value shown on the Y-axis.",
          y_max:
            "Maximum value shown on the Y-axis.",
          value_decimals:
            "Number of decimal places used for displayed values and labels. Auto uses fewer decimals for larger numbers.",

          // X-axis
          show_x_axis:
            "Show or hide the horizontal X-axis line. This does not control X-axis labels.",
          show_x_axis_labels: "Show or hide the time labels on the X-axis.",
          x_axis_position:
            "Place the X-axis line at the bottom, top, or zero point of the graph.",
          x_axis_label_position:
            "Place the X-axis labels at the bottom, middle, or top of the graph independently of the X-axis line.",
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
          x_axis_line_color:
            "CSS colour for the X-axis line, such as var(--divider-color), #111111, or rgba(0,0,0,0.5).",
          x_axis_line_width: "Thickness of the X-axis line.",
          x_axis_line_opacity: "Opacity of the X-axis line, from 0 to 1.",

          // Y-axis
          show_y_axis:
            "Show or hide the vertical Y-axis line. This does not control Y-axis labels.",
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
          y_axis_line_color:
            "CSS colour for the Y-axis line, such as var(--divider-color), #111111, or rgba(0,0,0,0.5).",
          y_axis_line_width: "Thickness of the Y-axis line.",
          y_axis_line_opacity: "Opacity of the Y-axis line, from 0 to 1.",

          // Grid
          show_x_grid:
            "Show vertical grid lines. The number of lines is controlled by X-axis ticks.",
          show_y_grid:
            "Show horizontal grid lines. The number of lines is controlled by Y-axis ticks.",
          grid_color:
            "CSS colour for grid lines, such as var(--divider-color), #999999, or rgba(0,0,0,0.2).",
          grid_width: "Thickness of the grid lines.",
          grid_opacity: "Opacity of the grid lines, from 0 to 1.",
          grid_line_style:
            "Choose whether grid lines are solid, dashed, or dotted.",

          // Appearance
          background_color:
            "CSS colour for the whole card background, such as var(--card-background-color), transparent, #222222, or rgba(0,0,0,0.2).",
          background_color_mode:
            "Static uses the chosen colour. Use band colour follows the band matching the current value. No colour makes the card background transparent.",
          background_opacity:
            "Opacity of the whole card background, from 0 to 1.",

          card_radius:
            "Corner radius for the whole card. Accepts CSS values such as 16px, 24px, or var(--ha-card-border-radius, 12px).",
          card_padding:
            "Inner spacing between the card edge and the chart content.",

          card_border_width:
            "Width of the card border. Use 0 for no border.",
          card_border_color:
            "CSS colour for the card border, such as var(--divider-color), #ffffff, or rgba(255,255,255,0.2).",
          card_border_opacity:
            "Opacity of the card border, from 0 to 1.",

          card_shadow:
            "Show or hide the card shadow.",
          card_shadow_color:
            "CSS colour for the card shadow, such as rgba(0,0,0,0.25).",
          card_shadow_blur:
            "Softness of the card shadow. Higher values create a larger, softer shadow.",
          card_shadow_spread:
            "Spread of the card shadow. Negative values pull the shadow in; positive values expand it.",
          card_shadow_offset_x:
            "Horizontal offset of the card shadow.",
          card_shadow_offset_y:
            "Vertical offset of the card shadow.",

          card_shine:
            "Show or hide a soft glass-style reflection across the card surface.",
          card_shine_opacity:
            "Opacity of the shine/reflection layer, from 0 to 1.",
          card_shine_size:
            "Size of the shine band as a percentage of the card surface.",
          card_shine_position:
            "Starting position of the shine band as a percentage across the card.",
          card_shine_angle:
            "Angle of the shine/reflection gradient in degrees.",

          plot_background_color:
            "CSS colour for the graph plotting area, such as transparent, var(--card-background-color), #222222, or rgba(0,0,0,0.2).",
          plot_background_color_mode:
            "Static uses the chosen colour. Use band colour follows the band matching the current value. No colour makes the plot background transparent.",
          plot_background_opacity:
            "Opacity of the plot background, from 0 to 1.",
          plot_background_radius:
            "Corner radius for the plot background area.",

          // Bands
          band_opacity: "Opacity for the coloured background bands, from 0 to 1.",
          band_fill_mode:
            "Choose whether band backgrounds are drawn as stepped threshold blocks or as a smooth vertical gradient between band colours.",
          band_label_mode:
            "Choose whether band labels show the label, range, threshold, label + range, label + threshold, or are hidden.",
          band_label_unit:
            "Add the entity unit to numeric band labels when using range or threshold mode.",
          band_label_position:
            "Place band labels near the top, middle, or bottom of each band.",
          band_label_align:
            "Align band labels inside the plot, or place them just outside the plot area.",
          band_label_layer:
            "Choose whether band labels are drawn below or above the line and area fill.",
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

          // Band Separators
          show_band_separators:
            "Draw separator lines at internal band thresholds.",
          band_separator_style:
            "Choose whether band separator lines are solid, dashed, or dotted.",
          band_separator_color:
            "CSS colour for band separator lines, such as var(--divider-color), #111111, or rgba(0,0,0,0.5).",
          band_separator_width:
            "Thickness of the band separator lines.",
          band_separator_opacity:
            "Opacity of the band separator lines, from 0 to 1.",

          // Line
          show_line: "Show or hide the plotted history line.",
          line_color_mode:
            "Static uses the chosen line colour. Use band colour creates stepped colour changes at band thresholds. Smooth gradient blends between band colours by value. No colour makes the line transparent.",
          line_color:
            "CSS colour for the line, such as var(--primary-color), #03a9f4, or rgb(3, 169, 244).",
          line_width: "Thickness of the plotted line.",
          line_opacity: "Opacity of the plotted line, from 0 to 1.",

          line_outline:
            "Draw a crisp outline underneath the plotted line to improve contrast against bands or busy backgrounds.",
          line_outline_color:
            "CSS colour for the line outline, such as rgba(0,0,0,0.45), #ffffff, or var(--card-background-color).",
          line_outline_width:
            "Extra width added around the plotted line for the outline effect.",
          line_outline_opacity:
            "Opacity of the line outline, from 0 to 1.",

          line_halo:
            "Draw a soft wider halo underneath the plotted line for a premium glow or contrast effect.",
          line_halo_color:
            "CSS colour for the line halo, such as #ffffff, rgba(255,255,255,0.5), or var(--primary-color).",
          line_halo_width:
            "Extra width added around the plotted line for the halo effect.",
          line_halo_blur:
            "Softness of the line halo. Higher values create a blurrier, more glow-like edge.",
          line_halo_opacity:
            "Opacity of the line halo, from 0 to 1.",

          line_shadow:
            "Draw a soft offset shadow underneath the plotted line to add depth.",
          line_shadow_color:
            "CSS colour for the line shadow, such as rgba(0,0,0,0.45).",
          line_shadow_blur:
            "Softness of the line shadow.",
          line_shadow_offset_x:
            "Horizontal offset of the line shadow.",
          line_shadow_offset_y:
            "Vertical offset of the line shadow.",
          line_shadow_opacity:
            "Opacity of the line shadow, from 0 to 1.",


          // Area
          show_area:
            "Show or hide the filled area for the plotted history data. The area can be shown even when the line itself is hidden.",
          area_color_mode:
            "Choose how the area fill colour is resolved. Static uses the configured area colour. Band mode will use configured band colours once banded area rendering is added.",
          area_color:
            "Colour used for the area fill when area colour mode is static.",
          area_opacity:
            "Opacity of the area fill. Lower values keep the history line, bands, grid, and axes easier to read.",

          // Markers
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
            "CSS colour for the background behind marker labels, such as #ffffff, var(--card-background-color), #222222, or rgba(0,0,0,0.2).",
          marker_label_background_mode:
            "Static uses the chosen colour. Card uses the card background colour. Use band colour follows the marker value's band. No background makes it transparent.",
          marker_label_background_opacity:
            "Opacity of the marker label background, from 0 to 1.",

          // Header
          show_header:
            "Show or hide the header without clearing the configured header slots.",
          header_left: "Choose what appears in the left position of the header.",
          header_center:
            "Choose what appears in the centre position of the header.",
          header_right:
            "Choose what appears in the right position of the header.",
          header_font_size: "Text size for all header slots.",
          header_font_weight: "Font weight for all header slots.",
          header_color:
            "CSS colour for header text, such as var(--primary-text-color), #ffffff, or rgba(255,255,255,0.85).",
          header_color_mode:
            "Static uses the chosen colour. Use band colour follows the band matching the current value. No colour makes the header text transparent.",
          header_opacity: "Opacity of header text, from 0 to 1.",
          header_multiline:
            "Allow eligible long-form header content, such as custom text, messages, and debug text, to wrap onto multiple lines. Compact values such as current, min, max, duration, and unit remain single-line.",
          header_max_lines:
            "Maximum number of lines allowed for eligible multiline header content.",
          header_background_color:
            "CSS colour for the header background, such as transparent, var(--card-background-color), #222222, or rgba(0,0,0,0.2).",
          header_background_color_mode:
            "Static uses the chosen colour. Use band colour follows the band matching the current value. No colour makes the header background transparent.",
          header_background_opacity:
            "Opacity of the header background, from 0 to 1.",

          // Footer
          show_footer:
            "Show or hide the footer without clearing the configured footer slots.",
          footer_left: "Choose what appears in the left position of the footer.",
          footer_center:
            "Choose what appears in the centre position of the footer.",
          footer_right:
            "Choose what appears in the right position of the footer.",
          footer_font_size: "Text size for all footer slots.",
          footer_font_weight: "Font weight for all footer slots.",
          footer_color:
            "CSS colour for footer text, such as var(--secondary-text-color), #ffffff, or rgba(255,255,255,0.72).",
          footer_color_mode:
            "Static uses the chosen colour. Use band colour follows the band matching the current value. No colour makes the footer text transparent.",
          footer_opacity: "Opacity of footer text, from 0 to 1.",
          footer_multiline:
            "Allow eligible long-form footer content, such as custom text, messages, and debug text, to wrap onto multiple lines. Compact values such as current, min, max, duration, and unit remain single-line.",
          footer_max_lines:
            "Maximum number of lines allowed for eligible multiline footer content.",
          footer_background_color:
            "CSS colour for the footer background, such as transparent, var(--card-background-color), #222222, or rgba(0,0,0,0.2).",
          footer_background_color_mode:
            "Static uses the chosen colour. Use band colour follows the band matching the current value. No colour makes the footer background transparent.",
          footer_background_opacity:
            "Opacity of the footer background, from 0 to 1.",

          // Shared header/footer fields
          custom_text:
            "Text used by any header or footer slot set to Custom text. Supports placeholders such as {area}, {name}, {current}, {band}, {unit}, {entity}, {min}, {max}, and {duration}.",
          duration_format:
            "Controls whether duration text is shown in short form, such as 24h, or long form, such as 24 hours.",
          ribbon_background_radius:
            "Corner radius for header and footer background areas.",

          // Interactions
          tap_action:
            "Action to run when the card is tapped.",
          hold_action:
            "Action to run when the card is pressed and held.",
          double_tap_action:
            "Action to run when the card is double tapped.",

          // Legacy helpers retained in case legacy fields are surfaced.
          top_left: "Choose what appears in the left position of the header.",
          top_center:
            "Choose what appears in the centre position of the header.",
          top_right: "Choose what appears in the right position of the header.",
          bottom_left:
            "Choose what appears in the left position of the footer.",
          bottom_center:
            "Choose what appears in the centre position of the footer.",
          bottom_right:
            "Choose what appears in the right position of the footer.",
          top_ribbon_background_color:
            "CSS colour for the header background, such as transparent, var(--card-background-color), #222222, or rgba(0,0,0,0.2).",
          top_ribbon_background_color_mode:
            "Static uses the chosen colour. Use band colour follows the band matching the current value. No colour makes the header background transparent.",
          top_ribbon_background_opacity:
            "Opacity of the header background, from 0 to 1.",
          bottom_ribbon_background_color:
            "CSS colour for the footer background, such as transparent, var(--card-background-color), #222222, or rgba(0,0,0,0.2).",
          bottom_ribbon_background_color_mode:
            "Static uses the chosen colour. Use band colour follows the band matching the current value. No colour makes the footer background transparent.",
          bottom_ribbon_background_opacity:
            "Opacity of the footer background, from 0 to 1.",

          // Advanced
          history_refresh_interval: "How often the card refreshes history data.",
          max_history_points: "Use auto, or enter a number to limit plotted history points.",
          debug_level:
            "Controls how much status information is shown when a header/footer slot uses debug or status.",
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

      The newer header/footer names are preferred for user-facing config, but
      older top/bottom ribbon names are still supported for backwards
      compatibility.
    */
    this.config = {
      // Allow unknown/future config options through for compatibility.
      // Known options below deliberately override this raw copy with resolved
      // defaults and backwards-compatible aliases.
      ...config,

      // Core card and data range settings
      name: config.name || config.entity,
      height: config.height ?? 180,
      hours_to_show: config.hours_to_show ?? 24,
      y_min: config.y_min ?? 0,
      y_max: config.y_max ?? 100,
      bands: config.bands || [],
      value_decimals: config.value_decimals ?? "auto",

      // Interaction settings
      tap_action: config.tap_action ?? { action: "more-info" },
      hold_action: config.hold_action ?? { action: "none" },
      double_tap_action: config.double_tap_action ?? { action: "none" },

      // Band display settings
      show_bands: config.show_bands ?? true,
      band_opacity: config.band_opacity ?? 0.28,
      band_fill_mode: config.band_fill_mode ?? "stepped",

      // Band separator settings
      show_band_separators: config.show_band_separators ?? false,
      band_separator_color: config.band_separator_color ?? "var(--divider-color)",
      band_separator_width: config.band_separator_width ?? 1,
      band_separator_opacity: config.band_separator_opacity ?? 0.5,
      band_separator_style: config.band_separator_style ?? "dashed",

      // Whole-card background and surface settings
      background_color: config.background_color ?? "var(--card-background-color)",
      background_opacity: config.background_opacity ?? 1,
      background_color_mode: config.background_color_mode ?? "static",

      card_radius: config.card_radius ?? "var(--ha-card-border-radius, 12px)",
      card_padding: config.card_padding ?? 16,

      card_border_width: config.card_border_width ?? 0,
      card_border_color: config.card_border_color ?? "var(--divider-color)",
      card_border_opacity: config.card_border_opacity ?? 0,

      card_shadow: config.card_shadow ?? false,
      card_shadow_color: config.card_shadow_color ?? "rgba(0, 0, 0, 0.25)",
      card_shadow_blur: config.card_shadow_blur ?? 24,
      card_shadow_spread: config.card_shadow_spread ?? 0,
      card_shadow_offset_x: config.card_shadow_offset_x ?? 0,
      card_shadow_offset_y: config.card_shadow_offset_y ?? 8,

      card_shine: config.card_shine ?? false,
      card_shine_opacity: config.card_shine_opacity ?? 0.08,
      card_shine_size: config.card_shine_size ?? 65,
      card_shine_position: config.card_shine_position ?? 0,
      card_shine_angle: config.card_shine_angle ?? 155,

      // Plot-area background settings
      // Default is transparent so the plot area does not appear as a dark block.
      plot_background_color: config.plot_background_color ?? "transparent",
      plot_background_opacity: config.plot_background_opacity ?? 0,
      plot_background_color_mode: config.plot_background_color_mode ?? "none",
      plot_background_radius: config.plot_background_radius ?? 8,

      // Header/footer visibility settings
      show_header: config.show_header ?? true,
      show_footer: config.show_footer ?? true,

      // Header background settings
      header_background_color:
        config.header_background_color ??
        config.top_ribbon_background_color ??
        "transparent",
      header_background_opacity:
        config.header_background_opacity ??
        config.top_ribbon_background_opacity ??
        0,
      header_background_color_mode:
        config.header_background_color_mode ??
        config.top_ribbon_background_color_mode ??
        "static",

      // Footer background settings
      footer_background_color:
        config.footer_background_color ??
        config.bottom_ribbon_background_color ??
        "transparent",
      footer_background_opacity:
        config.footer_background_opacity ??
        config.bottom_ribbon_background_opacity ??
        0,
      footer_background_color_mode:
        config.footer_background_color_mode ??
        config.bottom_ribbon_background_color_mode ??
        "static",

      // Legacy top/bottom ribbon background names used internally for now.
      top_ribbon_background_color:
        config.header_background_color ??
        config.top_ribbon_background_color ??
        "transparent",
      top_ribbon_background_opacity:
        config.header_background_opacity ??
        config.top_ribbon_background_opacity ??
        0,
      top_ribbon_background_color_mode:
        config.header_background_color_mode ??
        config.top_ribbon_background_color_mode ??
        "static",

      bottom_ribbon_background_color:
        config.footer_background_color ??
        config.bottom_ribbon_background_color ??
        "transparent",
      bottom_ribbon_background_opacity:
        config.footer_background_opacity ??
        config.bottom_ribbon_background_opacity ??
        0,
      bottom_ribbon_background_color_mode:
        config.footer_background_color_mode ??
        config.bottom_ribbon_background_color_mode ??
        "static",

      ribbon_background_radius: config.ribbon_background_radius ?? 8,
      ribbon_color_mode: config.ribbon_color_mode ?? "static",

      // Shared header/footer text styling.
      // These are the preferred UI-facing controls.
      header_font_size: config.header_font_size ?? 16,
      header_font_weight: config.header_font_weight ?? 600,
      header_color: config.header_color ?? "var(--primary-text-color)",
      header_color_mode: config.header_color_mode ?? "static",
      header_opacity: config.header_opacity ?? 1,

      footer_font_size: config.footer_font_size ?? 12,
      footer_font_weight: config.footer_font_weight ?? 500,
      footer_color: config.footer_color ?? "var(--secondary-text-color)",
      footer_color_mode: config.footer_color_mode ?? "static",
      footer_opacity: config.footer_opacity ?? 0.8,

      // Per-slot ribbon text styling.
      // Legacy per-slot options still override shared header/footer styling.
      top_left_font_size:
        config.top_left_font_size ?? config.header_font_size ?? 16,
      top_center_font_size:
        config.top_center_font_size ?? config.header_font_size ?? 16,
      top_right_font_size:
        config.top_right_font_size ?? config.header_font_size ?? 16,

      bottom_left_font_size:
        config.bottom_left_font_size ?? config.footer_font_size ?? 12,
      bottom_center_font_size:
        config.bottom_center_font_size ?? config.footer_font_size ?? 12,
      bottom_right_font_size:
        config.bottom_right_font_size ?? config.footer_font_size ?? 12,

      top_left_font_weight:
        config.top_left_font_weight ?? config.header_font_weight ?? 600,
      top_center_font_weight:
        config.top_center_font_weight ?? config.header_font_weight ?? 600,
      top_right_font_weight:
        config.top_right_font_weight ?? config.header_font_weight ?? 600,

      bottom_left_font_weight:
        config.bottom_left_font_weight ?? config.footer_font_weight ?? 500,
      bottom_center_font_weight:
        config.bottom_center_font_weight ?? config.footer_font_weight ?? 500,
      bottom_right_font_weight:
        config.bottom_right_font_weight ?? config.footer_font_weight ?? 500,

      top_left_color:
        config.top_left_color ?? config.header_color ?? "var(--primary-text-color)",
      top_center_color:
        config.top_center_color ?? config.header_color ?? "var(--primary-text-color)",
      top_right_color:
        config.top_right_color ?? config.header_color ?? "var(--primary-text-color)",

      bottom_left_color:
        config.bottom_left_color ?? config.footer_color ?? "var(--secondary-text-color)",
      bottom_center_color:
        config.bottom_center_color ?? config.footer_color ?? "var(--secondary-text-color)",
      bottom_right_color:
        config.bottom_right_color ?? config.footer_color ?? "var(--secondary-text-color)",

      top_left_color_mode:
        config.top_left_color_mode ?? config.header_color_mode ?? "static",
      top_center_color_mode:
        config.top_center_color_mode ?? config.header_color_mode ?? "static",
      top_right_color_mode:
        config.top_right_color_mode ?? config.header_color_mode ?? "static",

      bottom_left_color_mode:
        config.bottom_left_color_mode ?? config.footer_color_mode ?? "static",
      bottom_center_color_mode:
        config.bottom_center_color_mode ?? config.footer_color_mode ?? "static",
      bottom_right_color_mode:
        config.bottom_right_color_mode ?? config.footer_color_mode ?? "static",

      top_left_opacity:
        config.top_left_opacity ?? config.header_opacity ?? 1,
      top_center_opacity:
        config.top_center_opacity ?? config.header_opacity ?? 1,
      top_right_opacity:
        config.top_right_opacity ?? config.header_opacity ?? 1,

      bottom_left_opacity:
        config.bottom_left_opacity ?? config.footer_opacity ?? 0.8,
      bottom_center_opacity:
        config.bottom_center_opacity ?? config.footer_opacity ?? 0.8,
      bottom_right_opacity:
        config.bottom_right_opacity ?? config.footer_opacity ?? 0.8,

      // History fetching and downsampling settings
      max_history_points: config.max_history_points ?? "auto",
      history_refresh_interval: config.history_refresh_interval ?? 60,
      history_mode: config.history_mode ?? "auto",
      statistics_type: config.statistics_type ?? "mean",
      statistics_period: config.statistics_period ?? "hour",
      hybrid_raw_hours: config.hybrid_raw_hours ?? 240,

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

      line_outline: config.line_outline ?? false,
      line_outline_color: config.line_outline_color ?? "rgba(0, 0, 0, 0.45)",
      line_outline_width: config.line_outline_width ?? 1.5,
      line_outline_opacity: config.line_outline_opacity ?? 0.35,

      line_halo: config.line_halo ?? false,
      line_halo_color: config.line_halo_color ?? "#ffffff",
      line_halo_width: config.line_halo_width ?? 8,
      line_halo_blur: config.line_halo_blur ?? 4,
      line_halo_opacity: config.line_halo_opacity ?? 0.18,

      line_shadow: config.line_shadow ?? false,
      line_shadow_color: config.line_shadow_color ?? "rgba(0, 0, 0, 0.45)",
      line_shadow_blur: config.line_shadow_blur ?? 6,
      line_shadow_offset_x: config.line_shadow_offset_x ?? 0,
      line_shadow_offset_y: config.line_shadow_offset_y ?? 2,
      line_shadow_opacity: config.line_shadow_opacity ?? 0.35,

      // Area appearance settings
      show_area: config.show_area ?? false,
      area_color: config.area_color ?? "var(--primary-color)",
      area_color_mode: config.area_color_mode ?? "static",
      area_opacity: config.area_opacity ?? 0.18,

      // Grid-line settings
      show_x_grid: config.show_x_grid ?? false,
      show_y_grid: config.show_y_grid ?? false,
      grid_color: config.grid_color ?? "var(--divider-color)",
      grid_width: config.grid_width ?? 1,
      grid_opacity: config.grid_opacity ?? 0.35,
      grid_line_style: config.grid_line_style ?? "solid",

      // Band label settings
      band_label_mode: config.band_label_mode ?? "label",
      band_label_unit: config.band_label_unit ?? false,
      band_label_position: config.band_label_position ?? "top",
      band_label_align: config.band_label_align ?? "left",
      band_label_layer: config.band_label_layer ?? "below",
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

      // Marker label background settings
      // Default is a soft translucent white label chip for readability.
      marker_label_background_color:
        config.marker_label_background_color ?? "#ffffff",
      marker_label_background_opacity:
        config.marker_label_background_opacity ?? 0.8,
      marker_label_background_mode:
        config.marker_label_background_mode ?? "static",

      // Axis settings
      show_x_axis: config.show_x_axis ?? true,
      show_x_axis_labels: config.show_x_axis_labels ?? true,
      x_axis_position: config.x_axis_position ?? "bottom",
      x_axis_label_position:
        config.x_axis_label_position ?? config.x_axis_position ?? "bottom",
      x_axis_label_mode: config.x_axis_label_mode ?? "relative",
      x_axis_ticks: config.x_axis_ticks ?? 3,

      show_y_axis: config.show_y_axis ?? true,
      show_y_axis_labels: config.show_y_axis_labels ?? true,
      y_axis_position: config.y_axis_position ?? "left",
      y_axis_ticks: config.y_axis_ticks ?? 2,

      // X-axis line settings
      x_axis_line_color: config.x_axis_line_color ?? "var(--divider-color)",
      x_axis_line_width: config.x_axis_line_width ?? 1,
      x_axis_line_opacity: config.x_axis_line_opacity ?? 1,

      // Y-axis line settings
      y_axis_line_color: config.y_axis_line_color ?? "var(--divider-color)",
      y_axis_line_width: config.y_axis_line_width ?? 1,
      y_axis_line_opacity: config.y_axis_line_opacity ?? 1,

      // Shared axis label settings
      // Kept for backwards compatibility. New configs should prefer the separate
      // x_axis_label_* and y_axis_label_* options below.
      axis_label_size: config.axis_label_size ?? 11,
      axis_label_weight: config.axis_label_weight ?? 400,
      axis_label_color: config.axis_label_color ?? "var(--secondary-text-color)",
      axis_label_color_mode: config.axis_label_color_mode ?? "static",
      axis_label_opacity: config.axis_label_opacity ?? 0.8,

      // X-axis label settings
      // x_axis_label_position is deliberately separate from x_axis_position so
      // the axis line can sit at zero while labels remain at the top, middle, or
      // bottom of the plot.
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

      // Preferred header/footer slot settings
      header_left: config.header_left ?? config.top_left ?? "name",
      header_center: config.header_center ?? config.top_center ?? "none",
      header_right: config.header_right ?? config.top_right ?? "current",

      footer_left: config.footer_left ?? config.bottom_left ?? "none",
      footer_center: config.footer_center ?? config.bottom_center ?? "none",
      footer_right: config.footer_right ?? config.bottom_right ?? "none",

      // Legacy top/bottom ribbon slot settings used internally for now.
      top_left: config.header_left ?? config.top_left ?? "name",
      top_center: config.header_center ?? config.top_center ?? "none",
      top_right: config.header_right ?? config.top_right ?? "current",

      bottom_left: config.footer_left ?? config.bottom_left ?? "none",
      bottom_center: config.footer_center ?? config.bottom_center ?? "none",
      bottom_right: config.footer_right ?? config.bottom_right ?? "none",

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
      that setting onto the newer header/footer slot system while also keeping the
      legacy top/bottom slot names in sync for the current renderer.
    */
    if (this.config.current_position) {
      const currentPosition = String(this.config.current_position).replace("-", "_");

      this.config.header_left = "name";
      this.config.header_center = "none";
      this.config.header_right = "none";
      this.config.footer_left = "none";
      this.config.footer_center = "none";
      this.config.footer_right = "none";

      if (this.config.show_current && this.config.current_position !== "hidden") {
        if (
          [
            "header_left",
            "header_center",
            "header_right",
            "footer_left",
            "footer_center",
            "footer_right",
          ].includes(currentPosition)
        ) {
          this.config[currentPosition] = "current";
        } else if (
          [
            "top_left",
            "top_center",
            "top_right",
            "bottom_left",
            "bottom_center",
            "bottom_right",
          ].includes(currentPosition)
        ) {
          const mappedPosition = currentPosition
            .replace("top_", "header_")
            .replace("bottom_", "footer_");

          this.config[mappedPosition] = "current";
        }
      }

      if (!["top-left", "bottom-left", "header-left", "footer-left"].includes(this.config.current_position)) {
        this.config.header_left = "name";
      }

      // Keep legacy internal slot names aligned with the newer header/footer names.
      this.config.top_left = this.config.header_left;
      this.config.top_center = this.config.header_center;
      this.config.top_right = this.config.header_right;

      this.config.bottom_left = this.config.footer_left;
      this.config.bottom_center = this.config.footer_center;
      this.config.bottom_right = this.config.footer_right;
    }
    /*
      --------------------------------------------------------------------------
      Runtime state
      --------------------------------------------------------------------------
      These are internal values, not user-facing config. They track fetched history,
      performance/debug information, render statistics, measured layout size, and
      stable per-card IDs used by SVG definitions.
    */

    /*
      --------------------------------------------------------------------------
      Stable card instance ID
      --------------------------------------------------------------------------
      Used for SVG definitions such as clip paths.

      SVG IDs are document-level references, so every card instance needs a
      genuinely unique ID. Keep this stable across config updates so re-rendering
      the same card does not constantly change its internal SVG references.
    */
    if (!SimpleBandGraphCard._nextInstanceId) {
      SimpleBandGraphCard._nextInstanceId = 1;
    }

    this._instanceId =
      this._instanceId ||
      `sbgc-${SimpleBandGraphCard._nextInstanceId++}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;

    /*
      --------------------------------------------------------------------------
      Runtime state
      --------------------------------------------------------------------------
      Stores fetched history, render/debug counters, responsive sizing state, and
      cached Home Assistant lookup information.
    */

    // History state
    this._history = [];
    this._rawHistoryCount = 0;
    this._plottedHistoryCount = 0;
    this._historyKey = "";
    this._isFetchingHistory = false;
    this._lastHistoryFetch = null;

    // History request/debug timing
    this._lastFetchDurationMs = null;
    this._lastHistoryApiDurationMs = null;
    this._lastDownsampleDurationMs = null;
    this._lastRenderDurationMs = null;
    this._lastWasDownsampled = false;
    this._lastRequestMode = "full history request";

    // History window/debug metadata
    this._lastHistoryStartTime = null;
    this._lastHistoryEndTime = null;
    this._lastHistoryFirstPointTime = null;
    this._lastHistoryLastPointTime = null;

    this._lastStatisticsHistoryCount = 0;
    this._lastRawHistoryCount = 0;
    this._lastMergedHistoryCount = 0;

    this._lastStatisticsFirstPointTime = null;
    this._lastStatisticsLastPointTime = null;
    this._lastRawFirstPointTime = null;
    this._lastRawLastPointTime = null;

    // Render/debug counters
    this._lastRawPlotDataCount = 0;
    this._lastPlotDataCount = 0;
    this._lastLineSegmentCount = 0;
    this._lastLineSplitSegmentCount = 0;
    this._lastLinePathCount = 0;
    this._renderCount = 0;
    this._lastRenderKey = null;

    // Responsive layout state
    this._cardWidth = 600;
    this._cardHeight = null;

    this._plotWidth = 600;
    this._plotHeight = Number(this.config.height) || 180;

    this._resizeObserver = null;
    this._plotResizeObserver = null;
    this._resizeRenderQueued = false;

    // Home Assistant area lookup state
    this._areaName = "";
    this._areaLookupEntity = "";
    this._areaLookupDone = false;
    this._areaResolveKey = "";
  }

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

      if (!measuredWidth || !measuredHeight) {
        return;
      }

      const widthChanged =
        Math.abs(measuredWidth - this._cardWidth) >= 2;

      const heightChanged =
        Math.abs(measuredHeight - Number(this._cardHeight || 0)) >= 2;

      if (!widthChanged && !heightChanged) {
        return;
      }

      this._cardWidth = measuredWidth;
      this._cardHeight = measuredHeight;

      /*
        A host resize changes the available layout space even when entity state
        and history have not changed.
      */
      this._lastRenderKey = null;

      this._scheduleResponsiveRender();
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

      if (!measuredPlotWidth || !measuredPlotHeight) {
        return;
      }

      const plotWidthChanged =
        Math.abs(measuredPlotWidth - this._plotWidth) >= 2;

      const plotHeightChanged =
        Math.abs(measuredPlotHeight - this._plotHeight) >= 2;

      if (!plotWidthChanged && !plotHeightChanged) {
        return;
      }

      this._plotWidth = measuredPlotWidth;
      this._plotHeight = measuredPlotHeight;

      /*
        A plot-area resize changes the SVG layout even when entity state and
        history have not changed.
      */
      this._lastRenderKey = null;

      this._scheduleResponsiveRender();
    });

    this._plotResizeObserver.observe(plotWrap);
  }

  _scheduleResponsiveRender() {
    if (!this._hass || this._resizeRenderQueued) {
      return;
    }

    this._resizeRenderQueued = true;

    requestAnimationFrame(() => {
      this._resizeRenderQueued = false;

      /*
        The card may have been disconnected or reconfigured between the resize
        event and the animation frame. Bail safely if it is no longer renderable.
      */
      if (!this.isConnected || !this._hass || !this.config?.entity) {
        return;
      }

      /*
        Responsive layout changes affect the SVG even when entity state/history
        has not changed, so make sure the guarded render flow cannot skip this.
      */
      this._lastRenderKey = null;

      this.render();
    });
  }

  set hass(hass) {
    this._hass = hass;

    if (!this.config?.entity) {
      return;
    }

    /*
      Resolve the Home Assistant area for the configured entity.

      This only needs to be requested when the configured entity changes. The
      resolver itself may also cache internally, but this guard avoids repeatedly
      starting the same async lookup on every Home Assistant state update.
    */
    if (this._areaResolveKey !== this.config.entity) {
      this._areaResolveKey = this.config.entity;
      this._resolveAreaName();
    }

    const entityState = hass.states?.[this.config.entity];

    /*
      Include every option that affects the fetched history in the history key.
      This ensures history is refetched when changing source mode, statistics
      settings, hybrid raw window, or point limit.
    */
    const historyKey = [
      this.config.entity,
      this.config.hours_to_show,
      this.config.max_history_points,
      this.config.history_mode,
      this.config.statistics_type,
      this.config.statistics_period,
      this.config.hybrid_raw_hours,
    ].join("-");

    const refreshIntervalMs =
      Number(this.config.history_refresh_interval) * 1000 || 60000;

    const historyIsStale =
      !this._lastHistoryFetch ||
      Date.now() - this._lastHistoryFetch.getTime() > refreshIntervalMs;

    const shouldFetchHistory =
      (this._historyKey !== historyKey || historyIsStale) &&
      !this._isFetchingHistory;

    if (shouldFetchHistory) {
      this._historyKey = historyKey;
      this.fetchHistory();
    }

    /*
      Home Assistant calls this setter very frequently, including for unrelated
      entity updates. Avoid rebuilding the full card unless something relevant
      to this card has actually changed.
    */
    const renderKey = [
      historyKey,
      entityState?.state ?? "unknown",
      entityState?.last_changed ?? "",
      entityState?.attributes?.unit_of_measurement ?? "",
      entityState?.attributes?.friendly_name ?? "",
      this._areaName || "",
      this._lastHistoryFetch?.getTime() || 0,
      this._isFetchingHistory ? "fetching" : "idle",
    ].join("|");

    if (renderKey !== this._lastRenderKey) {
      this._lastRenderKey = renderKey;
      this.render();
    }
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
    if (!Array.isArray(points) || points.length === 0) {
      return [];
    }

    if (!Number.isFinite(maxPoints) || points.length <= maxPoints) {
      return points;
    }

    const targetPoints = Math.max(2, Math.floor(maxPoints));

    if (targetPoints <= 2) {
      return [points[0], points[points.length - 1]];
    }

    const result = [points[0]];
    const lastIndex = points.length - 1;

    /*
      Use min/max pairs per bucket to preserve the visible shape of the chart.

      This avoids creating temporary bucket arrays with slice(), which matters
      for long histories and repeated refreshes.
    */
    const bucketCount = Math.max(1, Math.floor((targetPoints - 2) / 2));
    const bucketSize = (points.length - 2) / bucketCount;

    for (let bucketIndex = 0; bucketIndex < bucketCount; bucketIndex += 1) {
      const startIndex = Math.floor(1 + bucketIndex * bucketSize);
      const endIndex = Math.min(
        lastIndex,
        Math.floor(1 + (bucketIndex + 1) * bucketSize)
      );

      if (startIndex >= endIndex) continue;

      let minPoint = points[startIndex];
      let maxPoint = points[startIndex];

      for (let index = startIndex + 1; index < endIndex; index += 1) {
        const point = points[index];

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

    result.push(points[lastIndex]);

    /*
      Remove duplicate timestamps while preserving order.

      The input is already sorted, and buckets are processed in time order, so we
      do not need to sort again here. Avoiding sort() keeps this cheaper.
    */
    const deduped = [];
    let lastTime = null;

    for (const point of result) {
      if (!point || point.time === lastTime) continue;

      deduped.push(point);
      lastTime = point.time;
    }

    return deduped;
  }

  /*
    ============================================================================
    HISTORY FETCHING
    ============================================================================
    Pulls historical state from Home Assistant, parses numeric values,
    downsamples where required, and stores debug/performance metadata.

    Supported modes:
    - raw: current high-resolution recorder history via REST.
    - statistics: long-term recorder statistics via websocket.
    - hybrid: long-term statistics for older data, raw recorder history for the
      recent period.
    - auto: raw when the requested window is within hybrid_raw_hours, otherwise
      hybrid.

    Long-term statistics are lower resolution, usually hourly, and only work for
    entities that Home Assistant records as statistics.
  */
  async fetchHistory() {
    this._isFetchingHistory = true;

    const fetchStarted = performance.now();

    const hoursToShow = Number(this.config.hours_to_show);

    const end = new Date();
    const start = new Date(end.getTime() - hoursToShow * 60 * 60 * 1000);

    this._lastHistoryStartTime = start.getTime();
    this._lastHistoryEndTime = end.getTime();

    try {
      const maxHistoryPoints = this.getMaxHistoryPoints();

      this._lastStatisticsHistoryCount = 0;
      this._lastRawHistoryCount = 0;
      this._lastMergedHistoryCount = 0;

      this._lastStatisticsFirstPointTime = null;
      this._lastStatisticsLastPointTime = null;
      this._lastRawFirstPointTime = null;
      this._lastRawLastPointTime = null;

      const configuredHistoryMode = this.config.history_mode || "auto";
      const hybridRawHours = Number(this.config.hybrid_raw_hours) || 240;

      const resolvedHistoryMode =
        configuredHistoryMode === "auto"
          ? hoursToShow > hybridRawHours
            ? "hybrid"
            : "raw"
          : configuredHistoryMode;

      this._lastConfiguredHistoryMode = configuredHistoryMode;
      this._lastResolvedHistoryMode = resolvedHistoryMode;

      let rawHistory = [];

      if (resolvedHistoryMode === "statistics") {
        this._lastRequestMode = "statistics history request";
        rawHistory = await this._fetchStatisticsHistory(start, end);
      } else if (resolvedHistoryMode === "hybrid") {
        this._lastRequestMode = "hybrid history request";
        rawHistory = await this._fetchHybridHistory(start, end);
      } else {
        this._lastRequestMode = "full history request";
        rawHistory = await this._fetchRawHistory(start, end);
      }

      this._rawHistoryCount = rawHistory.length;

      this._lastHistoryFirstPointTime = rawHistory[0]?.time || null;
      this._lastHistoryLastPointTime =
        rawHistory[rawHistory.length - 1]?.time || null;

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

      this._lastStatisticsHistoryCount = 0;
      this._lastRawHistoryCount = 0;
      this._lastMergedHistoryCount = 0;

      this._lastStatisticsFirstPointTime = null;
      this._lastStatisticsLastPointTime = null;
      this._lastRawFirstPointTime = null;
      this._lastRawLastPointTime = null;

      this._lastRawPlotDataCount = 0;
      this._lastPlotDataCount = 0;
      this._lastLineSegmentCount = 0;
      this._lastLineSplitSegmentCount = 0;
      this._lastLinePathCount = 0;
    }

    this._isFetchingHistory = false;
    this.render();
  }

  async _fetchRawHistory(start, end) {
    const entityId = this.config.entity;

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
      .filter((item) => Number.isFinite(item.state) && Number.isFinite(item.time))
      .sort((a, b) => a.time - b.time);

    this._lastRawHistoryCount = rawHistory.length;
    this._lastRawFirstPointTime = rawHistory[0]?.time || null;
    this._lastRawLastPointTime =
      rawHistory[rawHistory.length - 1]?.time || null;

    return rawHistory;
  }

  async _fetchStatisticsHistory(start, end) {
    const entityId = this.config.entity;
    const statisticsType = this.config.statistics_type || "mean";
    const statisticsPeriod = this.config.statistics_period || "hour";

    const apiStarted = performance.now();

    if (!this._hass?.callWS) {
      throw new Error("Home Assistant websocket callWS is not available.");
    }

    const statistics = await this._hass.callWS({
      type: "recorder/statistics_during_period",
      start_time: start?.toISOString(),
      end_time: end?.toISOString(),
      statistic_ids: [entityId],
      period: statisticsPeriod,
    });

    this._lastHistoryApiDurationMs = Math.round(performance.now() - apiStarted);

    const rows =
      statistics && Array.isArray(statistics[entityId])
        ? statistics[entityId]
        : [];

    const statisticsHistory = rows
      .map((item) => {
        const value =
          item[statisticsType] ??
          item.mean ??
          item.state ??
          item.last ??
          item.max ??
          item.min;

        const timestamp =
          item.start || item.start_time || item.end || item.end_time;

        return {
          state: Number(value),
          time: new Date(timestamp).getTime(),
        };
      })
      .filter((item) => Number.isFinite(item.state) && Number.isFinite(item.time))
      .sort((a, b) => a.time - b.time);

    this._lastStatisticsHistoryCount = statisticsHistory.length;
    this._lastStatisticsFirstPointTime = statisticsHistory[0]?.time || null;
    this._lastStatisticsLastPointTime =
      statisticsHistory[statisticsHistory.length - 1]?.time || null;

    return statisticsHistory;
  }

  async _fetchHybridHistory(start, end) {
    const requestedStartTime = start.getTime();
    const endTime = end.getTime();

    const rawHours = Number(this.config.hybrid_raw_hours) || 240;
    const rawStart = new Date(endTime - rawHours * 60 * 60 * 1000);

    const safeRawStart =
      rawStart.getTime() > requestedStartTime ? rawStart : start;

    const statisticsEnd = new Date(safeRawStart.getTime());

    let statisticsHistory = [];
    let rawHistory = [];

    if (statisticsEnd.getTime() > requestedStartTime) {
      try {
        statisticsHistory = await this._fetchStatisticsHistory(start, statisticsEnd);
      } catch (error) {
        console.warn(
          "Simple Band Graph Card: statistics history unavailable, falling back to raw history only",
          error
        );
        statisticsHistory = [];
      }
    }

    rawHistory = await this._fetchRawHistory(safeRawStart, end);

    const rawFirstTime = rawHistory[0]?.time || safeRawStart.getTime();

    const trimmedStatistics = statisticsHistory.filter(
      (item) => item.time < rawFirstTime
    );

    const mergedHistory = [...trimmedStatistics, ...rawHistory]
      .filter((item) => Number.isFinite(item.state) && Number.isFinite(item.time))
      .sort((a, b) => a.time - b.time);

    this._lastMergedHistoryCount = mergedHistory.length;

    return mergedHistory;
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

    if (!this._hass || !this.config?.entity) {
      return;
    }

    this._renderCount = (this._renderCount || 0) + 1;

    /*
      --------------------------------------------------------------------------
      Entity state and basic card dimensions
      --------------------------------------------------------------------------
    */
    const entityId = this.config.entity;
    const state = this._hass.states?.[entityId];

    const name = this.config.name || entityId;
    const rawValue = state ? Number(state.state) : NaN;
    const value = state ? state.state : "unknown";
    const unit = state?.attributes?.unit_of_measurement || "";

    /*
      Width should follow the rendered plot wrapper so the SVG viewBox matches
      the available card width.

      Height has two modes:

      1. Normal mode
         The configured height is used as the graph height. This keeps cards
         stable in stacks, grids, editor previews, and masonry-style layouts.

      2. Explicit Sections row mode
         If the user has explicitly set grid_options.rows in YAML, Home Assistant
         is being asked to allocate a specific dashboard height. In that case,
         measured plot height can drive the SVG height so the graph can fill the
         allocated rows.

      Important: row-fill mode should only activate when grid_options.rows is
      genuinely present in the card YAML. It should not activate just because
      Home Assistant Sections has inferred or assigned row sizing.
    */
    const configuredHeight = Number(this.config.height) || 180;

    const hasExplicitGridRows =
      this.config &&
      Object.prototype.hasOwnProperty.call(this.config, "grid_options") &&
      this.config.grid_options &&
      typeof this.config.grid_options === "object" &&
      Object.prototype.hasOwnProperty.call(this.config.grid_options, "rows") &&
      Number.isFinite(Number(this.config.grid_options.rows)) &&
      Number(this.config.grid_options.rows) > 0;

    const measuredPlotWidth = Number(this._plotWidth);
    const measuredPlotHeight = Number(this._plotHeight);
    const measuredCardWidth = Number(this._cardWidth);

    /*
      Keep the SVG viewBox close to the actual rendered width.

      Avoid a large minimum width here. If the viewBox is wider than the actual
      rendered card, SVG text gets horizontally compressed, which makes axis,
      marker, and band labels look squashed in narrow cards.
    */
    const width =
      Number.isFinite(measuredPlotWidth) && measuredPlotWidth > 0
        ? Math.max(80, Math.round(measuredPlotWidth))
        : Number.isFinite(measuredCardWidth) && measuredCardWidth > 0
          ? Math.max(80, Math.round(measuredCardWidth))
          : 600;

    /*
      In explicit grid row mode, use the measured plot height once available.
      Otherwise, use the configured fallback graph height.
    */
    const height =
      hasExplicitGridRows &&
      Number.isFinite(measuredPlotHeight) &&
      measuredPlotHeight > 0
        ? Math.max(40, Math.round(measuredPlotHeight))
        : configuredHeight;

    /*
      In normal mode, the plot wrapper keeps a real minimum height. In explicit
      grid row mode, the parent grid is allowed to control the vertical space.
    */
    const plotWrapMinHeight = hasExplicitGridRows ? 0 : configuredHeight;

    /*
      Stable SVG clip path ID for this card instance.

      Used to clip plot-area content, such as background bands, to the same
      rounded rectangle as the plot background.
    */
    const plotClipPathId = `${this._instanceId}-plot-clip`;
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
      const numericValue = Number(number);

      if (!Number.isFinite(numericValue)) {
        return "";
      }

      const formatted = formatValue(numericValue);
      const unitText = this.config.band_label_unit && unit ? unit : "";

      return `${formatted}${suffix}${unitText}`;
    };

    const formatBandLabel = (band) => {
      if (!band) return "";

      const mode = this.config.band_label_mode || "label";
      const label = band.label || "";

      if (mode === "hide" || mode === "none") {
        return "";
      }

      const from = Number(band.from);
      const to = Number(band.to);

      const fromText = formatBandValue(from);
      const toText = formatBandValue(to);

      const thresholdText = Number.isFinite(from)
        ? formatBandValue(from, "+")
        : Number.isFinite(to)
          ? formatBandValue(to)
          : "";

      const rangeText =
        fromText && toText
          ? `${fromText}–${toText}`
          : fromText
            ? `${fromText}+`
            : toText
              ? `≤${toText}`
              : "";

      if (mode === "label") {
        return label;
      }

      if (mode === "range") {
        return rangeText;
      }

      if (mode === "threshold") {
        return thresholdText;
      }

      if (mode === "label_range") {
        return [label, rangeText].filter(Boolean).join(" · ");
      }

      if (mode === "label_threshold") {
        return [label, thresholdText].filter(Boolean).join(" · ");
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

    const normaliseYAxisPosition = (position, fallback = "left") => {
      if (position === "right") return "right";
      if (position === "left") return "left";
      return fallback;
    };

    const normaliseXAxisPosition = (position, fallback = "bottom") => {
      if (position === "top") return "top";
      if (position === "zero") return "zero";
      if (position === "bottom") return "bottom";
      return fallback;
    };

    const normaliseXAxisLabelPosition = (position, fallback = "bottom") => {
      if (position === "top") return "top";
      if (position === "middle") return "middle";
      if (position === "bottom") return "bottom";
      return fallback;
    };

    const bandLabelAlign = normaliseBandLabelAlign(this.config.band_label_align);
    const yAxisPosition = normaliseYAxisPosition(this.config.y_axis_position, "left");
    const xAxisPosition = normaliseXAxisPosition(this.config.x_axis_position, "bottom");
    const xAxisLabelPosition = normaliseXAxisLabelPosition(
      this.config.x_axis_label_position,
      "bottom"
    );
    /*
      --------------------------------------------------------------------------
      Layout measurements and padding
      --------------------------------------------------------------------------
      Calculates how much room is needed around the plot for axes and outside band
      labels before deriving the final plot rectangle.

      X-axis line position and X-axis label position are deliberately separate.
      Padding follows the label position, not the line position, so the X-axis
      line can sit at zero without forcing labels into the middle of the plot.
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
      this.config.show_x_axis_labels && xAxisLabelPosition === "top"
        ? xAxisLabelPadding
        : 14;

    const baseBottomPadding =
      this.config.show_x_axis_labels && xAxisLabelPosition === "bottom"
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

    const layoutDebug = {
      measuredPlotWrapWidth: this._plotWidth,
      measuredPlotWrapHeight: this._plotHeight,
      svgWidth: width,
      svgHeight: height,
      innerPlotWidth: plotWidth,
      innerPlotHeight: plotHeight,
      configuredHeight: Number(this.config.height) || 0,
      plotWrapMinHeight,
      paddingTop: padding.top,
      paddingRight: padding.right,
      paddingBottom: padding.bottom,
      paddingLeft: padding.left,
      baseTopPadding,
      baseRightPadding,
      baseBottomPadding,
      baseLeftPadding,
      yAxisLabelPadding,
      xAxisLabelPadding,
      hasOutsideLeftBandLabels,
      hasOutsideRightBandLabels,
      bandLabelOutsideWidth,
      calculatedOutsideWidth,
      longestBandLabelWidth,
      bandLabelTextCount: bandLabelTexts.filter(Boolean).length,
      bandLabelTexts: bandLabelTexts.filter(Boolean).join(" | "),
      bandLabelMode: this.config.band_label_mode,
      bandLabelAlign: this.config.band_label_align,
      bandLabelPosition: this.config.band_label_position,
      showXAxis: this.config.show_x_axis,
      showXAxisLabels: this.config.show_x_axis_labels,
      xAxisPosition,
      xAxisLabelPosition,
      showYAxis: this.config.show_y_axis,
      showYAxisLabels: this.config.show_y_axis_labels,
      yAxisPosition,
    };

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
      Uses fetched history, appends the current state if the latest history point
      is not already effectively current, then reduces the plotted dataset before
      SVG path generation, extrema detection, marker rendering, and band/area
      splitting.

      This keeps long-history charts cheaper to render while preserving the first
      and latest points.
    */
    const rawPlotData = [...this._history];

    const latestHistoryPoint = rawPlotData[rawPlotData.length - 1];
    const latestHistoryIsCurrent =
      latestHistoryPoint && now - latestHistoryPoint.time < 5000;

    if (Number.isFinite(rawValue) && !latestHistoryIsCurrent) {
      rawPlotData.push({
        state: rawValue,
        time: now,
      });
    }

    const parseMaxHistoryPoints = (value) => {
      if (value === undefined || value === null || value === "" || value === "auto") {
        return null;
      }

      const parsed = Number(value);
      if (!Number.isFinite(parsed) || parsed <= 0) {
        return null;
      }

      return Math.max(2, Math.floor(parsed));
    };

    const downsamplePlotData = (data, maxPoints) => {
      if (!maxPoints || data.length <= maxPoints) {
        return data;
      }

      if (maxPoints <= 2) {
        return [data[0], data[data.length - 1]];
      }

      const result = [];
      const lastIndex = data.length - 1;
      const step = lastIndex / (maxPoints - 1);

      for (let i = 0; i < maxPoints; i += 1) {
        const sourceIndex = Math.round(i * step);
        const point = data[Math.min(lastIndex, sourceIndex)];

        if (!result.length || result[result.length - 1] !== point) {
          result.push(point);
        }
      }

      if (result[result.length - 1] !== data[lastIndex]) {
        result[result.length - 1] = data[lastIndex];
      }

      return result;
    };

    const maxPlotPoints = parseMaxHistoryPoints(this.config.max_history_points);
    const plotData = downsamplePlotData(rawPlotData, maxPlotPoints);

    const points = plotData
      .map((point) => `${xToSvg(point.time)},${yToSvg(point.state)}`)
      .join(" ");

    this._lastRawPlotDataCount = rawPlotData.length;
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

    const formatClockTimeWithSeconds = (timestamp) => {
      if (!timestamp) return "–";

      return new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
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

    /*
      Kept under the old function name so existing debug lines do not need to be
      changed. This now returns an absolute fetch time rather than a relative
      "seconds ago" value, because guarded rendering means relative text may not
      update every second/minute.
    */
    const formatRelativeFetchTime = () => {
      if (!this._lastHistoryFetch) return "not fetched";

      return formatClockTimeWithSeconds(this._lastHistoryFetch.getTime());
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

    const formatHistoryMode = () => {
      const configuredMode =
        this._lastConfiguredHistoryMode || this.config.history_mode || "auto";

      const resolvedMode =
        this._lastResolvedHistoryMode || configuredMode;

      if (configuredMode === resolvedMode) {
        return resolvedMode;
      }

      return `${configuredMode}→${resolvedMode}`;
    };

    const formatHistorySourceCounts = () => {
      const statsCount = Number(this._lastStatisticsHistoryCount) || 0;
      const rawCount = Number(this._lastRawHistoryCount) || 0;
      const mergedCount = Number(this._lastMergedHistoryCount) || 0;

      if (statsCount || rawCount || mergedCount) {
        return `stats ${statsCount} · raw ${rawCount} · merged ${mergedCount || this._rawHistoryCount || 0}`;
      }

      return "–";
    };

    const formatHistorySourceRanges = () => {
      const statsFirst = formatRelativeTimestamp(
        this._lastStatisticsFirstPointTime
      );
      const rawFirst = formatRelativeTimestamp(this._lastRawFirstPointTime);

      if (statsFirst === "–" && rawFirst === "–") {
        return "–";
      }

      return `stats from ${statsFirst} · raw from ${rawFirst}`;
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
      Grid lines are drawn only inside the plot area.

      The first and last ticks are skipped so grid lines do not sit directly on
      the plot boundary. This keeps the plot edge clean and avoids duplicating the
      role of axes or the plot background boundary.

      grid_line_style controls the SVG dash pattern:
      - solid: continuous line
      - dashed: longer dash/gap pattern
      - dotted: round dots
    */
    const getGridDashArray = (style) => {
      if (style === "dashed") return "6 4";
      if (style === "dotted") return "1 4";
      return "";
    };

    const gridDashArray = getGridDashArray(this.config.grid_line_style);
    const gridLineCap =
      this.config.grid_line_style === "dotted" ? "round" : "butt";

    const yGridHtml = this.config.show_y_grid
      ? yTickValues
          .map((value, index) => ({ value, index }))
          .filter(({ index }) => index > 0 && index < yTickValues.length - 1)
          .map(({ value }) => {
            const y = yToSvg(value);

            return `
              <line
                x1="${padding.left}"
                y1="${y}"
                x2="${padding.left + plotWidth}"
                y2="${y}"
                stroke="${cssValue(this.config.grid_color, "var(--divider-color)")}"
                stroke-width="${cssValue(this.config.grid_width, 1)}"
                stroke-dasharray="${gridDashArray}"
                stroke-linecap="${gridLineCap}"
                opacity="${cssValue(this.config.grid_opacity, 0.35)}"
              ></line>
            `;
          })
          .join("")
      : "";

    const xGridHtml = this.config.show_x_grid
      ? xTickValues
          .filter((tick) => tick.index > 0 && tick.index < xTickValues.length - 1)
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
                stroke-dasharray="${gridDashArray}"
                stroke-linecap="${gridLineCap}"
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

      When both axes are visible, the axis lines overlap very slightly at the
      plot corner so thicker lines form a clean joined edge.
    */
    const yAxisX =
      yAxisPosition === "right" ? padding.left + plotWidth : padding.left;

    const xAxisLineWidth = Number(this.config.x_axis_line_width) || 1;
    const yAxisCornerOverlap = this.config.show_x_axis ? xAxisLineWidth / 2 : 0;

    const yAxisY1 =
      padding.top - (xAxisPosition === "top" ? yAxisCornerOverlap : 0);

    const yAxisY2 =
      padding.top +
      plotHeight +
      (xAxisPosition === "bottom" ? yAxisCornerOverlap : 0);

    const yAxisHtml = this.config.show_y_axis
      ? `
        <line
          x1="${yAxisX}"
          y1="${yAxisY1}"
          x2="${yAxisX}"
          y2="${yAxisY2}"
          stroke="${cssValue(this.config.y_axis_line_color, "var(--divider-color)")}"
          stroke-width="${cssValue(this.config.y_axis_line_width, 1)}"
          stroke-linecap="butt"
          opacity="${cssValue(this.config.y_axis_line_opacity, 1)}"
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
      Band background rectangles, separators, and band labels
      --------------------------------------------------------------------------
      Bands are built in three layers:
      1. band fill
         - stepped: individual band rectangles
         - gradient: one smooth vertical gradient based on band colours
      2. optional band separator lines at internal thresholds
      3. band labels

      This keeps the separators visually above the coloured fills, while allowing
      labels to sit on top of both.
    */
    const getBandSeparatorDashArray = (style) => {
      if (style === "dashed") return "8 6";
      if (style === "dotted") return "1 5";
      return "";
    };

    const bandSeparatorDashArray = getBandSeparatorDashArray(
      this.config.band_separator_style
    );

    const bandSeparatorLineCap =
      this.config.band_separator_style === "dotted" ? "round" : "butt";

    const validBands = (this.config.bands || [])
      .map((band) => {
        const from = Number(band.from);
        const to = Number(band.to);

        if (!Number.isFinite(from) || !Number.isFinite(to) || to <= from) {
          return null;
        }

        const y1 = yToSvg(to);
        const y2 = yToSvg(from);
        const bandHeight = y2 - y1;

        if (bandHeight <= 0) return null;

        const bandLabel = formatBandLabel(band);
        const bandLabelY = getBandLabelY(y1, y2);
        const bandLabelX = getBandLabelX();

        const shouldHideSmallLabel =
          this.config.hide_small_band_labels &&
          bandHeight < Number(this.config.min_band_label_height);

        return {
          band,
          from,
          to,
          y1,
          y2,
          bandHeight,
          bandLabel,
          bandLabelY,
          bandLabelX,
          shouldHideSmallLabel,
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.from - b.from);

    const bandGradientId = `${this._instanceId}-band-gradient`;

    const valueToBandGradientOffset = (value) => {
      const min = Number(this.config.y_min);
      const max = Number(this.config.y_max);
      const range = max - min;

      if (!Number.isFinite(value) || !Number.isFinite(range) || range <= 0) {
        return 0;
      }

      return clamp(((value - min) / range) * 100, 0, 100);
    };

    const bandGradientStops =
      validBands.length > 0
        ? (() => {
            const stops = [];

            validBands.forEach((bandInfo, index) => {
              const colour = applyOpacityToColour(
                bandInfo.band.color || "rgba(128,128,128,0.15)",
                this.config.band_opacity
              );

              if (index === 0) {
                stops.push({
                  offset: valueToBandGradientOffset(bandInfo.from),
                  colour,
                });
              }

              stops.push({
                offset: valueToBandGradientOffset(
                  bandInfo.from + (bandInfo.to - bandInfo.from) / 2
                ),
                colour,
              });

              if (index === validBands.length - 1) {
                stops.push({
                  offset: valueToBandGradientOffset(bandInfo.to),
                  colour,
                });
              }
            });

            return stops
              .sort((a, b) => a.offset - b.offset)
              .map(
                (stop) => `
                  <stop
                    offset="${stop.offset.toFixed(2)}%"
                    stop-color="${stop.colour}"
                  ></stop>
                `
              )
              .join("");
          })()
        : "";

    const bandRects =
      this.config.show_bands && validBands.length > 0
        ? this.config.band_fill_mode === "gradient"
          ? `
            <defs>
              <linearGradient
                id="${bandGradientId}"
                x1="0"
                y1="${padding.top + plotHeight}"
                x2="0"
                y2="${padding.top}"
                gradientUnits="userSpaceOnUse"
              >
                ${bandGradientStops}
              </linearGradient>
            </defs>

            <rect
              x="${padding.left}"
              y="${padding.top}"
              width="${plotWidth}"
              height="${plotHeight}"
              fill="url(#${bandGradientId})"
            ></rect>
          `
          : validBands
              .map(
                ({
                  band,
                  y1,
                  bandHeight,
                }) => `
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
                `
              )
              .join("")
        : "";

    const bandSeparators =
      this.config.show_bands &&
      this.config.show_band_separators &&
      validBands.length > 1
        ? validBands
            .slice(0, -1)
            .map((bandInfo) => {
              const y = yToSvg(bandInfo.to);

              return `
                <line
                  x1="${padding.left}"
                  y1="${y}"
                  x2="${padding.left + plotWidth}"
                  y2="${y}"
                  stroke="${cssValue(
                    this.config.band_separator_color,
                    "var(--divider-color)"
                  )}"
                  stroke-width="${cssValue(
                    this.config.band_separator_width,
                    1
                  )}"
                  stroke-dasharray="${bandSeparatorDashArray}"
                  stroke-linecap="${bandSeparatorLineCap}"
                  opacity="${cssValue(
                    this.config.band_separator_opacity,
                    0.5
                  )}"
                ></line>
              `;
            })
            .join("")
        : "";

    const bandLabels = this.config.show_bands
      ? validBands
          .map(
            ({
              bandLabel,
              shouldHideSmallLabel,
              bandLabelX,
              bandLabelY,
            }) =>
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
          )
          .join("")
      : "";

    const clippedBandContent = `${bandRects}${bandSeparators}`;
    const unclippedBandLabels = bandLabels;
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

      The X-axis line position and X-axis label position are deliberately
      separate. This allows the axis line to sit at the zero point while labels
      remain at the top, middle, or bottom of the plot.

      X-axis labels use the dedicated x_axis_label_* settings rather than the
      older shared axis_label_* settings.

      When both axes are visible, the axis lines overlap very slightly at the
      plot corner so thicker lines form a clean joined edge.
    */
    const xAxisY =
      xAxisPosition === "top"
        ? padding.top
        : xAxisPosition === "zero"
          ? clamp(yToSvg(0), padding.top, padding.top + plotHeight)
          : padding.top + plotHeight;

    const xAxisLabelY =
      xAxisLabelPosition === "top"
        ? padding.top - 14
        : xAxisLabelPosition === "middle"
          ? padding.top + plotHeight / 2
          : padding.top + plotHeight + 18;

    const yAxisLineWidth = Number(this.config.y_axis_line_width) || 1;
    const xAxisCornerOverlap = this.config.show_y_axis ? yAxisLineWidth / 2 : 0;

    const xAxisX1 =
      padding.left - (yAxisPosition === "left" ? xAxisCornerOverlap : 0);

    const xAxisX2 =
      padding.left +
      plotWidth +
      (yAxisPosition === "right" ? xAxisCornerOverlap : 0);

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
          x1="${xAxisX1}"
          y1="${xAxisY}"
          x2="${xAxisX2}"
          y2="${xAxisY}"
          stroke="${cssValue(this.config.x_axis_line_color, "var(--divider-color)")}"
          stroke-width="${cssValue(this.config.x_axis_line_width, 1)}"
          stroke-linecap="butt"
          opacity="${cssValue(this.config.x_axis_line_opacity, 1)}"
        ></line>
      `
      : "";
    /*
      --------------------------------------------------------------------------
      Line rendering
      --------------------------------------------------------------------------
      Static line mode draws one polyline.

      Band colour mode splits the line at band thresholds and groups adjacent
      segments that share the same colour.

      Gradient mode draws one continuous polyline with a vertical SVG gradient
      based on the configured band colours.

      Premium line effects are drawn underneath the main line as simple full-path
      layers. This keeps the existing static/band/gradient line logic intact
      while adding contrast, glow, and depth.
    */
    const buildLineGradientStops = () => {
      if (!validBands.length) return "";

      const stops = [];

      validBands.forEach((bandInfo, index) => {
        const colour = applyOpacityToColour(
          bandInfo.band.color || this.config.line_color || "var(--primary-color)",
          this.config.line_opacity
        );

        if (index === 0) {
          stops.push({
            offset: valueToBandGradientOffset(bandInfo.from),
            colour,
          });
        }

        stops.push({
          offset: valueToBandGradientOffset(
            bandInfo.from + (bandInfo.to - bandInfo.from) / 2
          ),
          colour,
        });

        if (index === validBands.length - 1) {
          stops.push({
            offset: valueToBandGradientOffset(bandInfo.to),
            colour,
          });
        }
      });

      return stops
        .sort((a, b) => a.offset - b.offset)
        .map(
          (stop) => `
            <stop
              offset="${stop.offset.toFixed(2)}%"
              stop-color="${stop.colour}"
            ></stop>
          `
        )
        .join("");
    };

    const lineGradientId = `${this._instanceId}-line-gradient`;
    const lineShadowFilterId = `${this._instanceId}-line-shadow-blur`;
    const lineHaloFilterId = `${this._instanceId}-line-halo-blur`;

    const numericLineWidth = Math.max(0, Number(this.config.line_width) || 3);

    const buildLineEffectsHtml = () => {
      if (!points || plotData.length < 2) return "";

      const effects = [];

      const shadowEnabled =
        this.config.line_shadow &&
        Number(this.config.line_shadow_opacity) > 0 &&
        Number(this.config.line_shadow_blur) >= 0;

      const haloEnabled =
        this.config.line_halo &&
        Number(this.config.line_halo_width) > 0 &&
        Number(this.config.line_halo_opacity) > 0;

      const outlineEnabled =
        this.config.line_outline &&
        Number(this.config.line_outline_width) > 0 &&
        Number(this.config.line_outline_opacity) > 0;

      if (shadowEnabled) {
        const shadowBlur = Math.max(0, Number(this.config.line_shadow_blur) || 0);
        const shadowOffsetX = Number(this.config.line_shadow_offset_x) || 0;
        const shadowOffsetY = Number(this.config.line_shadow_offset_y) || 0;
        const shadowColour = applyOpacityToColour(
          this.config.line_shadow_color || "rgba(0, 0, 0, 0.45)",
          Number(this.config.line_shadow_opacity) || 0
        );

        effects.push(`
          <defs>
            <filter
              id="${lineShadowFilterId}"
              filterUnits="userSpaceOnUse"
              x="${padding.left - 120}"
              y="${padding.top - 120}"
              width="${plotWidth + 240}"
              height="${plotHeight + 240}"
            >
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="${shadowBlur}"
              ></feGaussianBlur>
            </filter>
          </defs>

          <polyline
            points="${points}"
            fill="none"
            stroke="${shadowColour}"
            stroke-width="${numericLineWidth}"
            stroke-linecap="round"
            stroke-linejoin="round"
            transform="translate(${shadowOffsetX}, ${shadowOffsetY})"
            filter="url(#${lineShadowFilterId})"
          ></polyline>
        `);
      }

      if (haloEnabled) {
        const haloExtraWidth = Math.max(0, Number(this.config.line_halo_width) || 0);
        const haloBlur = Math.max(0, Number(this.config.line_halo_blur) || 0);
        const haloStrokeWidth = numericLineWidth + haloExtraWidth * 2;
        const haloColour = applyOpacityToColour(
          this.config.line_halo_color || "#ffffff",
          Number(this.config.line_halo_opacity) || 0
        );

        effects.push(`
          <defs>
            <filter
              id="${lineHaloFilterId}"
              filterUnits="userSpaceOnUse"
              x="${padding.left - 120}"
              y="${padding.top - 120}"
              width="${plotWidth + 240}"
              height="${plotHeight + 240}"
            >
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="${haloBlur}"
              ></feGaussianBlur>
            </filter>
          </defs>

          <polyline
            points="${points}"
            fill="none"
            stroke="${haloColour}"
            stroke-width="${haloStrokeWidth}"
            stroke-linecap="round"
            stroke-linejoin="round"
            filter="${haloBlur > 0 ? `url(#${lineHaloFilterId})` : "none"}"
          ></polyline>
        `);
      }

      if (outlineEnabled) {
        const outlineExtraWidth = Math.max(
          0,
          Number(this.config.line_outline_width) || 0
        );
        const outlineStrokeWidth = numericLineWidth + outlineExtraWidth * 2;
        const outlineColour = applyOpacityToColour(
          this.config.line_outline_color || "#ffffff",
          Number(this.config.line_outline_opacity) || 0
        );

        effects.push(`
          <polyline
            points="${points}"
            fill="none"
            stroke="${outlineColour}"
            stroke-width="${outlineStrokeWidth}"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></polyline>
        `);
      }

      return effects.join("");
    };

    const buildGradientLineHtml = () => {
      if (!points || plotData.length < 2 || !validBands.length) {
        this._lastLinePathCount = 0;
        this._lastLineSplitSegmentCount = 0;
        return "";
      }

      this._lastLinePathCount = 1;
      this._lastLineSplitSegmentCount = this._lastLineSegmentCount;

      return `
        <defs>
          <linearGradient
            id="${lineGradientId}"
            x1="0"
            y1="${padding.top + plotHeight}"
            x2="0"
            y2="${padding.top}"
            gradientUnits="userSpaceOnUse"
          >
            ${buildLineGradientStops()}
          </linearGradient>
        </defs>

        <polyline
          points="${points}"
          fill="none"
          stroke="url(#${lineGradientId})"
          stroke-width="${cssValue(this.config.line_width, 3)}"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></polyline>
      `;
    };

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
      if (this.config.line_color_mode === "none") {
        this._lastLinePathCount = 0;
        this._lastLineSplitSegmentCount = 0;
        lineHtml = "";
      } else {
        const lineEffectsHtml = buildLineEffectsHtml();

        let mainLineHtml = "";

        if (this.config.line_color_mode === "band") {
          mainLineHtml = buildGroupedBandLineHtml();
        } else if (this.config.line_color_mode === "gradient") {
          mainLineHtml = buildGradientLineHtml();
        } else {
          this._lastLinePathCount = 1;
          this._lastLineSplitSegmentCount = this._lastLineSegmentCount;

          mainLineHtml = `
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

        lineHtml = `
          ${lineEffectsHtml}
          ${mainLineHtml}
        `;
      }
    } else {
      this._lastLinePathCount = 0;
      this._lastLineSplitSegmentCount = 0;
    }
    /*
      --------------------------------------------------------------------------
      Area rendering
      --------------------------------------------------------------------------
      Draws a filled area between the plotted history data and the zero point on
      the y-axis.

      The zero baseline is clamped to the visible plot area, so charts whose
      range does not include zero still draw safely to the nearest edge.

      Colour mode support:
      - "none" hides the area fill.
      - "static" uses area_color and area_opacity.
      - "band" splits at band thresholds, then groups adjacent segments with the
        same resolved band colour into larger polygons.
    */
    const areaColorMode = this.config.area_color_mode || "static";

    const zeroY = yToSvg(0);

    const areaBaselineY = clamp(
      zeroY,
      padding.top,
      padding.top + plotHeight
    );

    const areaOpacity = normaliseOpacity(this.config.area_opacity ?? 0.18);

    const staticAreaColour = applyOpacityToColour(
      this.config.area_color || "var(--primary-color)",
      areaOpacity
    );

    const buildStaticAreaHtml = () => {
      const areaPoints =
        plotData.length >= 2
          ? [
              `${xToSvg(plotData[0].time)},${areaBaselineY}`,
              ...plotData.map(
                (point) => `${xToSvg(point.time)},${yToSvg(point.state)}`
              ),
              `${xToSvg(plotData[plotData.length - 1].time)},${areaBaselineY}`,
            ].join(" ")
          : "";

      return areaPoints && staticAreaColour !== "transparent"
        ? `
          <polygon
            points="${areaPoints}"
            fill="${staticAreaColour}"
            stroke="none"
          ></polygon>
        `
        : "";
    };

    const buildGroupedBandAreaHtml = () => {
      if (plotData.length < 2) {
        return "";
      }

      const thresholds = getBandThresholds();
      const polygons = [];

      let currentColour = null;
      let currentLinePoints = [];

      const toSvgPoint = (point) => `${xToSvg(point.time)},${yToSvg(point.state)}`;

      const flushCurrentPolygon = () => {
        if (currentLinePoints.length < 2 || !currentColour) return;

        const firstLinePoint = currentLinePoints[0];
        const lastLinePoint = currentLinePoints[currentLinePoints.length - 1];

        const firstX = firstLinePoint.split(",")[0];
        const lastX = lastLinePoint.split(",")[0];

        const polygonPoints = [
          ...currentLinePoints,
          `${lastX},${areaBaselineY}`,
          `${firstX},${areaBaselineY}`,
        ].join(" ");

        polygons.push(`
          <polygon
            points="${polygonPoints}"
            fill="${currentColour}"
            stroke="none"
          ></polygon>
        `);
      };

      const getCrossingsForAreaSegment = (startPoint, endPoint) => {
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
          ...getCrossingsForAreaSegment(previousPoint, point),
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
            this.config.area_color,
            "band",
            areaOpacity,
            segmentBand
          );

          if (!segmentColour || segmentColour === "transparent") {
            flushCurrentPolygon();
            currentColour = null;
            currentLinePoints = [];
            continue;
          }

          const startSvgPoint = toSvgPoint(startPoint);
          const endSvgPoint = toSvgPoint(endPoint);

          if (segmentColour !== currentColour) {
            flushCurrentPolygon();

            currentColour = segmentColour;
            currentLinePoints = [startSvgPoint, endSvgPoint];
          } else {
            const lastPoint = currentLinePoints[currentLinePoints.length - 1];

            if (lastPoint !== startSvgPoint) {
              currentLinePoints.push(startSvgPoint);
            }

            currentLinePoints.push(endSvgPoint);
          }
        }
      }

      flushCurrentPolygon();

      return polygons.join("");
    };

    let areaHtml = "";

    if (this.config.show_area && areaColorMode !== "none" && points) {
      if (areaColorMode === "band") {
        areaHtml = buildGroupedBandAreaHtml();
      } else {
        areaHtml = buildStaticAreaHtml();
      }
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

    const formatDebugValue = (value, fallback = "n/a") =>
      value === null || value === undefined || value === ""
        ? fallback
        : String(value);

    const formatDebugNumber = (value, fallback = "n/a") =>
      Number.isFinite(Number(value)) ? String(Math.round(Number(value))) : fallback;

    const formatDebugFloat = (value, digits = 2, fallback = "n/a") =>
      Number.isFinite(Number(value))
        ? Number(value).toFixed(digits)
        : fallback;

    const formatDebugSize = (debugWidth, debugHeight) =>
      `${formatDebugNumber(debugWidth)}×${formatDebugNumber(debugHeight)}`;

    const measuredHeightRatio =
      layoutDebug.configuredHeight && layoutDebug.measuredPlotWrapHeight
        ? layoutDebug.measuredPlotWrapHeight / layoutDebug.configuredHeight
        : null;

    const innerPlotHeightRatio =
      layoutDebug.configuredHeight && layoutDebug.innerPlotHeight
        ? layoutDebug.innerPlotHeight / layoutDebug.configuredHeight
        : null;

    const debugPaddingText = [
      `t${formatDebugNumber(layoutDebug.paddingTop)}`,
      `r${formatDebugNumber(layoutDebug.paddingRight)}`,
      `b${formatDebugNumber(layoutDebug.paddingBottom)}`,
      `l${formatDebugNumber(layoutDebug.paddingLeft)}`,
    ].join("/");

    const debugBasePaddingText = [
      `t${formatDebugNumber(layoutDebug.baseTopPadding)}`,
      `r${formatDebugNumber(layoutDebug.baseRightPadding)}`,
      `b${formatDebugNumber(layoutDebug.baseBottomPadding)}`,
      `l${formatDebugNumber(layoutDebug.baseLeftPadding)}`,
    ].join("/");

    const layoutFlags = [
      layoutDebug.measuredPlotWrapWidth && layoutDebug.measuredPlotWrapHeight
        ? "measured"
        : "fallback",
      this.config.show_header ? "header" : "no-header",
      this.config.show_footer ? "footer" : "no-footer",
      this.config.show_x_axis ? "x-axis" : "no-x-axis",
      this.config.show_x_axis_labels ? "x-labels" : "no-x-labels",
      this.config.show_y_axis ? "y-axis" : "no-y-axis",
      this.config.show_y_axis_labels ? "y-labels" : "no-y-labels",
      this.config.show_bands ? "bands" : "no-bands",
      this.config.show_line ? "line" : "no-line",
      this.config.show_area ? "area" : "no-area",
    ].join(" · ");

    const bandLabelDebugText = [
      `mode ${layoutDebug.bandLabelMode}`,
      `align ${layoutDebug.bandLabelAlign}`,
      `pos ${layoutDebug.bandLabelPosition}`,
      `layer ${this.config.band_label_layer || "below"}`,
      `outside L${layoutDebug.hasOutsideLeftBandLabels ? "yes" : "no"}`,
      `R${layoutDebug.hasOutsideRightBandLabels ? "yes" : "no"}`,
      `outside width ${formatDebugNumber(layoutDebug.bandLabelOutsideWidth)}`,
      `calc ${formatDebugNumber(layoutDebug.calculatedOutsideWidth)}`,
      `longest ${formatDebugNumber(layoutDebug.longestBandLabelWidth)}`,
      `labels ${formatDebugNumber(layoutDebug.bandLabelTextCount)}`,
    ].join(" · ");

    const axisDebugText = [
      `x-line ${layoutDebug.xAxisPosition}`,
      layoutDebug.showXAxis ? "x-line on" : "x-line off",
      `x-labels ${layoutDebug.xAxisLabelPosition || "bottom"}`,
      layoutDebug.showXAxisLabels ? "x-labels on" : "x-labels off",
      `y ${layoutDebug.yAxisPosition}`,
      layoutDebug.showYAxis ? "y-line on" : "y-line off",
      layoutDebug.showYAxisLabels ? "y-labels on" : "y-labels off",
    ].join(" · ");

    const historyModeDebugText = [
      `history ${formatHistoryMode()}`,
      `stats type ${this.config.statistics_type || "mean"}`,
      `period ${this.config.statistics_period || "hour"}`,
      `raw window ${this.config.hybrid_raw_hours || 240}h`,
    ].join(" · ");

    const rawPathCountText =
      Number.isFinite(Number(this._lastRawPlotDataCount))
        ? ` · path raw ${formatDebugNumber(this._lastRawPlotDataCount)}`
        : "";

    const renderLimitText =
      Number.isFinite(Number(this._lastRawPlotDataCount)) &&
      Number.isFinite(Number(this._lastPlotDataCount)) &&
      Number(this._lastRawPlotDataCount) > Number(this._lastPlotDataCount)
        ? ` · render limited ${formatDebugNumber(this._lastRawPlotDataCount)}→${formatDebugNumber(this._lastPlotDataCount)}`
        : "";

    let debugLines = [];

    if (debugLevel === "off") {
      debugLines = [];
    } else if (this._isFetchingHistory) {
      debugLines = ["debug · loading history"];
    } else {
      const basicDebugLines = [
        `debug · ${this.config.hours_to_show}h · fetched ${formatRelativeFetchTime()}`,
        `raw ${this._rawHistoryCount} · plotted ${this._plottedHistoryCount}${rawPathCountText} · path ${this._lastPlotDataCount}${renderLimitText} · segments ${this._lastLineSegmentCount}/${this._lastLineSplitSegmentCount} · grouped paths ${this._lastLinePathCount} · max ${maxHistoryPointsText}`,
        `${historyModeDebugText}`,
        `${formatHistorySourceCounts()}`,
        `refresh ${this.config.history_refresh_interval}s · ${this._lastRequestMode}`,
        `y ${yMin}-${yMax} · x ${this.config.x_axis_label_mode} · line ${this.config.line_color_mode} · area ${this.config.area_color_mode}`,
      ];

      const layoutDebugLines = [
        `layout ${layoutFlags}`,
        `plotWrap ${formatDebugSize(layoutDebug.measuredPlotWrapWidth, layoutDebug.measuredPlotWrapHeight)} · svg ${formatDebugSize(layoutDebug.svgWidth, layoutDebug.svgHeight)} · inner plot ${formatDebugSize(layoutDebug.innerPlotWidth, layoutDebug.innerPlotHeight)}`,
        `padding ${debugPaddingText} · base ${debugBasePaddingText}`,
        `height config ${formatDebugNumber(layoutDebug.configuredHeight)} · min plotWrap ${formatDebugNumber(layoutDebug.plotWrapMinHeight)} · measured/config ${formatDebugFloat(measuredHeightRatio)} · plot/config ${formatDebugFloat(innerPlotHeightRatio)}`,
      ];

      const configDebugLines = [
        `band labels · ${bandLabelDebugText}`,
        `axis · ${axisDebugText}`,
        `band label texts · ${layoutDebug.bandLabelTexts || "none"}`,
      ];

      const performanceDebugLines = [
        `fetch ${formatDuration(this._lastFetchDurationMs)} · api ${formatDuration(this._lastHistoryApiDurationMs)} · downsample ${formatDuration(this._lastDownsampleDurationMs)}`,
        `render ${formatDuration(this._lastRenderDurationMs)} · renders ${this._renderCount}`,
        `downsample ${this._lastWasDownsampled ? "yes" : "no"} · ratio ${formatDownsampleRatio()} · density ${formatDensity()}`,
      ];

      const verboseDebugLines = [
        `entity ${this.config.entity}`,
        `name ${this.config.name} · area ${this._areaName || "n/a"}`,
        `value ${formatDebugValue(rawValue)} · current ${formatDebugValue(currentText)} · band ${formatDebugValue(currentBandText)}`,
        `first ${formatRelativeTimestamp(this._lastHistoryFirstPointTime)} · last ${formatRelativeTimestamp(this._lastHistoryLastPointTime)}`,
        `window ${formatRelativeTimestamp(this._lastHistoryStartTime)} → ${formatRelativeTimestamp(this._lastHistoryEndTime)}`,
        `${formatHistorySourceRanges()}`,
      ];

      if (debugLevel === "performance") {
        debugLines = [
          ...basicDebugLines,
          ...layoutDebugLines,
          ...performanceDebugLines,
        ];
      } else if (debugLevel === "verbose") {
        debugLines = [
          ...basicDebugLines,
          ...layoutDebugLines,
          ...configDebugLines,
          ...performanceDebugLines,
          ...verboseDebugLines,
        ];
      } else {
        debugLines = [
          ...basicDebugLines,
          ...layoutDebugLines,
        ];
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

      Template placeholders can be used in band messages and custom text:
      {area}, {name}, {current}, {band}, {unit}, {entity}, {min}, {max},
      and {duration}.
    */
    const minText = extrema.min ? formatMarkerLabel(extrema.min, "min") : "";
    const durationText = formatDurationLabel();
    const maxText =
      extrema.max && extrema.max !== extrema.min
        ? formatMarkerLabel(extrema.max, "max")
        : "";

    const areaText = this._areaName || "";

    const formatTemplateText = (text = "") => {
      const replacements = {
        area: areaText,
        name,
        current: currentText,
        band: currentBandText,
        unit,
        entity: entityId,
        min: minText,
        max: maxText,
        duration: durationText,
      };

      return String(text).replace(/\{([a-zA-Z0-9_]+)\}/g, (match, key) =>
        replacements[key] ?? match
      );
    };

    const formattedBandMessage = formatTemplateText(currentBandMessage);
    const formattedCustomText = formatTemplateText(this.config.custom_text);

    const multilineSlotNames = new Set([
      "name",
      "message",
      "band_message",
      "instruction",
      "instructions",
      "custom",
      "text",
      "debug",
      "status",
    ]);

    const slotContent = {
      none: "",
      name,
      area: areaText,
      current: currentText,
      band: currentBandText,
      message: formattedBandMessage,
      band_message: formattedBandMessage,
      instruction: formattedBandMessage,
      instructions: formattedBandMessage,
      debug: debugText,
      status: debugText,
      entity: entityId,
      unit,
      min: minText,
      minimum: minText,
      max: maxText,
      maximum: maxText,

      // Extra ribbon slot content
      custom: formattedCustomText,
      text: formattedCustomText,
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
      const isHeaderSlot = positionKey.startsWith("top_");
      const isFooterSlot = positionKey.startsWith("bottom_");
      const isMultilineEligible = multilineSlotNames.has(slotName);

      const headerMultilineEnabled = Boolean(this.config.header_multiline);
      const footerMultilineEnabled = Boolean(this.config.footer_multiline);

      const multilineEnabled =
        isMultilineEligible &&
        (
          (isHeaderSlot && headerMultilineEnabled) ||
          (isFooterSlot && footerMultilineEnabled) ||
          (isDebug && this.config.debug_multiline)
        );

      const maxLines = Math.max(
        1,
        Number(
          isHeaderSlot
            ? this.config.header_max_lines
            : this.config.footer_max_lines
        ) || 2
      );

      const defaultFontSize = this.config[`${positionKey}_font_size`] ?? 16;
      const defaultFontWeight = this.config[`${positionKey}_font_weight`] ?? 600;
      const defaultOpacity = this.config[`${positionKey}_opacity`] ?? 1;

      /*
        New preferred colour path:
        - top_left_color / top_center_color / top_right_color inherit from
          header_color via setConfig()
        - bottom_left_color / bottom_center_color / bottom_right_color inherit
          from footer_color via setConfig()
        - ribbon_styles still wins as the most specific override
      */
      const defaultColor =
        this.config[`${positionKey}_color`] ??
        (
          isDebug
            ? "var(--secondary-text-color)"
            : "var(--primary-text-color)"
        );

      const defaultColourMode =
        this.config[`${positionKey}_color_mode`] ??
        this.config.ribbon_color_mode ??
        "static";

      const style = this.config.ribbon_styles?.[positionKey] || {};

      const fontSize = cssValue(
        style.font_size ?? defaultFontSize,
        defaultFontSize,
        "px"
      );

      const fontWeight = cssValue(
        style.font_weight,
        defaultFontWeight
      );

      const colourMode =
        style.color_mode ?? defaultColourMode;

      const colourOpacity =
        style.color_opacity ?? style.opacity ?? defaultOpacity;

      const color = resolveColour(
        style.color ?? defaultColor,
        colourMode,
        colourOpacity
      );

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
            text-overflow: ${multilineEnabled ? "clip" : "ellipsis"};
            white-space: ${isDebug && multilineEnabled ? "pre-line" : multilineEnabled ? "normal" : "nowrap"};
            line-height: ${multilineEnabled ? "1.25" : "normal"};
            display: ${multilineEnabled ? "-webkit-box" : "block"};
            -webkit-line-clamp: ${multilineEnabled ? maxLines : "unset"};
            -webkit-box-orient: vertical;
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
      Renders header/footer ribbons using a dynamic, position-aware layout.

      Rules:
      - One occupied slot: it gets the full ribbon width.
      - Left + right: space is allocated by estimated content width.
      - Centre + side content: centre remains geometrically centred by using
        symmetrical side columns.
      - Side columns are clamped so tiny values do not get too much space, and
        long side values do not completely crush the centre.

      The tuning constants below are deliberately local to this section so the
      ribbon layout can be refined without affecting the rest of the card.
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

      /*
        Layout tuning.

        sideMinPercent:
          Minimum space for a side column when centre is present.

        sideMaxPercent:
          Maximum space for each side column when centre is present.

        sideComfortPx:
          Small allowance so text is not squeezed exactly to estimated width.

        availableRibbonWidth:
          Approximate rendered ribbon width used to convert estimated text width
          into percentages. This is intentionally approximate; CSS still handles
          the real final layout.
      */
      const sideMinPercent = 8;
      const sideMaxPercent = 36;
      const sideComfortPx = 12;
      const availableRibbonWidth = Math.max(160, width - 32);

      const stripHtml = (value) => {
        let text = String(value ?? "");

        /*
          This is used only for estimating rendered ribbon width, not for
          rendering HTML. Still, remove tag-like content to avoid treating
          internal markup as visible text.

          Repeat until stable so nested/malformed tag-like strings do not leave
          newly exposed tag fragments behind.
        */
        let previousText = "";

        while (text !== previousText) {
          previousText = text;
          text = text.replace(/<[^<>]*>/g, "");
        }

        return text
          .replace(/[<>]/g, "")
          .replace(/\s+/g, " ")
          .trim();
      };

      const estimateRibbonWidth = (contentKey, styleKey) => {
        const text = stripHtml(slotContent[contentKey]);
        const fontSize = Number(this.config[`${styleKey}_font_size`]) || 13;

        return Math.max(8, text.length * fontSize * 0.56 + sideComfortPx);
      };

      const widthToPercent = (estimatedWidth) =>
        (estimatedWidth / availableRibbonWidth) * 100;

      const clampPercent = (value, min, max) =>
        Math.min(max, Math.max(min, value));

      const leftWidth = hasLeft
        ? estimateRibbonWidth(left, `${prefix}_left`)
        : 0;

      const centerWidth = hasCenter
        ? estimateRibbonWidth(center, `${prefix}_center`)
        : 0;

      const rightWidth = hasRight
        ? estimateRibbonWidth(right, `${prefix}_right`)
        : 0;

      let gridTemplateColumns = "minmax(0, 1fr)";
      let leftColumn = "1";
      let centerColumn = "1";
      let rightColumn = "1";

      if (hasCenter && (hasLeft || hasRight)) {
        /*
          Centre must stay visually centred.

          Use symmetrical side columns based on the larger occupied side. This
          means left+centre and centre+right layouts still reserve an empty
          balancing column on the opposite side, but tiny values only reserve a
          small percentage.
        */
        const requiredSidePercent = widthToPercent(
          Math.max(leftWidth, rightWidth)
        );

        const sidePercent = clampPercent(
          requiredSidePercent,
          sideMinPercent,
          sideMaxPercent
        );

        const centerPercent = Math.max(100 - sidePercent * 2, 20);

        gridTemplateColumns = [
          `minmax(0, ${sidePercent.toFixed(2)}%)`,
          `minmax(0, ${centerPercent.toFixed(2)}%)`,
          `minmax(0, ${sidePercent.toFixed(2)}%)`,
        ].join(" ");

        leftColumn = "1";
        centerColumn = "2";
        rightColumn = "3";
      } else if (hasLeft && hasRight) {
        /*
          No centre slot, so left and right can divide the whole width according
          to their estimated content.
        */
        const leftPercentRaw = widthToPercent(leftWidth);
        const rightPercentRaw = widthToPercent(rightWidth);
        const total = Math.max(leftPercentRaw + rightPercentRaw, 1);

        let leftPercent = (leftPercentRaw / total) * 100;
        let rightPercent = (rightPercentRaw / total) * 100;

        leftPercent = clampPercent(leftPercent, 18, 82);
        rightPercent = 100 - leftPercent;

        gridTemplateColumns = [
          `minmax(0, ${leftPercent.toFixed(2)}%)`,
          `minmax(0, ${rightPercent.toFixed(2)}%)`,
        ].join(" ");

        leftColumn = "1";
        rightColumn = "2";
      }

      const renderRibbonCell = (contentKey, align, styleKey, column) => `
        <div
          style="
            grid-column: ${column};
            min-width: 0;
            width: 100%;
            overflow: hidden;
          "
        >
          ${renderSlot(contentKey, align, styleKey)}
        </div>
      `;

      return `
        <div
          style="
            display: grid;
            grid-template-columns: ${gridTemplateColumns};
            align-items: baseline;
            width: 100%;
            box-sizing: border-box;
            gap: 12px;
            margin-top: ${marginTop}px;
            padding: ${ribbonPadding};
            border-radius: ${ribbonRadius}px;
            background: ${backgroundInfo.colour};
          "
        >
          ${
            hasLeft
              ? renderRibbonCell(left, "left", `${prefix}_left`, leftColumn)
              : ""
          }

          ${
            hasCenter
              ? renderRibbonCell(center, "center", `${prefix}_center`, centerColumn)
              : ""
          }

          ${
            hasRight
              ? renderRibbonCell(right, "right", `${prefix}_right`, rightColumn)
              : ""
          }
        </div>
      `;
    };

    const topRibbonHtml = this.config.show_header
      ? renderRibbon(
          this.config.top_left,
          this.config.top_center,
          this.config.top_right,
          0,
          "top"
        )
      : "";

    const bottomRibbonHtml = this.config.show_footer
      ? renderRibbon(
          this.config.bottom_left,
          this.config.bottom_center,
          this.config.bottom_right,
          6,
          "bottom"
        )
      : "";

    /*
      --------------------------------------------------------------------------
      Final card HTML
      --------------------------------------------------------------------------
      Layer order inside the SVG matters: background, grid, labels/bands, axes,
      then line and markers.

      The host/card/wrapper styles allow the card to participate properly in
      Home Assistant's resizable Sections layout.

      In normal layouts, the plot wrapper uses the configured fallback graph
      height. In explicit Sections row mode, it fills the height allocated by
      Home Assistant so taller row settings can make the graph taller.

      Important: row-fill mode should only be active when grid_options.rows is
      explicitly present in the card YAML. Otherwise, cards in the same Section
      can affect each other's internal graph height.

      Card background is applied inline to ha-card. This matches the older working
      behaviour and avoids the host painting outside the real card surface.

      The plot clip path masks band rectangles to the same rounded shape as the
      plot background, so plot_background_radius applies visually to bands too.
    */
    const layoutControlledByRows = hasExplicitGridRows;

    const hostHeightCss = layoutControlledByRows ? "100%" : "auto";
    const cardHeightCss = layoutControlledByRows ? "100%" : "auto";
    const innerHeightCss = layoutControlledByRows ? "100%" : "auto";

    const plotWrapFlexCss = layoutControlledByRows ? "1 1 auto" : "0 0 auto";
    const plotWrapHeightCss = layoutControlledByRows ? "auto" : `${height}px`;
    const plotWrapMinHeightCss = layoutControlledByRows ? "0" : `${height}px`;

    const cssScope = `.sbgc-root[data-sbgc-instance="${this._instanceId}"]`;

    const bandLabelsBelowData =
      this.config.band_label_layer === "above" ? "" : unclippedBandLabels;

    const bandLabelsAboveData =
      this.config.band_label_layer === "above" ? unclippedBandLabels : "";

    this.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          height: ${hostHeightCss};
          min-width: 0;
          min-height: 0;
        }

        ${cssScope} {
          display: block;
          width: 100%;
          min-width: 0;
        }

        ${cssScope} ha-card {
          display: block;
          width: 100%;
          height: ${cardHeightCss};
          box-sizing: border-box;
          border-radius: ${this.config.card_radius};
          overflow: hidden;
          position: relative;
          border: ${Number(this.config.card_border_width) || 0}px solid ${applyOpacityToColour(
            this.config.card_border_color,
            Number(this.config.card_border_opacity) || 0
          )};
          box-shadow: ${
            this.config.card_shadow
              ? `${Number(this.config.card_shadow_offset_x) || 0}px ${Number(this.config.card_shadow_offset_y) || 0}px ${Number(this.config.card_shadow_blur) || 0}px ${Number(this.config.card_shadow_spread) || 0}px ${this.config.card_shadow_color}`
              : "none"
          };
        }

        ${cssScope} ha-card::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          border-radius: inherit;
          z-index: 1;
          opacity: ${
            this.config.card_shine
              ? Math.min(0.35, Math.max(0, Number(this.config.card_shine_opacity) || 0))
              : 0
          };
          background: linear-gradient(
            ${Number(this.config.card_shine_angle) || 155}deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0) ${Math.max(0, Math.min(100, Number(this.config.card_shine_position) || 0))}%,
            rgba(255, 255, 255, 0.10) ${Math.max(0, Math.min(100, Number(this.config.card_shine_position) || 0)) + Math.max(24, Number(this.config.card_shine_size) || 55) * 0.15}%,
            rgba(255, 255, 255, 0.45) ${Math.max(0, Math.min(100, Number(this.config.card_shine_position) || 0)) + Math.max(24, Number(this.config.card_shine_size) || 55) * 0.45}%,
            rgba(255, 255, 255, 0.16) ${Math.max(0, Math.min(100, Number(this.config.card_shine_position) || 0)) + Math.max(24, Number(this.config.card_shine_size) || 55) * 0.70}%,
            rgba(255, 255, 255, 0) ${Math.min(100, Math.max(0, Math.min(100, Number(this.config.card_shine_position) || 0)) + Math.max(24, Number(this.config.card_shine_size) || 55))}%,
            rgba(255, 255, 255, 0) 100%
          );
          mix-blend-mode: screen;
        }

        ${cssScope} .sbgc-inner {
          position: relative;
          z-index: 2;
          height: ${innerHeightCss};
          box-sizing: border-box;
          padding: ${Number(this.config.card_padding) || 0}px;
          display: flex;
          flex-direction: column;
          min-width: 0;
          min-height: 0;
        }

        ${cssScope} .sbgc-plot-wrap {
          flex: ${plotWrapFlexCss};
          width: 100%;
          height: ${plotWrapHeightCss};
          min-height: ${plotWrapMinHeightCss};
          margin-top: 12px;
          min-width: 0;
          overflow: visible;
          position: relative;
        }

        ${cssScope} .sbgc-svg {
          display: block;
          width: 100%;
          height: 100%;
          min-width: 0;
          min-height: 0;
          overflow: visible;
        }
      </style>

      <div
        class="sbgc-root"
        data-sbgc-instance="${this._instanceId}"
      >
        <ha-card
          data-sbgc-instance="${this._instanceId}"
          style="
            background: ${cardBackground.colour};
            background-color: ${cardBackground.colour};
            --ha-card-background: ${cardBackground.colour};
            --card-background-color: ${cardBackground.colour};
          "
        >
          <div class="sbgc-inner">
            ${topRibbonHtml}

            <div class="sbgc-plot-wrap">
              <svg
                class="sbgc-svg"
                data-sbgc-instance="${this._instanceId}"
                width="${width}"
                height="${height}"
                viewBox="0 0 ${width} ${height}"
              >
                <defs>
                  <clipPath id="${plotClipPathId}">
                    <rect
                      x="${padding.left}"
                      y="${padding.top}"
                      width="${plotWidth}"
                      height="${plotHeight}"
                      rx="${Number(this.config.plot_background_radius) || 0}"
                      ry="${Number(this.config.plot_background_radius) || 0}"
                    ></rect>
                  </clipPath>
                </defs>

                <rect
                  x="${padding.left}"
                  y="${padding.top}"
                  width="${plotWidth}"
                  height="${plotHeight}"
                  rx="${Number(this.config.plot_background_radius) || 0}"
                  ry="${Number(this.config.plot_background_radius) || 0}"
                  fill="${plotBackground.colour}"
                ></rect>

                ${yGridHtml}
                ${xGridHtml}

                <g clip-path="url(#${plotClipPathId})">
                  ${clippedBandContent}
                </g>

                ${bandLabelsBelowData}

                ${
                  points
                    ? `
                      ${areaHtml}

                      <g clip-path="url(#${plotClipPathId})">
                        ${lineHtml}
                      </g>

                      ${bandLabelsAboveData}

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

                ${yAxisHtml}
                ${xAxisHtml}

                ${yAxisLabelsHtml}
                ${xAxisLabelsHtml}
              </svg>
            </div>

            ${bottomRibbonHtml}
          </div>
        </ha-card>
      </div>
    `;

    this._observePlotArea();

    this._attachActionHandlers();

    this._lastRenderDurationMs = Math.round(performance.now() - renderStarted);
  }

  /*
    ============================================================================
    CARD INTERACTIONS
    ============================================================================
    Provides standard Home Assistant-style card interactions.

    The visual editor uses tap_action, hold_action, and double_tap_action.
    These methods translate browser pointer/click events into Home Assistant's
    hass-action event so Lovelace can handle more-info, navigate, url, toggle,
    call-service, and none actions.
  */
  _attachActionHandlers() {
    const card = this.querySelector("ha-card");

    if (!card) return;

    card.style.cursor = "pointer";

    let holdTimer = null;
    let holdFired = false;

    const clearHoldTimer = () => {
      if (holdTimer) {
        clearTimeout(holdTimer);
        holdTimer = null;
      }
    };

    card.onpointerdown = () => {
      holdFired = false;
      clearHoldTimer();

      holdTimer = setTimeout(() => {
        holdFired = true;
        this._fireAction("hold");
      }, 500);
    };

    card.onpointerup = () => {
      clearHoldTimer();
    };

    card.onpointerleave = () => {
      clearHoldTimer();
    };

    card.onclick = (event) => {
      if (holdFired) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      this._fireAction("tap");
    };

    card.ondblclick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      this._fireAction("double_tap");
    };
  }

  _fireAction(action) {
    const actionConfig =
      action === "hold"
        ? this.config.hold_action
        : action === "double_tap"
          ? this.config.double_tap_action
          : this.config.tap_action;

    if (!actionConfig || actionConfig.action === "none") return;

    this.dispatchEvent(
      new CustomEvent("hass-action", {
        bubbles: true,
        composed: true,
        detail: {
          config: this.config,
          action,
        },
      })
    );
  }


  /*
    ============================================================================
    AREA LOOKUP
    ============================================================================
    Resolves the Home Assistant area name for the configured entity.

    The lookup uses Home Assistant registries:
    entity -> entity registry -> device registry -> area registry.

    Registry lists are cached at class level so multiple card instances do not
    repeatedly fetch the same registry data. Lookup maps are also cached so each
    card instance can resolve its entity without repeatedly scanning registry
    arrays.
  */
  async _resolveAreaName() {
    try {
      if (!this._hass?.callWS || !this.config?.entity) {
        return;
      }

      const entityId = this.config.entity;

      // Do not re-run the lookup if this card has already resolved this entity.
      if (this._areaLookupEntity === entityId && this._areaLookupDone) {
        return;
      }

      this._areaLookupEntity = entityId;
      this._areaLookupDone = true;

      const registries = await SimpleBandGraphCard._getAreaLookupRegistries(
        this._hass
      );

      const entityEntry =
        registries.entityById?.get(entityId) ||
        registries.entityRegistry?.find((entry) => entry.entity_id === entityId);

      const deviceEntry = entityEntry?.device_id
        ? registries.deviceById?.get(entityEntry.device_id) ||
          registries.deviceRegistry?.find(
            (device) => device.id === entityEntry.device_id
          )
        : null;

      const areaId = entityEntry?.area_id || deviceEntry?.area_id || null;

      const areaEntry = areaId
        ? registries.areaById?.get(areaId) ||
          registries.areaRegistry?.find((area) => area.area_id === areaId)
        : null;

      const resolvedAreaName = areaEntry?.name || "";

      if (this._areaName !== resolvedAreaName) {
        this._areaName = resolvedAreaName;

        /*
          Re-render once the async area name is available.

          Clear the render key first so the guarded hass setter/render flow does
          not treat the previous render as current.
        */
        this._lastRenderKey = null;

        if (this._hass) {
          this.render();
        }
      }
    } catch (error) {
      console.warn("[Simple Band Graph] Area lookup failed:", error);

      this._areaLookupDone = false;
      this._areaName = "";
    }
  }

  static async _getAreaLookupRegistries(hass) {
    if (!SimpleBandGraphCard._areaLookupRegistryPromise) {
      SimpleBandGraphCard._areaLookupRegistryPromise = Promise.all([
        hass.callWS({ type: "config/entity_registry/list" }),
        hass.callWS({ type: "config/device_registry/list" }),
        hass.callWS({ type: "config/area_registry/list" }),
      ])
        .then(([entityRegistry, deviceRegistry, areaRegistry]) => {
          const safeEntityRegistry = Array.isArray(entityRegistry)
            ? entityRegistry
            : [];

          const safeDeviceRegistry = Array.isArray(deviceRegistry)
            ? deviceRegistry
            : [];

          const safeAreaRegistry = Array.isArray(areaRegistry)
            ? areaRegistry
            : [];

          const entityById = new Map(
            safeEntityRegistry.map((entry) => [entry.entity_id, entry])
          );

          const deviceById = new Map(
            safeDeviceRegistry.map((device) => [device.id, device])
          );

          const areaById = new Map(
            safeAreaRegistry.map((area) => [area.area_id, area])
          );

          return {
            entityRegistry: safeEntityRegistry,
            deviceRegistry: safeDeviceRegistry,
            areaRegistry: safeAreaRegistry,
            entityById,
            deviceById,
            areaById,
          };
        })
        .catch((error) => {
          /*
            If the registry lookup fails once, do not permanently cache the
            rejected promise. Allow a future render/session to try again.
          */
          SimpleBandGraphCard._areaLookupRegistryPromise = null;
          throw error;
        });
    }

    return SimpleBandGraphCard._areaLookupRegistryPromise;
  }
  /*
    ============================================================================
    HOME ASSISTANT CARD SIZE
    ============================================================================
    Used by Home Assistant layouts as sizing metadata.

    getGridOptions is used by the newer Sections layout.

    By default, this card lets Home Assistant auto-place and auto-size it. It only
    returns grid sizing metadata when the user explicitly sets grid_options in
    YAML.

    This avoids default column or row values affecting neighbouring cards in the
    same Section.

    Users can opt into explicit Sections sizing with grid_options.columns and
    grid_options.rows.

    getCardSize is used by older masonry layouts as a rough height estimate.
  */
  getGridOptions() {
    const rawColumns = this.config?.grid_options?.columns;
    const rawRows = this.config?.grid_options?.rows;

    const hasExplicitColumns =
      rawColumns === "full" || Number.isFinite(Number(rawColumns));

    const hasExplicitRows =
      Number.isFinite(Number(rawRows)) && Number(rawRows) > 0;

    const columns =
      rawColumns === "full"
        ? 12
        : hasExplicitColumns
          ? Math.min(12, Math.max(1, Number(rawColumns)))
          : null;

    const rows = hasExplicitRows
      ? Math.min(12, Math.max(1, Number(rawRows)))
      : null;

    if (!columns && !rows) {
      return undefined;
    }

    return {
      ...(columns ? { columns } : {}),
      ...(rows ? { rows } : {}),

      min_columns: 3,
      max_columns: 12,
      max_rows: 12,
    };
  }

  getCardSize() {
    const configuredHeight = Number(this.config?.height) || 180;
    const hasHeader = this.config?.show_header !== false;
    const hasFooter = this.config?.show_footer !== false;

    const estimatedHeaderRows = hasHeader ? 1 : 0;
    const estimatedFooterRows = hasFooter ? 1 : 0;
    const estimatedGraphRows = Math.max(2, Math.ceil(configuredHeight / 50));

    return estimatedHeaderRows + estimatedGraphRows + estimatedFooterRows;
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
