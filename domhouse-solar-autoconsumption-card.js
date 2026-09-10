console.info("%c ☀️ DOMHOUSE-SOLAR-AUTOCONSUMPTION-CARD v3.2.1 (MULTI-BATTERY FIX) IS LOADED ", "color: white; background: #FF9800; font-weight: bold;");

const LitElement = customElements.get("ha-panel-lovelace")
  ? Object.getPrototypeOf(customElements.get("ha-panel-lovelace"))
  : Object.getPrototypeOf(customElements.get("hc-lovelace"));
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

// =============================================================================
//  MAIN CARD CLASS
// =============================================================================
class DomHouseSolarAutoconsumptionCard extends LitElement {
  static get properties() {
    return {
      _config: {},
      hass: {},
    };
  }

  static getConfigElement() {
    return document.createElement("domhouse-solar-autoconsumption-card-editor");
  }

  static getStubConfig() {
    return {
      name: "",
      entity_production: "",
      entity_consumption: "",
      entity_battery: "",
      entity_battery_neg: "",
      entity_battery_bidir: "",
      entity_battery_bidir_pos: "",
      language: "it",
      color_low: "#F44336",
      color_med: "#FF9800",
      color_high: "#4CAF50",
      icon_low: "mdi:alert-circle",
      icon_med: "mdi:leaf-maple",
      icon_high: "mdi:leaf",
      font_size: 14,
      icon_size: 26,
      card_padding: 10,
      border_radius: 10
    };
  }

  setConfig(config) {
    if (!config.entity_production || !config.entity_consumption) {
      throw new Error("Devi definire sia il sensore di Produzione che quello di Consumo.");
    }
    this._config = config;
  }

  render() {
    if (!this._config || !this.hass) return html``;

    const entityProd = this._config.entity_production;
    const entityCons = this._config.entity_consumption;

    const stateObjProd = this.hass.states[entityProd];
    const stateObjCons = this.hass.states[entityCons];

    if (!stateObjProd || !stateObjCons) {
      return html`
        <ha-card class="not-found" style="background-color: #333; color: white; padding: 16px;">
          ⚠️ Entità obbligatorie mancanti:<br>
          ${!stateObjProd ? `- Produzione: ${entityProd}<br>` : ''}
          ${!stateObjCons ? `- Consumo: ${entityCons}` : ''}
        </ha-card>
      `;
    }

    // --- CALCOLO ENERGIA ---
    const production = parseFloat(stateObjProd.state) || 0;
    const consumption = parseFloat(stateObjCons.state) || 0;

    // --- LOGICA MULTI-BATTERIA ---
    let battery = 0;

    // 1. Scarica Batteria (Solo Positivo)
    if (this._config.entity_battery && this.hass.states[this._config.entity_battery]) {
        const val = parseFloat(this.hass.states[this._config.entity_battery].state) || 0;
        if (val > 0) battery += val;
    }
    // 2. Scarica Batteria (Solo Negativo)
    if (this._config.entity_battery_neg && this.hass.states[this._config.entity_battery_neg]) {
        const val = parseFloat(this.hass.states[this._config.entity_battery_neg].state) || 0;
        if (val < 0) battery += Math.abs(val);
    }
    // 3. Batteria Bidirezionale (Negativo = Scarica)
    if (this._config.entity_battery_bidir && this.hass.states[this._config.entity_battery_bidir]) {
        const val = parseFloat(this.hass.states[this._config.entity_battery_bidir].state) || 0;
        if (val < 0) battery += Math.abs(val);
    }
    // 4. Batteria Bidirezionale (Positivo = Scarica)
    if (this._config.entity_battery_bidir_pos && this.hass.states[this._config.entity_battery_bidir_pos]) {
        const val = parseFloat(this.hass.states[this._config.entity_battery_bidir_pos].state) || 0;
        if (val > 0) battery += val;
    }

    let percentage = 0;
    if (consumption > 0) {
        const cleanEnergyAvailable = production + battery;
        const cleanEnergyUsed = Math.min(cleanEnergyAvailable, consumption);
        percentage = (cleanEnergyUsed / consumption) * 100;
    }

    percentage = Math.round(percentage);
    percentage = Math.min(Math.max(percentage, 0), 100);

    // --- CONFIGURAZIONE VISUALE ---
    const colorLow = this._config.color_low || "#F44336";
    const colorMed = this._config.color_med || "#FF9800";
    const colorHigh = this._config.color_high || "#4CAF50";

    const iconLow = this._config.icon_low || "mdi:alert-circle";
    const iconMed = this._config.icon_med || "mdi:leaf-maple";
    const iconHigh = this._config.icon_high || "mdi:leaf";

    const lang = this._config.language || 'it';
    const fontSize = this._config.font_size !== undefined ? this._config.font_size : 14;
    const iconSize = this._config.icon_size !== undefined ? this._config.icon_size : 26;
    const cardPadding = this._config.card_padding !== undefined ? this._config.card_padding : 10;
    const borderRadius = this._config.border_radius !== undefined ? this._config.border_radius : 10;

    let content = html``;
    let iconName = iconHigh;
    let bgColor = colorHigh;

    // --- LOGICA TESTI ---
    if (lang === 'en') {
        if (percentage === 0) {
            content = html`You are not using clean energy right now.`;
            iconName = this._config.icon_low || "mdi:transmission-tower";
            bgColor = colorLow;
        }
        else if (percentage >= 1 && percentage <= 30) {
            content = html`You are using only <b>${percentage}%</b> of clean energy.<br> Green consumption is low.`;
            iconName = iconLow;
            bgColor = colorLow;
        }
        else if (percentage >= 31 && percentage <= 70) {
            content = html`You are using <b>${percentage}%</b> of clean energy.<br> Green consumption is moderate.`;
            iconName = iconMed;
            bgColor = colorMed;
        }
        else {
            content = html`Great! You are using <b>${percentage}%</b> of clean energy.<br> Well done!`;
            iconName = iconHigh;
            bgColor = colorHigh;
        }
    } else {
        if (percentage === 0) {
            content = html`Non stai utilizzando energia pulita in questo momento.`;
            iconName = this._config.icon_low || "mdi:transmission-tower";
            bgColor = colorLow;
        }
        else if (percentage >= 1 && percentage <= 30) {
            const article = (percentage === 1) ? "l'" : "il ";
            content = html`Stai utilizzando solo ${article}<b>${percentage}%</b> di energia pulita.<br> Il consumo di energia pulita è basso.`;
            iconName = iconLow;
            bgColor = colorLow;
        }
        else if (percentage >= 31 && percentage <= 70) {
            content = html`Stai utilizzando il <b>${percentage}%</b> di energia pulita. <br> Il consumo di energia pulita è moderato.`;
            iconName = iconMed;
            bgColor = colorMed;
        }
        else {
            let article = "il ";
            if (percentage >= 80 && percentage <= 89) article = "l'";
            content = html`Stai utilizzando ${article}<b>${percentage}%</b> di energia pulita.<br> Complimenti per il risparmio!`;
            iconName = iconHigh;
            bgColor = colorHigh;
        }
    }

    return html`
      <ha-card
        style="
          background-color: ${bgColor};
          --custom-font-size: ${fontSize}px;
          --custom-icon-size: ${iconSize}px;
          --custom-padding: ${cardPadding}px;
          --custom-border-radius: ${borderRadius}px;
        "
        @click="${this._handleAction}"
      >
        <div class="shine-effect"></div>

        ${this._config.name
            ? html`<div class="header">${this._config.name}</div>`
            : html``
        }

        <div class="content">
          <ha-icon icon="${iconName}" class="icon"></ha-icon>
          <span class="text">${content}</span>
        </div>
      </ha-card>
    `;
  }

  // --- GESTIONE TAP ACTION ---
  _handleAction() {
    if (this._config.tap_action) {
      const event = new Event("hass-action", { bubbles: true, composed: true });
      event.detail = {
        config: this._config,
        action: "tap"
      };
      this.dispatchEvent(event);
    } else {
      const event = new Event("hass-more-info", { bubbles: true, composed: true });
      event.detail = { entityId: this._config.entity_consumption };
      this.dispatchEvent(event);
    }
  }

  static get styles() {
    return css`
      ha-card {
        border-radius: var(--custom-border-radius, 10px);
        padding: 0;
        position: relative;
        overflow: hidden;
        color: var(--primary-text-color);
        transition: background-color 0.5s ease;
        cursor: pointer;
      }

      .header {
        font-weight: bold;
        opacity: 0.9;
        padding: 8px 0 0 0;
        text-align: center;
        font-size: 13px;
      }

      .content {
        position: relative;
        z-1;
        text-align: center;
        font-size: var(--custom-font-size, 14px);
        padding: var(--custom-padding, 10px);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        line-height: 1.3em;
      }

      .icon {
        color: #FFD700;
        margin-bottom: 4px;
        --mdc-icon-size: var(--custom-icon-size, 26px);
        filter: drop-shadow(0px 1px 2px rgba(0,0,0,0.3));
      }

      .text b {
        font-weight: 900;
        opacity: 1;
      }

      .shine-effect {
        position: absolute;
        top: 0;
        left: -75%;
        width: 50%;
        height: 100%;
        background: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0) 100%);
        transform: skewX(-20deg);
        animation: shine 4s infinite linear;
        pointer-events: none;
      }

      @keyframes shine {
        0% { left: -75%; }
        100% { left: 100%; }
      }
    `;
  }
}
customElements.define("domhouse-solar-autoconsumption-card", DomHouseSolarAutoconsumptionCard);


// =============================================================================
//  VISUAL EDITOR CLASS
// =============================================================================
class DomHouseSolarAutoconsumptionCardEditor extends LitElement {
  static get properties() {
    return { hass: {}, _config: {}, };
  }
  setConfig(config) { this._config = config; }
  _renderClearableEntitySelector({ selector, value, configValue, label, style }) {
    const currentValue = value || "";
    return html`
      <div class="entity-row" style=${style || ""}>
        <ha-selector
          .hass=${this.hass}
          .selector=${selector}
          .value=${currentValue}
          .configValue=${configValue}
          .label=${label}
          @value-changed=${this._valueChanged}
        ></ha-selector>
        <ha-icon-button
          class="clear-btn"
          title="Svuota"
          .disabled=${!currentValue}
          @click=${(ev) => {
            ev.stopPropagation();
            this._setConfigValue(configValue, "");
          }}
        >
          <ha-icon icon="mdi:close"></ha-icon>
        </ha-icon-button>
      </div>
    `;
  }

  _setConfigValue(configValue, newValue) {
    if (!this._config || !this.hass) return;
    if (!configValue) return;

    let value = newValue;
    if (['font_size', 'icon_size', 'card_padding', 'border_radius'].includes(configValue)) {
      value = value === "" ? undefined : Number(value);
    }

    if (this._config[configValue] === value) return;

    const newConfig = { ...this._config };
    if (value === "" || value === undefined || value === null) delete newConfig[configValue];
    else newConfig[configValue] = value;

    this._config = newConfig;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config }, bubbles: true, composed: true, }));
  }
  render() {
    if (!this.hass || !this._config) return html``;
    return html`
      <div class="card-config">
        <h3>Configurazione Principale</h3>
        <ha-selector
            .hass=${this.hass}
            .selector=${{ text: {} }}
            .value=${this._config.name || ''}
            .configValue=${"name"}
            .label=${"Titolo (Opzionale)"}
            @value-changed=${this._valueChanged}
            style="width: 100%; margin-bottom: 20px;">
        </ha-selector>

        <ha-selector .hass=${this.hass} .selector=${{ select: { options: [ { value: "it", label: "Italiano 🇮🇹" }, { value: "en", label: "English 🇬🇧" } ]}}} .value=${this._config.language || 'it'} .configValue=${"language"} .label=${"Lingua / Language"} @value-changed=${this._valueChanged} style="margin-bottom: 20px;"></ha-selector>

        <div class="sensor-group">
            <h4>Sensori Energia (Watt)</h4>
            ${this._renderClearableEntitySelector({
              selector: { entity: { domain: "sensor", device_class: "power" } },
              value: this._config.entity_production,
              configValue: "entity_production",
              label: "Produzione (Fotovoltaico)",
              style: "margin-bottom: 10px;"
            })}
            ${this._renderClearableEntitySelector({
              selector: { entity: { domain: "sensor", device_class: "power" } },
              value: this._config.entity_consumption,
              configValue: "entity_consumption",
              label: "Consumo (Casa)",
              style: "margin-bottom: 10px;"
            })}
            ${this._renderClearableEntitySelector({
              selector: { entity: { domain: "sensor", device_class: "power" } },
              value: this._config.entity_battery,
              configValue: "entity_battery",
              label: "Scarica Batteria (Solo Positivo)",
              style: "margin-bottom: 10px;"
            })}
            ${this._renderClearableEntitySelector({
              selector: { entity: { domain: "sensor", device_class: "power" } },
              value: this._config.entity_battery_neg,
              configValue: "entity_battery_neg",
              label: "Scarica Batteria (Solo Negativo)",
              style: "margin-bottom: 10px;"
            })}
            ${this._renderClearableEntitySelector({
              selector: { entity: { domain: "sensor", device_class: "power" } },
              value: this._config.entity_battery_bidir,
              configValue: "entity_battery_bidir",
              label: "Batteria Bidirezionale (Negativo = Scarica)",
              style: "margin-bottom: 10px;"
            })}
            ${this._renderClearableEntitySelector({
              selector: { entity: { domain: "sensor", device_class: "power" } },
              value: this._config.entity_battery_bidir_pos,
              configValue: "entity_battery_bidir_pos",
              label: "Batteria Bidirezionale (Positivo = Scarica)"
            })}
        </div>

        <h3>Dimensioni e Spazi (Layout)</h3>
        <div class="sensor-group">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(90px, 1fr)); gap: 15px; align-items: center;">
                 <ha-selector .hass=${this.hass} .selector=${{ text: {} }} .value=${this._config.font_size !== undefined ? this._config.font_size : 14} .configValue=${"font_size"} .label=${"Font (px)"} @value-changed=${this._valueChanged}></ha-selector>
                 <ha-selector .hass=${this.hass} .selector=${{ text: {} }} .value=${this._config.icon_size !== undefined ? this._config.icon_size : 26} .configValue=${"icon_size"} .label=${"Icona (px)"} @value-changed=${this._valueChanged}></ha-selector>
                 <ha-selector .hass=${this.hass} .selector=${{ text: {} }} .value=${this._config.card_padding !== undefined ? this._config.card_padding : 10} .configValue=${"card_padding"} .label=${"Padding (px)"} @value-changed=${this._valueChanged}></ha-selector>
                 <ha-selector .hass=${this.hass} .selector=${{ text: {} }} .value=${this._config.border_radius !== undefined ? this._config.border_radius : 10} .configValue=${"border_radius"} .label=${"Bordi (px)"} @value-changed=${this._valueChanged}></ha-selector>
            </div>
        </div>

        <h3>Colori e Icone Stati</h3>
        <div class="sensor-group">
            <h4>Stato Basso (0-30%)</h4>
            <div class="style-row">
                <ha-selector .hass=${this.hass} .selector=${{ text: {} }} .value=${this._config.color_low || '#F44336'} .configValue=${"color_low"} .label=${"Colore Sfondo"} @value-changed=${this._valueChanged}></ha-selector>
                <ha-selector .hass=${this.hass} .selector=${{ icon: {} }} .value=${this._config.icon_low || 'mdi:alert-circle'} .configValue=${"icon_low"} .label=${"Icona"} @value-changed=${this._valueChanged}></ha-selector>
            </div>
        </div>

        <div class="sensor-group">
            <h4>Stato Medio (31-70%)</h4>
            <div class="style-row">
                <ha-selector .hass=${this.hass} .selector=${{ text: {} }} .value=${this._config.color_med || '#FF9800'} .configValue=${"color_med"} .label=${"Colore Sfondo"} @value-changed=${this._valueChanged}></ha-selector>
                <ha-selector .hass=${this.hass} .selector=${{ icon: {} }} .value=${this._config.icon_med || 'mdi:leaf-maple'} .configValue=${"icon_med"} .label=${"Icona"} @value-changed=${this._valueChanged}></ha-selector>
            </div>
        </div>

        <div class="sensor-group">
            <h4>Stato Alto (>71%)</h4>
            <div class="style-row">
                <ha-selector .hass=${this.hass} .selector=${{ text: {} }} .value=${this._config.color_high || '#4CAF50'} .configValue=${"color_high"} .label=${"Colore Sfondo"} @value-changed=${this._valueChanged}></ha-selector>
                <ha-selector .hass=${this.hass} .selector=${{ icon: {} }} .value=${this._config.icon_high || 'mdi:leaf'} .configValue=${"icon_high"} .label=${"Icona"} @value-changed=${this._valueChanged}></ha-selector>
            </div>
        </div>

        <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid var(--divider-color); text-align: center; opacity: 0.7; font-size: 0.9em;">
             Powered <a href="https://www.domhouse.it" target="_blank" style="color: var(--primary-color); text-decoration: none; font-weight: bold;">DomHouse.it</a>
        </div>
      </div>
    `;
  }

  _valueChanged(ev) {
    if (!this._config || !this.hass) return;
    const target = ev.target;
    const configValue = target.configValue;
    if (!configValue) return;

    let newValue = ev.detail && ev.detail.value !== undefined ? ev.detail.value : target.value;
    this._setConfigValue(configValue, newValue);
  }

  static get styles() {
    return css`
      .card-config { padding: 10px; }
      .sensor-group { border: 1px solid var(--divider-color); padding: 15px; border-radius: 8px; margin-bottom: 12px; background: var(--secondary-background-color); }
      .sensor-group h4 { margin: 0 0 10px 0; opacity: 0.8; }
      .style-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; align-items: center; }
      h3 { margin-bottom: 10px; margin-top: 20px; opacity: 0.9;}
      ha-selector { width: 100%; display: block; }
      .entity-row { display: grid; grid-template-columns: 1fr auto; gap: 8px; align-items: center; }
      .clear-btn {
        color: var(--secondary-text-color, #888);
        width: 40px;
        height: 40px;
        min-width: 40px;
        min-height: 40px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        opacity: 1;
        z-index: 2;
        --mdc-icon-button-size: 40px;
        --mdc-icon-size: 24px;
        --mdc-icon-button-ink-color: var(--secondary-text-color);
        --mdc-icon-button-disabled-ink-color: var(--disabled-text-color);
      }
      .clear-btn:hover {
        color: var(--primary-text-color, #fff);
        --mdc-icon-button-ink-color: var(--primary-text-color);
      }
      .clear-btn ha-icon {
        color: inherit;
        opacity: 1;
      }
    `;
  }
}
customElements.define("domhouse-solar-autoconsumption-card-editor", DomHouseSolarAutoconsumptionCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "domhouse-solar-autoconsumption-card",
  name: "DomHouse Solar Autoconsumption Card",
  description: "Card con calcolo autoconsumo solare/batteria, multilingua, layout personalizzabile e supporto tap_action.",
  preview: true,
  documentationURL: "https://github.com/SalvatoreITA/domhouse-solar-autoconsumption-card",
});
