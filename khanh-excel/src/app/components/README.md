# Excel Web Application Components Documentation

This document provides an overview of the components used in the Excel Web Application, describing the role and function of each component file.

## Core Components

### ExcelUpload.tsx
**Role**: Main application component that orchestrates the entire Excel processing workflow.
**Function**: 
- Manages the overall application state
- Coordinates between different components
- Handles file upload and processing
- Controls the visibility of left and right panels
- Renders the main application layout

### ExcelViewer.tsx
**Role**: Alternative main component for viewing Excel data.
**Function**:
- Provides a simpler interface for viewing Excel data
- Handles file upload and processing
- Displays sections and data in a more streamlined format
- Offers a different user experience compared to ExcelUpload

## UI Components

### ExcelSection.tsx
**Role**: Displays a section of Excel data with interactive features.
**Function**:
- Renders a collapsible section of Excel data
- Provides a modal dialog for viewing section data
- Handles CSV export functionality for section data
- Manages section state (expanded/collapsed)

### ExcelTable.tsx
**Role**: Renders tabular data from Excel.
**Function**:
- Displays Excel data in a structured table format
- Handles horizontal and vertical scrolling
- Provides row count information
- Offers CSV export functionality

### Modal.tsx
**Role**: Reusable modal dialog component.
**Function**:
- Provides a full-screen modal dialog
- Handles backdrop and close functionality
- Manages body scroll locking when modal is open
- Supports custom content and title

## Panel Components

### ExcelLeftPanel.tsx
**Role**: Left sidebar navigation component.
**Function**:
- Provides navigation controls
- Displays section summary information
- Offers toggle functionality for showing/hiding sections
- Shows total rows and sections count

### ExcelRightPanel.tsx
**Role**: Right sidebar component for file upload and data summary.
**Function**:
- Contains file upload controls
- Displays data summary information
- Provides sheet selection functionality
- Offers JSON export functionality

## Utility Components

### ExcelFileUpload.tsx
**Role**: Handles file upload functionality.
**Function**:
- Provides drag-and-drop file upload
- Supports file selection via button
- Handles sheet selection
- Shows loading state during file processing

### ExcelDataSummary.tsx
**Role**: Displays summary information about the Excel data.
**Function**:
- Shows metadata about the Excel file
- Displays row and section counts
- Provides JSON export functionality
- Offers a quick overview of the data

## Type Definitions

### types.ts
**Role**: Defines TypeScript interfaces and types used throughout the application.
**Function**:
- Defines ExcelRow interface for row data
- Defines Section interface for section data
- Provides type safety for component props
- Ensures consistency across the application

## Component Relationships

The components in this application follow a hierarchical structure:

1. **ExcelUpload** or **ExcelViewer** serves as the main container
2. **ExcelLeftPanel** and **ExcelRightPanel** provide navigation and controls
3. **ExcelSection** components display individual sections of data
4. **ExcelTable** renders the actual tabular data
5. **Modal** provides popup functionality for detailed views
6. **ExcelFileUpload** and **ExcelDataSummary** offer utility functions

## Data Flow

1. User uploads an Excel file via **ExcelFileUpload**
2. Data is processed and organized into sections
3. **ExcelSection** components render each section
4. When a section is clicked, a **Modal** opens with an **ExcelTable**
5. Users can export data in CSV or JSON format

## Styling

All components use Tailwind CSS for styling, providing a consistent look and feel across the application. The design is responsive and supports both light and dark modes. 