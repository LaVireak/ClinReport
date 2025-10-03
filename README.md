# ClinReport - Clinical Documentation Platform

A modern static web app demonstrating clinical documentation features and an interactive demo that simulates AI-driven entity extraction, ICD-10 suggestions, and risk assessments.

## Features

- Smart Transcription (demo)
- NLP & Auto-coding (simulated ICD-10/CPT suggestions with confidence scores)
- Predictive Analytics (risk visualization and readmission risk)
- Interactive Demo with specialty-specific results
- Responsive, accessible, and professional UI

## Project Structure

ClinReport/
├── index.html
├── demo.html
├── contact.html
├── product.html
├── how-it-works.html
├── use-cases.html
├── pricing.html
├── resources.html
├── security.html
├── about.html
├── css/
│   └── styles.css
└── js/
    └── main.js

## Demo Page

- Three pre-loaded clinical notes: ER — Chest Pain, Diabetes follow-up, Pediatric URI
- Specialty selector (Emergency Medicine, Cardiology, Family Medicine, Pediatrics, Internal Medicine)
- Dynamic results generated on "Process Note": entities, suggested codes, risk assessments

## Getting Started

1. Clone or download the repo.
2. Open `index.html` (or `demo.html`) in your browser.
3. On the Demo page: select a note, choose a specialty, click "Process Note".

No build process required — static site.

## Customization

- Edit colors and theme in `css/styles.css` (CSS variables)
- Demo behavior and result simulation live in `js/main.js`

## Future Enhancements

- Backend API and secure AI/NLP integration
- Authentication and role-based access
- EHR integrations and production readiness

## Contact

- Email: hello@clinreport.ai

## License

© 2024 ClinReport. All rights reserved.

--- 
**Built for healthcare professionals**