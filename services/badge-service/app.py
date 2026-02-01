from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
import os
import asyncpg
import asyncio
import redis

app = FastAPI()

DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://coderip:coderip@localhost:5432/coderipper')
REDIS_URL = os.getenv('REDIS_URL', 'redis://localhost:6379')

class TriggerReq(BaseModel):
    user_id: str
    event: str
    meta: dict = {}

async def get_conn():
    return await asyncpg.connect(DATABASE_URL)

@app.post('/api/badges/trigger')
async def trigger(req: TriggerReq, request: Request):
    # if BADGE_SERVICE_TOKEN is set, validate the incoming bearer token
    token_required = os.getenv('BADGE_SERVICE_TOKEN', '')
    if token_required:
        auth = request.headers.get('authorization','')
        if not auth.startswith('Bearer ') or auth.split(' ',1)[1] != token_required:
            raise HTTPException(status_code=401, detail='unauthorized')
    conn = await get_conn()
    try:
        # Example rule: on first successful run, award first_compile
        if req.event == 'run_success':
            # check existing runs count
            row = await conn.fetchrow('SELECT count(*)::int as c FROM runs WHERE user_id = $1', req.user_id)
            count = row['c'] if row else 0
            if count <= 1:
                # award badge if not exists
                await conn.execute("INSERT INTO user_badges (user_id,badge_id) VALUES ($1,$2) ON CONFLICT DO NOTHING", req.user_id, 'first_compile')
                # publish notification to redis channel
                r = redis.Redis.from_url(REDIS_URL)
                r.publish(f'user:{req.user_id}:badges', 'first_compile')
                return {'awarded': ['first_compile']}
        return {'awarded': []}
    finally:
        await conn.close()
