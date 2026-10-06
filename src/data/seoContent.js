/**
 * Public, visible service content used by React and the static SEO renderer.
 * Every route is a permanent, root-relative URL. Paragraphs and FAQ answers are
 * plain text so metadata / JSON-LD can reuse the same facts without hidden copy.
 * Project and product IDs reference the existing siteConfig / catalogue records.
 * Shape: { id, path, title, shortTitle, description, intro, image, imageAlt,
 *   sections: [{ id, title, paragraphs: string[], items?: string[] }],
 *   relatedProjectIds: string[], productCategoryIds: string[],
 *   faqs: [{ question, answer }] }
 */
export const servicePages = [
  {
    id: 'water-treatment-bhopal',
    path: '/solutions/water-treatment-bhopal',
    title: 'Water Treatment, STP, ETP & RO Solutions in Bhopal',
    shortTitle: 'Water treatment & wastewater',
    description: 'Orbit Engineering in Bhopal provides WTP, STP, ETP and RO engineering, instrumentation, automation, installation and commissioning for water projects.',
    intro: 'Orbit Engineering is based in Bhopal, Madhya Pradesh, and works on municipal and industrial water treatment infrastructure. Our scope brings together water treatment plants (WTP), sewage treatment plants (STP), effluent treatment plants (ETP) and reverse osmosis (RO) systems with field instrumentation and PLC / SCADA control.',
    image: '/images/hero-wtp-BGjLUC-Q.jpg',
    imageAlt: 'Water treatment infrastructure surrounded by greenery',
    sections: [
      {
        id: 'treatment-scope',
        title: 'Treatment systems for different water requirements',
        paragraphs: [
          'A drinking water plant, a sewage treatment plant and an industrial effluent plant solve different problems. We review the source water, required output, plant capacity and existing infrastructure before agreeing the engineering and equipment scope.',
          'WTP work includes clarification, filtration, chemical dosing and chlorination. STP systems use biological treatment and controlled aeration. Industrial ETP work addresses wastewater treatment and recovery requirements. RO systems support applications such as pharmaceutical process water and boiler feed water.'
        ],
        items: ['WTP process equipment and dosing systems', 'STP aeration and process instrumentation', 'ETP pH measurement and treatment controls', 'RO plant automation and cleaning-in-place (CIP) sequencing']
      },
      {
        id: 'instrumentation-control',
        title: 'Connect treatment equipment to useful measurements',
        paragraphs: [
          'Flow, pressure, tank level and water quality measurements give operators a clearer view of a treatment process. Depending on the application, the equipment scope can include electromagnetic flow meters, level transmitters, pH and turbidity analyzers, residual chlorine measurement and dissolved oxygen sensors.',
          'PLC panels coordinate pumps, valves and dosing equipment. SCADA provides an operator interface for process status, alarms and operating records. Instrument selection, control sequences and reporting requirements are agreed against the actual plant design.'
        ]
      },
      {
        id: 'regional-projects',
        title: 'Water treatment experience in Bhopal and Madhya Pradesh',
        paragraphs: [
          'Our published portfolio includes water treatment automation for Bhopal Municipal Corporation at Idgah Hills, WTP automation for the Betul-Bazar, Amla and Sarni water network, and RO plant automation for Lupin Pharmaceuticals Ltd in Mandideep.',
          'These examples cover municipal drinking water and industrial process water applications. The Bhopal office is the contact point for a new plant, an instrumentation package or an upgrade to an existing treatment system.'
        ]
      },
      {
        id: 'project-brief',
        title: 'What to share for a treatment plant enquiry',
        paragraphs: ['A practical project brief helps us distinguish equipment supply from a complete engineering, installation and commissioning package. Share the information available now; drawings and operating records are particularly useful for existing plants.'],
        items: ['Site location, application and required treatment capacity', 'Source water or wastewater analysis, where available', 'Required treated water quality and intended reuse', 'Existing process drawings, pumps and electrical infrastructure', 'Requested scope: design, supply, automation, installation or maintenance']
      }
    ],
    relatedProjectIds: ['bhopal-3mgd-wtp', 'betul-45mld', 'lupin-ro-automation'],
    productCategoryIds: ['treatment', 'water-quality', 'chlorinators'],
    faqs: [
      { question: 'Does Orbit Engineering provide WTP, STP, ETP and RO solutions in Bhopal?', answer: 'Yes. Orbit Engineering is based in Bhopal and lists WTP, STP, ETP and RO engineering, equipment, installation and commissioning among its services. The final scope depends on the site, source water, application and treatment capacity.' },
      { question: 'Can an existing water treatment plant be automated?', answer: 'Existing plants can be reviewed for instrumentation, PLC control and SCADA integration. Share the current equipment list, electrical drawings, control panels and operating requirements so that the integration scope can be assessed.' },
      { question: 'How are STP, ETP and RO requirements different?', answer: 'STP treats sewage, ETP treats industrial effluent, and RO uses membranes to reduce dissolved contaminants in feed water. The appropriate process and equipment depend on water analysis, required output and the intended application.' },
      { question: 'What details are needed for a water treatment quotation?', answer: 'Share the location, required capacity, water analysis, desired output quality, drawings and requested scope. For an existing plant, include equipment details and the current operating issues.' }
    ]
  },
  {
    id: 'scada-plc-automation-bhopal',
    path: '/solutions/scada-plc-automation-bhopal',
    title: 'SCADA, PLC Automation & Water Telemetry in Bhopal',
    shortTitle: 'SCADA, PLC & telemetry',
    description: 'Bhopal-based Orbit Engineering designs PLC and RTU control panels, SCADA systems and telemetry for municipal water networks and industrial processes.',
    intro: 'Orbit Engineering connects water infrastructure and industrial equipment through PLC control panels, remote terminal units (RTUs), SCADA operator systems and IoT telemetry. From our Bhopal base, the engineering scope covers local equipment control, remote measurement and a central view of distributed assets.',
    image: '/images/scada-JO4jHDve.jpg',
    imageAlt: 'Control room with industrial monitoring screens',
    sections: [
      {
        id: 'control-architecture',
        title: 'From a pump panel to a multi-site SCADA system',
        paragraphs: [
          'A PLC controls the equipment at a plant or pumping station. An HMI gives a local operator access to equipment status and controls. An RTU collects field measurements at a remote location. SCADA brings the information together for supervisory monitoring and operator actions.',
          'Our service scope includes panel design, wiring, testing, PLC programming, control room integration and site commissioning. Automation platforms listed in the Orbit portfolio include Siemens and Schneider Electric; the platform and interfaces are selected around project requirements and existing equipment.'
        ],
        items: ['Pump sequencing and reservoir level control', 'Motorized valve and dosing equipment integration', 'PLC / RTU panels and local HMI interfaces', 'SCADA screens, alarms and operating records']
      },
      {
        id: 'telemetry-networks',
        title: 'Telemetry for water supply networks',
        paragraphs: [
          'Water supply schemes can have intake pumps, treatment units, transmission pipelines and overhead tanks spread across several locations. Telemetry connects flow, pressure, level and equipment status measurements to the central monitoring system.',
          'Cellular gateways, Ethernet and other project-specific communication links can be evaluated alongside the available coverage and control requirements. Local pump protection, remote monitoring, alarm delivery and communication recovery should each be defined in the project scope. A communication link alone does not guarantee continuous service.'
        ]
      },
      {
        id: 'network-visibility',
        title: 'District metering and operating visibility',
        paragraphs: [
          'District Metered Areas (DMAs) combine boundary flow measurements with pressure and level information to help operators understand distribution behaviour. Useful monitoring starts with a clear asset list, instrument locations and an agreed reporting interval.',
          'The published Orbit portfolio includes automation and telemetry for MP Jal Nigam water schemes in Neemuch, Shahdol and Rewa, and water supply automation at Betma, Gautampura and Depalpur in the Indore region. These are project locations; our listed office is in Bhopal.'
        ]
      },
      {
        id: 'automation-enquiry',
        title: 'Information needed for an automation proposal',
        paragraphs: ['For a new system or an upgrade, share the equipment and measurements to be connected. Existing PLC model numbers, signal types and communication protocols help determine integration work before panels or software are specified.'],
        items: ['Plant / station locations and a list of connected assets', 'Input-output (I/O) list and field instrument signal types', 'Existing PLC, HMI, VFD and SCADA software details', 'Required control sequences, alarms and reporting', 'Network coverage, power availability and remote access requirements']
      }
    ],
    relatedProjectIds: ['gandhisagar-pkg2', 'rewa-bansagar', 'indore-district-automation'],
    productCategoryIds: ['automation', 'level-transmitters', 'pressure-transmitters'],
    faqs: [
      { question: 'What is the difference between PLC, RTU and SCADA?', answer: 'A PLC performs local equipment control, an RTU collects or transmits information at remote sites, and SCADA provides supervisory screens, alarms and operating records. A project may use these systems together.' },
      { question: 'Can Orbit integrate Siemens or Schneider PLC panels?', answer: 'Siemens and Schneider Electric PLC platforms are included in Orbit’s published automation scope. Compatibility is assessed using the controller model, I/O requirements, existing software and communication interfaces.' },
      { question: 'Can remote water tanks and pumping stations be monitored?', answer: 'Yes. Orbit’s scope includes RTUs, level and flow instruments, cellular telemetry and SCADA integration for distributed water assets. Site coverage, power supply, local control and the required data interval need to be reviewed.' },
      { question: 'Will telemetry work in every network condition?', answer: 'Communication availability depends on the site and the selected network. Coverage, local control behaviour, power backup, data storage and recovery requirements should be assessed during system design and commissioning.' }
    ]
  },
  {
    id: 'flow-meters-instrumentation-bhopal',
    path: '/solutions/flow-meters-instrumentation-bhopal',
    title: 'Flow Meters & Process Instrumentation in Bhopal',
    shortTitle: 'Flow meters & instrumentation',
    description: 'Explore electromagnetic, ultrasonic and other flow meters, pressure and level transmitters, and water quality instrumentation from Orbit Engineering, Bhopal.',
    intro: 'Orbit Engineering supplies and integrates flow measurement, pressure, level and water quality instrumentation for municipal and industrial systems. Our Bhopal team helps define the measurement application, equipment interfaces and installation scope before an instrument is selected.',
    image: '/images/flow-meter-DSWy7kTd.jpg',
    imageAlt: 'Industrial flow measurement equipment',
    sections: [
      {
        id: 'flow-selection',
        title: 'Match the flow meter to the process',
        paragraphs: [
          'Our catalogue includes electromagnetic flow meters, bulk water meters, open channel ultrasonic meters, Coriolis mass flow meters, turbine meters and vortex meters. These technologies serve different liquids, gases, pipe arrangements and operating conditions.',
          'Electromagnetic meters are used for conductive liquids such as raw and treated water. Open channel measurement addresses applications such as drains, canals and flumes. Mass flow, turbine and vortex instruments are considered for the corresponding process fluid and measurement requirement. Selection should follow the actual process data and manufacturer documentation.'
        ],
        items: ['Raw water and treated water bulk metering', 'Open channel and wastewater flow measurement', 'Industrial liquid, steam and gas measurement', 'Consumer, prepaid and utility smart water meters']
      },
      {
        id: 'measurement-layers',
        title: 'Combine flow, level, pressure and water quality',
        paragraphs: [
          'A flow reading becomes more useful when connected to reservoir level, pressure and process status. Level transmitters and switches support storage and pump control. Pressure and differential pressure transmitters provide measurements for process monitoring and equipment control.',
          'The water quality catalogue includes chlorine, dissolved oxygen, pH, turbidity, BOD and COD analyzers. The exact measurement principle, range, sample arrangement and maintenance requirements should be agreed for each application.'
        ]
      },
      {
        id: 'installation-integration',
        title: 'Plan installation and control-system integration',
        paragraphs: [
          'Instrument enquiries should include pipe dimensions, fluid properties, expected flow or pressure range and the required outputs. Installation access, power supply, cable routes and the receiving PLC / SCADA interfaces are part of the measurement package.',
          'Orbit’s catalogue lists interfaces such as 4–20 mA, RS485 Modbus, HART and telemetry on relevant products. These are product-specific options, so the required interface and compatibility must be confirmed before ordering. Our field scope includes installation, testing and commissioning.'
        ]
      },
      {
        id: 'metering-portfolio',
        title: 'Metering applications in Madhya Pradesh',
        paragraphs: [
          'The Orbit portfolio lists water meter supply, installation, testing and commissioning for KARI and Lidhorakhas in Tikamgarh, and bulk flow metering with water infrastructure automation for Kymore and Vijayraghavgarh in Katni district.',
          'Our technology ecosystem also lists measurement suppliers such as Forbes Marshall, Nivelco and Secure Meters. Equipment selection remains specific to the application, approved specification and available product documentation.'
        ]
      }
    ],
    relatedProjectIds: ['kari-lidhorakhas', 'kymore-pkg-5d', 'bhopal-3mgd-wtp'],
    productCategoryIds: ['flow-meters', 'level-transmitters', 'pressure-transmitters', 'water-quality'],
    faqs: [
      { question: 'Which flow meters are available from Orbit Engineering?', answer: 'The catalogue lists electromagnetic, bulk water, open channel ultrasonic, Coriolis mass, turbine, vortex, prepaid and smart water meters. Product suitability depends on the fluid, flow range, installation and required outputs.' },
      { question: 'What information is needed to select an electromagnetic flow meter?', answer: 'Provide the liquid type and conductivity information, pipe size, flow range, pressure, temperature, connection type, installation conditions, power supply and required signal or communication output.' },
      { question: 'Can instruments connect to a PLC or SCADA system?', answer: 'Relevant catalogue products include analog and digital interfaces such as 4–20 mA and RS485 Modbus. The selected instrument output, controller input, protocol and electrical requirements must be checked together.' },
      { question: 'Does Orbit support meter installation and commissioning?', answer: 'Orbit lists supply, installation, testing and commissioning in its field service scope, including published water metering projects in Madhya Pradesh. Share the site and instrument details to define the work required.' }
    ]
  },
  {
    id: 'installation-commissioning-madhya-pradesh',
    path: '/solutions/installation-commissioning-madhya-pradesh',
    title: 'Water Infrastructure Installation & Commissioning in Madhya Pradesh',
    shortTitle: 'Installation & commissioning',
    description: 'Orbit Engineering supports water network installation, pump house and electrical integration, instrumentation testing and commissioning from Bhopal.',
    intro: 'Orbit Engineering provides field installation and commissioning for water infrastructure and automation packages. Our Bhopal-based scope covers pipelines, pump houses, electro-mechanical equipment, control panels and instrumentation, with testing and operator handover agreed for the project.',
    image: '/images/pipeline-3e9YAzse.jpg',
    imageAlt: 'Large water transmission pipeline infrastructure',
    sections: [
      {
        id: 'field-scope',
        title: 'Coordinate civil, mechanical and electrical work',
        paragraphs: [
          'Water infrastructure has several connected work fronts: raw water intake, treatment, pumping, storage and distribution. Installation needs to coordinate equipment locations, access, pipeline connections, power distribution and control interfaces.',
          'Our field scope includes DI / HDPE / MS pipeline work, HDPE electrofusion and butt jointing, submersible and vertical turbine pump installation, MCC panels and electrical equipment integration. The responsibility for each civil, mechanical and electrical activity is defined in the project package.'
        ],
        items: ['Pipeline laying, jointing and associated equipment', 'Pump house mechanical erection and alignment', 'Electrical panels, cabling and instrument installation', 'PLC, RTU and SCADA field integration']
      },
      {
        id: 'testing-handover',
        title: 'Test the installed system before handover',
        paragraphs: [
          'Commissioning brings individually installed components into a working system. The scope can include instrument checks, I/O verification, pump and valve trials, control sequence testing and dry / wet commissioning.',
          'Project acceptance criteria, test records and operator training should be agreed before commissioning starts. Handover information can then describe equipment operation, alarm handling and routine checks using the installed system configuration.'
        ]
      },
      {
        id: 'regional-delivery',
        title: 'Published municipal project locations',
        paragraphs: [
          'The Orbit portfolio lists supply, installation, testing and commissioning for Kymore and Vijayraghavgarh in Katni district, water treatment and distribution automation for Amarpatan and Ramnagar in Satna district, and water infrastructure telemetry for Harpalpur and Badagaon.',
          'These project records show the types of municipal water infrastructure described on this site. To plan field work at a new location, contact the Bhopal office with drawings, equipment details and the proposed programme.'
        ]
      },
      {
        id: 'readiness',
        title: 'Prepare the site for an installation package',
        paragraphs: ['The site programme should identify work dependencies before equipment arrives. Clear responsibility for approvals, utilities and interfaces helps define a realistic installation and commissioning scope.'],
        items: ['Approved layouts, pipeline routes and equipment schedules', 'Civil foundation readiness and safe equipment access', 'Power availability, cabling scope and panel interfaces', 'Instrument list, control logic and commissioning criteria', 'Site contacts, operator availability and handover documents']
      }
    ],
    relatedProjectIds: ['kymore-pkg-5d', 'amarpatan-pkg-7d', 'harpalpur-pkg-6g'],
    productCategoryIds: ['valves', 'jointing', 'automation'],
    faqs: [
      { question: 'What does SITC mean for a water project?', answer: 'SITC means supply, installation, testing and commissioning. It covers delivering equipment, installing it at the site, checking the installed system and bringing it into operation against the agreed project scope.' },
      { question: 'Can Orbit install control panels and field instruments?', answer: 'Yes. Orbit’s published field scope includes electrical panels, instruments, PLC / RTU integration, testing and site commissioning. The equipment list, wiring scope and receiving control-system interfaces should be included in the enquiry.' },
      { question: 'Does installation include operator handover?', answer: 'Operator training and technical handover are listed in Orbit’s commissioning scope. The required training, test records and operating documentation should be specified in the project package.' },
      { question: 'Where is the team based for Madhya Pradesh project enquiries?', answer: 'Orbit Engineering lists its office in Bhopal, Madhya Pradesh. Project locations are described separately in the portfolio and do not represent additional offices.' },
      { question: 'Can Orbit discuss installation projects outside Madhya Pradesh?', answer: 'Yes. Orbit’s published field installation and commissioning scope includes nationwide projects, and the portfolio includes work in Chhattisgarh and Odisha. Share the proposed site and work package with the Bhopal office to assess the project requirements.' }
    ]
  },
  {
    id: 'operation-maintenance-amc',
    path: '/solutions/operation-maintenance-amc',
    title: 'Water Plant O&M, Instrumentation Maintenance & AMC Support',
    shortTitle: 'Operations, maintenance & AMC',
    description: 'Discuss water plant operation and maintenance, preventive maintenance, instrumentation checks and AMC requirements with Orbit Engineering in Bhopal.',
    intro: 'Orbit Engineering provides operation and maintenance (O&M) and annual maintenance contract (AMC) services for municipal and industrial water assets. The Bhopal team helps define the equipment covered, operating responsibilities, planned inspections and support requirements for an agreed maintenance package.',
    image: '/images/pump-house-rehbpR99.jpg',
    imageAlt: 'Pumps and mechanical equipment in an industrial pump house',
    sections: [
      {
        id: 'maintenance-plan',
        title: 'Build a maintenance plan around the installed assets',
        paragraphs: [
          'A water treatment or distribution system combines pumps, valves, electrical equipment, sensors and automation. A maintenance plan needs to identify the installed models, operating duties, service history and practical site access.',
          'Our listed scope includes preventive maintenance, sensor checks and calibration work, critical spares planning, water quality testing and operating records. Inspection frequency and corrective work are defined around the plant and the agreed contract.'
        ],
        items: ['Pump, valve and panel inspections', 'Flow, pressure, level and water quality instrument checks', 'PLC / SCADA system review and alarm checks', 'Spares review and preventive maintenance schedules']
      },
      {
        id: 'om-amc-difference',
        title: 'Choose the right operating and support scope',
        paragraphs: [
          'O&M covers agreed operating tasks as well as maintenance responsibilities. An AMC defines maintenance coverage, scheduled service and support terms for named equipment or systems. The two scopes can overlap, but the responsibilities should be explicit.',
          'Site staffing, consumables, spare parts, calibration, reporting and escalation should be addressed in the proposal. Required response windows, support hours and exclusions must be agreed for the individual contract.'
        ]
      },
      {
        id: 'fault-information',
        title: 'Give the service team useful fault information',
        paragraphs: [
          'For an instrument or control-system fault, share the equipment make and model, observed symptoms, displayed alarms, recent changes and available drawings. For flow or level issues, include the operating conditions and how the reading differs from normal operation.',
          'The Orbit portfolio includes O&M support within the Amarpatan and Ramnagar water automation package. For an existing system at another site, coverage and access requirements can be reviewed with the Bhopal office.'
        ]
      },
      {
        id: 'maintenance-enquiry',
        title: 'What to include in an AMC enquiry',
        paragraphs: ['A clear asset schedule makes maintenance coverage reviewable. Send the available records so the proposal can state the equipment, inspection plan and responsibilities it covers.'],
        items: ['Site address, operating hours and primary contact', 'Equipment list, model numbers and installation dates', 'Current issues, service history and critical assets', 'Requested operating tasks and scheduled maintenance visits', 'Required support hours, spares coverage and reporting']
      }
    ],
    relatedProjectIds: ['amarpatan-pkg-7d'],
    productCategoryIds: ['water-quality', 'flow-meters', 'automation'],
    faqs: [
      { question: 'What is the difference between O&M and AMC?', answer: 'O&M covers agreed plant operating and maintenance responsibilities. An AMC specifies maintenance and service support for defined equipment or systems. Staffing, visits, spares and support terms depend on the contract.' },
      { question: 'Can an AMC cover water instruments and automation equipment?', answer: 'Orbit lists sensor calibration, spares planning and maintenance for water assets among its services. Coverage for specific flow meters, analyzers, PLCs and panels is reviewed using the installed equipment list and required support scope.' },
      { question: 'Are response times and spare parts included automatically?', answer: 'Response windows, service hours, parts coverage and exclusions are agreed for the individual maintenance contract. Include these requirements in the enquiry so the proposed coverage is clear.' },
      { question: 'How can I request support for an existing plant?', answer: 'Contact Orbit’s Bhopal team with the site location, equipment details, fault symptoms, alarms and available drawings or service records. These details help define the inspection and support required.' }
    ]
  },
  {
    id: 'solar-water-pumping',
    path: '/solutions/solar-water-pumping',
    title: 'Solar Water Pumping & Energy Integration in Bhopal',
    shortTitle: 'Solar water & energy',
    description: 'Orbit Engineering in Bhopal supports solar water pumping, solar drives, telemetry and renewable energy integration for water infrastructure.',
    intro: 'Orbit Engineering integrates solar energy with water pumping and treatment infrastructure. Our Bhopal-based service scope includes solar-powered submersible pumping, solar drive controls, floating solar systems and energy integration for water facilities.',
    image: '/images/service_oht.jpg',
    imageAlt: 'Water storage infrastructure used in distribution systems',
    sections: [
      {
        id: 'pumping-design',
        title: 'Start with water demand and the pumping duty',
        paragraphs: [
          'Solar water pumping should be considered alongside the source, required water volume, pumping head and storage arrangement. The existing motor, pipe network and control requirements affect the suitable pump and drive configuration.',
          'Our listed service scope includes submersible solar pumping stations and hybrid drive arrangements. PV modules, solar drives and pump controls need to be coordinated against the site requirement and available power sources.'
        ],
        items: ['Solar-powered water pumping systems', 'Solar VFD and pump control integration', 'Grid / solar operating arrangements where specified', 'Tank level, pump status and remote monitoring interfaces']
      },
      {
        id: 'power-water-integration',
        title: 'Solar integration for treatment and storage sites',
        paragraphs: [
          'Water facilities can combine pumping loads, treatment equipment and remote instrumentation. The catalogue includes solar PV modules, floating solar plants, modular floaters and solar-compatible remote telemetry units.',
          'Floating solar, rooftop solar and hybrid power integration are separate engineering scopes. Site layout, electrical connection, load profile and the intended operating arrangement need review before an equipment package is defined. Project approvals and scheme eligibility must be checked for the individual site.'
        ]
      },
      {
        id: 'monitoring-maintenance',
        title: 'Connect the energy system to the water system',
        paragraphs: [
          'Pump status, reservoir level and operating alarms can be included in the monitoring scope alongside the solar drive. Local control and the response to low water level or communication loss should be specified during design.',
          'Our published Beohari multi-village water scheme in Shahdol district describes solar-assisted pumping alongside water distribution automation. Solar equipment and telemetry can be discussed as part of a wider water infrastructure package through the Bhopal office.'
        ]
      },
      {
        id: 'solar-enquiry',
        title: 'Prepare a solar pumping enquiry',
        paragraphs: ['Share both the water requirement and the electrical information. A pump’s power rating alone does not describe the pumping duty or the storage requirement.'],
        items: ['Water source, site location and daily water requirement', 'Required pumping head, pipe size and storage capacity', 'Existing pump and motor ratings, where available', 'Grid availability, site layout and solar installation area', 'Control, monitoring and maintenance requirements']
      }
    ],
    relatedProjectIds: ['beohari-scheme'],
    productCategoryIds: ['solar-modules', 'floating-solar', 'automation'],
    faqs: [
      { question: 'Does Orbit provide solar water pumping solutions?', answer: 'Yes. Solar-powered submersible pumping, solar drive integration and water telemetry are listed in Orbit Engineering’s services. System requirements are assessed using the site, water demand, pumping head and available power sources.' },
      { question: 'Can solar pumping be connected to remote monitoring?', answer: 'Orbit’s catalogue includes solar-compatible RTUs and telemetry equipment. Pump status, tank level and operating alarms can be considered in the monitoring scope after checking the selected drive and instrument interfaces.' },
      { question: 'Does a solar pumping enquiry confirm subsidy eligibility?', answer: 'No. Project scope and any scheme or subsidy eligibility need separate review against the applicable programme and site requirements. A service enquiry does not establish approval or entitlement.' },
      { question: 'What is required to size a solar water pumping system?', answer: 'Provide the water source, required daily volume, pumping head, storage capacity, pipe dimensions, site layout and existing pump details. Available grid power and intended operating hours are also useful.' }
    ]
  }
];

/** Overview sections remain visible on the main pages, with real service links. */
export const searchPageContent = {
  home: {
    eyebrow: 'Engineering from Bhopal',
    title: 'Water infrastructure. Connected engineering.',
    paragraphs: [
      'Orbit Engineering is the main company, with Orbit Engineering Solutions as its child company. Based in Bhopal, Madhya Pradesh, our engineering work covers water treatment, wastewater systems, flow measurement, industrial automation, SCADA telemetry, field commissioning and maintenance.',
      'Explore a service below to see the engineering scope, relevant catalogue equipment, published project examples and the details needed for an enquiry.'
    ],
    hindiSummary: 'भोपाल स्थित Orbit Engineering मध्य प्रदेश की जल परियोजनाओं और औद्योगिक प्रणालियों के लिए जल शोधन, एसटीपी, ईटीपी, आरओ, फ्लो मीटर तथा पीएलसी/स्काडा ऑटोमेशन सेवाएँ प्रदान करती है। नई परियोजना, उपकरण चयन, स्थापना या रखरखाव पर चर्चा के लिए अपनी साइट का स्थान, आवश्यक क्षमता और उपलब्ध ड्रॉइंग हमारे साथ साझा करें।',
    guideLink: { path: '/guides/choosing-water-treatment-automation-partner-bhopal', label: 'How to choose a water treatment & automation partner' },
    faqs: [
      { question: 'What does Orbit Engineering do?', answer: 'Orbit Engineering provides water treatment and wastewater engineering, flow metering, instrumentation, PLC / SCADA automation, telemetry, installation, commissioning, maintenance and solar water solutions.' },
      { question: 'Where is Orbit Engineering located?', answer: 'Orbit Engineering is based in Bhopal, Madhya Pradesh, India. The office address is Ground Floor, B-32/A Priyadarshini Colony, Sant Asharam Nagar Phase-1, Bagsewaniya, Bhopal, Madhya Pradesh 462043.' },
      { question: 'How are Orbit Engineering and Orbit Engineering Solutions related?', answer: 'Orbit Engineering is the main company. Orbit Engineering Solutions is its child company.' },
      { question: 'Does Orbit Engineering work outside Madhya Pradesh?', answer: 'Orbit’s published service scope covers projects across India. The portfolio includes water and industrial applications in Madhya Pradesh, Chhattisgarh and Odisha. The listed office and project enquiry contact are in Bhopal.' }
    ]
  },
  solutions: {
    eyebrow: 'Explore the engineering scope',
    title: 'Find the solution for your water or industrial project.',
    paragraphs: [
      'A complete water project connects treatment processes, civil and electro-mechanical installation, measurement, control and ongoing maintenance. Orbit Engineering brings these services together from its Bhopal office.',
      'The portfolio includes Bhopal WTP automation, Mandideep RO automation, municipal projects in Katni, Satna and Betul, and distributed water supply automation in Madhya Pradesh. Each service guide explains its scope and the inputs needed to plan the work.'
    ],
    guideLink: { path: '/guides/choosing-water-treatment-automation-partner-bhopal', label: 'Read the guide to selecting your engineering partner' },
    faqs: [
      { question: 'Can supply, installation and automation be scoped together?', answer: 'Yes. Orbit lists engineering, equipment supply, installation, testing, commissioning and automation within its services. The proposal should define the responsibilities and deliverables for the specific project.' },
      { question: 'What should I send with a new project enquiry?', answer: 'Share the site location, application, capacity, available drawings, equipment details and requested scope. Existing sites can also include operating issues and current control-system information.' }
    ]
  },
  products: {
    eyebrow: 'Equipment with an application',
    title: 'Specify the measurement, treatment and control you need.',
    paragraphs: [
      'The Orbit catalogue covers flow meters, water treatment systems, water quality analyzers, pressure and level instruments, valves, actuators, PLC panels, RTUs, telemetry, electrical equipment and solar systems.',
      'For a product enquiry, share the application, process conditions, dimensions, required output and installation location. Product documentation and compatibility should be checked against the equipment selected for the project.'
    ],
    faqs: [
      { question: 'How can I choose the correct instrument or control product?', answer: 'Provide the application, process fluid, operating range, pipe or tank dimensions, power supply and required output. Orbit’s team can review the equipment scope against the catalogue and project requirements.' },
      { question: 'Can products be supplied with installation and commissioning?', answer: 'Installation, testing and commissioning are part of Orbit’s service scope. Include these requirements with the equipment enquiry so the proposal defines both the product package and the field work.' }
    ]
  },
  ecosystem: {
    eyebrow: 'Projects & technology',
    title: 'The context behind our client and technology ecosystem.',
    paragraphs: [
      'Our ecosystem connects public water infrastructure, industrial process applications and the equipment used to build integrated systems. Explore the client and technology entries above, then use the service guides to understand the engineering behind each application.'
    ],
    examples: [
      { title: 'Bhopal Municipal Corporation', text: 'The portfolio lists municipal WTP automation at Idgah Hills, Bhopal.' },
      { title: 'MP Jal Nigam Maryadit', text: 'Published water scheme scopes include automation, telemetry and flow management in Madhya Pradesh.' },
      { title: 'Lupin Pharmaceuticals Ltd', text: 'The Mandideep project describes RO pure water and CIP automation.' },
      { title: 'Prism Cement Limited', text: 'The Satna project describes industrial humidity and temperature control.' }
    ],
    technologyNote: 'Technology entries include Siemens for PLC and SCADA platforms, ProMinent for dosing and disinfection, Regada Actuators for electric valve actuation, and Nivelco for level measurement. Equipment choices are reviewed against the required project specification.',
    faqs: [
      { question: 'What do the client entries describe?', answer: 'Client entries identify the organisations and application scopes listed in Orbit’s ecosystem. Published project examples provide additional context for water treatment, metering and industrial automation work.' },
      { question: 'How are technology brands selected for a project?', answer: 'Equipment selection considers the application, required specification, existing system, interfaces and relevant product documentation. Discuss the required make or approved specification with the Orbit team.' }
    ]
  }
};
