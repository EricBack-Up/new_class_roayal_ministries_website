FROM python:3.11

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    build-essential \
    libpq-dev \
    libssl-dev \
    libffi-dev \
    zlib1g-dev \
    libjpeg-dev \
    python3-dev \
    libbz2-dev \
    liblzma-dev \
    libreadline-dev \
    libncurses-dev \
    && rm -rf /var/lib/apt/lists/*

# Ensure pip is installed and upgraded
RUN python -m pip install --upgrade pip

# Install Python dependencies
COPY requirements.txt .
RUN python -m pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Expose port
EXPOSE 8000

# Run the application
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]