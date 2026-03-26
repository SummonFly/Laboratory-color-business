# Laboratory Color Business Solution

Business solution for auto paint store management with warehouse, suppliers, orders and discounts.

## Architecture

- **Clean Architecture** with Domain, Application, Infrastructure, API layers
- **CQRS** with MediatR
- **JWT Authentication** with Identity
- **Entity Framework Core** with PostgreSQL
- **Docker** containerization

## Tech Stack

- .NET 8
- PostgreSQL
- Docker & Docker Compose
- React (coming soon)

## Quick Start

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/laboratory-color-business.git
cd laboratory-color-business

# Run with Docker Compose
docker-compose up -d --build

# Open Swagger
http://localhost:5000/swagger