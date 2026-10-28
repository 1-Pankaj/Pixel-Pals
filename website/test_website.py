import os
import sys
import time
from playwright.sync_api import sync_playwright

def test_website(url=None):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    if not url:
        default_index = os.path.join(script_dir, "index.html").replace("\\", "/")
        url = f"file:///{default_index}"
    print(f"Testing URL: {url}")
    errors = []
    logs = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 900})
        page = context.new_page()

        page.on("console", lambda msg: logs.append(f"[{msg.type}] {msg.text}") if msg.type != "error" else errors.append(f"CONSOLE ERROR: {msg.text}"))
        page.on("pageerror", lambda err: errors.append(f"PAGE ERROR: {err}"))

        page.goto(url, wait_until="networkidle")
        page.wait_for_timeout(1000)

        # 1. Title and basic assertions
        title = page.title()
        print(f"Page title: {title}")
        assert "Pixel Pals" in title, f"Unexpected title: {title}"

        # 2. Check all canvas elements exist
        canvases = page.locator("canvas")
        count = canvases.count()
        print(f"Found {count} canvas elements total")
        assert count >= 10, f"Expected at least 10 canvases (pets + scene backgrounds), found {count}"

        bg_canvases = page.locator("canvas.scene-bg")
        bg_count = bg_canvases.count()
        print(f"Found {bg_count} scene-bg canvases")
        assert bg_count == 4, f"Expected 4 scene-bg canvases (3 pal cards + 1 playground room), found {bg_count}"

        # 3. Check pixel rendering on canvases (verify not blank)
        for i in range(count):
            cv = canvases.nth(i)
            # Evaluate canvas has non-transparent pixels
            is_painted = page.evaluate("""(index) => {
                const cv = document.querySelectorAll('canvas')[index];
                if (!cv) return false;
                const ctx = cv.getContext('2d');
                const img = ctx.getImageData(0, 0, cv.width, cv.height);
                let nonTransparent = 0;
                for (let j = 3; j < img.data.length; j += 4) {
                    if (img.data[j] > 100) nonTransparent++;
                }
                return nonTransparent > 10;
            }""", i)
            print(f"Canvas {i} painted: {is_painted}")
            assert is_painted, f"Canvas {i} is blank!"

        # 4. Test Mouse Movement / Cursor tracking
        print("Testing mouse movement (cursor tracking)...")
        page.mouse.move(100, 200)
        page.wait_for_timeout(300)
        page.mouse.move(900, 600)
        page.wait_for_timeout(300)

        # 5. Test Playground Buttons
        print("Testing playground buttons...")
        # Click button
        page.click('button[data-a="pet"]')
        page.wait_for_timeout(600)
        bub_text = page.locator('#lp .bub').text_content()
        print(f"Playground pet said on Click: '{bub_text}'")
        assert len(bub_text) > 0, "Speech bubble is empty!"

        # Treat button
        page.click('button[data-a="treat"]')
        page.wait_for_timeout(1200)
        print("Treat animation executed")

        # Trick button (Double-click)
        page.click('button[data-a="dbl"]')
        page.wait_for_timeout(800)
        bub_text_trick = page.locator('#lp .bub').text_content()
        print(f"Playground pet said on Trick: '{bub_text_trick}'")

        # Swap button
        page.click('button[data-a="swap"]')
        page.wait_for_timeout(600)
        bub_text_swap = page.locator('#lp .bub').text_content()
        print(f"Playground pet said on Swap: '{bub_text_swap}'")

        # 6. Test scrolling down to pal scenes and capture screenshots
        print("Scrolling down to pal cards...")
        page.locator("#pals").scroll_into_view_if_needed()
        page.wait_for_timeout(1000)

        mochi_card = page.locator("#r-mochi")
        mochi_card.screenshot(path=os.path.join(script_dir, "screenshot_mochi.png"))
        print("Mochi pal card screenshot saved to screenshot_mochi.png")

        pals_section = page.locator("#pals")
        pals_section.screenshot(path=os.path.join(script_dir, "screenshot_pals.png"))
        print("Pals section screenshot saved to screenshot_pals.png")

        play_section = page.locator("#play")
        play_section.screenshot(path=os.path.join(script_dir, "screenshot_play.png"))
        print("Playground section screenshot saved to screenshot_play.png")

        # Full page scroll and screenshot
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        page.wait_for_timeout(600)
        screenshot_path = os.path.join(script_dir, "screenshot.png")
        page.screenshot(path=screenshot_path, full_page=False)
        print(f"Screenshot saved to {screenshot_path}")

        browser.close()

    print(f"Total console logs: {len(logs)}")
    if errors:
        print(f"FAIL: Encountered {len(errors)} errors:")
        for e in errors:
            print("  ", e)
        sys.exit(1)
    else:
        print("SUCCESS! All checks passed with 0 console errors!")

if __name__ == "__main__":
    target_url = sys.argv[1] if len(sys.argv) > 1 else None
    test_website(target_url)
