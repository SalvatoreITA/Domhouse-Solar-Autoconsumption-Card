# ☀️ DomHouse Solar Autoconsumption Card

[![it](https://img.shields.io/badge/lang-it-green.svg)](https://github.com/SalvatoreITA/domhouse-solar-autoconsumption-card/blob/main/README_it.md)
[![en](https://img.shields.io/badge/lang-en-red.svg)](https://github.com/SalvatoreITA/domhouse-solar-autoconsumption-card/blob/main/README.md)

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)
[![version](https://img.shields.io/badge/version-v1.0.0-blue.svg)]()
[![maintainer](https://img.shields.io/badge/maintainer-Salvatore_Lentini_--_DomHouse.it-green.svg)](https://www.domhouse.it)

Una **Lovelace Card personalizzata** per Home Assistant che calcola e visualizza automaticamente la percentuale di autoconsumo solare. 

Dotata di animazioni, logica dinamica dei colori, icone personalizzabili e un editor visivo completo.

![Anteprima Card](CARD.png)

---

## ✨ Caratteristiche

* **⚡ Calcolo Automatico:** Non servono sensori template! Inserisci solo il sensore di *Produzione* e quello di *Consumo*: la card calcola la percentuale in tempo reale.
* **🎨 Stili Dinamici:** Colori e icone cambiano automaticamente in base a tre fasce di efficienza (Basso, Medio, Alto).
* **✨ Effetto Shine:** Animazione "bagliore" elegante che scorre sulla card.
* **📏 Layout Personalizzabile:** Modifica dimensioni del font, grandezza delle icone e padding direttamente dall'editor visivo.
* **📱 Design Compatto:** Ottimizzata per occupare poco spazio nelle dashboard, perfetta per il mobile.
* **🖱️ Editor GUI:** Configurazione 100% via interfaccia grafica, niente YAML obbligatorio.

---

## ⚙️ Installazione

### 1. Tramite HACS (Consigliato)

1. Vai su HACS > Frontend.
2. Clicca i 3 puntini in alto a destra > **Custom repositories**.
3. Inserisci l'URL di questa repository. https://github.com/SalvatoreITA/domhouse-solar-autoconsumption-card
4. Categoria: **Lovelace**.
5. Clicca **Add** e poi installa la card.

### 2. Installazione Manuale

1. Scarica il file `domhouse-solar-autoconsumption-card.js` da questo repository.
2. Caricalo nella cartella `/config/www/` del tuo Home Assistant.
3. Vai su **Impostazioni** > **Plance** > **Risorse**.
4. Aggiungi una nuova risorsa:
   * **URL:** `/local/domhouse-solar-autoconsumption-card.js`
   * **Tipo:** Modulo JavaScript
5. Riavvia Home Assistant.

---

## 🛠️ Configurazione

### Editor Visivo (GUI)
Questa card supporta pienamente l'editor visivo.
1. Nella tua Dashboard, clicca **Modifica Plancia**.
2. Clicca **Aggiungi Scheda**.
3. Cerca **DomHouse Solar Autoconsumption Card**.
4. Seleziona i sensori e personalizza colori e dimensioni a piacimento.

### Configurazione YAML (Opzionale)

Se preferisci usare il codice YAML:

```yaml
type: custom:domhouse-solar-autoconsumption-card
name: "Il mio Autoconsumo"
entity_production: sensor.fotovoltaico_potenza_attuale
entity_consumption: sensor.consumo_casa_potenza_attuale
# Opzionali - Personalizzazione Stili
color_low: "#F44336"
color_med: "#FF9800"
color_high: "#4CAF50"
icon_low: "mdi:alert-circle"
icon_med: "mdi:leaf-maple"
icon_high: "mdi:leaf"
# Opzionali - Dimensioni
font_size: 14
icon_size: 26
card_padding: 10
```
## 📋 Opzioni Disponibili

| Nome | Tipo | Obbligatorio | Default | Descrizione |
| :--- | :--- | :---: | :--- | :--- |
| `entity_production` | string | **Sì** | - | Il tuo sensore di produzione solare (deve essere in **W**). |
| `entity_consumption`| string | **Sì** | - | Il tuo sensore di consumo domestico (deve essere in **W**). |
| `name` | string | No | - | Titolo opzionale mostrato in cima alla card. |
| `color_low` | string | No | `#F44336` | Colore sfondo per efficienza bassa (0-30%). |
| `color_med` | string | No | `#FF9800` | Colore sfondo per efficienza media (31-70%). |
| `color_high` | string | No | `#4CAF50` | Colore sfondo per efficienza alta (>71%). |
| `icon_low` | string | No | `mdi:alert-circle` | Icona per efficienza bassa. |
| `icon_med` | string | No | `mdi:leaf-maple` | Icona per efficienza media. |
| `icon_high` | string | No | `mdi:leaf` | Icona per efficienza alta. |
| `font_size` | number | No | `14` | Dimensione del testo principale in pixel. |
| `icon_size` | number | No | `26` | Dimensione dell'icona centrale in pixel. |
| `card_padding` | number | No | `10` | Spaziatura interna della card in pixel. |

## 📐 Come funziona il calcolo?

La card calcola la percentuale di "Autoconsumo" applicando automaticamente questa logica:

1.  Recupera i valori di **Produzione** (FV) e **Consumo** (Casa).
2.  Calcola l'Energia Pulita effettivamente utilizzata: `Min(Produzione, Consumo)`.
3.  Calcola la Percentuale finale.

**Esempio Pratico:**
* Produzione: **2000 W**
* Consumo: **1000 W**
* **Risultato:** Stai coprendo il **100%** del tuo consumo con energia pulita (e stai esportando i restanti 1000 W).

## ❤️ Crediti
Sviluppato da [Salvatore Lentini - DomHouse.it](https://www.domhouse.it)
