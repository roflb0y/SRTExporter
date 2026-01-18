This is an exporter for Prometheus that can scrape SRT stats from [OpenIRL's SRTla receiver](https://github.com/OpenIRL/srtla-receiver) and receive the websocket messages from BELABOX (sorta like BELABOX Cloud) using [my homemade solution](https://github.com/roflb0y/BELABOX-Cloud-Homemade).

### Installing:
1. Make sure to have Node v22+ and Typescript v5.8.3+ installed.
2. Clone the repository and cd into it
   ```shell
   git clone https://github.com/roflb0y/SRTExporter
   cd SRTExporter
   ```
3. Rename config.example.yml to config.yml and edit it
   ```shell
   mv config.example.yml config.yml
   nano config.yml
   ```
5. Install all the packages
   ```shell
   npm i
   ```
6. Run
   ```shell
   tsc
   npm run prod
   ```
   If everything works correctly, you should see your metrics page at ```http://<ip>:5050/metrics```.
   Then you should start your application using a process manager, for example pm2:
   ```shell
   npm i pm2 -g
   pm2 start ./dist/index.js --name SRTExporter
   ```
