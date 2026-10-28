import io
import os
import sys
import time
from playwright.sync_api import sync_playwright
from PIL import Image

def record_gif():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    repo_dir = os.path.dirname(script_dir)
    harness_path = os.path.join(script_dir, "record-harness.html").replace("\\", "/")
    harness_url = f"file:///{harness_path}"

    docs_dir = os.path.join(repo_dir, "docs")
    os.makedirs(docs_dir, exist_ok=True)
    out_gif = os.path.join(docs_dir, "demo.gif")

    print(f"Loading harness from {harness_url}...")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Match body dimensions 640x400
        page = browser.new_page(viewport={"width": 640, "height": 400}, device_scale_factor=1)
        page.goto(harness_url, wait_until="networkidle")
        page.wait_for_timeout(1000)

        print("Starting scenario and recording frames...")
        # Start the GSAP scenario
        page.evaluate("window.runScenario();")

        frames = []
        fps = 16
        total_frames = 135
        frame_delay = 1.0 / fps

        for i in range(total_frames):
            buf = page.screenshot(type="png")
            img = Image.open(io.BytesIO(buf)).convert("RGBA")
            frames.append(img)
            time.sleep(frame_delay * 0.75)
            if (i + 1) % 25 == 0:
                print(f"Captured {i + 1}/{total_frames} frames...")

        browser.close()

    print(f"Captured {len(frames)} frames. Processing and optimizing GIF...")
    
    # Quantize frames to an optimized 256-color palette
    quantized_frames = []
    for f in frames:
        # Convert RGBA to RGB with matte background if needed, or quantize
        rgb_img = Image.new("RGB", f.size, (30, 27, 46))
        rgb_img.paste(f, mask=f.split()[3])
        # Adaptive palette quantization
        p_img = rgb_img.convert("P", palette=Image.Palette.ADAPTIVE, colors=128)
        quantized_frames.append(p_img)

    frame_duration_ms = int(1000 / fps)
    print(f"Saving GIF to {out_gif} with duration {frame_duration_ms}ms per frame...")
    quantized_frames[0].save(
        out_gif,
        save_all=True,
        append_images=quantized_frames[1:],
        duration=frame_duration_ms,
        loop=0,
        optimize=True
    )

    file_size_kb = os.path.getsize(out_gif) / 1024
    print(f"GIF saved successfully: {file_size_kb:.1f} KB ({file_size_kb/1024:.2f} MB)")

    # Also copy to website/ and build/
    website_gif = os.path.join(repo_dir, "website", "demo.gif")
    build_gif = os.path.join(repo_dir, "build", "demo.gif")
    os.makedirs(os.path.dirname(website_gif), exist_ok=True)
    os.makedirs(os.path.dirname(build_gif), exist_ok=True)
    with open(out_gif, "rb") as src, open(website_gif, "wb") as dst:
        dst.write(src.read())
    with open(out_gif, "rb") as src, open(build_gif, "wb") as dst:
        dst.write(src.read())
    print("Copied demo.gif to website/ and build/")

if __name__ == "__main__":
    record_gif()
