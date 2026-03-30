# Module 4 — IaC & CI/CD on AWS

## Overview
- Master the Terraform workflow for AWS — init, plan, apply, state management
- Build a GitOps CI/CD pipeline with GitHub Actions that deploys to AWS safely
- Understand Terraform state backends, workspaces, and remote execution best practices

---

## Terraform Workflow

```
  Developer Workstation / CI Runner
  ─────────────────────────────────────────────────────────

  ┌─────────────┐
  │ Write .tf   │  main.tf, variables.tf, outputs.tf
  │ files       │  modules/vpc/, modules/ecs/, ...
  └──────┬──────┘
         │
         ▼
  ┌─────────────┐
  │ terraform   │  Downloads providers
  │   init      │  Initializes backend (S3 + DynamoDB lock)
  └──────┬──────┘
         │
         ▼
  ┌─────────────┐
  │ terraform   │  Compares desired state (.tf)
  │   plan      │  vs current state (tfstate)
  │             │  Shows: + create / ~ update / - destroy
  └──────┬──────┘
         │  Review & approve
         ▼
  ┌─────────────┐
  │ terraform   │  Calls AWS APIs
  │   apply     │  Updates tfstate in S3
  └──────┬──────┘
         │
         ▼
  ┌──────────────────────┐
  │  Remote State        │
  │  ┌────────────────┐  │
  │  │  S3 Bucket     │  │  terraform.tfstate (encrypted)
  │  │  (versioned)   │  │
  │  └────────────────┘  │
  │  ┌────────────────┐  │
  │  │ DynamoDB Table │  │  State lock (prevents concurrent apply)
  │  └────────────────┘  │
  └──────────────────────┘
```

---

## GitOps Pipeline with GitHub Actions

```
  Developer
      │
      │  git push feature-branch
      ▼
  ┌──────────────┐
  │  GitHub PR   │
  └──────┬───────┘
         │  triggers
         ▼
  ┌────────────────────────────────────────────────┐
  │  CI: Pull Request Checks                       │
  │  ┌────────────┐  ┌───────────┐  ┌──────────┐  │
  │  │ terraform  │  │ terraform │  │  tests   │  │
  │  │   fmt -check│ │   plan    │  │ (pytest) │  │
  │  └────────────┘  └───────────┘  └──────────┘  │
  │  Plan output posted as PR comment              │
  └──────────────────────────────────────────────--┘
         │
         │  PR approved + merged to main
         ▼
  ┌────────────────────────────────────────────────┐
  │  CD: Deploy to Production                      │
  │  ┌─────────────────────────────────────────┐  │
  │  │ 1. Configure AWS credentials via OIDC   │  │
  │  │    (no long-lived access keys!)         │  │
  │  │ 2. terraform init                       │  │
  │  │ 3. terraform apply -auto-approve        │  │
  │  │ 4. Post Slack notification              │  │
  │  └─────────────────────────────────────────┘  │
  └────────────────────────────────────────────────┘
         │
         ▼
      AWS (VPC, ECS, RDS, etc. provisioned/updated)
```

---

## Terraform Module Structure

```
infrastructure/
├── main.tf              ← root module, calls child modules
├── variables.tf
├── outputs.tf
├── backend.tf           ← S3 + DynamoDB backend config
├── modules/
│   ├── vpc/
│   │   ├── main.tf      ← VPC, subnets, IGW, NAT
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── ecs-service/
│   │   ├── main.tf      ← ECS cluster, service, task def
│   │   ├── variables.tf
│   │   └── outputs.tf
│   └── rds/
│       ├── main.tf
│       ├── variables.tf
│       └── outputs.tf
└── environments/
    ├── dev/
    │   └── terraform.tfvars
    └── prod/
        └── terraform.tfvars
```

---

## Key Concepts

- **OIDC for GitHub Actions**: Never store AWS access keys in GitHub secrets. Use OIDC to get temporary credentials via `aws-actions/configure-aws-credentials`
- **State locking**: DynamoDB lock prevents two pipelines from running `apply` simultaneously
- **Workspaces vs directories**: Prefer separate directories (`environments/dev`, `environments/prod`) over workspaces for environment isolation
- **`terraform taint`**: Force resource recreation without changing the config (deprecated in v1.x, use `-replace`)

---

## Teaching Notes

- **Common mistake**: Running `terraform apply` locally with production credentials — all changes should go through CI/CD
- **Gotcha**: Terraform state stores secrets in plaintext (RDS passwords, etc.). Enable S3 bucket encryption + block public access
- **Drift detection**: Schedule a daily `terraform plan` in CI to detect manual changes (drift). Alert if plan is non-empty
- **Modules**: Don't write a module for everything. Extract to module only when you reuse it in 3+ places

---

## Practice Exercise

1. Set up Terraform remote state backend with S3 + DynamoDB using Terraform itself (bootstrap)
2. Create a module that deploys an ECS Fargate service with ALB, target group, and IAM role
3. Set up a GitHub Actions workflow: `terraform plan` on PR, `terraform apply` on merge to main
4. **Bonus**: Use OIDC (no access keys) for GitHub Actions AWS authentication
