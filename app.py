from flask import Flask, render_template_string

app = Flask(__name__)

HTML = """
<!DOCTYPE html>
<html>
<head><title>AI Powered Student</title>
<style>
body{font-family:Arial;background:#f5f7ff;padding:20px;text-align:center}
.card{background:white;padding:20px;border-radius:15px;max-width:500px;margin:auto;box-shadow:0 4px 10px rgba(0,0,0,0.1)}
input{width:80%;padding:10px;border-radius:10px;border:1px solid #ccc}
button{padding:10px 20px;background:#4a5cff;color:white;border:none;border-radius:10px;margin-top:10px}
</style>
</head>
<body>
<div class="card">
<h2>🎓 AI Powered Student Assistant</h2>
<p>Ask any study doubt!</p>
<input id="q" placeholder="Ex: Explain Photosynthesis">
<br><button onclick="ask()">Ask AI</button>
<p id="ans" style="margin-top:20px;text-align:left"></p>
</div>
<script>
function ask(){
let q=document.getElementById('q').value;
document.getElementById('ans').innerHTML="🤖 AI Answer for: <b>"+q+"</b><br><br>This is your AI assistant for H2S Hackathon. It can help with notes, doubts, and study plans. (Connect your LLM API here)";
}
</script>
</body>
</html>
"""

@app.route('/')
def home():
    return render_template_string(HTML)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)