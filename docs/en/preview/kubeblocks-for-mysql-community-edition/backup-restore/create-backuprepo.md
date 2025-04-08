---
title: Create a Backup Repository for KubeBlocks
description: Learn how to create and configure a BackupRepo for KubeBlocks using an S3 bucket to store backup data.
keywords: [KubeBlocks, Backup, BackupRepo, S3, Kubernetes]
sidebar_position: 1
sidebar_label: Create BackupRepo
---

# Create a BackupRepo for KubeBlocks

This guide walks you through creating and configuring a BackupRepo in KubeBlocks using an S3 bucket for storing backup data.

## Prerequisites
- AWS CLI configured with appropriate permissions to create S3 buckets.
- kubectl access to your Kubernetes cluster.
- KubeBlocks installed and running in the kb-system namespace.

## Step 1: Create S3 Bucket

Use the AWS CLI to create an S3 bucket in your desired region. Replace `<your-region>` with your target AWS region (e.g., `us-east-1`, `ap-southeast-1`).

```bash
$  aws s3api create-bucket --bucket kubeblocks-backup-repo --region <your-region> --create-bucket-configuration LocationConstraint=<your-region>
```

Example (for us-west-1):
```bash
aws s3api create-bucket \
  --bucket kubeblocks-backup-repo \
  --region us-west-1 \
  --create-bucket-configuration LocationConstraint=us-west-1
```

Expected Output:

```json
{
"Location": "http://kubeblocks-backup-repo.s3.amazonaws.com/"
}
```

Verification:
Confirm the bucket was created by listing its contents (it will be empty initially):

```bash
$ aws s3 ls s3://kubeblocks-backup-repo
```

## Step 2: Create a Kubernetes Secret for AWS Credentials

Store your AWS credentials securely in a Kubernetes Secret. Replace <ACCESS_KEY> and <SECRET_KEY> with your actual AWS credentials:

```bash
# Create a secret to save the access key
kubectl create secret generic s3-credential-for-backuprepo \
  --from-literal=accessKeyId=<ACCESS KEY> \
  --from-literal=secretAccessKey=<SECRET KEY> \
  -n kb-system
```

## Step 3: Configure Backup Repository

A BackupRepo is a custom resource that defines a storage repository for backups. In this step, you'll integrate your S3 bucket with KubeBlocks by creating a BackupRepo resource.

Apply the following YAML to create the BackupRepo. Replace fields(e.g., bucket name, region) with your specific settings.

```yaml
kubectl apply -f - <<EOF
apiVersion: dataprotection.kubeblocks.io/v1alpha1
kind: BackupRepo
metadata:
  name: s3-repo
  annotations:
    dataprotection.kubeblocks.io/is-default-repo: 'true'
spec:
  # Currently, KubeBlocks supports configuring various object storage services as backup repositories
  # - s3 (Amazon Simple Storage Service)
  # - oss (Alibaba Cloud Object Storage Service)
  # - cos (Tencent Cloud Object Storage)
  # - gcs (Google Cloud Storage)
  # - obs (Huawei Cloud Object Storage)
  # - minio, and other S3-compatible services.
  storageProviderRef: s3
  # Specifies the access method of the backup repository.
  # - Tool
  # - Mount
  accessMethod: Tool
  # Specifies reclaim policy of the PV created by this backup repository.
  pvReclaimPolicy: Retain
  # Specifies the capacity of the PVC created by this backup repository.
  volumeCapacity: 100Gi
  # Stores the non-secret configuration parameters for the StorageProvider.
  config:
    bucket: kubeblocks-backup-repo
    endpoint: ''
    mountOptions: --memory-limit 1000 --dir-mode 0777 --file-mode 0666
    region: us-west-1
  # References to the secret that holds the credentials for the StorageProvider.
  credential:
    # name is unique within a namespace to reference a secret resource.
    name: s3-credential-for-backuprepo
    # namespace defines the space within which the secret name must be unique.
    namespace: kb-system
EOF
```

## Step 4: Verify Backup Repository Status

Check the status of the BackupRepo to ensure it is correctly initialized:

```bash
kubectl get backuprepo s3-repo -w
```

Expected Status Flow:
```bash
NAME      STATUS        STORAGEPROVIDER   ACCESSMETHOD   DEFAULT   AGE
s3-repo   PreChecking   s3                Tool           true      5s
s3-repo   Ready         s3                Tool           true      35s
```

Troubleshooting:
 - If status becomes Failed:
   - Verify bucket name and region match your S3 configuration. 
   - Confirm AWS credentials in the Secret are correct. 
   - Check network connectivity between KubeBlocks and AWS S3.