# IDE Cipher

A modern, browser-based code playground and IDE powered by WebContainers. Write, edit, and run React and Express applications directly in your browser with real-time preview and an integrated terminal.

## ✨ Features

- **🚀 WebContainer Integration** - Run Node.js applications entirely in the browser
- **📝 Monaco Editor** - VSCode-like editing experience with syntax highlighting
- **🎯 Live Preview** - Real-time preview of your running applications
- **💾 Persistent Storage** - Save and manage your playgrounds in MongoDB
- **📁 File Management** - Full file explorer with create, rename, and delete operations
- **🖥️ Integrated Terminal** - Built-in terminal using xterm.js for command execution
- **🎨 Multiple Templates** - Start with React or Express.js templates
- **⚡ Hot Reload** - See your changes instantly in the preview
- **🌓 Dark/Light Mode** - Beautiful UI with theme support
- **👤 User Authentication** - Manage your projects with user accounts

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **shadcn/ui** - UI components
- **Monaco Editor** - Code editor
- **Zustand** - State management

### Backend
- **Next.js API Routes** - Server-side endpoints
- **Prisma** - ORM for database
- **MongoDB** - Database

### WebContainer & Terminal
- **@webcontainer/api** - Run Node.js in the browser
- **xterm.js** - Terminal emulator
- **react-resizable-panels** - Resizable layout panels

## 📋 Prerequisites

- Node.js 20.x or higher
- MongoDB database
- npm or yarn

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/ide-cipher.git
cd ide-cipher
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="your-mongodb-connection-string"
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
ide-cipher/
├── app/                          # Next.js app directory
│   ├── (root)/                   # Home page
│   ├── dashboard/                # User dashboard
│   ├── playground/[id]/          # Code playground pages
│   └── api/                      # API routes
├── components/                   # Reusable UI components
│   ├── ui/                       # shadcn/ui components
│   └── providers/                # Context providers
├── features/                     # Feature modules
│   ├── dashboard/                # Dashboard features
│   ├── playground/               # Playground features
│   │   ├── components/           # File tree, editor
│   │   ├── hooks/                # Custom hooks
│   │   └── libs/                 # Utilities
│   └── webContainers/            # WebContainer integration
│       ├── components/           # Preview, terminal
│       └── hooks/                # WebContainer hooks
├── lib/                          # Shared utilities
├── prisma/                       # Prisma schema
│   └── schema.prisma
├── public/                       # Static assets
└── starters/                     # Project templates
    ├── react/                    # React starter
    └── react-ts/                 # React TypeScript starter
```

## 🎮 Usage

### Creating a Playground

1. Navigate to the dashboard
2. Click "Add New" button
3. Choose a template (React or Express)
4. Enter a title and description
5. Click "Create Playground"

### Editing Code

1. Open a playground
2. Click on files in the file explorer to edit them
3. Make changes in the Monaco editor
4. Press `Ctrl+S` to save
5. See live updates in the preview panel

### File Management

- **Create File**: Right-click folder → "New File"
- **Create Folder**: Right-click folder → "New Folder"
- **Rename**: Right-click item → "Rename"
- **Delete**: Right-click item → "Delete"

### Using the Terminal

- Execute commands in the integrated terminal
- Run `npm install` to install dependencies
- Use `npm run start` to start the development server
- Terminal features: search, copy, download logs

## ⚙️ Configuration

### WebContainer Setup

WebContainer requires specific headers to work properly. These are configured in `next.config.ts`:

```typescript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Cross-Origin-Opener-Policy',
          value: 'same-origin',
        },
        {
          key: 'Cross-Origin-Embedder-Policy',
          value: 'require-corp',
        },
      ],
    }
  ]
}
```

### Database Schema

The application uses Prisma with MongoDB. Key models:
- **User** - User accounts
- **Playground** - Code projects
- **TemplateFile** - Project files and content
- **StarMark** - Starred/favorited projects

## 📝 Available Templates

### React
- Basic React setup with React 18
- Pre-configured with react-scripts
- Includes basic component structure

### React TypeScript
- TypeScript-enabled React project
- Type-safe development
- Modern React patterns

### Express (Coming Soon)
- Node.js server with Express
- RESTful API template
- Middleware configuration

## 🔧 Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma generate` - Generate Prisma Client
- `npx prisma db push` - Push schema changes to database

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🚧 Future Enhancements

The following features are planned for future releases:

1. **Authentication** - User authentication and authorization system for secure access
2. **Editor Theme Change** - Customizable editor themes (light/dark, VSCode themes, etc.)
3. **Autosave Feature** - Automatic saving of changes with configurable intervals

## 🙏 Acknowledgments

- [WebContainer API](https://webcontainers.io/) - For enabling Node.js in the browser
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - For the amazing code editor
- [shadcn/ui](https://ui.shadcn.com/) - For beautiful UI components
- [Next.js](https://nextjs.org/) - For the powerful React framework


