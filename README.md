# verbose-fishstick

This project is a simple REST-API client and server. The front-end is a borrowed project `(author is Maximillian)` and is written in `ReactJs`. The back-end is a `NodeJs` project using the `ExpressJs` framework.

## Pre-requisites
>
> [!IMPORTANT]
> - Install Kubernetes Minikube `https://minikube.sigs.k8s.io/docs/`
> - Install Docker CLI `https://docs.docker.com/reference/cli/docker/`
> - Install NPM `https://www.npmjs.com/`
>
> ## USE MINIKUBE'S DOCKER Registry
> We'll use minikube's docker registry so we can push to docker registry and pull from docker in kubernetes
>
> Test your Docker/Kubernetes setup by following the steps below:
>
> - Start minikube
>`minikube start`
>
> - Set docker env
> ```
> eval $(minikube docker-env)             # Unix shells
> minikube docker-env | Invoke-Expression # PowerShell
>```
> - Build image
> `docker build -t foo:0.0.1 .`
>
> - Run in Minikube
> `kubectl run hello-foo --image=foo:0.0.1 --image-pull-policy=Never`
>
> - Check that it's running
> `kubectl get pods`

## Setup the Kubernetes environment and deploy the Client, Server and Database application

> [!IMPORTANT]
> - Navigate to the `REST-API-Server/kubernetes/configmap-server-template.yaml` file and update the following:
>```
> DB_URI: "YOUR MONGODB URI"
> MAILER_HOST: "YOUR MAILER HOST"
> MAILER_PORT: "YOUR MAILER PORT"
>```
> - Navigate to the `REST-API-Server/kubernetes/secret-server-template.yaml` file and update the following:
>```
> JWT_SECRET: YOUR SECRET IN BASE64 ENCODED
> MAILER_PASS: YOUR SECRET IN BASE64 ENCODED
> MAILER_USER: YOUR SECRET IN BASE64 ENCODED
>```
> - Navigate to the `REST-API-Client/kubernetes/configmap-client-template.yaml` file and update the following:
>```
> // Point to the correct Kubernetes NodePort: kubectl get services -n ns -o wide
> window.REACT_APP_BACKEND_SERVER_ADDR = "http://localhost:30766";
>```
> - Navigate to the `REST-API-Client/kubernetes/secret-client-template.yaml` file and update the following:
>```
> REACT_APP_SECRET: YOUR SECRET IN BASE64 ENCODED
>```
> - Navigate to the following directory and run the following shell scripts to build the docker containers:
> ```
> 1. REST-API-Server/dockerbuild.sh
> 2. REST-API-Client/dockerbuild.sh
> ```
> - Navigate to the following persistent volume and persistent volume claim files and execute the command `kubectl create -f <yamlFile>` in the following sequence:
> ```
> 1. REST-API-Server/kubernetes/pv-server.yaml
> 2. Database/kubernetes/pv-db.yaml
> 3. REST-API-Server/kubernetes/pvc-server.yaml
> 4. Database/kubernetes/pvc-db.yaml
> ```
> - Navigate to the following service files and execute the command `kubectl create -f <yamlFile>` in the following sequence:
> ```
> 1. REST-API-Server/kubernetes/service-server.yaml
> 2. REST-API-Client/kubernetes/service-client.yaml
> 3. Database/kubernetes/service-mongo.yaml
> ```
> - Navigate to the following deployment files and execute the command `kubectl create -f <yamlFile>` in the following sequence:
> ```
> 1. Database/kubernetes/deployment-mongodb.yaml
> 2. REST-API-Client/kubernetes/deployment-client.yaml
> 3. REST-API-Server/kubernetes/deployment-server.yaml
> ```
> - Navigate to the following horizontal pod autoscaling files and execute the command `kubectl create -f <yamlFile>` in the following sequence:
> ```
> 1. REST-API-Server/kubernetes/hpa-server.yaml
> 2. REST-API-Client/kubernetes/hpa-client.yaml
> 3. Database/kubernetes/hpa-db.yaml
> ```
> - Access the frontend client `http://localhost:3000` or `http://<minikubeIP>:31602`
>   
