# Home Zone Analyzer Documentation

## Overview

Home Zone Analyzer is a web application designed to help users find the best place to live in Bologna. It provides a
comprehensive analysis of different zones based on various criteria, making it easier for users to make informed
decisions about their next home.

## Project Structure

The project is divided into two main parts: the frontend and the backend.

### Frontend

The frontend is built using Next.js and React. It includes the following key components and files:

- **Pages**: Located in the `frontend/src/app` directory, these files define the different pages of the application.

- **Components**: Located in the `frontend/src/components` directory, these files define reusable UI components.

- **Styles**: Located in the `scss` directory, these files define the styles for the application.

### Backend

The backend is built using `Next.js` and includes the following key components and files:

- **API Routes**: Located in the `backend/src/app/api`directory, these files define the API endpoints for the
  application.
- **Database**: The database schema and seed data are defined in the `backend/db`directory.

## Installation

Before you start you should replace in the `frontend/.env.local` file the `OPENROUTESERVICE_API_KEY` with your own key.
If you want to use kubernetes you should replace the `OPENROUTESERVICE_API_KEY` in the `k8s-secret.yaml` file with your
openrouteservice API key in base64 format.

### Prerequisites

- Node.js (version 20 or later)
- npm or yarn

### Steps

1. Clone the repository:
    ```bash
    git clone https://github.com/CyberGiant7/progetto_cas.git
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

## Running the Application in local

1. Start the database:
    ```bash
    docker compose up -d db
    ```

2. Run database migrations and seed data:
    ```bash
    cd backend
    npm run db:generate
    npm run db:migrate
    npm run db:seed
    ```

3. Start the backend server:
    ```bash
    cd backend
    npm run dev
    # or
    yarn dev
    ```

4. Start the frontend server:
    ```bash
    cd ../frontend
    npm run dev
    # or
    yarn dev
    ```

5. Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to see the application in action.

## Deployment

You can deploy the application in different environments using the following methods:

### Docker

You can simply run the `run.bat` (or `run.sh`) script to start the Docker containers.

Alternatively, you can follow these steps:

1. Build and run the Docker containers:
    ```bash
   docker compose up -d db
   docker compose build backend
   docker compose up -d backend
   docker exec -it backend npm run db:generate
   docker exec -it backend npm run db:migrate
   docker exec -it backend npm run db:seed
   docker compose build frontend
   docker compose up frontend
    ```

2. The application will be available at [http://localhost:3000](http://localhost:3000).

### Kubernetes

1. If you use minikube you can access the application using the following command:
   ```bash
   minikube start
   ```

2. Apply the Kubernetes deployment and service configurations:
    ```bash
   kubectl apply -f k8s-deployment.yaml
   kubeclt apply -f k8s-secret.yaml
   kubectl apply -f k8s-service.yaml
    ```

3. Open service in browser:
    ```bash
   minikube service frontend -n progetto-cas
    ```

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contact

For any inquiries or feedback, please contact Leonardo Dessì
at [https://github.com/CyberGiant7](https://github.com/CyberGiant7).

---

Thank you for using Home Zone Analyzer! We hope it helps you find the perfect place to live in Bologna.