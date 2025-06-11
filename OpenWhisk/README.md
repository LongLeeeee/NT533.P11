### Cài đặt K3S

<h6>Với đồ án này nhóm chọn K3S - phiên bản nhẹ hơn, tối giản hơn của Kubernetes để triển khai,quản lý container.</h6>

Cập nhật danh sách gói phần mềm trên tất cả các node.

```sh
sudo apt update
```

Trên máy master, tiến hành tải script có sẵn [tại đây](https://get.k3s.io) để cài đặt K3s.

```sh
curl -sfL https://get.k3s.io | sh -
```

Kết quả sau khi thực hiệnhiện

```sh
...
[INFO]  systemd: Creating service file /etc/systemd/system/k3s.service
[INFO]  systemd: Enabling k3s unit
Created symlink /etc/systemd/system/multi-user.target.wants/k3s.service → /etc/systemd/system/k3s.service.
[INFO]  systemd: Starting k3s
```

Để các worker có thể tham gia và cluster thì cần TOKEN và ip private của máy master. Dùng lệnh sau để lấy TOKEN.

```sh
sudo cat /var/lib/rancher/k3s/server/node-token
K1039dfff51deb76df9c5bf67ab25ec0d95025ac35e07098ae12fd9b15f2c2231be::server:4a335bbb14480ca54b172d7ead439b6d
```

Trên worker node, tiến hành kết nối vào cụm K3s.

```sh
curl -sfL https://get.k3s.io | K3S_URL=https://<master-node-ip>:6443 K3S_TOKEN=<token> sh -
```

Kết quả sau khi thực thi.

```sh
...
[INFO]  systemd: Creating service file /etc/systemd/system/k3s-agent.service
[INFO]  systemd: Enabling k3s-agent unit
Created symlink /etc/systemd/system/multi-user.target.wants/k3s-agent.service → /etc/systemd/system/k3s-agent.service.
[INFO]  systemd: Starting k3s-agent
```

Kiểm tra các node đã tham gia vào cluster hay chưa.

```sh
kubectl get node
NAME               STATUS   ROLES                  AGE     VERSION
ip-172-31-19-209   Ready    <none>                 62s     v1.32.4+k3s1
ip-172-31-24-199   Ready    control-plane,master   6m58s   v1.32.4+k3s1
ip-172-31-25-159   Ready    <none>                 65s     v1.32.4+k3s1
```

Ta thấy các node <strong>ip-172-31-19-209</strong>, <strong>ip-172-31-25-159</strong> đã tham gia vào cụm và <strong>STATUS</strong> ở trạng thái <strong>Ready</strong> tức là không xảy ra lỗi gì.

Kiểm tra các pod nằm trong namespace kube-system - là nơi chứa các thành hệ cốt lõi của Kubernetes cần để hoạt động.

```sh
kubectl get pod -n kube-system
NAME                                      READY   STATUS      RESTARTS   AGE
coredns-697968c856-x74tj                  1/1     Running     0          9m39s
helm-install-traefik-crd-ht69z            0/1     Completed   0          9m40s
helm-install-traefik-kc47j                0/1     Completed   2          9m40s
local-path-provisioner-774c6665dc-w2gmz   1/1     Running     0          9m39s
metrics-server-6f4c6675d5-6wszc           1/1     Running     0          9m39s
svclb-traefik-8d426207-2hmhj              2/2     Running     0          3m49s
svclb-traefik-8d426207-fjh7g              2/2     Running     0          3m52s
svclb-traefik-8d426207-ltshg              2/2     Running     0          9m8s
traefik-c98fdf6fb-m4bsc                   1/1     Running     0          9m8s
```

### Cài đặt Helm

Thêm khóa xác thực GPG cho kho phần mềm Helm vào hệ thống APT trên Ubuntu để đảm bảo các gói cài đặt từ kho đó là đáng tin cậy và không bị chỉnh sửa.

```sh
curl https://baltocdn.com/helm/signing.asc | sudo apt-key add -
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0Warning: apt-key is deprecated. Manage keyring files in trusted.gpg.d instead (see apt-key(8)).
100  1699  100  1699    0     0   6105      0 --:--:-- --:--:-- --:--:--  6111
OK
```

Cài đặt gói apt-transport-https cho phép hệ thống APT tải gói phần mềm từ các kho sử dụng giao thức HTTPS thay vì HTTP (vì APT chỉ hỗ trợ HTTP).

```sh
sudo apt-get install apt-transport-https --yes
```

Thêm Helm vào danh sách các nguồn APT.

```sh
echo "deb https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
```

Cập nhật các gói phần mềm vừa thêm vào.

```sh
sudo apt-get update
```

Sau khi thêm Helm và cập nhật hệ thống của Ubuntu, ta tiến hành tải Helm về.

```sh
sudo apt-get install helm
```

### Cài đặt Openwhisk

Tải OpenWhisk từ GitHub của OpenWhisk.

```sh
git clone https://github.com/apache/openwhisk-deploy-kube.git
cd openwhisk-deploy-kube
```

Kế đến tạo file cấu hình cho hệ thống OpenWhisk. [Example](https://github.com/LongLeeeee/NT533.P11/blob/main/Kubernet/mycluster.yaml)

```sh
nano mycluster.yaml
```

Tạo namespace openwhisk để lưu trũ các tài nguyên của OpenWhisk bên trong ngăn cách với các tài nguyên khác trên cụm.

```sh
~/openwhisk-deploy-kube$ kubectl create namespace openwhisk
namespace/openwhisk created
~/openwhisk-deploy-kube$ sudo kubectl label nodes ip-172-31-25-159 openwhisk-role=invoker
node/ip-172-31-25-159 labeled
~/openwhisk-deploy-kube$ sudo kubectl label nodes ip-172-31-19-209 openwhisk-role=invoker
node/ip-172-31-19-209 labeled
~/openwhisk-deploy-kube$ sudo kubectl label nodes ip-172-31-24-199 openwhisk-role=core
node/ip-172-31-24-199 labeled
```

Triển khai OpenWhisk lên Kubernetes bằng Helm chart, với các cấu hình được chỉ định trong tệp mycluster.yaml.

```sh
helm install nt533 ./helm/openwhisk -n openwhisk -f mycluster.yaml
NAME: nt533
LAST DEPLOYED: Sun May 11 05:47:25 2025
NAMESPACE: openwhisk
STATUS: deployed
REVISION: 1
NOTES:
Apache OpenWhisk
Copyright 2016-2021 The Apache Software Foundation

This product includes software developed at
The Apache Software Foundation (http://www.apache.org/).

To configure your wsk cli to connect to it, set the apihost property
using the command below:

  $ wsk property set --apihost :31001

Your release is named nt533.

To learn more about the release, try:

  $ helm status nt533
  $ helm get nt533

Once the 'nt533-install-packages' Pod is in the Completed state, your OpenWhisk deployment is ready to be used.

Once the deployment is ready, you can verify it using:

  $ helm test nt533 --cleanup
```

Chờ OpenWhisk cài đặt đến khi Pod nt533-install-packages với STATUS Completed.

```sh
kubectl get pod -n openwhisk
NAME                                     READY   STATUS      RESTARTS   AGE
nt533-alarmprovider-6cb87749fc-n72tx     1/1     Running     0          24m
nt533-apigateway-864857676b-p7sg6        1/1     Running     0          24m
nt533-controller-0                       1/1     Running     0          24m
nt533-couchdb-54b6bc99f-xkdq6            1/1     Running     0          24m
nt533-gen-certs-zcnvl                    0/1     Completed   0          24m
nt533-init-couchdb-lwqlv                 0/1     Completed   0          24m
nt533-install-packages-ljf2t             0/1     Completed   0          24m
nt533-invoker-0                          1/1     Running     0          24m
nt533-kafka-0                            1/1     Running     0          24m
nt533-kafkaprovider-7cfbd874b8-9jqr9     1/1     Running     0          24m
nt533-nginx-68d9dbdc6f-tm86n             1/1     Running     0          24m
nt533-redis-55f799cb85-4cmmh             1/1     Running     0          24m
nt533-wskadmin                           1/1     Running     0          24m
nt533-zookeeper-0                        1/1     Running     0          24m
wsknt533-invoker-00-5-prewarm-nodejs14   1/1     Running     0          2m28s
```

Như bên trên thì OpenWhisk đã cài đặt thành công.
Để tương tác với OpenWhisk ta cần cài đặt WSK - là một CLI của Apache OpenWhisk được dùng để quản lý và tương tác với hệ thống Functions-as-a-Service (FaaS).

```sh
curl -L -O https://github.com/apache/openwhisk-cli/releases/download/1.1.0/OpenWhisk_CLI-1.1.0-linux-amd64.tgz #tải file nén WSK từ GitHubGitHub
mkdir wsk-cli #tạo folder để chứa WSK
tar -xvzf OpenWhisk_CLI-1.1.0-linux-amd64.tgz -C wsk-cli #Giải nén vào wsk-cli
sudo ln -s /home/ubuntu/openwhisk-deploy-kube/wsk-cli/wsk /usr/local/bin/wsk #tạo đường dẫn trỏ đến WSK
```

Thiết lập thông tin kết nối để tương tác với OpenWhisk. \

- --apihost gồm IP của master node và Port của service Nginx.
- --auth là một đoạn mã base64 lấy từ secret name-whisk.auth trong namespace cài đặt OpenWhisk.

```sh
ubuntu@ip-172-31-24-199:~$ wsk -i property set --apihost http://172.24.199.217:30739
ok: whisk API host set to http://172.24.199.217:30739
ubuntu@ip-172-31-24-199:~$ wsk -i property set --auth 789c46b1-71f6-4ed5-8c54-816aa4f8c502:abczO3xZCLrMN6v2BKK1dXYFpXlPkccOFqm12CdAsMgRU4VrNZ9lyGVCGuMDGIwP
ok: whisk auth set. Run 'wsk property get --auth' to see the new value.
```
