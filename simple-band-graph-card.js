/*
  Simple Band Graph Card
*/

class SimpleBandGraphCard extends HTMLElement {
  setConfig(config) {
    if (!config.entity) {
      throw new Error("You need to define an entity");
    }

    this.config = {
      name: config.name || config.entity,
      height: config.height || 180,
      hours_to_show: config.hours_to_show ?? 24,
      y_min: config.y_min ?? 0,
      y_max: config.y_max ?? 100,
      bands: config.bands || [],

      show_bands: config.show_bands ?? true,

      background_color: config.background_color ?? "var(--card-background-color)",
      background_opacity: config.background_opacity ?? 1,
      background_color_mode: config.background_color_mode ?? "static",

      plot_background_color: config.plot_background_color ?? "var(--card-background-color)",
      plot_background_opacity: config.plot_background_opacity ?? 0.35,
      plot_background_color_mode: config.plot_background_color_mode ?? "static",
      plot_background_radius: config.plot_background_radius ?? 8,

      top_ribbon_background_color:
        config.top_ribbon_background_color ?? "transparent",
      top_ribbon_background_opacity:
        config.top_ribbon_background_opacity ?? 0,
      top_ribbon_background_color_mode:
        config.top_ribbon_background_color_mode ?? "static",

      bottom_ribbon_background_color:
        config.bottom_ribbon_background_color ?? "transparent",
      bottom_ribbon_background_opacity:
        config.bottom_ribbon_background_opacity ?? 0,
      bottom_ribbon_background_color_mode:
        config.bottom_ribbon_background_color_mode ?? "static",

      ribbon_background_radius: config.ribbon_background_radius ?? 8,
      ribbon_color_mode: config.ribbon_color_mode ?? "static",

      max_history_points: config.max_history_points ?? "auto",
      history_refresh_interval: config.history_refresh_interval ?? 60,

      debug_multiline: config.debug_multiline ?? false,
      debug_performance: config.debug_performance ?? false,
      debug_level:
        config.debug_level ??
        (config.debug_performance ? "performance" : "basic"),

      show_line: config.show_line ?? true,
      line_color: config.line_color ?? "var(--primary-color)",
      line_color_mode: config.line_color_mode ?? "static",
      line_width: config.line_width ?? 3,
      line_opacity: config.line_opacity ?? 1,

      show_x_grid: config.show_x_grid ?? false,
      show_y_grid: config.show_y_grid ?? false,
      grid_color: config.grid_color ?? "var(--divider-color)",
      grid_width: config.grid_width ?? 1,
      grid_opacity: config.grid_opacity ?? 0.35,

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

      show_x_axis: config.show_x_axis ?? true,
      show_x_axis_labels: config.show_x_axis_labels ?? true,
      x_axis_position: config.x_axis_position ?? "bottom",
      x_axis_label_mode: config.x_axis_label_mode ?? "relative",
      x_axis_ticks: config.x_axis_ticks ?? 3,

      show_y_axis: config.show_y_axis ?? true,
      show_y_axis_labels: config.show_y_axis_labels ?? true,
      y_axis_position: config.y_axis_position ?? "left",
      y_axis_ticks: config.y_axis_ticks ?? 2,

      axis_label_size: config.axis_label_size ?? 11,
      axis_label_weight: config.axis_label_weight ?? 400,
      axis_label_color: config.axis_label_color ?? "var(--secondary-text-color)",
      axis_label_color_mode: config.axis_label_color_mode ?? "static",
      axis_label_opacity: config.axis_label_opacity ?? 0.8,

      top_left: config.top_left ?? "name",
      top_center: config.top_center ?? "none",
      top_right: config.top_right ?? "current",
      bottom_left: config.bottom_left ?? "none",
      bottom_center: config.bottom_center ?? "none",
      bottom_right: config.bottom_right ?? "none",

      ribbon_styles: config.ribbon_styles || {},

      show_current: config.show_current ?? true,
      current_position: config.current_position ?? null,

      show_latest: config.show_latest ?? false,
      show_latest_label: config.show_latest_label ?? true,
      latest_marker_size: config.latest_marker_size ?? 4,

      show_min: config.show_min ?? config.show_extrema ?? false,
      show_max: config.show_max ?? config.show_extrema ?? false,

      show_extrema_labels: config.show_extrema_labels ?? true,
      extrema_marker_size: config.extrema_marker_size ?? 4,
      extrema_label_mode: config.extrema_label_mode ?? "value",

      hide_recent_min: config.hide_recent_min ?? config.hide_recent_extrema ?? true,
      hide_recent_max: config.hide_recent_max ?? config.hide_recent_extrema ?? false,
      recent_extrema_minutes: config.recent_extrema_minutes ?? 30,

      ...config,
    };

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

  render() {
    const renderStarted = performance.now();

    if (!this._hass) return;

    const entityId = this.config.entity;
    const state = this._hass.states[entityId];

    const name = this.config.name || entityId;
    const rawValue = state ? Number(state.state) : NaN;
    const value = state ? state.state : "unknown";
    const unit = state?.attributes?.unit_of_measurement || "";
    const currentText = `${value}${unit}`;

    const width = 600;
    const height = this.config.height;

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

    const formatValue = (number) => {
      if (!Number.isFinite(number)) return "–";

      if (Math.abs(number) >= 100) {
        return number.toFixed(0);
      }

      if (Math.abs(number) >= 10) {
        return number.toFixed(1);
      }

      return number.toFixed(2);
    };

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

    const currentBand = getBandForValue(rawValue);
    const currentBandText = currentBand?.label || "";

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

    const axisLabelColour = resolveColour(
      this.config.axis_label_color,
      this.config.axis_label_color_mode,
      this.config.axis_label_opacity
    );

    const bandLabelColour = resolveColour(
      this.config.band_label_color,
      this.config.band_label_color_mode,
      this.config.band_label_opacity
    );

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
                font-size="${cssValue(this.config.axis_label_size, 11, "px")}"
                font-weight="${cssValue(this.config.axis_label_weight, 400)}"
                fill="${axisLabelColour}"
              >
                ${formatValue(value)}
              </text>
            `;
          })
          .join("")
      : "";

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
                fill="${band.color || "rgba(128,128,128,0.15)"}"
              ></rect>

              ${
                bandLabel && !shouldHideSmallLabel
                  ? `
                    <text
                      x="${bandLabelX.x}"
                      y="${bandLabelY.y}"
                      text-anchor="${bandLabelX.anchor}"
                      dominant-baseline="${bandLabelY.baseline}"
                      font-size="${cssValue(this.config.band_label_size, 11, "px")}"
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
                  font-size="${cssValue(this.config.marker_label_size, 11, "px")}"
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
                font-size="${cssValue(this.config.axis_label_size, 11, "px")}"
                font-weight="${cssValue(this.config.axis_label_weight, 400)}"
                fill="${axisLabelColour}"
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

    const minText = extrema.min ? formatMarkerLabel(extrema.min, "min") : "";
    const maxText =
      extrema.max && extrema.max !== extrema.min
        ? formatMarkerLabel(extrema.max, "max")
        : "";

    const slotContent = {
      none: "",
      name,
      current: currentText,
      band: currentBandText,
      debug: debugText,
      status: debugText,
      entity: entityId,
      unit,
      min: minText,
      minimum: minText,
      max: maxText,
      maximum: maxText,
    };

    const renderSlot = (slotName, alignment, positionKey) => {
      const content = slotContent[slotName] ?? "";

      if (!content) {
        return `<div></div>`;
      }

      const isPrimary = slotName === "current";
      const isDebug = slotName === "debug" || slotName === "status";

      const defaultFontSize = isPrimary ? "22px" : isDebug ? "12px" : "16px";
      const defaultFontWeight =
        isPrimary ? "700" : slotName === "name" ? "600" : "500";
      const defaultOpacity = isDebug ? "0.65" : "1";
      const defaultColor = isDebug
        ? "var(--secondary-text-color)"
        : "var(--primary-text-color)";

      const style = this.config.ribbon_styles?.[positionKey] || {};

      const fontSize = cssValue(style.font_size, defaultFontSize, "px");
      const fontWeight = cssValue(style.font_weight, defaultFontWeight);
      const colourMode = style.color_mode ?? this.config.ribbon_color_mode ?? "static";
      const colourOpacity = style.color_opacity ?? style.opacity ?? defaultOpacity;
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

    this.innerHTML = `
      <ha-card style="background: ${cardBackground.colour};">
        <div style="padding: 16px;">
          ${topRibbonHtml}

          <svg
            viewBox="0 0 ${width} ${height}"
            preserveAspectRatio="none"
            style="width: 100%; height: ${height}px; display: block; margin-top: 12px;"
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

          ${bottomRibbonHtml}
        </div>
      </ha-card>
    `;

    this._lastRenderDurationMs = Math.round(performance.now() - renderStarted);
    this._renderCount += 1;
  }

  getCardSize() {
    return 4;
  }
}

if (!customElements.get("simple-band-graph-card")) {
  customElements.define("simple-band-graph-card", SimpleBandGraphCard);
}
