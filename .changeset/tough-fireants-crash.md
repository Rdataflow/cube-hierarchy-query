---
"@zazuko/cube-hierarchy-query": major
---

Updated `@hydrofoil/shape-to-query` to 0.13. This introduces optimisations which should not be a breaking change but because `sparql-http-client` was also updated to v3, the return type of `getHierarchy` changed slightly where `query` is now `string`