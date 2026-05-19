class SimpleBandGraphCard extends HTMLElement {
  setConfig(config) {
    if (!config.entity) {
      throw new Error("You need to define an entity");
    }

    this.config = config;
  }

  set hass(hass) {
    const entityId = this.config.entity;
    const state = hass.states[entityId];

    const name = this.config.name || entityId;
    const value = state ? state.state : "unknown";
    const unit = state?.attributes?.unit_of_measurement || "";

    this.innerHTML = `
      <ha-card>
        <div style="padding: 16px;">
          <div style="font-size: 16px; font-weight: 600;">
            ${name}
          </div>

          <div style="font-size: 32px; font-weight: 700; margin-top: 8px;">
            ${value}${unit}
          </div>

          <div style="font-size: 13px; opacity: 0.7; margin-top: 8px;">
            Simple Band Graph Card is loading correctly.
          </div>
        </div>
      </ha-card>
    `;
  }

  getCardSize() {
    return 3;
  }
}

customElements.define("simple-band-graph-card", SimpleBandGraphCard);
