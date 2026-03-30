# Module 4 — IaC & CI/CD on GCP

## Overview
- Manage GCP infrastructure with Terraform using GCS remote state and proper module structure
- Build CI/CD pipelines with Cloud Build and GitHub Actions using Workload Identity Federation
- Implement multi-environment promotion (dev → staging → prod) with approvals

---

## Terraform with GCP

```
  terraform/
  ├── backend.tf          ← GCS bucket + prefix for state
  ├── main.tf             ← provider config
  ├── variables.tf
  ├── outputs.tf
  └── modules/
      ├── cloud-run/
      │   ├── main.tf     ← google_cloud_run_v2_service
      │   ├── variables.tf
      │   └── outputs.tf
      ├── pubsub/
      └── vpc/

  backend "gcs" {
    bucket = "my-terraform-state"
    prefix = "terraform/state/prod"
  }

  State locking: GCS uses object generation conditions
  (no DynamoDB needed like AWS — built into GCS).
```

---

## Workload Identity Federation (No SA Keys)

```
  GitHub Actions Runner                    GCP
  ──────────────────────                   ────

  workflow: deploy.yml
       │
       │  1. Request OIDC token from GitHub
       ▼
  ┌────────────────┐
  │  GitHub OIDC   │  JWT: { sub: "repo:org/repo:ref:refs/heads/main" }
  │  Provider      │
  └───────┬────────┘
          │
          │  2. Exchange token via STS
          ▼
  ┌────────────────────────────────────┐
  │  GCP Workload Identity Pool        │
  │                                    │
  │  Provider: github-provider         │
  │  Attribute mapping:                │
  │    google.subject = assertion.sub  │
  │    attribute.repository = assertion│
  │               .repository         │
  │                                    │
  │  Principal: principalSet://...     │
  │    attribute.repository/org/repo   │
  └───────────────┬────────────────────┘
                  │
                  │  3. Impersonate Service Account
                  ▼
  ┌──────────────────────────────┐
  │  Service Account             │
  │  github-deploy@proj.iam...   │
  │  roles/run.developer         │
  │  roles/iam.serviceAccountUser│
  └──────────────────────────────┘
          │
          │  4. Short-lived credentials
          ▼
  GitHub Actions uses GCP APIs
  (no long-lived key files anywhere)
```

---

## Multi-Environment Promotion Pipeline

```
  Feature Branch
       │
       │  git push
       ▼
  ┌──────────────────────────────────────┐
  │  PR Checks (Cloud Build / GH Actions)│
  │  ├── terraform plan (dev)            │
  │  ├── lint + tests                    │
  │  └── security scan (tfsec)           │
  └──────────────────────────────────────┘
       │
       │  Merge to main
       ▼
  ┌──────────────────────────────────────┐
  │  Deploy to DEV (auto)                │
  │  terraform apply dev/                │
  │  Run integration tests               │
  └──────────────────┬───────────────────┘
                     │  ✓ all tests pass
                     ▼
  ┌──────────────────────────────────────┐
  │  Deploy to STAGING (auto)            │
  │  terraform apply staging/            │
  │  Run smoke tests + load tests        │
  └──────────────────┬───────────────────┘
                     │  Manual approval
                     ▼  (GitHub Environment protection)
  ┌──────────────────────────────────────┐
  │  Deploy to PROD                      │
  │  terraform apply prod/               │
  │  Blue/green traffic shift            │
  │  Canary: 5% → 25% → 100%            │
  └──────────────────────────────────────┘
```

---

## Key Concepts

- **Cloud Build YAML**: Steps run in Docker containers — use community builders (`gcr.io/cloud-builders/gcloud`, `hashicorp/terraform`)
- **GCS state locking**: Enabled automatically. No extra resources needed unlike AWS which needs DynamoDB
- **Secret Manager in Terraform**: Use `data "google_secret_manager_secret_version"` to read secrets at apply time
- **`terraform plan` output**: Always save the plan to a file (`-out=tfplan`) and apply that exact plan — prevents drift between plan and apply

---

## Teaching Notes

- **Common mistake**: Running `terraform destroy` in production by mistake — use `prevent_destroy = true` lifecycle block on critical resources
- **Gotcha**: Cloud Build service account needs specific IAM roles — common error is missing `roles/iam.serviceAccountUser` when deploying Cloud Run
- **Environment parity**: Dev should mirror prod as closely as possible — only size/cost should differ, not architecture
- **Terraform versions**: Pin provider versions (`~> 5.0`) and Terraform version (`required_version = "~> 1.7"`) to avoid unexpected upgrades

---

## Practice Exercise

1. Set up Terraform GCS remote state backend for a GCP project
2. Write a Cloud Build trigger that runs `terraform plan` on PR and `terraform apply` on merge
3. Configure Workload Identity Federation for GitHub Actions (no SA key)
4. **Bonus**: Add a manual approval gate before production deployment using GitHub Environment protection rules
