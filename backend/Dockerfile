# 
FROM python:3.9

# 

RUN apt-get update && \
    apt-get install -y locales && \
    sed -i '/sw_TZ.UTF-8/s/^# //g' /etc/locale.gen && \
    locale-gen sw_TZ.UTF-8


ENV LC_ALL=sw_TZ.UTF-8

WORKDIR /app

# 
COPY ./requirements.txt /code/requirements.txt

# 
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# 
COPY . /app

# 
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]