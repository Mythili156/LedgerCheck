# LedgerCheck - Frontend

This is the React-based user interface for the LedgerCheck application. It handles user interactions, file uploads, and visualizing financial data.

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18 or higher)
*   npm or yarn

### Installation

1.  Navigate to the directory:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

### Development Server

Start the local development server:
```bash
npm run dev
```
The app will be available at [http://localhost:5173](http://localhost:5173).

## 🌍 Environment Variables

Create a file named `.env` in the `frontend` folder if you need custom configurations.

| Variable | Description | Default |
| :--- | :--- | :--- |
| `VITE_API_URL` | The Production Backend URL | `http://localhost:8000` (Dev) |

> **Note:** In development, you don't need to set `VITE_API_URL` as it defaults to localhost. For production (Vercel), you MUST set this.

## 🏗️ Build for Production

To create an optimized production build:
```bash
npm run build
```
The output will be in the `dist/` folder.

## 📂 Project Structure

*   `src/pages` - Main views (Dashboard, Login, Reports)
*   `src/components` - Reusable UI elements (Charts, Buttons)
*   `src/context` - Global state (Language, Currency)
*   `src/api.js` - Centralized API configuration

## 🛠️ Key Libraries
*   **Vite:** Build tool
*   **React Router:** Navigation
*   **Recharts:** Financial Charts
*   **Framer Motion:** Animations
*   **TailwindCSS:** Styling
