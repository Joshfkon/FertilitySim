# The Fertility Equation - Technical Documentation

**Interactive Policy Simulator for Fertility Policy**
URL: [tfrsim.com](https://tfrsim.com)

---

## Overview

The Fertility Equation is a web-based interactive policy simulator that challenges users to design policy packages to raise America's Total Fertility Rate (TFR) from 1.62 to replacement level (2.1). The application combines economic modeling, demographic research, and political feasibility scoring in a single-page application.

---

## Architecture

### Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Fonts**: Google Fonts (Playfair Display, Source Serif 4, JetBrains Mono)
- **State Management**: In-memory JavaScript objects with localStorage persistence
- **Sharing**: URL parameter encoding for shareable configurations
- **No external dependencies**: Pure browser-based implementation

### File Structure

```
FertilitySim/
├── index.html          # UI structure (~680 lines)
├── js/script.js        # Core simulation engine (~5,000 lines)
├── css/styles.css      # Responsive styling (~2,400 lines)
├── favicon.svg         # Vector favicon
├── favicon.png         # Raster favicon
├── og-image.png        # Social sharing preview
└── DOCUMENTATION.md    # This file
```

---

## Core Components

### 1. Policy Data Structures

The simulator contains several policy arrays:

| Array | Count | Description |
|-------|-------|-------------|
| `liberalPolicies` | 15 | Pro-natalist spending policies (childcare, leave, housing, etc.) |
| `illiberalPolicies` | 5 | Coercive policies (abortion ban, contraception restrictions, etc.) |
| `entitlementReforms` | 8 | Medicare/Social Security reforms that generate offsets |
| `taxIncreases` | 10 | Revenue-raising options with GDP/TFR drag |

Each policy object contains:
- `id`, `name`, `description`
- `costLow`, `costHigh` (spending/revenue in $B)
- `tfrLow`, `tfrHigh` (TFR impact range)
- `overlapGroup` (for interaction discounting)
- `sliderConfig` (intensity customization)
- `methodology` (derivation, sources, confidence level)

### 2. Immigration System

Located in `immigrationConfig` and `selectionMechanisms`:

- **Annual Level**: 0-3M immigrants/year slider
- **Selection Mechanisms**:
  - Current System (family/employment/diversity/refugee mix)
  - Points System (Canada/Australia model)
  - Employment Priority (H1B expansion)
  - Family Reunification
  - Diversity Lottery
- **Source Regions**: 5 regions with distinct fertility, fiscal, and skill characteristics

### 3. Calculation Engine

#### `calculateTFR()` (line ~1373)
Main TFR calculation with:
- Group-based interaction discounting (25% within-group, 5% cross-group)
- Context adjustment (10% default)
- Implementation rate (90% default)
- Inflation penalty subtraction
- Tax drag subtraction
- Immigration TFR addition

#### `calculateInflationDynamics()` (line ~858)
Four-stage inflation model:
1. **Deficit → Inflation**: 0.30pp per 1% GDP deficit (varies by regime)
2. **CB Absorption**: 75% (normal) down to 25% (dominance)
3. **Expectations Anchoring**: Thresholds vary by fiscal regime
4. **CPI → TFR Penalty**: Tiered from 1.5%/pp (mild) to 10%/pp (crisis)

#### `calculateGDP2075()` (line ~1187)
50-year GDP projection considering:
- Baseline 2% real growth
- Tax policy drag
- Entitlement reform boost
- Deficit crowding out
- Inflation drag
- Population effect (phases in year 20-30)
- Immigration effect

#### `calculatePoliticalFeasibility()` (line ~3780)
Grades policy packages A-F based on:
- Package cost penalty
- Popular policy bonuses
- Entitlement cut penalties (weighted by voting bloc intensity)
- Tax increase penalties
- Illiberal policies → automatic F grade

### 4. State Management

- **In-Memory**: All policy states stored in arrays
- **LocalStorage**: Persisted via `saveState()` / `loadState()`
- **URL Sharing**: Encoded via `encodeStateToURL()` / `decodeStateFromURL()`
  - Compact encoding uses base36 for policy indices
  - Supports policy intensities and thresholds

---

## Key Features

### Real-Time Updates
All calculations trigger via `updateDisplay()`:
- TFR number and status
- Fiscal metrics (spending, offsets, net deficit)
- Inflation rate and penalties
- GDP projections
- Political feasibility score

### Policy Card Flip
Each policy card has a front (controls) and back (methodology):
- Click policy title to flip
- Shows derivation, sources, confidence level

### Modal System
- Deficit warning (first deficit)
- Fiscal dominance warning (>8% GDP deficit)
- GDP crash warning (<-8% GDP)
- Share modal with social buttons

### Responsive Design
- Mobile-first CSS with `hide-mobile` utility classes
- Tab navigation for sections
- Floating reset/share buttons

---

## Code Quality Assessment

### Strengths
1. **Error Handling**: NaN/Infinity checks in slider calculations
2. **State Persistence**: Try-catch blocks for localStorage operations
3. **Division Safety**: Most divisions protected against zero
4. **Documentation**: Extensive methodology inline with sources
5. **Modular Functions**: Clear separation of calculation concerns

### No Critical Bugs Found
The codebase demonstrates solid engineering practices:
- Proper type checking (`!== undefined`)
- Defensive programming in calculations
- Graceful degradation for localStorage failures
- URL encoding/decoding with error handling

### Minor Observations
1. No build process (intentional - runs directly in browser)
2. Single large JS file (~5000 lines) - could be modularized
3. Some accessibility improvements possible (ARIA labels)

---

## Model Parameters

Configurable via the Model Parameters section:

| Parameter | Default | Description |
|-----------|---------|-------------|
| `interactionDiscount` | 25% | Within-group policy overlap |
| `contextAdjustment` | 10% | US-specific implementation loss |
| `implementationRate` | 90% | Policy execution effectiveness |
| `deficitToInflationBase` | 0.30 | Elasticity per 1% GDP deficit |
| `inflationToTFRBase` | 0.50 | % TFR decline per 1pp inflation |
| `cbCredibility` | 85 | Central bank credibility (0-100) |
| `baselineDeficit` | $1,900B | CBO baseline deficit |
| `fiscalDominanceThreshold` | 10% | GDP threshold for dominance |

---

## Fiscal Regimes

| Regime | Deficit/GDP | CB Absorption | Inflation Elasticity |
|--------|-------------|---------------|----------------------|
| Normal | <6% | 75% | 1.0× |
| Elevated | 6-8% | 50-75% | 1.0-1.3× |
| Stressed | 8-10% | 35-50% | 1.3-1.6× |
| Dominance | >10% | 25-35% | 1.6-2.5× |

---

## Data Sources

The model cites academic research throughout:

**Fertility Policies**:
- Cohen et al. (2013) - Cash transfer elasticities
- Milligan (2005) - Quebec childcare program
- Raute (2019) - German parental leave
- Sorvachev & Yakovlev (2020) - Russian birth grants

**Inflation Model**:
- Catão & Terrones (2005) - Deficit-inflation link
- Sargent & Wallace (1981) - Unpleasant monetarist arithmetic
- Adsera (2004, 2011) - Inflation-fertility relationship

**Immigration**:
- Danish Finance Ministry (2018) - Fiscal lifecycle by origin
- Seah (2018) - Mariel Boatlift crowdout study
- Borjas (1999), Peri (2012) - Labor market effects

---

## Sharing System

### URL Encoding Format
- `l=` Liberal policies (bitfield + intensity pairs)
- `i=` Illiberal policies (bitfield)
- `e=` Entitlement reforms (id:threshold pairs)
- `t=` Tax increases (id:threshold pairs)
- `m=` Immigration (level,mechanism)

### Share Modal
Displays:
- Policy package type (Pragmatist, Skeptic, Moonshot, etc.)
- Key metrics (TFR, GDP, Fiscal)
- Political feasibility breakdown
- Twitter/X and copy link buttons

---

## Development Notes

### Adding New Policies
1. Add object to appropriate array (liberalPolicies, etc.)
2. Include all required fields (id, name, cost, tfr, overlapGroup)
3. Add methodology with derivation and sources
4. Card will auto-render via `renderPolicyCard()`

### Modifying Calculations
- Core calculations in `calculateTFR()`, `calculateFiscal()`, `calculateInflationDynamics()`
- Display updates in `updateDisplay()`
- Test with extreme values to ensure stability

### Debugging
- `window.lastInflationModel` - Last inflation calculation details
- `window.lastGDPCalc` - Last GDP calculation details
- Browser console for localStorage state

---

## License

Built for exploration and debate, not prediction.

---

*Documentation generated: January 2026*
