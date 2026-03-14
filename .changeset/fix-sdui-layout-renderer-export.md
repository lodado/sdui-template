---
"@lodado/sdui-template": patch
---

Fix ESM build: split SduiLayoutRendererInner into separate file so SduiLayoutRenderer is the only export from SduiLayoutRenderer.mjs, fixing "Export SduiLayoutRenderer doesn't exist" in consumer bundlers.
