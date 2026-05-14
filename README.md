# ☀️ DomHouse Solar Autoconsumption Card

[![it](https://img.shields.io/badge/lang-it-green.svg)](https://github.com/SalvatoreITA/domhouse-solar-autoconsumption-card/blob/main/README_it.md)
[![en](https://img.shields.io/badge/lang-en-red.svg)](https://github.com/SalvatoreITA/domhouse-solar-autoconsumption-card/blob/main/README.md)

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)
[![version](https://img.shields.io/badge/version-v1.0.0-blue.svg)]()
[![maintainer](https://img.shields.io/badge/maintainer-Salvatore_Lentini_--_DomHouse.it-green.svg)](https://www.domhouse.it)

A **custom Lovelace Card** for Home Assistant that automatically calculates and displays your solar self-consumption percentage. 

Featuring animations, dynamic color logic, customizable icons, and a complete visual editor.

<div align="center">
  <img src="card.gif" alt="Card Preview">
</div>

---

## ✨ Features

* **Real-time calculation:** Instantly compares solar production and house consumption.
* **Battery/Storage Support:** If you have a battery, you can add the discharging sensor to calculate your true 100% green self-consumption, even at night!
* **Multi-language:** Natively supports Italian (IT) and English (EN).
* **Visual Editor (UI):** No need to write YAML code. You can comfortably configure everything from the Home Assistant graphical interface.
* **Customizable Layout:** Modify text size, icon size, and card padding.
* **Dynamic Colors and Icons:** 3 customization states (Low, Medium, High) that dynamically change based on the self-consumption percentage.
* **Modern Design:** Includes a "Shine" effect (animated reflection) to make your dashboard unique.

---

## ⚙️ Installation

### 1. Via HACS (Recommended)

1. Go to HACS > Frontend.
2. Click the 3 dots in the top right > **Custom repositories**.
3. Enter the URL of this repository: https://github.com/SalvatoreITA/domhouse-solar-autoconsumption-card
4. Category: **Lovelace**.
5. Click **Add** and then install the card.

### 2. Manual Installation

1. Download the `domhouse-solar-autoconsumption-card.js` file from this repository.
2. Upload it to the `/config/www/` folder of your Home Assistant.
3. Go to **Settings** > **Dashboards** > **Resources**.
4. Add a new resource:
   * **URL:** `/local/domhouse-solar-autoconsumption-card.js`
   * **Type:** JavaScript Module
5. Restart Home Assistant.

---

## 🛠️ Configuration

### Visual Editor (GUI)
This card fully supports the visual editor.
1. In your Dashboard, click **Edit Dashboard**.
2. Click **Add Card**.
3. Search for **DomHouse Solar Autoconsumption Card**.
4. Select the sensors and customize colors and dimensions as you prefer.

### YAML Configuration (Optional)

If you prefer using YAML code:

```yaml
type: custom:domhouse-solar-autoconsumption-card
name: "My Self-Consumption"
entity_production: sensor.solar_production_current_power
entity_consumption: sensor.house_consumption_current_power
entity_battery: sensor.battery_discharge_watt
# Optional - Style Customization
color_low: "#F44336"
color_med: "#FF9800"
color_high: "#4CAF50"
icon_low: "mdi:alert-circle"
icon_med: "mdi:leaf-maple"
icon_high: "mdi:leaf"
# Optional - Dimensions
font_size: 14
icon_size: 26
card_padding: 10
```

## 📚 Configuration Options

| Option | Type | Required | Default | Description |
| :--- | :--- | :---: | :--- | :--- |
| `type` | `string` | **Yes** | | Must be `custom:domhouse-solar-autoconsumption-card` |
| `entity_production` | `string` | **Yes** | | The ID of the entity measuring solar panel production in W |
| `entity_consumption` | `string` | **Yes** | | The ID of the entity measuring total house consumption in W |
| `entity_battery` | `string` | No | | The ID of the entity measuring battery **discharge**. |
| `name` | `string` | No | | The title displayed at the top of the card. |
| `language` | `string` | No | `it` | Text language: `it` (Italian) or `en` (English). |
| `color_low` | `string` | No | `#F44336` | Background color when self-consumption is between 0% and 30%. |
| `color_med` | `string` | No | `#FF9800` | Background color when self-consumption is between 31% and 70%. |
| `color_high` | `string` | No | `#4CAF50` | Background color when self-consumption is > 71%. |
| `icon_low` | `string` | No | `mdi:alert-circle`| Icon for Low state. (Note: at 0% it uses `mdi:transmission-tower`). |
| `icon_med` | `string` | No | `mdi:leaf-maple`| Icon for Medium state. |
| `icon_high` | `string` | No | `mdi:leaf` | Icon for High state. |
| `font_size` | `number` | No | `14` | Text size in pixels. |
| `icon_size` | `number` | No | `26` | Icon size in pixels. |
| `card_padding` | `number` | No | `10` | Inner space of the card (padding) in pixels. |

## 🖱️ Click Actions (Tap Action & Browser Mod)

Starting from version **v3.1**, the card natively supports the standard Home Assistant `tap_action` option.

By default, clicking on the card will open the "more-info" dialog for the **House Consumption** entity. 
However, you can customize this behavior to open other dashboards, call services, or show advanced pop-ups using integrations like **browser_mod**.

> ⚠️ **Note:** Advanced actions (like `fire-dom-event`) cannot be configured from the visual editor, but must be manually written in the card's **Code Editor (YAML)**.

### Example: Creating a Pop-Up with Browser Mod

If you have `browser_mod` installed in your Home Assistant, you can display a pop-up with the details of all energy sensors when you click the card. 

Here is how to configure it in YAML:

```yaml
type: custom:domhouse-solar-autoconsumption-card
name: Total Self-Consumption
entity_production: sensor.solar_production_watt
entity_consumption: sensor.house_consumption_watt
entity_battery: sensor.battery_discharge_watt
language: en
# --- Tap Action Configuration ---
tap_action:
  action: fire-dom-event
  browser_mod:
    service: browser_mod.popup
    data:
      title: "Energy Details"
      content:
        type: entities
        entities:
          - sensor.solar_production_watt
          - sensor.battery_discharge_watt
          - sensor.house_consumption_watt
```

## 📐 How does the calculation work?

The card calculates the "Clean Energy" percentage by automatically applying this logic:

1. Retrieves the values for **Production** (Solar), **Consumption** (House), and **Discharging Battery** (Optional).
2. Calculates the total Clean Energy available: `Production + Battery`.
3. Calculates the Clean Energy actually used for the house: `Min(Total Clean Energy, Consumption)`.
4. Calculates the final Percentage relative to the total consumption.

**Practical Example 1 (Daytime, lots of sun):**
* Production: **2000 W**
* Discharging Battery: **0 W**
* Consumption: **1000 W**
* **Result:** You are covering **100%** of your consumption with clean energy (the remaining 1000 W is being exported or used to charge the battery).

**Practical Example 2 (Evening/Night, battery support):**
* Production: **0 W**
* Discharging Battery: **500 W**
* Consumption: **500 W**
* **Result:** You are covering **100%** of your consumption in a *green* way thanks to the energy stored in the battery!

**Practical Example 3 (High consumption, drawing from the grid):**
* Production: **1000 W**
* Discharging Battery: **500 W**
* Consumption: **3000 W**
* **Result:** You have 1500 W of clean energy available. You are covering **50%** of your consumption without polluting, while the remaining 1500 W is drawn from the electrical grid.

## ❤️ Credits
Developed by [Salvatore Lentini - DomHouse.it](https://www.domhouse.it)
