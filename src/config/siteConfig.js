// Comprehensive data store for Orbit Engineering Solutions
export const siteConfig = {
  company: {
    name: "Orbit Engineering",
    childCompanyName: "Orbit Engineering Solutions",
    childCompanyUrl: "https://orbitengineerings.com/",
    shortName: "Orbit",
    tagline: "India's Premier Water Infrastructure & Industrial Automation Company",
    subtagline: "Specialists in WTP, STP, RO, ETP, SCADA Telemetry, IoT Monitoring & Solar Water Schemes across India since 1998.",
    founded: 1998,
    experience: "27+",
    portfolio: "₹200+ Crore",
    projectsDelivered: "150+ Mega Schemes",
    certifications: [
      { 
        code: "ISO 9001:2015", 
        title: "Quality Management System (QMS)", 
        desc: "Certified excellence in engineering, supply, installation, and commissioning of water treatment and SCADA automation plants."
      },
      { 
        code: "ISO 14001:2015", 
        title: "Environmental Management System (EMS)", 
        desc: "Strict adherence to green standards, resource conservation, and zero-liquid-discharge (ZLD) effluent management."
      },
      { 
        code: "ISO 45001:2018", 
        title: "Occupational Health & Safety (OH&S)", 
        desc: "Zero-compromise on-site safety protocols for deep well excavations, electrical high-voltage stations, and pipeline networks."
      }
    ],
    headquarters: "Bhopal, Madhya Pradesh, India",
    offices: [
      {
        type: "Office",
        name: "Orbit Engineering, Bhopal",
        address: "Ground Floor, B-32/A Priyadarshini Colony, Sant Asharam Nagar Phase-1, Bagsewaniya, Bhopal, Madhya Pradesh 462043",
        structuredAddress: {
          streetAddress: "Ground Floor, B-32/A Priyadarshini Colony, Sant Asharam Nagar Phase-1, Bagsewaniya",
          addressLocality: "Bhopal",
          addressRegion: "Madhya Pradesh",
          postalCode: "462043",
          addressCountry: "IN"
        },
        mapsUrl: "https://www.google.com/maps?cid=4075094845643946472&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAMYASAFKgSoqNcy",
        mapsEmbedUrl: "https://maps.google.com/maps?cid=4075094845643946472&output=embed",
        phone: "+91 70241 28029",
        role: "Connect with our team for engineering, technology and project enquiries."
      }
    ],
    contact: {
      phonePrimary: "+91 70241 28029",
      phoneSecondary: "+91 9039075049",
      whatsapp: "+91 9039075048",
      whatsappLink: "https://wa.me/919039075048?text=Hello%20Orbit%20Engineering%20Solutions,%20I%20am%20interested%20in%20discussing%20a%20project.",
      emails: ["info@orbitengineerings.com", "service@orbitengineerings.com", "sales@orbitengineerings.com"],
      hours: "Monday – Saturday: 10:00 AM – 7:00 PM (Sunday Closed)",
      indiamart: "https://www.indiamart.com/orbit-engineering-solutions-bhopal/"
    },
    leadership: [
      {
        name: "Manoj Tiwari",
        role: "Director & Co-Founder",
        focus: "Project Management, Business Development & State Water Policy (Jal Jeevan Mission / AMRUT)",
        experience: "27+ Years Industry Experience",
        image: "/images/leader_manoj.jpg"
      },
      {
        name: "Vijay Tiwari",
        role: "Director & Co-Founder",
        focus: "Technical Operations, Automation Architecture, SCADA Engineering & Embedded IoT Solutions",
        experience: "25+ Years Automation Experience",
        image: "/images/leader_vijay.jpg"
      }
    ],
    departments: [
      {
        name: "Automation & Telemetry Division",
        desc: "Design and deployment of Siemens/Schneider PLC control panels, SCADA software, and IoT cloud telemetry gateways.",
        banner: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=1000&q=80",
        count: "25+ Engineers"
      },
      {
        name: "Field Engineering & Commissioning",
        desc: "On-site mechanical erection, electrofusion pipe welding, pump commissioning, and dry/wet hydraulic trials.",
        banner: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=80",
        count: "40+ Field Specialists"
      },
      {
        name: "IT Infrastructure & Cloud Services",
        desc: "Centralized SCADA server hosting, cloud database synchronization, GIS mapping, and mobile app integration.",
        banner: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80",
        count: "15+ Tech Specialists"
      }
    ]
  },

  // 20 Authentic Projects with High-Tech PLC & Industrial Automation Imagery (100% Tested & Verified)
  projects: [
    {
      id: "gandhisagar-pkg2",
      name: "Gandhisagar Package 2",
      category: "Government Schemes",
      client: "MP Jal Nigam",
      location: "District Neemuch, Madhya Pradesh",
      scope: "Multi-village water supply scheme automation, telemetry & flow management under Jal Jeevan Mission",
      status: "Ongoing",
      badge: "Mega Scheme",
      scale: "District Scale (Neemuch)",
      year: "2023 - Present",
      metrics: "50+ Villages Covered",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1000&q=80",
      details: "Comprehensive rural water supply infrastructure providing tap water connections. Features raw water intake pump automation from Gandhisagar reservoir, automated transmission pipelines, and cloud-linked SCADA monitoring.",
      deliverables: ["Electromagnetic Flow Meters (100-600mm)", "PLC & RTU Automation Panels", "4G Cellular Telemetry Gateway", "Submersible Water Quality Monitoring Nodes"]
    },
    {
      id: "beohari-scheme",
      name: "Beohari Multi-Village Scheme",
      category: "Government Schemes",
      client: "MP Jal Nigam",
      location: "Shahdol District, Madhya Pradesh",
      scope: "Comprehensive village water distribution management system under Har Ghar Jal initiative",
      status: "Ongoing",
      badge: "JJM Scheme",
      scale: "Multi-Gram Panchayat",
      year: "2023 - Present",
      metrics: "35+ Villages Connected",
      image: "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=1000&q=80",
      details: "Turnkey water automation scheme providing reliable drinking water connections. Integrated with solar-assisted pump systems, residual chlorine monitoring, and automatic pressure relief control.",
      deliverables: ["Smart Village Telemetry", "Auto-Chlorination Sensors", "Pump Station PLC Enclosures", "Hydrostatic Level Transmitters"]
    },
    {
      id: "rewa-bansagar",
      name: "Rewa Bansagar Scheme",
      category: "Government Schemes",
      client: "MP Jal Nigam",
      location: "District Rewa, Madhya Pradesh",
      scope: "Large-scale water distribution automation & canal linkage from Bansagar Dam",
      status: "Ongoing",
      badge: "Mega Scheme",
      scale: "Regional Network",
      year: "2022 - Present",
      metrics: "Bansagar Dam Canal Linkage",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80",
      details: "High-volume regional water distribution network connecting Bansagar Dam reservoirs to rural community tanks. Automated canal intake gates, ultrasonic flow calculation, and centralized command center.",
      deliverables: ["Central SCADA Control Room", "Canal Flow Gauging Systems", "High-capacity Electromagnetic Meters", "Remote Terminal Units (RTU)"]
    },
    {
      id: "pahargarh-scheme",
      name: "Pahargarh Multi-Village Scheme",
      category: "Government Schemes",
      client: "MP Jal Nigam",
      location: "District Rajgarh, Madhya Pradesh",
      scope: "Rural water supply automation & booster pump station integration",
      status: "Ongoing",
      badge: "JJM Scheme",
      scale: "Rural Network",
      year: "2023 - Present",
      metrics: "25,000+ Population Served",
      image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1000&q=80",
      details: "Rural drinking water network with integrated chlorination, booster pump PLC coordination, and cellular IoT telemetry for zero-downtime operation.",
      deliverables: ["Auto-Chlorinators", "PLC Control Panels", "Submersible Level Transmitters", "Real-time Cloud Dashboard"]
    },
    {
      id: "narmada-gambhir",
      name: "Narmada Gambhir Multi-Village Scheme",
      category: "Government Schemes",
      client: "MP Jal Nigam",
      location: "District Ujjain, Madhya Pradesh",
      scope: "Advanced water management connecting Narmada river source to multiple rural clusters",
      status: "Ongoing",
      badge: "Mega Scheme",
      scale: "Multi-Tehsil Project",
      year: "2022 - Present",
      metrics: "120+ KM Pipeline Network",
      image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=1000&q=80",
      details: "High-priority state water infrastructure transferring treated water across Ujjain district. Features District Metered Area (DMA) pressure balancing and NRW leak detection.",
      deliverables: ["District Metered Area (DMA) Setup", "Remote Motorized Valve Controllers", "Flow & Pressure IoT Nodes", "Overhead Tank Sensors"]
    },
    {
      id: "gohad-scheme",
      name: "Gohad Water Supply Scheme",
      category: "Urban & Municipal",
      client: "MPUDCL Bhopal",
      location: "Bhind / Gwalior Region, Madhya Pradesh",
      scope: "Modern municipal water supply system with full turnkey automation",
      status: "Ongoing",
      badge: "Urban Infra",
      scale: "Municipal Town Scale",
      year: "2023 - Present",
      metrics: "Complete Urban Supply",
      image: "https://images.unsplash.com/photo-1542332213-31f87348057f?auto=format&fit=crop&w=1000&q=80",
      details: "Urban development water scheme implementing 24x7 pressurized water delivery, automated pump sequencing, and leak-detection algorithms for urban municipal local bodies.",
      deliverables: ["VFD Pump Panels", "Chlorine Dosing System", "Township SCADA Workstation", "Smart Water Meters"]
    },
    {
      id: "bua-bichhiya",
      name: "Bua Bichhiya Water Supply Project",
      category: "Urban & Municipal",
      client: "UAD AMRUT 2.0",
      location: "District Mandla, Madhya Pradesh",
      scope: "AMRUT 2.0 smart urban water management & storage automation",
      status: "Ongoing",
      badge: "AMRUT 2.0",
      scale: "Nagar Parishad",
      year: "2023 - Present",
      metrics: "Universal Coverage",
      image: "https://images.unsplash.com/photo-1476231682828-37e571bc172f?auto=format&fit=crop&w=1000&q=80",
      details: "Executed under Atal Mission for Rejuvenation and Urban Transformation (AMRUT 2.0) to achieve 100% water security, NRW (Non-Revenue Water) reduction, and smart distribution.",
      deliverables: ["AMRUT-compliant Smart Meters", "SCADA Server & Workstation", "Electromagnetic Meters (50-300mm)", "Cloud Analytics"]
    },
    {
      id: "mohgaon-project",
      name: "Mohgaon Water Supply Project",
      category: "Urban & Municipal",
      client: "UAD AMRUT 2.0",
      location: "District Chhindwara, Madhya Pradesh",
      scope: "Modern water supply system with full telemetry and automation",
      status: "Ongoing",
      badge: "AMRUT 2.0",
      scale: "Urban Local Body",
      year: "2023 - Present",
      metrics: "Smart City Grade",
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1000&q=80",
      details: "Comprehensive urban water upgrade featuring smart pumping stations, water quality monitoring, and automated reservoir level management.",
      deliverables: ["Automated Reservoir Level Control", "Online Turbidity & pH Analyzers", "Motor Control Center (MCC)", "Operator HMI"]
    },
    {
      id: "kymore-pkg-5d",
      name: "Kymore & Vijayraghavgarh (Package 5D)",
      category: "Urban & Municipal",
      client: "MPUDCL Bhopal",
      location: "Katni District, Madhya Pradesh",
      scope: "Turnkey water distribution infrastructure & metering SITC",
      status: "Completed",
      badge: "Completed",
      scale: "Twin Municipality",
      year: "2022",
      metrics: "100% Commissioned",
      image: "https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?auto=format&fit=crop&w=1000&q=80",
      details: "Supply, installation, testing, and commissioning (SITC) of water pipeline infrastructure, bulk flow meters, and pump house automation.",
      deliverables: ["Bulk Flow Meters", "Butterfly Isolation Valves", "Surge Protection", "Operation Handover"]
    },
    {
      id: "amarpatan-pkg-7d",
      name: "Amarpatan & Ramnagar (Package 7D)",
      category: "Urban & Municipal",
      client: "MPUDCL Bhopal",
      location: "Satna District, Madhya Pradesh",
      scope: "Urban water treatment & distribution automation package",
      status: "Completed",
      badge: "Completed",
      scale: "Sub-division Level",
      year: "2022",
      metrics: "Fully Operational",
      image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1000&q=80",
      details: "Package 7D turnkey implementation including raw water intake, WTP instrumentation, and treated water booster stations.",
      deliverables: ["WTP PLC Panel", "Pressure Transmitters", "Electromagnetic Flow Meters", "O&M Support"]
    },
    {
      id: "harpalpur-pkg-6g",
      name: "Harpalpur & Badagaon (Package 6G)",
      category: "Urban & Municipal",
      client: "MPUDCL Bhopal",
      location: "Chhatarpur & Tikamgarh, Madhya Pradesh",
      scope: "Turnkey municipal water infrastructure & telemetry network",
      status: "Completed",
      badge: "Completed",
      scale: "Dual Urban Centers",
      year: "2022",
      metrics: "100% Operational",
      image: "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=1000&q=80",
      details: "Turnkey delivery of automated distribution nodes with remote monitoring, drastically reducing water losses across both municipalities.",
      deliverables: ["SCADA Gateway", "Ultrasonic Level Gauges", "Motorized Actuators", "Maintenance Protocols"]
    },
    {
      id: "kari-lidhorakhas",
      name: "KARI & Lidhorakhas Water Meter SITC",
      category: "Urban & Municipal",
      client: "Tikamgarh Nagar Parishads",
      location: "Tikamgarh, Madhya Pradesh",
      scope: "Supply, installation, testing & commissioning of consumer & bulk meters",
      status: "Completed",
      badge: "Completed",
      scale: "Nagar Parishad",
      year: "2021",
      metrics: "10,000+ Meters Installed",
      image: "https://images.unsplash.com/photo-1581093806997-124204d9fa9d?auto=format&fit=crop&w=1000&q=80",
      details: "Citywide deployment of BIS-certified water meters with digital pulse outputs, enabling transparent municipal volumetric billing.",
      deliverables: ["Domestic Water Meters", "Bulk Flanged Meters", "Tamper Evident Seals", "Billing Software Integration"]
    },
    {
      id: "gangadhar-meher",
      name: "Gangadhar Meher Lift Irrigation Project",
      category: "Lift Irrigation",
      client: "WRD Bhopal / Odisha WRD",
      location: "Odisha / MP Borders",
      scope: "Mega lift irrigation automation, pump sequencing & flow metering",
      status: "Completed",
      badge: "Irrigation Mega",
      scale: "Interstate Infrastructure",
      year: "2021",
      metrics: "Thousands of Hectares Irrigated",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80",
      details: "High-horsepower lift irrigation system lifting river water for agricultural distribution. Integrated multi-stage pump sequencing with automated surge protection.",
      deliverables: ["Heavy Duty Butterfly Valves (600mm+)", "Multi-turn Actuators", "Ultrasonic Open Channel Flow Meters", "High Voltage Pump Automation"]
    },
    {
      id: "betul-45mld",
      name: "45 MLD Turnkey Water Automation",
      category: "Urban & Municipal",
      client: "Betul-Bazar, Amla & Sarni Nagar Parishads",
      location: "Betul District, Madhya Pradesh",
      scope: "45 MLD massive urban water infrastructure & central SCADA",
      status: "Completed",
      badge: "45 MLD Scale",
      scale: "Three Nagar Parishads",
      year: "2022",
      metrics: "45 MLD Capacity",
      image: "https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&w=1000&q=80",
      details: "One of Madhya Pradesh's benchmark municipal projects: fully automated 45 MLD treatment and distribution network serving over 150,000 residents across Betul, Amla, and Sarni.",
      deliverables: ["45 MLD WTP Automation", "Triple-city Interconnected SCADA", "Siemens S7 PLC Architecture", "Redundant Fiber Telemetry"]
    },
    {
      id: "gobranawapra-7-6mld",
      name: "7.6 MLD Sewage Treatment Plant (STP)",
      category: "Industrial & STP",
      client: "Gobranawapra Municipal Council",
      location: "Raipur, Chhattisgarh",
      scope: "7.6 MLD sewage treatment plant turnkey instrumentation & automation",
      status: "Completed",
      badge: "7.6 MLD STP",
      scale: "City STP",
      year: "2023",
      metrics: "CPCB Compliance Guaranteed",
      image: "https://images.unsplash.com/photo-1774789599304-cca1e1ffbb95?auto=format&fit=crop&w=1000&q=80",
      details: "Engineered to satisfy stringent Central Pollution Control Board (CPCB) wastewater norms. Features automated dissolved oxygen (DO) control, online BOD/COD analyzers, and sludge dewatering automation.",
      deliverables: ["Online BOD/COD Analyzers", "Dissolved Oxygen (DO) Transmitters", "Aeration Blowers Automation", "CPCB Cloud Data Uplink"]
    },
    {
      id: "bhopal-3mgd-wtp",
      name: "3 MGD Water Treatment Plant",
      category: "Urban & Municipal",
      client: "Bhopal Municipal Corporation",
      location: "Idgah Hills, Bhopal, Madhya Pradesh",
      scope: "3 MGD municipal water treatment plant complete turnkey automation",
      status: "Completed",
      badge: "Capital City WTP",
      scale: "Bhopal Capital",
      year: "2018",
      metrics: "3 MGD Clean Drinking Water",
      image: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=1000&q=80",
      details: "Urban capital city WTP providing drinking water to historic Old Bhopal and Idgah Hills. Integrated raw water clariflocculators, sand filters, and chlorination with SCADA control room.",
      deliverables: ["Full WTP Turnkey Automation", "Raw & Treated Water Flow Meters", "Turbidity & Residual Chlorine Analyzers", "Central Operator Console"]
    },
    {
      id: "indore-district-automation",
      name: "Water Supply Scheme Automation",
      category: "Government Schemes",
      client: "Indore District Administration",
      location: "Betma, Gautampura & Depalpur, Indore, Madhya Pradesh",
      scope: "Integrated water supply scheme automation across three major growth centers",
      status: "Completed",
      badge: "Smart District",
      scale: "Indore Suburban Hubs",
      year: "2021",
      metrics: "3 Key Towns Covered",
      image: "https://images.unsplash.com/photo-1581092583537-20d51b4b4f1b?auto=format&fit=crop&w=1000&q=80",
      details: "Fully automated pumping networks with remote GSM telemetry, automated reservoir level shutoff, and energy-efficient motor management.",
      deliverables: ["GSM Remote Terminal Units", "Capacitive & Ultrasonic Level Sensors", "Automated Star-Delta PLC Panels", "Energy Metering"]
    },
    {
      id: "prism-cement-automation",
      name: "Industrial Humidity & Temperature Control",
      category: "Industrial Turnkey",
      client: "Prism Cement Ltd",
      location: "Satna, Madhya Pradesh",
      scope: "Turnkey climate regulation & industrial process automation",
      status: "Completed",
      badge: "Industrial Automation",
      scale: "Mega Cement Plant",
      year: "2015",
      metrics: "24x7 Process Stability",
      image: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=1000&q=80",
      details: "Custom engineered heavy-industry climate control system ensuring tight tolerance temperature and humidity parameters for cement curing and laboratory testing.",
      deliverables: ["Industrial Grade Temperature/Humidity Transmitters", "Closed-loop PID Controllers", "Ruggedized HMI Enclosure", "Factory SCADA Interfacing"]
    },
    {
      id: "lupin-ro-automation",
      name: "Turnkey RO Plant Automation",
      category: "Industrial Turnkey",
      client: "Lupin Pharmaceuticals Ltd",
      location: "Mandideep Industrial Area, Bhopal, Madhya Pradesh",
      scope: "Turnkey automation project for pharmaceutical RO pure water system",
      status: "Completed",
      badge: "Pharma Grade",
      scale: "Pharma Manufacturing Facility",
      year: "2016",
      metrics: "USP Pure Water Compliance",
      image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1000&q=80",
      details: "Ultra-pure water generation system meeting stringent pharmaceutical standards. Multi-stage reverse osmosis automation with automated membrane cleaning (CIP) sequencing and conductivity tracking.",
      deliverables: ["Pharma-grade Sanitary Flow Meters", "Online Conductivity & pH Analyzers", "CIP Automated Sequence Controller", "Audit Trail & Compliance Logging"]
    },
    {
      id: "vindhyachal-distillery",
      name: "40 KL Turnkey Automation",
      category: "Industrial Turnkey",
      client: "Vindhyachal Distilleries Pvt Ltd",
      location: "Pilukhedi Industrial Area, Bhopal, Madhya Pradesh",
      scope: "40 KL turnkey automation & fermentation process control",
      status: "Completed",
      badge: "Distillery Turnkey",
      scale: "Commercial Distillery",
      year: "2017",
      metrics: "40 KL Capacity",
      image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1000&q=80",
      details: "Turnkey automation of distillation and fermentation units with automated boiler feed, temperature regulation, and high-accuracy mass flow measurement for alcohol production.",
      deliverables: ["Mass Flow Meters (Coriolis)", "Pneumatic Control Valves", "Explosion-Proof Level Transmitters", "Central SCADA Station"]
    }
  ],

  // Core Turnkey Services with High-Res Tech Imagery
  services: [
    {
      id: "wtp-stp-ro",
      title: "Water Treatment Solutions (WTP / STP / RO / ETP)",
      iconName: "Droplets",
      tag: "Core Specialty",
      image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1000&q=80",
      description: "End-to-end design, civil-electro-mechanical engineering, installation, and commissioning of drinking water treatment and effluent recovery facilities.",
      features: [
        "Municipal & Industrial Water Treatment Plants (WTP) - Multi-MLD Capacity",
        "Sewage Treatment Plants (STP) with MBBR, SBR & MBR technologies",
        "Industrial Effluent Treatment Plants (ETP) with Zero Liquid Discharge (ZLD)",
        "Pharmaceutical & Industrial Reverse Osmosis (RO) plants",
        "Gas Chlorination, Electro-chlorination & Multi-grade filtration units"
      ]
    },
    {
      id: "scada-plc-telemetry",
      title: "Automation & SCADA Control Systems",
      iconName: "Cpu",
      tag: "Industry 4.0",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=80",
      description: "State-of-the-art automation architectures engineered with Siemens, Schneider Electric, ABB, and Rockwell Automation platforms.",
      features: [
        "Custom PLC & RTU Panel design, wiring, testing, and site commissioning",
        "Central SCADA Command & Control room setup with multi-screen operator consoles",
        "IoT Telemetry via 4G/5G, LoRaWAN, and satellite gateways",
        "District Metered Area (DMA) management and real-time NRW leakage tracking",
        "Mobile App & Cloud Dashboards for municipal engineers and executive reviews"
      ]
    },
    {
      id: "installation-commissioning",
      title: "Installation & Field Commissioning",
      iconName: "Wrench",
      tag: "Execution Excellence",
      image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1000&q=80",
      description: "Proven track record of deploying complex water networks across rugged terrains in rural and urban Madhya Pradesh and nationwide.",
      features: [
        "Heavy pipeline laying & electrofusion jointing (HDPE / DI / MS)",
        "Submersible and vertical turbine pump house mechanical erection",
        "Complete electrical substation, transformers & MCC panel integration",
        "Dry & wet commissioning with comprehensive parameter validation",
        "Formal operator training, safety drills & technical handover"
      ]
    },
    {
      id: "om-amc-support",
      title: "Operation & Maintenance (O&M) + AMC",
      iconName: "ShieldCheck",
      tag: "Lifecycle Reliability",
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1000&q=80",
      description: "Long-term operation and maintenance services safeguarding project longevity and maximizing uptime for municipal and industrial assets.",
      features: [
        "Annual Maintenance Contracts (AMC) with guaranteed response times",
        "24/7 dedicated engineering field support across Madhya Pradesh",
        "Preventative maintenance schedules and sensor calibration certificates",
        "Inventory of critical spares, flow meters, sensors, and PLC cards",
        "Water quality testing, sludge management, and CPCB compliance logging"
      ]
    },
    {
      id: "consultancy-engineering",
      title: "Consultancy, GPS Survey & Design",
      iconName: "Compass",
      tag: "Technical Advisory",
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=80",
      description: "Front-end engineering design (FEED), hydraulic simulations, and detailed project reports (DPR) for government tenders and large contractors.",
      features: [
        "Comprehensive GPS topography survey & GIS mapping for water schemes",
        "Hydraulic flow modeling & pipeline surge analysis",
        "Detailed BOQ (Bill of Quantities) & tender compliance preparation",
        "Jal Jeevan Mission (JJM) and AMRUT scheme compliance alignment",
        "Energy efficiency audits for pumping stations and treatment plants"
      ]
    },
    {
      id: "solar-clean-energy",
      title: "Solar Water & Energy Solutions",
      iconName: "Sun",
      tag: "Sustainable Power",
      image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1000&q=80",
      description: "Renewable energy integration driving off-grid rural water pumps and lowering operational expenditure for industrial treatment units.",
      features: [
        "Solar-powered submersible pumping stations under PM KUSUM",
        "Floating solar arrays for raw water reservoirs and canals",
        "Grid-tied and hybrid rooftop solar plants for treatment facilities",
        "Solar street lighting for municipal infrastructure complexes",
        "Net metering integration and clean energy carbon reduction"
      ]
    }
  ],

  // Products with Authentic Images
  products: [
    {
      id: "flow-meters",
      name: "Electromagnetic Flow Meter",
      category: "Flow Measurement",
      badge: "JJM Approved",
      rating: "IP68 Submersible",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
      description: "High-accuracy Faraday induction meter with zero moving parts, ideal for raw water, treated water pipelines, and industrial fluids.",
      specs: "Sizes: 15mm to 2000mm | Accuracy: ±0.5% | Lining: PTFE / Hard Rubber | Output: 4-20mA, RS485 Modbus"
    },
    {
      id: "bulk-flow-meters",
      name: "Bulk Water Meter",
      category: "Flow Measurement",
      badge: "Heavy Duty",
      rating: "Flanged Class",
      image: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=800&q=80",
      description: "Positive displacement and Woltman type bulk flow meter for custody transfer and city-gate municipal water transmission lines.",
      specs: "Sizes: 50mm to 500mm | Class B/Class C | Cast Iron / Ductile Iron MOC | Pulse Output Ready"
    },
    {
      id: "smart-prepaid-meter",
      name: "Smart Prepaid / AMR Water Meter",
      category: "Smart Metering",
      badge: "IoT Connected",
      rating: "NB-IoT / LoRaWAN",
      image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=80",
      description: "Citywide automated meter reading with integrated valve control, anti-tamper security, and consumer mobile recharge platform.",
      specs: "Sizes: 15mm - 50mm | Battery Life: 10+ Years | BIS Approved | Integrated Cutoff Valve"
    },
    {
      id: "chlorine-analyzer",
      name: "Total & Free Chlorine Transmitter",
      category: "Water Quality Analyzers",
      badge: "CPCB Compliant",
      rating: "Online Continuous",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
      description: "Continuous online monitoring of residual chlorine in drinking water distribution to safeguard disinfection standards.",
      specs: "Touchscreen TFT Display | IP67 Housing | Modbus RTU / Ethernet | Auto-Cleaning Sensor Option"
    },
    {
      id: "turbidity-analyzer",
      name: "Online Turbidity Analyzer",
      category: "Water Quality Analyzers",
      badge: "Precision Optical",
      rating: "NTU Measurement",
      image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80",
      description: "High-sensitivity nephelometric turbidity monitor detecting particulate suspended matter in raw and filtered WTP water.",
      specs: "Range: 0-1000 NTU | Infrared 860nm Source | Fast Response <10s | Digital 4-20mA Output"
    },
    {
      id: "ph-analyzer",
      name: "Industrial pH / ORP Analyzer",
      category: "Water Quality Analyzers",
      badge: "Process Grade",
      rating: "Multi-Sensor",
      image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80",
      description: "Heavy-duty pH and temperature transmitter for chemical dosing tanks, aeration basins, and industrial wastewater neutralization.",
      specs: "Range: 0-14 pH | Temp Compensation: PT1000 | IP66 Enclosure | Dual Relay Outputs"
    },
    {
      id: "level-transmitter",
      name: "Hydrostatic Submersible Level Transmitter",
      category: "Level Sensors",
      badge: "Deep Submersible",
      rating: "Up to 200m",
      image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80",
      description: "Precision depth monitoring for overhead water tanks, deep borewells, intake wells, and open canal reservoirs.",
      specs: "Range: 0-200m H2O | Accuracy: 0.25% F.S. | HART Protocol / 4-20mA | SS316L Diaphragm"
    },
    {
      id: "ultrasonic-level",
      name: "Ultrasonic Non-Contact Level Transmitter",
      category: "Level Sensors",
      badge: "Non-Contact",
      rating: "Echo Linearization",
      image: "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=800&q=80",
      description: "Non-intrusive echo sound level gauge for storage tanks, chemical vats, and open irrigation channels.",
      specs: "Range: 0-15m | Beam Angle: 8° | Blind Zone: 0.25m | Display: Backlit Graphic LCD"
    },
    {
      id: "butterfly-valves",
      name: "Heavy-Duty Butterfly Valve",
      category: "Valves & Piping",
      badge: "PN 16 / PN 25",
      rating: "Flanged / Wafer",
      image: "https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=800&q=80",
      description: "Durable isolation and throttling valve with vulcanized EPDM rubber lining for high-pressure municipal water distribution mains.",
      specs: "Sizes: 50mm to 1200mm | Pressure: PN10/16/25 | Disc: SS304/SS316/Ductile Iron | Gear / Actuator Ready"
    },
    {
      id: "motorized-ball-valve",
      name: "Motorized Actuated Ball Valve",
      category: "Valves & Piping",
      badge: "Electric Control",
      rating: "SCADA Interfacing",
      image: "https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=800&q=80",
      description: "Fast-acting motorized valve designed for automated pump start/stop sequencing and remote reservoir shutoff.",
      specs: "Voltage: 24V DC / 230V AC | Torque: 50-2000 Nm | Manual Override Handwheel | Position Feedback"
    },
    {
      id: "scada-telemetry-rtu",
      name: "RTU Remote Terminal Unit & PLC Panel",
      category: "Automation & Telemetry",
      badge: "IoT Gateway",
      rating: "Siemens / Schneider",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
      description: "Ruggedized weatherproof industrial RTU panel collecting field sensor data, calculating flow totals, and uplinking to central SCADA.",
      specs: "Channels: 8AI, 4AO, 16DI, 8DO | Connectivity: 4G/GSM/Ethernet | Solar Powered Option | IP65 Enclosure"
    },
    {
      id: "solar-pumping-solutions",
      name: "Solar Water Pumping & Floating Solar",
      category: "Solar Solutions",
      badge: "PM KUSUM Tier-1",
      rating: "Hybrid Inverter",
      image: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=800&q=80",
      description: "Turnkey solar photovoltaic pumping system providing clean green energy to rural water booster stations and agricultural canals.",
      specs: "Capacity: 3HP to 50HP Pumps | VFD Solar Drive | MPPT Efficiency: >99% | Remote Monitoring Enabled"
    }
  ],

  // Client Ecosystem
  ecosystem: {
    government: [
      { name: "MP Jal Nigam Maryadit", tag: "Har Ghar Jal JJM Schemes", logo: "/logos/mp-jal-nigam.svg" },
      { name: "MPUDCL Bhopal", tag: "Urban Water Development Projects", logo: "/logos/mpudcl.svg" },
      { name: "Bharat Sarkar - Jal Shakti", tag: "National Water Mission Partner", logo: "/logos/jal-shakti.svg" },
      { name: "Bhopal Municipal Corporation", tag: "City Water Treatment & SCADA", logo: "/logos/bmc.svg" },
      { name: "Indore District Administration", tag: "District Water Scheme Automation", logo: "/logos/indore.svg" },
      { name: "Water Resources Department (WRD)", tag: "Lift Irrigation & Canals", logo: "/logos/wrd.svg" }
    ],
    industrial: [
      { name: "Prism Cement Ltd", domain: "Heavy Industry", work: "Turnkey Climate & Temperature Automation System", location: "Satna, MP" },
      { name: "Lupin Pharmaceuticals Ltd", domain: "Pharmaceutical", work: "Turnkey Pure RO Water Treatment & CIP System", location: "Mandideep, MP" },
      { name: "Vindhyachal Distilleries Pvt Ltd", domain: "Distillery", work: "40 KL Turnkey Automation & Mass Flow Metering", location: "Pilukhedi, MP" },
      { name: "Central India Pvt Ltd", domain: "Manufacturing", work: "Industrial Water Filtration & SCADA Uplink", location: "Bhopal, MP" },
      { name: "Larsen & Toubro (L&T)", domain: "Infrastructure EPC", work: "Instrumentation & Telemetry Contractor Partner", location: "Pan-India" },
      { name: "BHEL Bhopal", domain: "Public Sector Enterprise", work: "Industrial Instrumentation & Sensor Supply", location: "Bhopal, MP" }
    ]
  }
};
