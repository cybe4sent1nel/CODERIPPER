# Webhook service

This validating webhook enforces a required RuntimeClass and basic pod security constraints for runner pods.

Deployment notes:
- Create TLS certificate and Kubernetes Secret `coderipper-webhook-tls` with keys `tls.crt` and `tls.key` in the `coderipper` namespace. Use cert-manager to automate it.
- Create a ValidatingWebhookConfiguration and set `webhooks[0].clientConfig.caBundle` to the CA that signed the webhook certificate.
- The webhook reads `REQUIRED_RUNTIME_CLASS` to require a RuntimeClass name (e.g., `gvisor` or `kata`).

Local testing:
- For local development you can disable creation of ValidatingWebhookConfiguration or leave `REQUIRED_RUNTIME_CLASS` unset.
