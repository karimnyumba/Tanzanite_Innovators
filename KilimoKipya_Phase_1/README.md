# KilimoKipya - Phase 1: Crop Feasibility Assessment Tool (CFAT)

Welcome to the GitHub repository for Phase 1 of the KilimoKipya platform, the Crop Feasibility Assessment Tool (CFAT). This tool is designed to assist banks and farmers by providing data-driven crop viability assessments to enhance financial inclusion and optimize agricultural practices.

## Folder Structure Overview

The repository is organized into the following key directories:

- **Documentation/**  
  Contains all necessary documentation for the implementation and usage of the AI system within CFAT. This includes detailed system architecture and workflows for developers and stakeholders.

- **backend/**  
  Houses the core backend logic of CFAT. Built with Python and the FastAPI framework, this section includes all API endpoints, business logic, and interactions with the database.

- **data/**  
  Contains datasets and data preprocessing scripts used for crop analysis. Data includes historical weather trends, soil conditions, market prices, and crop yield data, which are critical for making accurate recommendations.

- **frontend/**  
  The code for CFAT’s user interface is here. Implemented with Next.js, this section delivers a user-friendly experience for both farmers and bank representatives, allowing them to access the tool’s recommendations and analysis.

- **models/**  
  Contains machine learning models used for generating crop recommendations, yield potential analysis, and input cost assessments. These models are the core of CFAT’s ability to process vast amounts of agricultural data and provide actionable insights.

## Project Purpose

The Crop Feasibility Assessment Tool (CFAT) is designed to support:

- **Banks** in assessing the viability of agricultural loans by providing crop-specific yield projections and input cost analyses.
- **Farmers** in making informed decisions on which crops to plant, based on local soil conditions, weather patterns, and market demand.

## Key Features of CFAT

- **Crop Recommendations**: Tailored to local soil, climate, and market conditions, providing specific crop suggestions for each region.
- **Yield Predictions**: Estimates potential yield and earnings per hectare for each recommended crop, offering detailed insights specific to the region.
- **Input Insights**: Offers recommendations for fertilizers tailored to the specific crop and region, with cost estimates to optimize profitability.
- **Comprehensive Analysis**: Provides detailed reports for each crop and fertilizer, specific to the region, to support decision-making for both banks and farmers.

## How to Get Started

- **Backend**: Navigate to the `backend/` directory to explore the API endpoints and business logic.
- **Data**: Use the `data/` directory for preprocessing and analyzing relevant agricultural data.
- **Models**: Review and modify the machine learning models in the `models/` directory to generate better insights.
- **Frontend**: View the user interface implementation in the `frontend/` directory to understand how recommendations are presented to end users.

This repository is maintained by Tanzanite Innovators and is open for contributions. Please feel free to explore, report issues, and contribute to the future development of KilimoKipya.
