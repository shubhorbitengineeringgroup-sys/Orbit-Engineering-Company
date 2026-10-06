import { clientAsset, partnerAsset } from './assetRegistry';
import { ecosystemWebsites } from './ecosystemWebsites';

// Names, groups, origins and scopes follow Orbit's latest 22-client / 17-partner master list.
export const clientGroups = ['All clients', 'Government & public', 'PSU & EPC', 'Private & corporate'];
const client = (id, name, file, sector, group, scope) => ({ id, name, logo: clientAsset(file), sector, group, scope, website: ecosystemWebsites[id] });
export const ecosystemClients = [
  client('mp-jal-nigam', 'MP Jal Nigam Maryadit', 'mp-jal-nigam.png', 'MP Government Water Board', 'Government & public', 'Jal Jeevan Mission (JJM) rural water schemes and pipeline automation.'),
  client('bharat-sarkar', 'Bharat Sarkar / Ministry of Jal Shakti', 'bharat-sarkar.png', 'Central Government', 'Government & public', 'National drinking water mission guidelines and central projects.'),
  client('mpudcl-bhopal', 'MPUDCL Bhopal', 'mpudcl-bhopal.jpg', 'MP Urban Development Company Ltd', 'Government & public', 'City water supply projects and urban treatment plants.'),
  client('mpudcl-indore', 'MPUDCL Indore District', 'mpudcl-indore-district.png', 'Urban Development Authority', 'Government & public', 'Reservoir monitoring and water distribution in the Indore region.'),
  client('bmc', 'Bhopal Municipal Corporation (BMC)', 'bhopal-municipal-corporation.jpg', 'Municipal Corporation', 'Government & public', 'Bhopal water treatment plants (WTP) and lake intake automation.'),
  client('imc', 'Indore Municipal Corporation (IMC)', 'indore municipal corporation.png', 'Municipal Corporation', 'Government & public', 'Smart water meters and city-gate bulk flow pipelines.'),
  client('railways', 'Indian Railways', 'Indian Railways.png', 'Indian Railway Ministry', 'Government & public', 'Water storage and water quality control at railway stations.'),
  client('bhel', 'Bharat Heavy Electricals Limited (BHEL)', 'bhel.jpg', 'Maharatna PSU', 'PSU & EPC', 'Heavy electrical automation, sensor calibration and substation works.'),
  client('lt', 'Larsen & Toubro (L&T)', "larsen- toubro's.png", 'Mega EPC Contractor', 'PSU & EPC', 'Instrumentation and telemetry for L&T water infrastructure tenders.'),
  client('dbl', 'Dilip Buildcon Limited (DBL)', 'dbl-buildcon.png', 'National Infrastructure Builder', 'PSU & EPC', 'Highway pipe networks and pumping station automation.'),
  client('lupin', 'Lupin Pharmaceuticals Ltd', 'lupin-pharmaceuticals.png', 'Pharmaceutical Company · Mandideep', 'Private & corporate', 'Turnkey pure Reverse Osmosis (RO) plant and CIP automation.'),
  client('prism', 'Prism Cement Limited', 'prism-cement.png', 'Heavy Industrial Cement Plant · Satna', 'Private & corporate', 'Closed-loop climate humidity and temperature control system.'),
  client('heg', 'HEG Limited (LNJ Bhilwara Group)', 'HEG.png', 'Industrial Graphite Manufacturing', 'Private & corporate', 'Industrial cooling water treatment and effluent recycling.'),
  client('vindhyachal', 'Vindhyachal Distilleries Pvt Ltd', 'vindhayachal-distillery.png', 'Distillery & Liquor Plant · Pilukhedi', 'Private & corporate', '40 KL turnkey automation, Coriolis mass flow meters and boiler feed.'),
  client('central-india', 'Central India Pvt Ltd', 'central-india-pvt-ltd.png', 'Industrial Manufacturer', 'Private & corporate', 'Industrial water filtration and environmental discharge monitoring.'),
  client('tejas', 'Tejas Construction & Infrastructure', 'tejas-constructions.png', 'Water EPC Contractor', 'Private & corporate', 'Bulk water transmission pipelines and electro-mechanical erection.'),
  client('cmr', 'CMR Infrastructure', 'cmr_logo.jpg', 'Civil Infrastructure', 'Private & corporate', 'Underground pipe network execution and pump houses.'),
  client('laxmi', 'Laxmi Civil Engineering Services', 'laxmii.png', 'Infrastructure Company', 'Private & corporate', 'Clariflocculator civil-mechanical integration.'),
  client('om', 'OM Construction', 'om.jpeg', 'Civil Contractor', 'Private & corporate', 'Rural water supply schemes and overhead tank (OHT) telemetry.'),
  client('pwd', 'Public Works Department (PWD MP)', 'pwd.png', 'State Government Department', 'Government & public', 'Bridge foundation scour detection systems and river crossings.'),
  client('mes', 'Military Engineer Services (MES)', 'military-engineer-services.jpg', 'Defense Infrastructure', 'Government & public', 'Drinking water plants and chlorination in army cantonments.'),
  client('gem', 'Government e-Marketplace (GeM)', 'gem.jpg', 'Government Public Procurement', 'Government & public', 'Government-certified vendor for flow meters and panels.'),
];

export const partnerGroups = ['All partners', 'Automation & data', 'Measurement & sensors', 'Water & mechanical', 'Power & electrical'];
const partner = (id, name, file, category, group, scope, image, origin) => ({ id, name, logo: partnerAsset(file), category, group, scope, image, origin, website: ecosystemWebsites[id] });
export const ecosystemPartners = [
  partner('siemens', 'Siemens', 'Siemen.jpg', 'Automation & Control', 'Automation & data', 'PLC (S7-1200 / S7-1500), SCADA WinCC software and industrial automation platforms.', '/images/scada-JO4jHDve.jpg', 'Germany'),
  partner('pepperl-fuchs', 'Pepperl+Fuchs', 'pepperl_fuchs.jpg', 'Sensors & Hazardous Protection', 'Measurement & sensors', 'Industrial sensors, proximity switches and hazardous area safety barriers.', '/images/electro-mech-BjrTidAv.jpg', 'Germany'),
  partner('prominent', 'ProMinent', 'prominent.png', 'Chemical Dosing & Disinfection', 'Water & mechanical', 'CHLORINSITU on-site electrolysis systems, gas chlorination and chemical dosing pumps.', '/images/hero-wtp-BGjLUC-Q.jpg', 'Germany'),
  partner('regada', 'Regada Actuators', 'regada_actuators_logo.png', 'Valve Actuators', 'Water & mechanical', 'Electric multi-turn and part-turn valve actuators.', '/images/valves-Cn1fyoyr.jpg', 'Slovakia'),
  partner('forbes-marshall', 'Forbes Marshall', 'forbes-marshall.jpg', 'Steam, Flow & Instrumentation', 'Measurement & sensors', 'Vortex flow meters, steam engineering and process control valves.', '/images/flow-meter-DSWy7kTd.jpg', 'India / UK'),
  partner('fuji', 'Fuji Electric', 'fuji-electric.png', 'Power Electronics & Drives', 'Power & electrical', 'VFD variable frequency drives, pressure transmitters and gas analyzers.', '/images/electro-mech-BjrTidAv.jpg', 'Japan'),
  partner('cg-power', 'Crompton Greaves (CG Power)', 'crompton-greaves.png', 'Transformers & Switchgear', 'Power & electrical', 'Distribution transformers, power transformers and high-voltage SF6 switchgear.', '/images/electro-mech-BjrTidAv.jpg', 'India'),
  partner('nowatech', 'Nowatech', 'nowatech.png', 'Pipe Jointing Technology', 'Water & mechanical', 'HDPE pipe hydraulic butt fusion and electrofusion welding machines.', '/images/pipeline-3e9YAzse.jpg', 'Poland'),
  partner('nivelco', 'Nivelco', 'nivelco.png', 'Level Instrumentation', 'Measurement & sensors', 'Ultrasonic, hydrostatic and microwave radar level transmitters.', '/images/service_oht.jpg', 'Hungary'),
  partner('rotronic', 'Rotronic', 'rotronic.png', 'Measurement & Climate Sensors', 'Measurement & sensors', 'Precision temperature, humidity and dew-point environmental sensors.', '/images/electro-mech-BjrTidAv.jpg', 'Switzerland'),
  partner('secure', 'Secure Meters', 'Secure.png', 'Smart Metering & Energy', 'Measurement & sensors', 'Smart prepaid AMR/AMI water meters and electronic energy meters.', '/images/flow-meter-DSWy7kTd.jpg', 'India / UK'),
  partner('hpl', 'HPL Electric & Power', 'HPL.png', 'Electrical Equipment', 'Power & electrical', 'Switchgear, control panels and solar LED lighting systems.', '/images/electro-mech-BjrTidAv.jpg', 'India'),
  partner('sbem', 'SBEM', 'SBEM.jpg', 'Level & Tank Gauging', 'Measurement & sensors', 'Tank gauging systems, magnetic level switches and float indicators.', '/images/service_oht.jpg', 'India'),
  partner('vertiv', 'Vertiv', 'vertiv.png', 'Critical Power & Infrastructure', 'Automation & data', 'SCADA control room industrial UPS, rack systems and power backup.', '/images/scada-JO4jHDve.jpg', 'USA'),
  partner('mirrant', 'Mirrant', 'Mirrant.png', 'Instrumentation & Sensors', 'Measurement & sensors', 'Industrial process sensors and automation accessories.', '/images/electro-mech-BjrTidAv.jpg', 'International'),
  partner('microtherm', 'Microtherm', 'microtherm.png', 'Thermal Protection', 'Measurement & sensors', 'Thermal protection switches and motor heat protection sensors.', '/images/electro-mech-BjrTidAv.jpg', 'Germany'),
  partner('measurement-solutions', 'Measurement Solutions', 'measurement.png', 'Process Instrumentation', 'Measurement & sensors', 'Precision liquid/gas flow calibration equipment and testing benches.', '/images/flow-meter-DSWy7kTd.jpg', 'International'),
];

export const industryStories = [
  { clientId: 'prism', domain: 'Heavy industry', image: '/images/electro-mech-BjrTidAv.jpg', alt: 'Industrial pressure gauges and measuring equipment', title: 'Precision throughout the process.' },
  { clientId: 'lupin', domain: 'Pharmaceutical', image: '/images/hero-wtp-BGjLUC-Q.jpg', alt: 'Water treatment infrastructure in a green landscape', title: 'Water engineered for purity.' },
  { clientId: 'vindhyachal', domain: 'Distillery', image: '/images/flow-meter-DSWy7kTd.jpg', alt: 'Industrial flow metering instrumentation', title: 'Every measure makes a difference.' },
  { clientId: 'central-india', domain: 'Manufacturing', image: '/images/pump-house-rehbpR99.jpg', alt: 'Blue industrial pumping equipment', title: 'Keeping industry moving.' },
  { clientId: 'lt', domain: 'Infrastructure EPC', image: '/images/pipeline-3e9YAzse.jpg', alt: 'Water transmission pipeline infrastructure', title: 'Connected from the ground up.' },
  { clientId: 'bhel', domain: 'Public sector enterprise', image: '/images/scada-JO4jHDve.jpg', alt: 'An industrial control room with SCADA screens', title: 'A clearer view of performance.' },
];
