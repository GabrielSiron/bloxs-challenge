from apiflask import APIFlask

app = APIFlask(__name__)

@app.get('/')
def home():
    return 'Hello  World!'