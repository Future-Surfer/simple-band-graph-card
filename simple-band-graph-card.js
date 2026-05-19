/*
  Simple Band Graph Card

  Current version:
  - reads the current value from a Home Assistant entity
  - fetches recent Home Assistant history for that entity
  - draws an SVG line graph
  - draws configurable coloured threshold bands
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
      ...config,
    };

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

      const entityHistory = Array.isArray(history) && Array.isArray(history[0])
        ? history[0]
        : [];

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
    const value = state ? state.state : "unknown";
    const unit = state?.attributes?.unit_of_measurement || "";

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

    const statusText = this._isFetchingHistory
      ? "Loading history..."
      : this._history.length > 0
        ? `${this._history.length} history points · ${this.config.hours_to_show}h`
        : "No history data found";

    this.innerHTML = `
      <ha-card>
        <div style="padding: 16px;">
          <div style="display: flex; justify-content: space-between; gap: 12px; align-items: baseline;">
            <div style="font-size: 16px; font-weight: 600;">
              ${name}
            </div>

            <div style="font-size: 22px; font-weight: 700;">
              ${value}${unit}
            </div>
          </div>

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

          <div style="font-size: 12px; opacity: 0.65; margin-top: 4px;">
            ${statusText}
          </div>
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
