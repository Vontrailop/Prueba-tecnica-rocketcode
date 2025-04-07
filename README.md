# RocketDev Project

A full-stack enterprise application built with Java 8, Spring Boot, MyBatis ORM, Oracle database, Angular, and Bootstrap.

## Backend Setup

### Prerequisites
- Java 8 JDK
- Maven
- Oracle Database

### Configuration
1. Configure Oracle database connection in `src/main/resources/application.properties`
2. Update database credentials as needed

### Running the Backend
```bash
mvn clean install
mvn spring-boot:run
```

The backend server will start on `http://localhost:8080`

## Frontend Setup

### Prerequisites
- Node.js
- npm

### Installation
```bash
cd rocketdev-frontend
npm install
```

### Running the Frontend
```bash
cd rocketdev-frontend
npm start
```

The frontend application will be available at `http://localhost:4200`

## Technology Stack

### Backend
- Java 8
- Spring Boot 2.3.12
- MyBatis 2.2.2
- Oracle Database

### Frontend
- Angular 19
- Bootstrap 5.3
- TypeScript

## Project Structure

```
rocketdev/
├── src/                    # Backend source files
│   ├── main/
│   │   ├── java/
│   │   └── resources/
├── rocketdev-frontend/              # Angular frontend application
│   ├── src/
│   │   ├── app/
│   │   └── assets/
└── pom.xml                # Maven configuration
```