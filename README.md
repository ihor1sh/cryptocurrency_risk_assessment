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
│   └── recommendations.html # Recommendations spage
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
