# ChatGPT image prompts for the ICTRA academic site

Only two pictures need a photoreal "image" rather than a diagram. Generate at 3:2 (1536×1024), save as PNG, drop into
`C:\Users\allen\Downloads`, and I will crop, compress and wire them in (hero + System page). Everything else on the site
is now an exact SVG schematic drawn from the code, so nothing else needs generating.

Do not let the model add brand logos, screens with numbers, or anything that looks like a measured result.

---

## 1. Hero image — `hero-hardware-reference.png` replacement

```
Photorealistic studio photo, top-down 30° angle, soft daylight, clean light-grey desk.
Subject: a small open-source biosignal acquisition kit laid out neatly:
- ONE Arduino UNO R3 board (blue PCB, USB-B port, black headers) — exactly one board, no shields stacked on it
- three small breakout modules (analog front-end boards about 3 × 2 cm, green or black PCB) connected to the UNO's A0 area
  with thin jumper wires (red, black, yellow)
- a short USB cable leading to a laptop edge at the top of frame; the laptop screen shows only three thin scrolling
  waveform traces in blue, orange and green on a white background — no text, no numbers, no logos
- four disposable gel snap electrodes (white foam, round, metal snap) and one pair of small dry electrodes
- a tiny matchbox-sized sensor unit with an accelerometer, unlabelled
Style: honest engineering bench photo, not a product render; shallow depth of field; no people; no hands; no text
anywhere in the image; no watermark; no company names.
```

## 2. Wearable concept — System page "proposed wearable"

```
Photorealistic concept photo, neutral grey background, soft studio light.
A healthy adult volunteer seen from the left side and slightly behind, neck and shoulder in frame, face turned away
and not identifiable (hair and ear visible only).
Three small matte-white sensor patches, each about 4 × 2 cm with a rounded body and a thin adhesive edge:
- one BEHIND the left ear on the mastoid, with two tiny round electrode contacts visible at its edge
- one on the upper chest just below the collarbone (two gel electrodes connected by a short 3 cm lead)
- one on the left upper arm over the deltoid muscle
No wires between the patches. No screen, no phone, no app UI, no logos, no text. The patches are plain — no LEDs, no
branding. Research-prototype feel, not a consumer product ad.
```

---

### Why these two only

| Image | Status |
|---|---|
| Training workflow, model comparison, patient split / three tiers, acquisition sites | **Done — SVG schematics** drawn from `ictra_lib.py`, `04_train_ablation.py`, `splits.json`, `EVALUATION_PROTOCOL.md` |
| Hero hardware photo, wearable concept | **Generate with the prompts above** |
| 8 Wikimedia photos (EEG cap, nerve-stimulation EMG, in-ear EEG, breadboard, Holter, Arduino, electrode) | Kept for now per Allen; replace with the team's own photos when available |
