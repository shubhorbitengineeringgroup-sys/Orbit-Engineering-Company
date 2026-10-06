/** Visible procurement guidance. Metadata can reuse the title and description. */
export const procurementGuide = {
  id: 'choosing-water-treatment-automation-partner-bhopal',
  path: '/guides/choosing-water-treatment-automation-partner-bhopal',
  title: 'Choosing a Water Treatment & Automation Partner in Bhopal',
  shortTitle: 'Water & automation procurement guide',
  description: 'Compare water treatment and PLC/SCADA proposals in Bhopal with a practical checklist for scope, operating costs, testing, data ownership and maintenance.',
  intro: 'A useful quotation starts with a clear requirement. For a water treatment plant or PLC/SCADA upgrade in Bhopal and Madhya Pradesh, compare what each supplier will deliver, how the system will be tested and who will support it. Use the same project brief when requesting proposals.',
  sections: [
    {
      id: 'define-the-scope',
      title: '1. Define the water process and scope',
      paragraphs: [
        'Share the site location, required capacity, source-water or effluent analysis, intended use and existing drawings. Drinking water, sewage, industrial effluent and RO feed water need different treatment decisions. Ask for design assumptions and a clear division of civil, mechanical, electrical, instrumentation and automation work.',
        'Record exclusions, site preparation, utility requirements and responsibility for approvals. Agree the required output and the conditions under which it will be tested; no generic process description establishes compliance for every site.'
      ]
    },
    {
      id: 'compare-operating-costs',
      title: '2. Compare the operating cost',
      paragraphs: [
        'Compare proposals over the same operating period and duty cycle. Request estimates for electricity, chemicals, membranes, calibration, software licences, connectivity, staffing and maintenance. Check whether installation, training, taxes and commissioning are included. Ask which assumptions could change the estimate: water quality, flow, pumping head and operating hours can materially affect costs.'
      ]
    },
    {
      id: 'select-instruments-and-controls',
      title: '3. Match instruments and controllers to the application',
      paragraphs: [
        'Ask how each instrument fits the fluid, range, pipe arrangement and site environment. Confirm signal interfaces, calibration access, power supply, spares and manufacturer documentation. For PLC, HMI and SCADA systems, define the input/output list, control sequences, alarms and existing equipment interfaces. Specify local pump protection and expected behaviour during power or communication loss.'
      ]
    },
    {
      id: 'agree-data-and-access',
      title: '4. Agree data ownership and access',
      paragraphs: [
        'Before ordering, agree who owns operating data, configuration files and the application program. Specify exports, backups, retention, access roles and remote support permissions. Confirm which licences, passwords, source files and recovery instructions are handed over. Ask whether another competent service provider can maintain the system and which vendor dependencies will remain.'
      ]
    },
    {
      id: 'define-acceptance-tests',
      title: '5. Write the acceptance tests before commissioning',
      paragraphs: [
        'Agree a factory acceptance test (FAT) for panel wiring, simulated signals, logic and alarms, then a site acceptance test (SAT) for installed equipment and real operating conditions. Define test methods, witness responsibilities, pass criteria and records. Include sensor checks, interlocks, communication recovery and performance trials. Resolve outstanding items against a written commissioning and acceptance plan.'
      ]
    },
    {
      id: 'plan-maintenance-and-handover',
      title: '6. Plan maintenance and handover',
      paragraphs: [
        'Clarify warranty boundaries, preventive maintenance, consumables, spare availability and response arrangements. An annual maintenance contract should describe included visits, remote support and chargeable work. Identify the operator training, safety procedures and routine checks needed before handover. Request a documented record of comparable projects and verify the proposed team’s actual role.'
      ]
    }
  ],
  comparison: [
    { application: 'New treatment plant', requirements: 'Water analysis, capacity, output requirements and available space.', question: 'What process assumptions and scope exclusions are in the proposal?' },
    { application: 'Existing plant upgrade', requirements: 'Drawings, equipment condition, current problems and shutdown windows.', question: 'What can be retained, and how will installation affect operations?' },
    { application: 'Remote water network', requirements: 'Site locations, power, coverage, reporting intervals and local controls.', question: 'How does each station operate and recover when communication fails?' },
    { application: 'Instrumentation package', requirements: 'Fluid, measuring range, installation, signals and maintenance access.', question: 'How will selection, calibration and commissioning be documented?' }
  ],
  handoverChecklist: [
    'Approved drawings, equipment schedule and operating manuals',
    'Test records, calibration documents and outstanding-item closure',
    'Program/configuration backups, licences and recovery instructions',
    'Operator training, maintenance schedule and agreed spare list'
  ],
  relatedLinks: [
    { path: '/solutions/water-treatment-bhopal', label: 'Water treatment engineering' },
    { path: '/solutions/scada-plc-automation-bhopal', label: 'SCADA, PLC & telemetry' },
    { path: '/solutions/operation-maintenance-amc', label: 'Operation & maintenance' },
    { path: '/products/flow-meters', label: 'Flow measurement equipment' },
    { path: '/products/automation', label: 'Automation equipment' }
  ],
  closing: 'Bring your project brief, drawings and available operating data to Orbit Engineering’s Bhopal team. We can discuss the required engineering or equipment scope and identify the information needed for a proposal.'
};
