# Workflow Canvas

A standalone React-based interactive canvas application that serves dual purposes:
- Create, visualize, and manage complex workflows through an intuitive drag-and-drop interface
- Function as a flexible canvas for brainstorming and discussing ideas, similar to a digital sticky note board with support for images and connections

Whether you're mapping out business processes or collaborating on creative projects, Workflow Canvas provides a versatile platform for visual organization and communication.

## Features

- **Interactive Canvas**: Drag-and-drop interface for creating and managing workflows
- **Multiple Node Types**:
  - Workflow Nodes
  - Chat Nodes with message history
  - Image Nodes for visual content
  - Sticky Notes for quick annotations
  - Header Nodes for workflow organization
  - Decision Nodes for branching logic
- **Smart Connections**: Custom edges to connect different nodes with visual feedback
- **Workflow Management**:
  - Context menu for quick actions
  - Node controls for easy manipulation
  - Custom handles for node connections
- **Navigation Features**:
  - Minimap for easy navigation of large workflows
  - Workflow header with essential controls
  - Workflow toolbar for common actions
- **Guided Tour System**: Built-in tour functionality to help new users
- **Context-Based State Management**: Uses React Context API for efficient state management

## Tech Stack

- React
- TypeScript
- Vite
- Jest for testing
- Tailwind CSS
- React Bootstrap

## Development Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm run dev
```
4. Run tests:
```bash
npm test
```

## Project Structure

- `/src/components/`: React components organized by functionality
  - `/header/`: Workflow header and toolbar components
  - `/minimap/`: Minimap navigation component
  - `/nodes/`: Different node type implementations
  - `/node-parts/`: Reusable node components
  - `/tour/`: Tour system components
  - `/workflow/`: Workflow-specific components
- `/src/contexts/`: React Context providers
- `/src/hooks/`: Custom React hooks
- `/src/pages/`: Application pages
