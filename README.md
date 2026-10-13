# Laundry Go — Laundry Scheduling & Tracking Platform

Laundry Go is a web-based laundry management platform that simplifies the laundry service experience. It allows users to schedule clothes pickups, track their laundry orders, and arrange deliveries through a clean, responsive interface.

The project is built with modern web technologies and integrates Supabase for backend services. It is designed to make laundry scheduling more convenient while providing users with visibility into their order progress.

## Live Demo

- **Live Application:** [Laundry Go](https://laundrygo-schedule-hub.lovable.app)
- **GitHub Repository:** [laundrygo-schedule-hub](https://github.com/vardhanrote/laundrygo-schedule-hub)

## Key Features

- **Pickup Scheduling:** Schedule laundry pickups at a preferred time using the booking interface.
- **Order Tracking:** Follow laundry orders and monitor their progress through the service workflow.
- **Delivery Scheduling:** Arrange delivery of cleaned clothes for a more convenient service experience.
- **User Authentication:** Includes authentication-related interfaces and Supabase integration.
- **Service Information:** Dedicated pages for pricing, sustainability, contact information, and customer-facing content.
- **Responsive Interface:** Designed to provide a consistent experience across desktop and mobile devices.
- **Newsletter Signup:** Includes a newsletter subscription interface for customer engagement.

## Technology Stack

| Layer             | Technologies                                    |
| ----------------- | ----------------------------------------------- |
| Frontend          | React, TypeScript, Vite                         |
| Styling           | Tailwind CSS, CSS                               |
| UI Components     | shadcn/ui, Radix UI                             |
| Backend Services  | Supabase                                        |
| Database          | Supabase PostgreSQL                             |
| Development Tools | npm, ESLint, Git, GitHub                        |
| Deployment        | Docker, Nginx, AWS EC2 deployment configuration |

## Application Structure

The application is organized into reusable components, pages, and service integrations.

```text
laundrygo-schedule-hub/
├── public/                 # Static assets
├── src/
│   ├── assets/             # Application images and assets
│   ├── components/         # Reusable UI components
│   │   └── ui/             # Shared UI component library
│   ├── hooks/              # Custom React hooks
│   ├── integrations/
│   │   └── supabase/       # Supabase client and types
│   ├── lib/                # Shared utilities
│   ├── pages/              # Application pages
│   ├── App.tsx             # Main application component
│   └── main.tsx            # Application entry point
├── supabase/
│   ├── migrations/         # Database migration scripts
│   └── config.toml         # Supabase configuration
├── deploy/                 # Deployment and server configuration
├── Dockerfile              # Container image configuration
├── docker-compose.yml      # Container orchestration configuration
├── DEPLOY_EC2.md           # AWS EC2 deployment guide
├── package.json            # Dependencies and npm scripts
├── .env.example            # Environment variable template
└── README.md
```

## Getting Started

### Prerequisites

Install the following tools before running the application locally:

- [Node.js](https://nodejs.org/) — compatible with the project's dependencies
- npm — included with Node.js
- Git
- A Supabase project for backend integration

### 1. Clone the Repository

```bash
git clone https://github.com/vardhanrote/laundrygo-schedule-hub.git
cd laundrygo-schedule-hub
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root using `.env.example` as a template.

```bash
cp .env.example .env
```

On Windows PowerShell, use:

```powershell
Copy-Item .env.example .env
```

Configure the following variables with the appropriate values from your Supabase project:

```env
VITE_SUPABASE_PROJECT_ID=your_project_id
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
VITE_SUPABASE_URL=https://your_project_id.supabase.co
```

**Security note:** Never commit your `.env` file, database passwords, Supabase service-role keys, or other private credentials. The `VITE_` variables are exposed to the browser, so only use credentials intended for public client-side access.

### 4. Start the Development Server

```bash
npm run dev
```

Open the local URL printed in the terminal, typically `http://localhost:5173`.

### 5. Build for Production

```bash
npm run build
```

The production-ready frontend files are generated in the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

## Backend and Database

Laundry Go integrates with Supabase for backend connectivity and authentication-related functionality. The repository also contains Supabase configuration and SQL migration files.

To configure a separate backend environment:

1. Create or select a Supabase project.
2. Configure the required frontend environment variables.
3. Review the SQL files in `supabase/migrations/`.
4. Apply the required database migrations to the appropriate Supabase project.
5. Verify authentication, database permissions, and application functionality.

Database migrations should be reviewed before execution, especially when working with an existing database.

## Deployment

The repository includes deployment resources for containerized hosting and Nginx-based serving.

- **Docker:** Build and run the application using the included `Dockerfile` and `docker-compose.yml`.
- **Nginx:** Deployment configuration is available in the `deploy/` directory.
- **AWS EC2:** Refer to [`DEPLOY_EC2.md`](DEPLOY_EC2.md) for the project-specific deployment instructions.

Deployment requirements may vary depending on the hosting environment and backend configuration.

## Available Scripts

| Command           | Description                        |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Start the local development server |
| `npm run build`   | Build the production frontend      |
| `npm run preview` | Preview the production build       |
| `npm run lint`    | Run the project's linting checks   |

## Development Workflow

This project uses Git and GitHub for version control. Changes can be developed locally, committed to the `main` branch, and pushed to the remote repository.

```bash
git add .
git commit -m "Describe your changes"
git push
```

If continuing development through Lovable, refer to the project's Lovable editor and its repository synchronization workflow.

## Future Enhancements

Potential improvements include:

- Real-time order status updates.
- Notifications for pickup and delivery milestones.
- Order history and recurring laundry bookings.
- Improved administrative tools for managing orders.
- Additional payment and service-management integrations.

These are possible future enhancements, not claims about existing functionality.

## Contributing

Contributions and suggestions are welcome. For significant changes, consider creating a separate branch and submitting a pull request for review.

## License

No license is currently specified in this repository. Add a `LICENSE` file if you intend to publish the project under an open-source license.

---

**Laundry Go** — Making laundry scheduling simpler, more convenient, and easier to track.
