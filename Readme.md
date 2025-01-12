# RBAS Project

## Description

RBAS is a robust backend authentication service built with NestJS, TypeORM, and PostgreSQL. It provides secure user registration, login, and role-based access control (RBAC) features, including integration with Google OAuth for seamless authentication.

## Features

- **User Authentication**: Register and login with email and password.
- **JWT Integration**: Secure token-based authentication with access and refresh tokens.
- **Role-Based Access Control**: Define roles such as Admin, Maintainer, and User to manage permissions.
- **Google OAuth**: Optional Google authentication for user convenience.
- **Protected Routes**: Secure API endpoints with Guards and Decorators.
- **Data Validation**: Automatic validation of request payloads using class-validator.
- **Database Integration**: Managed with TypeORM and PostgreSQL for reliable data storage.
- **Environment Configuration**: Manage configurations securely with environment variables.

## Technologies Used

- [NestJS](https://nestjs.com/)
- [TypeORM](https://typeorm.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [JWT](https://jwt.io/)
- [Google APIs](https://developers.google.com/apis-explorer)
- [TypeScript](https://www.typescriptlang.org/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)

## Installation

1. **Clone the repository**
  ```bash
  git clone https://github.com/mustafaazad03/Backend-RBAC.git
  ```
2. **Navigate to the project directory**
  ```bash
  cd Backend-RBAC
  ```
3. **Install dependencies**
  ```bash
  pnpm install
  ```
4. **Configure environment variables**
  - Rename `.env.example` to `.env` and fill in the required values.

5. **Run the application**
  ```bash
  pnpm start:dev
  ```

## Usage

- **Register a new user**
  - POST `/auth/register` with `email` and `password`.
- **Login**
  - POST `/auth/login` with `email` and `password`.
- **Access Protected Routes**
  - Include the JWT token in the `Authorization` header.
- **Google OAuth**
  - GET `/auth/google/redirectUrl` to initiate OAuth flow.
  - GET `/auth/google/callback` to handle the OAuth callback.