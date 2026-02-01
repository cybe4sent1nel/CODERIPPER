"""AI microservice: simple FastAPI app for explain-error and tutor endpoints.
In production add authentication, rate limiting, request validation, and LLM provider abstraction.
"""
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
import os
import httpx
import jwt

app = FastAPI()

OPENAI_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_URL = "https://api.openai.com/v1/chat/completions"
AUTH_SECRET = os.getenv("AUTH_JWT_SECRET", "")

async def require_auth(request: Request):
    if AUTH_SECRET == "":
        return True
    auth = request.headers.get("authorization", "")
    if not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="unauthorized")
    token = auth.split(" ", 1)[1]
    try:
        jwt.decode(token, AUTH_SECRET, algorithms=["HS256"])
    except Exception:
        raise HTTPException(status_code=401, detail="unauthorized")
    return True

class ExplainReq(BaseModel):
    language: str
    compiler_output: str

async def call_openai_explain(compiler_output: str, language: str):
    if OPENAI_KEY == "":
        return None
    headers = {"Authorization": f"Bearer {OPENAI_KEY}", "Content-Type": "application/json"}
    prompt = f"Explain the following compiler output and provide actionable fixes in plain language (language={language}):\n\n{compiler_output}"
    payload = {
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": "You are an assistant that explains compiler errors clearly and concisely."},
            {"role": "user", "content": prompt},
        ],
        "max_tokens": 400,
        "temperature": 0.2
    }
    async with httpx.AsyncClient(timeout=15) as client:
        r = await client.post(OPENAI_URL, json=payload, headers=headers)
        if r.status_code != 200:
            return None
        j = r.json()
        text = j.get("choices", [])[0].get("message", {}).get("content", "")
        return text

@app.post("/api/ai/explain-error")
async def explain_error(req: ExplainReq, request: Request):
    await require_auth(request)
    out = req.compiler_output
    # quick heuristic rules
    if "syntax error" in out.lower() or "expected" in out.lower():
        return {"explanation": "Syntax error: check for missing tokens or mismatched braces.", "suggestions": ["Check for missing semicolons", "Verify brackets and indentation"]}

    # try LLM if configured
    llm = await call_openai_explain(out, req.language)
    if llm:
        # basic safety: truncate long outputs
        return {"explanation": llm[:2000], "suggestions": []}

    return {"explanation": "Could not detect a simple pattern. Try enabling detailed logs or run the debugger.", "suggestions": []}

class TutorReq(BaseModel):
    code: str
    language: str

@app.post("/api/ai/tutor")
async def tutor(req: TutorReq, request: Request):
    await require_auth(request)
    # Placeholder: call LLM with step-by-step request if available
    if OPENAI_KEY:
        prompt = f"Explain step-by-step what the following {req.language} code does and how a beginner should reason about it:\n\n{req.code}"
        async with httpx.AsyncClient(timeout=15) as client:
            r = await client.post(OPENAI_URL, json={"model": "gpt-4o-mini", "messages": [{"role":"user","content":prompt}], "max_tokens": 600}, headers={"Authorization": f"Bearer {OPENAI_KEY}", "Content-Type": "application/json"})
            if r.status_code == 200:
                return {"steps": [r.json().get("choices", [])[0].get("message", {}).get("content", "")[:4000]]}
    # fallback
    steps = [
        "Read the code top to bottom to understand intent.",
        "Identify variables and functions and name them descriptively.",
        "Run small examples and inspect outputs.",
    ]
    return {"steps": steps}


class VisualizeReq(BaseModel):
    code: str
    language: str

@app.post("/api/visualize")
async def visualize(req: VisualizeReq):
    # Minimal flowchart generator (stub). For production use tree-sitter or language-specific parsers.
    lines = [l.strip() for l in req.code.splitlines() if l.strip()]
    md = ["flowchart TD"]
    for i, l in enumerate(lines[:20]):
        node = f"A{i}[{l.replace('"', '')}]"
        if i > 0:
            md.append(f"A{i-1} --> A{i}")
        md.append(node)
    return {"mermaid": "\n".join(md)}
