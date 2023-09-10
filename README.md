## Net Scan

Scan the network and show details



### How to use

##### Build and run the backend container

* Build the backend docker image

```bash
cd .../net_scan/backend
docker build -t net_scan_backend:1.0.0 .
```

* Prepare configuration for docker

```bash
mkdir -p /opt/net_scan_backend/docker
cd /opt/net_scan_backend/docker
cp .../net_scan/backend/docker-compose.yaml.j2 docker-compose.yaml
vim docker-compose.yaml
```

* Run the docker container

```bash
docker-compose up -d
```



##### Build and run the frontend container

* Build the frontend docker image

```bash
cd .../net_scan/frontend
cd src
mkdir public
cd public
touch logo.png
cd app
touch favicon.ico

cd ..
docker build -t net_scan_frontend:1.0.0 .
```

* Prepare configuration for docker

```bash
mkdir -p /opt/net_scan_frontend/docker
cd /opt/net_scan_frontend/docker
cp .../net_scan/frontend/docker-compose.yaml.j2 docker-compose.yaml
vim docker-compose.yaml
```

* Run the docker container

```bash
docker-compose up -d
```



#####  Run the reverse proxy web server

* Create a web server configuration (the following is a sample configuration of Caddy)

``` bash
${hostname}:${port} {
  reverse_proxy /api/v1/* ${backend_listen_addr}:${backend_listen_port}
  reverse_proxy * ${frontend_listen_addr}:${frontend_listen_port}
}
```

* Run the web server



