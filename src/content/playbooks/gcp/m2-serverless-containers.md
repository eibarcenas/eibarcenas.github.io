# Module 2 — Serverless & Containers on GCP

## Overview
- Deploy and scale containerized services on Cloud Run with zero infrastructure management
- Understand GKE cluster architecture and choose the right node pool strategy
- Set up a container build and deploy pipeline with Artifact Registry and Cloud Build

---

## Cloud Run Request Scaling

```
  Incoming Requests
  ─────────────────────────────────────────────────────

  0 requests → 0 instances (scale to zero)

  Request arrives:
  ┌─────────────────────────────────────────────────┐
  │  Cold Start: ~200-500ms                         │
  │  ├── Pull image from Artifact Registry          │
  │  ├── Start container                            │
  │  └── First request handled                     │
  └─────────────────────────────────────────────────┘

  Traffic increases:

  ▁▁▃▃▅▅▇▇██▇▇▅▅▃▃▁▁  (request rate)

  [inst1][inst2][inst3][inst4]  ← auto-scaled up

  Each instance handles up to `--concurrency` requests (default 80)

  ┌─────────────────────────────────────────────────┐
  │  Key settings:                                  │
  │  --concurrency 1        → 1 request per instance│
  │  --min-instances 1      → always warm           │
  │  --max-instances 100    → cost cap              │
  │  --cpu-throttling false → CPU always allocated  │
  └─────────────────────────────────────────────────┘
```

---

## GKE Cluster Architecture

```
  GKE Cluster
  ┌─────────────────────────────────────────────────────────┐
  │  Control Plane (Google-managed, free for Autopilot)     │
  │  ├── kube-apiserver                                     │
  │  ├── etcd                                               │
  │  ├── controller-manager                                 │
  │  └── cloud-controller-manager                          │
  └──────────────────────────┬──────────────────────────────┘
                             │
  ┌──────────────────────────▼──────────────────────────────┐
  │  Node Pools (GCE instances you manage)                  │
  │                                                         │
  │  ┌─────────────────┐  ┌──────────────────────────────┐ │
  │  │  System Pool     │  │  Workload Pool               │ │
  │  │  e2-medium x2   │  │  n2-standard-4 x3 (auto-     │ │
  │  │  kube-system    │  │  scaling 1-10)                │ │
  │  │  Pods only      │  │  Your application pods        │ │
  │  └─────────────────┘  └──────────────────────────────┘ │
  │                                                         │
  │  ┌─────────────────────────────────────────────────┐   │
  │  │  Spot Pool (optional, 60-91% cheaper)           │   │
  │  │  Batch jobs, ML training, non-critical workloads│   │
  │  └─────────────────────────────────────────────────┘   │
  └─────────────────────────────────────────────────────────┘
```

---

## Build & Deploy Pipeline

```
  Developer
      │
      │  git push → GitHub
      ▼
  ┌──────────────────────────────────────────────┐
  │  Cloud Build Trigger (on push to main)        │
  │                                              │
  │  Step 1: Build Docker image                  │
  │    docker build -t $IMAGE .                  │
  │                                              │
  │  Step 2: Push to Artifact Registry           │
  │    docker push us-central1-docker.pkg.dev/   │
  │      $PROJECT/repo/api:$COMMIT_SHA           │
  │                                              │
  │  Step 3: Run tests                           │
  │    docker run $IMAGE pytest                  │
  │                                              │
  │  Step 4: Deploy to Cloud Run                 │
  │    gcloud run deploy api                     │
  │      --image=$IMAGE                          │
  │      --region=us-central1                    │
  │      --no-traffic  ← deploy without traffic  │
  │                                              │
  │  Step 5: Smoke test new revision             │
  │    curl --fail $NEW_REVISION_URL/health      │
  │                                              │
  │  Step 6: Shift traffic                       │
  │    gcloud run services update-traffic api    │
  │      --to-latest                             │
  └──────────────────────────────────────────────┘
```

---

## Key Concepts

- **Cloud Run vs Cloud Functions**: Cloud Run is container-based (full control), Cloud Functions is code-only (simpler). Prefer Cloud Run for new services
- **Artifact Registry vs Container Registry**: Container Registry is deprecated — use Artifact Registry
- **GKE Autopilot vs Standard**: Autopilot manages nodes for you (pay per Pod CPU/memory). Standard you manage node pools. Start with Autopilot
- **Cloud Run jobs vs services**: Services handle HTTP requests; Jobs run to completion (batch, cron, migrations)

---

## Teaching Notes

- **Common mistake**: Using `:latest` tag in Cloud Run deployments — rollbacks become impossible. Always use commit SHA
- **Gotcha**: Cloud Run bills per 100ms of CPU time. CPU is throttled between requests by default — use `--no-cpu-throttling` for background processing
- **Security**: Use Binary Authorization to enforce only verified images can deploy to Cloud Run / GKE
- **Secrets**: Never use environment variables for secrets. Use Secret Manager with `--set-secrets` in Cloud Run

---

## Practice Exercise

1. Containerize a FastAPI app and push it to Artifact Registry using Cloud Build
2. Deploy to Cloud Run with a minimum of 1 instance (always warm) and max 10
3. Configure Cloud Run to read a secret from Secret Manager (DB password)
4. **Bonus**: Set up a Cloud Build trigger that deploys to staging on PR merge and to prod after manual approval
