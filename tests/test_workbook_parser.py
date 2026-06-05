from __future__ import annotations

import os
import unittest
from pathlib import Path

from backend.coffee_dashboard_workbook import iter_dashboard_rows, summarize_dashboard_workbook
from backend.source_pulls import combined_import_run_id, iter_compiled_pull_rows, summarize_source_pulls
from backend.workbook import iter_master_rows, master_headers, summarize_workbook


DEFAULT_WORKBOOK = Path(r"C:\Users\rbide014\Downloads\July_Coffee Category and Customer Scorecard .xlsx")
DEFAULT_SOUP_WORKBOOK = Path(r"C:\Users\rbide014\Downloads\Soup and Chili Scorecard 2026-06-05.xlsx")
DEFAULT_COFFEE_DASHBOARD_WORKBOOK = Path(r"C:\Users\rbide014\Downloads\July_Dashboard_Coffee Category.xlsm")


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

    def test_soup_chili_compiler_reads_three_updated_raw_tabs(self) -> None:
        workbook = Path(os.environ.get("SOUP_SCORECARD_WORKBOOK_PATH", DEFAULT_SOUP_WORKBOOK))
        if not workbook.exists():
            self.skipTest(f"Soup workbook not found: {workbook}")

        summary = summarize_source_pulls([workbook], business="soup_chili")
        self.assertEqual(summary["total_rows"], 3195)
        self.assertEqual(summary["sources"]["ready_to_serve"]["rows"], 1450)
        self.assertEqual(summary["sources"]["condensed"]["rows"], 952)
        self.assertEqual(summary["sources"]["chili"]["rows"], 793)

        first = next(iter_compiled_pull_rows([workbook], business="soup_chili"))
        self.assertEqual(first["product"], "Ready to Serve Non Broth")
        self.assertEqual(first["source_pull_type"], "ready_to_serve")
        self.assertAlmostEqual(first["dollar_sales_000"], 16177.8364)
        self.assertAlmostEqual(first["units_000"], 5538.6334)
        self.assertAlmostEqual(first["pounds_000"], 3161.5769)

    def test_coffee_dashboard_compiler_reads_raw_tabs_not_master_table(self) -> None:
        workbook = Path(os.environ.get("COFFEE_DASHBOARD_WORKBOOK_PATH", DEFAULT_COFFEE_DASHBOARD_WORKBOOK))
        if not workbook.exists():
            self.skipTest(f"Coffee dashboard workbook not found: {workbook}")

        import_run_id = combined_import_run_id([workbook], "coffee_dashboard")
        summary = summarize_dashboard_workbook([workbook], import_run_id)
        self.assertEqual(summary["total_rows"], 218552)
        self.assertEqual(summary["sourceCounts"]["topline_brands"], 19938)
        self.assertEqual(summary["sourceCounts"]["single_serve"], 90957)
        self.assertEqual(summary["sourceCounts"]["instant"], 25383)
        self.assertEqual(summary["sourceCounts"]["rg"], 82274)

        sample = next(
            row
            for row in iter_dashboard_rows([workbook], import_run_id)
            if row["market"] == "NATIONAL EX NFLD GDM"
            and row["period"] == "P7 2023"
            and row["product"] == "Tim Hortons Single Serve"
        )
        self.assertAlmostEqual(sample["dollar_share_product"], 8.579)
        self.assertAlmostEqual(sample["dollar_share_chg_ya_product"], -0.2671)
        self.assertAlmostEqual(sample["avg_units_price"], 18.4396)
        self.assertAlmostEqual(sample["dollar_market_share_market"], 100.0)


if __name__ == "__main__":
    unittest.main()
