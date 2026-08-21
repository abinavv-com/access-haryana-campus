#!/usr/bin/env python3
"""
Generate a comprehensive product PDF with screenshots and Vercel deployment link.
Usage: python scripts/generate-product-pdf.py --vercel-url https://your-vercel-url.vercel.app
"""

import sys
import os
import argparse
from pathlib import Path
from datetime import datetime
import subprocess

def generate_pdf(vercel_url=None):
    """Generate product PDF with screenshots and Vercel link"""

    project_root = Path(__file__).parent.parent
    screenshots_dir = Path(r"D:\temp\claude\screenshots")
    output_dir = project_root / "product-export"
    output_dir.mkdir(exist_ok=True)

    # Read documentation
    doc_file = project_root / "PRODUCT_DOCUMENTATION.md"
    if not doc_file.exists():
        print(f"Error: {doc_file} not found")
        sys.exit(1)

    with open(doc_file, "r", encoding="utf-8") as f:
        documentation = f.read()

    # Add Vercel URL to documentation if provided
    if vercel_url:
        vercel_section = f"""
## Live Deployment

🚀 **Live Application**: [{vercel_url}]({vercel_url})

Visit the link above to interact with the live application.

---
"""
        documentation = vercel_section + documentation

    # Collect screenshots
    screenshots = []
    if screenshots_dir.exists():
        screenshots = sorted(screenshots_dir.glob("*.png"))
        print(f"Found {len(screenshots)} screenshots")
    else:
        print(f"Warning: Screenshots directory not found at {screenshots_dir}")

    # Generate HTML version (can be converted to PDF)
    html_content = generate_html(documentation, screenshots, vercel_url)

    html_file = output_dir / "product-documentation.html"
    with open(html_file, "w", encoding="utf-8") as f:
        f.write(html_content)

    print(f"✓ HTML generated: {html_file}")

    # Try to generate PDF using wkhtmltopdf or similar
    try_generate_pdf_from_html(html_file, output_dir / "Access-Haryana-Campus-Product.pdf")

    print(f"\n✓ Product documentation ready in: {output_dir}")
    return output_dir / "Access-Haryana-Campus-Product.pdf"

def generate_html(documentation, screenshots, vercel_url):
    """Generate HTML version of product documentation"""

    screenshot_html = ""
    if screenshots:
        screenshot_html = "<section class='screenshots'>\n<h2>Application Screenshots</h2>\n"
        for i, screenshot in enumerate(screenshots, 1):
            screenshot_html += f"""
            <div class='screenshot-container'>
                <figure>
                    <img src='{screenshot}' alt='Screenshot {i}' />
                    <figcaption>Screenshot {i}: {screenshot.stem}</figcaption>
                </figure>
            </div>
"""
        screenshot_html += "</section>\n"

    vercel_banner = ""
    if vercel_url:
        vercel_banner = f"""
        <div class='vercel-banner'>
            <strong>Live Application:</strong> <a href='{vercel_url}' target='_blank'>{vercel_url}</a>
        </div>
"""

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Access Haryana Campus - Product Documentation</title>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}

        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #101820;
            background-color: #f3f1ea;
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
        }}

        .header {{
            text-align: center;
            border-bottom: 3px solid #d85a1a;
            padding-bottom: 30px;
            margin-bottom: 40px;
        }}

        .header h1 {{
            font-size: 2.5em;
            margin-bottom: 10px;
            color: #101820;
        }}

        .header .subtitle {{
            font-size: 1.2em;
            color: #666;
            margin-bottom: 15px;
        }}

        .metadata {{
            display: flex;
            gap: 30px;
            justify-content: center;
            font-size: 0.95em;
            color: #666;
            flex-wrap: wrap;
        }}

        .metadata span {{
            display: flex;
            align-items: center;
            gap: 8px;
        }}

        .vercel-banner {{
            background-color: #ffffff;
            border-left: 4px solid #d85a1a;
            padding: 20px;
            margin: 30px 0;
            border-radius: 4px;
            font-size: 1.1em;
        }}

        .vercel-banner a {{
            color: #d85a1a;
            text-decoration: none;
            font-weight: 600;
        }}

        .vercel-banner a:hover {{
            text-decoration: underline;
        }}

        h1 {{
            font-size: 2em;
            margin: 40px 0 20px 0;
            color: #101820;
            border-bottom: 2px solid #d85a1a;
            padding-bottom: 10px;
        }}

        h2 {{
            font-size: 1.5em;
            margin: 35px 0 15px 0;
            color: #101820;
        }}

        h3 {{
            font-size: 1.2em;
            margin: 25px 0 10px 0;
            color: #333;
        }}

        p {{
            margin-bottom: 15px;
            line-height: 1.7;
        }}

        ul, ol {{
            margin: 15px 0 15px 30px;
        }}

        li {{
            margin-bottom: 8px;
        }}

        code {{
            background-color: #e8e5dc;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Monaco', 'Courier New', monospace;
            font-size: 0.95em;
        }}

        pre {{
            background-color: #e8e5dc;
            padding: 15px;
            border-radius: 4px;
            overflow-x: auto;
            margin: 15px 0;
            border-left: 4px solid #d85a1a;
        }}

        pre code {{
            background: none;
            padding: 0;
        }}

        table {{
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }}

        th, td {{
            border: 1px solid #d4d0c7;
            padding: 12px;
            text-align: left;
        }}

        th {{
            background-color: #e8e5dc;
            font-weight: 600;
            color: #101820;
        }}

        tr:nth-child(even) {{
            background-color: #faf9f7;
        }}

        a {{
            color: #d85a1a;
            text-decoration: none;
        }}

        a:hover {{
            text-decoration: underline;
        }}

        .screenshots {{
            margin: 50px 0;
            page-break-inside: avoid;
        }}

        .screenshot-container {{
            margin: 40px 0;
            page-break-inside: avoid;
        }}

        .screenshot-container figure {{
            margin: 0;
            border: 1px solid #d4d0c7;
            border-radius: 4px;
            overflow: hidden;
            background: white;
        }}

        .screenshot-container img {{
            width: 100%;
            display: block;
            height: auto;
        }}

        .screenshot-container figcaption {{
            padding: 15px;
            background-color: #f9f9f9;
            font-size: 0.95em;
            color: #666;
            text-align: center;
            border-top: 1px solid #e8e5dc;
        }}

        .feature-list {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }}

        .feature-item {{
            background: white;
            padding: 20px;
            border-radius: 4px;
            border-left: 4px solid #d85a1a;
        }}

        .feature-item strong {{
            color: #d85a1a;
        }}

        .status-badge {{
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 0.85em;
            margin: 2px;
        }}

        .status-complete {{
            background-color: #e8f5e9;
            color: #176b45;
        }}

        .status-pending {{
            background-color: #fff3e0;
            color: #9a6700;
        }}

        .toc {{
            background-color: #ffffff;
            border: 1px solid #d4d0c7;
            border-radius: 4px;
            padding: 20px;
            margin: 30px 0;
        }}

        .toc h3 {{
            margin-top: 0;
        }}

        .toc ul {{
            list-style: none;
            margin: 0;
        }}

        .toc a {{
            color: #d85a1a;
        }}

        @media print {{
            body {{
                background: white;
            }}

            .page-break {{
                page-break-after: always;
            }}

            .no-print {{
                display: none;
            }}
        }}

        @media (max-width: 768px) {{
            body {{
                padding: 20px 10px;
            }}

            .header h1 {{
                font-size: 1.8em;
            }}

            .metadata {{
                gap: 15px;
            }}
        }}
    </style>
</head>
<body>
    <div class='header'>
        <h1>🏫 Access Haryana Campus</h1>
        <p class='subtitle'>Campus Accessibility Audit & Verification Platform</p>
        <div class='metadata'>
            <span>📅 {datetime.now().strftime('%B %d, %Y')}</span>
            <span>📦 Version 0.0.0</span>
            <span>⚙️ React 19 + Vite 8</span>
        </div>
    </div>

    {vercel_banner}

    <div class='toc'>
        <h3>📋 Quick Navigation</h3>
        <ul>
            <li><a href='#executive-summary'>Executive Summary</a></li>
            <li><a href='#product-overview'>Product Overview</a></li>
            <li><a href='#user-journey'>User Journey</a></li>
            <li><a href='#technical-architecture'>Technical Architecture</a></li>
            <li><a href='#screenshots'>Screenshots</a></li>
        </ul>
    </div>

    <div id='content'>
        {documentation}
    </div>

    {screenshot_html}

    <footer style='margin-top: 60px; padding-top: 20px; border-top: 2px solid #d4d0c7; text-align: center; color: #666;'>
        <p>© 2026 Access Haryana Campus | Built with React & Vite | Deployed on Vercel</p>
        <p>Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
    </footer>
</body>
</html>
"""
    return html

def try_generate_pdf_from_html(html_file, output_file):
    """Try to generate PDF from HTML using available tools"""

    try:
        import weasyprint
        print("Generating PDF using WeasyPrint...")
        weasyprint.HTML(str(html_file)).write_pdf(str(output_file))
        print(f"✓ PDF generated: {output_file}")
        return True
    except ImportError:
        print("WeasyPrint not available, trying wkhtmltopdf...")
    except Exception as e:
        print(f"WeasyPrint error: {e}")

    try:
        subprocess.run(
            ["wkhtmltopdf", str(html_file), str(output_file)],
            check=True,
            capture_output=True
        )
        print(f"✓ PDF generated: {output_file}")
        return True
    except (FileNotFoundError, subprocess.CalledProcessError):
        print("wkhtmltopdf not available")

    print(f"ℹ HTML version saved to: {html_file}")
    print("To convert to PDF, use: wkhtmltopdf, WeasyPrint, or your browser's print-to-PDF")
    return False

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate product PDF with screenshots")
    parser.add_argument("--vercel-url", help="Vercel deployment URL")

    args = parser.parse_args()
    generate_pdf(vercel_url=args.vercel_url)
