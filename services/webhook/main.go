package main

import (
	"crypto/tls"
	"crypto/x509"
	"encoding/json"
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	admissionv1 "k8s.io/api/admission/v1"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

// Notes:
// - This webhook expects TLS cert and key at /tls/tls.crt and /tls/tls.key mounted into the pod.
// - Use cert-manager to provision certificates and populate the ValidatingWebhookConfiguration CABundle.

var (
	listenAddr      = flag.String("listen", ":9443", "address to listen on")
	requiredRuntime = os.Getenv("REQUIRED_RUNTIME_CLASS")
)

func admitPods(w http.ResponseWriter, r *http.Request) {
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "could not read body", http.StatusBadRequest)
		return
	}

	var review admissionv1.AdmissionReview
	if err := json.Unmarshal(body, &review); err != nil {
		http.Error(w, "could not parse admission review", http.StatusBadRequest)
		return
	}

	req := review.Request
	if req == nil {
		http.Error(w, "no request in review", http.StatusBadRequest)
		return
	}

	allowed := true
	message := ""

	// Only validate Pod creations (or PodTemplates in Jobs/Deployments); for simplicity we only handle Pod resources directly here
	if req.Kind.Kind == "Pod" && (req.Operation == admissionv1.Create || req.Operation == admissionv1.Update) {
		var pod corev1.Pod
		if err := json.Unmarshal(req.Object.Raw, &pod); err != nil {
			allowed = false
			message = "could not decode pod"
		} else {
			// Enforce runtime class
			if requiredRuntime != "" {
				if pod.Spec.RuntimeClassName == nil || *pod.Spec.RuntimeClassName != requiredRuntime {
					allowed = false
					message = fmt.Sprintf("pod must set RuntimeClassName=%s", requiredRuntime)
				}
			}
			// Enforce security settings
			if pod.Spec.AutomountServiceAccountToken != nil && *pod.Spec.AutomountServiceAccountToken {
				allowed = false
				message = "automountServiceAccountToken must be disabled"
			}
			for _, c := range pod.Spec.Containers {
				if c.SecurityContext != nil {
					if c.SecurityContext.AllowPrivilegeEscalation != nil && *c.SecurityContext.AllowPrivilegeEscalation {
						allowed = false
						message = "allowPrivilegeEscalation must be false"
					}
					if c.SecurityContext.ReadOnlyRootFilesystem != nil && !*c.SecurityContext.ReadOnlyRootFilesystem {
						allowed = false
						message = "readOnlyRootFilesystem must be true"
					}
				}
			}
		}
	}

	resp := admissionv1.AdmissionResponse{Allowed: allowed}
	if !allowed {
		resp.Result = &metav1.Status{Message: message}
	}

	review.Response = &resp
	review.Response.UID = req.UID

	out, err := json.Marshal(review)
	if err != nil {
		http.Error(w, "could not marshal response", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(out)
}

func main() {
	flag.Parse()
	if requiredRuntime == "" {
		log.Println("Warning: REQUIRED_RUNTIME_CLASS not set; runtime enforcement disabled")
	} else {
		log.Printf("Enforcing runtime class: %s\n", requiredRuntime)
	}

	if os.Getenv("DEV_WEBHOOK_NO_TLS") == "true" {
		log.Println("DEV_WEBHOOK_NO_TLS=true: running webhook without TLS for local testing (not for production)")
		http.HandleFunc("/validate", admitPods)
		log.Fatal(http.ListenAndServe(*listenAddr, nil))
	}

	certFile := "/tls/tls.crt"
	keyFile := "/tls/tls.key"
	caFile := "/tls/ca.crt"

	cert, err := tls.LoadX509KeyPair(certFile, keyFile)
	if err != nil {
		log.Fatalf("failed to load TLS certs: %v", err)
	}

	caCertPEM, _ := ioutil.ReadFile(caFile)
	caCertPool := x509.NewCertPool()
	if len(caCertPEM) > 0 {
		caCertPool.AppendCertsFromPEM(caCertPEM)
	}

	http.HandleFunc("/validate", admitPods)

	server := &http.Server{Addr: *listenAddr, TLSConfig: &tls.Config{Certificates: []tls.Certificate{cert}, ClientCAs: caCertPool, ClientAuth: tls.NoClientCert}}
	log.Printf("starting webhook on %s (TLS)", *listenAddr)
	log.Fatal(server.ListenAndServeTLS("", ""))
}
