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

   Create a `.env` file in the project root (or copy from an example). For local development you need the API PROXY URL. The app can use either:
   - **Local API URL**: Set `REACT_APP_API_PROXY_ROUTE` to your local API URL (e.g. `http://localhost:3000`). The dev server will proxy `/api` requests to that URL. Leave `REACT_APP_API_ROUTE` unset so the app uses the proxy.
   - **Deployed API URL**: Set `REACT_APP_API_PROXY_ROUTE` to the full API URL (e.g. `https://xxxx.execute-api.<region>.amazonaws.com`). No trailing slash. Leave `REACT_APP_API_ROUTE` unset so the app uses the proxy.

   See [Environment variables](#environment-variables) for the full list.

3. **Run the app**

   ```bash
   npm start
   ```

   Opens [http://localhost:3000](http://localhost:3000). Ensure the [sensor-api](https://github.com/tiinsk/sensor-api) is running (e.g. locally or against a deployed API).

   ```bash
   PORT=3001 npm start
   ```
   Alternatively runs the app in a different port.


## Environment variables

All are optional at build time, but the app needs an API URL to work.

| Variable | Required | Description |
|----------|----------|-------------|
| `REACT_APP_API_ROUTE` | For production | API base URL (e.g. `https://xxxx.execute-api.region.amazonaws.com`). Set in Amplify for production builds. No trailing slash. |
| `REACT_APP_API_PROXY_ROUTE` | For local dev | URL the dev server proxies `/api` to (e.g. `http://localhost:3000`). Used when running `npm start`. |

Do not commit `.env` with secrets. Production uses Amplify environment variables only.

## Deployment (AWS Amplify)

The frontend is deployed with **AWS Amplify Hosting**. The backend (sensor-api) is deployed separately with CDK; Amplify builds this app and sets the API URL at build time.

### 1. Get the API URL

From the sensor-api CDK deploy output, note **ApiUrl** (e.g. `https://xxxx.execute-api.<region>.amazonaws.com`). No trailing slash.


### 3. Connect Amplify

1. In AWS Console go to **AWS Amplify** → **Create new app** → **Host web app**.
2. Connect your GitHub and select this repository and branch.
3. Amplify will use `amplify.yml`; you do not need to set build command or output in the Console.
4. In **Environment variables**, add:
   - **Key**: `REACT_APP_API_ROUTE`
   - **Value**: the API Gateway URL from step 1 (no trailing slash).
5. Save and deploy. Amplify will build and host the app; the URL will look like `https://main.xxxxx.amplifyapp.com`.

### 4. After deploy

Every push to the connected branch triggers a new build and deploy. To change the API URL, update `REACT_APP_API_ROUTE` in Amplify Console → App settings → Environment variables and redeploy.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Runs the app in development mode at [http://localhost:3006](http://localhost:3006). |
| `npm run build` | Builds the app for production into the `build` folder. |
| `npm test` | Runs the test suite. |
| `npm run eject` | Ejects from Create React App (one-way). |
