import type { DomainNode } from './types';

// Nigerian Languages sits at the hub (world origin) as Towera's actual
// beachhead today; every other domain is arranged on a Fibonacci/golden-angle
// unit sphere shell around it, purely for even 3D spacing (not geography) so
// orbiting the camera reveals a distinct silhouette from every angle. Every
// non-hub domain is `status: 'planned'` with no fabricated metrics, per the
// product's own roadmap framing.
export const DOMAIN_NODES: DomainNode[] = [
  {
    id: 'nigerian-languages',
    name: 'Nigerian Languages',
    category: 'Language & Speech',
    icon: 'ri-translate-2',
    color: 'oklch(0.72 0.18 85)',
    description:
      'Structured datasets covering Nigerian languages, including text, speech, translations and linguistic metadata.',
    position: { x: 0, y: 0, z: 0 },
    status: 'active',
    metrics: { languages: '560+', records: '1.2M+', audioHours: '320K+', qualityScore: '98%' },
    dataTypes: ['Text', 'Speech', 'Audio', 'Translation'],
    license: 'Towera Data License',
    actions: [
      { label: 'Explore Dataset', href: '/studio' },
      { label: 'API Documentation', href: '/api' },
    ],
    connections: ['education', 'healthcare', 'culture-media', 'governance', 'agriculture'],
    applications: [
      { icon: 'ri-mic-line', label: 'Voice Assistants', description: 'Speech recognition and synthesis in Yoruba, Igbo, Hausa and more.' },
      { icon: 'ri-translate', label: 'Machine Translation', description: 'Translation models across Nigerian language pairs and English.' },
      { icon: 'ri-message-3-line', label: 'Conversational Chatbots', description: 'Customer support and civic chatbots that respond in local languages.' },
      { icon: 'ri-volume-up-line', label: 'Speech-to-Text & TTS', description: 'Transcription and natural-sounding speech generation for local languages.' },
      { icon: 'ri-shield-check-line', label: 'Content Moderation', description: 'Detecting harmful or unsafe content written in Nigerian languages.' },
      { icon: 'ri-book-open-line', label: 'Educational Language Tools', description: 'Literacy apps and tutoring aids built on structured language data.' },
    ],
  },
  {
    id: 'agriculture',
    name: 'Agriculture',
    category: 'Agriculture',
    icon: 'ri-plant-line',
    color: 'oklch(0.72 0.16 140)',
    description:
      "Crop yields, soil conditions, market prices, and farming practices across Nigeria's agricultural regions.",
    position: { x: -0.488, y: 0.75, z: 0.447 },
    status: 'planned',
    metrics: null,
    dataTypes: ['Crop Yields', 'Soil Data', 'Market Prices', 'Imagery'],
    license: null,
    actions: [],
    connections: ['nigerian-languages', 'finance', 'geospatial', 'environment', 'commerce'],
    applications: [
      { icon: 'ri-seedling-line', label: 'Crop Yield Prediction', description: 'Forecasting harvest output from soil, weather and planting data.' },
      { icon: 'ri-sun-line', label: 'Precision Farming Advisories', description: 'Localized planting and irrigation guidance for smallholder farmers.' },
      { icon: 'ri-line-chart-line', label: 'Market Price Forecasting', description: 'Predicting crop and produce prices across regional markets.' },
      { icon: 'ri-bug-line', label: 'Pest & Disease Detection', description: 'Identifying crop pests and disease from field imagery.' },
      { icon: 'ri-drop-line', label: 'Soil Health Monitoring', description: 'Tracking soil moisture and nutrient conditions over time.' },
      { icon: 'ri-truck-line', label: 'Supply Chain Optimization', description: 'Routing produce from farms to markets more efficiently.' },
    ],
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    category: 'Healthcare',
    icon: 'ri-heart-pulse-line',
    color: 'oklch(0.70 0.19 20)',
    description:
      'Clinical terminology, patient-facing language, and health-system data structured for AI applications in Nigerian healthcare.',
    position: { x: 0.076, y: 0.5, z: -0.863 },
    status: 'planned',
    metrics: null,
    dataTypes: ['Clinical Text', 'Patient Records', 'Terminology'],
    license: null,
    actions: [],
    connections: ['nigerian-languages'],
    applications: [
      { icon: 'ri-file-text-line', label: 'Clinical Documentation', description: 'Structuring clinical notes and records for downstream analysis.' },
      { icon: 'ri-stethoscope-line', label: 'Symptom Triage Chatbots', description: 'Guiding patients toward the right level of care in their language.' },
      { icon: 'ri-translate-2', label: 'Medical Translation', description: 'Bridging the language gap between patients and providers.' },
      { icon: 'ri-radar-line', label: 'Public Health Surveillance', description: 'Tracking disease trends from health-system data.' },
      { icon: 'ri-capsule-line', label: 'Drug Information Lookup', description: 'Localized, plain-language medication guidance tools.' },
      { icon: 'ri-vidicon-line', label: 'Telemedicine Support', description: 'Language and terminology support for remote consultations.' },
    ],
  },
  {
    id: 'finance',
    name: 'Finance',
    category: 'Finance',
    icon: 'ri-line-chart-line',
    color: 'oklch(0.72 0.15 230)',
    description:
      'Transaction patterns, credit signals, and financial services data reflecting how Nigerians save, spend, and borrow.',
    position: { x: 0.589, y: 0.25, z: 0.768 },
    status: 'planned',
    metrics: null,
    dataTypes: ['Transactions', 'Credit Signals', 'Market Data'],
    license: null,
    actions: [],
    connections: ['agriculture', 'commerce'],
    applications: [
      { icon: 'ri-scales-3-line', label: 'Credit Scoring Models', description: 'Assessing creditworthiness from alternative financial signals.' },
      { icon: 'ri-shield-flash-line', label: 'Fraud Detection', description: 'Flagging anomalous transaction patterns in real time.' },
      { icon: 'ri-customer-service-2-line', label: 'Conversational Banking', description: 'Local-language assistants for savings, transfers and support.' },
      { icon: 'ri-bar-chart-grouped-line', label: 'Financial Inclusion Analytics', description: 'Understanding how underbanked populations save and spend.' },
      { icon: 'ri-hand-coin-line', label: 'Micro-lending Risk Models', description: 'Risk assessment tuned for small, informal-sector borrowers.' },
      { icon: 'ri-line-chart-line', label: 'Market Signal Analysis', description: 'Reading trading and market behavior from transaction data.' },
    ],
  },
  {
    id: 'education',
    name: 'Education',
    category: 'Education',
    icon: 'ri-graduation-cap-line',
    color: 'oklch(0.72 0.15 290)',
    description:
      "Curriculum content, learning assessments, and educational outcomes data across Nigeria's schools and universities.",
    position: { x: -0.985, y: 0, z: -0.174 },
    status: 'planned',
    metrics: null,
    dataTypes: ['Curriculum', 'Assessments', 'Outcomes'],
    license: null,
    actions: [],
    connections: ['nigerian-languages', 'governance'],
    applications: [
      { icon: 'ri-route-line', label: 'Adaptive Learning Platforms', description: 'Personalizing lesson pacing and content to each learner.' },
      { icon: 'ri-question-answer-line', label: 'Curriculum Tutoring Bots', description: 'Subject-aligned tutoring assistants in local languages.' },
      { icon: 'ri-checkbox-multiple-line', label: 'Automated Assessment Grading', description: 'Scoring and feedback on written and spoken assessments.' },
      { icon: 'ri-bar-chart-box-line', label: 'Learning Outcome Analytics', description: 'Identifying learning gaps across schools and regions.' },
      { icon: 'ri-file-edit-line', label: 'Multilingual Content Generation', description: 'Producing curriculum materials in multiple Nigerian languages.' },
      { icon: 'ri-compass-3-line', label: 'Skills-gap Forecasting', description: 'Matching graduate skills to labor-market demand.' },
    ],
  },
  {
    id: 'geospatial',
    name: 'Geospatial',
    category: 'Geospatial',
    icon: 'ri-map-2-line',
    color: 'oklch(0.72 0.14 200)',
    description:
      "Satellite imagery, land use, and location intelligence mapped across Nigeria's states and local government areas.",
    position: { x: 0.817, y: -0.25, z: -0.52 },
    status: 'planned',
    metrics: null,
    dataTypes: ['Satellite Imagery', 'Land Use', 'Boundaries'],
    license: null,
    actions: [],
    connections: ['agriculture', 'environment'],
    applications: [
      { icon: 'ri-landscape-line', label: 'Land Use Classification', description: 'Mapping farmland, forest and urban land use from imagery.' },
      { icon: 'ri-building-3-line', label: 'Urban Planning Models', description: 'Informing zoning and infrastructure planning decisions.' },
      { icon: 'ri-road-map-line', label: 'Infrastructure Mapping', description: 'Tracking roads, power and water infrastructure coverage.' },
      { icon: 'ri-alarm-warning-line', label: 'Disaster Risk Modeling', description: 'Predicting flood and erosion exposure by location.' },
      { icon: 'ri-map-pin-line', label: 'Boundary Verification', description: 'Verifying land and administrative boundaries at scale.' },
      { icon: 'ri-truck-line', label: 'Logistics Route Optimization', description: 'Planning delivery routes against real terrain and roads.' },
    ],
  },
  {
    id: 'governance',
    name: 'Governance',
    category: 'Governance',
    icon: 'ri-bank-line',
    color: 'oklch(0.68 0.14 265)',
    description:
      'Public records, civic services, and policy documents structured to make government data machine-readable.',
    position: { x: -0.225, y: -0.5, z: 0.836 },
    status: 'planned',
    metrics: null,
    dataTypes: ['Public Records', 'Policy Text', 'Civic Services'],
    license: null,
    actions: [],
    connections: ['nigerian-languages', 'education', 'culture-media'],
    applications: [
      { icon: 'ri-archive-line', label: 'Public Records Digitization', description: 'Turning paper civic records into searchable structured data.' },
      { icon: 'ri-file-list-3-line', label: 'Policy Document Summarization', description: 'Making dense policy and legal text easier to understand.' },
      { icon: 'ri-customer-service-line', label: 'Civic Service Chatbots', description: 'Helping citizens navigate government services in local languages.' },
      { icon: 'ri-shield-check-line', label: 'Regulatory Compliance Tools', description: 'Screening filings and disclosures against policy requirements.' },
      { icon: 'ri-database-2-line', label: 'Open Data Portals', description: 'Structuring public data for transparency and reuse.' },
      { icon: 'ri-emotion-line', label: 'Public Sentiment Analysis', description: 'Understanding civic sentiment on policy and services.' },
    ],
  },
  {
    id: 'commerce',
    name: 'Commerce',
    category: 'Commerce',
    icon: 'ri-store-2-line',
    color: 'oklch(0.74 0.16 60)',
    description:
      "Retail, logistics, and marketplace data capturing how goods and services move across Nigeria's economy.",
    position: { x: -0.305, y: -0.75, z: -0.587 },
    status: 'planned',
    metrics: null,
    dataTypes: ['Retail Data', 'Logistics', 'Marketplace Listings'],
    license: null,
    actions: [],
    connections: ['finance', 'agriculture'],
    applications: [
      { icon: 'ri-line-chart-line', label: 'Retail Demand Forecasting', description: 'Predicting demand for stocking and inventory decisions.' },
      { icon: 'ri-magic-line', label: 'Marketplace Recommendations', description: 'Product recommendation engines tuned to local buying habits.' },
      { icon: 'ri-truck-line', label: 'Delivery Optimization', description: 'Planning logistics routes across Nigeria’s road networks.' },
      { icon: 'ri-shield-flash-line', label: 'Counterfeit Detection', description: 'Flagging fraudulent listings and counterfeit goods.' },
      { icon: 'ri-emotion-happy-line', label: 'Customer Sentiment Analytics', description: 'Reading reviews and feedback across local languages.' },
      { icon: 'ri-price-tag-3-line', label: 'Price Optimization', description: 'Dynamic pricing models grounded in real market data.' },
    ],
  },
  {
    id: 'culture-media',
    name: 'Culture & Media',
    category: 'Culture & Media',
    icon: 'ri-film-line',
    color: 'oklch(0.68 0.20 340)',
    description:
      "Music, film, oral history, and cultural heritage content — preserving Nigeria's creative output as structured data.",
    position: { x: 0, y: 1, z: 0 },
    status: 'planned',
    metrics: null,
    dataTypes: ['Audio', 'Video', 'Oral History'],
    license: null,
    actions: [],
    connections: ['nigerian-languages', 'governance'],
    applications: [
      { icon: 'ri-mic-2-line', label: 'Oral History Archives', description: 'Preserving spoken histories and folklore as structured audio data.' },
      { icon: 'ri-music-2-line', label: 'Music & Audio Recommendation', description: 'Discovery models trained on Nigerian music and audio.' },
      { icon: 'ri-global-line', label: 'Content Localization', description: 'Adapting film and media content across Nigerian languages.' },
      { icon: 'ri-price-tag-line', label: 'Media Content Tagging', description: 'Automated tagging of video and audio archives for search.' },
      { icon: 'ri-quill-pen-line', label: 'Creative Generation Tools', description: 'AI-assisted storytelling and content creation tools.' },
      { icon: 'ri-book-mark-line', label: 'Cultural Heritage Preservation', description: 'Structured archives of Nigeria’s creative and cultural output.' },
    ],
  },
  {
    id: 'environment',
    name: 'Environment',
    category: 'Environment',
    icon: 'ri-leaf-line',
    color: 'oklch(0.72 0.15 165)',
    description: "Climate patterns, biodiversity, and environmental monitoring data across Nigeria's ecosystems.",
    position: { x: 0, y: -1, z: 0 },
    status: 'planned',
    metrics: null,
    dataTypes: ['Climate Data', 'Biodiversity', 'Sensor Readings'],
    license: null,
    actions: [],
    connections: ['agriculture', 'geospatial'],
    applications: [
      { icon: 'ri-cloud-line', label: 'Climate Pattern Modeling', description: 'Modeling rainfall and temperature trends across regions.' },
      { icon: 'ri-eye-line', label: 'Biodiversity Monitoring', description: 'Tracking species and ecosystem health from sensor data.' },
      { icon: 'ri-rainy-line', label: 'Flood & Erosion Prediction', description: 'Early-warning models for flood-prone and eroding areas.' },
      { icon: 'ri-windy-line', label: 'Air Quality Forecasting', description: 'Predicting pollution levels in urban and industrial areas.' },
      { icon: 'ri-plant-line', label: 'Conservation Planning', description: 'Prioritizing land and resources for conservation efforts.' },
      { icon: 'ri-signal-tower-line', label: 'Environmental Sensor Analytics', description: 'Turning raw sensor readings into actionable insight.' },
    ],
  },
];

export const DEFAULT_ACTIVE_NODE_ID = 'nigerian-languages';

export function getDomainNode(id: string): DomainNode | undefined {
  return DOMAIN_NODES.find((node) => node.id === id);
}

/** Deduped undirected edge list — each pair appears once regardless of which node lists it. */
export function getUniqueEdges(): Array<[string, string]> {
  const seen = new Set<string>();
  const edges: Array<[string, string]> = [];
  for (const node of DOMAIN_NODES) {
    for (const targetId of node.connections) {
      const key = [node.id, targetId].sort().join('::');
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push([node.id, targetId]);
    }
  }
  return edges;
}
