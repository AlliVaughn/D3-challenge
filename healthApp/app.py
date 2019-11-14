from flask import Flask,render_template,jsonify
import pandas as pd

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/data')
def data():

    df = pd.read_csv("/static/data/data.csv")
    return jsonify(df.to_dict(orient="records"))

@app.route('/d3_chart')
def chart(): 
     return render_template('d3_chart.html')

if __name__ == "__main__":
    app.run(debug=True)