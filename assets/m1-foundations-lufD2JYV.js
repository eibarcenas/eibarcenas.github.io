const n=`# Module 1 — AWS Foundations

## Overview
- Understand the AWS IAM model — users, roles, policies, and trust relationships
- Design a secure VPC with public/private subnets, NAT Gateway, and bastion host
- Know when to use S3, and how bucket policies and CloudFront work together

---

## IAM Trust Relationship

\`\`\`
  ┌─────────────────────────────────────────────────┐
  │                  IAM Policy                     │
  │  {                                              │
  │    "Effect": "Allow",                           │
  │    "Principal": { "Service": "lambda.amazonaws" }│
  │    "Action": "sts:AssumeRole",                  │
  │    "Resource": "arn:aws:iam::123:role/MyRole"   │
  │    "Condition": {                               │
  │      "StringEquals": {                          │
  │        "aws:RequestedRegion": "us-east-1"       │
  │      }                                          │
  │    }                                            │
  │  }                                              │
  └─────────────────────────────────────────────────┘

  Identity Types:
  ──────────────
  IAM User     → long-term credentials (avoid in production)
  IAM Role     → temporary credentials via STS AssumeRole
  IAM Group    → attach policies to multiple users
  Service Role → Lambda, ECS, EC2 assume roles to call AWS APIs

  Principle of Least Privilege: grant only what is needed, nothing more.
\`\`\`

---

## VPC Architecture

\`\`\`
  Region: us-east-1
  ┌─────────────────────────────────────────────────────────┐
  │  VPC  10.0.0.0/16                                       │
  │                                                         │
  │  ┌──────────────────────┐  ┌──────────────────────┐    │
  │  │  AZ: us-east-1a      │  │  AZ: us-east-1b      │    │
  │  │                      │  │                      │    │
  │  │  ┌────────────────┐  │  │  ┌────────────────┐  │    │
  │  │  │ Public Subnet  │  │  │  │ Public Subnet  │  │    │
  │  │  │ 10.0.1.0/24    │  │  │  │ 10.0.2.0/24    │  │    │
  │  │  │ ALB / Bastion  │  │  │  │ ALB / NAT GW   │  │    │
  │  │  └───────┬────────┘  │  │  └───────┬────────┘  │    │
  │  │          │           │  │          │           │    │
  │  │  ┌───────▼────────┐  │  │  ┌───────▼────────┐  │    │
  │  │  │ Private Subnet │  │  │  │ Private Subnet │  │    │
  │  │  │ 10.0.11.0/24   │  │  │  │ 10.0.12.0/24   │  │    │
  │  │  │ ECS / Lambda   │  │  │  │ ECS / RDS      │  │    │
  │  │  └────────────────┘  │  │  └────────────────┘  │    │
  │  └──────────────────────┘  └──────────────────────┘    │
  │                                                         │
  │  Internet Gateway ──────────► Public Subnets            │
  │  NAT Gateway (in public) ───► Private Subnets outbound  │
  └─────────────────────────────────────────────────────────┘
            │
            ▼
       Internet
\`\`\`

---

## S3 + CloudFront Pattern

\`\`\`
  User Browser
       │
       │  HTTPS request
       ▼
  ┌───────────────┐
  │  CloudFront   │  CDN edge (150+ PoPs globally)
  │  Distribution │  ← SSL/TLS termination here
  │               │  ← Caching (TTL, Cache-Control)
  └───────┬───────┘
          │ Cache MISS
          ▼
  ┌───────────────┐
  │   S3 Bucket   │  Origin
  │  (private)    │  ← Block Public Access = ON
  │               │  ← OAC (Origin Access Control)
  └───────────────┘

  Bucket policy only allows CloudFront OAC principal.
  Never enable public S3 access for static sites.
\`\`\`

---

## Key Concepts

- **ARN format**: \`arn:partition:service:region:account-id:resource\` — memorize this
- **Security Groups vs NACLs**: SGs are stateful (return traffic auto-allowed); NACLs are stateless
- **IAM Best Practices**: Use roles over users; rotate access keys; enable MFA; use AWS Organizations SCPs
- **Resource Tagging**: Always tag resources with \`env\`, \`team\`, \`project\` — enables cost allocation and automation

---

## Teaching Notes

- **Common mistake**: Giving \`*\` permissions to get something working and forgetting to tighten it
- **Gotcha**: IAM policy evaluation — explicit \`Deny\` always wins over \`Allow\`, even from another policy
- **Cost trap**: NAT Gateway charges ~$0.045/GB processed. For high-throughput services consider VPC endpoints for S3/DynamoDB
- **Security**: Enable CloudTrail, GuardDuty, and AWS Config in every account from day one

---

## Practice Exercise

1. Create a VPC with 2 AZs, public/private subnets, IGW, and NAT Gateway using Terraform
2. Create an IAM role for a Lambda function that can only \`GetObject\` from a specific S3 bucket
3. Enable S3 bucket versioning and lifecycle policy (move objects to Glacier after 30 days)
4. **Bonus**: Set up CloudFront in front of an S3 bucket with OAC; test that direct S3 URL returns 403
`;export{n as default};
