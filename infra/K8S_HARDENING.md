# Kubernetes Hardening and Runner Security Guidelines

This document collects production best practices for running untrusted code in Kubernetes.

Key recommendations:

- Run user code in short-lived Kubernetes Jobs in a separate namespace (e.g., `coderipper`).
- Use a limited ServiceAccount with Role that only allows creating Jobs and reading/writing ConfigMaps and Pods logs.
- Deny egress from runner pods using `NetworkPolicy` to prevent external network access.
- Use `securityContext` in PodSpec/Container to set `runAsNonRoot`, `readOnlyRootFilesystem: true`, and `allowPrivilegeEscalation: false`.
- Enforce seccomp profile: use `RuntimeDefault` or a custom strict seccomp profile if supported by your cluster.
- Consider using lightweight sandbox runtimes (gVisor, Kata Containers) for stronger isolation.
- Mount submission files via object storage (S3/MinIO) using an init container instead of ConfigMaps for large payloads. The runner uses presigned GETs for a short-lived URL and an init container downloads and extracts the tar into an emptyDir; ensure your object storage supports presigned GETs and apply restrictive bucket policies.
- Set resource `requests` and `limits` per container and enforce cluster-level ResourceQuota.
- Use PodSecurity admission (restricted baseline) and network policies to limit attack surface.
- Scan runner and base images with Trivy or similar vulnerability scanner.
- Instrument jobs with Prometheus metrics and set up alerts for high failure rates or suspicious patterns.
- Capture and redact logs that may contain sensitive data; provide GDPR user data export and deletion endpoints.

See also:
- https://kubernetes.io/docs/concepts/security/pod-security-standards/
- https://kubernetes.io/docs/concepts/policy/pod-security-policy/
- https://kubernetes.io/docs/concepts/services-networking/network-policies/
