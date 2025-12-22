## Development Setup

To run this project locally, you need to connect it to your own Google Cloud / Firebase project.

### 1. Prerequisites

-   Go 1.22+
-   Node.js 20+
-   Google Cloud Project: You need a project with **Firestore** enabled.

### 2. Google Cloud & Firebase Setup

1.  **Create a Project**: Go to the [Google Cloud Console](https://console.cloud.google.com/) and create a new project.
2.  **Enable APIs**:
    -   Go to "APIs & Services" > "Library".
    -   Search for and enable **"Google Firestore API"**.
3.  **Create Service Account**:
    -   Go to "IAM & Admin" > "Service Accounts".
    -   Click "Create Service Account".
    -   Name it (e.g., `backend-server-acc`).
    -   **Grant Role**: Select **"Cloud Datastore User"** (or "Firestore User").
    -   Click "Done".
4.  **Download Key**:
    -   Click on the newly created service account email.
    -   Go to the "Keys" tab > "Add Key" > "Create new key".
    -   Select **JSON**.

### 3. Backend Configuration (Go)

1.  **Navigate to the backend folder**:

    ```bash
    cd go
    ```

2.  **Create Environment File**:

    ```bash
    cp .env.example .env
    ```

3.  **Configure `.env`**:
    Open `.env` and fill in the details. It should look like this:

    ```env
    CLIENT_ID=(your google client id)
    CLIENT_SECRET=(your google client secret)
    GOOGLE_PROJECT_ID=(your google cloud project name)
    CLIENT_CALLBACK_URL=http://localhost:5000/auth/google/callback
    FRONTEND_URL=http://localhost:3000
    ```

4.  **Install Dependencies**:

    ```bash
    go mod download / go mod tidy
    ```

5.  **Run the Server**:
    ```bash
    go run cmd/main.go
    ```
    _You should see: `[GIN-debug] Listening and serving HTTP on :5000`_

### 4. Frontend Configuration (Next.js)

1.  **Create Environment File**:
    Create a file named `.env.local` in the `frontend/` root:

    ```env
    BACKEND_URL=http://localhost:5000
    ```

2.  **Install Dependencies**:

    ```bash
    npm install
    ```

3.  **Run the Frontend**:
    ```bash
    npm run dev
    ```
    _Open [http://localhost:3000](http://localhost:3000) in your browser._
