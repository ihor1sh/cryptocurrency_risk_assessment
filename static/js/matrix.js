// Interactive Risk Matrix
class RiskMatrix {
    constructor() {
        this.risks = [];
        this.matrixContainer = null;
        this.riskPointsContainer = null;
        this.isDragging = false;
        this.draggedElement = null;
        this.init();
    }

    init() {
        // Load saved risks or use defaults
        this.loadRisks();
        this.setupMatrix();
        this.setupControls();
        this.renderMatrix();
        this.updateStats();
    }

    loadRisks() {
        const saved = localStorage.getItem('riskMatrixData');
        if (saved) {
            this.risks = JSON.parse(saved);
        } else {
            // Default risks
            this.risks = [
                { id: 1, name: 'Security Risk', probability: 85, impact: 85, icon: 'fa-shield-alt', color: '#e74c3c' },
                { id: 2, name: 'Economic Risk', probability: 70, impact: 70, icon: 'fa-dollar-sign', color: '#f39c12' },
                { id: 3, name: 'Legal Risk', probability: 65, impact: 65, icon: 'fa-balance-scale', color: '#f39c12' },
                { id: 4, name: 'Operational Risk', probability: 60, impact: 60, icon: 'fa-cogs', color: '#3498db' }
            ];
        }
    }

    saveRisks() {
        localStorage.setItem('riskMatrixData', JSON.stringify(this.risks));
    }

    setupMatrix() {
        this.matrixContainer = document.querySelector('.risk-matrix');
        this.riskPointsContainer = document.querySelector('.risk-points');
        if (!this.matrixContainer || !this.riskPointsContainer) return;
    }

    setupControls() {
        // Add control panel
        const controlsHTML = `
            <div class="matrix-controls">
                <button class="btn-add-risk" onclick="riskMatrix.showAddRiskForm()">
                    <i class="fas fa-plus"></i> Add Risk
                </button>
                <button class="btn-reset" onclick="riskMatrix.resetRisks()">
                    <i class="fas fa-undo"></i> Reset
                </button>
            </div>
        `;
        const analysisChart = document.querySelector('.analysis-chart');
        if (analysisChart) {
            analysisChart.insertAdjacentHTML('afterbegin', controlsHTML);
        }
    }

    renderMatrix() {
        if (!this.riskPointsContainer) return;

        // Clear existing points
        this.riskPointsContainer.innerHTML = '';

        // Render each risk
        this.risks.forEach(risk => {
            const point = this.createRiskPoint(risk);
            this.riskPointsContainer.appendChild(point);
        });
    }

    createRiskPoint(risk) {
        const point = document.createElement('div');
        point.className = 'risk-point interactive-risk';
        point.dataset.riskId = risk.id;
        
        // Calculate position (probability = Y, impact = X)
        const left = (risk.impact / 100) * 100;
        const bottom = (risk.probability / 100) * 100;
        
        point.style.left = `${left}%`;
        point.style.bottom = `${bottom}%`;
        point.style.background = risk.color;
        point.style.cursor = 'move';
        
        point.innerHTML = `<i class="fas ${risk.icon}"></i>`;
        point.title = `${risk.name}: ${risk.probability}% probability, ${risk.impact}% impact`;
        
        // Make draggable
        this.makeDraggable(point, risk);
        
        // Click to edit
        point.addEventListener('click', (e) => {
            if (!this.isDragging) {
                this.showEditRiskForm(risk);
            }
        });

        return point;
    }

    makeDraggable(element, risk) {
        const self = this;
        let startX, startY, startLeft, startBottom;

        element.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return; // Only left mouse button
            
            self.isDragging = true;
            self.draggedElement = element;
            element.style.zIndex = '1000';
            
            const rect = self.riskPointsContainer.getBoundingClientRect();
            startX = e.clientX;
            startY = e.clientY;
            startLeft = risk.impact;
            startBottom = risk.probability;

            const onMouseMove = (e) => {
                const deltaX = e.clientX - startX;
                const deltaY = startY - e.clientY; // Inverted for bottom positioning
                
                const containerWidth = rect.width;
                const containerHeight = rect.height;
                
                const newLeft = Math.max(0, Math.min(100, startLeft + (deltaX / containerWidth) * 100));
                const newBottom = Math.max(0, Math.min(100, startBottom + (deltaY / containerHeight) * 100));
                
                element.style.left = `${newLeft}%`;
                element.style.bottom = `${newBottom}%`;
                
                // Update risk values
                risk.impact = Math.round(newLeft);
                risk.probability = Math.round(newBottom);
            };

            const onMouseUp = () => {
                self.isDragging = false;
                self.draggedElement = null;
                element.style.zIndex = '10';
                
                // Save updated position
                self.saveRisks();
                self.updateStats();
                self.updateRiskTooltip(element, risk);
                
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }

    updateRiskTooltip(element, risk) {
        element.title = `${risk.name}: ${risk.probability}% probability, ${risk.impact}% impact`;
    }

    showAddRiskForm(event) {
        let probability = 50;
        let impact = 50;
        
        // If clicked on matrix, calculate position
        if (event && event.target.classList.contains('matrix-cell')) {
            const rect = this.riskPointsContainer.getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            const clickY = rect.bottom - event.clientY;
            
            impact = Math.round((clickX / rect.width) * 100);
            probability = Math.round((clickY / rect.height) * 100);
            
            impact = Math.max(0, Math.min(100, impact));
            probability = Math.max(0, Math.min(100, probability));
        }
        
        const newRisk = {
            id: Date.now(),
            name: 'New Risk',
            probability: probability,
            impact: impact,
            icon: 'fa-exclamation-triangle',
            color: '#3498db'
        };
        this.showEditRiskForm(newRisk, true);
    }

    showEditRiskForm(risk, isNew = false) {
        const formHTML = `
            <div class="risk-form-modal" id="riskFormModal">
                <div class="risk-form-content">
                    <span class="close-form" onclick="this.closest('.risk-form-modal').remove()">&times;</span>
                    <h3>${isNew ? 'Add' : 'Edit'} Risk</h3>
                    <form id="riskForm" onsubmit="riskMatrix.saveRiskForm(event, ${risk.id}, ${isNew})">
                        <div class="form-group">
                            <label>Risk Name:</label>
                            <input type="text" name="name" value="${risk.name}" required>
                        </div>
                        <div class="form-group">
                            <label>Probability (%):</label>
                            <input type="number" name="probability" min="0" max="100" value="${risk.probability}" required>
                            <input type="range" name="probabilityRange" min="0" max="100" value="${risk.probability}" 
                                   oninput="this.previousElementSibling.value = this.value">
                        </div>
                        <div class="form-group">
                            <label>Impact (%):</label>
                            <input type="number" name="impact" min="0" max="100" value="${risk.impact}" required>
                            <input type="range" name="impactRange" min="0" max="100" value="${risk.impact}"
                                   oninput="this.previousElementSibling.value = this.value">
                        </div>
                        <div class="form-group">
                            <label>Icon:</label>
                            <select name="icon">
                                <option value="fa-shield-alt" ${risk.icon === 'fa-shield-alt' ? 'selected' : ''}>Shield</option>
                                <option value="fa-dollar-sign" ${risk.icon === 'fa-dollar-sign' ? 'selected' : ''}>Dollar</option>
                                <option value="fa-balance-scale" ${risk.icon === 'fa-balance-scale' ? 'selected' : ''}>Scale</option>
                                <option value="fa-cogs" ${risk.icon === 'fa-cogs' ? 'selected' : ''}>Gear</option>
                                <option value="fa-exclamation-triangle" ${risk.icon === 'fa-exclamation-triangle' ? 'selected' : ''}>Warning</option>
                                <option value="fa-lock" ${risk.icon === 'fa-lock' ? 'selected' : ''}>Lock</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Color:</label>
                            <input type="color" name="color" value="${risk.color}">
                        </div>
                        <div class="form-buttons">
                            <button type="submit" class="btn-save">Save</button>
                            ${!isNew ? `<button type="button" class="btn-delete" onclick="riskMatrix.deleteRisk(${risk.id})">Delete</button>` : ''}
                            <button type="button" class="btn-cancel" onclick="this.closest('.risk-form-modal').remove()">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        // Remove existing modal if any
        const existing = document.getElementById('riskFormModal');
        if (existing) existing.remove();
        
        document.body.insertAdjacentHTML('beforeend', formHTML);
        
        // Sync range inputs with number inputs
        const form = document.getElementById('riskForm');
        form.querySelectorAll('input[type="range"]').forEach(range => {
            const numberInput = range.previousElementSibling;
            range.addEventListener('input', () => {
                numberInput.value = range.value;
            });
            numberInput.addEventListener('input', () => {
                range.value = numberInput.value;
            });
        });
    }

    saveRiskForm(event, riskId, isNew) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        
        const riskData = {
            id: riskId,
            name: formData.get('name'),
            probability: parseInt(formData.get('probability')),
            impact: parseInt(formData.get('impact')),
            icon: formData.get('icon'),
            color: formData.get('color')
        };
        
        if (isNew) {
            this.risks.push(riskData);
        } else {
            const index = this.risks.findIndex(r => r.id === riskId);
            if (index !== -1) {
                this.risks[index] = riskData;
            }
        }
        
        this.saveRisks();
        this.renderMatrix();
        this.updateStats();
        document.getElementById('riskFormModal').remove();
    }

    deleteRisk(riskId) {
        if (confirm('Are you sure you want to delete this risk?')) {
            this.risks = this.risks.filter(r => r.id !== riskId);
            this.saveRisks();
            this.renderMatrix();
            this.updateStats();
            document.getElementById('riskFormModal').remove();
        }
    }

    resetRisks() {
        if (confirm('Reset all risks to default values?')) {
            localStorage.removeItem('riskMatrixData');
            this.loadRisks();
            this.renderMatrix();
            this.updateStats();
        }
    }

    updateStats() {
        // Update stat cards
        this.risks.forEach(risk => {
            const statCard = document.querySelector(`.stat-card[data-risk="${risk.name}"]`);
            if (statCard) {
                const valueElement = statCard.querySelector('.stat-value');
                if (valueElement) {
                    // Calculate average of probability and impact
                    const avg = Math.round((risk.probability + risk.impact) / 2);
                    valueElement.textContent = `${avg}%`;
                }
            }
        });
        
        // Update all stat cards dynamically
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach((card, index) => {
            if (this.risks[index]) {
                const risk = this.risks[index];
                const avg = Math.round((risk.probability + risk.impact) / 2);
                const valueElement = card.querySelector('.stat-value');
                if (valueElement) {
                    valueElement.textContent = `${avg}%`;
                }
                const labelElement = card.querySelector('.stat-label');
                if (labelElement) {
                    labelElement.textContent = risk.name;
                }
            }
        });
    }
}

// Initialize when page loads
let riskMatrix;
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.risk-matrix')) {
        riskMatrix = new RiskMatrix();
    }
});

