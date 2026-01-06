const liberalPolicies = [
      { 
        id: 'child-allowance', 
        name: 'Universal Child Allowance', 
        description: 'Monthly payment per child, ages 0-6. (Ages 7-17 at 60%)', 
        costLow: 250, costHigh: 300, tfrLow: 0.15, tfrHigh: 0.20, 
        enabled: false, intensity: 100,
        sliderConfig: { label: 'Monthly amount', min: 200, max: 800, default: 500, format: v => `$${v}/mo` },
        confidence: 'medium',
        methodology: {
          derivation: 'Laroque & Salanié (2014): €1k/mo → +0.05 TFR. At $500/mo (~€450/mo equivalent), base estimate: +0.02-0.03. Universal design + front-loading + no marriage penalty amplifies effect. Cohen elasticity applied to effective ~50% income increase for median family.',
          sources: [
            { cite: 'Cohen et al. (2013)', finding: '30% benefit increase → 10% fertility increase', elasticity: '~0.3' },
            { cite: 'Laroque & Salanié (2014)', finding: '€1k/mo → +0.05 TFR', elasticity: '~0.05 per €12k' }
          ],
          notes: 'Universal design eliminates marriage penalties and reduces administrative overhead. Front-loading to ages 0-6 targets period of highest childcare costs.'
        }
      },
      { 
        id: 'third-child-bonus', 
        name: '3+ Child Tax Bonus', 
        description: 'Federal tax return per 3rd+ child, ages 0-6.', 
        costLow: 100, costHigh: 150, tfrLow: 0.10, tfrHigh: 0.15, 
        enabled: false, intensity: 100,
        sliderConfig: { label: 'Tax return %', min: 50, max: 150, default: 100, format: v => `${v}%` },
        confidence: 'medium',
        methodology: {
          derivation: 'Cohen: ($32k/$12k) × 0.3 × 0.28 (3rd+ share) = +0.07. Duclos Quebec 3rd+ bonus showed +25% increase in 3rd births, scaled to US context = +0.08-0.12. Stacking on allowance creates additional marginal incentive.',
          sources: [
            { cite: 'Cohen et al. (2013)', finding: 'Marginal incentive effects on higher-parity births', elasticity: '~0.3' },
            { cite: 'Duclos et al. (2001)', finding: 'Quebec 3rd+ bonus → +25% third births', elasticity: 'Parity-specific' }
          ],
          notes: '100% = full federal tax liability returned. 150% = refundable beyond liability. FISCAL REALITY: This is a transfer, not an investment with positive fiscal return.'
        }
      },
      { 
        id: 'childcare', 
        name: 'Universal Childcare', 
        description: 'Subsidized childcare, ages 0-5. Quebec model.', 
        costLow: 80, costHigh: 100, tfrLow: 0.10, tfrHigh: 0.15, 
        enabled: false, intensity: 100,
        sliderConfig: { label: 'Family daily cost', min: 0, max: 20, default: 5, format: v => v === 0 ? 'Free' : `$${v}/day`, invert: true },
        confidence: 'high',
        methodology: {
          derivation: 'Direct application of Milligan (2005) Quebec estimate. This is the highest-confidence estimate in the package due to direct replication and sustained effects confirmed by Ang (2015).',
          sources: [
            { cite: 'Milligan (2005)', finding: 'Quebec $5/day program → +0.10-0.15 TFR', elasticity: 'Direct estimate' },
            { cite: 'Ang (2015)', finding: 'Confirmed sustained effects of Quebec program', elasticity: 'Replication' }
          ],
          notes: 'Current avg US childcare cost: ~$50/day ($1,200/month). Quebec charges ~$9 CAD/day. $0 = fully subsidized.'
        }
      },
      { 
        id: 'parental-leave', 
        name: 'Paid Parental Leave', 
        description: '80% salary replacement, job-protected.', 
        costLow: 60, costHigh: 100, tfrLow: 0.08, tfrHigh: 0.12, 
        enabled: false, intensity: 100,
        sliderConfig: { label: 'Leave duration', min: 3, max: 18, default: 12, format: v => `${v} months` },
        confidence: 'medium-high',
        methodology: {
          derivation: 'Lalive baseline: +0.04-0.06. Raute finding: +0.08-0.10 for educated women. US zero baseline maximizes potential impact. Extended to 12 months for full effect.',
          sources: [
            { cite: 'Raute (2019)', finding: 'Germany Elterngeld → +22% first births among educated women', elasticity: '+0.08-0.10' },
            { cite: 'Lalive & Zweimüller (2009)', finding: 'Austria leave extension → +5.7% second births', elasticity: '+0.04-0.06' }
          ],
          notes: 'The US is the only OECD country without federal paid leave. Nordic countries offer 12-18 months. Effects diminish beyond ~12 months.'
        }
      },
      { 
        id: 'debt-relief', 
        name: 'Marriage-Linked Debt Relief', 
        description: 'Student loans paused on marriage, forgiven on birth.', 
        costLow: 60, costHigh: 80, tfrLow: 0.06, tfrHigh: 0.12, 
        enabled: false, intensity: 100,
        sliderConfig: { label: 'Forgiveness %', min: 25, max: 100, default: 100, format: v => `${v}%` },
        confidence: 'low',
        methodology: {
          derivation: 'Addo: $10k debt → 7 month marriage delay. At $52k avg total debt → ~3yr shift in family formation timing. Curve shift estimate: +0.10-0.15, discounted 40% for tempo effects (timing vs. quantum).',
          sources: [
            { cite: 'Addo (2014)', finding: '$10k student debt → 7 month marriage delay', elasticity: 'Indirect' }
          ],
          notes: 'HIGH UNCERTAINTY: 30-50% of impact may be timing shift rather than additional births. Tempo vs quantum effects unclear. Includes both federal (~$37k avg) and private (~$15k avg) loans.'
        }
      },
      { 
        id: 'housing', 
        name: 'Federal Housing Program', 
        description: 'Direct federal construction in high-cost metros.', 
        costLow: 150, costHigh: 200, tfrLow: 0.12, tfrHigh: 0.20, 
        enabled: false, intensity: 100,
        sliderConfig: { label: 'Units per year', min: 250, max: 1500, default: 1000, format: v => `${v}k units` },
        confidence: 'low',
        methodology: {
          derivation: 'Dettling & Kearney: 10% housing price increase → 2-3% fertility decrease. Inverting: 30% price reduction × 2.5% × 1.62 baseline × 2.5 (multiplier for sustained effect) = +0.12-0.20.',
          sources: [
            { cite: 'Dettling & Kearney (2014)', finding: '10% housing price increase → 2-3% fertility decrease', elasticity: '~0.25' }
          ],
          notes: 'HIGH UNCERTAINTY: Current US multifamily construction ~400k/yr. 1M units requires 2.5x capacity increase. Singapore HDB model as reference.'
        }
      },
      { 
        id: 'fertility-coverage', 
        name: 'Universal Fertility Coverage', 
        description: 'IVF, IUI, egg freezing covered by insurance.', 
        costLow: 15, costHigh: 25, tfrLow: 0.02, tfrHigh: 0.05, 
        enabled: false, intensity: 100,
        sliderConfig: { label: 'IVF cycles covered', min: 2, max: 10, default: 6, format: v => v >= 10 ? 'Unlimited' : `${v} cycles` },
        confidence: 'medium',
        methodology: {
          derivation: 'Israeli universal fertility coverage contributes ~0.03 TFR. 15-20% of couples affected by infertility. Modest but additive effect.',
          sources: [
            { cite: 'Israeli experience', finding: 'Universal coverage → ~0.03 TFR contribution', elasticity: 'Direct observation' }
          ],
          notes: 'Israel covers unlimited cycles. Current avg IVF cost: ~$15-20k per cycle, avg 2.5 cycles needed.'
        }
      },
      { 
        id: 'baby-bonds', 
        name: 'Baby Bonds', 
        description: 'Trust fund at birth, accessible at 18 for education/housing.', 
        costLow: 40, costHigh: 50, tfrLow: 0.03, tfrHigh: 0.06, 
        enabled: false, intensity: 100,
        sliderConfig: { label: 'Bond amount', min: 5, max: 25, default: 10, format: v => `$${v}k` },
        confidence: 'low',
        methodology: {
          derivation: 'No direct fertility precedent. UK Child Trust Fund provides partial model. Theoretical signal effect: reduces parental anxiety about child\'s future economic prospects.',
          sources: [
            { cite: 'UK Child Trust Fund', finding: 'Partial precedent for universal child accounts', elasticity: 'Theoretical' }
          ],
          notes: '$10k grows to ~$34k over 18 years at 7% return. Eligible uses: education, housing down payment, business startup. PRIMARY VALUE: Creates forward-looking constituency, not direct fertility impact.'
        }
      },
      { 
        id: 'birth-grant', 
        name: 'Lump-Sum Birth Grant', 
        description: 'One-time payment for 2nd+ child (Russia model).', 
        costLow: 30, costHigh: 40, tfrLow: 0.12, tfrHigh: 0.18, 
        enabled: false, intensity: 100,
        sliderConfig: { label: 'Grant amount', min: 5, max: 20, default: 10, format: v => `$${v}k` },
        confidence: 'medium-high',
        methodology: {
          derivation: 'Sorvachev & Yakovlev (2020): ~$50k government cost per marginal birth induced. Russia\'s $10k grant (≈1.5× median annual income) → +0.15 TFR. Linear scaling: +0.015 TFR per $1k up to ~$15k, then diminishing returns.',
          sources: [
            { cite: 'Sorvachev & Yakovlev (2020)', finding: '$10k grant → +0.15 TFR in Russia', elasticity: '+0.015 per $1k' },
            { cite: 'Russian Maternity Capital', finding: '~$50k cost per marginal birth induced', elasticity: 'Direct observation' }
          ],
          notes: 'Best-evidenced lump sum policy. Targets 2nd+ births where marginal decisions are made. Formula: TFR = 0.015 × (grant/1000) × (1 - 0.02 × max(0, grant/1000 - 15)). Diminishing returns above $15k.'
        }
      },
      { 
        id: 'family-quotient', 
        name: 'Family Tax Quotient', 
        description: 'Divide income by family units for tax (France model).', 
        costLow: 50, costHigh: 70, tfrLow: 0.04, tfrHigh: 0.06, 
        enabled: false, intensity: 100,
        sliderConfig: { label: 'Child weight', min: 0.3, max: 1.0, default: 0.5, format: v => `${v} adult eq.` },
        confidence: 'low',
        methodology: {
          derivation: 'Landais (2003): 1% increase in tax relief → 0.05% increase in 3+ child households. Extremely weak elasticity: +0.0008 TFR per $1B spent. France\'s success is the package, not this single instrument.',
          sources: [
            { cite: 'Landais (2003)', finding: '1% tax relief increase → 0.05% increase in 3+ households', elasticity: '~0.0008 per $1B' }
          ],
          notes: '⚠️ WEAK ELASTICITY: Benefits scale with income (regressive). Effects concentrated in top quintile. Value is political durability, not fertility impact. France spends ~$60B for +0.05 TFR.'
        }
      },
      { 
        id: 'large-family-exemption', 
        name: 'Large Family Tax Exemption', 
        description: 'Full income tax exemption for mothers of 4+ children (Hungary model).', 
        costLow: 15, costHigh: 25, tfrLow: 0.02, tfrHigh: 0.04, 
        enabled: false, intensity: 100,
        sliderConfig: { label: 'Qualifying children', min: 3, max: 5, default: 4, format: v => `${v}+ children` },
        confidence: 'low',
        methodology: {
          derivation: 'No rigorous study isolates this policy. Using Cohen elasticity (0.3) with ~$5k average benefit for qualifying ~5% of mothers: +0.01-0.02 TFR. Hungary\'s recent TFR reversal (1.61→1.38) undermines confidence.',
          sources: [
            { cite: 'Cohen et al. (2013)', finding: 'Cash transfer elasticity ~0.3', elasticity: 'Applied to subset' },
            { cite: 'Hungary experience', finding: 'TFR rose to 1.61 then fell to 1.38', elasticity: 'Uncertain' }
          ],
          notes: '⚠️ LOW CONFIDENCE: Hungary\'s TFR reversal is concerning. Targets small population (high-parity mothers). May have "large family culture" signaling effects. Elasticity: ~0.002 TFR per $1B.'
        }
      },
      { 
        id: 'housing-subsidy', 
        name: 'Housing-Linked Birth Subsidy', 
        description: 'Grant + subsidized mortgage for families with 3+ children (Hungary CSOK model).', 
        costLow: 40, costHigh: 60, tfrLow: 0.06, tfrHigh: 0.12, 
        enabled: false, intensity: 100,
        sliderConfig: { label: 'Total benefit value', min: 30, max: 80, default: 50, format: v => `$${v}k` },
        confidence: 'low',
        methodology: {
          derivation: 'CSOK provides ~$35k grant + subsidized interest (total ~$50-80k value) for 3+ children, tied to marriage and home purchase. IFS analysis: contributed +0.05 to +0.10 of Hungary\'s gains. Effect depends heavily on housing market conditions.',
          sources: [
            { cite: 'IFS Hungary analysis', finding: 'CSOK contributed +0.05 to +0.10 TFR', elasticity: '+0.0015 per $1B (base)' },
            { cite: 'Dettling & Kearney (2014)', finding: '10% housing price increase → 2-3% fertility decrease', elasticity: 'Housing channel' }
          ],
          notes: '⚠️ HOUSING-DEPENDENT: Effect multiplied in high-constraint markets. Addresses specific constraint (housing) rather than general income. Tied to marriage requirement.'
        }
      },
      { 
        id: 'part-time-rights', 
        name: 'Part-Time Work Protections', 
        description: 'Legal right to reduced hours with equal benefits (Netherlands model).', 
        costLow: 0, costHigh: 5, tfrLow: 0.02, tfrHigh: 0.04, 
        enabled: false, intensity: 100,
        sliderConfig: { label: 'Protection level', min: 1, max: 3, default: 2, format: v => v === 1 ? 'Right to request' : v === 2 ? 'Strong right' : 'Full Dutch model' },
        confidence: 'low',
        methodology: {
          derivation: 'Regulatory intervention, no spending elasticity. Netherlands has highest part-time rate in OECD and above-average fertility. Tier 1 (right to request): +0.02; Tier 2 (strong right): +0.03; Tier 3 (full model): +0.04.',
          sources: [
            { cite: 'Netherlands model', finding: 'Highest part-time rate in OECD', elasticity: 'Correlational only' },
            { cite: 'OECD Family Database', finding: 'Part-time work correlates with fertility in cross-country data', elasticity: 'Indirect' }
          ],
          notes: '⚠️ CORRELATIONAL: No causal evidence. Cost is regulatory burden on employers, not government spending. May affect female labor force participation. Tier system: 1=request right, 2=strong right, 3=presumptive right + equal benefits.'
        }
      },
      { 
        id: 'pension-credits', 
        name: 'Pension Credits for Childcare', 
        description: 'Pension credit for years spent on childcare (Germany Mütterrente model).', 
        costLow: 20, costHigh: 30, tfrLow: 0.01, tfrHigh: 0.03, 
        enabled: false, intensity: 100,
        sliderConfig: { label: 'Credit years per child', min: 1, max: 5, default: 3, format: v => `${v} years` },
        confidence: 'very-low',
        methodology: {
          derivation: 'Germany provides 3 years pension credit per child at average wage equivalent (~$15-20k NPV per child). However, benefit is received 30-40 years after childbearing decision. At 5% discount rate, perceived value is ~25% of nominal.',
          sources: [
            { cite: 'Germany Mütterrente', finding: '~€100/month additional pension per child', elasticity: 'Time-discounted' },
            { cite: 'Behavioral economics', finding: 'People heavily discount distant benefits', elasticity: 'Theoretical' }
          ],
          notes: '⚠️ VERY WEAK: Time discounting kills incentive effect. Benefit 30-40 years away has ~25% perceived value. Elasticity: +0.0008 TFR per $1B nominal (effectively +0.0003 after discounting). Ceiling: +0.04 TFR.'
        }
      }
    ];

    const illiberalPolicies = [
      { 
        id: 'abortion-ban', 
        name: 'Complete Abortion Ban', 
        description: 'Total prohibition, criminal penalties.', 
        costLow: 5, costHigh: 15, tfrLow: 0.50, tfrHigh: 0.70, 
        enabled: false, intensity: 100, 
        historical: 'Romania 1966: TFR 1.9→3.7 in one year. ~10,000 women died.',
        confidence: 'medium',
        methodology: {
          derivation: 'Arithmetic approach: ~1.04M US abortions annually (Guttmacher 2024) vs ~3.6M births. A complete ban with 70-80% enforcement effectiveness (accounting for cross-border travel and black market access by upper-income women) yields 730-830k additional births. This represents a 20-23% increase in births, translating to +0.32-0.37 on current 1.62 TFR. Upper bound accounts for Romania\'s +1.8 TFR experience (Decree 770, 1966), heavily discounted for modern circumvention methods.',
          sources: [
            { cite: 'Guttmacher (2024)', finding: '~1.04M US abortions annually', elasticity: 'Baseline volume' },
            { cite: 'CDC (2023)', finding: '3.6M US births annually', elasticity: 'Denominator' },
            { cite: 'Romanian Decree 770', finding: 'TFR 1.9→3.7 (+1.8) in one year', elasticity: 'Upper bound reference' }
          ],
          notes: 'Stratified circumvention estimate: Elite (~5% of abortions) 80% circumvention via travel/private physicians; Upper-middle (~15%) 50% circumvention; Middle class (~30%) 25% circumvention; Working class/poor (~50%) 10% circumvention. Weighted average: ~25% circumvention, ~75% conversion to births. ETHICAL WARNING: Romanian experience included ~10,000 maternal deaths from unsafe procedures. Poland\'s 2020 near-total ban shows fertility *declined* after implementation, but Poland had only ~1,000 legal abortions annually pre-ban (most went abroad or used pills already). US has 1,000x the volume.'
        }
      },
      { 
        id: 'contraception-ban', 
        name: 'Contraception Restrictions', 
        description: 'Ban hormonal contraception and IUDs.', 
        costLow: 2, costHigh: 8, tfrLow: 0.35, tfrHigh: 0.60, 
        enabled: false, intensity: 100,
        confidence: 'medium',
        methodology: {
          derivation: 'US TFR dropped from 3.6 to 1.9 (1960-1973) following Pill introduction—a 1.7 TFR decline. Bailey (2010) found states that legalized Pill sales after Griswold v. Connecticut (1965) saw ~4% birth rate decline. Ireland delayed Pill introduction until 1981; their fertility collapse was delayed ~20 years vs other Western nations. Not all decline was Pill (cultural shifts, workforce entry), but modern contraception is the primary mechanical enabler of fertility control.',
          sources: [
            { cite: 'NSFG/CDC Historical', finding: 'TFR 3.6→1.9 (1960-1973), -47%', elasticity: 'Post-Pill decline' },
            { cite: 'Bailey (2010)', finding: 'Griswold legalization → ~4% birth rate decline', elasticity: 'Causal estimate' },
            { cite: 'Ireland comparison', finding: 'Pill legalized 1981; fertility collapse delayed 20 years', elasticity: 'Natural experiment' }
          ],
          notes: 'STACKING NOTE: Contraception ban effects would largely stack with abortion ban—they target different points in the reproductive process. Combined effect could approach +1.0 TFR. However, enforcement of contraception bans is extremely difficult in modern context (pills can be imported, prescribed for other conditions). Would require unprecedented surveillance. Estimate assumes partial enforcement (~60-70% effective).'
        }
      },
      { 
        id: 'celibacy-tax', 
        name: 'Childlessness Tax', 
        description: '5-15% tax on childless adults over 25.', 
        costLow: -50, costHigh: -30, tfrLow: 0.05, tfrHigh: 0.12, 
        enabled: false, intensity: 100, revenue: true,
        historical: 'USSR 1941-1990: 6% tax. High compliance, unclear impact.',
        confidence: 'low',
        methodology: {
          derivation: 'USSR childlessness tax (1941-1990) provides historical precedent. 6% tax on childless adults. High compliance but fertility impact unclear—may have been primarily revenue measure.',
          sources: [
            { cite: 'USSR Tax (1941-1990)', finding: '6% tax, high compliance', elasticity: 'Unclear fertility impact' }
          ],
          notes: 'REVENUE-GENERATING: -$30-50B (negative cost = revenue). Fertility impact likely modest. May function more as intergenerational transfer mechanism than fertility incentive.'
        }
      },
      { 
        id: 'divorce-restrictions', 
        name: 'Divorce Restrictions', 
        description: 'Eliminate no-fault divorce.', 
        costLow: 0, costHigh: 5, tfrLow: 0.02, tfrHigh: 0.08, 
        enabled: false, intensity: 100,
        historical: 'Pre-1970 US: higher stability, minimal fertility evidence.',
        confidence: 'low',
        methodology: {
          derivation: 'Pre-1970 US had no no-fault divorce. Higher marital stability observed, but minimal direct fertility evidence. Effect likely operates through marriage formation incentives rather than within-marriage fertility.',
          sources: [
            { cite: 'Pre-1970 US marriage law', finding: 'Higher marital stability', elasticity: 'Indirect/unclear' }
          ],
          notes: 'Primarily affects marriage dissolution, not formation or fertility within marriage. May reduce marriage rates if exit becomes costly.'
        }
      },
      { 
        id: 'mandatory-marriage', 
        name: 'Marriage Mandates', 
        description: 'Benefits/housing tied to married status.', 
        costLow: 5, costHigh: 15, tfrLow: 0.06, tfrHigh: 0.15, 
        enabled: false, intensity: 100,
        historical: 'Singapore: Housing priority for married couples.',
        confidence: 'low',
        methodology: {
          derivation: 'Singapore HDB gives priority access to married couples. Creates strong marriage incentive in housing-constrained environment. Effect depends on scarcity of tied benefits.',
          sources: [
            { cite: 'Singapore HDB policy', finding: 'Housing priority for married couples', elasticity: 'Context-dependent' }
          ],
          notes: 'Effectiveness depends on scarcity of tied benefits. In abundant-resource environment, mandate has limited bite. Singapore context: extreme housing scarcity amplifies effect.'
        }
      }
    ];

    const entitlementReforms = [
      { 
        id: 'medicare-age', 
        name: 'Raise Medicare Age', 
        savingsLow: 80, savingsHigh: 100, 
        description: 'Phase in over 12 years.', 
        enabled: false,
        sliderConfig: { label: 'Eligibility age', min: 66, max: 70, default: 67, format: v => `${v} years` },
        methodology: {
          derivation: 'Each year increase in eligibility age saves ~$40-50B annually by shifting costs to private insurance and employers. CBO estimates $19B over 10 years for 2-year increase. Phased implementation reduces disruption.',
          sources: ['CBO Budget Options (2022)', 'CRFB Medicare Analysis (2023)'],
          caveats: 'Shifts costs to employers/individuals, may increase uninsured rate for 65-66 year olds.'
        }
      },
      { 
        id: 'ss-means-test', 
        name: 'SS Means-Test', 
        savingsLow: 120, savingsHigh: 150, 
        description: 'Reduce benefits for high earners.', 
        enabled: false,
        sliderConfig: { label: 'Income threshold', min: 75, max: 200, default: 100, format: v => `>$${v}k` },
        methodology: {
          derivation: 'Reducing benefits for retirees with income >$100k affects ~15% of beneficiaries. Progressive reduction preserves benefits for middle class while generating significant savings.',
          sources: ['SSA Office of the Actuary', 'Urban Institute (2021)'],
          caveats: 'Transforms SS from universal to welfare program. May reduce political support and encourage benefit avoidance.'
        }
      },
      { 
        id: 'ss-cola', 
        name: 'SS COLA Adjustment', 
        savingsLow: 80, savingsHigh: 100, 
        description: 'Switch to Chained CPI.', 
        enabled: false,
        sliderConfig: { label: 'Annual reduction', min: 25, max: 75, default: 50, format: v => `−${(v/100).toFixed(2)}%` },
        methodology: {
          derivation: 'Chained CPI grows ~0.25-0.3% slower than CPI-W. Effect compounds: after 10 years, benefits ~3% lower; after 25 years, ~7% lower. Saves $10-15B/year initially, growing over time.',
          sources: ['BLS Chained CPI Data', 'CBO COLA Analysis (2023)'],
          caveats: 'Disproportionately affects oldest beneficiaries. Benefits erode more over longer retirements.'
        }
      },
      { 
        id: 'medicare-drugs', 
        name: 'Medicare Drug Negotiation', 
        savingsLow: 50, savingsHigh: 80, 
        description: 'Expand negotiation authority.', 
        enabled: false,
        sliderConfig: { label: 'Drugs covered', min: 50, max: 250, default: 100, format: v => `${v} drugs` },
        methodology: {
          derivation: 'IRA allows Medicare to negotiate 10 drugs starting 2026, expanding to 20 by 2029. CBO estimates $98B savings over 10 years. Expanding to 100+ drugs proportionally increases savings.',
          sources: ['CBO IRA Scoring (2022)', 'KFF Drug Pricing Analysis'],
          caveats: 'May reduce pharma R&D investment. Savings depend on negotiation effectiveness and drug selection.'
        }
      },
      { 
        id: 'ss-retirement-70', 
        name: 'Raise SS Retirement Age', 
        savingsLow: 100, savingsHigh: 150, 
        description: 'Phase in over 18 years.', 
        enabled: false,
        sliderConfig: { label: 'Full retirement age', min: 68, max: 72, default: 70, format: v => `${v} years` },
        methodology: {
          derivation: 'Each year increase in full retirement age is equivalent to ~6.7% benefit cut. Raising FRA from 67 to 70 reduces lifetime benefits ~20%. Slow phase-in allows workers to adjust plans.',
          sources: ['SSA Actuarial Analysis', 'CRFB Social Security Options'],
          caveats: 'Disproportionately affects workers in physically demanding jobs. Life expectancy gains not uniform across income levels.'
        }
      },
      { 
        id: 'ss-cap', 
        name: 'Cap SS Benefits', 
        savingsLow: 60, savingsHigh: 80, 
        description: 'Maximum monthly benefit.', 
        enabled: false,
        sliderConfig: { label: 'Monthly cap', min: 2500, max: 4000, default: 3200, format: v => `$${v.toLocaleString()}/mo` },
        methodology: {
          derivation: 'Current maximum benefit is ~$4,555/mo (2024) for workers retiring at 70 with high lifetime earnings. Capping at $3,200 affects top ~10% of earners.',
          sources: ['SSA Benefit Calculator', 'AARP Benefits Guide'],
          caveats: 'Weakens link between contributions and benefits. May reduce support among higher earners who pay more into system.'
        }
      },
      { 
        id: 'medicare-premiums', 
        name: 'Medicare Premium Surcharge', 
        savingsLow: 40, savingsHigh: 60, 
        description: 'Income-related Part B/D premiums.', 
        enabled: false,
        sliderConfig: { label: 'Surcharge threshold', min: 50, max: 150, default: 85, format: v => `>$${v}k` },
        methodology: {
          derivation: 'IRMAA already charges higher premiums for incomes >$97k (2024). Lowering threshold and increasing surcharge percentages expands revenue. Each $10k reduction in threshold adds ~$5-8B.',
          sources: ['CMS Medicare Premiums', 'MedPAC Payment Policy (2023)'],
          caveats: 'Higher-income seniors already pay more. Further increases may push some toward Medicare Advantage or private coverage.'
        }
      }
    ];

    const taxIncreases = [
      { 
        id: 'income-tax-top', 
        name: 'Top Marginal Rate Increase', 
        description: 'Raise top bracket rate. Threshold adjustable.', 
        savingsLow: 80, savingsHigh: 120, 
        enabled: false,
        threshold: 500, // $500k default
        thresholdMin: 250,
        thresholdMax: 1000,
        thresholdLabel: 'Income threshold ($k)',
        gdpDrag: 0.002, // 0.2% annual GDP drag
        tfrDrag: 0.01, // TFR penalty from reduced wages/uncertainty
        dragRationale: 'Labor supply elasticity ~0.1-0.3 for high earners; reduced work effort and tax avoidance',
        confidence: 'medium',
        methodology: {
          derivation: 'GDP drag: ~0.2% annually from labor supply response. TFR drag: reduced high-income wages + uncertainty. Keane (2011): compensated elasticity ~0.3 for high earners.',
          sources: [
            { cite: 'Keane (2011)', finding: 'Meta-analysis of labor supply elasticities', elasticity: '~0.3 compensated' },
            { cite: 'Saez et al. (2012)', finding: 'Top income elasticity to tax rates', elasticity: '~0.5' },
            { cite: 'Becker (1960)', finding: 'Income-fertility relationship', elasticity: '~0.005 TFR per 1% GDP' }
          ],
          notes: 'Higher thresholds reduce revenue but also reduce behavioral distortion. $250k threshold captures more revenue but higher growth drag.'
        }
      },
      { 
        id: 'corporate-tax', 
        name: 'Corporate Tax Increase', 
        description: 'Raise corporate rate toward pre-TCJA levels.', 
        savingsLow: 100, savingsHigh: 150, 
        enabled: false,
        threshold: 28, // 28% default rate
        thresholdMin: 25,
        thresholdMax: 35,
        thresholdLabel: 'Corporate rate (%)',
        gdpDrag: 0.01, // 1% annual GDP drag (7pp × 0.15%)
        tfrDrag: 0.04, // Higher TFR impact via wage channel
        dragRationale: 'Reduces business investment; CBO estimates 0.1-0.2% GDP per percentage point',
        confidence: 'medium-high',
        methodology: {
          derivation: 'GDP drag: CBO estimates ~0.15% GDP per 1pp. At 28% (vs 21%), 7pp increase → ~1% GDP drag. TFR drag higher due to wage incidence (20-50% falls on workers).',
          sources: [
            { cite: 'CBO (2017)', finding: 'Corporate tax and GDP relationship', elasticity: '~0.15% GDP per 1pp' },
            { cite: 'Gravelle (2014)', finding: 'Corporate tax incidence on wages', elasticity: '20-50% on workers' },
            { cite: 'Zwick & Mahon (2017)', finding: 'Investment response to tax changes', elasticity: 'High for SMEs' }
          ],
          notes: 'Investment effects take 5-10 years to fully materialize. Short-run revenue higher than long-run due to behavioral response.'
        }
      },
      { 
        id: 'capital-gains', 
        name: 'Capital Gains Tax Parity', 
        description: 'Tax capital gains as ordinary income above threshold.', 
        savingsLow: 150, savingsHigh: 200, 
        enabled: false,
        threshold: 1000, // $1M default
        thresholdMin: 400,
        thresholdMax: 5000,
        thresholdLabel: 'Income threshold ($k)',
        gdpDrag: 0.003, // 0.3% annual GDP drag from capital misallocation
        tfrDrag: 0.05, // Higher TFR impact: entrepreneurship, wealth building
        dragRationale: 'Strong lock-in effect; reduces capital reallocation efficiency',
        confidence: 'medium',
        methodology: {
          derivation: 'GDP drag: ~0.3% annually from lock-in effect reducing capital mobility. TFR drag higher: reduced entrepreneurship, wealth building for family formation. Dai et al. (2008): realization elasticity ~-0.5 to -0.7.',
          sources: [
            { cite: 'Dai et al. (2008)', finding: 'Elasticity of capital gains realizations', elasticity: '-0.5 to -0.7' },
            { cite: 'Auerbach (1988)', finding: 'Lock-in effect magnitude', elasticity: 'Significant above 25% rate' },
            { cite: 'Poterba (1987)', finding: 'Capital gains and entrepreneurship', elasticity: 'Negative relationship' }
          ],
          notes: 'Revenue estimates assume significant behavioral response. Actual revenue could be 40-60% of static estimate due to lock-in.'
        }
      },
      { 
        id: 'financial-transaction', 
        name: 'Financial Transaction Tax', 
        description: 'Small tax on securities trades.', 
        savingsLow: 60, savingsHigh: 100, 
        enabled: false,
        threshold: 10, // 0.10% default (shown as basis points × 10)
        thresholdMin: 5,
        thresholdMax: 50,
        thresholdLabel: 'Rate (basis points)',
        gdpDrag: 0.002, // 0.2% annual GDP drag
        tfrDrag: 0.02, // Modest TFR impact
        dragRationale: 'Reduces market liquidity; widens bid-ask spreads',
        confidence: 'low',
        methodology: {
          derivation: 'GDP drag: ~0.1-0.2% annually from increased cost of capital. TFR drag modest: primarily affects financial sector, less direct impact on families. Swedish FTT (1984-91) reduced trading 50%.',
          sources: [
            { cite: 'Umlauf (1993)', finding: 'Swedish FTT reduced trading 50%', elasticity: 'High volume elasticity' },
            { cite: 'Matheson (2011)', finding: 'IMF review of FTT experiences', elasticity: 'Varied by market depth' },
            { cite: 'Burman et al. (2016)', finding: 'US FTT revenue and impact estimates', elasticity: 'Moderate' }
          ],
          notes: 'HIGH UNCERTAINTY: Effects depend heavily on market structure and rate level. Revenue estimates vary 3x across studies.'
        }
      },
      { 
        id: 'estate-tax', 
        name: 'Estate Tax Reform', 
        description: 'Lower exemption threshold for estate taxation.', 
        savingsLow: 40, savingsHigh: 70, 
        enabled: false,
        threshold: 3500, // $3.5M default
        thresholdMin: 1000,
        thresholdMax: 7000,
        thresholdLabel: 'Exemption ($k)',
        gdpDrag: 0.001, // Minimal GDP drag
        tfrDrag: 0.01, // Modest TFR impact
        dragRationale: 'Minimal growth impact; affects intergenerational transfers',
        confidence: 'medium',
        methodology: {
          derivation: 'GDP drag minimal—most economic activity unaffected. TFR effect ambiguous: reduces bequests but also reduces "Carnegie effect". Kopczuk (2013): estate elasticity ~0.1-0.2.',
          sources: [
            { cite: 'Kopczuk (2013)', finding: 'Elasticity of reported estates', elasticity: '~0.1-0.2' },
            { cite: 'Gale & Slemrod (2001)', finding: 'Estate tax and savings behavior', elasticity: 'Small effect' },
            { cite: 'Holtz-Eakin et al. (1993)', finding: 'Inheritance and labor supply', elasticity: 'Negative (Carnegie effect)' }
          ],
          notes: 'Current $13M exemption (2024) means estate tax affects <0.2% of estates. Lower exemption broadens base significantly.'
        }
      },
      { 
        id: 'carbon-tax', 
        name: 'Carbon Tax', 
        description: 'Price on carbon emissions, phased in over 5 years.', 
        savingsLow: 80, savingsHigh: 150, 
        enabled: false,
        threshold: 50, // $50/ton default
        thresholdMin: 25,
        thresholdMax: 150,
        thresholdLabel: 'Price per ton ($)',
        gdpDrag: 0.005, // 0.5% GDP drag (disputed - could be 0.2-1%)
        tfrDrag: 0.025, // Higher TFR impact due to regressivity
        dragRationale: 'Energy price increases hit young families hardest; regressive burden 2-4x higher on low-income households',
        confidence: 'medium',
        methodology: {
          derivation: 'GDP drag disputed: 0.2-1% depending on model. TFR drag higher due to regressivity—NBER finds burden 2-4x higher on low-income as share of income. Young families disproportionately affected.',
          sources: [
            { cite: 'Goulder & Hafstead (2013)', finding: '$10/ton rising 5%/yr → 0.6% lower GDP at year 20', elasticity: 'Moderate' },
            { cite: 'NERA/NAM (2013)', finding: '$20/ton → $350/household by year 20; 80% reduction → 3.4% GDP loss', elasticity: 'High' },
            { cite: 'Heritage Foundation', finding: '$25/ton → $1,400-1,900/yr income loss per family of four', elasticity: 'High' },
            { cite: 'NBER Grainger & Kolstad', finding: 'Burden 2-4x higher on low-income as share of income', elasticity: 'Regressive' }
          ],
          notes: 'KEY ISSUE: Carbon tax is regressive—low-income households spend larger share of income on energy. Young families particularly affected. Revenue recycling can offset but politically uncertain. Fertility drag assumes partial but incomplete recycling to families.'
        }
      },
      { 
        id: 'vat', 
        name: 'Federal VAT', 
        description: 'Consumption tax with exemptions for necessities.', 
        savingsLow: 400, savingsHigh: 600, 
        enabled: false,
        threshold: 10, // 10% rate default
        thresholdMin: 5,
        thresholdMax: 20,
        thresholdLabel: 'VAT rate (%)',
        gdpDrag: 0.001, // Minimal GDP drag - least distortionary
        tfrDrag: 0.02, // Modest TFR impact with exemptions
        dragRationale: 'Consumption reduction; regressive before exemptions',
        confidence: 'medium-high',
        methodology: {
          derivation: 'GDP drag minimal—VAT is least distortionary broad-based tax. TFR drag from reduced consumption capacity, partially offset by exemptions for necessities.',
          sources: [
            { cite: 'Mankiw et al. (2009)', finding: 'Optimal tax theory favors consumption taxes', elasticity: 'Lower deadweight loss' },
            { cite: 'OECD (2020)', finding: 'VAT revenue potential in US', elasticity: '~$50B per 1% rate' },
            { cite: 'Chetty et al. (2009)', finding: 'Salience and behavioral response to VAT', elasticity: 'Moderate' }
          ],
          notes: 'Exemptions for food, housing, healthcare, and childcare reduce regressivity and fertility drag. US is only OECD country without national VAT.'
        }
      },
      { 
        id: 'stepped-up-basis', 
        name: 'End Stepped-Up Basis', 
        description: 'Tax capital gains at death instead of resetting basis.', 
        savingsLow: 45, savingsHigh: 57, 
        enabled: false,
        threshold: 1000, // $1M exemption default (per person)
        thresholdMin: 0,
        thresholdMax: 5000,
        thresholdLabel: 'Exemption per person ($k)',
        gdpDrag: -0.001, // Slight GDP INCREASE (lock-in reduction)
        tfrDrag: 0.001, // Minimal TFR impact - affects elderly estates
        dragRationale: 'Neutral to positive GDP: reduces lock-in distortion, improves capital allocation',
        confidence: 'medium-high',
        methodology: {
          derivation: 'When someone dies holding appreciated assets, cost basis "steps up" to market value—the "Angel of Death" loophole. Eliminating this raises $50-57B/yr (tax at death) or $20-25B/yr (carryover basis). GDP effect neutral to positive: lock-in reduction improves capital allocation. TFR impact minimal—affects estates at death, not young families.',
          sources: [
            { cite: 'CBO (2024)', finding: 'Tax at death = ~$536B/decade; carryover = ~$200B/decade', elasticity: 'Well-established scoring' },
            { cite: 'Gale, Hall & Sabelhaus (2024)', finding: 'Brookings: "Would make the economy more efficient"', elasticity: 'Positive efficiency' },
            { cite: 'Agersnap & Zidar (2021)', finding: 'Long-run realization elasticity', elasticity: '-0.3 to -0.5' },
            { cite: 'Poterba & Weisbenner (2001)', finding: 'Stepped-up basis worth ~$40B annually', elasticity: 'Original estimates' }
          ],
          notes: 'Implementation straightforward. 56% of benefit goes to top quintile, 18% to top 1%. Main concern: liquidity for illiquid estates (farms, businesses). Biden proposal exempted $1M/person + primary residence.'
        }
      },
      { 
        id: 'land-value-tax', 
        name: 'Land Value Tax', 
        description: 'Tax unimproved land value. Economists\' "ideal tax."', 
        savingsLow: 300, savingsHigh: 500, 
        enabled: false,
        threshold: 100, // 1.0% rate default (stored as basis points)
        thresholdMin: 25,
        thresholdMax: 200,
        thresholdLabel: 'Annual rate (basis points)',
        gdpDrag: 0.0005, // Small drag at 1% rate (transition costs offset efficiency gains)
        tfrDrag: -0.003, // Slight TFR BENEFIT (lower housing costs)
        dragRationale: 'Low rates: GDP gain from reduced speculation. High rates: transition costs (wealth shock, liquidity) create modest drag.',
        confidence: 'low-medium',
        methodology: {
          derivation: 'Land is fixed in supply—taxing it causes minimal deadweight loss. Milton Friedman called it "the least bad tax." At LOW rates (<0.5%), reduced speculation may increase GDP. At HIGH rates (>1.5%), transition effects dominate: wealth shock to landowners reduces consumption, liquidity constraints force asset sales. Net effect at 1%: roughly neutral. TFR slightly positive: lower land prices help young families afford housing.',
          sources: [
            { cite: 'Stiglitz (1977)', finding: 'Henry George Theorem: LVT can fund public goods optimally', elasticity: 'Theoretically non-distortionary' },
            { cite: 'Stiglitz (2025)', finding: 'LVT reduces speculation, can increase growth at moderate rates', elasticity: 'Positive at low rates' },
            { cite: 'Oates & Schwab (1997)', finding: 'Pittsburgh two-rate tax increased building activity', elasticity: 'Empirical support' },
            { cite: 'IMF (2022)', finding: '"Land value taxation... can even be productive"', elasticity: 'But notes transition costs' }
          ],
          notes: 'GDP EFFECT IS RATE-DEPENDENT: 0.25% → slight gain; 1% → ~neutral; 2% → modest drag. Even at high rates, drag is ~1/3 of equivalent income tax. HIGH UNCERTAINTY: ±50% on revenue. Implementation challenges: valuation, political resistance, liquidity, constitutional questions.'
        }
      },
      { 
        id: 'income-tax-all', 
        name: 'Income Tax Increase (All Brackets)', 
        description: 'Raise rates across all 7 income brackets.', 
        savingsLow: 100, savingsHigh: 130, 
        enabled: false,
        threshold: 1, // 1 percentage point default
        thresholdMin: 1,
        thresholdMax: 5,
        thresholdLabel: 'Rate increase (pp)',
        gdpDrag: 0.0006, // 0.06% GDP per pp
        tfrDrag: 0.009, // Higher TFR drag - hits family-formation ages
        dragRationale: 'Labor supply reduction; hits middle class where most childbearing occurs',
        confidence: 'high',
        methodology: {
          derivation: '+1pp across all brackets raises ~$110-120B/yr. GDP drag ~0.06% per pp from labor supply response (ETI ~0.25). TFR drag higher than top-bracket-only: broad increase reduces disposable income for middle-income families where most childbearing occurs.',
          sources: [
            { cite: 'CBO (2024)', finding: '+1pp all brackets = $1.1-1.2T/decade', elasticity: 'Official scoring' },
            { cite: 'Saez, Slemrod & Giertz (2012)', finding: 'Elasticity of taxable income meta-analysis', elasticity: 'ETI ~0.25' },
            { cite: 'Romer & Romer (2010)', finding: 'Tax multiplier of 2-3', elasticity: 'For unexpected changes' },
            { cite: 'Tax Foundation (2025)', finding: 'TCJA extension analysis', elasticity: 'Reversing cuts = 0.5-0.7% GDP loss' }
          ],
          notes: 'Most direct revenue lever. CBO/JCT score routinely—high confidence. ETI higher for top earners (~0.4), lower for middle class (~0.1-0.2). A +2pp increase is roughly proportional, not progressive.'
        }
      }
    ];

    // === IMMIGRATION POLICY DATA ===
    // Based on: Danish Finance Ministry (2018), Borjas (1999), Peri (2012), 
    // Putterman & Weil (2010), Borjas (1999), Peri (2012)
    
    const immigrationConfig = {
      annualLevel: 1000,  // thousands (1M baseline)
      selectionMechanism: 'current',
      // Mechanism-specific parameters
      params: {
        current: {
          family: 66,      // % family-based
          employment: 15,  // % employment-based
          diversity: 5,    // % diversity lottery
          refugee: 14      // % refugee/asylum
        },
        points: {
          threshold: 67,       // Points threshold (Canada uses 67)
          educationWeight: 25, // Max points for education
          languageWeight: 20,  // Max points for language
          ageWeight: 12,       // Max points for age
          jobOfferBonus: 10    // Points for confirmed job offer
        },
        employment: {
          h1bCap: 150,         // H1B cap in thousands (current: 85k)
          wagePremium: 1.2,    // Wage floor multiplier (1.2 = 20% above prevailing)
          h1bFee: 10           // Application fee in $k (higher = more selective)
        },
        family: {
          extendedFamily: 50,  // % allowing extended family (siblings, adult children)
          sponsorIncome: 30    // Minimum sponsor income in $k
        },
        diversity: {
          slots: 55,           // Annual slots in thousands (current: 55k)
          educationReq: 1      // 0=none, 1=HS, 2=Bachelor's
        }
      }
    };

    const selectionMechanisms = [
      {
        id: 'current',
        name: 'Current System',
        desc: 'Mix of family, employment, diversity, and refugee admissions',
        controls: [
          { id: 'family', label: 'Family-Based', min: 20, max: 85, unit: '%', desc: 'Immediate relatives + family preference' },
          { id: 'employment', label: 'Employment-Based', min: 5, max: 60, unit: '%', desc: 'EB-1 through EB-5 visas' },
          { id: 'diversity', label: 'Diversity Lottery', min: 0, max: 20, unit: '%', desc: 'Random selection from underrepresented countries' },
          { id: 'refugee', label: 'Refugee/Asylum', min: 0, max: 40, unit: '%', desc: 'Humanitarian admissions' }
        ]
      },
      {
        id: 'points',
        name: 'Points System',
        desc: 'Canada/Australia model. Merit-based selection.',
        controls: [
          { id: 'threshold', label: 'Points Threshold', min: 50, max: 90, unit: 'pts', desc: 'Higher = more selective (Canada: 67)' },
          { id: 'educationWeight', label: 'Education Weight', min: 10, max: 40, unit: 'pts', desc: 'Points for degrees (PhD=max)' },
          { id: 'languageWeight', label: 'Language Weight', min: 5, max: 30, unit: 'pts', desc: 'Points for English proficiency' },
          { id: 'jobOfferBonus', label: 'Job Offer Bonus', min: 0, max: 25, unit: 'pts', desc: 'Extra points for confirmed employment' }
        ]
      },
      {
        id: 'employment',
        name: 'Employment Priority',
        desc: 'H1B expansion with employer sponsorship.',
        controls: [
          { id: 'h1bCap', label: 'H1B Annual Cap', min: 65, max: 500, unit: 'k', desc: 'Current cap: 85k (65k + 20k advanced degree)' },
          { id: 'wagePremium', label: 'Wage Floor', min: 1.0, max: 2.0, step: 0.1, unit: '×', desc: 'Multiple of prevailing wage' },
          { id: 'h1bFee', label: 'H1B Fee', min: 1, max: 50, unit: '$k', desc: 'Higher fee = more selective + revenue' }
        ]
      },
      {
        id: 'family',
        name: 'Family Reunification',
        desc: 'Priority for family ties and chain migration.',
        controls: [
          { id: 'extendedFamily', label: 'Extended Family', min: 0, max: 100, unit: '%', desc: '% including siblings, adult children' },
          { id: 'sponsorIncome', label: 'Sponsor Income Req', min: 0, max: 75, unit: '$k', desc: 'Minimum income to sponsor relatives' }
        ]
      },
      {
        id: 'diversity',
        name: 'Diversity Lottery',
        desc: 'Random selection from underrepresented countries.',
        controls: [
          { id: 'slots', label: 'Annual Slots', min: 10, max: 200, unit: 'k', desc: 'Number of diversity visas (current: 55k)' },
          { id: 'educationReq', label: 'Education Requirement', min: 0, max: 2, step: 1, unit: '', desc: '0=None, 1=HS, 2=Bachelor\'s', format: v => ['None', 'High School', 'Bachelor\'s'][v] }
        ]
      }
    ];

    // Source region data (used internally for calculations)
    // Fiscal NPV based on Danish Finance Ministry lifecycle data
    // Employment rates based on Danish Statistics (2018 report)
    const sourceRegions = {
      westernHighIncome: {
        name: 'Western',
        color: '#1976d2',
        initialTFR: 1.65,
        fiscalNPV: 280,      // +$280k lifetime
        skillPremium: 1.25,
        employmentRate: 0.76  // Close to native (79%)
      },
      asiaHighSkill: {
        name: 'Asia (H-Skill)',
        color: '#7b1fa2',
        initialTFR: 1.75,
        fiscalNPV: 320,      // Best fiscal (H1B selection)
        skillPremium: 1.35,
        employmentRate: 0.82  // Above native (positive selection)
      },
      latinAmerica: {
        name: 'Latin America',
        color: '#388e3c',
        initialTFR: 2.35,
        fiscalNPV: -45,      // Slight negative
        skillPremium: 0.85,
        employmentRate: 0.68  // Below native
      },
      menapt: {
        name: 'MENAPT',
        color: '#d32f2f',
        initialTFR: 2.75,
        fiscalNPV: -165,     // Danish data: -85k DKK/year = ~-$165k NPV
        skillPremium: 0.70,
        employmentRate: 0.52  // Danish: 56% non-Western vs 79% native
      },
      otherNonWestern: {
        name: 'Other',
        color: '#f57c00',
        initialTFR: 2.55,
        fiscalNPV: -85,
        skillPremium: 0.78,
        employmentRate: 0.58
      }
    };

    const modelParams = { 
      interactionDiscount: 25, 
      contextAdjustment: 10, 
      implementationRate: 90,
      
      // === INFLATION MODEL PARAMETERS ===
      // Starting conditions (BLS Nov 2025)
      baselineCPI: 2.7,              // Current CPI inflation rate (%)
      fedTarget: 2.0,                // Fed's inflation target (%)
      
      // Deficit → Inflation transmission
      // Literature: Catao & Terrones (2005), Lin & Chu (2013)
      // Range: 0.15-0.50pp inflation per 1% GDP deficit depending on conditions
      deficitToInflationBase: 0.30,  // Base elasticity (near full employment)
      
      // Central bank parameters
      cbCredibility: 85,             // 0-100 scale, affects inflation expectations anchoring
      realRateFloor: -2.0,           // How negative can real rates go before crisis
      
      // Fiscal dominance thresholds
      // Based on: BIS Papers No. 65, Mercatus (2023), Boston Fed (2025)
      fiscalStressThreshold: 6.0,    // % GDP - CB starts losing effectiveness
      fiscalDominanceThreshold: 10.0, // % GDP - CB fully accommodates fiscal
      
      // Inflation → TFR transmission
      // Literature: Adsera (2004, 2011), Sobotka (2011), Kohler & Kohler (2002)
      inflationToTFRBase: 0.50,      // % TFR decline per 1pp inflation (low inflation)
      inflationToTFRHigh: 0.80,      // % TFR decline per 1pp (high inflation regime)
      uncertaintyAmplifier: 1.5,     // Multiplier when expectations unanchor
      
      // Economic conditions
      economicSlack: 'near-full',    // 'slack', 'near-full', 'constrained'
      currentGDP: 28000,             // $28T in billions
      
      // CBO baseline (Jan 2025)
      baselineDeficit: 1900,         // $1.9T baseline deficit
    };
    
    // === INFLATION DYNAMICS MODEL v4 ===
    // This models the transmission: Fiscal Policy → CB Response → Inflation → TFR
    // v4 changes: Smoother regime transitions, calibrated to avoid cliff effects
    function calculateInflationDynamics(policyDeficit, policyOffsets) {
      const netPolicyImpact = policyDeficit - policyOffsets;
      const totalDeficit = modelParams.baselineDeficit + netPolicyImpact;
      const deficitPctGDP = (totalDeficit / modelParams.currentGDP) * 100;
      const policyDeficitPctGDP = (netPolicyImpact / modelParams.currentGDP) * 100;
      
      // Economic slack multiplier
      const slackMultiplier = {
        'slack': 0.5,
        'near-full': 1.0,
        'constrained': 1.5
      }[modelParams.economicSlack] || 1.0;
      
      // ========================================
      // DETERMINE FISCAL REGIME
      // ========================================
      let cbAbsorptionRate;
      let fiscalRegime;
      
      if (deficitPctGDP < modelParams.fiscalStressThreshold) {
        cbAbsorptionRate = 0.75;
        fiscalRegime = 'normal';
      } else if (deficitPctGDP < 8) {
        const stress = (deficitPctGDP - modelParams.fiscalStressThreshold) / 2;
        cbAbsorptionRate = 0.75 - stress * 0.25;
        fiscalRegime = 'elevated';
      } else if (deficitPctGDP < modelParams.fiscalDominanceThreshold) {
        const stress = (deficitPctGDP - 8) / 2;
        cbAbsorptionRate = 0.50 - stress * 0.15; // Slower decline: floor at 0.35 not 0.20
        fiscalRegime = 'stressed';
      } else {
        // Dominance: CB absorption floors at 25%, not zero
        cbAbsorptionRate = Math.max(0.25, 0.35 - (deficitPctGDP - 10) * 0.025);
        fiscalRegime = 'dominance';
      }
      
      // ========================================
      // STAGE 1: Deficit → Inflation Pressure
      // ========================================
      // v4: Smoother elasticity scaling, lower cap
      let deficitToInflationElasticity = modelParams.deficitToInflationBase;
      
      if (fiscalRegime === 'stressed') {
        // Gradual increase from 0.30 to 0.45 across stressed range
        const stressProgress = (deficitPctGDP - 8) / 2;
        deficitToInflationElasticity = modelParams.deficitToInflationBase * (1 + stressProgress * 0.5);
      } else if (fiscalRegime === 'dominance') {
        // In dominance, elasticity scales more gently: 1.5x at threshold, up to 2.5x max
        const dominanceDepth = deficitPctGDP - modelParams.fiscalDominanceThreshold;
        const dominanceMultiplier = 1.5 + dominanceDepth * 0.15; // Slower scaling
        deficitToInflationElasticity = modelParams.deficitToInflationBase * Math.min(2.5, dominanceMultiplier);
      }
      
      // ========================================
      // SMOOTH TRANSITION: Policy → Total Deficit
      // ========================================
      // v4: Phase in total deficit gradually instead of binary switch
      // Below 6%: 100% policy deficit
      // 6-8%: Blend from policy to total (elevated)
      // Above 8%: 100% total deficit (stressed/dominance)
      
      let deficitPctForPressure;
      
      if (fiscalRegime === 'normal') {
        deficitPctForPressure = Math.max(0, policyDeficitPctGDP);
      } else if (fiscalRegime === 'elevated') {
        // Blend: lerp from policy deficit to total deficit across 6-8% range
        const blendFactor = (deficitPctGDP - 6) / 2; // 0 at 6%, 1 at 8%
        const policyContrib = Math.max(0, policyDeficitPctGDP) * (1 - blendFactor);
        const totalContrib = deficitPctGDP * blendFactor;
        deficitPctForPressure = policyContrib + totalContrib;
      } else {
        // Stressed/Dominance: Full total deficit
        deficitPctForPressure = deficitPctGDP;
      }
      
      const rawPressure = deficitPctForPressure * deficitToInflationElasticity * slackMultiplier;
      
      // ========================================
      // STAGE 2: Central Bank Absorption
      // ========================================
      const cbAbsorbed = rawPressure * cbAbsorptionRate;
      const netPressure = rawPressure - cbAbsorbed;
      
      // ========================================
      // STAGE 3: Inflation Expectations
      // ========================================
      const projectedCPI = modelParams.baselineCPI + netPressure;
      
      let expectationsMultiplier = 1.0;
      let expectationsAnchored = true;
      
      // Regime-dependent thresholds (actual CPI level)
      let unanchorThreshold = 4.0;
      let crisisThreshold = 6.0;
      
      if (fiscalRegime === 'dominance') {
        unanchorThreshold = 3.0;
        crisisThreshold = 4.5;
      } else if (fiscalRegime === 'stressed') {
        unanchorThreshold = 3.5;
        crisisThreshold = 5.0;
      }
      
      if (projectedCPI > unanchorThreshold) {
        const unanchoringPressure = (projectedCPI - unanchorThreshold) / (crisisThreshold - unanchorThreshold);
        expectationsMultiplier = 1.0 + Math.min(1.0, unanchoringPressure) * 0.3; // Reduced from 0.5
        expectationsAnchored = projectedCPI < crisisThreshold;
      }
      
      if (!expectationsAnchored) {
        // v4: Gentler spiral effect
        const spiralDepth = Math.min(1.5, (projectedCPI - crisisThreshold) / 4); // Reduced from /3
        expectationsMultiplier *= (1.2 + spiralDepth * 0.25); // Reduced multipliers
      }
      
      // CB credibility affects anchoring
      const credibilityFactor = modelParams.cbCredibility / 100;
      expectationsMultiplier = 1 + (expectationsMultiplier - 1) * (1.5 - credibilityFactor);
      
      // ========================================
      // STAGE 4: Final Inflation
      // ========================================
      const policyInducedInflation = netPressure * expectationsMultiplier;
      const totalCPI = modelParams.baselineCPI + policyInducedInflation;
      const totalInflationAboveTarget = totalCPI - modelParams.fedTarget;
      
      return {
        policyDeficit: netPolicyImpact,
        totalDeficit: totalDeficit,
        deficitPctGDP: deficitPctGDP,
        policyDeficitPctGDP: policyDeficitPctGDP,
        fiscalRegime: fiscalRegime,
        deficitPctForPressure: deficitPctForPressure,
        deficitToInflationElasticity: deficitToInflationElasticity,
        rawPressure: rawPressure,
        slackMultiplier: slackMultiplier,
        cbAbsorptionRate: cbAbsorptionRate,
        cbAbsorbed: cbAbsorbed,
        netPressure: netPressure,
        expectationsMultiplier: expectationsMultiplier,
        expectationsAnchored: expectationsAnchored,
        unanchorThreshold: unanchorThreshold,
        crisisThreshold: crisisThreshold,
        baselineCPI: modelParams.baselineCPI,
        policyInducedInflation: policyInducedInflation,
        totalCPI: totalCPI,
        totalInflationAboveTarget: totalInflationAboveTarget
      };
    }
    
    // === INFLATION → TFR PENALTY ===
    function calculateInflationTFRPenalty(inflationDynamics) {
      const inf = inflationDynamics;
      
      // ========================================
      // FIX #2: USE ABSOLUTE CPI LEVEL IN CRISIS
      // ========================================
      // Normal/Elevated: Penalty on policy-induced inflation only
      //   (baseline CPI already reflected in TFR 1.62)
      // Stressed/Dominance: Penalty on ABSOLUTE CPI level
      //   (entire inflation environment becomes destabilizing)
      //
      // Rationale: When you're at 8% CPI, fertility suffers from 8% inflation,
      // not from "8% minus whatever baseline was." The lived experience is absolute.
      
      let inflationForPenalty;
      let usingAbsoluteCPI = false;
      
      if (inf.fiscalRegime === 'normal' || inf.fiscalRegime === 'elevated') {
        // Standard case: penalty on new inflation only
        inflationForPenalty = inf.policyInducedInflation;
      } else {
        // CRISIS REGIME: Use absolute CPI level
        // People experience the full CPI, not a delta from some baseline
        usingAbsoluteCPI = true;
        inflationForPenalty = inf.totalCPI;
        
        // But we don't penalize for "normal" 2% inflation
        // Penalty kicks in above 2% (healthy inflation level)
        inflationForPenalty = Math.max(0, inf.totalCPI - 2.0);
      }
      
      if (inflationForPenalty <= 0) return { penalty: 0, details: inf, inflationForPenalty: 0, usingAbsoluteCPI };
      
      // ========================================
      // FIX #3: STEEPER TFR ELASTICITIES
      // ========================================
      // Previous elasticities were way too mild
      // Literature + Turkey/Russia calibration suggests:
      // - Moderate inflation: 1-2% TFR decline per pp (not 0.5%)
      // - High inflation: 3-5% TFR decline per pp
      // - Crisis inflation: 5-10% TFR decline per pp
      //
      // Turkey 2018-2024: ~78% peak inflation, TFR dropped 2.0 → 1.48 (-26%)
      // That's roughly -0.33% TFR per 1% inflation, but that's cumulative over years.
      // Annual shock elasticity is higher.
      
      let tfrDeclinePct = 0;
      
      if (inflationForPenalty <= 2) {
        // 0-2pp: mild (1.5% TFR decline per pp)
        tfrDeclinePct = inflationForPenalty * 1.5;
      } else if (inflationForPenalty <= 5) {
        // 2-5pp: moderate (3% TFR decline per pp)
        tfrDeclinePct = 2 * 1.5 + (inflationForPenalty - 2) * 3.0;
      } else if (inflationForPenalty <= 10) {
        // 5-10pp: severe (5% TFR decline per pp)
        tfrDeclinePct = 2 * 1.5 + 3 * 3.0 + (inflationForPenalty - 5) * 5.0;
      } else if (inflationForPenalty <= 20) {
        // 10-20pp: crisis (7% TFR decline per pp)
        tfrDeclinePct = 2 * 1.5 + 3 * 3.0 + 5 * 5.0 + (inflationForPenalty - 10) * 7.0;
      } else {
        // >20pp: collapse (10% TFR decline per pp)
        tfrDeclinePct = 2 * 1.5 + 3 * 3.0 + 5 * 5.0 + 10 * 7.0 + (inflationForPenalty - 20) * 10.0;
      }
      
      // v4.1: GRADUAL uncertainty amplification
      // Instead of binary ×1.5 when unanchored, ramp from 1.0 to 1.5
      // based on how far past the crisis threshold we are.
      // This eliminates the step-function cliff at the unanchoring point.
      let uncertaintyAmp = 1.0;
      if (inf.totalCPI > inf.crisisThreshold) {
        // Ramp: reaches 1.5 at 3pp above crisis threshold
        const depth = inf.totalCPI - inf.crisisThreshold;
        uncertaintyAmp = 1.0 + Math.min(0.5, depth / 6);
      }
      tfrDeclinePct *= uncertaintyAmp;
      
      // Convert to absolute TFR penalty
      const baseTFR = 1.62;
      let uncappedPenalty = (tfrDeclinePct / 100) * baseTFR;
      
      // v4: Cap FINAL TFR at 0.80, not the component
      // This allows the model to show the difference between "bad" and "catastrophic"
      const minTFR = 0.80;
      const maxAllowedPenalty = baseTFR - minTFR; // 0.82
      let penalty = Math.min(uncappedPenalty, maxAllowedPenalty);
      
      // Track whether cap was hit and by how much
      const capHit = uncappedPenalty > maxAllowedPenalty;
      const excessPenalty = capHit ? uncappedPenalty - maxAllowedPenalty : 0;
      
      return {
        penalty: penalty,
        uncappedPenalty: uncappedPenalty,
        capHit: capHit,
        excessPenalty: excessPenalty,
        inflationForPenalty: inflationForPenalty,
        tfrDeclinePct: tfrDeclinePct,
        usingAbsoluteCPI: usingAbsoluteCPI,
        uncertaintyAmp: uncertaintyAmp,
        uncertaintyApplied: uncertaintyAmp > 1.0,
        details: inf
      };
    }

    function calculateInflationPenalty(deficit, offsets = 0) {
      // Use the new inflation dynamics model
      const inflationDynamics = calculateInflationDynamics(deficit, offsets);
      const result = calculateInflationTFRPenalty(inflationDynamics);
      
      // Store for display
      window.lastInflationModel = {
        dynamics: inflationDynamics,
        tfrResult: result
      };
      
      return result.penalty;
    }
    
    // Helper to get inflation estimate for display (deprecated - use calculateInflationDynamics)
    function calculateInflationEstimate(deficit) {
      const effectiveDeficit = deficit;
      if (effectiveDeficit <= 0) return 0;
      const slackMultiplier = {
        'slack': 0.5,
        'near-full': 1.0,
        'constrained': 1.5
      }[modelParams.economicSlack] || 1.0;
      const deficitPctGDP = (effectiveDeficit / modelParams.currentGDP) * 100;
      return deficitPctGDP * modelParams.deficitToInflationBase * slackMultiplier;
    }

    // TFR drag from tax policies (separate from GDP drag)
    function calculateTfrDrag() {
      return taxIncreases.filter(t => t.enabled && t.tfrDrag).reduce((sum, t) => sum + t.tfrDrag, 0);
    }

    // GDP drag from tax policies (in annual GDP growth points)
    function calculateGdpDrag() {
      return taxIncreases.filter(t => t.enabled && t.gdpDrag).reduce((sum, t) => sum + t.gdpDrag, 0);
    }

    function calculateEntitlementSavings() {
      return entitlementReforms.filter(r => r.enabled).reduce((sum, r) => sum + (r.savingsLow + r.savingsHigh) / 2, 0);
    }

    function calculateGDP2075(tfr, gdpDrag, entitlementSavings = 0, deficit = 0, offsets = 0) {
      const currentGDP = 28; // $28T
      const years = 50; // 2025 to 2075
      const baselineGrowth = 0.02; // 2% real growth
      
      // Tax policy drag on annual growth
      const taxDragOnGrowth = gdpDrag;
      
      // Entitlement reform boost on annual growth
      const entitlementBoost = (entitlementSavings / 100) * 0.0003;
      
      // Deficit drag on growth (crowding out effect)
      const netDeficit = deficit - offsets;
      const deficitDrag = Math.max(0, netDeficit / 100) * 0.0002;
      
      // USE NEW INFLATION MODEL FOR GDP DRAG
      const inflationDynamics = calculateInflationDynamics(deficit, offsets);
      
      // CRITICAL FIX: Use ACTUAL CPI for growth drag, not "above target"
      // High inflation hurts growth regardless of what the Fed's target is
      // Historical: Fischer (1993), Barro (1995), Bruno & Easterly (1998)
      //
      // Also: STEEPER elasticities, especially at higher levels
      const totalCPI = inflationDynamics.totalCPI;
      
      let inflationGrowthDrag = 0;
      if (totalCPI > 2) {  // Only drag above 2% (normal inflation)
        const excessCPI = totalCPI - 2;
        
        // STEEPER tiered drag
        if (excessCPI <= 2) {
          // 2-4% CPI: mild drag (0.05% per pp)
          inflationGrowthDrag = excessCPI * 0.0005;
        } else if (excessCPI <= 4) {
          // 4-6% CPI: moderate drag (0.15% per pp)
          inflationGrowthDrag = 2 * 0.0005 + (excessCPI - 2) * 0.0015;
        } else if (excessCPI <= 6) {
          // 6-8% CPI: significant drag (0.25% per pp)
          inflationGrowthDrag = 2 * 0.0005 + 2 * 0.0015 + (excessCPI - 4) * 0.0025;
        } else if (excessCPI <= 10) {
          // 8-12% CPI: severe drag (0.4% per pp)
          inflationGrowthDrag = 2 * 0.0005 + 2 * 0.0015 + 2 * 0.0025 + (excessCPI - 6) * 0.004;
        } else {
          // >12% CPI: crisis drag (0.6% per pp)
          inflationGrowthDrag = 2 * 0.0005 + 2 * 0.0015 + 2 * 0.0025 + 4 * 0.004 + (excessCPI - 10) * 0.006;
        }
      }
      
      // Population growth effect on GDP
      const tfrDelta = tfr - 1.62;
      const populationGrowthBoost = tfrDelta * 0.005;
      
      // FISCAL DOMINANCE GROWTH PENALTY
      // In dominance: additional drag from capital flight, uncertainty, institutional decay
      let dominanceGrowthDrag = 0;
      if (inflationDynamics.fiscalRegime === 'dominance') {
        // Scale with how deep into dominance we are
        const dominanceDepth = inflationDynamics.deficitPctGDP - modelParams.fiscalDominanceThreshold;
        dominanceGrowthDrag = 0.005 + dominanceDepth * 0.002; // 0.5% base + 0.2% per point over threshold
        dominanceGrowthDrag = Math.min(0.02, dominanceGrowthDrag); // Cap at 2%
      } else if (inflationDynamics.fiscalRegime === 'stressed') {
        dominanceGrowthDrag = 0.003;
      }
      
      // Store for display
      window.lastGDPCalc = {
        totalCPI: totalCPI,
        inflationGrowthDrag: inflationGrowthDrag,
        dominanceGrowthDrag: dominanceGrowthDrag,
        fiscalRegime: inflationDynamics.fiscalRegime,
        deficitPctGDP: inflationDynamics.deficitPctGDP,
        cbAbsorptionRate: inflationDynamics.cbAbsorptionRate
      };
      
      // Immigration GDP effect
      const immigrationImpacts = calculateImmigrationImpacts();
      // Convert total % effect to annual rate over 50 years
      // e.g., 20% total effect = ~0.36% per year compounded
      const immigrationGDPBoost = Math.pow(1 + immigrationImpacts.gdpEffect / 100, 1/50) - 1;
      
      // Phased effects
      let gdp = currentGDP;
      for (let year = 1; year <= years; year++) {
        let annualGrowth = baselineGrowth - taxDragOnGrowth + entitlementBoost - deficitDrag;
        
        // Inflation drag phases in over first 10 years
        if (year <= 10) {
          const phaseIn = year / 10;
          annualGrowth -= inflationGrowthDrag * phaseIn;
        } else {
          annualGrowth -= inflationGrowthDrag;
        }
        
        // Fiscal dominance drag phases in over first 5 years
        if (dominanceGrowthDrag > 0) {
          if (year <= 5) {
            const phaseIn = year / 5;
            annualGrowth -= dominanceGrowthDrag * phaseIn;
          } else {
            annualGrowth -= dominanceGrowthDrag;
          }
        }
        
        // Population effect phases in after year 20
        if (year > 20) {
          const phaseIn = Math.min(1, (year - 20) / 10);
          annualGrowth += populationGrowthBoost * phaseIn;
        }
        
        // Immigration GDP effect phases in over 30 years
        if (year <= 30) {
          const phaseIn = year / 30;
          annualGrowth += immigrationGDPBoost * phaseIn;
        } else {
          annualGrowth += immigrationGDPBoost;
        }
        
        gdp *= (1 + annualGrowth);
      }
      
      return gdp;
    }

    // Baseline GDP for comparison (no policy changes)
    const baselineGDP2075 = calculateGDP2075(1.62, 0, 0, 0, 0);

    function calculateFiscal() {
      let spending = 0, offsets = 0;
      [...liberalPolicies, ...illiberalPolicies].forEach(p => {
        if (p.enabled) {
          // costLow and costHigh are already scaled by the slider
          if (p.revenue) offsets += (Math.abs(p.costLow) + Math.abs(p.costHigh)) / 2;
          else spending += (p.costLow + p.costHigh) / 2;
        }
      });
      entitlementReforms.forEach(r => { if (r.enabled) offsets += (r.savingsLow + r.savingsHigh) / 2; });
      taxIncreases.forEach(t => { if (t.enabled) offsets += (t.savingsLow + t.savingsHigh) / 2; });
      
      // Immigration fiscal effect (annual, marginal vs CBO baseline)
      // CBO baseline assumes ~1M immigrants/year with current system at default params
      
      // Save current settings
      const savedLevel = immigrationConfig.annualLevel;
      const savedMech = immigrationConfig.selectionMechanism;
      const savedCurrentParams = { ...immigrationConfig.params.current };
      
      // Set to baseline: 1M/yr with current system at default params
      immigrationConfig.annualLevel = 1000;
      immigrationConfig.selectionMechanism = 'current';
      immigrationConfig.params.current = { family: 66, employment: 15, diversity: 5, refugee: 14 };
      const baselineImpacts = calculateImmigrationImpacts();
      
      // Restore current settings
      immigrationConfig.annualLevel = savedLevel;
      immigrationConfig.selectionMechanism = savedMech;
      immigrationConfig.params.current = savedCurrentParams;
      const currentImpacts = calculateImmigrationImpacts();
      
      // Calculate per-immigrant fiscal for both (including gen2)
      const baselineAnnual = 1000000;
      const currentAnnual = savedLevel * 1000;
      
      // NPV is total over 50 years for gen1 + gen2
      // Total people = annual * 50 * 1.75 (where 0.75 is gen2 per gen1)
      const baselineFiscalPerImm = (baselineImpacts.fiscalNPV * 1e12) / (baselineAnnual * 50 * 1.75) / 1000; // $k
      const currentFiscalPerImm = (currentImpacts.fiscalNPV * 1e12) / (currentAnnual * 50 * 1.75) / 1000; // $k
      
      // Annual marginal effect in $B:
      // Level effect: extra immigrants at current fiscal rate
      // Composition effect: baseline immigrants at different fiscal rate
      const levelChange = currentAnnual - baselineAnnual;
      const levelEffect = (levelChange * currentFiscalPerImm) / 1e6; // $B
      const compositionEffect = (baselineAnnual * (currentFiscalPerImm - baselineFiscalPerImm)) / 1e6; // $B
      const immigrationFiscalEffect = levelEffect + compositionEffect;
      
      // Positive fiscal = revenue (reduces deficit), negative = cost (increases deficit)
      if (immigrationFiscalEffect > 0) {
        offsets += immigrationFiscalEffect;
      } else {
        spending += Math.abs(immigrationFiscalEffect);
      }
      
      return { spending, offsets, net: spending - offsets, immigrationEffect: immigrationFiscalEffect };
    }

    function calculateTFR() {
      const baseTFR = 1.62;
      let grossLow = 0, grossHigh = 0;
      let enabledCount = 0;
      
      [...liberalPolicies, ...illiberalPolicies].forEach(p => {
        if (p.enabled) {
          enabledCount++;
          // tfrLow and tfrHigh are already scaled by the slider
          grossLow += p.tfrLow;
          grossHigh += p.tfrHigh;
        }
      });

      // Interaction discount only applies when multiple policies are stacked
      // With 1 policy: no interaction discount
      // With 2+ policies: apply discount for diminishing returns
      const interactionFactor = enabledCount > 1 ? (1 - modelParams.interactionDiscount/100) : 1;
      const contextFactor = (1 - modelParams.contextAdjustment/100);
      const implementationFactor = (modelParams.implementationRate/100);
      
      const factor = interactionFactor * contextFactor * implementationFactor;
      let netLow = grossLow * factor, netHigh = grossHigh * factor;

      const fiscal = calculateFiscal();
      const deficit = fiscal.spending;  // Gross spending
      const offsets = fiscal.offsets;   // Revenue offsets
      const inflationPenalty = calculateInflationPenalty(deficit, offsets);
      netLow -= inflationPenalty;
      netHigh -= inflationPenalty;

      const tfrDrag = calculateTfrDrag();
      const gdpDrag = calculateGdpDrag();
      netLow -= tfrDrag;
      netHigh -= tfrDrag;

      // Immigration TFR effect
      const immigrationImpacts = calculateImmigrationImpacts();
      const immigrationTFR = immigrationImpacts.tfrEffect;
      netLow += immigrationTFR;
      netHigh += immigrationTFR;

      return { 
        low: baseTFR + netLow, 
        mid: baseTFR + (netLow + netHigh) / 2, 
        high: baseTFR + netHigh, 
        inflationPenalty, 
        tfrDrag, 
        gdpDrag,
        immigrationTFR,
        deficit: fiscal.net,  // Net deficit for display
        spending: fiscal.spending,
        offsets: fiscal.offsets
      };
    }

    function updateDisplay() {
      const tfr = calculateTFR();
      const fiscal = calculateFiscal();

      const tfrEl = document.getElementById('tfr-number');
      const statusEl = document.getElementById('tfr-status');
      const progressEl = document.getElementById('tfr-progress');

      tfrEl.textContent = tfr.mid.toFixed(2);
      tfrEl.className = 'tfr-number-large';
      progressEl.className = 'tfr-progress-fill';
      
      if (tfr.mid >= 2.1) {
        statusEl.textContent = 'AT REPLACEMENT ✓';
        tfrEl.classList.add('at-replacement');
        progressEl.classList.add('at-replacement');
      } else if (tfr.mid >= 1.8) {
        statusEl.textContent = 'BELOW REPLACEMENT';
        tfrEl.classList.add('below');
      } else {
        statusEl.textContent = 'CRITICALLY LOW';
        tfrEl.classList.add('critical');
      }

      progressEl.style.width = `${Math.min(100, (tfr.mid / 3) * 100)}%`;

      document.getElementById('total-spending').textContent = `$${Math.round(fiscal.spending)}B`;
      document.getElementById('total-offsets').textContent = `$${Math.round(fiscal.offsets)}B`;
      
      const netEl = document.getElementById('net-impact');
      if (fiscal.net <= 0) {
        // Surplus: offsets exceed spending
        netEl.textContent = `+$${Math.abs(Math.round(fiscal.net))}B`;
        netEl.className = 'fiscal-value positive';
      } else {
        // Deficit: spending exceeds offsets
        netEl.textContent = `−$${Math.round(fiscal.net)}B`;
        netEl.className = 'fiscal-value negative';
      }
      
      // Update total deficit (CBO baseline + policy net)
      const totalDeficit = modelParams.baselineDeficit + fiscal.net;
      const totalDeficitEl = document.getElementById('total-deficit');
      const deficitBreakdownEl = document.getElementById('deficit-breakdown');
      
      totalDeficitEl.textContent = `$${Math.round(totalDeficit).toLocaleString()}B`;
      
      // Color code based on fiscal stress level
      const deficitPctGDP = (totalDeficit / modelParams.currentGDP) * 100;
      if (deficitPctGDP >= 10) {
        totalDeficitEl.className = 'fiscal-value';
        totalDeficitEl.style.color = '#c62828'; // Crisis red
      } else if (deficitPctGDP >= 8) {
        totalDeficitEl.className = 'fiscal-value';
        totalDeficitEl.style.color = '#e65100'; // High stress orange
      } else if (deficitPctGDP >= 6) {
        totalDeficitEl.className = 'fiscal-value';
        totalDeficitEl.style.color = '#ef6c00'; // Elevated orange
      } else {
        totalDeficitEl.className = 'fiscal-value negative';
        totalDeficitEl.style.color = ''; // Default
      }
      
      if (fiscal.net === 0 && Math.abs(fiscal.immigrationEffect || 0) < 1) {
        deficitBreakdownEl.textContent = `${deficitPctGDP.toFixed(1)}% GDP (baseline)`;
      } else {
        let breakdown = `${deficitPctGDP.toFixed(1)}% GDP`;
        const policyNet = fiscal.net - (fiscal.immigrationEffect || 0);
        const parts = [];
        
        if (Math.abs(policyNet) >= 1) {
          parts.push(policyNet > 0 ? `+$${Math.round(policyNet)}B policy` : `−$${Math.abs(Math.round(policyNet))}B policy`);
        }
        if (Math.abs(fiscal.immigrationEffect || 0) >= 1) {
          const immEffect = fiscal.immigrationEffect;
          parts.push(immEffect > 0 ? `+$${Math.round(immEffect)}B imm.` : `−$${Math.abs(Math.round(immEffect))}B imm.`);
        }
        
        if (parts.length > 0) {
          breakdown += ` (${parts.join(', ')})`;
        } else if (fiscal.net !== 0) {
          breakdown += fiscal.net > 0 ? ` (+$${Math.round(fiscal.net)}B)` : ` (−$${Math.abs(Math.round(fiscal.net))}B)`;
        }
        deficitBreakdownEl.textContent = breakdown;
      }

      const inflationContainer = document.getElementById('inflation-container');
      const growthContainer = document.getElementById('growth-container');

      inflationContainer.classList.toggle('visible', tfr.inflationPenalty > 0.005);
      if (tfr.inflationPenalty > 0.005) {
        document.getElementById('inflation-penalty-val').textContent = `-${tfr.inflationPenalty.toFixed(2)}`;
        
        // Update calculation breakdown display
        const inflationBreakdown = document.getElementById('inflation-calc-breakdown');
        const fiscalStressIndicator = document.getElementById('fiscal-stress-indicator');
        
        if (inflationBreakdown && window.lastInflationModel) {
          const model = window.lastInflationModel;
          const d = model.dynamics;
          const r = model.tfrResult;
          
          let breakdownHtml = '';
          
          // Header showing projected CPI
          const cpiColor = d.totalCPI > 8 ? '#b71c1c' : d.totalCPI > 6 ? '#c62828' : d.totalCPI > 4 ? '#ef6c00' : '#2e7d32';
          breakdownHtml += `<div style="font-size: 16px; font-weight: bold; margin-bottom: 8px; color: ${cpiColor};">`;
          breakdownHtml += `Projected CPI: ${d.totalCPI.toFixed(1)}%`;
          if (!d.expectationsAnchored) {
            breakdownHtml += ` <span style="background: #c62828; color: white; padding: 2px 6px; font-size: 10px;">UNANCHORED</span>`;
          }
          breakdownHtml += `</div>`;
          
          // Regime warning
          if (d.fiscalRegime === 'stressed' || d.fiscalRegime === 'dominance') {
            const regimeColor = d.fiscalRegime === 'dominance' ? '#b71c1c' : '#c62828';
            breakdownHtml += `<div style="background: ${regimeColor}; color: white; padding: 6px 8px; margin-bottom: 8px; font-size: 11px;">`;
            breakdownHtml += `<strong>⚠ REGIME SHIFT:</strong> Using TOTAL deficit + ${d.deficitToInflationElasticity.toFixed(2)} elasticity (${(d.deficitToInflationElasticity / modelParams.deficitToInflationBase).toFixed(1)}× base)`;
            breakdownHtml += `</div>`;
          }
          
          // Stage 1
          breakdownHtml += `<div style="border-left: 3px solid #1976d2; padding-left: 8px; margin: 6px 0;">`;
          breakdownHtml += `<strong>1. Deficit Pressure</strong><br>`;
          breakdownHtml += `${d.deficitPctForPressure.toFixed(1)}% GDP × ${d.deficitToInflationElasticity.toFixed(2)} × ${d.slackMultiplier}× = <strong>${d.rawPressure.toFixed(1)}pp</strong>`;
          breakdownHtml += `</div>`;
          
          // Stage 2
          const cbColor = d.cbAbsorptionRate > 0.5 ? '#2e7d32' : d.cbAbsorptionRate > 0.2 ? '#ef6c00' : '#c62828';
          breakdownHtml += `<div style="border-left: 3px solid ${cbColor}; padding-left: 8px; margin: 6px 0;">`;
          breakdownHtml += `<strong>2. CB Absorption</strong><br>`;
          breakdownHtml += `CB absorbs ${(d.cbAbsorptionRate * 100).toFixed(0)}% → net: <strong>${d.netPressure.toFixed(1)}pp</strong>`;
          breakdownHtml += `</div>`;
          
          // Stage 3
          const expColor = d.expectationsAnchored ? '#2e7d32' : '#c62828';
          breakdownHtml += `<div style="border-left: 3px solid ${expColor}; padding-left: 8px; margin: 6px 0;">`;
          breakdownHtml += `<strong>3. Expectations</strong> `;
          breakdownHtml += d.expectationsAnchored ? `(anchored)` : `<span style="color: #c62828; font-weight: bold;">UNANCHORED</span>`;
          breakdownHtml += `<br>`;
          breakdownHtml += `${d.expectationsMultiplier.toFixed(2)}× → policy inflation: <strong>${d.policyInducedInflation.toFixed(1)}pp</strong>`;
          breakdownHtml += `</div>`;
          
          // Stage 4 - TFR
          breakdownHtml += `<div style="border-left: 3px solid #7b1fa2; padding-left: 8px; margin: 6px 0;">`;
          breakdownHtml += `<strong>4. TFR Impact</strong><br>`;
          if (r.usingAbsoluteCPI) {
            breakdownHtml += `<span style="color: #c62828;">Using ABSOLUTE CPI: ${d.totalCPI.toFixed(1)}% − 2% floor = ${r.inflationForPenalty.toFixed(1)}pp</span><br>`;
          } else {
            breakdownHtml += `Policy-induced: ${r.inflationForPenalty.toFixed(1)}pp<br>`;
          }
          breakdownHtml += `TFR decline: <strong>${r.tfrDeclinePct.toFixed(1)}%</strong>`;
          if (r.uncertaintyApplied) {
            breakdownHtml += ` <span style="color: #c62828;">(×${r.uncertaintyAmp.toFixed(2)} uncertainty)</span>`;
          }
          breakdownHtml += `</div>`;
          
          // Total
          const penaltyColor = tfr.inflationPenalty > 0.3 ? '#b71c1c' : tfr.inflationPenalty > 0.15 ? '#c62828' : '#333';
          breakdownHtml += `<div style="font-size: 14px; font-weight: bold; margin-top: 10px; padding: 8px; background: #f5f5f5; border-radius: 4px; color: ${penaltyColor};">`;
          breakdownHtml += `TOTAL PENALTY: −${tfr.inflationPenalty.toFixed(2)} TFR`;
          if (r.capHit) {
            breakdownHtml += ` <span style="font-size: 11px; background: #b71c1c; color: white; padding: 2px 6px;">(CAPPED from −${r.uncappedPenalty.toFixed(2)})</span>`;
          } else if (tfr.inflationPenalty > 0.3) {
            breakdownHtml += ` <span style="font-size: 11px;">(SEVERE)</span>`;
          }
          breakdownHtml += `</div>`;
          
          inflationBreakdown.innerHTML = breakdownHtml;
          
          // Update fiscal stress indicator
          if (fiscalStressIndicator) {
            fiscalStressIndicator.style.display = 'block';
            const stressColors = {
              'normal': { bg: '#e8f5e9', text: '#2e7d32' },
              'elevated': { bg: '#fff3e0', text: '#ef6c00' },
              'stressed': { bg: '#ffebee', text: '#c62828' },
              'dominance': { bg: '#c62828', text: '#ffffff' }
            };
            const stressLabels = {
              'normal': 'Normal',
              'elevated': 'Elevated Risk',
              'stressed': '⚠ Fiscal Stress',
              'dominance': '🚨 FISCAL DOMINANCE'
            };
            const colors = stressColors[d.fiscalRegime] || stressColors.normal;
            fiscalStressIndicator.style.background = colors.bg;
            fiscalStressIndicator.style.color = colors.text;
            
            let modeNote = '';
            if (d.fiscalRegime === 'stressed' || d.fiscalRegime === 'dominance') {
              modeNote = ` — CB absorbs only ${(d.cbAbsorptionRate * 100).toFixed(0)}%`;
            }
            fiscalStressIndicator.textContent = `${stressLabels[d.fiscalRegime]} @ ${d.deficitPctGDP.toFixed(1)}% GDP${modeNote}`;
          }
          
          // Trigger fiscal crisis modal when entering dominance
          if (d.fiscalRegime === 'dominance' && !window.fiscalCrisisWarningShown) {
            window.fiscalCrisisWarningShown = true;
            document.getElementById('fiscal-crisis-modal').classList.add('visible');
          }
        }
      }

      growthContainer.classList.toggle('visible', tfr.tfrDrag > 0);
      if (tfr.tfrDrag > 0) document.getElementById('growth-penalty-val').textContent = `-${tfr.tfrDrag.toFixed(2)}`;
      
      // Update inflation rate display
      const inflationRateContainer = document.getElementById('inflation-rate-container');
      const inflationRateVal = document.getElementById('inflation-rate-val');
      const inflationRateStatus = document.getElementById('inflation-rate-status');
      
      if (window.lastInflationDynamics) {
        const cpi = window.lastInflationDynamics.totalCPI;
        inflationRateVal.textContent = cpi.toFixed(1) + '%';
        
        // Show badge and set appropriate styling
        inflationRateContainer.classList.remove('elevated', 'high', 'crisis');
        
        if (cpi > 8) {
          inflationRateContainer.classList.add('visible', 'crisis');
          inflationRateStatus.textContent = 'CRISIS';
        } else if (cpi > 5) {
          inflationRateContainer.classList.add('visible', 'high');
          inflationRateStatus.textContent = 'HIGH';
        } else if (cpi > 3.5) {
          inflationRateContainer.classList.add('visible', 'elevated');
          inflationRateStatus.textContent = 'ELEVATED';
        } else if (cpi > 2.5) {
          inflationRateContainer.classList.add('visible');
          inflationRateStatus.textContent = '';
        } else {
          inflationRateContainer.classList.remove('visible');
        }
      }
      
      // Show deficit warning modal on first deficit
      if (tfr.deficit > 0 && !window.deficitWarningShown) {
        window.deficitWarningShown = true;
        document.getElementById('deficit-modal').classList.add('visible');
      }

      // GDP 2075 projection with clean additive decomposition
      const entitlementSavings = calculateEntitlementSavings();
      const deficit = tfr.spending;  // Gross spending
      const offsets = tfr.offsets;   // Revenue offsets
      let gdp2075 = calculateGDP2075(tfr.mid, tfr.gdpDrag, entitlementSavings, deficit, offsets);
      
      // Add MARGINAL immigration GDP effect (vs baseline 1M/year current system)
      // Save current settings
      const savedLevel = immigrationConfig.annualLevel;
      const savedMech = immigrationConfig.selectionMechanism;
      const savedCurrentParams = {...immigrationConfig.params.current};
      
      // Calculate baseline (1M/year, current system, default params)
      immigrationConfig.annualLevel = 1000;
      immigrationConfig.selectionMechanism = 'current';
      immigrationConfig.params.current = { family: 66, employment: 15, diversity: 5, refugee: 14 };
      const baselineImmImpacts = calculateImmigrationImpacts();
      
      // Restore and calculate current
      immigrationConfig.annualLevel = savedLevel;
      immigrationConfig.selectionMechanism = savedMech;
      immigrationConfig.params.current = savedCurrentParams;
      const immImpacts = calculateImmigrationImpacts();
      
      // Marginal GDP effect = current - baseline
      const immGdpEffect = immImpacts.gdpEffect - baselineImmImpacts.gdpEffect;
      gdp2075 = gdp2075 * (1 + immGdpEffect / 100);
      
      const gdpEl = document.getElementById('gdp-projection');
      const gdpChangeEl = document.getElementById('gdp-change');
      
      gdpEl.textContent = `$${gdp2075.toFixed(0)}T`;
      
      const gdpDelta = gdp2075 - baselineGDP2075;
      const gdpPct = ((gdp2075 / baselineGDP2075) - 1) * 100;
      
      if (Math.abs(gdpPct) < 0.5) {
        gdpChangeEl.textContent = '(baseline)';
        gdpChangeEl.className = 'fiscal-sublabel';
      } else if (gdpDelta > 0) {
        gdpChangeEl.textContent = `+${gdpPct.toFixed(1)}%`;
        gdpChangeEl.className = 'fiscal-sublabel positive';
      } else {
        gdpChangeEl.textContent = `${gdpPct.toFixed(1)}%`;
        gdpChangeEl.className = 'fiscal-sublabel negative';
      }
      
      // Show GDP crash warning if economy is severely damaged
      if (gdpPct < -8 && !window.gdpCrashWarningShown) {
        window.gdpCrashWarningShown = true;
        const cpi = window.lastInflationDynamics ? window.lastInflationDynamics.totalCPI : 2.5;
        document.getElementById('gdp-crash-detail').textContent = `${gdpPct.toFixed(1)}% from baseline ($${Math.abs(gdpDelta).toFixed(0)}T)`;
        document.getElementById('gdp-crash-cpi').textContent = `${cpi.toFixed(1)}%`;
        document.getElementById('gdp-crash-modal').classList.add('visible');
      }
      // Reset warning flag if economy recovers
      if (gdpPct >= -5) {
        window.gdpCrashWarningShown = false;
      }

      // GDP per capita calculation
      // Population 2075 baseline: 380M (CBO projection)
      // Adjustments: TFR effect + immigration effect
      const baselinePop2075 = 380; // millions
      
      // TFR effect on population: higher TFR = more births over 50 years
      // Rough estimate: +0.1 TFR → +1% population by 2075 (births compound)
      const tfrPopEffect = (tfr.mid - 1.62) * 10; // % change
      
      // Immigration effect on population (reuse immImpacts from above)
      const immigrationPop = (immImpacts.level * 50 * 1.75) / 1000; // millions (gen1 + gen2)
      const baselineImmPop = (1000 * 50 * 1.75) / 1000; // baseline is 1M/yr
      const netImmPop = immigrationPop - baselineImmPop; // marginal vs baseline
      
      const pop2075 = baselinePop2075 * (1 + tfrPopEffect/100) + netImmPop;
      const baselineGDPPerCapita = (baselineGDP2075 * 1e12) / (baselinePop2075 * 1e6); // $
      const gdpPerCapita2075 = (gdp2075 * 1e12) / (pop2075 * 1e6); // $
      
      const gdpPerCapitaEl = document.getElementById('gdp-per-capita');
      const gdpPerCapitaChangeEl = document.getElementById('gdp-per-capita-change');
      
      if (gdpPerCapitaEl) {
        gdpPerCapitaEl.textContent = `$${Math.round(gdpPerCapita2075 / 1000)}k`;
        
        const perCapitaPctChange = ((gdpPerCapita2075 / baselineGDPPerCapita) - 1) * 100;
        
        if (Math.abs(perCapitaPctChange) < 0.5) {
          gdpPerCapitaChangeEl.textContent = '(baseline)';
          gdpPerCapitaChangeEl.className = 'fiscal-sublabel';
        } else if (perCapitaPctChange > 0) {
          gdpPerCapitaChangeEl.textContent = `+${perCapitaPctChange.toFixed(1)}%`;
          gdpPerCapitaChangeEl.className = 'fiscal-sublabel positive';
          gdpPerCapitaEl.className = 'fiscal-value positive';
        } else {
          gdpPerCapitaChangeEl.textContent = `${perCapitaPctChange.toFixed(1)}%`;
          gdpPerCapitaChangeEl.className = 'fiscal-sublabel negative';
          gdpPerCapitaEl.className = 'fiscal-value negative';
        }
      }

      // Clean additive decomposition: each effect computed holding others at baseline
      document.getElementById('gdp-baseline-val').textContent = `$${baselineGDP2075.toFixed(0)}T`;
      
      // Fiscal effect only (entitlement savings + deficit crowding out, but NOT inflation)
      // We need to temporarily disable baseline deficit for this calculation
      const savedBaseline = modelParams.baselineDeficit;
      modelParams.baselineDeficit = 0; // Temporarily zero out for decomposition
      const gdpFiscalOnly = calculateGDP2075(1.62, 0, entitlementSavings, 0, 0); // No deficit = no inflation drag
      modelParams.baselineDeficit = savedBaseline; // Restore
      
      // Simple crowding out effect (linear, without inflation)
      const netDeficit = deficit - offsets;
      const crowdingOutDrag = Math.max(0, netDeficit / 100) * 0.0002; // Same as in the function
      const crowdingOutGDP = 28 * Math.pow(1 + (0.02 - crowdingOutDrag), 50);
      const fiscalEffect = (gdpFiscalOnly - baselineGDP2075) + (crowdingOutGDP - baselineGDP2075);
      document.getElementById('gdp-fiscal-val').textContent = fiscalEffect >= 0 ? `+$${fiscalEffect.toFixed(0)}T` : `−$${Math.abs(fiscalEffect).toFixed(0)}T`;
      
      // Tax drag effect only
      const gdpTaxOnly = calculateGDP2075(1.62, tfr.gdpDrag, 0, 0, 0);
      const taxEffect = gdpTaxOnly - baselineGDP2075;
      document.getElementById('gdp-tax-drag-val').textContent = taxEffect >= 0 ? `+$${taxEffect.toFixed(0)}T` : `−$${Math.abs(taxEffect).toFixed(0)}T`;
      
      // Inflation drag effect (from fiscal dominance)
      const inflationRow = document.getElementById('gdp-inflation-row');
      const inflationVal = document.getElementById('gdp-inflation-val');
      if (window.lastGDPCalc && window.lastGDPCalc.inflationGrowthDrag > 0.0001) {
        inflationRow.style.display = 'flex';
        // Calculate GDP loss from inflation drag over 50 years
        const dragPerYear = window.lastGDPCalc.inflationGrowthDrag;
        const totalDrag = dragPerYear + (window.lastGDPCalc.dominanceGrowthDrag || 0);
        const gdpWithoutInflationDrag = 28 * Math.pow(1.02, 50);
        const gdpWithInflationDrag = 28 * Math.pow(1.02 - totalDrag, 50);
        const inflationEffect = gdpWithInflationDrag - gdpWithoutInflationDrag;
        inflationVal.textContent = `−$${Math.abs(inflationEffect).toFixed(0)}T`;
        inflationVal.title = `${(window.lastGDPCalc.totalInflation || 0).toFixed(1)}pp inflation → ${(totalDrag * 100).toFixed(2)}% lower annual growth`;
      } else {
        inflationRow.style.display = 'none';
      }
      
      // Population effect only
      const gdpPopOnly = calculateGDP2075(tfr.mid, 0, 0, 0, 0);
      const popEffect = gdpPopOnly - baselineGDP2075;
      document.getElementById('gdp-pop-val').textContent = popEffect >= 0 ? `+$${popEffect.toFixed(0)}T` : `−$${Math.abs(popEffect).toFixed(0)}T`;
      
      // Immigration effect (already calculated above as immGdpEffect)
      const gdpImmigrationRow = document.getElementById('gdp-immigration-row');
      const gdpImmigrationVal = document.getElementById('gdp-immigration-val');
      if (gdpImmigrationRow && gdpImmigrationVal) {
        // Immigration effect in $T (immGdpEffect is % change)
        const immEffectT = baselineGDP2075 * (immGdpEffect / 100);
        if (Math.abs(immEffectT) < 0.5) {
          gdpImmigrationRow.style.display = 'none';
        } else {
          gdpImmigrationRow.style.display = 'flex';
          gdpImmigrationVal.textContent = immEffectT >= 0 ? `+$${immEffectT.toFixed(0)}T` : `−$${Math.abs(immEffectT).toFixed(0)}T`;
          gdpImmigrationVal.style.color = immEffectT >= 0 ? '#7cb342' : '#ef5350';
        }
      }
      
      // Interaction residual (total - sum of individual effects)
      const totalDragCalc = window.lastGDPCalc ? window.lastGDPCalc.inflationGrowthDrag + (window.lastGDPCalc.dominanceGrowthDrag || 0) : 0;
      const inflationEffectForSum = totalDragCalc > 0 ? -(28 * Math.pow(1.02, 50) - 28 * Math.pow(1.02 - totalDragCalc, 50)) : 0;
      const immEffectForSum = baselineGDP2075 * (immGdpEffect / 100);
      const sumOfEffects = fiscalEffect + taxEffect + popEffect + (inflationEffectForSum < 0 ? inflationEffectForSum : 0) + immEffectForSum;
      const interactionResidual = gdpDelta - sumOfEffects;
      document.getElementById('gdp-interaction-val').textContent = interactionResidual >= 0 ? `+$${interactionResidual.toFixed(0)}T` : `−$${Math.abs(interactionResidual).toFixed(0)}T`;
      
      document.getElementById('gdp-total-val').textContent = `$${gdp2075.toFixed(0)}T`;

      document.getElementById('count-policies').textContent = [...liberalPolicies, ...illiberalPolicies].filter(p => p.enabled).length;
      document.getElementById('count-entitlements').textContent = entitlementReforms.filter(r => r.enabled).length;
      document.getElementById('count-taxes').textContent = taxIncreases.filter(t => t.enabled).length;
      
      // Update effective impact on each policy card
      updateEffectiveImpacts(tfr, fiscal);
      
      // Save state to localStorage
      saveState();
    }

    function updateEffectiveImpacts(tfr, fiscal) {
      const enabledPolicies = [...liberalPolicies, ...illiberalPolicies].filter(p => p.enabled);
      const enabledCount = enabledPolicies.length;
      
      // Calculate the discount factors
      const interactionFactor = enabledCount > 1 ? (1 - modelParams.interactionDiscount/100) : 1;
      const contextFactor = (1 - modelParams.contextAdjustment/100);
      const implementationFactor = (modelParams.implementationRate/100);
      const totalFactor = interactionFactor * contextFactor * implementationFactor;
      
      // Calculate per-policy share of inflation penalty
      const inflationPenaltyPerPolicy = enabledCount > 0 ? tfr.inflationPenalty / enabledCount : 0;
      
      // Update each enabled policy card
      [...liberalPolicies, ...illiberalPolicies].forEach(policy => {
        const card = document.querySelector(`[data-policy-id="${policy.id}"]`);
        if (!card) return;
        
        const effectiveDiv = card.querySelector('.effective-impact');
        const effectiveValue = card.querySelector('.effective-value');
        const effectiveBreakdown = card.querySelector('.effective-breakdown');
        
        if (!effectiveDiv) return;
        
        if (policy.enabled) {
          effectiveDiv.classList.remove('hidden');
          
          // Calculate this policy's effective contribution
          const grossTfr = (policy.tfrLow + policy.tfrHigh) / 2;
          const afterDiscounts = grossTfr * totalFactor;
          const effectiveTfr = afterDiscounts - inflationPenaltyPerPolicy;
          
          effectiveValue.textContent = effectiveTfr >= 0 ? `+${effectiveTfr.toFixed(2)} TFR` : `${effectiveTfr.toFixed(2)} TFR`;
          effectiveValue.classList.toggle('negative', effectiveTfr < 0);
          
          // Build breakdown text
          let breakdownParts = [];
          breakdownParts.push(`Base: +${grossTfr.toFixed(2)}`);
          
          if (totalFactor < 1) {
            const discountPct = Math.round((1 - totalFactor) * 100);
            breakdownParts.push(`Discounts: −${discountPct}%`);
          }
          
          if (inflationPenaltyPerPolicy > 0.001) {
            breakdownParts.push(`Inflation: −${inflationPenaltyPerPolicy.toFixed(2)}`);
          }
          
          effectiveBreakdown.textContent = breakdownParts.join(' → ');
        } else {
          effectiveDiv.classList.add('hidden');
        }
      });
      
      // Update header feasibility indicator
      const feasibility = calculateFeasibility();
      const headerGradeEl = document.getElementById('header-feasibility-grade');
      const headerWarningEl = document.getElementById('header-feasibility-warning');
      
      headerGradeEl.textContent = feasibility.grade;
      headerGradeEl.className = `fiscal-value feasibility-grade grade-${feasibility.grade.toLowerCase()}`;
      
      if (feasibility.authoritarianLevel) {
        headerWarningEl.textContent = feasibility.authoritarianLevel === 'hard' 
          ? '⚠ Hard authoritarianism' 
          : '⚠ Soft authoritarianism';
        headerWarningEl.style.display = 'block';
      } else {
        headerWarningEl.textContent = '';
        headerWarningEl.style.display = 'none';
      }
    }

    function renderPolicyCard(policy, container, isIlliberal = false) {
      const cardContainer = document.createElement('div');
      cardContainer.className = 'card-container';

      const tfrMid = ((policy.tfrLow + policy.tfrHigh) / 2).toFixed(2);
      const costMid = Math.round((policy.costLow + policy.costHigh) / 2);

      // Build sources table HTML
      let sourcesHTML = '';
      if (policy.methodology && policy.methodology.sources) {
        sourcesHTML = `
          <table class="elasticity-table">
            <thead>
              <tr>
                <th>Source</th>
                <th>Finding</th>
                <th>Elasticity</th>
              </tr>
            </thead>
            <tbody>
              ${policy.methodology.sources.map(s => `
                <tr>
                  <td><span class="source-cite">${s.cite}</span></td>
                  <td>${s.finding}</td>
                  <td>${s.elasticity}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
      }

      const confidenceClass = policy.confidence === 'high' ? 'high' : 
                              policy.confidence === 'medium-high' ? 'medium' :
                              policy.confidence === 'medium' ? 'medium' : 'low';

      // Custom slider config or fallback to intensity
      const sc = policy.sliderConfig || { label: 'Intensity', min: 25, max: 100, default: 100, format: v => `${v}%` };
      const sliderValue = sc.default;

      cardContainer.innerHTML = `
        <div class="card-flipper">
          <div class="card-front">
            <div class="policy-card${isIlliberal ? ' illiberal' : ''}" data-policy-id="${policy.id}">
              <div class="policy-header">
                <span class="policy-title" data-flip="true">${policy.name}</span>
                <div class="policy-stats">
                  <span class="policy-stat tfr policy-tfr">+${tfrMid} TFR</span>
                  <span class="policy-stat cost policy-cost">${policy.revenue ? '−' : ''}$${Math.abs(costMid)}B</span>
                </div>
              </div>
              <p class="policy-description">${policy.description}</p>
              ${policy.historical ? `<div class="historical-note">${policy.historical}</div>` : ''}
              <div class="toggle-row">
                <span class="toggle-label">Disabled</span>
                <label class="toggle"><input type="checkbox"><div class="toggle-track"><div class="toggle-thumb"></div></div></label>
              </div>
              <div class="slider-row hidden">
                <div class="slider-header"><span class="slider-label">${sc.label}</span><span class="slider-value">${sc.format(sliderValue)}</span></div>
                <input type="range" min="${sc.min}" max="${sc.max}" value="${sliderValue}">
              </div>
              <div class="effective-impact hidden">
                <span class="effective-label">Effective impact:</span>
                <span class="effective-value">+0.00 TFR</span>
                <span class="effective-breakdown"></span>
              </div>
            </div>
          </div>
          <div class="card-back">
            <div class="methodology-card${isIlliberal ? ' illiberal' : ''}">
              <div class="methodology-header">
                <span class="methodology-title">Methodology & Sources</span>
                <button class="back-button" data-flip="true">← Back</button>
              </div>
              <div class="methodology-section">
                <div class="methodology-section-title">Confidence Level</div>
                <span class="confidence-badge ${confidenceClass}">${policy.confidence || 'Unknown'}</span>
              </div>
              <div class="methodology-section">
                <div class="methodology-section-title">Derivation</div>
                <div class="methodology-content">${policy.methodology ? policy.methodology.derivation : 'No methodology available.'}</div>
              </div>
              <div class="methodology-section">
                <div class="methodology-section-title">Literature Sources</div>
                ${sourcesHTML || '<div class="methodology-content"><em>No direct sources available.</em></div>'}
              </div>
              ${policy.methodology && policy.methodology.notes ? `
              <div class="methodology-section">
                <div class="methodology-section-title">Notes & Caveats</div>
                <div class="methodology-content">${policy.methodology.notes}</div>
              </div>
              ` : ''}
            </div>
          </div>
        </div>
      `;

      // Flip handlers
      const flipTriggers = cardContainer.querySelectorAll('[data-flip="true"]');
      flipTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
          e.stopPropagation();
          cardContainer.classList.toggle('flipped');
        });
      });

      // Toggle and slider handlers
      const policyCard = cardContainer.querySelector('.policy-card');
      const toggle = cardContainer.querySelector('input[type="checkbox"]');
      const slider = cardContainer.querySelector('input[type="range"]');
      const sliderRow = cardContainer.querySelector('.slider-row');
      const sliderValueEl = cardContainer.querySelector('.slider-value');
      const toggleLabel = cardContainer.querySelector('.toggle-label');
      const tfrStat = cardContainer.querySelector('.policy-tfr');
      const costStat = cardContainer.querySelector('.policy-cost');

      // Store base values for scaling
      const baseTfrLow = policy.tfrLow;
      const baseTfrHigh = policy.tfrHigh;
      const baseCostLow = policy.costLow;
      const baseCostHigh = policy.costHigh;

      toggle.addEventListener('change', () => {
        policy.enabled = toggle.checked;
        policyCard.classList.toggle('enabled', policy.enabled);
        sliderRow.classList.toggle('hidden', !policy.enabled);
        toggleLabel.textContent = policy.enabled ? 'Enabled' : 'Disabled';
        updateDisplay();
      });

      slider.addEventListener('input', () => {
        const val = parseInt(slider.value);
        sliderValueEl.textContent = sc.format(val);
        
        // Calculate intensity as ratio to default
        let ratio;
        
        if (sc.invert) {
          // For inverted sliders (like childcare cost), lower value = higher effect
          // Map [min, max] to [maxRatio, minRatio] linearly
          const minRatio = 0.25;  // At max value ($20/day), effect is 25% of default
          const maxRatio = 1.25;  // At min value ($0/day), effect is 125% of default
          const t = (val - sc.min) / (sc.max - sc.min); // 0 to 1
          ratio = maxRatio + (minRatio - maxRatio) * t;
        } else {
          ratio = val / sc.default;
        }
        
        // Clamp ratio to reasonable bounds
        ratio = Math.max(0.1, Math.min(2.5, ratio));
        
        policy.intensity = ratio * 100;
        
        // Update displayed TFR and cost
        policy.tfrLow = baseTfrLow * ratio;
        policy.tfrHigh = baseTfrHigh * ratio;
        policy.costLow = baseCostLow * ratio;
        policy.costHigh = baseCostHigh * ratio;
        
        const newTfrMid = ((policy.tfrLow + policy.tfrHigh) / 2).toFixed(2);
        const newCostMid = Math.round((policy.costLow + policy.costHigh) / 2);
        
        tfrStat.textContent = `+${newTfrMid} TFR`;
        costStat.textContent = `${policy.revenue ? '−' : ''}$${Math.abs(newCostMid)}B`;
        
        updateDisplay();
      });

      container.appendChild(cardContainer);
    }

    function renderReformCard(reform, container, isTax = false) {
      if (isTax && reform.methodology) {
        // Tax cards with methodology get flip functionality
        renderTaxCard(reform, container);
        return;
      }

      // Entitlement reform cards with flip for methodology
      const cardContainer = document.createElement('div');
      cardContainer.className = 'card-container';

      const savingsMid = Math.round((reform.savingsLow + reform.savingsHigh) / 2);
      const hasDrag = reform.growthDrag > 0;
      const sc = reform.sliderConfig;
      const hasMethodology = reform.methodology;

      // Build methodology back if available
      let methodologyHTML = '';
      if (hasMethodology) {
        const m = reform.methodology;
        methodologyHTML = `
          <div class="card-back">
            <div class="methodology-card entitlement">
              <div class="methodology-header">
                <span class="methodology-title">Methodology</span>
                <button class="back-button" data-flip="true">← Back</button>
              </div>
              <div class="methodology-section">
                <div class="methodology-section-title">Derivation</div>
                <p style="font-size: 12px; line-height: 1.5;">${m.derivation}</p>
              </div>
              <div class="methodology-section">
                <div class="methodology-section-title">Sources</div>
                <p style="font-size: 11px; color: var(--muted);">${m.sources.join(' · ')}</p>
              </div>
              ${m.caveats ? `
              <div class="methodology-section">
                <div class="methodology-section-title">Caveats</div>
                <p style="font-size: 11px; color: #c62828;">${m.caveats}</p>
              </div>
              ` : ''}
            </div>
          </div>
        `;
      }

      cardContainer.innerHTML = `
        <div class="card-flipper">
          <div class="card-front">
            <div class="policy-card entitlement-card">
              <div class="policy-header">
                <span class="policy-title" ${hasMethodology ? 'data-flip="true"' : 'style="cursor: default;"'}>${reform.name}</span>
                <div class="policy-stats">
                  <span class="policy-stat cost reform-savings">$${savingsMid}B/yr</span>
                  ${hasDrag ? `<span class="policy-stat drag">−${reform.growthDrag.toFixed(2)} TFR</span>` : ''}
                </div>
              </div>
              <p class="policy-description">${reform.description}${hasDrag ? ` <em style="color:#5d4037;">(${reform.dragRationale})</em>` : ''}</p>
              <div class="toggle-row">
                <span class="toggle-label">Disabled</span>
                <label class="toggle"><input type="checkbox"><div class="toggle-track"><div class="toggle-thumb"></div></div></label>
              </div>
              ${sc ? `
              <div class="slider-row hidden">
                <div class="slider-header">
                  <span class="slider-label">${sc.label}</span>
                  <span class="slider-value">${sc.format(sc.default)}</span>
                </div>
                <input type="range" min="${sc.min}" max="${sc.max}" value="${sc.default}">
              </div>
              ` : ''}
            </div>
          </div>
          ${methodologyHTML}
        </div>
      `;

      const card = cardContainer.querySelector('.policy-card');
      const toggle = card.querySelector('input[type="checkbox"]');
      const toggleLabel = card.querySelector('.toggle-label');
      const sliderRow = card.querySelector('.slider-row');
      const slider = card.querySelector('input[type="range"]');
      const sliderValueEl = card.querySelector('.slider-value');
      const savingsStat = card.querySelector('.reform-savings');

      // Store base values for scaling
      const baseSavingsLow = reform.savingsLow;
      const baseSavingsHigh = reform.savingsHigh;

      toggle.addEventListener('change', () => {
        reform.enabled = toggle.checked;
        card.classList.toggle('enabled', reform.enabled);
        if (sliderRow) sliderRow.classList.toggle('hidden', !reform.enabled);
        toggleLabel.textContent = reform.enabled ? 'Enabled' : 'Disabled';
        updateDisplay();
      });

      if (slider && sc) {
        slider.addEventListener('input', () => {
          const val = parseInt(slider.value);
          sliderValueEl.textContent = sc.format(val);
          
          // Calculate ratio based on reform type
          let ratio = 1;
          
          if (reform.id === 'medicare-age') {
            // 65 (current) to slider value, each year = ~$40-50B
            const denom = sc.default - 65;
            ratio = denom !== 0 ? (val - 65) / denom : 1;
          } else if (reform.id === 'ss-means-test') {
            // Lower threshold = more savings (more people affected)
            ratio = val > 0 ? sc.default / val : 2.5;
          } else if (reform.id === 'ss-cola') {
            // Higher reduction = more savings
            ratio = sc.default > 0 ? val / sc.default : 1;
          } else if (reform.id === 'medicare-drugs') {
            // More drugs = more savings
            ratio = sc.default > 0 ? val / sc.default : 1;
          } else if (reform.id === 'ss-retirement-70') {
            // 67 (current) to slider value
            const denom = sc.default - 67;
            ratio = denom !== 0 ? (val - 67) / denom : 1;
          } else if (reform.id === 'ss-cap') {
            // Lower cap = more savings
            ratio = val > 0 ? sc.default / val : 2.5;
          } else if (reform.id === 'medicare-premiums') {
            // Lower threshold = more savings
            ratio = val > 0 ? sc.default / val : 2.5;
          }
          
          // Clamp ratio to reasonable bounds and handle NaN/Infinity
          if (!isFinite(ratio) || isNaN(ratio)) ratio = 1;
          ratio = Math.max(0.25, Math.min(2.5, ratio));
          
          reform.savingsLow = Math.round(baseSavingsLow * ratio);
          reform.savingsHigh = Math.round(baseSavingsHigh * ratio);
          
          const newSavingsMid = Math.round((reform.savingsLow + reform.savingsHigh) / 2);
          savingsStat.textContent = `$${newSavingsMid}B/yr`;
          
          updateDisplay();
        });
      }

      // Add flip functionality if methodology exists
      if (hasMethodology) {
        cardContainer.querySelectorAll('[data-flip]').forEach(el => {
          el.addEventListener('click', (e) => {
            e.stopPropagation();
            cardContainer.classList.toggle('flipped');
          });
        });
      }

      container.appendChild(cardContainer);
    }

    function renderTaxCard(tax, container) {
      const cardContainer = document.createElement('div');
      cardContainer.className = 'card-container';
      cardContainer.setAttribute('data-tax-id', tax.id);

      const savingsMid = Math.round((tax.savingsLow + tax.savingsHigh) / 2);

      // Build sources table HTML
      let sourcesHTML = '';
      if (tax.methodology && tax.methodology.sources) {
        sourcesHTML = `
          <table class="elasticity-table">
            <thead>
              <tr>
                <th>Source</th>
                <th>Finding</th>
                <th>Elasticity</th>
              </tr>
            </thead>
            <tbody>
              ${tax.methodology.sources.map(s => `
                <tr>
                  <td><span class="source-cite">${s.cite}</span></td>
                  <td>${s.finding}</td>
                  <td>${s.elasticity}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
      }

      const confidenceClass = tax.confidence === 'high' ? 'high' : 
                              tax.confidence === 'medium-high' ? 'medium' :
                              tax.confidence === 'medium' ? 'medium' : 'low';

      // Format threshold display
      const formatThreshold = (val) => {
        if (tax.id === 'financial-transaction') return `${val} bp`;
        if (tax.id === 'corporate-tax' || tax.id === 'vat') return `${val}%`;
        if (tax.id === 'carbon-tax') return `$${val}/ton`;
        return `$${val >= 1000 ? (val/1000).toFixed(1) + 'M' : val + 'k'}`;
      };

      cardContainer.innerHTML = `
        <div class="card-flipper">
          <div class="card-front">
            <div class="policy-card tax-card" data-tax-id="${tax.id}">
              <div class="policy-header">
                <span class="policy-title" data-flip="true">${tax.name}</span>
                <div class="policy-stats">
                  <span class="policy-stat cost tax-cost">$${savingsMid}B/yr</span>
                  <span class="policy-stat drag tax-drag" ${tax.tfrDrag < 0 ? 'style="color:#7cb342"' : ''}>${tax.tfrDrag < 0 ? '+' : '−'}${Math.abs(tax.tfrDrag).toFixed(2)} TFR</span>
                </div>
              </div>
              <p class="policy-description">${tax.description} <em style="color:#5d4037;">(${tax.dragRationale})</em></p>
              <div class="toggle-row">
                <span class="toggle-label">Disabled</span>
                <label class="toggle"><input type="checkbox" class="tax-toggle"><div class="toggle-track"><div class="toggle-thumb"></div></div></label>
              </div>
              <div class="slider-row threshold-row hidden">
                <div class="slider-header">
                  <span class="slider-label">${tax.thresholdLabel}</span>
                  <span class="slider-value threshold-value">${formatThreshold(tax.threshold)}</span>
                </div>
                <input type="range" class="threshold-slider" min="${tax.thresholdMin}" max="${tax.thresholdMax}" value="${tax.threshold}">
              </div>
            </div>
          </div>
          <div class="card-back">
            <div class="methodology-card tax-methodology">
              <div class="methodology-header">
                <span class="methodology-title">Methodology & Sources</span>
                <button class="back-button" data-flip="true">← Back</button>
              </div>
              <div class="methodology-section">
                <div class="methodology-section-title">Confidence Level</div>
                <span class="confidence-badge ${confidenceClass}">${tax.confidence || 'Unknown'}</span>
              </div>
              <div class="methodology-section">
                <div class="methodology-section-title">Impact Derivation</div>
                <div class="methodology-content">${tax.methodology ? tax.methodology.derivation : 'No methodology available.'}</div>
              </div>
              <div class="methodology-section">
                <div class="methodology-section-title">Literature Sources</div>
                ${sourcesHTML || '<div class="methodology-content"><em>No direct sources available.</em></div>'}
              </div>
              ${tax.methodology && tax.methodology.notes ? `
              <div class="methodology-section">
                <div class="methodology-section-title">Notes & Caveats</div>
                <div class="methodology-content">${tax.methodology.notes}</div>
              </div>
              ` : ''}
            </div>
          </div>
        </div>
      `;

      // Flip handlers
      const flipTriggers = cardContainer.querySelectorAll('[data-flip="true"]');
      flipTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
          e.stopPropagation();
          cardContainer.classList.toggle('flipped');
        });
      });

      // Toggle and threshold slider handlers
      const policyCard = cardContainer.querySelector('.policy-card');
      const toggle = cardContainer.querySelector('.tax-toggle');
      const thresholdSlider = cardContainer.querySelector('.threshold-slider');
      const thresholdRow = cardContainer.querySelector('.threshold-row');
      const thresholdValue = cardContainer.querySelector('.threshold-value');
      const toggleLabel = cardContainer.querySelector('.toggle-label');
      const costStat = cardContainer.querySelector('.tax-cost');
      const dragStat = cardContainer.querySelector('.tax-drag');

      toggle.addEventListener('change', () => {
        tax.enabled = toggle.checked;
        policyCard.classList.toggle('enabled', tax.enabled);
        thresholdRow.classList.toggle('hidden', !tax.enabled);
        toggleLabel.textContent = tax.enabled ? 'Enabled' : 'Disabled';
        updateDisplay();
      });

      thresholdSlider.addEventListener('input', () => {
        tax.threshold = parseInt(thresholdSlider.value);
        thresholdValue.textContent = formatThreshold(tax.threshold);
        updateTaxRevenue(tax, costStat, dragStat);
        updateDisplay();
      });

      // Initialize tax revenue display with threshold-adjusted values
      updateTaxRevenue(tax, costStat, dragStat);

      container.appendChild(cardContainer);
    }

    function updateTaxRevenue(tax, costStat, dragStat) {
      // Adjust revenue based on threshold
      const baseRevenueLow = tax.id === 'income-tax-top' ? 80 :
                             tax.id === 'corporate-tax' ? 100 :
                             tax.id === 'capital-gains' ? 150 :
                             tax.id === 'financial-transaction' ? 60 :
                             tax.id === 'estate-tax' ? 40 :
                             tax.id === 'carbon-tax' ? 80 :
                             tax.id === 'vat' ? 400 :
                             tax.id === 'stepped-up-basis' ? 45 :
                             tax.id === 'land-value-tax' ? 300 :
                             tax.id === 'income-tax-all' ? 100 : 50;
      
      const baseRevenueHigh = tax.id === 'income-tax-top' ? 120 :
                              tax.id === 'corporate-tax' ? 150 :
                              tax.id === 'capital-gains' ? 200 :
                              tax.id === 'financial-transaction' ? 100 :
                              tax.id === 'estate-tax' ? 70 :
                              tax.id === 'carbon-tax' ? 120 :
                              tax.id === 'vat' ? 600 :
                              tax.id === 'stepped-up-basis' ? 57 :
                              tax.id === 'land-value-tax' ? 500 :
                              tax.id === 'income-tax-all' ? 130 : 75;

      // Base TFR drags (at default threshold)
      const baseTfrDrag = tax.id === 'income-tax-top' ? 0.01 :
                       tax.id === 'corporate-tax' ? 0.04 :
                       tax.id === 'capital-gains' ? 0.05 :
                       tax.id === 'financial-transaction' ? 0.02 :
                       tax.id === 'estate-tax' ? 0.01 :
                       tax.id === 'carbon-tax' ? 0.025 :
                       tax.id === 'vat' ? 0.02 :
                       tax.id === 'stepped-up-basis' ? 0.001 :
                       tax.id === 'land-value-tax' ? -0.004 : // POSITIVE for TFR
                       tax.id === 'income-tax-all' ? 0.009 : 0.01;

      // Base GDP drags (at default threshold)
      const baseGdpDrag = tax.id === 'income-tax-top' ? 0.002 :
                       tax.id === 'corporate-tax' ? 0.01 :
                       tax.id === 'capital-gains' ? 0.003 :
                       tax.id === 'financial-transaction' ? 0.002 :
                       tax.id === 'estate-tax' ? 0.001 :
                       tax.id === 'carbon-tax' ? 0.005 :
                       tax.id === 'vat' ? 0.001 :
                       tax.id === 'stepped-up-basis' ? -0.001 : // POSITIVE for GDP
                       tax.id === 'land-value-tax' ? 0.002 : // Rate-dependent: negative at low, positive at high
                       tax.id === 'income-tax-all' ? 0.0006 : 0.001;

      // Calculate multiplier based on threshold vs default
      let multiplier = 1;
      let dragMultiplier = 1;
      
      if (tax.id === 'income-tax-top') {
        // Lower threshold = more revenue, but also more drag
        // $500k is base; $250k doubles revenue/drag, $1M halves it
        multiplier = 500 / tax.threshold;
        dragMultiplier = multiplier;
      } else if (tax.id === 'corporate-tax') {
        // Higher rate = more revenue and more drag
        // 28% is base
        multiplier = tax.threshold / 28;
        dragMultiplier = multiplier;
      } else if (tax.id === 'capital-gains') {
        // Lower threshold = more revenue
        // $1M is base
        multiplier = 1000 / tax.threshold;
        dragMultiplier = Math.min(multiplier, 1.5); // Cap drag increase
      } else if (tax.id === 'financial-transaction') {
        // Higher rate = more revenue but diminishing returns due to reduced trading
        // 10bp is base
        const rateRatio = tax.threshold / 10;
        multiplier = rateRatio * Math.max(0.2, 1 - (tax.threshold - 10) * 0.003); // Diminishing returns, clamped
        dragMultiplier = rateRatio;
      } else if (tax.id === 'estate-tax') {
        // Lower exemption = more revenue
        // $3.5M is base
        multiplier = 3500 / tax.threshold;
        dragMultiplier = Math.min(multiplier, 2); // Cap drag increase
      } else if (tax.id === 'carbon-tax') {
        // Higher price = more revenue (roughly linear)
        // $50/ton is base
        multiplier = tax.threshold / 50;
        dragMultiplier = multiplier;
      } else if (tax.id === 'vat') {
        // Higher rate = more revenue (roughly linear)
        // 10% is base
        multiplier = tax.threshold / 10;
        dragMultiplier = multiplier;
      } else if (tax.id === 'stepped-up-basis') {
        // Higher exemption = less revenue
        // $1M exemption is base; $0 exemption = max revenue, $5M = minimal
        const exemptionFactor = Math.max(0.4, 1 - (tax.threshold / 5000) * 0.6);
        multiplier = exemptionFactor;
        dragMultiplier = exemptionFactor;
      } else if (tax.id === 'land-value-tax') {
        // Higher rate = more revenue (stored as basis points, 100 = 1%)
        // 100bp (1%) is base
        const ratePercent = tax.threshold / 100;
        const behavioralFactor = 1 - 0.05 * ratePercent; // slight base erosion at high rates
        multiplier = ratePercent * behavioralFactor;
        // GDP drag is rate-dependent: low rates = slight benefit, high rates = modest drag
        // baseGdpDrag = 0.002, multiplied by (rate - 0.4)
        // At 0.25%: 0.002 * -0.15 = -0.0003 (GDP gain)
        // At 0.5%:  0.002 * 0.1  = +0.0002 (tiny drag)  
        // At 1%:    0.002 * 0.6  = +0.0012 (small drag)
        // At 2%:    0.002 * 1.6  = +0.0032 (modest drag)
        dragMultiplier = ratePercent - 0.4;
      } else if (tax.id === 'income-tax-all') {
        // Higher pp increase = more revenue and more drag
        // 1pp is base
        const behavioralFactor = 1 - 0.03 * tax.threshold; // ETI response
        multiplier = tax.threshold * behavioralFactor;
        dragMultiplier = tax.threshold;
      }

      // Clamp multipliers to prevent negative/NaN values
      multiplier = Math.max(0.1, Math.min(5, multiplier));
      dragMultiplier = Math.max(0.1, Math.min(5, dragMultiplier));
      if (!isFinite(multiplier)) multiplier = 1;
      if (!isFinite(dragMultiplier)) dragMultiplier = 1;

      tax.savingsLow = Math.round(baseRevenueLow * multiplier);
      tax.savingsHigh = Math.round(baseRevenueHigh * multiplier);
      tax.tfrDrag = baseTfrDrag * dragMultiplier;
      tax.gdpDrag = baseGdpDrag * dragMultiplier;

      // Update the displayed stats
      if (costStat) costStat.textContent = `$${Math.round((tax.savingsLow + tax.savingsHigh) / 2)}B/yr`;
      if (dragStat) {
        if (tax.tfrDrag < 0) {
          // Positive effect (negative drag)
          dragStat.textContent = `+${Math.abs(tax.tfrDrag).toFixed(2)} TFR`;
          dragStat.style.color = '#7cb342';
        } else {
          dragStat.textContent = `−${tax.tfrDrag.toFixed(2)} TFR`;
          dragStat.style.color = '';
        }
      }
    }

    function renderModelParams(container) {
      // Existing TFR model parameters
      [
        { key: 'interactionDiscount', name: 'Interaction Discount', desc: 'Overlapping benefits reduce effects (20-30%)', min: 10, max: 40, format: v => `${v}%` },
        { key: 'contextAdjustment', name: 'US Context Adjustment', desc: 'European elasticities may not transfer', min: 0, max: 30, format: v => `${v}%` },
        { key: 'implementationRate', name: 'Implementation Rate', desc: 'Admin capacity and execution risk', min: 70, max: 100, format: v => `${v}%` }
      ].forEach(p => {
        const card = document.createElement('div');
        card.className = 'params-card';
        card.innerHTML = `
          <div class="slider-header"><span class="params-title">${p.name}</span><span class="slider-value">${p.format(modelParams[p.key])}</span></div>
          <input type="range" min="${p.min}" max="${p.max}" value="${modelParams[p.key]}">
          <p class="params-description">${p.desc}</p>
        `;
        const slider = card.querySelector('input[type="range"]');
        const value = card.querySelector('.slider-value');
        slider.addEventListener('input', () => {
          modelParams[p.key] = parseInt(slider.value);
          value.textContent = p.format(modelParams[p.key]);
          updateDisplay();
        });
        container.appendChild(card);
      });
      
      // Inflation Elasticity Section Header
      const sectionHeader = document.createElement('div');
      sectionHeader.className = 'params-section-header';
      sectionHeader.innerHTML = `
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 1px; text-transform: uppercase; color: #8b0000; margin: 20px 0 8px 0; padding-top: 12px; border-top: 1px solid #ccc;">
          Inflation Elasticities
          <span style="font-size: 9px; color: #666; text-transform: none; display: block; margin-top: 4px;">
            From empirical literature review. Tap ⓘ on Inflation badge above for citations.
          </span>
        </div>
      `;
      container.appendChild(sectionHeader);
      
      // Economic Slack selector (dropdown)
      const slackCard = document.createElement('div');
      slackCard.className = 'params-card';
      slackCard.innerHTML = `
        <div class="slider-header">
          <span class="params-title">Economic Conditions</span>
          <select id="economic-slack-select" style="font-family: 'JetBrains Mono', monospace; font-size: 11px; padding: 4px 8px; border: 1px solid #ccc; background: white;">
            <option value="slack" ${modelParams.economicSlack === 'slack' ? 'selected' : ''}>Significant Slack</option>
            <option value="near-full" ${modelParams.economicSlack === 'near-full' ? 'selected' : ''}>Near Full Employment</option>
            <option value="constrained" ${modelParams.economicSlack === 'constrained' ? 'selected' : ''}>Supply Constrained</option>
          </select>
        </div>
        <p class="params-description" id="slack-desc">Affects deficit→inflation elasticity (0.15-1.0% per 1% GDP)</p>
      `;
      const slackSelect = slackCard.querySelector('select');
      const slackDesc = slackCard.querySelector('#slack-desc');
      const slackDescriptions = {
        'slack': 'Low inflation sensitivity: 0.15-0.20% per 1% GDP deficit',
        'near-full': 'Moderate sensitivity: 0.25-0.40% per 1% GDP deficit',
        'constrained': 'High sensitivity: 0.50-1.0% per 1% GDP deficit (2021-23 conditions)'
      };
      slackDesc.textContent = slackDescriptions[modelParams.economicSlack];
      slackSelect.addEventListener('change', () => {
        modelParams.economicSlack = slackSelect.value;
        slackDesc.textContent = slackDescriptions[modelParams.economicSlack];
        updateDisplay();
      });
      container.appendChild(slackCard);
      
      // Deficit→Inflation elasticity slider
      const defInflCard = document.createElement('div');
      defInflCard.className = 'params-card';
      defInflCard.innerHTML = `
        <div class="slider-header">
          <span class="params-title">Deficit → Inflation</span>
          <span class="slider-value">${modelParams.deficitToInflationBase.toFixed(2)}% per 1% GDP</span>
        </div>
        <input type="range" min="10" max="60" value="${modelParams.deficitToInflationBase * 100}">
        <p class="params-description">Central: 0.30% (SF Fed, NY Fed, Bernanke-Blanchard)</p>
      `;
      const defInflSlider = defInflCard.querySelector('input');
      const defInflValue = defInflCard.querySelector('.slider-value');
      defInflSlider.addEventListener('input', () => {
        modelParams.deficitToInflationBase = parseInt(defInflSlider.value) / 100;
        defInflValue.textContent = `${modelParams.deficitToInflationBase.toFixed(2)}% per 1% GDP`;
        updateDisplay();
      });
      container.appendChild(defInflCard);
      
      // Inflation→TFR elasticity slider
      const inflTfrCard = document.createElement('div');
      inflTfrCard.className = 'params-card';
      inflTfrCard.innerHTML = `
        <div class="slider-header">
          <span class="params-title">Inflation → TFR (Low)</span>
          <span class="slider-value">${modelParams.inflationToTFRBase.toFixed(2)}% decline per 1pp</span>
        </div>
        <input type="range" min="30" max="100" value="${modelParams.inflationToTFRBase * 100}">
        <p class="params-description">Base elasticity for low inflation (0-2pp above target)</p>
      `;
      const inflTfrSlider = inflTfrCard.querySelector('input');
      const inflTfrValue = inflTfrCard.querySelector('.slider-value');
      inflTfrSlider.addEventListener('input', () => {
        modelParams.inflationToTFRBase = parseInt(inflTfrSlider.value) / 100;
        inflTfrValue.textContent = `${modelParams.inflationToTFRBase.toFixed(2)}% decline per 1pp`;
        updateDisplay();
      });
      container.appendChild(inflTfrCard);
      
      // High inflation TFR elasticity slider
      const inflTfrHighCard = document.createElement('div');
      inflTfrHighCard.className = 'params-card';
      inflTfrHighCard.innerHTML = `
        <div class="slider-header">
          <span class="params-title">Inflation → TFR (High)</span>
          <span class="slider-value">${modelParams.inflationToTFRHigh.toFixed(2)}% decline per 1pp</span>
        </div>
        <input type="range" min="50" max="150" value="${modelParams.inflationToTFRHigh * 100}">
        <p class="params-description">Elevated elasticity for high inflation (2pp+ above target)</p>
      `;
      const inflTfrHighSlider = inflTfrHighCard.querySelector('input');
      const inflTfrHighValue = inflTfrHighCard.querySelector('.slider-value');
      inflTfrHighSlider.addEventListener('input', () => {
        modelParams.inflationToTFRHigh = parseInt(inflTfrHighSlider.value) / 100;
        inflTfrHighValue.textContent = `${modelParams.inflationToTFRHigh.toFixed(2)}% decline per 1pp`;
        updateDisplay();
      });
      container.appendChild(inflTfrHighCard);
      
      // Baseline Deficit Section Header
      const baselineHeader = document.createElement('div');
      baselineHeader.innerHTML = `
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 1px; text-transform: uppercase; color: #5d4037; margin: 20px 0 8px 0; padding-top: 12px; border-top: 1px solid #ccc;">
          Fiscal & Inflation Baseline
          <span style="font-size: 9px; color: #666; text-transform: none; display: block; margin-top: 4px;">
            Current conditions as of Jan 2025. Adjust to model different scenarios.
          </span>
        </div>
      `;
      container.appendChild(baselineHeader);
      
      // Current inflation slider
      const baselineAboveTarget = modelParams.baselineCPI - modelParams.fedTarget;
      const inflationCard = document.createElement('div');
      inflationCard.className = 'params-card';
      inflationCard.innerHTML = `
        <div class="slider-header">
          <span class="params-title">Current CPI</span>
          <span class="slider-value">${modelParams.baselineCPI.toFixed(1)}% (${baselineAboveTarget > 0 ? '+' : ''}${baselineAboveTarget.toFixed(1)}pp above target)</span>
        </div>
        <input type="range" min="20" max="80" step="1" value="${modelParams.baselineCPI * 10}">
        <p class="params-description">BLS Nov 2025: 2.7% CPI. Fed target: 2.0%.</p>
      `;
      const inflationSlider = inflationCard.querySelector('input');
      const inflationValue = inflationCard.querySelector('.slider-value');
      inflationSlider.addEventListener('input', () => {
        modelParams.baselineCPI = parseInt(inflationSlider.value) / 10;
        const aboveTarget = modelParams.baselineCPI - modelParams.fedTarget;
        const delta = aboveTarget > 0 ? `+${aboveTarget.toFixed(1)}pp above target` : aboveTarget < 0 ? `${aboveTarget.toFixed(1)}pp below target` : 'at target';
        inflationValue.textContent = `${modelParams.baselineCPI.toFixed(1)}% (${delta})`;
        updateDisplay();
      });
      container.appendChild(inflationCard);
      
      // CB Credibility slider
      const cbCredCard = document.createElement('div');
      cbCredCard.className = 'params-card';
      cbCredCard.innerHTML = `
        <div class="slider-header">
          <span class="params-title">CB Credibility</span>
          <span class="slider-value">${modelParams.cbCredibility}%</span>
        </div>
        <input type="range" min="0" max="100" step="5" value="${modelParams.cbCredibility}">
        <p class="params-description">Fed credibility affects inflation expectations anchoring. US Fed ~85%. Turkey post-2021: ~30%.</p>
      `;
      const cbCredSlider = cbCredCard.querySelector('input');
      const cbCredValue = cbCredCard.querySelector('.slider-value');
      cbCredSlider.addEventListener('input', () => {
        modelParams.cbCredibility = parseInt(cbCredSlider.value);
        cbCredValue.textContent = `${modelParams.cbCredibility}%`;
        updateDisplay();
      });
      container.appendChild(cbCredCard);
      
      // Baseline deficit slider
      const baselineCard = document.createElement('div');
      baselineCard.className = 'params-card';
      baselineCard.innerHTML = `
        <div class="slider-header">
          <span class="params-title">CBO Baseline Deficit</span>
          <span class="slider-value">$${modelParams.baselineDeficit.toLocaleString()}B/yr</span>
        </div>
        <input type="range" min="0" max="3000" step="100" value="${modelParams.baselineDeficit}">
        <p class="params-description">FY2025: $1.9T (6.2% GDP). Set to 0 to model incremental only.</p>
      `;
      const baselineSlider = baselineCard.querySelector('input');
      const baselineValue = baselineCard.querySelector('.slider-value');
      baselineSlider.addEventListener('input', () => {
        modelParams.baselineDeficit = parseInt(baselineSlider.value);
        baselineValue.textContent = `$${modelParams.baselineDeficit.toLocaleString()}B/yr`;
        updateDisplay();
      });
      container.appendChild(baselineCard);
      
      // Fiscal dominance threshold slider
      const fdThresholdCard = document.createElement('div');
      fdThresholdCard.className = 'params-card';
      fdThresholdCard.innerHTML = `
        <div class="slider-header">
          <span class="params-title">Fiscal Dominance Threshold</span>
          <span class="slider-value">${modelParams.fiscalDominanceThreshold}% GDP</span>
        </div>
        <input type="range" min="8" max="15" step="0.5" value="${modelParams.fiscalDominanceThreshold}">
        <p class="params-description">Deficit/GDP at which CB loses control. Default 10%. Higher = more fiscal space before crisis.</p>
      `;
      const fdSlider = fdThresholdCard.querySelector('input');
      const fdValue = fdThresholdCard.querySelector('.slider-value');
      fdSlider.addEventListener('input', () => {
        modelParams.fiscalDominanceThreshold = parseFloat(fdSlider.value);
        fdValue.textContent = `${modelParams.fiscalDominanceThreshold}% GDP`;
        updateDisplay();
      });
      container.appendChild(fdThresholdCard);
    }

    // === IMMIGRATION FUNCTIONS ===
    
    // Derive source composition from mechanism and its parameters
    function deriveSourceComposition() {
      const mech = immigrationConfig.selectionMechanism;
      const params = immigrationConfig.params[mech];
      
      // Base composition varies by mechanism
      let weights = {
        westernHighIncome: 0,
        asiaHighSkill: 0,
        latinAmerica: 0,
        menapt: 0,
        otherNonWestern: 0
      };
      
      switch (mech) {
        case 'current':
          // Family-based: mostly LatAm (chain migration), some Asia
          // Employment: mostly Asia high-skill, some Western
          // Diversity: mostly Africa, MENAPT
          // Refugee: MENAPT, other
          const fam = params.family / 100;
          const emp = params.employment / 100;
          const div = params.diversity / 100;
          const ref = params.refugee / 100;
          
          weights.westernHighIncome = emp * 20 + fam * 5;
          weights.asiaHighSkill = emp * 60 + fam * 20;
          weights.latinAmerica = fam * 55 + ref * 20;
          weights.menapt = ref * 40 + div * 30 + fam * 10;
          weights.otherNonWestern = div * 70 + ref * 40 + fam * 10;
          break;
          
        case 'points':
          // Higher threshold = more selective = more high-skill
          const selectivity = (params.threshold - 50) / 40; // 0-1 scale
          const eduBias = params.educationWeight / 40;
          const langBias = params.languageWeight / 30;
          
          weights.westernHighIncome = 15 + selectivity * 20 + langBias * 15;
          weights.asiaHighSkill = 25 + selectivity * 25 + eduBias * 20;
          weights.latinAmerica = 30 - selectivity * 20;
          weights.menapt = 15 - selectivity * 10;
          weights.otherNonWestern = 15 - selectivity * 10;
          break;
          
        case 'employment':
          // H1B dominated by India/China
          // Higher wage floor = more senior/high-skill
          // Higher fee = more selective
          const wageSelect = (params.wagePremium - 1.0);
          const feeSelect = params.h1bFee / 50;
          
          weights.westernHighIncome = 10 + wageSelect * 20 + feeSelect * 15;
          weights.asiaHighSkill = 65 + feeSelect * 10;
          weights.latinAmerica = 10 - feeSelect * 5;
          weights.menapt = 8 - feeSelect * 3;
          weights.otherNonWestern = 7 - feeSelect * 3;
          break;
          
        case 'family':
          // Extended family = more chain migration from existing immigrant communities
          // Higher sponsor income = slightly more affluent chains
          const extended = params.extendedFamily / 100;
          const incomeReq = params.sponsorIncome / 75;
          
          weights.westernHighIncome = 8 + incomeReq * 10;
          weights.asiaHighSkill = 15 + incomeReq * 5;
          weights.latinAmerica = 50 + extended * 10 - incomeReq * 15;
          weights.menapt = 12 + extended * 5;
          weights.otherNonWestern = 15 + extended * 5 - incomeReq * 5;
          break;
          
        case 'diversity':
          // Lottery from underrepresented countries
          // Education req shifts composition slightly
          const eduReq = params.educationReq; // 0, 1, or 2
          
          weights.westernHighIncome = 5 + eduReq * 3;
          weights.asiaHighSkill = 10 + eduReq * 8;
          weights.latinAmerica = 15 - eduReq * 3; // Many LatAm not underrepresented
          weights.menapt = 25 - eduReq * 5;
          weights.otherNonWestern = 45 - eduReq * 3; // Mostly Africa
          break;
      }
      
      // Normalize to 100%
      const total = Object.values(weights).reduce((a, b) => a + b, 0);
      for (const k in weights) {
        weights[k] = Math.max(0, (weights[k] / total) * 100);
      }
      
      return weights;
    }

    function calculateImmigrationImpacts() {
      const level = immigrationConfig.annualLevel;
      const mech = immigrationConfig.selectionMechanism;
      const params = immigrationConfig.params[mech];
      
      // Get derived source composition
      const effectiveWeights = deriveSourceComposition();
      
      // Calculate blended metrics from composition
      // Using Danish Finance Ministry lifecycle data calibration
      let blendedTFR = 0;
      let blendedFiscalNPV = 0;
      let blendedSkillPremium = 0;
      let blendedEmploymentRate = 0;
      
      for (const regionId in effectiveWeights) {
        const weight = effectiveWeights[regionId] / 100;
        const region = sourceRegions[regionId];
        if (!region) continue;
        
        blendedTFR += weight * region.initialTFR;
        blendedFiscalNPV += weight * region.fiscalNPV;
        blendedSkillPremium += weight * region.skillPremium;
        blendedEmploymentRate += weight * region.employmentRate;
      }
      
      // ================================================
      // MECHANISM-SPECIFIC MODIFIERS
      // Based on Danish data: selection mechanism matters enormously
      // Employment-based: +60% fiscal vs baseline
      // Points system: +40% fiscal
      // Family reunification: -20% fiscal  
      // Refugee/Diversity: -30% to -50% fiscal
      // GDP bonus is ADDITIVE to skill premium, not multiplicative
      // ================================================
      let fiscalBonus = 1, gdpBonus = 0, tfrMod = 0;  // gdpBonus is now additive
      let crowdoutMultiplier = 1; // Stream-specific crowdout intensity
      
      switch (mech) {
        case 'current':
          // Baseline mix - crowdout scales with refugee share
          const refShare = params.refugee / 100;
          const divShare = params.diversity / 100;
          crowdoutMultiplier = 1 + (refShare + divShare) * 0.5;
          // Fiscal scales with employment share
          const empShare = params.employment / 100;
          fiscalBonus = 0.85 + empShare * 1.0; // Employment improves fiscal
          gdpBonus = -0.05 + empShare * 0.15; // Slight negative baseline, employment helps
          break;
          
        case 'points':
          const selectivity = (params.threshold - 50) / 40;
          fiscalBonus = 1.2 + selectivity * 0.4; // Points = much better fiscal
          gdpBonus = 0.05 + selectivity * 0.10; // +5% to +15% skill boost from selection
          tfrMod = -selectivity * 0.12; // High-skill = lower fertility
          crowdoutMultiplier = 0.6 - selectivity * 0.2; // Less crowdout (higher income)
          break;
          
        case 'employment':
          const wageBonus = params.wagePremium - 1.0;
          const feeBonus = params.h1bFee / 50;
          // Danish data: employment-based = best fiscal outcomes
          fiscalBonus = 1.4 + wageBonus * 0.4 + feeBonus * 0.3;
          gdpBonus = 0.10 + wageBonus * 0.10 + feeBonus * 0.05; // +10% to +25% skill boost
          tfrMod = -0.08 - wageBonus * 0.08; // Tech workers have fewer kids
          crowdoutMultiplier = 0.4; // High-skill = minimal crowdout
          break;
          
        case 'family':
          const extended = params.extendedFamily / 100;
          const incomeReq = params.sponsorIncome / 75;
          // Family reunification = worse fiscal than employment
          // But sponsor income requirements help
          fiscalBonus = 0.75 - extended * 0.2 + incomeReq * 0.3;
          gdpBonus = -0.05 - extended * 0.05 + incomeReq * 0.08; // -10% to +3%
          tfrMod = 0.08 + extended * 0.08;
          crowdoutMultiplier = 1.2 + extended * 0.3 - incomeReq * 0.4;
          break;
          
        case 'diversity':
          const eduReq = params.educationReq;
          // Diversity lottery = worst fiscal outcomes (Danish MENAPT data)
          // Unless education requirements are strict
          fiscalBonus = 0.5 + eduReq * 0.2; // Even with BA, still below baseline
          gdpBonus = -0.15 + eduReq * 0.08; // -15% to -7% even with education req
          tfrMod = 0.18 - eduReq * 0.06;
          // High crowdout: lower income, more density, slower labor integration
          crowdoutMultiplier = 1.6 - eduReq * 0.3;
          break;
      }
      
      blendedFiscalNPV *= fiscalBonus;
      blendedSkillPremium += gdpBonus; // ADDITIVE, not multiplicative
      blendedTFR += tfrMod;
      
      // Population calculations
      const totalImmigrants = level * 50 * 1000;
      const gen2 = totalImmigrants * 0.75;
      const totalPopAdded = totalImmigrants + gen2;
      
      const baselinePop2075 = 380000000;
      const popWithImmigration = baselinePop2075 + totalPopAdded;
      const popGrowthPct = ((popWithImmigration - baselinePop2075) / baselinePop2075) * 100;
      
      // TFR effect
      const immigrantBirthShare = Math.min(0.30, (level / 1000) * 0.15);
      const nativeTFR = 1.62;
      const gen2TFR = nativeTFR * 0.8 + blendedTFR * 0.2;
      const effectiveImmigrantTFR = (blendedTFR + gen2TFR) / 2;
      const directTFREffect = immigrantBirthShare * (effectiveImmigrantTFR - nativeTFR);
      
      // ================================================
      // NATIVE FERTILITY CROWDOUT
      // Calibrated to Seah (2018) Mariel Boatlift study:
      // 7% labor force increase → 8-11% rent increase → 14% fertility decline
      // Effect is MUCH stronger for low-skill/refugee streams
      // ================================================
      const baselineLevel = 1000;
      const excessImmigration = Math.max(0, level - baselineLevel);
      
      // Housing pressure: base effect scaled by stream
      // Mariel: 14% fertility decline from 7% pop shock among renters
      // Translates to roughly -0.02 TFR per 500k at baseline composition
      const baseHousingCrowdout = (excessImmigration / 500) * 0.012;
      const housingCrowdout = baseHousingCrowdout * crowdoutMultiplier;
      
      // Labor market pressure: scales with low-skill share AND employment competition
      const lowSkillShare = (
        (effectiveWeights.latinAmerica || 0) * 0.7 +
        (effectiveWeights.menapt || 0) * 0.6 +
        (effectiveWeights.otherNonWestern || 0) * 0.65 +
        (effectiveWeights.westernHighIncome || 0) * 0.2 +
        (effectiveWeights.asiaHighSkill || 0) * 0.15
      ) / 100;
      
      // Labor crowdout also affected by stream (refugees compete differently than H1Bs)
      const baseLaborCrowdout = (excessImmigration / 500) * 0.006 * (lowSkillShare / 0.5);
      const laborCrowdout = baseLaborCrowdout * crowdoutMultiplier;
      
      // Total native crowdout
      const nativeCrowdout = housingCrowdout + laborCrowdout;
      const nationalTFREffect = directTFREffect - nativeCrowdout;
      
      // ================================================
      // GEN2 CHARACTERISTICS
      // Danish data: 2nd generation shows PARTIAL convergence, NOT reversion to mean
      // MENAPT gen2 employment: ~65% (vs gen1 52%, native 79%)
      // MENAPT gen2 fiscal: still negative but ~50% better than gen1
      // High-skill gen2: closer to native (parents selected for success)
      // ================================================
      const gen2ConvergenceFactor = 0.4; // 40% toward native, 60% retain parent characteristics
      
      const gen2EmploymentRate = blendedEmploymentRate + (0.79 - blendedEmploymentRate) * gen2ConvergenceFactor;
      const gen2SkillPremium = blendedSkillPremium + (1.0 - blendedSkillPremium) * gen2ConvergenceFactor;
      const gen2FiscalNPV = blendedFiscalNPV + (50 - blendedFiscalNPV) * gen2ConvergenceFactor; // 50k = slight positive baseline
      
      // ================================================
      // FISCAL IMPACT - include both generations
      // Gen1: full origin characteristics
      // Gen2: partial convergence (still below native for low-skill origins)
      // ================================================
      const gen1FiscalTotal = (blendedFiscalNPV * 1000 * totalImmigrants) / 1e12;
      const gen2FiscalTotal = (gen2FiscalNPV * 1000 * gen2) / 1e12;
      const totalFiscalNPV = gen1FiscalTotal + gen2FiscalTotal;
      
      // ================================================
      // GDP EFFECT - weighted by generation
      // Gen1: origin employment × skill premium
      // Gen2: partially converged employment × skill premium
      // ================================================
      const nativeBenchmark = 0.79; // Native employment rate (productivity normalized to 1.0)
      
      const gen1PerCapita = blendedEmploymentRate * blendedSkillPremium;
      const gen2PerCapita = gen2EmploymentRate * gen2SkillPremium;
      
      // Weighted average productivity for all immigrants
      const gen1Weight = totalImmigrants / totalPopAdded;
      const gen2Weight = gen2 / totalPopAdded;
      const blendedPerCapita = gen1PerCapita * gen1Weight + gen2PerCapita * gen2Weight;
      
      const gdpPerCapitaRatio = blendedPerCapita / nativeBenchmark;
      
      // ================================================
      // HIGH-LEVEL INTEGRATION PENALTY
      // Above 1.5M/year, integration frictions compound:
      // - Labor market absorption capacity
      // - Housing/infrastructure strain
      // - Social service capacity
      // ================================================
      let integrationPenalty = 1.0;
      if (level > 1500) {
        // 10% productivity penalty per 500k above 1.5M, maxing at 30%
        const excessLevel = (level - 1500) / 500;
        integrationPenalty = Math.max(0.7, 1 - excessLevel * 0.10);
      }
      
      // GDP growth = pop growth × per-capita productivity × integration factor
      const gdpFromPop = popGrowthPct * gdpPerCapitaRatio * integrationPenalty;
      
      // Additional productivity spillovers (innovation, entrepreneurship) for high-skill only
      // Very modest: high-skill immigrants boost TFP ~0.5% per 1% of population
      const spilloverEffect = blendedSkillPremium > 1.05 ? 
        (blendedSkillPremium - 1) * (totalPopAdded / popWithImmigration) * 50 : 0;
      
      const totalGDPEffect = gdpFromPop + spilloverEffect;
      
      return {
        tfrEffect: nationalTFREffect,
        directTFREffect,
        nativeCrowdout,
        housingCrowdout,
        laborCrowdout,
        fiscalNPV: totalFiscalNPV,
        gdpEffect: totalGDPEffect,
        blendedImmigrantTFR: blendedTFR,
        effectiveWeights,
        level,
        lowSkillShare,
        crowdoutMultiplier,
        blendedEmploymentRate,
        blendedSkillPremium,
        gdpPerCapitaRatio,
        integrationPenalty
      };
    }

    function renderSelectionMechanisms() {
      const container = document.getElementById('selection-mechanisms');
      container.innerHTML = '';
      
      selectionMechanisms.forEach(mech => {
        const card = document.createElement('div');
        card.className = `selection-card ${immigrationConfig.selectionMechanism === mech.id ? 'selected' : ''}`;
        card.innerHTML = `
          <div class="selection-card-title">
            <input type="radio" name="selection-mechanism" value="${mech.id}" 
                   ${immigrationConfig.selectionMechanism === mech.id ? 'checked' : ''}>
            ${mech.name}
          </div>
          <div class="selection-card-desc">${mech.desc}</div>
        `;
        
        card.addEventListener('click', () => {
          immigrationConfig.selectionMechanism = mech.id;
          renderSelectionMechanisms();
          renderMechanismControls();
          updateCompositionBar();
          updateImmigrationDisplay();
          updateDisplay();
        });
        
        container.appendChild(card);
      });
    }

    function renderMechanismControls() {
      const container = document.getElementById('mechanism-controls');
      if (!container) return;
      
      const mech = selectionMechanisms.find(m => m.id === immigrationConfig.selectionMechanism);
      if (!mech || !mech.controls) {
        container.innerHTML = '<p style="color: #666; font-style: italic;">No adjustable parameters for this mechanism.</p>';
        return;
      }
      
      const params = immigrationConfig.params[mech.id];
      
      // For current system, show total
      const isCurrent = mech.id === 'current';
      let totalHtml = '';
      if (isCurrent) {
        const total = params.family + params.employment + params.diversity + params.refugee;
        totalHtml = `<div style="text-align: right; font-size: 11px; color: #666; margin-bottom: 8px;">
          Total: <span id="current-total">${total}</span>%
        </div>`;
      }
      
      container.innerHTML = totalHtml + mech.controls.map(ctrl => {
        const value = params[ctrl.id];
        const step = ctrl.step || 1;
        const displayValue = ctrl.format ? ctrl.format(value) : `${value}${ctrl.unit}`;
        
        return `
          <div class="mechanism-control-row">
            <div class="mechanism-control-header">
              <span class="mechanism-control-label">${ctrl.label}</span>
              <span class="mechanism-control-value" id="value-${ctrl.id}">${displayValue}</span>
            </div>
            <input type="range" class="mechanism-control-slider" id="ctrl-${ctrl.id}"
                   min="${ctrl.min}" max="${ctrl.max}" value="${value}" step="${step}">
            <div class="mechanism-control-desc">${ctrl.desc}</div>
          </div>
        `;
      }).join('');
      
      // Add event listeners
      mech.controls.forEach(ctrl => {
        const slider = document.getElementById(`ctrl-${ctrl.id}`);
        const valueEl = document.getElementById(`value-${ctrl.id}`);
        
        slider.addEventListener('input', () => {
          const newValue = ctrl.step === 0.1 ? parseFloat(slider.value) : parseInt(slider.value);
          
          // For current system, maintain 100% total
          if (isCurrent) {
            const shareKeys = ['family', 'employment', 'diversity', 'refugee'];
            const otherKeys = shareKeys.filter(k => k !== ctrl.id);
            const oldOtherTotal = otherKeys.reduce((sum, k) => sum + params[k], 0);
            const targetOtherTotal = 100 - newValue;
            
            if (oldOtherTotal > 0 && targetOtherTotal >= 0) {
              // Scale other sliders proportionally
              const scale = targetOtherTotal / oldOtherTotal;
              otherKeys.forEach(k => {
                const ctrlDef = mech.controls.find(c => c.id === k);
                let newVal = Math.round(params[k] * scale);
                newVal = Math.max(ctrlDef.min, Math.min(ctrlDef.max, newVal));
                params[k] = newVal;
              });
              
              // Adjust for rounding errors
              const actualTotal = newValue + otherKeys.reduce((sum, k) => sum + params[k], 0);
              if (actualTotal !== 100) {
                // Find the largest other slider and adjust it
                const largest = otherKeys.reduce((a, b) => params[a] > params[b] ? a : b);
                params[largest] += (100 - actualTotal);
              }
            }
            
            params[ctrl.id] = newValue;
            
            // Update all slider displays
            mech.controls.forEach(c => {
              const s = document.getElementById(`ctrl-${c.id}`);
              const v = document.getElementById(`value-${c.id}`);
              if (s && v) {
                s.value = params[c.id];
                v.textContent = c.format ? c.format(params[c.id]) : `${params[c.id]}${c.unit}`;
              }
            });
            
            // Update total display
            const totalEl = document.getElementById('current-total');
            if (totalEl) {
              const total = shareKeys.reduce((sum, k) => sum + params[k], 0);
              totalEl.textContent = total;
            }
          } else {
            params[ctrl.id] = newValue;
            valueEl.textContent = ctrl.format ? ctrl.format(newValue) : `${newValue}${ctrl.unit}`;
          }
          
          updateCompositionBar();
          updateImmigrationDisplay();
          updateDisplay();
        });
      });
    }

    function updateCompositionBar() {
      const barContainer = document.getElementById('composition-bar');
      const legendContainer = document.getElementById('composition-legend');
      if (!barContainer) return;
      
      const weights = deriveSourceComposition();
      
      barContainer.innerHTML = Object.entries(weights).map(([id, pct]) => {
        const region = sourceRegions[id];
        if (pct < 2) return ''; // Don't show tiny segments
        return `<div class="composition-segment" style="flex: ${pct}; background: ${region.color};">${Math.round(pct)}%</div>`;
      }).join('');
      
      if (legendContainer) {
        legendContainer.innerHTML = Object.entries(weights).map(([id, pct]) => {
          const region = sourceRegions[id];
          const fiscalStr = region.fiscalNPV >= 0 ? `+$${region.fiscalNPV}k` : `-$${Math.abs(region.fiscalNPV)}k`;
          const empPct = Math.round(region.employmentRate * 100);
          return `
            <div class="composition-legend-item">
              <div class="composition-legend-dot" style="background: ${region.color};"></div>
              <span>${region.name}</span>
              <span class="composition-legend-stats">${Math.round(pct)}% · ${fiscalStr} · ${empPct}% emp</span>
            </div>
          `;
        }).join('');
      }
    }

    function updateImmigrationDisplay() {
      const impacts = calculateImmigrationImpacts();
      
      // Update level display
      const levelDisplay = document.getElementById('immigration-level-display');
      if (levelDisplay) {
        levelDisplay.textContent = `${(immigrationConfig.annualLevel / 1000).toFixed(1)}M`;
      }
      
      // Update impact cards
      const tfrEffectEl = document.getElementById('immigration-tfr-effect');
      const fiscalEffectEl = document.getElementById('immigration-fiscal-effect');
      const gdpEffectEl = document.getElementById('immigration-gdp-effect');
      
      if (tfrEffectEl) {
        const tfrStr = impacts.tfrEffect >= 0 ? `+${impacts.tfrEffect.toFixed(2)}` : impacts.tfrEffect.toFixed(2);
        tfrEffectEl.textContent = tfrStr;
        tfrEffectEl.className = `impact-value ${impacts.tfrEffect >= 0 ? 'positive' : 'negative'}`;
        
        const tfrNoteEl = document.getElementById('immigration-tfr-note');
        if (tfrNoteEl) {
          const directStr = impacts.directTFREffect >= 0 ? `+${impacts.directTFREffect.toFixed(2)}` : impacts.directTFREffect.toFixed(2);
          if (impacts.nativeCrowdout > 0.005) {
            const multiplierNote = impacts.crowdoutMultiplier > 1.2 ? ' (high)' : 
                                   impacts.crowdoutMultiplier < 0.7 ? ' (low)' : '';
            tfrNoteEl.innerHTML = `Direct: ${directStr}, Crowdout: −${impacts.nativeCrowdout.toFixed(2)}${multiplierNote}`;
          } else {
            tfrNoteEl.textContent = `Direct immigrant fertility effect`;
          }
        }
      }
      
      if (fiscalEffectEl) {
        const fiscalStr = impacts.fiscalNPV >= 0 ? `+$${impacts.fiscalNPV.toFixed(1)}T` : `-$${Math.abs(impacts.fiscalNPV).toFixed(1)}T`;
        fiscalEffectEl.textContent = fiscalStr;
        fiscalEffectEl.className = `impact-value ${impacts.fiscalNPV >= 0 ? 'positive' : 'negative'}`;
        
        // Show annual deficit impact (calculated in calculateFiscal)
        const fiscalNoteEl = document.getElementById('immigration-fiscal-note');
        if (fiscalNoteEl) {
          // Get the fiscal calculation which includes immigration effect
          const fiscal = calculateFiscal();
          const annualEffect = fiscal.immigrationEffect || 0;
          
          if (Math.abs(annualEffect) >= 1) {
            // Positive fiscal = reduces deficit, negative = increases deficit
            if (annualEffect > 0) {
              fiscalNoteEl.textContent = `−$${Math.round(annualEffect)}B/yr to deficit`;
            } else {
              fiscalNoteEl.textContent = `+$${Math.abs(Math.round(annualEffect))}B/yr to deficit`;
            }
          } else {
            fiscalNoteEl.textContent = `Lifetime tax − benefits`;
          }
        }
      }
      
      if (gdpEffectEl) {
        // Calculate marginal GDP effect vs baseline (1M/year current system)
        const savedLevel = immigrationConfig.annualLevel;
        const savedMech = immigrationConfig.selectionMechanism;
        const savedCurrentParams = {...immigrationConfig.params.current};
        
        immigrationConfig.annualLevel = 1000;
        immigrationConfig.selectionMechanism = 'current';
        immigrationConfig.params.current = { family: 66, employment: 15, diversity: 5, refugee: 14 };
        const baselineImpacts = calculateImmigrationImpacts();
        
        immigrationConfig.annualLevel = savedLevel;
        immigrationConfig.selectionMechanism = savedMech;
        immigrationConfig.params.current = savedCurrentParams;
        
        const marginalGdpEffect = impacts.gdpEffect - baselineImpacts.gdpEffect;
        
        const gdpStr = marginalGdpEffect >= 0 ? `+${marginalGdpEffect.toFixed(1)}%` : `${marginalGdpEffect.toFixed(1)}%`;
        gdpEffectEl.textContent = gdpStr;
        gdpEffectEl.className = `impact-value ${marginalGdpEffect >= 0 ? 'positive' : 'negative'}`;
        
        // Update GDP note - show integration penalty if active
        const gdpNoteEl = document.getElementById('immigration-gdp-note');
        if (gdpNoteEl) {
          if (impacts.integrationPenalty < 0.99) {
            const penaltyPct = Math.round((1 - impacts.integrationPenalty) * 100);
            gdpNoteEl.textContent = `−${penaltyPct}% integration penalty`;
          } else {
            gdpNoteEl.textContent = `vs 1M/yr current system`;
          }
        }
      }
      
      // Update tab badge
      const countEl = document.getElementById('count-immigration');
      if (countEl) {
        let changes = 0;
        if (immigrationConfig.annualLevel !== 1000) changes++;
        if (immigrationConfig.selectionMechanism !== 'current') changes++;
        countEl.textContent = changes;
      }
    }

    function initImmigration() {
      const levelSlider = document.getElementById('immigration-level-slider');
      if (levelSlider) {
        // Set slider to current value (may have been loaded from state)
        levelSlider.value = immigrationConfig.annualLevel;
        
        levelSlider.addEventListener('input', () => {
          immigrationConfig.annualLevel = parseInt(levelSlider.value);
          updateCompositionBar();
          updateImmigrationDisplay();
          updateDisplay();
        });
      }
      
      renderSelectionMechanisms();
      renderMechanismControls();
      updateCompositionBar();
      updateImmigrationDisplay();
    }

    function initTabs() {
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const tabIndex = btn.dataset.tab;
          document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
          document.getElementById(`panel-${tabIndex}`).classList.add('active');
        });
      });
    }

    function initPenaltyBadges() {
      const backdrop = document.getElementById('methodology-backdrop');
      
      function showMethodology(el) {
        el.classList.add('visible');
        backdrop.classList.add('visible');
        document.body.classList.add('methodology-open');
      }
      
      function hideMethodology(el) {
        el.classList.remove('visible');
        // Check if any methodology is still visible
        const anyVisible = document.querySelectorAll('.penalty-methodology.visible, .gdp-methodology.visible').length > 0;
        if (!anyVisible) {
          backdrop.classList.remove('visible');
          document.body.classList.remove('methodology-open');
        }
      }
      
      function hideAllMethodologies() {
        document.querySelectorAll('.penalty-methodology.visible, .gdp-methodology.visible').forEach(el => {
          el.classList.remove('visible');
        });
        backdrop.classList.remove('visible');
        document.body.classList.remove('methodology-open');
      }
      
      // Inflation badge flip
      const inflationBadge = document.getElementById('penalty-inflation');
      const inflationMethodology = document.getElementById('inflation-methodology');
      const inflationBack = inflationMethodology.querySelector('.penalty-back-button');
      
      inflationBadge.addEventListener('click', (e) => {
        e.stopPropagation();
        showMethodology(inflationMethodology);
      });
      
      inflationBack.addEventListener('click', (e) => {
        e.stopPropagation();
        hideMethodology(inflationMethodology);
      });

      // Growth badge flip
      const growthBadge = document.getElementById('penalty-growth');
      const growthMethodology = document.getElementById('growth-methodology');
      const growthBack = growthMethodology.querySelector('.penalty-back-button');
      
      growthBadge.addEventListener('click', (e) => {
        e.stopPropagation();
        showMethodology(growthMethodology);
      });
      
      growthBack.addEventListener('click', (e) => {
        e.stopPropagation();
        hideMethodology(growthMethodology);
      });

      // GDP projection click
      const gdpValue = document.getElementById('gdp-projection');
      const gdpMethodology = document.getElementById('gdp-methodology');
      const gdpBack = gdpMethodology.querySelector('.gdp-back-button');
      
      gdpValue.addEventListener('click', (e) => {
        e.stopPropagation();
        showMethodology(gdpMethodology);
      });
      
      gdpBack.addEventListener('click', (e) => {
        e.stopPropagation();
        hideMethodology(gdpMethodology);
      });

      // Close methodologies when clicking backdrop
      backdrop.addEventListener('click', () => {
        hideAllMethodologies();
      });
      
      // Also close with Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          hideAllMethodologies();
        }
      });
    }

    function initDeficitModal() {
      window.deficitWarningShown = false;
      window.fiscalCrisisWarningShown = false;
      
      const modal = document.getElementById('deficit-modal');
      const closeBtn = document.getElementById('close-deficit-modal');
      
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('visible');
      });
      
      // Close on overlay click
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('visible');
        }
      });
      
      // Fiscal crisis modal
      const crisisModal = document.getElementById('fiscal-crisis-modal');
      const closeCrisisBtn = document.getElementById('close-fiscal-crisis-modal');
      
      closeCrisisBtn.addEventListener('click', () => {
        crisisModal.classList.remove('visible');
      });
      
      crisisModal.addEventListener('click', (e) => {
        if (e.target === crisisModal) {
          crisisModal.classList.remove('visible');
        }
      });
      
      // GDP crash modal
      const gdpCrashModal = document.getElementById('gdp-crash-modal');
      const closeGdpCrashBtn = document.getElementById('close-gdp-crash-modal');
      
      if (closeGdpCrashBtn) {
        closeGdpCrashBtn.addEventListener('click', () => {
          gdpCrashModal.classList.remove('visible');
        });
        
        gdpCrashModal.addEventListener('click', (e) => {
          if (e.target === gdpCrashModal) {
            gdpCrashModal.classList.remove('visible');
          }
        });
      }
    }

    function getPersonalityType(tfr, fiscal, policies, entitlements, taxes, illiberalPolicies, gdp2075 = 75) {
      const tfrMid = tfr.mid;
      const netFiscal = fiscal.net;
      const policyCount = policies;
      const entitlementCount = entitlements;
      const taxCount = taxes;
      const gdpBaseline = 75; // $75T baseline
      const gdpChange = ((gdp2075 - gdpBaseline) / gdpBaseline) * 100; // % change
      
      // Check which illiberal policies are enabled
      const hardAuthoritarian = illiberalPolicies.filter(p => 
        p.enabled && (p.id === 'abortion-ban' || p.id === 'contraception-ban')
      ).length > 0;
      
      const softAuthoritarian = illiberalPolicies.filter(p => 
        p.enabled && (p.id === 'celibacy-tax' || p.id === 'mandatory-marriage' || p.id === 'divorce-restrictions')
      ).length > 0;
      
      const anyIlliberal = illiberalPolicies.filter(p => p.enabled).length > 0;

      // Personality types based on choices
      if (policyCount === 0 && entitlementCount === 0 && taxCount === 0 && !anyIlliberal) {
        return { icon: '🤷', title: 'The Spectator', desc: 'You\'re still exploring the options. Try enabling some policies!' };
      }
      
      if (hardAuthoritarian) {
        return { icon: '⚔️', title: 'The Authoritarian', desc: 'You believe the ends justify the means. History will judge.' };
      }
      
      if (softAuthoritarian && !hardAuthoritarian) {
        return { icon: '🎭', title: 'The Soft Authoritarian', desc: 'Nudges with teeth. You prefer carrots and sticks over outright bans.' };
      }
      
      // The Unicorn: Replacement fertility + fiscal balance + didn't tank growth
      // Check if achieved via entitlement reform or taxes
      if (tfrMid >= 2.1 && netFiscal <= 0 && gdpChange > -20) {
        if (entitlementCount >= 2 && taxCount >= 2) {
          return { icon: '🏆', title: 'The Coalition Builder', desc: 'Holy grail achieved by making everyone equally unhappy. Seniors AND the rich? Bold.' };
        }
        if (entitlementCount >= 2) {
          return { icon: '🏆', title: 'The Boomer Slayer', desc: 'Holy grail achieved... by raiding the AARP\'s lunch money. They\'ll remember this at the polls.' };
        }
        if (taxCount >= 3) {
          return { icon: '🏆', title: 'The Robin Hood', desc: 'Holy grail achieved by soaking the rich. The 1% sends their regards.' };
        }
        return { icon: '🏆', title: 'The Unicorn', desc: 'Replacement fertility AND fiscal balance AND growth? You found the holy grail.' };
      }
      
      // NEW: The Growth Sacrificer - got replacement + surplus but tanked GDP
      if (tfrMid >= 2.1 && netFiscal <= 0 && gdpChange <= -20) {
        return { icon: '⚖️', title: 'The Growth Sacrificer', desc: 'Replacement fertility and fiscal surplus, but at what cost? GDP takes a hit.' };
      }
      
      if (tfrMid >= 2.1 && netFiscal > 500) {
        return { icon: '💸', title: 'The MMT Maximalist', desc: 'Deficits are just numbers, right? Future generations can sort it out.' };
      }
      
      if (tfrMid >= 2.0 && entitlementCount >= 4) {
        return { icon: '🗡️', title: 'The Intergenerational Warrior', desc: 'You\'re willing to take on the AARP. Respect.' };
      }
      
      if (taxCount >= 4 && entitlementCount === 0) {
        return { icon: '🏛️', title: 'The Tax-and-Spend Liberal', desc: 'Soak the rich to save the future. Classic.' };
      }
      
      if (entitlementCount >= 4 && taxCount === 0) {
        return { icon: '📉', title: 'The Entitlement Reformer', desc: 'You\'re betting seniors will accept less for the next generation.' };
      }
      
      if (tfrMid >= 1.9 && Math.abs(netFiscal) <= 100) {
        return { icon: '🎯', title: 'The Pragmatist', desc: 'Meaningful impact without breaking the bank. Sensible.' };
      }
      
      if (tfrMid < 1.75 && policyCount >= 3) {
        return { icon: '😬', title: 'The Underfunder', desc: 'Good intentions, but you\'re not moving the needle much.' };
      }
      
      if (policyCount === 1 && entitlementCount === 0 && taxCount === 0) {
        return { icon: '🌱', title: 'The Minimalist', desc: 'One small step. Maybe add some funding?' };
      }
      
      if (netFiscal < -200) {
        return { icon: '💰', title: 'The Surplus Builder', desc: 'More offsets than spending? Future generations thank you.' };
      }
      
      return { icon: '🔬', title: 'The Policy Wonk', desc: 'A thoughtful mix of interventions. Keep experimenting!' };
    }

    function calculateFeasibility() {
      // Base score: 60 (moderately feasible by default)
      let score = 60;
      const factors = [];
      
      const fiscal = calculateFiscal();
      const tfr = calculateTFR();
      const enabledPolicies = [...liberalPolicies].filter(p => p.enabled);
      const enabledIlliberal = [...illiberalPolicies].filter(p => p.enabled);
      const enabledEntitlements = entitlementReforms.filter(r => r.enabled);
      const enabledTaxes = taxIncreases.filter(t => t.enabled);
      const immConfig = immigrationConfig;
      
      // 1. FISCAL BALANCE (only unfunded spending is penalized)
      const netDeficit = fiscal.spending - fiscal.offsets;
      if (netDeficit > 200) {
        // Unfunded spending is hard to pass
        const penalty = Math.min(25, Math.floor((netDeficit - 200) / 100) * 8);
        score -= penalty;
        factors.push({ label: 'Unfunded spending', impact: -penalty, class: 'negative' });
      } else if (netDeficit <= 0 && fiscal.spending > 100) {
        // Fully funded large package is politically impressive
        score += 10;
        factors.push({ label: 'Fully funded package', impact: +10, class: 'positive' });
      } else if (fiscal.spending > 0 && fiscal.spending <= 100) {
        score += 5;
        factors.push({ label: 'Modest spending', impact: +5, class: 'positive' });
      }
      
      // 2. ENTITLEMENT CUTS
      // Very politically difficult
      if (enabledEntitlements.length > 0) {
        const penalty = enabledEntitlements.length * 8;
        score -= penalty;
        factors.push({ label: `${enabledEntitlements.length} entitlement cut${enabledEntitlements.length > 1 ? 's' : ''}`, impact: -penalty, class: 'negative' });
      }
      
      // 3. TAX INCREASES - base penalty + specific unpopular taxes
      if (enabledTaxes.length > 0) {
        // Base penalty per tax
        let taxPenalty = enabledTaxes.length * 3;
        
        // Extra penalties for politically unpopular taxes
        const unpopularTaxes = {
          'land-value-tax': { penalty: 20, label: 'Land Value Tax (radical reform)' },
          'vat': { penalty: 12, label: 'New federal VAT' },
          'income-tax-all': { penalty: 10, label: 'Broad income tax hike' },
          'carbon-tax': { penalty: 8, label: 'Carbon tax (energy costs)' },
          'capital-gains': { penalty: 5, label: 'Capital gains reform' },
          'stepped-up-basis': { penalty: 5, label: '"Death tax" expansion' }
        };
        
        enabledTaxes.forEach(tax => {
          if (unpopularTaxes[tax.id]) {
            const extra = unpopularTaxes[tax.id];
            taxPenalty += extra.penalty;
            factors.push({ label: extra.label, impact: -extra.penalty, class: 'negative' });
          }
        });
        
        score -= taxPenalty;
        if (enabledTaxes.length > 0 && !enabledTaxes.some(t => unpopularTaxes[t.id])) {
          factors.push({ label: `${enabledTaxes.length} tax increase${enabledTaxes.length > 1 ? 's' : ''}`, impact: -(enabledTaxes.length * 3), class: 'negative' });
        }
      }
      
      // 5. ILLIBERAL POLICIES
      // These require authoritarianism - automatic F
      let authoritarianLevel = null;
      if (enabledIlliberal.length > 0) {
        // Check for hard vs soft authoritarianism
        // Hard: abortion/contraception bans (bodily autonomy violations)
        // Soft: childlessness taxes, divorce restrictions, etc.
        const hardAuthPolicies = ['abortion-ban', 'contraception-ban'];
        const hasHardAuth = enabledIlliberal.some(p => hardAuthPolicies.includes(p.id));
        
        if (hasHardAuth) {
          authoritarianLevel = 'hard';
          score = 0; // Force F
          factors.unshift({ label: 'Requires hard authoritarianism', impact: -100, class: 'negative' });
        } else {
          authoritarianLevel = 'soft';
          score = Math.min(score, 15); // Cap at F range
          factors.unshift({ label: 'Requires soft authoritarianism', impact: -60, class: 'negative' });
        }
      }
      
      // 6. POPULAR POLICIES (child allowance, paid leave)
      const popularIds = ['child-allowance', 'paid-leave', 'childcare-subsidy'];
      const popularCount = enabledPolicies.filter(p => popularIds.includes(p.id)).length;
      if (popularCount > 0) {
        const bonus = popularCount * 5;
        score += bonus;
        factors.push({ label: `${popularCount} popular polic${popularCount > 1 ? 'ies' : 'y'}`, impact: +bonus, class: 'positive' });
      }
      
      // 7. IMMIGRATION CHANGES
      if (immConfig.selectionMechanism !== 'current') {
        // Changing the system is politically difficult
        if (immConfig.selectionMechanism === 'points') {
          score -= 8;
          factors.push({ label: 'Points system overhaul', impact: -8, class: 'negative' });
        } else if (immConfig.selectionMechanism === 'diversity') {
          score -= 15;
          factors.push({ label: 'Diversity expansion', impact: -15, class: 'negative' });
        } else if (immConfig.selectionMechanism === 'employment') {
          score -= 5;
          factors.push({ label: 'H1B expansion', impact: -5, class: 'negative' });
        }
      }
      
      // Immigration level changes
      if (immConfig.annualLevel > 1500) {
        const penalty = Math.min(15, Math.floor((immConfig.annualLevel - 1500) / 500) * 8);
        score -= penalty;
        factors.push({ label: 'High immigration level', impact: -penalty, class: 'negative' });
      } else if (immConfig.annualLevel < 500) {
        score -= 10;
        factors.push({ label: 'Low immigration level', impact: -10, class: 'negative' });
      }
      
      // 8. BIPARTISAN APPEAL
      // Mix of liberal fertility policies + entitlement reform = bipartisan
      if (enabledPolicies.length > 0 && enabledEntitlements.length > 0) {
        score += 10;
        factors.push({ label: 'Bipartisan mix', impact: +10, class: 'positive' });
      }
      
      // 9. SIMPLICITY BONUS
      // Fewer moving parts = easier to pass
      const totalPolicies = enabledPolicies.length + enabledIlliberal.length + enabledEntitlements.length + enabledTaxes.length;
      if (totalPolicies <= 3 && totalPolicies > 0) {
        score += 8;
        factors.push({ label: 'Simple package', impact: +8, class: 'positive' });
      } else if (totalPolicies > 8) {
        score -= 10;
        factors.push({ label: 'Complex package', impact: -10, class: 'negative' });
      }
      
      // Clamp score
      score = Math.max(0, Math.min(100, score));
      
      // Grade
      let grade, gradeClass, barColor;
      if (score >= 75) {
        grade = 'A'; gradeClass = 'high'; barColor = '#2e7d32';
      } else if (score >= 60) {
        grade = 'B'; gradeClass = 'high'; barColor = '#558b2f';
      } else if (score >= 45) {
        grade = 'C'; gradeClass = 'medium'; barColor = '#f57f17';
      } else if (score >= 30) {
        grade = 'D'; gradeClass = 'low'; barColor = '#e65100';
      } else {
        grade = 'F'; gradeClass = 'very-low'; barColor = '#c62828';
      }
      
      return { score, grade, gradeClass, barColor, factors, authoritarianLevel };
    }

    function initShareModal() {
      const modal = document.getElementById('share-modal');
      const openBtn = document.getElementById('open-share-modal');
      const closeBtn = document.getElementById('close-share-modal');
      const shareX = document.getElementById('share-x');
      const shareCopy = document.getElementById('share-copy');
      const copiedMsg = document.getElementById('share-copied');

      openBtn.addEventListener('click', () => {
        updateShareModal();
        modal.classList.add('visible');
      });

      closeBtn.addEventListener('click', () => {
        modal.classList.remove('visible');
      });

      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('visible');
        }
      });

      // Generate Wordle-style share text
      function generateShareText() {
        const tfr = calculateTFR();
        const fiscal = calculateFiscal();
        const feasibility = calculateFeasibility();
        const entitlementSavings = calculateEntitlementSavings();
        const gdp2075 = calculateGDP2075(tfr.mid, tfr.gdpDrag, entitlementSavings, tfr.spending, tfr.offsets);
        const type = document.getElementById('share-type-title').textContent;
        const icon = document.getElementById('share-type-icon').textContent;
        
        // TFR progress bar (10 blocks, target is 2.1)
        const tfrProgress = Math.min(10, Math.round((tfr.mid / 2.1) * 10));
        const tfrBar = [];
        for (let i = 0; i < 10; i++) {
          if (i < tfrProgress) {
            if (tfr.mid >= 2.1) tfrBar.push('🟩');
            else if (tfr.mid >= 1.8) tfrBar.push('🟨');
            else tfrBar.push('🟥');
          } else {
            tfrBar.push('⬜');
          }
        }
        
        // Fiscal indicator
        const fiscalEmoji = fiscal.net <= 0 ? '💰' : fiscal.net < 200 ? '📊' : '🔥';
        const fiscalText = fiscal.net <= 0 ? `+$${Math.abs(Math.round(fiscal.net))}B` : `-$${Math.round(fiscal.net)}B`;
        
        // Feasibility grade emoji
        const gradeEmoji = { 'A': '🅰️', 'B': '🅱️', 'C': '©️', 'D': '🇩', 'F': '🚫' }[feasibility.grade] || '❓';
        
        // Policy counts
        const policyCount = [...liberalPolicies, ...illiberalPolicies].filter(p => p.enabled).length;
        const entitlementCount = entitlementReforms.filter(r => r.enabled).length;
        const taxCount = taxIncreases.filter(t => t.enabled).length;
        
        // Immigration
        const immLevel = immigrationConfig.annualLevel >= 1000 
          ? `${(immigrationConfig.annualLevel/1000).toFixed(1)}M` 
          : `${immigrationConfig.annualLevel}k`;
        
        // Build the share text
        let text = `🍼 Fertility Policy Simulator\n\n`;
        text += `${icon} ${type}\n\n`;
        text += `📈 TFR: ${tfr.mid.toFixed(2)}\n`;
        text += `${tfrBar.join('')}\n\n`;
        text += `${fiscalEmoji} Fiscal: ${fiscalText}\n`;
        text += `🏛️ Feasibility: ${feasibility.grade}\n`;
        text += `💵 GDP 2075: $${gdp2075.toFixed(0)}T\n\n`;
        
        // Policy summary
        const parts = [];
        if (policyCount > 0) parts.push(`${policyCount} policies`);
        if (taxCount > 0) parts.push(`${taxCount} taxes`);
        if (entitlementCount > 0) parts.push(`${entitlementCount} reforms`);
        parts.push(`${immLevel}/yr immigration`);
        text += `${parts.join(' • ')}\n\n`;
        text += `tfrsim.com`;
        
        return text;
      }
      
      shareX.addEventListener('click', () => {
        const encoded = encodeStateForURL();
        const url = encoded ? `https://tfrsim.com/?s=${encoded}` : 'https://tfrsim.com';
        
        // For Twitter, use a shorter version
        const tfr = calculateTFR();
        const type = document.getElementById('share-type-title').textContent;
        const icon = document.getElementById('share-type-icon').textContent;
        const tfrProgress = Math.min(10, Math.round((tfr.mid / 2.1) * 10));
        const tfrBar = [];
        for (let i = 0; i < 10; i++) {
          if (i < tfrProgress) {
            if (tfr.mid >= 2.1) tfrBar.push('🟩');
            else if (tfr.mid >= 1.8) tfrBar.push('🟨');
            else tfrBar.push('🟥');
          } else {
            tfrBar.push('⬜');
          }
        }
        const twitterText = `🍼 Fertility Policy Simulator\n\n${icon} ${type}\n📈 TFR: ${tfr.mid.toFixed(2)}\n${tfrBar.join('')}\n\nCan you hit 2.1?`;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(url)}`, '_blank');
      });

      shareCopy.addEventListener('click', () => {
        const encoded = encodeStateForURL();
        const shareUrl = encoded ? `https://tfrsim.com/?s=${encoded}` : 'https://tfrsim.com';
        const text = generateShareText() + `\n\n👆 See my full package:\n${shareUrl}`;
        
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(text).then(() => {
            copiedMsg.classList.add('visible');
            setTimeout(() => copiedMsg.classList.remove('visible'), 2000);
          }).catch(() => {
            prompt('Copy this text:', text);
          });
        } else {
          prompt('Copy this text:', text);
        }
      });
    }

    function updateShareModal() {
      const tfr = calculateTFR();
      const fiscal = calculateFiscal();
      const entitlementSavings = calculateEntitlementSavings();
      const gdp2075 = calculateGDP2075(tfr.mid, tfr.gdpDrag, entitlementSavings, tfr.spending, tfr.offsets);

      const enabledPolicies = [...liberalPolicies].filter(p => p.enabled);
      const enabledIlliberal = [...illiberalPolicies].filter(p => p.enabled);
      const enabledEntitlements = entitlementReforms.filter(r => r.enabled);
      const enabledTaxes = taxIncreases.filter(t => t.enabled);

      // Get personality type (now includes GDP check)
      const type = getPersonalityType(
        tfr, fiscal, 
        enabledPolicies.length, 
        enabledEntitlements.length, 
        enabledTaxes.length,
        illiberalPolicies,
        gdp2075
      );

      document.getElementById('share-type-icon').textContent = type.icon;
      document.getElementById('share-type-title').textContent = type.title;
      document.getElementById('share-type-desc').textContent = type.desc;

      // Update results
      document.getElementById('share-tfr').textContent = tfr.mid.toFixed(2);
      document.getElementById('share-tfr').style.color = tfr.mid >= 2.1 ? 'var(--success)' : tfr.mid >= 1.8 ? '#daa520' : 'var(--accent)';
      
      document.getElementById('share-gdp').textContent = `$${gdp2075.toFixed(0)}T`;
      
      const fiscalEl = document.getElementById('share-fiscal');
      if (fiscal.net <= 0) {
        fiscalEl.textContent = `+$${Math.abs(Math.round(fiscal.net))}B surplus`;
        fiscalEl.style.color = 'var(--success)';
      } else {
        fiscalEl.textContent = `−$${Math.round(fiscal.net)}B deficit`;
        fiscalEl.style.color = 'var(--accent)';
      }

      // Build policy list
      const listEl = document.getElementById('share-policies-list');
      const allEnabled = [
        ...enabledPolicies.map(p => ({ name: p.name, type: 'fertility' })),
        ...enabledIlliberal.map(p => ({ name: p.name, type: 'illiberal' })),
        ...enabledEntitlements.map(r => ({ name: r.name, type: 'entitlement' })),
        ...enabledTaxes.map(t => ({ name: t.name, type: 'tax' }))
      ];

      if (allEnabled.length === 0) {
        listEl.innerHTML = '<em>No policies selected</em>';
      } else {
        listEl.innerHTML = allEnabled.map(p => 
          `<span class="share-policy-item ${p.type}">${p.name}</span>`
        ).join('');
      }
      
      // Always show immigration settings
      const mechNames = { 
        current: 'Current System', 
        points: 'Points-Based', 
        employment: 'Employment-Based', 
        family: 'Family-Focused', 
        diversity: 'Diversity Lottery' 
      };
      const levelChange = immigrationConfig.annualLevel - 1000;
      const levelDesc = levelChange === 0 ? '1M/yr' : 
                        levelChange > 0 ? `${(immigrationConfig.annualLevel/1000).toFixed(1)}M/yr (+${levelChange}k)` :
                        `${(immigrationConfig.annualLevel/1000).toFixed(1)}M/yr (${levelChange}k)`;
      const immDesc = `Immigration: ${levelDesc}, ${mechNames[immigrationConfig.selectionMechanism]}`;
      listEl.innerHTML += `<span class="share-policy-item immigration">${immDesc}</span>`;
      
      // Calculate and display feasibility
      const feasibility = calculateFeasibility();
      
      const scoreEl = document.getElementById('feasibility-score');
      scoreEl.textContent = feasibility.grade;
      scoreEl.className = `feasibility-score ${feasibility.gradeClass}`;
      
      const barEl = document.getElementById('feasibility-bar');
      barEl.style.width = `${feasibility.score}%`;
      barEl.style.background = feasibility.barColor;
      
      const factorsEl = document.getElementById('feasibility-factors');
      if (feasibility.factors.length === 0) {
        factorsEl.innerHTML = '<div class="feasibility-factor"><span>No policies selected</span><span class="feasibility-factor-impact neutral">—</span></div>';
      } else {
        // Show top 4 factors
        factorsEl.innerHTML = feasibility.factors.slice(0, 4).map(f => `
          <div class="feasibility-factor">
            <span>${f.label}</span>
            <span class="feasibility-factor-impact ${f.class}">${f.impact > 0 ? '+' : ''}${f.impact}</span>
          </div>
        `).join('');
      }
    }

    function initSplash() {
      const splash = document.getElementById('splash-overlay');
      const startBtn = document.getElementById('splash-start-btn');
      
      // Check if user has seen splash before (this session)
      if (sessionStorage.getItem('splashSeen')) {
        splash.classList.add('hidden');
        return;
      }
      
      startBtn.addEventListener('click', () => {
        splash.classList.add('hidden');
        sessionStorage.setItem('splashSeen', 'true');
      });
      
      // Also allow pressing Enter or Space to start
      document.addEventListener('keydown', (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !splash.classList.contains('hidden')) {
          e.preventDefault();
          splash.classList.add('hidden');
          sessionStorage.setItem('splashSeen', 'true');
        }
      });
    }

    // === STATE PERSISTENCE ===
    const STORAGE_KEY = 'tfrsim_state_v1';
    
    // Ultra-compact state encoding using bitmasks and base36
    // Format: p{bitmask}.{idx:int,...}i{bitmask}e{idx.thr,...}t{idx.thr,...}m{lvl}.{mech}
    function encodeStateForURL() {
      try {
        let code = '';
        
        // Liberal policies: bitmask for enabled + separate intensity overrides
        let lpBits = 0;
        const intensities = [];
        liberalPolicies.forEach((p, idx) => {
          if (p.enabled) {
            lpBits |= (1 << idx);
            if (p.intensity !== 1) {
              intensities.push(`${idx.toString(36)}${Math.round(p.intensity * 10).toString(36)}`);
            }
          }
        });
        if (lpBits > 0) {
          code += 'p' + lpBits.toString(36);
          if (intensities.length) code += '.' + intensities.join('');
        }
        
        // Illiberal policies: simple bitmask
        let ipBits = 0;
        illiberalPolicies.forEach((p, idx) => {
          if (p.enabled) ipBits |= (1 << idx);
        });
        if (ipBits > 0) code += 'i' + ipBits.toString(36);
        
        // Entitlements: idx.threshold pairs (threshold in base36)
        const er = entitlementReforms
          .map((r, idx) => r.enabled ? idx.toString(36) + r.threshold.toString(36) : null)
          .filter(Boolean);
        if (er.length) code += 'e' + er.join('.');
        
        // Taxes: idx.threshold pairs
        const tx = taxIncreases
          .map((t, idx) => t.enabled ? idx.toString(36) + t.threshold.toString(36) : null)
          .filter(Boolean);
        if (tx.length) code += 't' + tx.join('.');
        
        // Immigration: level (in hundreds, base36) + mechanism
        if (immigrationConfig.annualLevel !== 1000 || immigrationConfig.selectionMechanism !== 'current') {
          const mechMap = { current: 0, points: 1, employment: 2, family: 3, diversity: 4 };
          const lvlCode = Math.round(immigrationConfig.annualLevel / 100).toString(36);
          code += 'm' + lvlCode + mechMap[immigrationConfig.selectionMechanism];
        }
        
        return code || '0'; // '0' = default state
      } catch (e) {
        console.warn('Failed to encode state:', e);
        return null;
      }
    }
    
    // Decode ultra-compact state
    function decodeStateFromURL(encoded) {
      try {
        // Handle old formats for backwards compatibility
        if (encoded.includes('=') || encoded.startsWith('ey')) {
          return decodeOldFormat(encoded);
        }
        
        if (encoded === '0') return null; // Default state
        
        const state = { lp: [], ip: [], er: [], tx: [], im: { l: 1000, m: 'current' } };
        const mechMap = ['current', 'points', 'employment', 'family', 'diversity'];
        
        // Parse each section
        let pos = 0;
        while (pos < encoded.length) {
          const type = encoded[pos];
          pos++;
          
          if (type === 'p') {
            // Liberal policies bitmask + optional intensities
            let end = pos;
            while (end < encoded.length && /[0-9a-z]/.test(encoded[end]) && encoded[end] !== '.') end++;
            const bits = parseInt(encoded.substring(pos, end), 36);
            pos = end;
            
            // Check for intensity overrides
            const intensityMap = {};
            if (encoded[pos] === '.') {
              pos++;
              // Parse intensity pairs (single char idx + single char intensity)
              while (pos < encoded.length && /[0-9a-z]/.test(encoded[pos]) && !'ieptm'.includes(encoded[pos])) {
                const idx = parseInt(encoded[pos], 36);
                const int = parseInt(encoded[pos + 1], 36) / 10;
                intensityMap[idx] = int;
                pos += 2;
              }
            }
            
            liberalPolicies.forEach((p, idx) => {
              if (bits & (1 << idx)) {
                state.lp.push({ i: p.id, n: intensityMap[idx] || 1 });
              }
            });
          } else if (type === 'i') {
            // Illiberal bitmask
            let end = pos;
            while (end < encoded.length && /[0-9a-z]/.test(encoded[end])) end++;
            const bits = parseInt(encoded.substring(pos, end), 36);
            pos = end;
            
            illiberalPolicies.forEach((p, idx) => {
              if (bits & (1 << idx)) state.ip.push(p.id);
            });
          } else if (type === 'e') {
            // Entitlements: parse until next section
            let end = pos;
            while (end < encoded.length && !'ieptm'.includes(encoded[end])) end++;
            const parts = encoded.substring(pos, end).split('.');
            pos = end;
            
            parts.forEach(part => {
              if (part.length >= 2) {
                const idx = parseInt(part[0], 36);
                const thr = parseInt(part.substring(1), 36);
                if (entitlementReforms[idx]) {
                  state.er.push({ i: entitlementReforms[idx].id, t: thr });
                }
              }
            });
          } else if (type === 't') {
            // Taxes: parse until next section
            let end = pos;
            while (end < encoded.length && !'ieptm'.includes(encoded[end])) end++;
            const parts = encoded.substring(pos, end).split('.');
            pos = end;
            
            parts.forEach(part => {
              if (part.length >= 2) {
                const idx = parseInt(part[0], 36);
                const thr = parseInt(part.substring(1), 36);
                if (taxIncreases[idx]) {
                  state.tx.push({ i: taxIncreases[idx].id, t: thr });
                }
              }
            });
          } else if (type === 'm') {
            // Immigration: level (base36, in hundreds) + mechanism digit
            let end = pos;
            while (end < encoded.length && /[0-9a-z]/.test(encoded[end])) end++;
            const mStr = encoded.substring(pos, end);
            pos = end;
            
            const mech = parseInt(mStr[mStr.length - 1]);
            const lvl = parseInt(mStr.substring(0, mStr.length - 1), 36) * 100;
            state.im = { l: lvl, m: mechMap[mech] || 'current' };
          } else {
            pos++; // Skip unknown
          }
        }
        
        return state;
      } catch (e) {
        console.warn('Failed to decode state:', e);
        return null;
      }
    }
    
    // Backwards compatibility for old URL formats
    function decodeOldFormat(encoded) {
      try {
        if (encoded.includes('=')) {
          // Medium format: p=0,3|t=7:100
          const state = { lp: [], ip: [], er: [], tx: [], im: { l: 1000, m: 'current' } };
          const mechMap = ['current', 'points', 'employment', 'family', 'diversity'];
          
          encoded.split('|').forEach(part => {
            const [key, val] = part.split('=');
            if (!val) return;
            
            if (key === 'p') {
              state.lp = val.split(',').map(v => {
                const [idx, int] = v.split(':');
                return { i: liberalPolicies[parseInt(idx)]?.id, n: int ? parseInt(int) / 100 : 1 };
              }).filter(x => x.i);
            } else if (key === 'i') {
              state.ip = val.split(',').map(idx => illiberalPolicies[parseInt(idx)]?.id).filter(Boolean);
            } else if (key === 'e') {
              state.er = val.split(',').map(v => {
                const [idx, thr] = v.split(':');
                return { i: entitlementReforms[parseInt(idx)]?.id, t: parseInt(thr) };
              }).filter(x => x.i);
            } else if (key === 't') {
              state.tx = val.split(',').map(v => {
                const [idx, thr] = v.split(':');
                return { i: taxIncreases[parseInt(idx)]?.id, t: parseInt(thr) };
              }).filter(x => x.i);
            } else if (key === 'm') {
              const [lvl, mech] = val.split(',');
              state.im = { l: parseInt(lvl), m: mechMap[parseInt(mech)] || 'current' };
            }
          });
          return state;
        } else {
          // Old base64 JSON format
          const json = decodeURIComponent(atob(encoded));
          return JSON.parse(json);
        }
      } catch (e) {
        return null;
      }
    }
    
    // Apply decoded state to the app
    function applySharedState(state) {
      // Reset all policies first
      liberalPolicies.forEach(p => { p.enabled = false; p.intensity = 1; });
      illiberalPolicies.forEach(p => { p.enabled = false; });
      entitlementReforms.forEach(r => { r.enabled = false; });
      taxIncreases.forEach(t => { t.enabled = false; });
      
      // Apply liberal policies
      if (state.lp) {
        state.lp.forEach(saved => {
          const policy = liberalPolicies.find(p => p.id === saved.i);
          if (policy) {
            policy.enabled = true;
            policy.intensity = saved.n || 1;
          }
        });
      }
      
      // Apply illiberal policies
      if (state.ip) {
        state.ip.forEach(id => {
          const policy = illiberalPolicies.find(p => p.id === id);
          if (policy) policy.enabled = true;
        });
      }
      
      // Apply entitlement reforms
      if (state.er) {
        state.er.forEach(saved => {
          const reform = entitlementReforms.find(r => r.id === saved.i);
          if (reform) {
            reform.enabled = true;
            if (saved.t !== undefined) reform.threshold = saved.t;
          }
        });
      }
      
      // Apply taxes
      if (state.tx) {
        state.tx.forEach(saved => {
          const tax = taxIncreases.find(t => t.id === saved.i);
          if (tax) {
            tax.enabled = true;
            if (saved.t !== undefined) tax.threshold = saved.t;
          }
        });
      }
      
      // Apply immigration
      if (state.im) {
        immigrationConfig.annualLevel = state.im.l || 1000;
        immigrationConfig.selectionMechanism = state.im.m || 'current';
      }
    }
    
    // Show shared preview modal
    function showSharedPreview(state) {
      // Temporarily apply state to calculate results
      const originalState = {
        lp: liberalPolicies.map(p => ({ id: p.id, enabled: p.enabled, intensity: p.intensity })),
        ip: illiberalPolicies.map(p => ({ id: p.id, enabled: p.enabled })),
        er: entitlementReforms.map(r => ({ id: r.id, enabled: r.enabled, threshold: r.threshold })),
        tx: taxIncreases.map(t => ({ id: t.id, enabled: t.enabled, threshold: t.threshold })),
        im: { ...immigrationConfig }
      };
      
      applySharedState(state);
      
      // Calculate results
      const tfr = calculateTFR();
      const fiscal = calculateFiscal();
      const feasibility = calculateFeasibility();
      const entitlementSavings = calculateEntitlementSavings();
      const gdp2075 = calculateGDP2075(tfr.mid, tfr.gdpDrag, entitlementSavings, tfr.spending, tfr.offsets);
      
      const enabledPolicies = [...liberalPolicies, ...illiberalPolicies].filter(p => p.enabled);
      const enabledEntitlements = entitlementReforms.filter(r => r.enabled);
      const enabledTaxes = taxIncreases.filter(t => t.enabled);
      
      // Get personality type
      const type = getPersonalityType(tfr, fiscal, enabledPolicies.length, enabledEntitlements.length, enabledTaxes.length, illiberalPolicies, gdp2075);
      
      // Populate modal
      document.getElementById('preview-type-icon').textContent = type.icon;
      document.getElementById('preview-type-title').textContent = type.title;
      document.getElementById('preview-type-desc').textContent = type.desc;
      
      document.getElementById('preview-tfr').textContent = tfr.mid.toFixed(2);
      document.getElementById('preview-tfr').style.color = tfr.mid >= 2.1 ? 'var(--success)' : tfr.mid >= 1.8 ? '#daa520' : 'var(--accent)';
      
      document.getElementById('preview-gdp').textContent = `$${gdp2075.toFixed(0)}T`;
      
      const fiscalEl = document.getElementById('preview-fiscal');
      if (fiscal.net <= 0) {
        fiscalEl.textContent = `+$${Math.abs(Math.round(fiscal.net))}B`;
        fiscalEl.style.color = 'var(--success)';
      } else {
        fiscalEl.textContent = `-$${Math.round(fiscal.net)}B`;
        fiscalEl.style.color = 'var(--accent)';
      }
      
      document.getElementById('preview-feasibility').textContent = feasibility.grade;
      
      // Populate policy lists
      const policiesEl = document.getElementById('preview-policies');
      const policiesSection = document.getElementById('preview-policies-section');
      const enabledLiberal = liberalPolicies.filter(p => p.enabled);
      const enabledIlliberal = illiberalPolicies.filter(p => p.enabled);
      
      if (enabledLiberal.length + enabledIlliberal.length > 0) {
        policiesSection.classList.remove('hidden');
        policiesEl.innerHTML = [...enabledLiberal, ...enabledIlliberal].map(p => 
          `<span class="preview-item policy">${p.name}</span>`
        ).join('');
      } else {
        policiesSection.classList.add('hidden');
      }
      
      const taxesEl = document.getElementById('preview-taxes');
      const taxesSection = document.getElementById('preview-taxes-section');
      if (enabledTaxes.length > 0) {
        taxesSection.classList.remove('hidden');
        taxesEl.innerHTML = enabledTaxes.map(t => 
          `<span class="preview-item tax">${t.name}</span>`
        ).join('');
      } else {
        taxesSection.classList.add('hidden');
      }
      
      const entitlementsEl = document.getElementById('preview-entitlements');
      const entitlementsSection = document.getElementById('preview-entitlements-section');
      if (enabledEntitlements.length > 0) {
        entitlementsSection.classList.remove('hidden');
        entitlementsEl.innerHTML = enabledEntitlements.map(r => 
          `<span class="preview-item entitlement">${r.name}</span>`
        ).join('');
      } else {
        entitlementsSection.classList.add('hidden');
      }
      
      const immigrationEl = document.getElementById('preview-immigration');
      const immigrationSection = document.getElementById('preview-immigration-section');
      const mechNames = { current: 'Current System', points: 'Points-Based', employment: 'Employment-Based', family: 'Family-Focused', diversity: 'Diversity Lottery' };
      const immLevel = immigrationConfig.annualLevel >= 1000 ? `${(immigrationConfig.annualLevel/1000).toFixed(1)}M` : `${immigrationConfig.annualLevel}k`;
      immigrationSection.classList.remove('hidden');
      immigrationEl.innerHTML = `<span class="preview-item immigration">${immLevel}/yr • ${mechNames[immigrationConfig.selectionMechanism]}</span>`;
      
      // Restore original state
      originalState.lp.forEach(saved => {
        const p = liberalPolicies.find(x => x.id === saved.id);
        if (p) { p.enabled = saved.enabled; p.intensity = saved.intensity; }
      });
      originalState.ip.forEach(saved => {
        const p = illiberalPolicies.find(x => x.id === saved.id);
        if (p) p.enabled = saved.enabled;
      });
      originalState.er.forEach(saved => {
        const r = entitlementReforms.find(x => x.id === saved.id);
        if (r) { r.enabled = saved.enabled; r.threshold = saved.threshold; }
      });
      originalState.tx.forEach(saved => {
        const t = taxIncreases.find(x => x.id === saved.id);
        if (t) { t.enabled = saved.enabled; t.threshold = saved.threshold; }
      });
      immigrationConfig.annualLevel = originalState.im.annualLevel;
      immigrationConfig.selectionMechanism = originalState.im.selectionMechanism;
      
      // Show modal
      document.getElementById('shared-preview-modal').classList.add('visible');
      
      // Store the shared state for later
      window.pendingSharedState = state;
    }
    
    // Initialize shared preview modal handlers
    function initSharedPreviewModal() {
      const modal = document.getElementById('shared-preview-modal');
      const tryBtn = document.getElementById('preview-try-btn');
      const freshBtn = document.getElementById('preview-fresh-btn');
      
      tryBtn.addEventListener('click', () => {
        if (window.pendingSharedState) {
          applySharedState(window.pendingSharedState);
          window.pendingSharedState = null;
          
          // Re-render everything
          document.getElementById('liberal-policies').innerHTML = '';
          document.getElementById('illiberal-policies').innerHTML = '';
          document.getElementById('entitlement-reforms').innerHTML = '';
          document.getElementById('tax-increases').innerHTML = '';
          
          liberalPolicies.forEach(p => renderPolicyCard(p, document.getElementById('liberal-policies')));
          illiberalPolicies.forEach(p => renderPolicyCard(p, document.getElementById('illiberal-policies'), true));
          entitlementReforms.forEach(r => renderReformCard(r, document.getElementById('entitlement-reforms'), false));
          taxIncreases.forEach(t => renderReformCard(t, document.getElementById('tax-increases'), true));
          
          // Update immigration UI
          const levelSlider = document.getElementById('immigration-level-slider');
          if (levelSlider) levelSlider.value = immigrationConfig.annualLevel;
          renderSelectionMechanisms();
          renderMechanismControls();
          updateCompositionBar();
          updateImmigrationDisplay();
          
          updateDisplay();
        }
        modal.classList.remove('visible');
        
        // Clear URL parameter
        const url = new URL(window.location);
        url.searchParams.delete('s');
        window.history.replaceState({}, '', url);
      });
      
      freshBtn.addEventListener('click', () => {
        window.pendingSharedState = null;
        modal.classList.remove('visible');
        
        // Clear URL parameter
        const url = new URL(window.location);
        url.searchParams.delete('s');
        window.history.replaceState({}, '', url);
      });
      
      // Click outside to dismiss
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          window.pendingSharedState = null;
          modal.classList.remove('visible');
          
          const url = new URL(window.location);
          url.searchParams.delete('s');
          window.history.replaceState({}, '', url);
        }
      });
    }
    
    // Check for shared state in URL on load
    function checkForSharedState() {
      const params = new URLSearchParams(window.location.search);
      const encoded = params.get('s');
      
      if (encoded) {
        const state = decodeStateFromURL(encoded);
        if (state) {
          // Delay to let the page render first
          setTimeout(() => showSharedPreview(state), 500);
          return true;
        }
      }
      return false;
    }
    
    function saveState() {
      const state = {
        liberalPolicies: liberalPolicies.map(p => ({ id: p.id, enabled: p.enabled, intensity: p.intensity })),
        illiberalPolicies: illiberalPolicies.map(p => ({ id: p.id, enabled: p.enabled })),
        entitlementReforms: entitlementReforms.map(r => ({ id: r.id, enabled: r.enabled, threshold: r.threshold })),
        taxIncreases: taxIncreases.map(t => ({ id: t.id, enabled: t.enabled, threshold: t.threshold })),
        immigrationConfig: {
          annualLevel: immigrationConfig.annualLevel,
          selectionMechanism: immigrationConfig.selectionMechanism,
          params: immigrationConfig.params
        },
        modelParams: { ...modelParams }
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        console.warn('Failed to save state:', e);
      }
    }
    
    function loadState() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return false;
        
        const state = JSON.parse(saved);
        
        // Restore liberal policies
        if (state.liberalPolicies) {
          state.liberalPolicies.forEach(saved => {
            const policy = liberalPolicies.find(p => p.id === saved.id);
            if (policy) {
              policy.enabled = saved.enabled;
              if (saved.intensity !== undefined) policy.intensity = saved.intensity;
            }
          });
        }
        
        // Restore illiberal policies
        if (state.illiberalPolicies) {
          state.illiberalPolicies.forEach(saved => {
            const policy = illiberalPolicies.find(p => p.id === saved.id);
            if (policy) policy.enabled = saved.enabled;
          });
        }
        
        // Restore entitlement reforms
        if (state.entitlementReforms) {
          state.entitlementReforms.forEach(saved => {
            const reform = entitlementReforms.find(r => r.id === saved.id);
            if (reform) {
              reform.enabled = saved.enabled;
              if (saved.threshold !== undefined) reform.threshold = saved.threshold;
            }
          });
        }
        
        // Restore tax increases
        if (state.taxIncreases) {
          state.taxIncreases.forEach(saved => {
            const tax = taxIncreases.find(t => t.id === saved.id);
            if (tax) {
              tax.enabled = saved.enabled;
              if (saved.threshold !== undefined) tax.threshold = saved.threshold;
            }
          });
        }
        
        // Restore immigration config
        if (state.immigrationConfig) {
          immigrationConfig.annualLevel = state.immigrationConfig.annualLevel ?? 1000;
          immigrationConfig.selectionMechanism = state.immigrationConfig.selectionMechanism ?? 'current';
          if (state.immigrationConfig.params) {
            Object.assign(immigrationConfig.params, state.immigrationConfig.params);
          }
        }
        
        // Restore model params
        if (state.modelParams) {
          Object.assign(modelParams, state.modelParams);
        }
        
        return true;
      } catch (e) {
        console.warn('Failed to load state:', e);
        return false;
      }
    }
    
    function clearState() {
      localStorage.removeItem(STORAGE_KEY);
    }

    function init() {
      // Check for shared state in URL first (before loading saved state)
      const hasSharedState = checkForSharedState();
      
      // Load saved state before rendering (unless we have a shared state URL)
      const hasState = !hasSharedState && loadState();
      
      initSplash();
      liberalPolicies.forEach(p => renderPolicyCard(p, document.getElementById('liberal-policies')));
      illiberalPolicies.forEach(p => renderPolicyCard(p, document.getElementById('illiberal-policies'), true));
      entitlementReforms.forEach(r => renderReformCard(r, document.getElementById('entitlement-reforms'), false));
      taxIncreases.forEach(t => renderReformCard(t, document.getElementById('tax-increases'), true));
      renderModelParams(document.getElementById('model-params'));
      initTabs();
      initImmigration();
      initPenaltyBadges();
      initDeficitModal();
      initShareModal();
      initSharedPreviewModal();
      updateDisplay();
      
      // If we loaded state, save again to ensure consistency
      if (hasState) saveState();
    }

    init();
  
