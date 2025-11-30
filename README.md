# Cryptocurrency Risk Assessment Application

Web application built with Python (Flask) for analyzing and assessing risks of using cryptocurrencies and blockchain technologies in the public sector.

## Research Topic
Risks of Using Cryptocurrencies in the Public Sector

## 🚀 Quick Start

### Option 1: Docker (Recommended)

1. Run the application using Docker Compose:
```bash
docker-compose up
```

2. Open your browser and navigate to:
```
http://localhost:5000
```

3. To stop the application, press `Ctrl+C` or run:
```bash
docker-compose down
```

### Option 2: Local Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the application:
```bash
python app.py
```

3. Open your browser and navigate to:
```
http://localhost:5000
```

## 📁 Project Structure

```
App_for_aspirant/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── Dockerfile            # Docker image configuration
├── docker-compose.yml    # Docker Compose configuration
├── .gitignore            # Git ignore file
├── templates/            # HTML templates
│   ├── base.html         # Base template
│   ├── index.html        # Home page
│   ├── risks.html        # Risks page
│   ├── analysis.html     # Analysis page
│   └── recommendations.html # Recommendations page
├── static/              # Static files
│   ├── css/
│   │   └── style.css    # Styles
│   ├── js/
│   │   └── main.js      # JavaScript functionality
│   └── images/          # Images (SVG)
└── README.md            # Documentation
```

## 📋 Features

### Main Pages:
- **Home** - General information about the research
- **Risks** - Risk categories (technical, economic, legal, operational)
- **Analysis** - Risk matrix and quantitative analysis
- **Recommendations** - Strategic and practical recommendations

### Interface Settings:
- Font size adjustment
- Font family selection
- Color customization (primary, secondary, background, text)
- Settings saved in localStorage

### Additional Features:
- Action buttons (print, share, settings)
- Responsive design
- Navigation between pages

## 🛠️ Technologies Used

- **Backend**: Python, Flask
- **Frontend**: HTML5, CSS3, JavaScript
- **Icons**: Font Awesome
- **Styling**: CSS Variables for dynamic theme changes

## 📤 Deploying to GitHub

### Step 1: Initialize Git Repository

If you haven't already, initialize a git repository:

```bash
git init
```

### Step 2: Add All Files

```bash
git add .
```

### Step 3: Create Initial Commit

```bash
git commit -m "Initial commit: Cryptocurrency Risk Assessment Application"
```

### Step 4: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Name your repository (e.g., `cryptocurrency-risk-assessment`)
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

### Step 5: Connect Local Repository to GitHub

GitHub will show you commands. Use these (replace `YOUR_USERNAME` and `YOUR_REPO_NAME`):

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### Step 6: Verify

Visit your repository on GitHub to verify all files are uploaded.

## 🌐 Deploying to Production (Render.com - Free)

Since Flask requires a server, you can deploy to Render.com for free:

### Step 1: Create Account
1. Go to [Render.com](https://render.com)
2. Sign up with your GitHub account

### Step 2: Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Select your repository

### Step 3: Configure Settings
- **Name**: cryptocurrency-risk-assessment (or your choice)
- **Environment**: Python 3
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn app:app`

### Step 4: Add Gunicorn to Requirements

Update `requirements.txt` to include:
```
Flask==3.0.0
Werkzeug==3.0.1
gunicorn==21.2.0
```

### Step 5: Deploy
Click "Create Web Service" and wait for deployment.

### Step 6: Update app.py for Production

Update the last lines of `app.py`:

```python
if __name__ == '__main__':
    # For local development
    app.run(debug=True, host='0.0.0.0', port=5000)
    # For production, Render will use gunicorn
```

## 📝 For Instructors/Reviewers

### To Run Locally:

1. **Clone the repository:**
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Run the application:**
```bash
python app.py
```

4. **Access the application:**
Open browser at `http://localhost:5000`

### To Run with Docker:

```bash
docker-compose up
```

The application will be available at `http://localhost:5000`

### Application Pages:
- Home: `/`
- Risks: `/risks`
- Analysis: `/analysis`
- Recommendations: `/recommendations`
- Settings API: `/api/settings`

## 📄 License

This project is created for academic research purposes.

## 👤 Author

Graduate Student - Research on Risks of Using Cryptocurrencies in the Public Sector

---

**Note**: All content is in English. The application includes risk analysis matrix, interactive visualizations, and comprehensive documentation about cryptocurrency risks in the public sector.
