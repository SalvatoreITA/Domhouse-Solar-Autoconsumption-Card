# ☀️ DomHouse Solar Autoconsumption Card

[![it](https://img.shields.io/badge/lang-it-green.svg)](https://github.com/SalvatoreITA/domhouse-solar-autoconsumption-card/blob/main/README_it.md)
[![en](https://img.shields.io/badge/lang-en-red.svg)](https://github.com/SalvatoreITA/domhouse-solar-autoconsumption-card/blob/main/README.md)

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)
[![version](https://img.shields.io/badge/version-v1.0.0-blue.svg)]()
[![maintainer](https://img.shields.io/badge/maintainer-Salvatore_Lentini_--_DomHouse.it-green.svg)](https://www.domhouse.it)

Una **Lovelace Card personalizzata** per Home Assistant che calcola e visualizza automaticamente la percentuale di autoconsumo solare. 

Dotata di animazioni, logica dinamica dei colori, icone personalizzabili e un editor visivo completo.

<div align="center">
  <img src="card.gif" alt="Card Preview">
</div>

---

## ✨ Caratteristiche

* **Calcolo in tempo reale:** Confronta istantaneamente la produzione solare e il consumo della casa.
* **Supporto Accumulo/Batteria Universale** Supporta 4 tipi di sensori (solo positivo, solo negativo o bidirezionale in entrambe le logiche). La card converte automaticamente i valori in scarica per un calcolo perfetto, anche di notte!
* **Multilingua:** Supporta nativamente Italiano (IT) e Inglese (EN).
* **Editor Visivo (UI):** Non è necessario scrivere codice YAML. Puoi configurare tutto comodamente dall'interfaccia grafica di Home Assistant.
* **Layout Personalizzabile:** Modifica la grandezza del testo, delle icone e il padding della card.
* **Colori e Icone Dinamiche:** 3 stati di personalizzazione (Basso, Medio, Alto) che cambiano dinamicamente in base alla percentuale di autoconsumo.
* **Design Moderno:** Include un effetto "Shine" (riflesso animato) per rendere la tua dashboard unica.

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
# Scegli UNO dei 4 sensori batteria in base al tuo inverter:
# entity_battery: sensor.batteria_scarica_positiva
# entity_battery_neg: sensor.batteria_scarica_negativa
# entity_battery_bidir: sensor.batteria_bidirezionale_neg
entity_battery_bidir_pos: sensor.batteria_bidirezionale_pos
# Opzionali - Personalizzazione Stili
color_low: "#F44336"
color_med: "#FF9800"
color_high: "#4CAF50"
icon_low: "mdi:alert-circle"
icon_med: "mdi:leaf-maple"
icon_high: "mdi:leaf"
# Opzionali - Dimensioni e Layout
font_size: 14
icon_size: 26
card_padding: 10
border_radius: 10
```
## 📚 Opzioni di Configurazione

| Opzione | Tipo | Obbligatorio | Default | Descrizione |
| :--- | :--- | :---: | :--- | :--- |
| `type` | `string` | **Sì** | | Deve essere `custom:domhouse-solar-autoconsumption-card` |
| `entity_production` | `string` | **Sì** | | L'ID dell'entità che misura la produzione dei pannelli in W. |
| `entity_consumption` | `string` | **Sì** | | L'ID dell'entità che misura il consumo totale della casa in W. |
| `entity_battery` | `string` | No | | Sensore scarica batteria **solo positivo** (es. 500W). |
| `entity_battery_neg` | `string` | No | | Sensore scarica batteria **solo negativo** (es. -500W). |
| `entity_battery_bidir`| `string` | No | | Sensore **bidirezionale** (scarica = negativo, carica = positivo). |
| `entity_battery_bidir_pos`| `string` | No | | Sensore **bidirezionale** (scarica = positivo, carica = negativo). |
| `name` | `string` | No | | Il titolo mostrato in cima alla card. |
| `language` | `string` | No | `it` | Lingua del testo: `it` (Italiano) o `en` (Inglese). |
| `color_low` | `string` | No | `#F44336` | Colore di sfondo quando l'autoconsumo è tra 0% e 30%. |
| `color_med` | `string` | No | `#FF9800` | Colore di sfondo quando l'autoconsumo è tra 31% e 70%. |
| `color_high` | `string` | No | `#4CAF50` | Colore di sfondo quando l'autoconsumo è > 71%. |
| `icon_low` | `string` | No | `mdi:alert-circle`| Icona per stato Basso. (Nota: allo 0% usa `mdi:transmission-tower`). |
| `icon_med` | `string` | No | `mdi:leaf-maple`| Icona per stato Medio. |
| `icon_high` | `string` | No | `mdi:leaf` | Icona per stato Alto. |
| `font_size` | `number` | No | `14` | Dimensione del testo in pixel. |
| `icon_size` | `number` | No | `26` | Dimensione dell'icona in pixel. |
| `card_padding` | `number` | No | `10` | Spazio interno della card (padding) in pixel. |
| `border_radius` | `number` | No | `10` | Rotondità dei bordi della card in pixel. |

## 🖱️ Azioni al Click (Tap Action & Browser Mod)

Di default, cliccando sulla card si aprirà la finestra "more-info" relativa all'entità del **Consumo (Casa)**. 
Tuttavia, puoi personalizzare questo comportamento per aprire altre plance, richiamare servizi, o mostrare popup avanzati tramite integrazioni come **browser_mod**.

> ⚠️ **Nota:** Le azioni avanzate (come `fire-dom-event`) non sono configurabili dall'editor visivo, ma vanno scritte manualmente nell'**Editor di Codice (YAML)** della card.

### Esempio: Creare un Pop-Up con Browser Mod

Se hai installato `browser_mod` nel tuo Home Assistant, puoi far comparire un pop-up con i dettagli di tutti i sensori energetici quando clicchi sulla card. 

Ecco come configurarlo in YAML:

```yaml
type: custom:domhouse-solar-autoconsumption-card
name: Autoconsumo Totale
entity_production: sensor.produzione_fotovoltaico_watt
entity_consumption: sensor.consumo_casa_watt
entity_battery_bidir: sensor.batteria_inverter_watt
language: it
# --- Configurazione Tap Action ---
tap_action:
  action: fire-dom-event
  browser_mod:
    service: browser_mod.popup
    data:
      title: "Dettagli Energia"
      content:
        type: entities
        entities:
          - sensor.produzione_fotovoltaico_watt
          - sensor.batteria_inverter_watt
          - sensor.consumo_casa_watt
```

## 📐 Come funziona il calcolo e la batteria?

La card calcola la percentuale di "Energia Pulita" applicando automaticamente questa logica:

1. Recupera i valori di **Produzione** (Fotovoltaico) e **Consumo** (Casa).
2. **Gestione Batteria Intelligente:** La card supporta 4 tipi di sensori. Se usi un sensore bidirezionale, la card isola automaticamente solo la fase di scarica (ignorando quando la batteria carica) e converte i valori necessari in positivi per sommarli alla produzione solare.
3. Calcola l'Energia Pulita totale a disposizione: `Produzione + Scarica Batteria`.
4. Calcola l'Energia Pulita effettivamente utilizzata per la casa: `Min(Energia Pulita Totale, Consumo)`.
5. Calcola la Percentuale finale rispetto al consumo totale.

**Esempio Pratico 1 (Giorno, tanto sole):**
* Produzione: **2000 W**
* Batteria in Scarica: **0 W**
* Consumo: **1000 W**
* **Risultato:** Stai coprendo il **100%** del tuo consumo con energia pulita (i restanti 1000 W li stai esportando o usando per ricaricare l'accumulo).

**Esempio Pratico 2 (Sera/Notte, supporto della batteria):**
* Produzione: **0 W**
* Batteria (Sensore Bidirezionale): **-500 W** *(La card lo legge automaticamente come +500 W in scarica)*
* Consumo: **500 W**
* **Risultato:** Stai coprendo il **100%** del tuo consumo in modo *green* grazie all'energia immagazzinata nella batteria!

**Esempio Pratico 3 (Consumo elevato, prelievo dalla rete):**
* Produzione: **1000 W**
* Batteria in Scarica: **500 W**
* Consumo: **3000 W**
* **Risultato:** Hai 1500 W di energia pulita disponibile. Stai coprendo il **50%** del tuo consumo senza inquinare, mentre i restanti 1500 W li stai prelevando dalla rete elettrica.

## ❤️ Crediti
Sviluppato da [Salvatore Lentini - DomHouse.it](https://www.domhouse.it)
