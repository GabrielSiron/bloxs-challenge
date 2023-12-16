FROM python:3.11.3-slim-bullseye

RUN mkdir app/

WORKDIR app/

COPY . .

RUN apt-get update \
    && apt-get upgrade -y \
    && apt-get install -y gcc default-libmysqlclient-dev pkg-config \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip \
    && pip install mysqlclient \
    && pip install -r requirements.txt

EXPOSE 5000

CMD ["flask", "run", "--reload", "--host=0.0.0.0"]