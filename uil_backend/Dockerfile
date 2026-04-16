FROM python:3.9

WORKDIR /app

RUN apt-get update && apt-get install -y netcat-openbsd

# Copy only requirements first (this step rarely changes)
COPY requirements.txt .  
RUN pip install -r requirements.txt

# Now copy the rest of the app
COPY . /app


RUN mkdir -p /app/static
EXPOSE 8000
RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]
