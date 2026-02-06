import os
import time
import requests
from flask import Flask, request, Response, jsonify


app = Flask(__name__)


@app.get("/api/consulta/<codigo>")
@app.get("/api/consulta/<codigo>/")
def consulta(codigo):
    t = request.args.get("t") or str(int(time.time()))
    upstream_base = os.environ.get("UPSTREAM_BASE", "http://177.221.240.85:8000").rstrip("/")
    upstream = f"{upstream_base}/api/consulta/{codigo}/"
    try:
        r = requests.get(upstream, params={"t": t}, timeout=(8, 20))
        headers = {
            "Content-Type": r.headers.get("content-type", "application/json; charset=utf-8"),
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "no-store",
        }
        return Response(r.content, status=r.status_code, headers=headers)
    except Exception as e:
        return jsonify({"success": False, "data": [], "error": str(e)}), 503


@app.route("/api/consulta/<codigo>", methods=["OPTIONS"])
@app.route("/api/consulta/<codigo>/", methods=["OPTIONS"])
def options_consulta(codigo):
    return ("", 204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
    })


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "8787"))
    app.run(host="0.0.0.0", port=port)

