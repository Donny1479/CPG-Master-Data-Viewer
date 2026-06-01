from __future__ import annotations

import os
import unittest
from pathlib import Path

from backend.source_pulls import iter_compiled_pull_rows, summarize_source_pulls
from backend.workbook import iter_master_rows, master_headers, summarize_workbook


DEFAULT_WORKBOOK = Path(r"C:\Users\rbide014\Downloads\July_Coffee Category and Customer Scorecard .xlsx")


class WorkbookParserTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        workbook = Path(os.environ.get("SCORECARD_WORKBOOK_PATH", DEFAULT_WORKBOOK))
        if not workbook.exists():
            raise unittest.SkipTest(f"Workbook not found: {workbook}")
        cls.workbook = workbook

    def test_master_headers_are_detected(self) -> None:
        headers = master_headers(self.workbook)
        self.assertEqual(headers[0], "Markets")
        self.assertIn("$ SPPDP % Chg YA", headers)
        self.assertEqual(len(headers), 44)

    def test_master_rows_are_normalized(self) -> None:
        first = next(iter_master_rows(self.workbook, import_run_id="test_import"))
        self.assertEqual(first["market"], "NATIONAL EX NFLD GDM")
        self.assertEqual(first["period"], "Jul 25 - 4 w/e 26/07/25")
        self.assertEqual(first["product"], "Packaged Coffee & Instant Coffee")
        self.assertAlmostEqual(first["dollar_share_product"], 100.0)
        self.assertAlmostEqual(first["dollar_pct_chg_ya"], 22.2)
        self.assertTrue(first["$id"].startswith("r"))

    def test_summary_matches_current_workbook_shape(self) -> None:
        summary = summarize_workbook(self.workbook)
        self.assertEqual(summary["master_table"]["rows"], 38974)
        self.assertEqual(summary["master_table"]["columns"], 44)
        self.assertEqual(summary["master_table"]["distincts"]["market"]["count"], 35)
        self.assertEqual(summary["master_table"]["distincts"]["period"]["count"], 5)

    def test_four_pull_compiler_matches_master_row_count(self) -> None:
        summary = summarize_source_pulls([self.workbook])
        self.assertEqual(summary["total_rows"], 38974)
        self.assertEqual(summary["sources"]["topline_brands"]["rows"], 3446)
        self.assertEqual(summary["sources"]["single_serve"]["rows"], 16385)
        self.assertEqual(summary["sources"]["instant"]["rows"], 4549)
        self.assertEqual(summary["sources"]["rg"]["rows"], 14594)

    def test_four_pull_compiler_builds_dashboard_product_names(self) -> None:
        rows = list(iter_compiled_pull_rows([self.workbook]))
        products = {row["product"] for row in rows}
        self.assertIn("AO Brand Single Serve", products)
        self.assertIn("Maxwell House Tassimo", products)
        self.assertIn("Tim Hortons R&G", products)
        self.assertIn("McCafe K Cup", products)


if __name__ == "__main__":
    unittest.main()
