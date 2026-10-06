import { productAsset, documentAsset } from './assetRegistry';

// Catalogue content transcribed from the supplied master specification.
// MO 3 and MO 3.4 use their separate existing assets: the supplied list groups
// both names under mo-34.png, while stating twelve multi-turn variants.
export const PRODUCT_FAMILIES = [
  { id: 'water', name: 'Water & treatment', title: 'Cleaner water. Every stage.', description: 'Measure, treat and protect the water that moves through your system.', image: '/images/hero-wtp-BGjLUC-Q.jpg', featured: 'electromagnetic-flow-meter', accent: '#007bb9' },
  { id: 'measurement', name: 'Sensors & analysis', title: 'See the details that matter.', description: 'Explore level, pressure, air and gas instrumentation.', image: '/images/electro-mech-BjrTidAv.jpg', featured: 'hydrostatic-level-transmitter', accent: '#079b9b' },
  { id: 'flow', name: 'Flow & movement', title: 'Move water with confidence.', description: 'Valves, actuators and pipe jointing equipment for a connected network.', image: '/images/valves-Cn1fyoyr.jpg', featured: 'mo-3-4', accent: '#1279c8' },
  { id: 'connected', name: 'Connected control', title: 'One system. A clearer view.', description: 'Automation, telemetry and vision technology bring your assets together.', image: '/images/scada-JO4jHDve.jpg', featured: 'plc-control-panel', accent: '#396cb9' },
  { id: 'energy', name: 'Power & solar', title: 'Energy for what comes next.', description: 'Explore electrical infrastructure and solar energy solutions.', image: '/images/service_oht.jpg', featured: 'mono-perc-bifacial', accent: '#139ba4' },
  { id: 'advanced', name: 'Robotics & IoT', title: 'Go further. Look deeper.', description: 'Specialised systems for underwater work and foundation monitoring.', image: '/images/service_intake.jpg', featured: 'submersible-dredging-vehicle-sdv', accent: '#0a7b96' },
];

const category = (id, name, family, tagline, entries) => ({
  id, name, family, tagline,
  products: entries.map(([name, filename, description = '', features = [], featureLabel = 'Key features', document = null]) => ({
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    name, filename, image: productAsset(filename), description, features, featureLabel,
    document: document ? documentAsset(document) : null,
    category: name, categoryId: id, family,
  })),
});

export const PRODUCT_CATEGORIES = [
  category('flow-meters', 'Flow Meters', 'water', 'High-precision electromagnetic, ultrasonic, vortex, mass, turbine & prepaid water meters for municipal and industrial pipelines.', [
    ['Bulk Flow Meter', 'bulk-flow-meter.jpg', 'Precision made positive displacement liquid measuring instrument which maintains accurate metering over long periods of operation. The simplicity of design and construction together with sustained accuracy has led to widespread use.', ['Designed for quick and easy maintenance', 'Automatic additive injector available', 'Electronic digital control available']],
    ['Electromagnetic Flow Meter', 'electromagnetic-flow-meter.jpg', "Magmeters operate pursuant to Faraday's law of electromagnetic induction – a voltage is induced when a conductor moves through a magnetic field. Measures conductive liquids with high accuracy and zero pressure loss.", ['No moving parts inside the pipe', 'High accuracy (±0.5%) for raw and treated water', 'Sizes: 15mm to 2000mm with PTFE / Hard Rubber lining', '4-20mA & RS485 Modbus RTU output']],
    ['Open Channel Ultrasonic Flow Meter', 'ultrasonic-level-tx.jpg', 'Ultrasonic flow meter measuring fluid velocity using sound waves to calculate volume flow in open drains, canals, and flumes without contacting the effluent liquid.', ['Non-contact measurement technology', 'No moving parts, zero clogging risk', 'Low maintenance costs in dirty effluent channels']],
    ['Water Meter', 'water-meter.jpg', 'Measures volume of water consumed by residential and commercial building units supplied by public water supply systems.', ['Residential and commercial custody transfer', 'Accurate billing measurement in cubic meters / gallons', 'High durability bronze/cast iron construction']],
    ['Mass Flow Meter', 'mass flowmeter.png', 'Advanced Coriolis mass flow instrument measuring the actual mass of fluid or gas flowing through a pipeline, independent of temperature, density, and pressure variations.', ['Direct mass flow measurement without external compensation', 'High accuracy & repeatability for critical chemical / fuel / distillery processes', 'Digital smart transmitter with real-time diagnostics']],
    ['Turbine Flow Meter', 'turbine-flow-meter.jpeg', 'High-accuracy flow meter for clean, low-viscosity liquids. Works on precision rotor spinning proportional to fluid velocity.', ['Robust SS304 / SS316 construction', 'Digital display showing instantaneous and total flow', 'Fast response time and low pressure drop']],
    ['Vortex Flow Meter', 'Vortex-Flowmeter.jpg', 'Von Kármán vortex shedding flow meter for steam, gas, and low-viscosity liquids. Reliable measurement even under fluctuating temperatures and pressures.', ['Wide measurement range for saturated/superheated steam & gases', 'No moving parts, immune to thermal shock', 'Integrated temperature and pressure compensation option']],
    ['Smart Prepaid Water Meter', 'prepaid- watermeter.png', 'STS-compliant smart prepaid water meter with built-in motor valve for revenue protection and automated customer billing.', ['Integrated electronic shut-off valve', 'Anti-tamper and low battery alert', 'Token/RFID card based credit recharge']],
    ['Smart Water Meter for Household', 'smart-watermeter.jpg', 'Domestic ultrasonic smart meter with remote AMR/AMI reading via M-Bus, LoRaWAN, or NB-IoT for municipal city water networks.', ['Ultrasonic static measurement (no mechanical wear)', 'Battery life up to 10+ years', 'Reverse flow detection and leakage alarming']],
    ['Smart Water Meter for Utilities', 'utility.jpg', 'Heavy-duty bulk utility water meter engineered for city-gate distribution, bulk commercial consumers, and DMA (District Metered Area) leakage tracking.', ['Cellular 4G / NB-IoT telemetry built-in', 'High turn-down ratio and low start-up flow rate', 'IP68 fully submersible waterproof construction']],
  ]),
  category('treatment', 'Water Treatment Plants & Systems', 'water', 'Complete WTP · STP · RO · ETP turnkey engineering solutions.', [
    ['Water Treatment Plants (WTP)', 'wtp plant.jpg', 'Turnkey municipal & industrial surface and ground water clarification and purification plants.', ['Clariflocculators, dual-media sand filters, automated chemical dosing, PLC/SCADA control room.'], 'Specifications'],
    ['Sewage Treatment Plants (STP)', 'stp plant.jpg', 'Biological municipal wastewater treatment plants utilizing MBBR and SBR processes.', ['High BOD/COD/TSS reduction, automated aeration blowers, eco-friendly effluent discharge.'], 'Specifications'],
    ['Reverse Osmosis Systems (RO)', 'ro.jpg', 'Multi-stage membrane desalination plants for pharmaceutical and boiler-feed high-purity water.', ['High-rejection TFC membranes, energy recovery systems, automated CIP sequence.'], 'Specifications'],
    ['Effluent Treatment Plants (ETP)', 'etp plant.png', 'Heavy industrial wastewater neutralization and Zero Liquid Discharge (ZLD) plants.', ['Chemical precipitation, sludge dewatering filter presses, automated pH/COD regulatory logging.'], 'Specifications'],
  ]),
  category('water-quality', 'Water Quality Analyzers', 'water', 'Online continuous analyzers for process water, drinking water and effluent compliance.', [
    ['Total Chlorine Transmitter/Controller', 'chlorine-transmitter-new.jpg', 'Free & total residual chlorine monitoring, PID dosing pump control.'],
    ['Dissolved Oxygen (DO) Transmitter', 'do-transmitter.png', 'Optical / polarographic DO sensor for STP aeration basins.'],
    ['pH Analyzer', 'ph-analyzer.jpeg', '0-14 pH continuous measurement with automatic temperature compensation (PT1000).'],
    ['Turbidity Analyzer', 'turbidity-analyzer.jpeg', 'Nephelometric optical turbidity monitor (0-1000 NTU) for WTP clarifiers.'],
    ['BOD Analyzer', 'bod-analyzer.jpeg', 'Online Biological Oxygen Demand continuous testing for CPCB compliance.'],
    ['COD Analyzer', 'cod-analyzer.jpeg', 'UV digestion Chemical Oxygen Demand analyzer with auto-cleaning and calibration.'],
  ]),
  category('air-analyzers', 'Air Analyzers', 'measurement', 'Continuous air and particulate monitoring.', [
    ['SOx Analyzer', 'sox analyzer.png', 'Stack emissions & ambient sulfur oxides monitoring (UV fluorescence).'],
    ['NOx Analyzer', 'nox analyzer.jpg', 'Chemiluminescence nitrogen oxides (NO, NO2, NOx) continuous monitor.'],
    ['PM10 Analyzer', 'pm10.jpg.jpeg', 'Beta attenuation particulate matter 10 monitor.'],
    ['PM2.5 Analyzer', 'pm2.5.png', 'Fine particulate matter 2.5 micron environmental analyzer.'],
  ]),
  category('gas-analyzers', 'Gas Analyzers', 'measurement', 'Process gas measurement for industrial systems.', [
    ['Carbon Monoxide (CO) Gas Analyzer', 'co analyzer.jpg', 'NDIR sensor for industrial boiler exhaust & safety.'],
    ['Carbon Dioxide (CO₂) Gas Analyzer', 'co2 analyzer.jpg', 'Precision dual-wavelength NDIR gas transmitter.'],
    ['CH₄ Gas Analyzer (Methane)', 'methane-gas-analyzer..jpeg', 'Biogas plant and digester methane monitoring.'],
  ]),
  category('level-transmitters', 'Level Instrumentation', 'measurement', 'Continuous level measurement from borewells to reservoirs.', [
    ['Capacitance Level Transmitter', 'capacitance-level-transmitter.jpg', 'Continuous level for liquids, pastes, and solids.'],
    ['Hydrostatic Level Transmitter', 'hydrostatic-level-tx.jpg', 'Deep borewell & reservoir submersible depth sensor (up to 200m).'],
    ['Ultrasonic Level Transmitter', 'ultrasonic-level-tx.jpg', 'Compact type non-contact echo level gauge with local LCD.'],
    ['Submersible Level Transmitter', 'level-transmitter.jpeg', 'Integrated type SS316L diaphragm hydrostatic transmitter.'],
  ]),
  category('level-switches', 'Level Switches', 'measurement', 'Point level detection for dependable pump control.', [
    ['Conductive Level Switch', 'conductive-level-switch.jpg', 'Multi-rod point level detection for conductive water.'],
    ['Float Level Switch', 'float-level-switch.jpg', 'Magnetic reed switch float control for pump automation.'],
    ['Coupling Level Switch', 'coupling switch.png', 'Heavy-duty rotary paddle / vibrating fork point switch.'],
  ]),
  category('valves', 'Valves & Piping', 'flow', 'Valve and piping components for water transmission and control.', [
    ['Butterfly Valves', 'butter-fly-valves.jpg', 'Wafer, lug & flanged resilient seated butterfly valves (PN10/16/25).'],
    ['Gate Valve', 'gate-valve.jpg', 'Solid wedge isolation gate valves for water transmission mains.'],
    ['HDPE Pipe & Fittings', 'hdpe-fittings.jpg', 'High-density polyethylene PE100 electrofusion bends, tees & reducers.'],
    ['Motorized Ball Valve', 'motorized-ball-valve.jpg', 'Electrically actuated shut-off valve for SCADA automation.'],
    ['Sluice Valve', 'sluce-valves.jpg', 'Non-rising stem cast iron/ductile iron water sluice valves.'],
    ['Control Valve', 'control-valves-1.png', 'Linear globe modulating control valve with pneumatic/electric actuator.'],
  ]),
  category('automation', 'Automation & Telemetry', 'connected', 'Connected control from the field to the control room.', [
    ['IoT Gateway & Telemetry', 'iot.jpeg', '4G cellular telemetry gateway with cloud MQTT/HTTPS uplink.'],
    ['PLC Control Panel', 'syncsys_plc.png', 'Custom fabricated Siemens/Schneider/ABB PLC control panel with HMI.'],
    ['RTU (Remote Terminal Unit)', 'rtu-remote.jpeg', 'Solar-compatible remote telemetry unit for rural booster stations.'],
    ['SCADA System', 'Scada 2.png', 'Central control room supervisory software for multi-plant monitoring.'],
    ['DCS Controller', 'dcs.jpeg', 'Distributed Control System for large-scale municipal water networks.'],
  ]),
  category('cameras', 'Cameras & Vision', 'connected', 'Vision, recording and video management technology.', [
    ['Bullet Camera', 'bullet-camera.jpg'], ['Dome Camera', 'dome-camera.jpg'], ['High Speed Camera', 'high-speed-camera.jpg'], ['PTZ Camera', 'ptz-camera.jpg'], ['Storage Servers', 'servers.jpg'], ['Video Management Software', 'softwares.jpg'],
  ]),
  category('jointing', 'Jointing Machines', 'flow', 'Equipment for plastic pipe welding and jointing.', [
    ['Hydraulic Butt Fusion Machine', 'big-jointing-machines.jpg'], ['ZEEN-3000 PLUS Pipe Welder', 'welding_machine.jpg'], ['Bar-code Electrofusion Machine', 'electrofusion.jpeg'],
  ]),
  category('pressure-sensors', 'Pressure Sensors', 'measurement', 'Digital, electronic and differential pressure sensing.', [
    ['Digital Pressure Sensor', 'pressure sensor-2.jpeg'], ['Electronic Pressure Sensor', 'pressure-sensor-1.jpeg'], ['Differential Pressure Sensor', 'pressure-sensor.jpeg'],
  ]),
  category('pressure-transmitters', 'Pressure Transmitters', 'measurement', 'Pressure transmission for connected process instrumentation.', [
    ['Blind Type Pressure Transmitter', 'blind-type-pressure-transmitters.jpg'], ['Differential Pressure Transmitter', 'differential-pressure-transmitter.jpg'], ['SMART Type Pressure Transmitter with HART', 'smart-type-pressure-transmitter.jpg'], ['Digital Display Pressure Transmitter', 'pressure-transmeter.jpeg'],
  ]),
  category('chlorinators', 'Chlorinators', 'water', 'Chlorine dosing and on-site electrolysis systems.', [
    ['Vacuum Chlorinator', 'chlorinator.jpg'], ['Automatic Chlorine Dosing System', 'chlorinator-1.jpeg'], ['CHLORINSITU IIa On-Site Electrolysis', 'electrolysis-system-chlorinsitu.jpeg'], ['High-Capacity Electrolysis System', 'chlorinator-3.jpeg'],
  ]),
  category('transformers', 'Transformers & Switchgear', 'energy', 'Electrical infrastructure for industrial power systems.', [
    ['Auto Transformers', 'auto-transformer.png'], ['Distribution Transformers', 'distribution-transformer.jpeg'], ['Shunt Reactors', 'shunt-reactor.png'], ['Locomotive Transformers', 'locomotive-transformer.png'], ['SF6 Circuit Breakers up to 800 kV', 'sf6-circuit-breaker.png'],
  ]),
  category('solar-lighting', 'Solar Lighting', 'energy', 'Solar-powered lighting and photovoltaic panels.', [
    ['Smart Solar Street Light', 'smart-solar-street-light.jpeg'], ['Solar PV Panel', 'solar-panel.jpg'],
  ]),
  category('floating-solar', 'Floating Solar', 'energy', 'Floating photovoltaic systems and modular support structures.', [
    ['Floating Solar Power Plant', 'floating-solar.jpeg'], ['Modular HDPE Floaters', 'floating-solar-structure.jpeg'],
  ]),
  category('solar-modules', 'Solar Modules', 'energy', 'Explore photovoltaic module technologies.', [
    ['Polycrystalline', 'polycrysteline-module.jpeg'], ['Monocrystalline', 'mono-crystalline-module.jpeg'], ['Mono PERC Half-Cut', 'mono-perc-half-cut-module.jpeg'], ['Mono PERC Bifacial', 'mono-perc-bifacial-module.jpeg'],
  ]),
  category('multi-turn', 'Multi-Turn Actuators', 'flow', 'Explore the electric multi-turn actuator collection.', [
    ['SO 2', 'electric-multi-turn-actuator-so-2.png'], ['UM 1', 'electric-multi-turn-actuator-um-1.png'], ['UM 2', 'electric-multi-turn-actuator-um-2.png'], ['MO 3', 'electric-multi-turn-actuator-mo-3.png'], ['MO 3.4', 'electric-multi-turn-actuator-mo-34.png'], ['MO 3.5', 'electric-multi-turn-actuator-mo-35.png'], ['MO 4', 'electric-multi-turn-actuator-mo-4.png'], ['MO 5', 'electric-multi-turn-actuator-mo-5.png'], ['SOR 2PA', '13-aded27aad68373a24e97208ec9030917.png'], ['UMR 1PA', 'electric-multiturn.jpeg'], ['UMR 2PA', 'Electric multi-turn actuator UMR 2PA.png'], ['MOR 3PA', 'electric multi-turn actuator MOR 3pa.png'],
  ]),
  category('part-turn', 'Part-Turn Actuators', 'flow', 'Explore the electric part-turn actuator collection.', [
    ['SP MIKRO', 'electric-part-turn-actuator-sp-mikro.jpg'], ['SP 0', 'electric-part-turn-actuator-sp-0.jpg'], ['SP 0.1', 'electric-part-turn-actuator-sp-01.jpg'], ['SP 1', 'electric-part-turn-actuator-sp-1.png'], ['SP 2', 'electric-part-turn-actuator-sp-2.jpg'], ['SP 2.3', 'electric-part-turn-actuator-sp-23.png'], ['SP 2.4', 'electric-part-turn-actuator-sp-24.png'], ['MPR', 'electric-part-turn-actuator-mpr.png'], ['MPR 5', '74131400-1-mpr-5-a-casti-vz6.png'], ['UP 1', 'electric-part-turn-actuator-up-1.png'], ['MPR 6', '74131700-1-mpr-6-a-casti-vz10.png'], ['UP 2', 'electric-part-turn-actuator-up-2.png'],
  ]),
  category('robotics', 'Underwater Robotics', 'advanced', 'Remote systems for underwater sediment removal.', [
    ['Submersible Dredging Vehicle (SDV)', 'sdv.jpg', 'Remotely operated underwater robotic crawler for sludge, silt, and sediment removal up to 50 meters depth without human entry.', ['2000 × 1000 × 1000 mm', '940 kg', 'SS304/SS316', 'Integrated dredging suction pump', 'Underwater HD camera & sonar'], 'Specifications', 'SDV_Orbit.pdf'],
  ]),
  category('scour', 'Scour Monitoring & IoT', 'advanced', 'Real-time foundation and water level monitoring.', [
    ['Real-Time Scour Monitoring System', 'scour-monitoring.jpeg', 'IoT-based real-time bridge foundation soil erosion and water level monitoring system with automated cloud SMS alerts.', ['Radar/sonar level sensing', 'PLC control unit', 'Solar PV + battery backup', 'Waterproof armored outdoor cabling'], 'Specifications', 'Real-Time Scour Detection for Stronger Foundations.pdf'],
  ]),
].map((entry, index) => ({ ...entry, number: String(index + 1).padStart(2, '0'), products: entry.products.map(product => ({ ...product, category: entry.name, categoryNumber: String(index + 1).padStart(2, '0') })) }));

export const PRODUCTS = PRODUCT_CATEGORIES.flatMap(category => category.products);
