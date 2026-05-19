/*
  Simple Band Graph Card

  Early version:
  - reads the current value from a Home Assistant entity
  - draws a static demo SVG line graph
  - draws configurable coloured threshold bands

  Next step: replace demo data with real Home Assistant history.
*/

class SimpleBandGraphCard extends HTMLElement {
  setConfig(config) {
    if (!config.entity) {
      throw new Error("You need to define an entity");
    }

    this.config = {
      name: config.name || config.entity,
      height: config.height || 180,
      y_min: config.y_min ?? 0,
      y_max: config.y_max ?? 100,
      bands: config.bands || [],
      ...config,
    };
  }

  set hass(hass) {
    this._hass = hass;
    this.render();
  }

  render() {
    const entityId = this.config.entity;
    const state = this._hass.states[entityId];

    const name = this.config.name || entityId;
    const value = state ? state.state : "unknown";
    const unit = state?.attributes?.unit_of_measurement || "";

    const width = 600;
    const height = this.config.height;

    // Padding leaves room for basic axis labels.
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

    // Convert a sensor value into an SVG Y coordinate.
    // SVG coordinates start at the top, so higher values need lower Y numbers.
    const yToSvg = (y) => {
      const clamped = clamp(y, yMin, yMax);
      const ratio = (clamped - yMin) / (yMax - yMin);
      return padding.top + plotHeight - ratio * plotHeight;
    };

    // Temporary: evenly space demo points across the X axis.
    const xToSvg = (index, total) => {
      if (total <= 1) return padding.left;
      return padding.left + (index / (total - 1)) * plotWidth;
    };

    // Static demo data until Home Assistant history support is added.
    const demoData = [
      430, 455, 470, 520, 610, 780, 920, 1050, 980, 870, 760, 690,
      720, 830, 960, 1120, 1350, 1490, 1260, 980, 760, 620, 540, 500,
    ];

    const points = demoData
      .map((point, index) => `${xToSvg(index, demoData.length)},${yToSvg(point)}`)
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

            <polyline
              points="${points}"
              fill="none"
              stroke="var(--primary-color)"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></polyline>
          </svg>

          <div style="font-size: 12px; opacity: 0.65; margin-top: 4px;">
            Static demo data — history support coming next.
          </div>
        </div>
      </ha-card>
    `;
  }

  getCardSize() {
    return 4;
  }
}

customElements.define("simple-band-graph-card", SimpleBandGraphCard);
