from __future__ import annotations

import argparse
import json

from .workbook import summarize_workbook


def main() -> None:
    parser = argparse.ArgumentParser(description="Inspect a Nielsen scorecard workbook.")
    parser.add_argument("workbook_path")
    args = parser.parse_args()

    print(json.dumps(summarize_workbook(args.workbook_path), indent=2))


if __name__ == "__main__":
    main()

