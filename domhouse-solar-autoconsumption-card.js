console.info("%c ☀️ DOMHOUSE-SOLAR-AUTOCONSUMPTION-CARD v3.1 (TAP ACTION SUPPORT) IS LOADED ", "color: white; background: #FF9800; font-weight: bold;");

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
      language: "it",
      color_low: "#F44336",
      color_med: "#FF9800",
      color_high: "#4CAF50",
      icon_low: "mdi:alert-circle",
      icon_med: "mdi:leaf-maple",
      icon_high: "mdi:leaf",
      font_size: 14,
      icon_size: 26,
      card_padding: 10
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
    const entityBatt = this._config.entity_battery;

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

    let battery = 0;
    if (entityBatt && this.hass.states[entityBatt]) {
        battery = parseFloat(this.hass.states[entityBatt].state) || 0;
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

  // --- GESTIONE TAP ACTION (NOVITÀ v3.1) ---
  _handleAction() {
    if (this._config.tap_action) {
      // Se è definito un tap_action custom (es. browser_mod), passalo ad HA
      const event = new Event("hass-action", { bubbles: true, composed: true });
      event.detail = {
        config: this._config,
        action: "tap"
      };
      this.dispatchEvent(event);
    } else {
      // Comportamento di default: apri il more-info del consumo di casa
      const event = new Event("hass-more-info", { bubbles: true, composed: true });
      event.detail = { entityId: this._config.entity_consumption };
      this.dispatchEvent(event);
    }
  }

  static get styles() {
    return css`
      ha-card {
        border-radius: 10px;
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
        z-index: 1;
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
//  VISUAL EDITOR CLASS (Invariato, tap_action si imposta da YAML)
// =============================================================================
class DomHouseSolarAutoconsumptionCardEditor extends LitElement {
  static get properties() {
    return { hass: {}, _config: {}, };
  }
  setConfig(config) { this._config = config; }
  render() {
    if (!this.hass || !this._config) return html``;
    return html`
      <div class="card-config">
        <h3>Configurazione Principale</h3>
        <ha-textfield label="Titolo (Opzionale)" .value="${this._config.name || ''}" .configValue="${'name'}" @input="${this._valueChanged}" style="width: 100%; margin-bottom: 20px;"></ha-textfield>
        <ha-selector .hass=${this.hass} .selector=${{ select: { options: [ { value: "it", label: "Italiano 🇮🇹" }, { value: "en", label: "English 🇬🇧" } ]}}} .value=${this._config.language || 'it'} .configValue=${"language"} .label=${"Lingua / Language"} @value-changed=${this._valueChanged} style="margin-bottom: 20px;"></ha-selector>

        <div class="sensor-group">
            <h4>Sensori Energia (Watt)</h4>
            <ha-selector .hass=${this.hass} .selector=${{ entity: { domain: "sensor", device_class: "power" } }} .value=${this._config.entity_production || ""} .configValue=${"entity_production"} .label=${"Produzione (Fotovoltaico)"} @value-changed=${this._valueChanged} style="margin-bottom: 10px;"></ha-selector>
            <ha-selector .hass=${this.hass} .selector=${{ entity: { domain: "sensor", device_class: "power" } }} .value=${this._config.entity_consumption || ""} .configValue=${"entity_consumption"} .label=${"Consumo (Casa)"} @value-changed=${this._valueChanged} style="margin-bottom: 10px;"></ha-selector>
            <ha-selector .hass=${this.hass} .selector=${{ entity: { domain: "sensor", device_class: "power" } }} .value=${this._config.entity_battery || ""} .configValue=${"entity_battery"} .label=${"Batteria in Scarica (Opzionale)"} @value-changed=${this._valueChanged}></ha-selector>
        </div>

        <h3>Dimensioni e Spazi (Layout)</h3>
        <div class="sensor-group">
            <div class="style-row" style="grid-template-columns: 1fr 1fr 1fr;">
                 <ha-textfield label="Font (px)" type="number" .value="${this._config.font_size !== undefined ? this._config.font_size : 14}" .configValue="${'font_size'}" @input="${this._valueChanged}"></ha-textfield>
                 <ha-textfield label="Icona (px)" type="number" .value="${this._config.icon_size !== undefined ? this._config.icon_size : 26}" .configValue="${'icon_size'}" @input="${this._valueChanged}"></ha-textfield>
                 <ha-textfield label="Padding (px)" type="number" .value="${this._config.card_padding !== undefined ? this._config.card_padding : 10}" .configValue="${'card_padding'}" @input="${this._valueChanged}"></ha-textfield>
            </div>
        </div>

        <h3>Colori e Icone Stati</h3>
        <div class="sensor-group">
            <h4>Stato Basso (0-30%)</h4>
            <div class="style-row">
                <ha-textfield .value=${this._config.color_low || '#F44336'} .configValue=${'color_low'} .label=${"Colore Sfondo"} @input=${this._valueChanged}></ha-textfield>
                <ha-selector .hass=${this.hass} .selector=${{ icon: {} }} .value=${this._config.icon_low || 'mdi:alert-circle'} .configValue=${"icon_low"} .label=${"Icona"} @value-changed=${this._valueChanged}></ha-selector>
            </div>
        </div>

        <div class="sensor-group">
            <h4>Stato Medio (31-70%)</h4>
            <div class="style-row">
                <ha-textfield .value=${this._config.color_med || '#FF9800'} .configValue=${'color_med'} .label=${"Colore Sfondo"} @input=${this._valueChanged}></ha-textfield>
                <ha-selector .hass=${this.hass} .selector=${{ icon: {} }} .value=${this._config.icon_med || 'mdi:leaf-maple'} .configValue=${"icon_med"} .label=${"Icona"} @value-changed=${this._valueChanged}></ha-selector>
            </div>
        </div>

        <div class="sensor-group">
            <h4>Stato Alto (>71%)</h4>
            <div class="style-row">
                <ha-textfield .value=${this._config.color_high || '#4CAF50'} .configValue=${'color_high'} .label=${"Colore Sfondo"} @input=${this._valueChanged}></ha-textfield>
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

    let newValue = ev.type === 'value-changed' ? ev.detail.value : target.value;
    if (target.type === 'number') newValue = Number(newValue);

    if (this._config[configValue] === newValue) return;

    const newConfig = { ...this._config };
    if (newValue === "" || newValue === undefined || newValue === null) delete newConfig[configValue];
    else newConfig[configValue] = newValue;

    this._config = newConfig;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config }, bubbles: true, composed: true, }));
  }
  static get styles() {
    return css`
      .card-config { padding: 10px; }
      .sensor-group { border: 1px solid var(--divider-color); padding: 15px; border-radius: 8px; margin-bottom: 12px; background: var(--secondary-background-color); }
      .sensor-group h4 { margin: 0 0 10px 0; opacity: 0.8; }
      .style-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; align-items: center; }
      h3 { margin-bottom: 10px; margin-top: 20px; opacity: 0.9;}
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
