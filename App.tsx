import React, { useState, useEffect, useMemo } from 'react';
import { PAY_LEVELS, generatePayStages, DEFAULT_DA_PERCENT, HIGHER_TPTA_CITIES_DESC } from './constants';
import { CityType } from './types';
import { InputGroup } from './components/InputGroup';
import { SelectGroup } from './components/SelectGroup';
import { Calculator, IndianRupee, Info } from 'lucide-react';

const App: React.FC = () => {
  // --- State ---
  const [levelIndex, setLevelIndex] = useState<number>(0); // Index in PAY_LEVELS array
  const [basicPay, setBasicPay] = useState<number>(PAY_LEVELS[0].entryPay);
  const [daPercent, setDaPercent] = useState<number>(DEFAULT_DA_PERCENT);
  const [cityType, setCityType] = useState<CityType>(CityType.X);
  const [isTptaCity, setIsTptaCity] = useState<boolean>(false);
  
  // Custom user inputs for earnings
  const [otherAllowances, setOtherAllowances] = useState<number>(0);

  // Deductions inputs
  const [npsEnabled, setNpsEnabled] = useState<boolean>(true);
  const [professionalTax, setProfessionalTax] = useState<number>(200); // Common default
  const [incomeTax, setIncomeTax] = useState<number>(0);
  const [cgegis, setCgegis] = useState<number>(30);
  const [otherDeductions, setOtherDeductions] = useState<number>(0);

  // --- Derived Values & Calculations ---

  // 1. Pay Level Object
  const currentLevel = PAY_LEVELS[levelIndex];

  // 2. Generate Stages for current level
  const stages = useMemo(() => {
    return generatePayStages(currentLevel.entryPay, currentLevel.maxStages);
  }, [currentLevel]);

  // Reset basic pay if it's not in the new level's range (approx check)
  useEffect(() => {
    const isBasicInStages = stages.includes(basicPay);
    if (!isBasicInStages) {
      setBasicPay(stages[0]);
    }
  }, [levelIndex, stages, basicPay]);

  // 3. DA Calculation
  // DA is calculated on Basic Pay and rounded to nearest Rupee
  const daAmount = Math.round(basicPay * (daPercent / 100));

  // 4. HRA Calculation
  // 7th CPC: X=24%, Y=16%, Z=8%. 
  // If DA > 25%: X=27%, Y=18%, Z=9%.
  // If DA > 50%: X=30%, Y=20%, Z=10%.
  // Minimum Floor: X=5400, Y=3600, Z=1800
  const { hraPercent, minHra } = useMemo(() => {
    let percent = 0;
    let min = 0;

    // Determine Percentage
    if (daPercent >= 50) {
      if (cityType === CityType.X) percent = 30;
      else if (cityType === CityType.Y) percent = 20;
      else percent = 10;
    } else if (daPercent > 25) {
      if (cityType === CityType.X) percent = 27;
      else if (cityType === CityType.Y) percent = 18;
      else percent = 9;
    } else {
      if (cityType === CityType.X) percent = 24;
      else if (cityType === CityType.Y) percent = 16;
      else percent = 8;
    }

    // Determine Minimum Floor
    if (cityType === CityType.X) min = 5400;
    else if (cityType === CityType.Y) min = 3600;
    else min = 1800;

    return { hraPercent: percent, minHra: min };
  }, [daPercent, cityType]);

  const calculatedHra = Math.round(basicPay * (hraPercent / 100));
  const hraAmount = Math.max(calculatedHra, minHra);

  // 5. TA Calculation (Transport Allowance)
  const taBase = useMemo(() => {
    const lvl = currentLevel.level;
    
    // Level 14 and above: Fixed Rs. 15750 + DA (unless using official car)
    if (lvl >= 14) {
      return 15750;
    }

    // Level 9 and above: 7200 (TPTA) / 3600 (Other)
    if (lvl >= 9) {
      return isTptaCity ? 7200 : 3600;
    } 
    // Level 3 to 8: 3600 (TPTA) / 1800 (Other)
    else if (lvl >= 3) {
      return isTptaCity ? 3600 : 1800;
    } 
    // Level 1 and 2: 1350 (TPTA) / 900 (Other)
    else {
      return isTptaCity ? 1350 : 900;
    }
  }, [currentLevel.level, isTptaCity]);

  const taAmount = Math.round(taBase * (1 + daPercent / 100));

  // 6. NPS Calculation (10% of Basic + DA)
  const npsAmount = npsEnabled ? Math.round((basicPay + daAmount) * 0.10) : 0;

  // 7. CGEGIS Suggestion
  useEffect(() => {
    let suggested = 30;
    if (currentLevel.level >= 10) suggested = 120;
    else if (currentLevel.level >= 6) suggested = 60;
    setCgegis(suggested);
  }, [currentLevel.level]);

  // --- Totals ---
  const totalEarnings = basicPay + daAmount + hraAmount + taAmount + otherAllowances;
  const totalDeductions = npsAmount + professionalTax + incomeTax + cgegis + otherDeductions;
  const netSalary = totalEarnings - totalDeductions;

  // --- Handlers ---
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 relative selection:bg-orange-100 selection:text-orange-900">
      {/* Background Indian Flag - Fixed & Cover for full screen wash */}
      <div 
        className="fixed inset-0 z-0 opacity-[0.08] pointer-events-none bg-center bg-cover bg-no-repeat mix-blend-multiply"
        style={{ backgroundImage: "url('https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg')" }}
      ></div>

      {/* Content Wrapper */}
      <div className="relative z-10 p-4 md:p-8">
        
        {/* Work is Worship - Top Left (Moved from Right, Opacity 30% for 70% transparency) */}
        <div className="absolute top-2 left-2 md:top-6 md:left-8 z-20 opacity-30">
             <div className="text-sm md:text-lg font-serif font-bold text-orange-600 italic tracking-wide drop-shadow-sm border-b-2 border-orange-200 pb-1">
            Work is Worship
          </div>
        </div>

        {/* No Ads Banner */}
        <div className="fixed top-14 -right-8 bg-green-600 text-white text-xs font-bold px-10 py-1 rotate-45 shadow-md z-50 pointer-events-none hidden md:block">
          No Ads
        </div>
        <div className="fixed top-16 right-4 bg-green-100 text-green-800 border border-green-200 text-xs font-bold px-3 py-1 rounded-full shadow-sm z-50 md:hidden">
          No Ads
        </div>

        <div className="max-w-6xl mx-auto space-y-8 mt-8">
          {/* Header */}
          <header className="text-center space-y-3 pt-4">
            <div className="flex items-center justify-center gap-3 text-indigo-700">
              <div className="p-3 bg-white rounded-xl shadow-sm border border-indigo-50">
                <Calculator className="w-8 h-8" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
                Salary Calculator <span className="text-indigo-600 block md:inline">Central Govt Employees</span>
              </h1>
            </div>
            <p className="text-slate-500 font-medium bg-white/50 inline-block px-4 py-1 rounded-full backdrop-blur-sm border border-white/60">
              Based on 7th Pay Commission Matrix
            </p>
          </header>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            
            {/* Earnings Column */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-gradient-to-r from-emerald-50/90 to-emerald-100/50 border-b border-emerald-100 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-emerald-800 flex items-center gap-2">
                  <span className="w-2 h-6 bg-emerald-500 rounded-full shadow-sm"></span>
                  Earnings
                </h2>
                <span className="text-emerald-700 font-bold bg-white/80 px-3 py-1 rounded-full text-sm shadow-sm border border-emerald-100">
                  + {formatCurrency(totalEarnings)}
                </span>
              </div>
              
              <div className="p-6 space-y-5">
                {/* Pay Level Selection */}
                <SelectGroup
                  label="Pay Level (7th CPC Matrix)"
                  value={levelIndex}
                  onChange={(val) => setLevelIndex(Number(val))}
                  options={PAY_LEVELS.map((p, idx) => ({
                    label: `Level ${p.level} (Grade Pay ${p.gradePay})`,
                    value: idx
                  }))}
                />

                {/* Basic Pay Selection */}
                <SelectGroup
                  label="Basic Pay (Current Stage)"
                  value={basicPay}
                  onChange={(val) => setBasicPay(Number(val))}
                  options={stages.map((stage) => ({
                    label: `₹ ${stage.toLocaleString('en-IN')}`, 
                    value: stage
                  }))}
                  helperText={`Pay Matrix Level ${currentLevel.level}`}
                />

                {/* DA Section */}
                <div className="grid grid-cols-2 gap-4">
                  <InputGroup 
                    label="DA Rate (%)" 
                    value={daPercent} 
                    onChange={(v) => setDaPercent(Number(v) || 0)} 
                    type="number"
                    suffix="%"
                  />
                  <InputGroup 
                    label="DA Amount" 
                    value={daAmount} 
                    onChange={() => {}} 
                    readOnly 
                    prefix="₹"
                  />
                </div>

                {/* HRA Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SelectGroup
                    label="HRA City Category"
                    value={cityType}
                    onChange={(val) => setCityType(val as CityType)}
                    options={[
                      { label: `X City (${daPercent >= 50 ? '30' : '27'}%)`, value: CityType.X },
                      { label: `Y City (${daPercent >= 50 ? '20' : '18'}%)`, value: CityType.Y },
                      { label: `Z City (${daPercent >= 50 ? '10' : '9'}%)`, value: CityType.Z },
                    ]}
                  />
                   <InputGroup 
                    label={`HRA Amount`}
                    value={hraAmount} 
                    onChange={() => {}} 
                    readOnly 
                    prefix="₹"
                    helperText={
                      hraAmount === minHra 
                        ? `Minimum Floor (₹${minHra}) Applied` 
                        : `${hraPercent}% of Basic Pay`
                    }
                  />
                </div>

                {/* TA Section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                     <label className="text-sm font-medium text-slate-700">Transport Allowance</label>
                     {currentLevel.level < 14 && (
                       <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 hover:bg-emerald-100 transition-colors">
                        <input 
                          type="checkbox" 
                          checked={isTptaCity} 
                          onChange={(e) => setIsTptaCity(e.target.checked)}
                          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        Higher TPTA City?
                       </label>
                     )}
                  </div>
                  <InputGroup 
                    label=""
                    value={taAmount} 
                    onChange={() => {}} 
                    readOnly 
                    prefix="₹"
                    helperText={
                      currentLevel.level >= 14
                        ? "Fixed TA for Level 14+ (₹15750 + DA)"
                        : (isTptaCity ? "Higher TPTA Rate (e.g. Delhi)" : "Standard TPTA Rate")
                    }
                  />
                </div>

                {/* Other Allowances */}
                <InputGroup
                  label="Other Allowances"
                  value={otherAllowances}
                  onChange={(v) => setOtherAllowances(Number(v) || 0)}
                  type="number"
                  prefix="₹"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Deductions Column */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-gradient-to-r from-rose-50/90 to-rose-100/50 border-b border-rose-100 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-rose-800 flex items-center gap-2">
                  <span className="w-2 h-6 bg-rose-500 rounded-full shadow-sm"></span>
                  Deductions
                </h2>
                <span className="text-rose-700 font-bold bg-white/80 px-3 py-1 rounded-full text-sm shadow-sm border border-rose-100">
                  - {formatCurrency(totalDeductions)}
                </span>
              </div>

              <div className="p-6 space-y-5">
                {/* NPS */}
                <div className="space-y-1">
                   <div className="flex items-center justify-between mb-1">
                     <label className="text-sm font-medium text-slate-700">NPS (10% of Basic + DA)</label>
                     <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100 hover:bg-rose-100 transition-colors">
                      <input 
                          type="checkbox" 
                          checked={npsEnabled} 
                          onChange={(e) => setNpsEnabled(e.target.checked)}
                          className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                        />
                        Enabled
                     </label>
                   </div>
                   <InputGroup 
                    label=""
                    value={npsAmount} 
                    onChange={() => {}} 
                    readOnly 
                    prefix="₹"
                    helperText="National Pension System Tier-I"
                  />
                </div>

                {/* Professional Tax */}
                <InputGroup
                  label="Professional Tax"
                  value={professionalTax}
                  onChange={(v) => setProfessionalTax(Number(v) || 0)}
                  type="number"
                  prefix="₹"
                  helperText="Varies by State (e.g. ₹200)"
                />

                {/* Income Tax */}
                <InputGroup
                  label="Income Tax (TDS)"
                  value={incomeTax}
                  onChange={(v) => setIncomeTax(Number(v) || 0)}
                  type="number"
                  prefix="₹"
                  helperText="Estimated monthly tax deduction"
                />

                {/* CGEGIS */}
                <InputGroup
                  label="CGEGIS"
                  value={cgegis}
                  onChange={(v) => setCgegis(Number(v) || 0)}
                  type="number"
                  prefix="₹"
                  helperText="Central Govt Employees Group Insurance Scheme"
                />

                {/* Other Deductions */}
                <InputGroup
                  label="Other Deductions"
                  value={otherDeductions}
                  onChange={(v) => setOtherDeductions(Number(v) || 0)}
                  type="number"
                  prefix="₹"
                  placeholder="License fee, Association, etc."
                />
              </div>

               {/* Helpful Info Box */}
               <div className="p-6 bg-slate-50/60 border-t border-slate-100">
                  <div className="flex gap-3 text-slate-600 text-sm">
                    <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-500" />
                    <p>
                      <strong>Note:</strong> HRA includes minimum floors (₹5400/₹3600/₹1800). TA for Level 14+ is fixed at ₹15,750+DA. NPS is mandatory for employees joining after 2004.
                    </p>
                  </div>
               </div>
            </div>
          </div>

          {/* Footer Contact */}
          <div className="text-center md:text-right text-xs text-slate-500 font-medium pb-4 bg-white/30 p-2 rounded-lg backdrop-blur-sm inline-block float-right mb-20 md:mb-0">
             If any error or for suggestion you can write to <a href="mailto:govardhanrly@gmail.com" className="text-indigo-600 hover:underline font-bold">govardhanrly@gmail.com</a>
          </div>

          {/* Summary Footer */}
          <div className="sticky bottom-4 md:bottom-8 z-40 clear-both">
             <div className="bg-slate-900/90 text-white rounded-xl shadow-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto border border-slate-700 ring-1 ring-white/10 backdrop-blur-md">
                <div className="text-center md:text-left space-y-1">
                  <div className="text-slate-400 text-sm font-medium uppercase tracking-wider">Estimated Net Salary</div>
                  <div className="text-4xl md:text-5xl font-bold text-white tracking-tight flex items-center gap-1 text-shadow">
                    <IndianRupee className="w-8 h-8 md:w-10 md:h-10 text-emerald-400" />
                    {netSalary.toLocaleString('en-IN')}
                  </div>
                  <div className="text-slate-400 text-xs">Per Month • In Hand</div>
                </div>

                <div className="flex gap-4 md:gap-12 w-full md:w-auto justify-center border-t md:border-t-0 border-slate-700 pt-4 md:pt-0">
                    <div className="text-center md:text-right">
                      <div className="text-emerald-400 text-xs font-bold uppercase">Gross Earnings</div>
                      <div className="text-xl font-semibold">{formatCurrency(totalEarnings)}</div>
                    </div>
                    <div className="w-px bg-slate-700 hidden md:block"></div>
                    <div className="text-center md:text-left">
                      <div className="text-rose-400 text-xs font-bold uppercase">Total Deductions</div>
                      <div className="text-xl font-semibold">{formatCurrency(totalDeductions)}</div>
                    </div>
                </div>
             </div>
          </div>
          
          <div className="h-24 md:hidden"></div> {/* Spacer for mobile sticky footer */}
        </div>
      </div>
    </div>
  );
};

export default App;