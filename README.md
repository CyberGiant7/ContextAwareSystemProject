# Home Zone Analyzer Documentation

## Overview

Home Zone Analyzer is a web application designed to help users find the best place to live in Bologna. It provides a
comprehensive analysis of different zones based on various criteria, making it easier for users to make informed
decisions about their next home.

## Features

- **Interactive Map**: Explore different zones in Bologna with an interactive map.
- **Detailed Analysis**: Get detailed information about each zone, including amenities, transportation, and more.
- **User-Friendly Interface**: Easy-to-use interface designed for a seamless user experience.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Project Structure

The project is divided into two main parts: the frontend and the backend.

### Frontend

The frontend is built using Next.js and React. It includes the following key components and files:

- **Pages**: Located in the

app

directory, these files define the different pages of the application.

- **Components**: Located in the

components

directory, these files define reusable UI components.

- **Styles**: Located in the

scss

directory, these files define the styles for the application.

### Backend

The backend is built using Next.js and includes the following key components and files:

- **API Routes**: Located in the

api

directory, these files define the API endpoints for the application.

- **Database**: The database schema and seed data are defined in the

db

directory.

- **Configuration**: Configuration files for Docker, Kubernetes, and environment variables are located in the

backend

directory.

## Installation

### Prerequisites

- Node.js (version 20 or later)
- npm or yarn

### Steps

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/home-zone-analyzer.git
    cd home-zone-analyzer
    ```

2. Install dependencies for the frontend:
    ```bash
    cd frontend
    npm install
    # or
    yarn install
    ```

3. Install dependencies for the backend:
    ```bash
    cd ../backend
    npm install
    # or
    yarn install
    ```

## Running the Application

1. Start the backend server:
    ```bash
    cd backend
    npm run dev
    # or
    yarn dev
    ```

2. Start the frontend server:
    ```bash
    cd ../frontend
    npm run dev
    # or
    yarn dev
    ```

3. Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to see the application in action.

## Deployment

### Docker

1. Build and run the Docker containers:
    ```bash
    docker-compose up --build
    ```

2. The application will be available at [http://localhost:3000](http://localhost:3000).

### Kubernetes

1. Apply the Kubernetes deployment and service configurations:
    ```bash
    kubectl apply -f k8s-deployment.yaml
    kubectl apply -f k8s-service.yaml
    ```

2. Access the application through the Kubernetes service.

## Contributing

We welcome contributions to improve Home Zone Analyzer. Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to the branch (

git push origin feature-branch

).

5. Open a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contact

For any inquiries or feedback, please contact Leonardo Dessì
at [https://github.com/CyberGiant7](https://github.com/CyberGiant7).

---

Thank you for using Home Zone Analyzer! We hope it helps you find the perfect place to live in Bologna.