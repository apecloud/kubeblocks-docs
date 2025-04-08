---
title: Setting Up a MySQL Cluster with Scheduled Backups in KubeBlocks
description: Learn how to deploy a MySQL cluster using KubeBlocks and configure automated scheduled backups with retention in an S3 repository.
keywords: [MySQL, Backup, KubeBlocks, Scheduled Backup, Kubernetes]
sidebar_position: 3
sidebar_label: Scheduled Backups
---


# Setting Up a MySQL Cluster with Scheduled Backups in KubeBlocks

This guide demonstrates how to deploy a MySQL cluster using KubeBlocks and configure scheduled backups with retention in an S3 repository.

## Prerequisites

Before proceeding, ensure the following:
- Environment Setup:
    - A Kubernetes cluster is up and running.
    - The kubectl CLI tool is configured to communicate with your cluster.
    - KubeBlocks CLI and KubeBlocks Operator are installed. Follow the installation instructions here.
- Namespace Preparation: To keep resources isolated, create a dedicated namespace for this tutorial:

```bash
$ kubectl create ns demo
namespace/demo created
```

## Deploy a MySQL Semi-Synchronous Cluster

KubeBlocks uses a declarative approach for managing MySQL clusters. Below is an example configuration for deploying a MySQL cluster with 2 nodes (1 primary, 1 replicas) in semi-synchronous mode and scheduled backups.

Cluster Configuration
```yaml
kubectl apply -f - <<EOF
apiVersion: apps.kubeblocks.io/v1
kind: Cluster
metadata:
  name: example-mysql-cluster
  namespace: demo
spec:
  clusterDef: mysql
  topology: semisync
  terminationPolicy: WipeOut
  componentSpecs:
    - name: mysql
      serviceVersion: 8.0.35
      replicas: 2
      resources:
        limits:
          cpu: '0.5'
          memory: 0.5Gi
        requests:
          cpu: '0.5'
          memory: 0.5Gi
      volumeClaimTemplates:
        - name: data
          spec:
            storageClassName: ""
            accessModes:
              - ReadWriteOnce
            resources:
              requests:
                storage: 20Gi
  backup:
    enabled: true
    retentionPeriod: 30d
    method: xtrabackup
    cronExpression: '0 0 * * *'
    repoName: s3-repo
EOF
```

**Explanation of Key Fields**
- `terminationPolicy: WipeOut`:
  - When set to 'WipeOut', deleting the cluster also deletes all associated data, including backups.
  - For production environments, it is recommended to use `terminationPolicy: Delete`, which retains backup data even after the cluster is deleted.
- `backup.enabled: true`: Enables scheduled backups for the cluster.
- `method: xtrabackup`: Specifies the backup tool to be used (e.g., Percona XtraBackup).
- `cronExpression: '0 0 * * *'`: Configures the backup schedule to run daily at midnight (UTC).
- `retentionPeriod: 30d`: Retains backups for 30 days.
- `repoName: s3-repo`: Specifies the S3 repository for storing backups.

## Verifying the Deployment

Monitor the cluster status until it transitions to Running:

```bash
$ kubectl get cluster example-mysql-cluster -n demo
```

Expected Output:
```bash
NAME                             CLUSTER-DEFINITION   TERMINATION-POLICY   STATUS    AGE
example-mysql-cluster   mysql                Delete               Running   38s
```
Once the status is Running, the MySQL cluster is successfully deployed.

## Check the BackupSchedule Resource

KubeBlocks automatically creates a BackupSchedule resource when scheduled backups are enabled. Verify the configuration using the following command:

```bash
$ kubectl get backupschedule example-mysql-cluster-mysql-backup-schedule  -n demo -oyaml
```

Expected Output:
```yaml
apiVersion: dataprotection.kubeblocks.io/v1alpha1
kind: BackupSchedule
...
spec:
  backupPolicyName: example-mysql-cluster-mysql-backup-policy
  schedules:
    - backupMethod: xtrabackup
      cronExpression: 0 0 * * *
      enabled: true
      name: xtrabackup
      retentionPeriod: 30d
```

This confirms that the BackupSchedule resource is properly configured with the retention period and cron schedule.


## Validate Backup in S3 Repository

After the scheduled backup task has been executed, verify the backup files in the configured S3 bucket with the following command:

```bash
$ TZ=":UTC" aws s3 ls s3://kubeblocks-backup-repo/ --recursive
```

Expected Output:
```bash
2025-02-06 00:00:52    3087203 demo/example-mysql-cluster-5f46be4f-c9ac-414e-9d66-2dfe0a281b83/mysql/example-mysql-cluster-xtrabackup-20250206000001/example-mysql-cluster-xtrabackup-20250206000001.xbstream.zst
2025-02-06 00:01:03       5348 demo/example-mysql-cluster-5f46be4f-c9ac-414e-9d66-2dfe0a281b83/mysql/example-mysql-cluster-xtrabackup-20250206000001/kubeblocks-backup.json
```
**Backup Files**:
- Compressed Backup Data: 'example-mysql-cluster-xtrabackup-20250206000001.xbstream.zst'
- Backup Metadata: 'kubeblocks-backup.json'

## Cleanup
To remove all created resources, delete the MySQL cluster along with its namespace:

```bash
kubectl delete cluster example-mysql-cluster -n demo
kubectl delete ns demo
```


## Summary

In this guide:
- The backup was executed at midnight UTC (2025-02-06 00:00:52), as defined in the `cronExpression` field of the `backup` configuration.
- The backup files were successfully stored in the specified S3 repository. These include:
  - The compressed backup data file ('example-mysql-cluster-xtrabackup-20250206000001.xbstream.zst').
  - The metadata file ('kubeblocks-backup.json') which contains information about the backup.

By following this guide, you can automate regular backups for your MySQL clusters, ensuring data availability and recovery options.
