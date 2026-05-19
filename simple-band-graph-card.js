/*
  Simple Band Graph Card

  Current version:
  - reads the current value from a Home Assistant entity
  - fetches recent Home Assistant history for that entity
  - draws an SVG line graph
  - draws configurable coloured threshold bands
  - supports configurable top and bottom ribbon slots
  - optionally marks minimum and maximum values in the displayed period
  - allows recent min/max markers to be hidden separately
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

      // Ribbon slots
      top_left: config.top_left ?? "name",
      top_center: config.top_center ?? "none",
      top_right: config.top_right ?? "current",
      bottom_left: config.bottom_left ?? "status",
      bottom_center: config.bottom_center ?? "none",
      bottom_right: config.bottom_right ?? "none",

      // Backwards compatibility with earlier current value config
      show_current: config.show_current ?? true,
      current_position: config.current_position ?? null,

      // Backwards compatible: show_extrema can still switch both on.
      show_min: config.show_min ?? config.show_extrema ?? false,
      show_max: config.show_max ?? config.show_extrema ?? false,

      show_extrema_labels: config.show_extrema_labels ?? true,
      extrema_marker_size: config.extrema_marker_size ?? 4,

      hide_recent_min: config.hide_recent_min ?? config.hide_recent_extrema ?? true,
      hide_recent_max: config.hide_recent_max ?? config.hide_recent_extrema ?? false,
      recent_extrema_minutes: config.recent_extrema_minutes ?? 30,

      ...config,
    };

    /*
      If someone is still using the old current_position option, map it onto
      the new ribbon slot system.
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

    this._history = [];
    this._historyKey = "";
    this._isFetchingHistory = false;
  }

  set hass(hass) {
    this._hass = hass;

    const key = `${this.config.entity}-${this.config.hours_to_show}`;

    if (this._historyKey !== key && !this._isFetchingHistory) {
      this._historyKey = key;
      this.fetchHistory();
    }

    this.render();
  }

  async fetchHistory() {
    this._isFetchingHistory = true;

    const entityId = this.config.entity;
    const hoursToShow = Number(this.config.hours_to_show);

    const start = new Date();
    start.setHours(start.getHours() - hoursToShow);

    try {
      const history = await this._hass.callApi(
        "GET",
        `history/period/${start.toISOString()}?filter_entity_id=${encodeURIComponent(entityId)}`
      );

      const entityHistory =
        Array.isArray(history) && Array.isArray(history[0]) ? history[0] : [];

      this._history = entityHistory
        .map((item) => ({
          state: Number(item.state),
          time: new Date(item.last_changed).getTime(),
        }))
        .filter((item) => Number.isFinite(item.state) && Number.isFinite(item.time));
    } catch (error) {
      console.error("Simple Band Graph Card: failed to fetch history", error);
      this._history = [];
    }

    this._isFetchingHistory = false;
    this.render();
  }

  render() {
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

    const padding = {
      top: 14,
      right: 14,
      bottom: 24,
      left: 42,
    };

    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;

    const yMin = Number(this.config.y_min);
    const yMax = Number(this.config.y_max);

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    const yToSvg = (y) => {
      const clamped = clamp(y, yMin, yMax);
      const ratio = (clamped - yMin) / (yMax - yMin);
      return padding.top + plotHeight - ratio * plotHeight;
    };

    const now = Date.now();
    const startTime = now - Number(this.config.hours_to_show) * 60 * 60 * 1000;

    const xToSvg = (timestamp) => {
      const ratio = (timestamp - startTime) / (now - startTime);
      return padding.left + clamp(ratio, 0, 1) * plotWidth;
    };

    const points = this._history
      .map((point) => `${xToSvg(point.time)},${yToSvg(point.state)}`)
      .join(" ");

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

    const getCurrentBand = () => {
      if (!Number.isFinite(rawValue)) return null;

      return (
        this.config.bands.find((band) => {
          const from = Number(band.from);
          const to = Number(band.to);
          return rawValue >= from && rawValue <= to;
        }) || null
      );
    };

    const currentBand = getCurrentBand();
    const currentBandText = currentBand?.label || "";

    const bands = this.config.bands
      .map((band) => {
        const from = Number(band.from);
        const to = Number(band.to);

        const y1 = yToSvg(to);
        const y2 = yToSvg(from);
        const bandHeight = y2 - y1;

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
            band.label
              ? `
                <text
                  x="${padding.left + 8}"
                  y="${y1 + 16}"
                  font-size="11"
                  fill="var(--secondary-text-color)"
                  opacity="0.75"
                >
                  ${band.label}
                </text>
              `
              : ""
          }
        `;
      })
      .join("");

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

    const buildExtremaMarker = (point) => {
      if (!point) return "";

      const markerSize = Number(this.config.extrema_marker_size);
      const x = xToSvg(point.time);
      const y = yToSvg(point.state);

      const labelText = `${formatValue(point.state)}${unit}`;

      const estimatedLabelWidth = labelText.length * 6.5;
      const labelHeight = 16;
      const gap = 8;

      const plotRight = padding.left + plotWidth;
      const plotTop = padding.top;
      const plotBottom = padding.top + plotHeight;

      const placeLeft = x + gap + estimatedLabelWidth > plotRight;
      const labelX = placeLeft ? x - gap - estimatedLabelWidth : x + gap;

      const midpoint = yMin + (yMax - yMin) / 2;
      const preferredLabelY = point.state >= midpoint ? y - 18 : y + 18;

      const labelY = clamp(preferredLabelY, plotTop + labelHeight, plotBottom - 4);

      const backgroundX = labelX - 4;
      const backgroundY = labelY - 12;

      return `
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
          this.config.show_extrema_labels
            ? `
              <rect
                x="${backgroundX}"
                y="${backgroundY}"
                width="${estimatedLabelWidth + 8}"
                height="${labelHeight}"
                rx="4"
                fill="var(--card-background-color)"
                opacity="0.75"
              ></rect>

              <text
                x="${labelX}"
                y="${labelY}"
                font-size="11"
                fill="var(--primary-text-color)"
                opacity="0.9"
              >
                ${labelText}
              </text>
            `
            : ""
        }
      `;
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

    const extremaMarkers = `
      ${showMin ? buildExtremaMarker(extrema.min) : ""}
      ${showMax ? buildExtremaMarker(extrema.max) : ""}
    `;

    const statusText = this._isFetchingHistory
      ? "Loading history..."
      : this._history.length > 0
        ? `${this._history.length} history points · ${this.config.hours_to_show}h`
        : "No history data found";

    const slotContent = {
      none: "",
      name,
      current: currentText,
      band: currentBandText,
      status: statusText,
      entity: entityId,
      unit,
    };

    const renderSlot = (slotName, position) => {
      const content = slotContent[slotName] ?? "";

      if (!content) {
        return `<div></div>`;
      }

      const isPrimary = slotName === "current";
      const isStatus = slotName === "status";

      return `
        <div
          style="
            text-align: ${position};
            font-size: ${isPrimary ? "22px" : isStatus ? "12px" : "16px"};
            font-weight: ${isPrimary ? "700" : slotName === "name" ? "600" : "500"};
            opacity: ${isStatus ? "0.65" : "1"};
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          "
        >
          ${content}
        </div>
      `;
    };

    const renderRibbon = (left, center, right, marginTop = 0) => {
      const hasContent = [left, center, right].some((slot) => {
        const content = slotContent[slot] ?? "";
        return content !== "";
      });

      if (!hasContent) return "";

      return `
        <div
          style="
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            align-items: baseline;
            gap: 12px;
            margin-top: ${marginTop}px;
          "
        >
          ${renderSlot(left, "left")}
          ${renderSlot(center, "center")}
          ${renderSlot(right, "right")}
        </div>
      `;
    };

    const topRibbonHtml = renderRibbon(
      this.config.top_left,
      this.config.top_center,
      this.config.top_right,
      0
    );

    const bottomRibbonHtml = renderRibbon(
      this.config.bottom_left,
      this.config.bottom_center,
      this.config.bottom_right,
      6
    );

    this.innerHTML = `
      <ha-card>
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
              rx="8"
              fill="var(--card-background-color)"
              opacity="0.35"
            ></rect>

            ${bands}

            <line
              x1="${padding.left}"
              y1="${padding.top}"
              x2="${padding.left}"
              y2="${padding.top + plotHeight}"
              stroke="var(--divider-color)"
              stroke-width="1"
            ></line>

            <line
              x1="${padding.left}"
              y1="${padding.top + plotHeight}"
              x2="${padding.left + plotWidth}"
              y2="${padding.top + plotHeight}"
              stroke="var(--divider-color)"
              stroke-width="1"
            ></line>

            <text
              x="${padding.left - 8}"
              y="${padding.top + 4}"
              text-anchor="end"
              font-size="11"
              fill="var(--secondary-text-color)"
            >
              ${yMax}
            </text>

            <text
              x="${padding.left - 8}"
              y="${padding.top + plotHeight}"
              text-anchor="end"
              font-size="11"
              fill="var(--secondary-text-color)"
            >
              ${yMin}
            </text>

            ${
              points
                ? `
                  <polyline
                    points="${points}"
                    fill="none"
                    stroke="var(--primary-color)"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></polyline>

                  ${extremaMarkers}
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
  }

  getCardSize() {
    return 4;
  }
}

if (!customElements.get("simple-band-graph-card")) {
  customElements.define("simple-band-graph-card", SimpleBandGraphCard);
}
