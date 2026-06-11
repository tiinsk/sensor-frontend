# Home monitor (React front-end)

React frontend (home-monitor) for the sensor API. Displays devices, readings, and statistics; uses the sensor-api backend for auth and data.

**Backend (sensor-api)**  
[The API](https://github.com/tiinsk/sensor_api) was originally built with **Hapi.js** and **PostgreSQL**. [The current version](https://github.com/tiinsk/sensor-api) runs on **AWS Lambda** with **DynamoDB**.

**Raspberry PI sensor data collection**  
Raspberry PI runs [node.js app](https://github.com/tiinsk/sensor-data-sender) that collects sensor data from multiple temperature + humidity + pressure sensors.

**Links**

- [Home monitor front-end (this repo)](https://github.com/tiinsk/sensor-frontend)
- [Sensor-api backend (lambda + dynamodb)](https://github.com/tiinsk/sensor-api)
- [Old sensor-api backend (hapi + postgresql)](https://github.com/tiinsk/sensor_api)
- [Sensor-data-sender (Raspberry PI)](https://github.com/tiinsk/sensor-data-sender)

## Prerequisites

- Node.js 18+
- npm

## Local development

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment variables**

   Copy `.env.example` to `.env.local` (gitignored) and set your API target.

   For local dev, leave `VITE_API_ROUTE` empty so the app calls `/api` on the dev server. Vite proxies those requests to `VITE_API_PROXY_ROUTE`.

   Common setups:

   - **AWS API** — set `VITE_API_PROXY_ROUTE` to your API Gateway URL (e.g. `https://xxxx.execute-api.<region>.amazonaws.com`). No trailing slash.
   - **Local SAM API** — run `npm run sam:local` in sensor-api (default port 3001), then set `VITE_API_PROXY_ROUTE=http://localhost:3001`.

   See [Environment variables](#environment-variables) for the full list.

3. **Run the app**

   ```bash
   npm run dev
   ```

   Opens [http://localhost:3000](http://localhost:3000) by default. Use another port with `PORT=3005 npm start` (or `npm run dev`). Restart the dev server after changing `.env.local`.

## Environment variables

Vite only exposes variables prefixed with `VITE_` to the app.

| Variable | Required | Description                                                                                                            |
|----------|----------|------------------------------------------------------------------------------------------------------------------------|
| `VITE_API_ROUTE` | Production builds | API base URL (e.g. `https://xxxx.execute-api.region.amazonaws.com`). Set in Amplify for production. No trailing slash. |
| `VITE_API_PROXY_ROUTE` | Local dev | URL the dev server proxies `/api` to (e.g.  `http://localhost:3001`). Used when `VITE_API_ROUTE` is empty.             |

Put local values in `.env.local`. Do not commit secrets. Production uses Amplify environment variables.

## Deployment (AWS Amplify)

The frontend is deployed with **AWS Amplify Hosting**. The backend (sensor-api) is deployed separately with CDK; Amplify builds this app and sets the API URL at build time.

### 1. Get the API URL

From the sensor-api CDK deploy output, note **ApiUrl** (e.g. `https://xxxx.execute-api.<region>.amazonaws.com`). No trailing slash.


### 2. Connect Amplify

1. In AWS Console go to **AWS Amplify** → **Create new app** → **Host web app**.
2. Connect your GitHub and select this repository and branch.
3. Amplify will use `amplify.yml`; you do not need to set build command or output in the Console.
4. In **Environment variables**, add:
   - **Key**: `VITE_API_ROUTE`
   - **Value**: the API Gateway URL from step 1 (no trailing slash).
5. Save and deploy. Amplify will build and host the app; the URL will look like `https://main.xxxxx.amplifyapp.com`.

### 3. After deploy

Every push to the connected branch triggers a new build and deploy. To change the API URL, update `VITE_API_ROUTE` in Amplify Console → App settings → Environment variables and redeploy.

## Available scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server (default port 3000; override with `PORT=3005`). |
| `npm run build` | Typecheck and production build into `dist/`. |
| `npm run preview` | Serve the production build locally. |
| `npm test` | Run tests (Vitest). |
