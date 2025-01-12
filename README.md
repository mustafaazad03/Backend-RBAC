# Event Management System

Welcome to the Event Management System, a web application designed to streamline and enhance your event planning experience. This project is built using Nest.js, Supabase, GitHub Actions, and Bump.sh for API documentation.

## Table of Contents
1. [Introduction](#introduction)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Getting Started](#getting-started)
5. [Project Structure](#project-structure)
6. [API Documentation](#api-documentation)
7. [Contributing](#contributing)
8. [License](#license)

## Introduction

The Event Management System is a comprehensive solution for organizing and managing events. Whether you're hosting a conference, a workshop, or a social gathering, this web application provides a user-friendly interface for all your event-related tasks.

## Features

- **Event Detail Page**: View detailed information about a specific event.
- **Create Event Page**: Easily create and customize new events.
- **Single Event Overview Page**: Get a quick overview of individual events.
- **Insights Chart Section**: Visualize event analytics and insights.
- **Guest Management Section**: Efficiently manage and organize event attendees.
- **Registration Users Management Page**: Handle user registrations and attendee information.
- **Ticket Page**: Manage and customize event tickets.
- **Questions Management Page**: Collect and manage questions from attendees.
- **Mail Schedule and Management Page**: Schedule and manage event-related emails.
- **Meeting Creation Page**: Create and organize event-related meetings.
- **Insights and Setting Page**: Configure settings and view event insights.
- **Profile Page**: Manage user profiles and preferences.
- **Collection Page for Events**: Group events into collections for easy organization.
- **Add Events in Collection and Add People in Collection**: Customize collections with events and participants.
- **Newsletter of a Particular Collection Management Page**: Manage newsletters for specific event collections.
- **Collection Insights Page**: View analytics and insights for event collections.
- **Collection Management Page**: Administer and customize event collections.

## Technologies Used

- **Nest.js**: A progressive Node.js framework for building efficient and scalable server-side applications.
- **Supabase**: An open-source alternative to Firebase for building and scaling applications with real-time features.
- **GitHub Actions**: Automate workflows for continuous integration and deployment.
- **Bump.sh**: Generate and maintain API documentation seamlessly.

## Getting Started

To get started with the Event Management System, follow these steps:

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Configure environment variables.
4. Run the application using `npm start`.

For more detailed instructions, refer to the [Getting Started Guide](#).

## Project Structure

The project follows a structured architecture with different modules for each feature. Here's an overview:

```
event-management-system/
|-- src/
|   |-- modules/
|   |   |-- event/
|   |   |-- user/
|   |   |-- collection/
|   |   |-- mail/
|   |   |-- insights/
|   |   |-- ticket/
|   |   |-- meeting/
|   |   |-- profile/
|   |   |-- ...
|   |-- common/
|   |-- config/
|   |-- ...
|-- tests/
|-- .env.example
|-- ...
```

## API Documentation

The API documentation is automatically generated using Bump.sh and is available [here](#).

## Contributing

We welcome contributions! Before contributing, please read our [Contribution Guidelines](CONTRIBUTING.md).

## License

This project is licensed under the [MIT License](LICENSE). Feel free to use and modify the code as needed.

Happy event planning! 🎉