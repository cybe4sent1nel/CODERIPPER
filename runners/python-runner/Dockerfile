FROM python:3.11-slim
WORKDIR /submission
COPY run.sh /usr/local/bin/run.sh
RUN chmod +x /usr/local/bin/run.sh && pip install --no-cache-dir --upgrade pip

# Runner runs inside container: user code is mounted into /submission
ENTRYPOINT ["/usr/local/bin/run.sh"]
