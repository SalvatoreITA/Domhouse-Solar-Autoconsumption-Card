# ☀️ DomHouse Solar Autoconsumption Card

[![it](https://img.shields.io/badge/lang-it-green.svg)](https://github.com/SalvatoreITA/domhouse-solar-autoconsumption-card/blob/main/README.md)
[![en](https://img.shields.io/badge/lang-en-red.svg)](https://github.com/SalvatoreITA/domhouse-solar-autoconsumption-card/blob/main/README_en.md)

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)
[![version](https://img.shields.io/badge/version-v1.0.0-blue.svg)]()
[![maintainer](https://img.shields.io/badge/maintainer-Salvatore_Lentini_--_DomHouse.it-green.svg)](https://www.domhouse.it)

A personalized **Lovelace Card** for Home Assistant that automatically calculates and displays your solar self-consumption percentage.

Featuring animations, dynamic color logic, customizable icons, and a full-featured visual editor.

![Anteprima Card](CARD.png)

---

## ✨ Characteristics

* **⚡ Automatic Calculation:** No template sensors needed! Just enter the *Production* and *Consumption* sensors: the card calculates the percentage in real time.
* **🎨 Dynamic Styles:** Colors and icons automatically change based on three efficiency levels (Low, Medium, High).
* **✨ Shine Effect:** Elegant "glow" animation that scrolls across the card.
* **📏 Customizable Layout:** Change font size, icon size, and padding directly from the visual editor.
* **📱 Compact Design:** Optimized to take up little space in dashboards, perfect for mobile.
* **🖱️ GUI Editor:** 100% configuration via graphical interface, no YAML required.

---

## ⚙️ Installation

### 1. Via HACS (Recommended)

1. Go to HACS > Frontend.
2. Click the 3 dots in the top right > **Custom repositories**.
3. Enter the URL of this repository. https://github.com/SalvatoreITA/domhouse-solar-autoconsumption-card
4. Category: **Lovelace**.
5. Click **Add** and then install the card.

### 2. Manual Installation

1. Download the `domhouse-solar-autoconsumption-card.js` file from this repository.
2. Upload it to your Home Assistant's `/config/www/` folder.
3. Go to **Settings** > **Dashboards** > **Resources**.
4. Add a new resource:
* **URL:** `/local/domhouse-solar-autoconsumption-card.js`
* **Type:** JavaScript Module
5. Restart Home Assistant.

---

## 🛠️ Configuration

### Visual Editor (GUI)
This card fully supports the visual editor.
1. From your Dashboard, click **Edit Dashboard**.
2. Click **Add Card**.
3. Search for **DomHouse Solar Autoconsumption Card**.
4. Select the sensors and customize the colors and sizes as desired.

### YAML Configuration (Optional)

If you prefer using YAML, here is a full example with all available options:

```yaml
type: custom:domhouse-solar-autoconsumption-card
name: "My Solar Efficiency"
entity_production: sensor.solar_power_watts
entity_consumption: sensor.home_power_watts

# --- Optional: Custom Colors ---
color_low: "#F44336"    # Red
color_med: "#FF9800"    # Orange
color_high: "#4CAF50"   # Green

# --- Optional: Custom Icons ---
icon_low: "mdi:alert-circle"
icon_med: "mdi:leaf-maple"
icon_high: "mdi:leaf"

# --- Optional: Layout & Dimensions ---
font_size: 14       # Default: 14
icon_size: 26       # Default: 26
card_padding: 10    # Default: 10
```
## 📋 Options Reference

| Name | Type | Required | Default | Description |
| :--- | :--- | :---: | :--- | :--- |
| `entity_production` | string | **Yes** | - | Your solar production sensor (must be in **W**). |
| `entity_consumption`| string | **Yes** | - | Your home consumption sensor (must be in **W**). |
| `name` | string | No | - | Optional title displayed at the top of the card. |
| `color_low` | string | No | `#F44336` | Background color for low efficiency (0-30%). |
| `color_med` | string | No | `#FF9800` | Background color for medium efficiency (31-70%). |
| `color_high` | string | No | `#4CAF50` | Background color for high efficiency (>71%). |
| `icon_low` | string | No | `mdi:alert-circle` | Icon for low efficiency. |
| `icon_med` | string | No | `mdi:leaf-maple` | Icon for medium efficiency. |
| `icon_high` | string | No | `mdi:leaf` | Icon for high efficiency. |
| `font_size` | number | No | `14` | Size of the main text in pixels. |
| `icon_size` | number | No | `26` | Size of the central icon in pixels. |
| `card_padding` | number | No | `10` | Internal spacing of the card in pixels. |

## 📐 How does the calculation work?

The card calculates the "Self-Consumption" percentage by automatically applying the following logic:

1. Retrieves the **Production** (PV) and **Consumption** (Home) values.
2. Calculates the actual Clean Energy used: `Min(Production, Consumption)`.
3. Calculates the final percentage.

**Practical Example:**
* Production: **2000 W**
* Consumption: **1000 W**
* **Result:** You are covering **100%** of your consumption with clean energy (and exporting the remaining 1000 W).

## ❤️ Credits
Developed by [Salvatore Lentini - DomHouse.it](https://www.domhouse.it)
