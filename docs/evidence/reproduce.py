"""Generate public, synthetic evidence without loading credentials or using a network.

Requires Python 3.11+, Pydantic 2, and Markdown 3.7. The email source classes
and formatter functions are compiled unchanged from their AST nodes. Harness
modules run unchanged behind package shells that omit the ADK/provider startup.
Only its configuration and ToolContext type import are replaced; banking policy,
state, audit, limits, tools, and transaction executor are the real source code.
"""
from __future__ import annotations

import argparse
import ast
import hashlib
import html
import importlib
import json
import os
from pathlib import Path
import sys
import types
from typing import Any, List, Optional


def extract(path, names, namespace):
    tree = ast.parse(path.read_text(encoding="utf-8-sig"), filename=str(path))
    selected = [node for node in tree.body if isinstance(node, (ast.ClassDef, ast.FunctionDef)) and node.name in names]
    assert len(selected) == len(names), f"Missing source definitions in {path.name}"
    exec(compile(ast.Module(body=selected, type_ignores=[]), str(path), "exec"), namespace)


def package(name, path=None):
    module = types.ModuleType(name)
    if path is not None:
        module.__path__ = [str(path)]
    sys.modules[name] = module
    return module


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--news-source", required=True, type=Path)
    parser.add_argument("--harness-source", required=True, type=Path)
    parser.add_argument("--extra-python-path", type=Path)
    args = parser.parse_args()
    if args.extra_python_path:
        sys.path.insert(0, str(args.extra_python_path))
    import markdown
    from pydantic import BaseModel, Field

    output = Path(__file__).resolve().parents[2] / "public" / "evidence"
    output.mkdir(parents=True, exist_ok=True)
    source_hashes = {}

    def remember(root, relative, prefix):
        source_hashes[f"{prefix}/{relative}"] = hashlib.sha256((root / relative).read_bytes()).hexdigest()

    news_app = args.news_source / "app"
    package("app", news_app)
    package("app.agent", news_app / "agent")
    email_model = package("app.agent.email_agent")
    email_model.__dict__.update(BaseModel=BaseModel, Field=Field, List=List, Optional=Optional)
    extract(news_app / "agent/email_agent.py", {"EmailIntroduction", "RankedArticleDetail", "EmailDigestResponse"}, email_model.__dict__)
    formatter = {"html": html, "markdown": markdown}
    extract(news_app / "services/email.py", {"markdown_to_html", "digest_to_html"}, formatter)
    digest = email_model.EmailDigestResponse(
        introduction=email_model.EmailIntroduction(
            greeting="AI digest — synthetic formatter sample",
            introduction="This illustrative digest uses invented editorial text and public source-code links. It demonstrates the project's existing HTML and plaintext formatting. No collection, model generation, ranking, or email delivery was run.",
        ),
        articles=[
            email_model.RankedArticleDetail(
                digest_id="synthetic-formatter", rank=1, relevance_score=8.0,
                title="Inspect the source-linked email formatter",
                summary="Synthetic example: a structured digest entry becomes a heading, a readable summary, and a source link. This text was supplied by the portfolio evidence script; it is not scraped news or a model response.",
                url="https://github.com/harshgavandit/AI_News_To_Email_Generator/blob/0608f9a99dec2308ae9dcdebce840e5ce958445e/app/services/email.py",
                article_type="synthetic source walkthrough",
            ),
            email_model.RankedArticleDetail(
                digest_id="synthetic-runner", rank=2, relevance_score=7.0,
                title="Follow the pipeline's stage results",
                summary="Synthetic example: the daily runner records scraping, processing, digest, and email stages. The linked implementation is the evidence; this sample makes no claim that a scheduled run or SMTP delivery succeeded.",
                url="https://github.com/harshgavandit/AI_News_To_Email_Generator/blob/0608f9a99dec2308ae9dcdebce840e5ce958445e/app/daily_runner.py",
                article_type="synthetic source walkthrough",
            ),
        ], total_ranked=2, top_n=2,
    )
    body_html = formatter["digest_to_html"](digest)
    body_text = digest.to_markdown()
    assert body_html.count('class="article-link"') == 2
    assert all(article.url in body_html and article.url in body_text for article in digest.articles)
    assert "synthetic formatter sample" in body_html
    (output / "news-digest.html").write_text(body_html, encoding="utf-8")
    (output / "news-digest.txt").write_text(body_text.rstrip() + "\n", encoding="utf-8")
    for relative in ["app/agent/email_agent.py", "app/services/email.py"]:
        remember(args.news_source, relative, "news")

    # Omit app/__init__.py, which imports provider-backed ADK agent startup.
    for name in list(sys.modules):
        if name == "app" or name.startswith("app."):
            del sys.modules[name]
    harness_app = args.harness_source / "app"
    package("app", harness_app)
    package("app.tools", harness_app / "tools")
    package("app.services", harness_app / "services")
    config = package("app.config")
    config.os = os
    extract(harness_app / "config.py", {"positive_int"}, config.__dict__)
    config.settings = types.SimpleNamespace(approval_hours=24)
    package("google")
    package("google.adk")
    package("google.adk.tools").ToolContext = Any
    # Explicit synthetic settings; no .env loader or real key is imported.
    for key, value in {"MOCK_TRANSACTION_OUTCOME": "SUCCESS", "MAX_TOOL_CALLS": "20", "MAX_TRANSFER_ATTEMPTS": "5", "MAX_IDENTICAL_FAILURES": "3"}.items():
        os.environ[key] = value
    tools = importlib.import_module("app.tools.banking_tools")
    mock_data = importlib.import_module("app.mock_data")
    audit = importlib.import_module("app.audit")
    audit._logger.disabled = True

    def context(text="Transfer 1000 to Aaron", invocation="sample-turn-1"):
        return types.SimpleNamespace(state={}, invocation_id=invocation,
            user_content=types.SimpleNamespace(parts=[types.SimpleNamespace(text=text)]))

    def step(label, value):
        return {"label": label, "value": json.dumps(value, sort_keys=True)}

    scenarios = []
    mock_data.reset_state()
    ctx = context()
    staged = tools.initiate_transfer("Aaron", 1000, tool_context=ctx)
    assert staged["status"] == "PENDING_CONFIRMATION"
    assert tools.get_balance()["balance"] == 200000
    ctx.invocation_id = "sample-turn-2"
    ctx.user_content.parts[0].text = "confirm"
    confirmed = tools.confirm_transfer(tool_context=ctx)
    repeated = tools.confirm_transfer(tool_context=ctx)
    assert confirmed["status"] == "SUCCESS" and confirmed["new_balance"] == 199000
    assert repeated["status"] == "NO_PENDING_TRANSFER"
    scenarios.append({"id": "success", "label": "Explicit later-turn confirmation",
        "steps": [step("Initiate synthetic transfer", staged), step("Later user turn: confirm", confirmed), step("Repeat confirmation", repeated)],
        "outcome": "Mock transaction succeeds once; balance changes from 200000 to 199000. This is an in-memory simulation, with no bank connection."})

    mock_data.reset_state()
    ctx = context("Transfer 1000 to Nick")
    rejected = tools.initiate_transfer("Nick", 1000, tool_context=ctx)
    assert rejected["status"] == "REJECTED"
    assert tools.get_balance()["balance"] == 200000
    scenarios.append({"id": "rejected", "label": "Blocked beneficiary rejected",
        "steps": [step("Attempt transfer to blocked mock beneficiary", rejected), step("Balance after rejection", tools.get_balance())],
        "outcome": "Deterministic beneficiary policy rejects the request; mock balance remains unchanged."})

    mock_data.reset_state()
    ctx = context()
    staged = tools.initiate_transfer("Aaron", 1000, tool_context=ctx)
    early = tools.confirm_transfer(tool_context=ctx)
    unrelated_ctx = context("confirm", "sample-turn-2")
    other_session = tools.confirm_transfer(tool_context=unrelated_ctx)
    assert early["status"] == "CONFIRMATION_REQUIRED"
    assert other_session["status"] == "NO_PENDING_TRANSFER"
    assert tools.get_balance()["balance"] == 200000
    scenarios.append({"id": "confirmation-required", "label": "Same-turn or other-session confirmation blocked",
        "steps": [step("Initiate synthetic transfer", staged), step("Confirm during original invocation", early), step("Confirm with separate session state", other_session)],
        "outcome": "Original invocation cannot approve its own proposal; a separate session has no staged transfer. No mock money moves."})

    artifact = {"provenance": "Executed unchanged deterministic banking tool/service source with synthetic in-memory accounts and mocked SUCCESS executor setting. ADK/provider startup and .env loading were omitted; ToolContext is a lightweight fixture and approval lifetime is the code default of 24 hours. This verifies these function paths only, not model behavior, live banking, production concurrency, or cross-process state.", "scenarios": scenarios}
    (output / "banking-harness.json").write_text(json.dumps(artifact, indent=2) + "\n", encoding="utf-8")
    for relative in ["app/tools/banking_tools.py", "app/services/policy_service.py", "app/services/transfer_service.py", "app/services/transaction_executor.py", "app/mock_data.py", "app/limits.py", "app/audit.py", "app/config.py"]:
        remember(args.harness_source, relative, "harness")
    (output / "source-hashes.json").write_text(json.dumps({"algorithm": "SHA-256 of reviewed local source bytes", "files": source_hashes}, indent=2) + "\n", encoding="utf-8")
    print("PASS: actual email formatter rendered two synthetic source-linked entries in HTML and plaintext")
    print("PASS: deterministic harness success, blocked beneficiary, same-turn confirmation, other-session isolation, and repeat-confirmation assertions")
    print("No model, SMTP, scraper, Redis, database, or banking network calls were made.")


if __name__ == "__main__":
    main()
