export const nacreVertexShader = /* glsl */ `
  void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const nacreFragmentShader = /* glsl */ `
  precision highp float;

  uniform vec2 uResolution;
  uniform float uTime;
  uniform float uRadius;
  uniform float uPixelRatio;
  uniform vec2 uLight;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  vec2 hash2(vec2 p) {
    return vec2(hash(p), hash(p + 17.31));
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p = p * 2.03 + vec2(1.7, 9.2);
      amplitude *= 0.5;
    }
    return value;
  }

  // 보로노이: xy = 셀 id, z = 셀 경계까지의 거리
  vec3 voronoi(vec2 p) {
    vec2 cell = floor(p);
    vec2 local = fract(p);
    vec2 nearestOffset;
    vec2 nearestDelta;
    float nearest = 8.0;
    for (int j = -1; j <= 1; j++) {
      for (int i = -1; i <= 1; i++) {
        vec2 offset = vec2(float(i), float(j));
        vec2 delta = offset + hash2(cell + offset) - local;
        float dist = dot(delta, delta);
        if (dist < nearest) {
          nearest = dist;
          nearestDelta = delta;
          nearestOffset = offset;
        }
      }
    }
    float edge = 8.0;
    for (int j = -2; j <= 2; j++) {
      for (int i = -2; i <= 2; i++) {
        vec2 offset = nearestOffset + vec2(float(i), float(j));
        vec2 delta = offset + hash2(cell + offset) - local;
        if (dot(nearestDelta - delta, nearestDelta - delta) > 1e-5) {
          edge = min(edge, dot(0.5 * (nearestDelta + delta), normalize(delta - nearestDelta)));
        }
      }
    }
    return vec3(cell + nearestOffset, edge);
  }

  // 박막 간섭색: 두께(위상)에 따라 순환하는 무지갯빛
  vec3 iridescence(float thickness) {
    return 0.5 + 0.5 * cos(6.28318 * (thickness + vec3(0.0, 0.33, 0.67)));
  }

  // 자개 색: 은백색 바탕 위에 분홍 → 보라 → 청 → 청록 → 연두 범위만 사용
  vec3 pearlTint(float t, float saturation) {
    float phase = 0.05 + 0.65 * clamp(t, 0.0, 1.0);
    vec3 silver = vec3(0.84, 0.87, 0.9);
    return mix(silver, iridescence(phase), saturation);
  }

  float roundedRectSdf(vec2 p, vec2 halfSize, float radius) {
    vec2 q = abs(p) - halfSize + radius;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - radius;
  }

  float shapeSdf(vec2 p) {
    vec2 halfSize = uResolution * 0.5;
    float radius = min(uRadius, min(halfSize.x, halfSize.y));
    return roundedRectSdf(p - halfSize, halfSize, radius);
  }

  void main() {
    vec2 p = gl_FragCoord.xy;
    float d = shapeSdf(p);

    // 가장자리 베벨: SDF 기울기로 가짜 노멀 생성
    float bevel = 10.0 * uPixelRatio;
    vec2 grad = normalize(vec2(
      shapeSdf(p + vec2(1.0, 0.0)) - shapeSdf(p - vec2(1.0, 0.0)),
      shapeSdf(p + vec2(0.0, 1.0)) - shapeSdf(p - vec2(0.0, 1.0))
    ) + 1e-5);
    float rim = 1.0 - clamp(-d / bevel, 0.0, 1.0);
    vec3 normal = normalize(vec3(grad * rim * 1.4, 1.0));
    float view = dot(normal.xy, uLight);

    vec3 lightDir = normalize(vec3(uLight, 0.9));
    vec3 halfVector = normalize(lightDir + vec3(0.0, 0.0, 1.0));
    float specular = pow(max(dot(normal, halfVector), 0.0), 40.0) * rim;

    // CSS 픽셀 기준 좌표 (DPR과 무관하게 같은 크기의 무늬)
    vec2 uv = p / uPixelRatio;

    // 유리 속 자개 조각: 투명 유리에 드문드문 박힌 조각
    vec3 piece = voronoi(uv / 11.0);
    float pieceSeed = hash(piece.xy);
    float isShell = step(0.82, pieceSeed);
    float shard = smoothstep(0.18, 0.24, piece.z);
    float grain = fbm(uv / 2.5 + pieceSeed * 10.0);
    float shimmer = sin(uTime * 0.6 + pieceSeed * 40.0);
    float thickness = fract(pieceSeed * 7.0) * 0.8 + grain * 0.2 + view * 0.3 + shimmer * 0.08;
    float sparkle = pow(0.5 + 0.5 * sin(uTime * 1.5 + pieceSeed * 40.0), 6.0);
    vec3 color = pearlTint(thickness, 0.55) + sparkle * 0.25;
    float alpha = isShell * shard * 0.85;
    color = mix(vec3(1.0), color, step(0.001, alpha));
    alpha = max(alpha, specular * 0.4);

    float mask = 1.0 - smoothstep(-1.0, 0.5, d);
    alpha = clamp(alpha * mask, 0.0, 1.0);
    gl_FragColor = vec4(clamp(color, 0.0, 1.0) * alpha, alpha);
  }
`;
