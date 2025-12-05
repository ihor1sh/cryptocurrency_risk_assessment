from flask import Flask, render_template, request, jsonify
import json
import os
import requests
from datetime import datetime, timedelta
import random

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

@app.route('/blockchain-attacks')
def blockchain_attacks():
    return render_template('blockchain_attacks.html', page='blockchain_attacks')

@app.route('/api/blockchain-attacks', methods=['GET'])
def get_blockchain_attacks():
    """API endpoint to get data about attack probability on BTC blockchain"""
    try:
        # Get Bitcoin basic information via CoinGecko API
        btc_data = {}
        try:
            response = requests.get(
                'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_market_cap=true&include_24hr_change=true',
                timeout=5
            )
            if response.status_code == 200:
                btc_data = response.json().get('bitcoin', {})
        except:
            # If API is unavailable, use mock data
            btc_data = {
                'usd': 45000,
                'usd_market_cap': 850000000000,
                'usd_24h_change': 2.5
            }
        
        # Get mining pool distribution from mempool.space API (real-time data)
        mining_pools = []
        network_hash_rate = None
        total_blocks = 0
        top_pools_combined = 0
        
        try:
            response = requests.get(
                'https://mempool.space/api/v1/mining/pools/24h',
                timeout=10
            )
            if response.status_code == 200:
                data = response.json()
                pools_data = data.get('pools', [])
                total_blocks = data.get('blockCount', 0)
                
                # Get network hash rate if available
                network_hash_rate = data.get('lastEstimatedHashrate')
                
                # Calculate percentage for each pool based on blockCount
                if total_blocks > 0:
                    for pool in pools_data:
                        block_count = pool.get('blockCount', 0)
                        hash_rate_percent = (block_count / total_blocks) * 100
                        mining_pools.append({
                            'name': pool.get('name', 'Unknown'),
                            'hash_rate_percent': round(hash_rate_percent, 2),
                            'block_count': block_count,
                            'rank': pool.get('rank', 0),
                            'link': pool.get('link', '')
                        })
                    
                    # Sort by hash rate percentage (descending)
                    mining_pools.sort(key=lambda x: x['hash_rate_percent'], reverse=True)
                    
                    # Calculate top 2 pools combined percentage
                    if len(mining_pools) >= 2:
                        top_pools_combined = mining_pools[0]['hash_rate_percent'] + mining_pools[1]['hash_rate_percent']
                    elif len(mining_pools) >= 1:
                        top_pools_combined = mining_pools[0]['hash_rate_percent']
        except Exception as e:
            # Fallback to default data if API fails
            print(f"Error fetching pool data: {e}")
            mining_pools = [
                {'name': 'Foundry USA', 'hash_rate_percent': 28.5, 'block_count': 32, 'rank': 1, 'link': 'https://foundrydigital.com'},
                {'name': 'Antpool', 'hash_rate_percent': 22.3, 'block_count': 22, 'rank': 2, 'link': 'https://www.antpool.com'},
                {'name': 'ViaBTC', 'hash_rate_percent': 14.8, 'block_count': 18, 'rank': 3, 'link': 'https://viabtc.com'},
                {'name': 'F2Pool', 'hash_rate_percent': 12.3, 'block_count': 15, 'rank': 4, 'link': 'https://www.f2pool.com'},
                {'name': 'Others', 'hash_rate_percent': 22.1, 'block_count': 35, 'rank': 0, 'link': ''}
            ]
            top_pools_combined = 50.8
        
        # Calculate 51% attack probability based on real pool distribution
        # If top pools together control >50%, risk increases
        if top_pools_combined > 50:
            attack_51_probability = min(5.0, (top_pools_combined - 50) * 0.5)
        else:
            # Low risk if no single entity controls >50%
            attack_51_probability = max(0.1, (50 - top_pools_combined) * 0.1)
        
        # Unified attack probabilities with logical scale
        attacks = [
            {
                'name': '51% Attack',
                'description': 'Attack where one party controls majority of network computational power',
                'probability': round(attack_51_probability, 2),
                'severity': 'Critical',
                'status': 'Low Risk' if attack_51_probability < 2 else 'Medium Risk' if attack_51_probability < 4 else 'High Risk',
                'last_occurrence': 'Never (Bitcoin network)',
                'mitigation': 'High network hash rate makes this attack economically unfeasible. Current pool distribution: top 2 pools control {}%'.format(round(top_pools_combined, 1))
            },
            {
                'name': 'Double Spending',
                'description': 'Attempt to spend the same funds twice',
                'probability': 0.5,
                'severity': 'High',
                'status': 'Very Low Risk',
                'last_occurrence': 'Rare (requires 51% attack)',
                'mitigation': 'Transaction confirmations through the network make this practically impossible'
            },
            {
                'name': 'Eclipse Attack',
                'description': 'Isolation of a node from the rest of the network',
                'probability': 1.0,
                'severity': 'Medium',
                'status': 'Low Risk',
                'last_occurrence': 'Theoretical',
                'mitigation': 'Using multiple peer connections and random peer selection'
            },
            {
                'name': 'Sybil Attack',
                'description': 'Creation of large number of fake identities',
                'probability': 1.0,
                'severity': 'Medium',
                'status': 'Low Risk',
                'last_occurrence': 'Theoretical',
                'mitigation': 'Proof-of-Work makes creating fake nodes expensive'
            },
            {
                'name': 'Selfish Mining',
                'description': 'Mining strategy that allows obtaining unfair share of rewards',
                'probability': 1.5,
                'severity': 'Low',
                'status': 'Low Risk',
                'last_occurrence': 'Theoretical',
                'mitigation': 'Large number of miners makes this unprofitable'
            },
            {
                'name': 'Transaction Malleability',
                'description': 'Manipulation of transactions before their confirmation',
                'probability': 0.1,
                'severity': 'Low',
                'status': 'Very Low Risk',
                'last_occurrence': 'Fixed in SegWit',
                'mitigation': 'Segregated Witness (SegWit) solved this issue'
            }
        ]
        
        # Calculate total risk level
        total_risk = sum(attack['probability'] for attack in attacks)
        risk_level = 'Low' if total_risk < 5 else 'Medium' if total_risk < 10 else 'High'
        
        # Format hash rate
        hash_rate_display = '~500 EH/s (estimated)'
        if network_hash_rate:
            try:
                # Convert from hashes per second to EH/s (exahashes per second)
                hash_rate_eh = float(network_hash_rate) / 1e18
                hash_rate_display = f'~{hash_rate_eh:.1f} EH/s'
            except (ValueError, TypeError):
                pass
        
        return jsonify({
            'success': True,
            'bitcoin_data': btc_data,
            'attacks': attacks,
            'mining_pools': mining_pools,
            'top_pools_combined': round(top_pools_combined, 1),
            'total_blocks_24h': total_blocks,
            'total_risk_score': round(total_risk, 2),
            'risk_level': risk_level,
            'last_updated': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'network_hash_rate': hash_rate_display,
            'network_nodes': '~15,000+',
            'block_height': 'Latest',
            'data_source': 'mempool.space API'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

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

