FROM python:3.11-slim-buster 

RUN mkdir app/

WORKDIR app/

COPY . .

RUN pip3 install -r requirements.txt

EXPOSE 5000

CMD ["flask", "run", "--reload", "--host=0.0.0.0"]