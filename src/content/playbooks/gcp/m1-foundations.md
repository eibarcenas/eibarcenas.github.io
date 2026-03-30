# Module 1 — GCP Foundations

## Overview
- Understand the GCP resource hierarchy and how billing, quotas, and policies cascade
- Master IAM on GCP — principals, roles, bindings, and service accounts
- Design a secure VPC with firewall rules, private services access, and Cloud NAT

---

## GCP Resource Hierarchy

```
  ┌──────────────────────────────────────────────┐
  │             Organization                     │
  │         (company.com)                        │
  │  Org-level IAM & Org Policies apply here     │
  └──────────────────────┬───────────────────────┘
                         │
          ┌──────────────┼──────────────┐
          │              │              │
  ┌───────▼──────┐ ┌─────▼──────┐ ┌────▼───────┐
  │   Folder     │ │   Folder   │ │   Folder   │
  │  Engineering │ │  Finance   │ │  Security  │
  └───────┬──────┘ └────────────┘ └────────────┘
          │
     ┌────┼──────────┐
     │    │          │
  ┌──▼──┐ ┌──▼──┐ ┌──▼───┐
  │ Proj│ │ Proj│ │ Proj │
  │ dev │ │stage│ │ prod │
  └──┬──┘ └─────┘ └──────┘
     │
  Resources
  (VMs, GCS, Cloud Run, etc.)

  Policies and IAM bindings cascade DOWN the hierarchy.
  Child resources inherit parent policies.
  Use folders to group projects by team/environment.
```

---

## IAM Model

```
  Binding: WHO  can do WHAT  on WHICH resource
  ───────   ──────────  ────────  ───────────────
            Principal   Role       Resource

  Principals:
  ├── User Account       (user:erick@company.com)
  ├── Service Account    (serviceAccount:api@proj.iam.gserviceaccount.com)
  ├── Google Group       (group:devs@company.com)
  └── All users / all authenticated users (avoid in production)

  Role Types:
  ├── Basic    (Owner/Editor/Viewer) → too broad, avoid
  ├── Predefined (roles/run.invoker, roles/storage.objectViewer)
  └── Custom   (create your own minimal permission set)

  Service Account Best Practices:
  ┌─────────────────────────────────────────────────┐
  │ One SA per service (not one SA per team)        │
  │ Grant SA roles on specific resources, not proj  │
  │ Use Workload Identity (no SA key files in prod) │
  │ Audit SA key usage in Cloud Audit Logs          │
  └─────────────────────────────────────────────────┘
```

---

## VPC Architecture on GCP

```
  ┌─────────────────────────────────────────────────────────┐
  │  VPC Network: my-vpc (global, not regional like AWS)    │
  │                                                         │
  │  Subnet: us-central1  10.10.0.0/20  (regional)         │
  │  ┌───────────────────────────────────────────────────┐  │
  │  │  Cloud Run / GKE / GCE Instances                  │  │
  │  │  Private Google Access: ON (reach GCP APIs)       │  │
  │  └───────────────────────────────────────────────────┘  │
  │                           │                             │
  │                    ┌──────▼──────┐                      │
  │                    │  Cloud NAT  │  outbound to internet│
  │                    └─────────────┘                      │
  │                                                         │
  │  Firewall Rules (stateful):                             │
  │  ├── allow-internal: 10.0.0.0/8 → all (priority 1000)  │
  │  ├── allow-ssh: IAP range → port 22 (use IAP, not 0/0) │
  │  └── deny-all-ingress: default deny (implicit)         │
  │                                                         │
  │  Private Service Access:                                │
  │  └── Cloud SQL / Memorystore accessible without NAT    │
  └─────────────────────────────────────────────────────────┘
```

---

## Key Concepts

- **Projects are billing units**: Each project has its own billing account, quotas, and API enables
- **Cloud Identity vs Google Workspace**: Use groups for IAM, not individual user emails
- **VPC is global on GCP**: Unlike AWS where VPC is regional. Subnets are regional
- **IAP (Identity-Aware Proxy)**: Use IAP for SSH/RDP access instead of opening port 22 to the internet

---

## Teaching Notes

- **Common mistake**: Granting `roles/editor` to a service account because it's easy — it's a massive blast radius
- **Gotcha**: Deleting a project takes 30 days to fully delete — resources are suspended, billing stops immediately
- **Organization Policy**: Use `constraints/compute.requireOsLogin` and `constraints/iam.disableServiceAccountKeyCreation` org-wide
- **Billing alerts**: Set budget alerts at 50%, 90%, 100% on every project — GCP won't stop billing automatically

---

## Practice Exercise

1. Create a GCP project with Terraform, enable required APIs (Compute, Run, Container, Storage)
2. Create a VPC with a private subnet, Cloud NAT, and firewall rules (allow internal, allow IAP SSH)
3. Create a service account with `roles/storage.objectViewer` on a specific GCS bucket only
4. **Bonus**: Set up Workload Identity Federation so GitHub Actions can deploy without a SA key file
