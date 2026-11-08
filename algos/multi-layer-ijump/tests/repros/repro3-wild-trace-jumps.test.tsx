import { MultilayerIjump } from "algos/multi-layer-ijump/MultilayerIjump"
import { expect, test } from "bun:test"
import { getDatasetGenerator } from "autorouting-dataset/lib/generators"
import { getSimpleRouteJson } from "solver-utils"

test("repro3: multilayer ijump does not produce wild trace jumps", async () => {
  const generator = getDatasetGenerator("single-trace")

  // Seed 8 previously produced 11 route points with wild back-and-forth jumps
  // inside IC1 before escaping to IC2
  const circuitJson8 = await generator.getExample({ seed: 8 })
  const input8 = getSimpleRouteJson(circuitJson8, { layerCount: 2 })
  const autorouter8 = new MultilayerIjump({
    input: input8,
    isRemovePathLoopsEnabled: false,
    isShortenPathWithShortcutsEnabled: false,
  })
  const [trace8] = autorouter8.solveAndMapToTraces()
  expect(trace8.route.length).toBeLessThanOrEqual(8)
  // Trace should never jump positively into x > 0 when routing from x = -3 to x = -10.8
  for (const pt of trace8.route) {
    expect(pt.x).toBeLessThanOrEqual(-3)
  }

  // Seed 18 previously produced 10 route points with a wild trace jump loop
  const circuitJson18 = await generator.getExample({ seed: 18 })
  const input18 = getSimpleRouteJson(circuitJson18, { layerCount: 2 })
  const autorouter18 = new MultilayerIjump({
    input: input18,
    isRemovePathLoopsEnabled: false,
    isShortenPathWithShortcutsEnabled: false,
  })
  const [trace18] = autorouter18.solveAndMapToTraces()
  expect(trace18.route.length).toBeLessThanOrEqual(5)
})
