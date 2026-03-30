# Module 2 — Serverless & Containers on AWS

## Overview
- Understand Lambda cold starts, execution model, and best practices for production
- Deploy containerized services with ECS Fargate and understand task definitions
- Know when to choose Lambda vs ECS vs EKS for a given workload

---

## Lambda Execution Model

```
  COLD START (first invocation or after idle)
  ─────────────────────────────────────────────────────────────

  Time ──────────────────────────────────────────────────────►

  │◄──── Cold Start Overhead ────►│◄── Handler Execution ──►│
  │                               │                          │
  ├── Download code/image (~100ms)─┤                          │
  ├── Start execution env (~50ms)──┤                          │
  ├── Init runtime (Python ~80ms)──┤                          │
  ├── Run module-level code ───────┤── your_handler() ───────►│
  │   (DB connections, imports)   │                          │

  WARM INVOCATION
  ─────────────────────────────────────────────────────────────
  │◄── Handler Execution Only ──────────────────────────────►│
  (same execution env reused — module-level code already ran)

  Optimization tips:
  ✓ Move DB connections outside handler (module level)
  ✓ Use Provisioned Concurrency for latency-sensitive APIs
  ✓ Keep packages lean — remove unused deps, use Lambda Layers
  ✓ Use ARM64 (Graviton2) — cheaper + faster for most workloads
```

---

## API Gateway → Lambda → DynamoDB

```
  Client
    │
    │  POST /orders  { item_id, qty }
    ▼
  ┌─────────────────┐
  │   API Gateway   │
  │   (HTTP API)    │  ← cheaper than REST API, lower latency
  │                 │  ← JWT authorizer or Lambda authorizer
  └────────┬────────┘
           │  event: { body, headers, pathParameters, ... }
           ▼
  ┌─────────────────┐
  │  Lambda Handler │
  │  Python 3.12    │
  │  256 MB / 30s   │
  └────────┬────────┘
           │  PutItem / UpdateItem
           ▼
  ┌─────────────────┐
  │   DynamoDB      │  ← single-digit ms latency
  │   On-Demand     │  ← no capacity planning
  └─────────────────┘
           │
           │  Streams (optional)
           ▼
  ┌─────────────────┐
  │  Lambda         │  ← process change events
  │  (trigger)      │  ← fanout to SNS/EventBridge
  └─────────────────┘
```

---

## ECS Fargate vs EKS

```
  ┌─────────────────────────────────┬────────────────────────────────┐
  │           ECS Fargate           │              EKS               │
  ├─────────────────────────────────┼────────────────────────────────┤
  │ AWS-managed control plane       │ AWS-managed K8s control plane  │
  │ No nodes to manage (Fargate)    │ Manage node groups or Fargate  │
  │ Simple task definitions (JSON)  │ Complex YAML manifests         │
  │ AWS-native (ALB, IAM, CF)       │ Kubernetes ecosystem           │
  │ Good for: simple microservices  │ Good for: complex workloads    │
  │ Lower K8s expertise needed      │ Portable across clouds         │
  │ Faster to production            │ Helm, Istio, Argo CD, etc.     │
  └─────────────────────────────────┴────────────────────────────────┘

  Choose ECS when: you're AWS-only and want simplicity
  Choose EKS when: multi-cloud, existing K8s expertise, or complex scheduling
```

---

## ECS Task Definition Structure

```json
{
  "family": "api-service",
  "taskRoleArn": "arn:aws:iam::123:role/api-task-role",
  "executionRoleArn": "arn:aws:iam::123:role/ecs-exec-role",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [{
    "name": "api",
    "image": "123.dkr.ecr.us-east-1.amazonaws.com/api:latest",
    "portMappings": [{ "containerPort": 8000 }],
    "environment": [{ "name": "ENV", "value": "production" }],
    "secrets": [{ "name": "DB_URL", "valueFrom": "arn:aws:ssm:..." }],
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": { "awslogs-group": "/ecs/api-service" }
    }
  }]
}
```

---

## Key Concepts

- **Lambda timeouts**: Max 15 minutes. For long jobs use Step Functions or ECS
- **Lambda concurrency**: Default soft limit 1000 per region. Use reserved concurrency to protect downstream services
- **ECR**: Always use image digest pinning (`image:sha256:abc...`) in production, not `:latest`
- **ECS Service Auto Scaling**: Scale on CPU/memory or custom CloudWatch metrics (e.g., SQS queue depth)

---

## Teaching Notes

- **Common mistake**: Storing state in Lambda (global variables) across invocations — behavior is non-deterministic
- **Gotcha**: Lambda function URL vs API Gateway — function URL is simpler but lacks JWT authorizers, throttling, WAF
- **Cost**: Fargate is ~20% more expensive than EC2 but eliminates node management — usually worth it
- **Cold start mitigation**: SnapStart for Java, Provisioned Concurrency for Python/Node for latency-critical APIs

---

## Practice Exercise

1. Create a Lambda function in Python that receives an SQS event, validates the payload, and writes to DynamoDB
2. Deploy it with Terraform (Lambda + SQS trigger + IAM role with least privilege)
3. Add Dead Letter Queue (DLQ) for failed messages
4. **Bonus**: Containerize the same service and deploy it as an ECS Fargate task — compare cold start times
