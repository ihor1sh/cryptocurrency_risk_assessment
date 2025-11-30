from flask import Flask, render_template, request, jsonify
import json
import os

app = Flask(__name__)

# Default UI settings
DEFAULT_SETTINGS = {
    'font_size': '16px',
    'font_family': 'Arial, sans-serif',
    'primary_color': '#2c3e50',
    'secondary_color': '#3498db',
    'background_color': '#ecf0f1',
    'text_color': '#2c3e50'
}

@app.route('/')
def index():
    return render_template('index.html', page='home')

@app.route('/risks')
def risks():
    return render_template('risks.html', page='risks')

@app.route('/analysis')
def analysis():
    return render_template('analysis.html', page='analysis')

@app.route('/recommendations')
def recommendations():
    return render_template('recommendations.html', page='recommendations')

@app.route('/api/settings', methods=['GET', 'POST'])
def settings():
    if request.method == 'POST':
        settings_data = request.json
        # Save settings (in production, use database or session)
        return jsonify({'status': 'success', 'settings': settings_data})
    else:
        return jsonify(DEFAULT_SETTINGS)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

