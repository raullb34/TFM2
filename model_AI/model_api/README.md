## SmartWarehouse API for deep intelligence

Flask-restx api developed to serve SmartWarehouse models.

## Install requirements

```
sudo apt update
sudo apt install python3 python3-pip nodejs -y
sudo npm install -g pm2
```

## Run application

Application can be launched with the launch script:
```
sudo bash launch.bash
```
Or using PM2:
```
sudo pm2 start pm2.json
```

Note: if the script `launch.bash` doesn't works, you can use `launch2.bash` instead.
