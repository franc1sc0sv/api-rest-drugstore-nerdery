# Cinnamoroll Drugstore API

This API provides essential functionality to manage an online store for pharmaceutical and consumer products. It is designed using NestJS with TypeScript, Prisma and PostgreSQL as the database. The API includes authentication, user and product management, integration with Stripe for payments, and support for admin users and customers.

# Main features

- Authentication (registration, login/logout, password recovery).
- Product listing and search by category.
- Specific functionalities for administrators:
  - Complete product management (create, update, delete, disable).
  - Display of customer orders.
  - Upload images for products.
- Specific functionalities for customers:
  - View products and details.
  - Add products to cart and make purchases.
  - Mark products as favorites.
  - View own orders.
- Product images and details visible for authenticated and non-authenticated users.
- Stripe integration for payments, including webhooks management.

# Installation and configuration

**Docker installation on Windows**.

1. **Download Docker Desktop:**

   - Visit the official Docker site and download Docker Desktop for Windows: [Docker Desktop](https://www.docker.com/products/docker-desktop/).

2. Install Docker Desktop:\*\* \*\*.

   - Open the downloaded installer and follow the on-screen instructions.
   - Make sure to enable the necessary settings, such as WSL 2 (Windows Subsystem for Linux) support if your system is compatible.
   - Restart your computer if prompted to do so.

3. **Configure WSL 2 (optional but recommended):**

   - If you do not already have WSL 2 installed, open a PowerShell terminal as administrator and run:

     ```powershell
     wsl --install
     ```

   - Then, in Docker Desktop, enable WSL 2 integration from the configuration.

4. **Verify the installation:**

   - Open a terminal or command prompt (cmd) and run:

     ```bash
     docker --version
     docker-compose --version
     ```

   - You should see the installed versions of Docker and Docker Compose.

### **Project configuration with Docker**.

1. Clone the repository:
   ````bash
   git clone https://github.com/franc1sc0sv/api-rest-drugstore-nerdery.git
   cd /api-rest-drugstore-nerdery/
   ```
   ````
2. Install dependencies:

   ```bash
   yarn
   ```

3. Set environment variables in a `.env.development.local` file:

   ```env
      PORT=4000
      JWT_SECRET=mySecretKey

      DB_USER=youruser
      DB_PASSWORD=yourpassword
      DB_NAME=yourdatabase
      DB_HOST=postgres
      DB_PORT=5432

      DATABASE_URL=postgresql://$${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/{DB_NAME}?schema=public

      CLOUDINARY_CLOUD_NAME=your_cloud_name
      CLOUDINARY_API_KEY=your_api_key
      CLOUDINARY_API_SECRET=your_api_secret
      CLOUDINARY_URL=your_url

      NODE_ENV=development

      MAIL_USER=youruser
      MAIL_PASS=yourpass
      MAIL_FROM=noreply@example.com
      MAIL_HOST=smtp.gmail.com


      STRIPE_SECRET_KEY=yourstripekey
      STRIPE_ENDPOINT_SECRET=yourstripekey
   ```

4. Make sure you have already installed docker to proceed to run docker initialization script and wait for it to finish:

   ```bash
   .\run.dev.bat
   ```

5. Go to the docker desktop and you should see something like this

   - It exposes two ports
     - 3000: nest api port
     - 5555: prisma studio port (this is initialized from the dokcer terminal)

   ![docker](./screenshots/docker_initial_view.png 'docker')

6. Then the next step is to make the migration of our database with prism make sure you have well configured the environment variables (It is not necessary to change the ones that are already by default for the database).

   ![docker](./screenshots/docke-console.png 'docker')

7. It is advisable to execute the following command to make sure we have migrated and synchronized our schema and database both in the docker and locally

   ```bash
   npx prisma generate
   ```

8. Docker should look like this and it should be ready to access
   [localhost](http://localhost:3000/graphql) to be able to interact with the api from Apollo Client

   ![docker](./screenshots/docker-mounted.png 'docker')

# Deployment

## API

The API of this project is already deployed in **Render**.

[Acces to the API here](https://api-rest-drugstore-nerdery.onrender.com/)

![deploymentapi](./screenshots/api-deploy.png 'deploymentapi')

## Frontend

The Frontend of this project is deployed in **Vercel**. The following can be done with the frontend:

- View all products
- Products page
- Add products to cart
- Create orders
- Make multiple payments
- View orders and order details
- Manage order payments

Note, the frontend is logged in by default with a user with the role of CLIENT to make requests.

[Github del frontend](https://github.com/franc1sc0sv/frontend_drugstrore) -made in react, typescript and tailwind

[Acces to the frontend here](https://frontend-drugstrore.vercel.app/orders)

![a](./screenshots/frontend.png 'a')

# Project Structure

This is the general structure of the project and its organization in folders.

## Root structure of the project

```plaintext
api-rest-drugstore-nerdery/
├── dist/                         # Output files after compilation
├── node_modules/                 # Node.js dependencies
├── prisma/                       # Prisma configuration and migration files
├── screenshoots/                 # Screenshots or project images
├── src/                          # Project source code
├── .env.example                  # Example file for environment variables
├── docker-compose.dev.yml        # Docker Compose configuration for the development environment
├── nest-cli.json                 # NestJS CLI configuration
├── package.json                  # Project dependencies and metadata
├── run.dev.bat                   # Script to run the project on Windows
├── tsconfig.build.json           # TypeScript configuration for the build process
├── tsconfig.json                 # General TypeScript configuration
```

Estructura dentro src

```plaintext
src/
├── common/                       # Common modules and reusable utilities
├── configs/                      # Project configuration
├── modules/                      # Main project modules
├── seeds/                        # Database seeding scripts
├── static/                       # Static files (handlebars)
├── app.module.ts                 # Root module of the application
├── main.ts                       # Main entry point of the application
├── schema.graphql                # GraphQL schema definition
```

Estructura dentro de los modulos

```plaintext
modules/
├── auth/                         # Module related to authentication
│   ├── dtos/                     # Data Transfer Objects (DTOs) for authentication
│   │   ├── request/              # DTOs for authentication requests
│   │   └── response/             # DTOs for authentication responses
│   ├── strategies/               # Authentication strategies (e.g., JWT, Local, etc.)
│   ├── auth.controller.ts        # Controller to handle authentication routes
│   ├── auth.module.ts            # NestJS module to organize authentication components
│   └── auth.service.ts           # Authentication and authorization service

```

# REST and graphql implementation

This project uses both **REST** and **GraphQL** to handle different types of requests. The following describes the implementation of **Swagger** for REST routes, the use of **Apollo Server** for GraphQL, and other important aspects such as authentication endpoints and the **Stripe** webhook.

## Swagger

**Swagger** is used to document and test REST routes interactively. It is configured to expose an interface that allows developers and users to interact with APIs easily.

Once configured, Swagger will be available in the `/api` path of your application, allowing you to view and test all defined REST routes.

## Apollo Server

**Apollo Server** is used to handle **GraphQL** requests in this project. The following provides the configuration for the Apollo server and how to expose GraphQL endpoints.

The Apollo server will be available in the `/graphql` path, and the **GraphQL Playground** will be enabled for testing real-time queries and mutations.

## Endpoints using REST

The only routes that occupy rest in the project are:

- **Login**: `/login` (POST)
- **Logout**: `/logout` (POST)
- **register**: `/register` (POST)
- **forget**: `/forget` (POST)
- **reset**: `/reset` (PATCH)
- **webhook**: `/webhook/stripe` (POST)

## Graphql Schema

For a more detailed look at the operations you can perform using graphql you can check out the [Apollo Server](https://api-rest-drugstore-nerdery.onrender.com/graphql/) or the graphql schema

# Authentication and authorization

This project uses **JWT (JSON Web Tokens)** in conjunction with **Passport.js** for user authentication and authorization. Below are the key components and how it is used in the system.

### Authentication System

- JWT Authentication\*\*: The system uses JWT as a method to verify user identity. Tokens are generated at login time and must be sent in the authorization header of each request to access protected paths.
- Use of Passport.js\*\*: Passport is used with strategies such as `LocalAuthGuard`, `GqlAuthGuard` and `RestAuthGuard` to handle user authentication. Passport handles JWT token validation and user identification.

### Sending the token in requests

The JWT token must be sent in the authorization header of each request, using the standard `Bearer <token>` format. Example:

```http
Authorization: Bearer <your_jwt_token>
```

### Roles and permissions

Custom guards have been implemented to protect paths and ensure that only users with the appropriate roles can access certain resources. Roles are defined using the `@Roles()` decorator and managed with the `RolesGuard`.

#### **RolesGuard**:

This guard verifies that the user has the appropriate role before executing an operation. It is enforced through a specific decorator such as `@Roles(Role.MANAGER)`.

##### Example:

Protected mutation to update a product: this example shows how a guard and role is applied to a GraphQL mutation to update details of a product. Only users with the `MANAGER` role can access this operation.

```typescript
@Mutation(() => ProductDto)
@Roles(Role.MANAGER)
@UseGuards(GqlAuthGuard, RolesGuard)
async updateProductDetails(
  @Args('productIdDto') productIdDto: IdDto,
  @Args('updateProductInput') updateProductInput: UpdateProductInput,
): Promise<ProductDto> {
  return this.productsService.updateProductDetails(
    productIdDto,
    updateProductInput,
  );
}
```

### Login

Users can login by sending their credentials in a POST request to the `/login` path. LocalAuthGuard` is used to authenticate users by using a username and password.

```typescript
@Post('login')
@UseGuards(LocalAuthGuard)
async login(@CurrentUser() user: UserDto): Promise<AuthResponseDto> {
  return await this.authService.login(user);
}
```

### Logout (Logout)

Users can logout by sending a POST request to the `/logout` path. The authorization token is sent in the header, and the system invalidates the token when logging out.

```typescript
@Post('logout')
@UseGuards(RestAuthGuard)
async logout(
  @Req() req: Request,
  @CurrentUser() user: User,
): Promise<boolean> {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    throw new Error('Token de autorización no proporcionado');
  }

  await this.authService.logout(user.id, token);
  return true;
}
```

# Data validation

- How data validation is performed (e.g. using `class-validator`).
- Example of a DTO:

```typescript
export class CreateUserDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
```

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
