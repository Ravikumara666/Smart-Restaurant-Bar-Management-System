# Restaurant Frontend Application

This is the frontend application for the Smart Restaurant Bar Management System. It is built using TypeScript and React.

## Project Structure

- **src/**: Contains all the source code for the application.
  - **components/**: Reusable components used throughout the application.
    - **common/**: Common components.
    - **layout/**: Layout components that define the structure of the application pages.
  - **pages/**: Main page components of the application.
  - **services/**: Functions for making API calls to the backend service.
  - **store/**: State management setup for the application.
  - **types/**: TypeScript types and interfaces used throughout the application.
  - **utils/**: Utility functions that can be used across different components and services.
  - **App.tsx**: Main application component that sets up routing and renders the application.
  - **main.tsx**: Entry point of the application that renders the `App` component into the DOM.

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd restaurant-frontend
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage

To start the development server, run:
```
npm start
```

## Environment Variables

Make sure to create a `.env` file in the root directory with the necessary environment variables.

## Contributing

Feel free to submit issues and pull requests. 

## License

This project is licensed under the MIT License.