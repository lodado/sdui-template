/**
 * Chart interpolation utilities for Interpolation Modes: linear, cubic (natural spline), monotone cubic (Fritsch–Carlson).
 * All functions take data points (x_i, y_i) and return sampled curve points in data coordinates.
 */

export interface DataPoint {
  x: number
  y: number
}

const DEFAULT_NUM_STEPS = 32

/**
 * Linear interpolation: y(x) = y_i + (y_{i+1} - y_i) / (x_{i+1} - x_i) * (x - x_i) on [x_i, x_{i+1}].
 * Returns sampled points along the piecewise linear curve.
 */
export function linearSeries(
  data: DataPoint[],
  numStepsPerSegment: number = DEFAULT_NUM_STEPS,
): DataPoint[] {
  if (data.length < 2) return [...data]
  const out: DataPoint[] = []
  for (let i = 0; i < data.length - 1; i += 1) {
    const x0 = data[i]!.x
    const y0 = data[i]!.y
    const x1 = data[i + 1]!.x
    const y1 = data[i + 1]!.y
    const dx = x1 - x0
    const dy = y1 - y0
    const n = i === data.length - 2 ? numStepsPerSegment + 1 : numStepsPerSegment
    for (let k = 0; k < n; k += 1) {
      const t = k / numStepsPerSegment
      out.push({
        x: x0 + t * dx,
        y: y0 + t * dy,
      })
    }
  }
  out.push({ x: data[data.length - 1]!.x, y: data[data.length - 1]!.y })
  return out
}

function solveTridiagonal(
  lower: number[],
  diag: number[],
  upper: number[],
  rhs: number[],
): number[] {
  const N = diag.length
  const cp = new Array<number>(N)
  const dp = new Array<number>(N)
  cp[0] = upper[0]! / diag[0]!
  dp[0] = rhs[0]! / diag[0]!
  for (let i = 1; i < N; i += 1) {
    const denom = diag[i]! - lower[i]! * cp[i - 1]!
    cp[i] = i < N - 1 ? upper[i]! / denom : 0
    dp[i] = (rhs[i]! - lower[i]! * dp[i - 1]!) / denom
  }
  const x = new Array<number>(N)
  x[N - 1] = dp[N - 1]!
  for (let i = N - 2; i >= 0; i -= 1) {
    x[i] = dp[i]! - cp[i]! * x[i + 1]!
  }
  return x
}

/**
 * Natural cubic spline: S_i(x) = a_i + b_i(x-x_i) + c_i(x-x_i)^2 + d_i(x-x_i)^3.
 * Boundary: S''(x_0) = 0, S''(x_N) = 0. Solves for M_i = S''(x_i) then builds coefficients.
 */
export function cubicSplineSeries(
  data: DataPoint[],
  numStepsPerSegment: number = DEFAULT_NUM_STEPS,
): DataPoint[] {
  const n = data.length
  if (n < 2) return [...data]
  if (n === 2) return linearSeries(data, numStepsPerSegment)

  const x = data.map((p) => p.x)
  const y = data.map((p) => p.y)
  const h: number[] = []
  for (let i = 0; i < n - 1; i += 1) h.push(x[i + 1]! - x[i]!)

  // Tridiagonal system for M_i = S''(x_i): 2*M_0 + 0 = 0, ... , 0 + 2*M_n = 0 (natural)
  // For interior: h_{i-1}*M_{i-1} + 2(h_{i-1}+h_i)*M_i + h_i*M_{i+1} = 6*( (y_{i+1}-y_i)/h_i - (y_i-y_{i-1})/h_{i-1} )
  const diag: number[] = [2]
  const upper: number[] = [0]
  const lower: number[] = [0]
  const rhs: number[] = [0]

  for (let i = 1; i < n - 1; i += 1) {
    const d = (y[i + 1]! - y[i]!) / h[i]! - (y[i]! - y[i - 1]!) / h[i - 1]!
    lower.push(h[i - 1]!)
    diag.push(2 * (h[i - 1]! + h[i]!))
    upper.push(h[i]!)
    rhs.push(6 * d)
  }

  lower.push(0)
  diag.push(2)
  upper.push(0)
  rhs.push(0)

  // Thomas algorithm
  const M = solveTridiagonal(lower, diag, upper, rhs)

  const out: DataPoint[] = []
  for (let i = 0; i < n - 1; i += 1) {
    const x0 = x[i]!
    const x1 = x[i + 1]!
    const y0 = y[i]!
    const y1 = y[i + 1]!
    const hi = h[i]!
    const m0 = M[i]!
    const m1 = M[i + 1]!
    const a = y0
    const b = (y1 - y0) / hi - (hi / 6) * (2 * m0 + m1)
    const c = m0 / 2
    const d = (m1 - m0) / (6 * hi)

    const steps = i === n - 2 ? numStepsPerSegment + 1 : numStepsPerSegment
    for (let k = 0; k < steps; k += 1) {
      const t = k / numStepsPerSegment
      const xi = x0 + t * hi
      const s = xi - x0
      const yi = a + b * s + c * s * s + d * s * s * s
      out.push({ x: xi, y: yi })
    }
  }
  out.push({ x: x[n - 1]!, y: y[n - 1]! })
  return out
}

/**
 * Monotone cubic (Fritsch–Carlson): Hermite interpolation with tangents adjusted for monotonicity.
 * Prevents overshoot when data is monotone in a segment.
 */
export function monotoneCubicSeries(
  data: DataPoint[],
  numStepsPerSegment: number = DEFAULT_NUM_STEPS,
): DataPoint[] {
  const n = data.length
  if (n < 2) return [...data]
  if (n === 2) return linearSeries(data, numStepsPerSegment)

  const x = data.map((p) => p.x)
  const y = data.map((p) => p.y)
  const h: number[] = []
  for (let i = 0; i < n - 1; i += 1) h.push(x[i + 1]! - x[i]!)

  const delta: number[] = []
  for (let i = 0; i < n - 1; i += 1) delta.push((y[i + 1]! - y[i]!) / h[i]!)

  // Secant slopes at interior points; endpoints use single segment slope
  const m: number[] = []
  m[0] = delta[0]!
  for (let i = 1; i < n - 1; i += 1) {
    if (delta[i - 1]! * delta[i]! <= 0) m[i] = 0
    else m[i] = (h[i - 1]! + h[i]!) / (h[i - 1]! / delta[i - 1]! + h[i]! / delta[i]!)
  }
  m[n - 1] = delta[n - 2]!

  // Fritsch–Carlson: clamp alpha, beta so monotonicity is preserved (alpha_i = m_i/delta_i, beta_i = m_{i+1}/delta_i in [0,3])
  for (let i = 0; i < n - 1; i += 1) {
    const d = delta[i]!
    if (Math.abs(d) >= 1e-10) {
      const alpha = m[i]! / d
      const beta = m[i + 1]! / d
      const t = Math.sqrt(alpha * alpha + beta * beta)
      if (t > 3) {
        const s = 3 / t
        m[i] = s * m[i]!
        m[i + 1] = s * m[i + 1]!
      }
    } else {
      m[i] = 0
      m[i + 1] = 0
    }
  }

  // Hermite basis: H00(t)=2t^3-3t^2+1, H10(t)=-2t^3+3t^2, H01(t)=t^3-2t^2+t, H11(t)=t^3-t^2
  const out: DataPoint[] = []
  for (let i = 0; i < n - 1; i += 1) {
    const x0 = x[i]!
    const x1 = x[i + 1]!
    const y0 = y[i]!
    const y1 = y[i + 1]!
    const hi = h[i]!
    const m0 = m[i]!
    const m1 = m[i + 1]!

    const steps = i === n - 2 ? numStepsPerSegment + 1 : numStepsPerSegment
    for (let k = 0; k < steps; k += 1) {
      const t = k / numStepsPerSegment
      const H00 = 2 * t * t * t - 3 * t * t + 1
      const H10 = -2 * t * t * t + 3 * t * t
      const H01 = t * t * t - 2 * t * t + t
      const H11 = t * t * t - t * t
      const xi = x0 + t * hi
      const yi = y0 * H00 + y1 * H10 + hi * m0 * H01 + hi * m1 * H11
      out.push({ x: xi, y: yi })
    }
  }
  out.push({ x: x[n - 1]!, y: y[n - 1]! })
  return out
}
