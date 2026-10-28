# ICTRA site — image plan and ChatGPT prompts (18 Oct 2026)

## Rules that apply to every image

1. **Every AI image is labelled "concept render" in its caption and in the credits section.** The site's main
   argument to the judges is honesty; one unlabelled render that looks like our real prototype would cost more than
   any picture gains. Never present a render as the assembled ICTRA device or as a photo of a study participant.
2. **No text, numbers, logos, brand names, UI screens with values, or waveforms that look like real data** in any
   image. Those are either fabricated results or someone's trademark. Signals belong in our SVGs and live panel.
3. **No people who can be identified, no one depicted having a seizure, no hospital drama.** Faces turned away or out
   of frame; adults only; neutral situations.
4. Generate at the aspect ratio given, PNG, largest size ChatGPT offers. Save to `C:\Users\allen\Downloads` with
   the filename given; I resize, compress, wire them in and write the captions and credits.
5. Realism comes from the **camera + light + material + imperfection** lines in each prompt. Keep them. If a result
   looks too clean, reply: "slight dust, a fingerprint on the enclosure, one cable not perfectly straight, less
   saturated".

## Reference files to upload to ChatGPT first (so the images match the site)

Start ONE ChatGPT conversation for all eight images, upload these two files in the first message, and say:
"These are reference images from our project website. Match the sensor positions and the patch shape in every image
I ask for. Do not copy any text from them."

| Upload | Local path | Why |
|---|---|---|
| Sensor-position schematic | `ictra-academic-site\assets\web\biosignal-acquisition-sites.svg` — if ChatGPT refuses SVG, open https://ictra.vercel.app/assets/web/biosignal-acquisition-sites.svg in a browser, screenshot it, upload the PNG | Fixes where the three patches go (behind left ear, upper chest, left deltoid) and that the accelerometer is inside the arm patch |
| Hardware reference illustration | `ictra-academic-site\assets\hero-hardware-reference.png` | Fixes the bench look: one Arduino UNO, small breakout boards, snap electrodes |

Do **not** upload the Lab screenshots, result charts or news screenshots — they contain numbers and the model will
try to reproduce them.

## Step 0 — make ChatGPT look at real photographs first (this is what removes the "AI look")

The first two renders were competent but read as AI: too-even skin, every surface spotless, symmetrical layout,
studio backdrop, no lens character. The fix is to have ChatGPT **browse real product and clinical photographs
before it generates**, extract their visual traits, and then write each prompt itself around those traits. Paste
this as the FIRST message of the conversation (with the two reference files attached):

```
You are helping a student research team illustrate a website about a wearable seizure detector. Before generating
any image, use web browsing to study REAL photographs and write down what you see. Look up and open at least two
photos of each:

1. iRhythm Zio XT patch on a patient's chest (adhesive wearable realism: how the edge lifts, how skin looks around it)
2. Dexcom G7 or FreeStyle Libre sensor on an upper arm (small white sensor on skin, real lighting)
3. Byteflies Sensor Dot behind-the-ear EEG (the actual device used in the SeizeIT2 dataset we train on)
4. Epitel Epilog or UNEEG 24/7 behind-the-ear EEG wearables
5. An epilepsy monitoring unit (EMU) room with video-EEG — hospital website photos, not stock art
6. A paper seizure diary page (Epilepsy Foundation / Epilepsy Society printable diaries)
7. Editorial health photography from Reuters, AP or Nature News (how real documentary medical photos are lit and framed)

From those, write a short "realism sheet" (10–15 bullet points): typical materials and finishes, how adhesive edges
and skin actually look, lens and lighting character of documentary photos (slight vignetting, uneven light, real
shadows, colour casts, grain, imperfect framing), what is on a real EMU bedside, what a real diary page looks like.
Show me the sheet before generating anything.

Then, for every image I ask for, rewrite my prompt to include the relevant traits from the sheet, and generate it
with these anti-"AI look" constraints: asymmetric composition, uneven real-world lighting (window + room light, not
a softbox), visible skin texture and small blemishes, dust and fingerprints on objects, slightly imperfect framing,
mild lens vignetting, no studio backdrop (real rooms), muted colour, film-like grain. Mimic the look of a
documentary photograph taken by a photojournalist, not a product advert or a 3D render.

Standing rules: photorealistic; no text or numbers anywhere; no logos or brand names (study the real devices for
shape and finish only — do not reproduce their branding); no screens showing content; no identifiable faces; adults
only; no one having a seizure. Our sensor patches are matte white, about 4 × 2 cm, rounded, thin translucent
adhesive edge, two small round silver electrode contacts, no LEDs. The two attached files show where the three
patches go and what our bench looks like; match them, copy no text from them.

After each image, list three things in it that still look artificial, and offer a corrected version.
```

If ChatGPT says it cannot browse, generate with the same message minus step 1 — the anti-AI-look constraints alone
already help — and send me the result; I will judge whether to regenerate.

---

## Where the site is text-heavy, and what fixes it

| Page | Words | Images now | Verdict | Add |
|---|---|---|---|---|
| Overview (index) | 800 | 1 (Lab screenshot) | Hero is text + a live signal panel. Strong, but the first screen has no photograph — the site reads as a document. | **P1 hero** (wearable on a volunteer) |
| Problem (background) | 1,230 | 7 news screenshots + stat cards | Good density, but the opening section "The moment that matters is unwatched" is a wall of text. | **P2 night bedroom** |
| AI & Method (science) | 1,370 | 3 SVG schematics + 2 Wikimedia | SVGs are right. The two Wikimedia photos (EEG cap, nerve-stimulation EMG) show *other people's* equipment and the EMG one is a different procedure — weakest images on the site. | **P3 three sensors macro** replaces both |
| Engineering (system) | 2,090 | 6 SVG + 3 screenshots + 3 Wikimedia | Densest page. Wikimedia Arduino/breadboard photos are generic. The pipeline needs one "this is physical" anchor. | **P4 bench kit**, **P5 exploded wearable**, **P6 electrode detail** |
| Evidence | 5,330 | 18 (charts, tables, SVGs) | Intentionally data-dense. **No AI images here** — this page is where judges check honesty. The tables and exhibits *are* the content. | none |
| Ethics (safety) | 850 | 0 | Only page with nothing visual. One image that says "removable, no surgery, nothing leaves the device". | **P7 patch peel-off** |
| Team | 1,160 | 0 | Needs **real photographs of the four students and you** — AI cannot and must not do this. Shooting notes at the end. | real photos |

Sixteen AI images in total (P1–P8, P9–P13, clinical context P14–P16). After these, the remaining Wikimedia photos (in-ear EEG, Holter,
electrode close-up) can be retired or kept as "what exists today" references with their credits.

---

## P1 — Hero: the wearable, worn (index.html hero, 16:9 → I crop to 21:9)

**File:** `p1-hero-wearable-worn.png`

```
Photorealistic editorial photograph, 16:9. A healthy adult volunteer seen from behind and slightly to the left,
head turned away so the face is not visible, hair tucked behind the left ear, bare shoulder and upper back in frame
against a soft warm-grey studio backdrop. Three small matte-white medical sensor patches, each about 4 × 2 cm,
rounded, with a thin translucent adhesive edge: one behind the left ear on the mastoid bone showing two tiny round
silver electrode contacts at its edge; one on the upper chest just below the collarbone, barely visible over the
shoulder; one on the left upper arm over the deltoid. No wires between patches. The patches are plain — no LEDs,
no screens, no logos, no text.
Camera: full-frame mirrorless, 85 mm lens at f/2.0, eye-level, shallow depth of field so the ear patch is tack sharp
and the arm patch softens slightly. Light: one large softbox from the upper left, gentle fill from the right, soft
shadow under the ear patch. Skin shows natural pores and fine hair; the patch adhesive edge catches a faint
highlight. Colour: neutral, slightly warm, no heavy grading. Documentary medical-device photography, not an
advertisement. No text anywhere in the image.
```

## P2 — The unwatched moment (background.html, opening section, 3:2)

**File:** `p2-night-bedroom.png`

```
Photorealistic photograph, 3:2. A quiet bedroom at night, no people. An unmade bed with rumpled white and grey
bedding, one pillow slightly off the bed. On the nightstand a phone lying face down, a glass of water, a small
reading lamp switched off. The only light is faint blue-grey from a window with half-closed blinds, plus a thin
warm strip under the door. Long-exposure feel: slight grain, deep but readable shadows.
Camera: 35 mm at f/2.8, tripod, ISO 3200, eye-level from the doorway. Mood: still, ordinary, slightly uneasy —
the room where things happen with no one watching. No text, no lit screens, no people, no medical equipment.
```

## P3 — Three signals, three sensors (science.html, replaces the EEG-cap and nerve-stimulation photos, 3:2)

**File:** `p3-three-sensors-macro.png`

```
Photorealistic macro product photograph, 3:2. Three sensor patches laid flat on a matte dark-slate laboratory
surface, evenly spaced in a row, seen from 60° above. Left: a small behind-the-ear EEG patch, matte white, gently
curved to follow the mastoid, turned over to show two round silver-chloride electrode discs on its underside.
Centre: a chest ECG patch, slightly larger, with two gel electrode pads joined by a short flat 3 cm lead. Right:
an arm EMG patch with a built-in accelerometer, a slightly thicker rounded body, no openings. All three matte
white with a thin translucent adhesive border; no LEDs, no logos, no text.
Camera: 100 mm macro at f/5.6, focus-stacked so all three are sharp. Light: large overhead softbox with a black
card on the right for a soft gradient on the slate; small specular highlights on the electrode discs. Fine dust
specks on the slate and a faint fingerprint on one patch for realism. Colour neutral. No text.
```

## P4 — The acquisition bench (system.html, replaces the Wikimedia Arduino and breadboard photos, 3:2)

**File:** `p4-bench-kit.png`

```
Photorealistic bench photograph, 3:2, top-down at a 30° tilt. A clean light-grey desk with an open-source biosignal
acquisition setup: exactly ONE Arduino UNO R3 (blue PCB, silver USB-B port, black header rows) with three small
analogue front-end breakout boards (about 3 × 2 cm, dark green or black PCB) connected to its analogue pins by
thin red, black and yellow jumper wires; four disposable white foam snap electrodes with silver snaps, and one
pair of small dry electrodes, laid neatly to one side; a short black USB cable leaving the frame toward the top
edge; a laptop corner just visible at the top showing only a blank light-grey screen (no content). A small
matchbox-sized sensor unit, unlabelled.
Camera: 50 mm at f/4, natural daylight from a window on the left plus a soft fill. Honest engineering-bench look:
slight scuffs on the desk, a tiny bit of flux residue on one board, one jumper wire with a kink. No text, no
labels, no logos (the board silkscreen may exist but must be illegible), no numbers, no waveforms on the screen.
```

## P5 — Exploded view of one patch (system.html, "proposed wearable", 1:1)

**File:** `p5-patch-exploded.png`

```
Photorealistic product-render style image, 1:1, of a small wearable sensor patch shown as an exploded view
floating on a soft off-white background. Layers from top to bottom, separated by small gaps: a matte-white
rounded shell about 4 × 2 cm; a thin green PCB with a few tiny components (a microcontroller, a coin-sized
analogue front-end, a small accelerometer package) — no readable markings; a thin flat lithium pouch cell; a
flexible printed electrode layer; a skin-coloured medical adhesive ring with two round silver electrode contacts.
Material realism: slightly satin plastic, fine solder points, matte copper traces barely visible.
Camera: 3/4 view, 90 mm equivalent, deep focus. Light: studio three-point, soft shadows beneath each layer. Clean
but not glossy; a research prototype, not a consumer ad. No text, no logos, no screen, no LEDs lit.
```

## P6 — Electrode on skin, detail (system.html hardware section, 3:2)

**File:** `p6-electrode-detail.png`

```
Photorealistic macro photograph, 3:2. Close-up of the skin behind an adult's left ear, hair held back, showing a
small matte-white sensor patch adhered to the mastoid with two round silver electrode contacts visible at its
lower edge where it meets the skin. A thin translucent adhesive border lifts a fraction of a millimetre at one
corner. Skin texture, fine hairs and natural tone are clearly visible; the patch sits flat and comfortable.
Camera: 100 mm macro at f/4, focus on the electrode edge, soft falloff into the hair. Light: window daylight from
the right, soft. Neutral colour. The person is not identifiable — ear, hair and neck only. No text, no logos.
```

## P7 — Removable, nothing leaves the device (safety.html, 3:2)

**File:** `p7-patch-peel.png`

```
Photorealistic photograph, 3:2. An adult's hand, seen from the side, gently peeling a small matte-white sensor patch
off the upper arm; the patch is lifted halfway, its adhesive underside and two round electrode contacts visible,
skin beneath clean and unmarked. Sleeve pushed up, plain grey T-shirt, neutral background out of focus.
Camera: 70 mm at f/2.8, eye-level, shallow depth of field on the patch edge. Light: soft daylight from the left.
Calm, matter-of-fact mood: no pain, no redness, no medical setting. No text, no logos, no screens, no wires.
```

## P8 — The bedside hub concept (system.html data-flow section, 3:2)

**File:** `p8-bedside-hub.png`

```
Photorealistic photograph, 3:2. A nightstand in soft morning light: a small matte-white puck-shaped hub about the
size of a coaster with a single unlit indicator dot, no screen, a short USB-C cable to a wall adapter; next to it
a phone lying face down and a paperback book. Wooden nightstand with slight wear, linen curtain blurred behind.
Camera: 50 mm at f/2.5, eye-level with the nightstand, shallow depth of field. Light: window daylight, warm,
soft shadows. Quiet domestic realism. No text, no logos, no lit screens.
```


---

## Second batch — P9–P13 (same standing rules, same reference images)

Placement after the first eight: one image per remaining text-only block.

## P9 — The wait (background.html, "Four gaps, one cause", 3:2)

**File:** `p9-empty-waiting-room.png`

```
Photorealistic photograph, 3:2. An empty hospital outpatient waiting area in late afternoon: a row of eight
pale-blue vinyl chairs against a beige wall, one chair slightly turned, a water dispenser, a wall clock with no
readable numbers (face blurred by distance), fluorescent ceiling light mixed with low sun through a window at the
end of the corridor. No people, no posters with text, no signage.
Camera: 35 mm at f/4, eye-level from the corridor, slight one-point perspective. Light: cool fluorescent with a
warm window highlight on the floor. Mood: ordinary, patient, a little tired. Scuffed floor, a worn chair edge.
No text anywhere.
```

## P10 — Patch, hub, phone (system.html, data-flow section, 3:2)

**File:** `p10-flatlay-patch-hub-phone.png`

```
Photorealistic flat-lay photograph, 3:2, straight down. On a light oak table: one matte-white sensor patch (4 × 2
cm, two round silver contacts visible on the upturned underside), a small matte-white puck-shaped hub the size of a
coaster with one unlit indicator dot, and a smartphone lying face down (plain dark back, no logo). Arranged left to
right with even spacing, a short USB-C cable coiled loosely beside the hub.
Camera: 50 mm at f/5.6, tripod, everything sharp. Light: soft window daylight from the top of frame, gentle
shadows to the lower right. Wood grain, a faint scratch on the table, a small dust speck on the phone. No text,
no logos, no screens showing anything.
```

## P11 — Human in the loop (safety.html, "Development goals and clinical pathway", 3:2)

**File:** `p11-clinician-desk-review.png`

```
Photorealistic photograph, 3:2. A neurologist's desk seen from the side at a 45° angle: a printed stack of A4
pages with blurred rows of grey waveform-like lines (illegible, no numbers), a pen resting on top, reading
glasses, a cold cup of coffee, a closed laptop. Only the clinician's forearm and hand holding the pen are in frame,
sleeve of a plain light-blue shirt; no face.
Camera: 50 mm at f/2.8, eye-level with the desk, focus on the pen tip and the top page. Light: desk lamp from the
left, warm, late evening. Paper texture, a slight curl on the page corner. No readable text, no logos, no screen.
```

## P12 — Asleep, monitored (background.html end, "What ICTRA would change", 3:2)

**File:** `p12-asleep-ear-patch.png`

```
Photorealistic photograph, 3:2. An adult asleep on their right side in a dim bedroom, face turned down into the
pillow and not visible; hair fallen forward; the area behind the exposed left ear shows one small matte-white
sensor patch with two tiny round silver contacts at its edge. White duvet pulled to the shoulder. Faint cool
window light from behind, a thin warm glow from a hallway.
Camera: 50 mm at f/1.8, eye-level with the pillow, very shallow depth of field on the patch and ear; everything
else soft. ISO 1600 grain. Mood: calm, safe, ordinary night. No text, no devices lit, no cables, no face.
```

## P13 — Hands at work (team.html header or system.html build section, 3:2)

**File:** `p13-hands-soldering.png`

```
Photorealistic photograph, 3:2. Two pairs of hands at a workbench, no faces: one pair holding tweezers over a
small green PCB clipped in a helping-hands stand, the other pair holding a soldering iron with a thin wisp of
smoke, a coil of solder nearby. An Arduino UNO (blue PCB, silkscreen illegible) and a few jumper wires to the side,
a notebook with a pencil (pages blank or illegibly scribbled). Student hands, short nails, a cloth wristband.
Camera: 50 mm at f/2.8, from across the bench at hand height, focus on the tweezers tip. Light: desk lamp from the
upper left plus daylight fill. Scuffed bench, a few stray solder blobs, a slightly bent wire. No text, no logos.
```


---

## Third batch — clinical context, P14–P16 (added after Allen's note: "more patient, more medical")

Where "medical" helps the argument: the hospital alternative we are compared against (video-EEG, days in a bed,
wired), the clinical act of putting a sensor on, and the paper diary that misses half the seizures. Where it hurts:
anyone convulsing, ambulances, children, hospital drama — those read as exploitation, and a judge will ask whether
the picture is real. Same standing rules: adults only, no faces, no text, no seizure in progress.

## P14 — The hospital alternative (background.html "Four gaps" or evidence.html landscape intro, 3:2)

**File:** `p14-emu-room-wired.png`

```
Photorealistic photograph, 3:2. An epilepsy monitoring unit room, empty of people: a hospital bed with white
sheets, a wall-mounted camera on an arm above the headboard, a wired scalp-EEG head-box on a bedside pole with a
thick bundle of 20–25 coloured electrode leads coiled and clipped to it, a dark monitor on a cart showing only a
black screen, a visitor chair, a window with blinds half closed. Clean, quiet, slightly clinical light.
Camera: 28 mm at f/4 from the doorway, eye-level, straight horizon. Light: cool overhead fluorescent mixed with
daylight from the window. Realistic details: a scuff on the bed rail, a cable tie, a hand-sanitizer dispenser
without readable label. No people, no text, no logos, no readable screens.
```

## P15 — Putting the sensor on (science.html signal section or system.html, 3:2)

**File:** `p15-nurse-applying-ear-patch.png`

```
Photorealistic photograph, 3:2. Close-up of a nurse's gloved hands (light-blue nitrile) pressing a small
matte-white sensor patch into place behind an adult patient's left ear, hair held aside with the other hand; two
tiny round silver contacts visible at the patch edge. The patient's face is turned away and out of frame; ear,
hair and neck only. Background: a soft-focus clinic room, pale wall, no equipment visible.
Camera: 85 mm at f/2.2, eye-level, focus on the patch edge and fingertips. Light: soft window daylight from the
left, slight warm fill. Skin texture and the glove's matte surface clearly rendered. Calm, routine. No text, no
logos, no wires.
```

## P16 — The paper seizure diary (background.html "The moment that matters is unwatched", 3:2)

**File:** `p16-paper-seizure-diary.png`

```
Photorealistic photograph, 3:2, 45° from above. A kitchen table with a small spiral-bound notebook open to a page
of handwritten entries in blue ink — the handwriting is blurred and illegible, no readable words or numbers — with
a few dates ticked and two large gaps where nothing was written. A pen laid across the page, a mug, morning light.
Camera: 50 mm at f/2.8, focus on the pen and the nearest lines, the rest soft. Light: window daylight from the
right. Paper grain, a coffee ring on the table, a dog-eared page corner. Mood: everyday, a little worried.
No readable text anywhere, no logos.
```

## Which "medical" images we deliberately do not make

- A person mid-seizure, on the floor, with bystanders, or in an ambulance.
- A child wearing the device or in a hospital bed.
- A doctor "reading ICTRA results" on a screen — it would show invented numbers.
- A close-up of a face with electrodes — identifiable, and reads as a patient photo rather than a concept.

---

## Why not more than this

- Evidence stays image-free except our own charts. A judge who sees a photoreal "prototype" next to a results table
  will ask which one is real.
- Every prompt depicts **the concept** (patches, bench, bedroom) — things that exist in the world — not a specific
  measured claim. That is what makes them safe to label "concept render".
- The hero (P1) is the only picture most visitors will remember. If you generate one thing, generate P1, then P3.

## Team page — real photographs (not AI)

Shoot all five in one session so they match: same wall, same light, same distance.
- Plain light wall, daylight from a window on one side, no flash. Subject 1.5 m from the wall, camera 2.5 m away,
  phone portrait mode off, 3:4 crop, eyes at the upper third.
- Each student holds or stands beside the thing they own: Helena with the electrode/Arduino board, Carina with an
  ECG patch, Tiffany with the EMG/ACC unit, Constance with a printed results table. One group photo at the bench.
- Also take 6–8 working photos (hands on the board, screen in the background, no faces needed): these replace the
  remaining Wikimedia photos better than any render.
- Export the largest JPEG, save in Downloads as `team-<firstname>.jpg`, `team-group.jpg`, `work-01.jpg`…

## Status

- P1, P3 generated 18 Oct and placed (index hero; science.html replacing the EEG-cap and nerve-stimulation photos). Credits in evidence.html#concept-render-credits.
- Next: P2, P4, P5, P6, P7, P8, then P9–P13, then clinical P14–P16.

## After you generate

Tell me which files are in Downloads. I will: resize to ≤ 1600 px, compress, place each at the slot above, write the
caption with the words "concept render (AI-generated, 18 Oct 2026)", add the credits entry, retire the Wikimedia
photos that are replaced and fix their credits, commit — then you push.
