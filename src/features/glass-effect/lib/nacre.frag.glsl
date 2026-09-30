precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform float uRadius;
uniform float uPixelRatio;
uniform vec2 uLight;
// 활성 메뉴 버블의 앞/뒤 덩어리 (CSS px, 좌하단 기준 x, y, width, height). width가 0이면 없음
uniform vec4 uHead;
uniform vec4 uTail;
uniform float uBubbleRadius;
uniform float uDark;

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

// a에서 b로 갈수록 반지름이 radiusA → radiusB로 바뀌는 원뿔형 캡슐 (근사 SDF)
float taperedSegmentSdf(vec2 p, vec2 a, vec2 b, float radiusA, float radiusB) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-5), 0.0, 1.0);
  return length(pa - ba * h) - mix(radiusA, radiusB, h);
}

// 두 모양의 경계를 액체처럼 녹여 붙이는 합집합
float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

float bubbleRectSdf(vec2 p, vec2 center, vec2 halfSize) {
  return roundedRectSdf(p - center, halfSize, min(uBubbleRadius, min(halfSize.x, halfSize.y)));
}

// 호리병 버블: 앞 덩어리(몸통)가 먼저 튀어나가고 작은 뒤 덩어리(머리)가 끌려오며,
// 둘 사이를 머리 쪽은 가늘고 몸통 쪽으로 갈수록 넓어지는 목이 잇는다
float bubbleSdf(vec2 p) {
  vec2 headHalf = uHead.zw * 0.5;
  vec2 headCenter = uHead.xy + headHalf;
  if (uTail.z < 1.0) return bubbleRectSdf(p, headCenter, headHalf);

  vec2 tailHalf = uTail.zw * 0.5;
  vec2 tailCenter = uTail.xy + tailHalf;
  float offset = headCenter.x - tailCenter.x;
  float direction = offset < 0.0 ? -1.0 : 1.0;
  float stretch = smoothstep(0.0, 0.5, abs(offset) / max(uHead.z, 1.0));

  // 움직이는 동안 두 덩어리는 바깥쪽 끝(앞은 진행 방향, 뒤는 출발 쪽)에 붙은 채 둥글게 오므라든다.
  // 버블 폭보다 조금만 움직여도 가운데가 비면서 목이 생긴다
  vec2 headBulb = vec2(mix(headHalf.x, headHalf.y, stretch), headHalf.y);
  vec2 tailBulb = vec2(mix(tailHalf.x, tailHalf.y, stretch), tailHalf.y) * mix(1.0, 0.55, stretch);
  headCenter.x += direction * (headHalf.x - headBulb.x);
  tailCenter.x -= direction * (tailHalf.x - tailBulb.x);

  float head = bubbleRectSdf(p, headCenter, headBulb);
  float tail = bubbleRectSdf(p, tailCenter, tailBulb);
  float neckTailRadius = mix(0.55, 0.18, stretch) * headHalf.y;
  float neckHeadRadius = mix(0.55, 0.5, stretch) * headHalf.y;
  float neck = taperedSegmentSdf(p, tailCenter, headCenter, neckTailRadius, neckHeadRadius);

  // 정지 상태에서는 smin이 버블을 부풀리지 않도록 k를 0에 가깝게 둔다
  float k = mix(0.01, 10.0, stretch);
  return smin(smin(head, tail, k), neck, k);
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

  // 활성 메뉴 버블 아래에서는 조각이 더 촘촘하고 밝게 보인다
  float hasBubble = step(1.0, uHead.z);
  float bubble = bubbleSdf(uv);
  float highlight = (1.0 - smoothstep(-4.0, 4.0, bubble)) * hasBubble;

  // 유리 속 자개 조각: 투명 유리에 드문드문 박힌 조각
  vec3 piece = voronoi(uv / 11.0);
  float pieceSeed = hash(piece.xy);
  float isShell = step(mix(0.82, 0.4, highlight), pieceSeed);
  float inset = mix(0.18, 0.1, highlight);
  float shard = smoothstep(inset, inset + 0.06, piece.z);

  // 조각마다 박힌 기울기가 달라서 빛 방향이 바뀌면 조각별로 색과 반짝임이 달라진다
  vec2 tilt = (hash2(piece.xy + 5.1) - 0.5) * 1.2;
  vec3 pieceNormal = normalize(vec3(tilt, 1.0));
  float grain = fbm(uv / 2.5 + pieceSeed * 10.0);
  float shimmer = sin(uTime * 0.6 + pieceSeed * 40.0);
  float thickness = fract(pieceSeed * 7.0) * 0.8 + grain * 0.2
    + dot(tilt, uLight) * 0.5 + view * 0.3 + shimmer * 0.08;
  float twinkle = pow(0.5 + 0.5 * sin(uTime * 1.5 + pieceSeed * 40.0), 6.0);
  float glint = pow(max(dot(pieceNormal, halfVector), 0.0), 60.0);
  vec3 color = pearlTint(thickness, 0.55)
    + (twinkle * 0.25 + glint * 0.5) * (1.0 + highlight * 0.5);
  // 버블 안쪽(활성 메뉴 글자 뒤)은 조각을 걷어내 가장자리에만 남긴다
  float textClearance = smoothstep(-3.0, -6.0, bubble) * hasBubble;
  float alpha = isShell * shard * 0.85 * (1.0 - textClearance * 0.9);
  color = mix(vec3(1.0), color, step(0.001, alpha));
  alpha = max(alpha, specular * mix(0.4, 0.25, uDark));

  // 다크모드: 어두운 유리 위에서 조각이 튀지 않도록 밝기와 불투명도를 낮춘다
  color *= mix(1.0, 0.78, uDark);
  alpha *= mix(1.0, 0.85, uDark);

  alpha = clamp(alpha, 0.0, 1.0);
  vec4 shardsLayer = vec4(clamp(color, 0.0, 1.0) * alpha, alpha);

  // 버블: 채움 + 안쪽 가장자리 그림자 + 윤곽선 + 윗면 광택
  // 캔버스는 흰 틴트(glass-overlay) 아래에 깔리므로 DOM 버블(bg-wash)보다 진하게 그린다
  float bubbleFill = (1.0 - smoothstep(-0.75, 0.75, bubble)) * hasBubble;
  float edgeFalloff = 1.0 - clamp(-bubble / 8.0, 0.0, 1.0);
  vec3 washColor = mix(vec3(0.906, 0.898, 0.894), vec3(0.961, 0.961, 0.957), uDark);
  vec3 edgeColor = mix(vec3(0.651, 0.627, 0.608), vec3(0.839, 0.827, 0.82), uDark);
  float washAlpha = mix(0.5, 0.28, uDark) * bubbleFill;
  float edgeAlpha = mix(0.55, 0.45, uDark) * edgeFalloff * edgeFalloff * bubbleFill;
  float outline = (1.0 - smoothstep(0.0, 1.2, abs(bubble + 0.6))) * hasBubble;
  float outlineAlpha = mix(0.45, 0.35, uDark) * outline;

  vec2 bubbleGrad = normalize(vec2(
    bubbleSdf(uv + vec2(0.5, 0.0)) - bubbleSdf(uv - vec2(0.5, 0.0)),
    bubbleSdf(uv + vec2(0.0, 0.5)) - bubbleSdf(uv - vec2(0.0, 0.5))
  ) + 1e-5);
  vec3 bubbleNormal = normalize(vec3(bubbleGrad * edgeFalloff, 1.0));
  float gloss = pow(max(dot(bubbleNormal, halfVector), 0.0), 30.0)
    * edgeFalloff * bubbleFill * mix(0.35, 0.2, uDark);

  vec4 bubbleLayer = vec4(washColor * washAlpha, washAlpha);
  bubbleLayer = vec4(edgeColor * edgeAlpha, edgeAlpha) + bubbleLayer * (1.0 - edgeAlpha);
  bubbleLayer = vec4(edgeColor * 0.8 * outlineAlpha, outlineAlpha) + bubbleLayer * (1.0 - outlineAlpha);
  bubbleLayer = vec4(vec3(gloss), gloss) + bubbleLayer * (1.0 - gloss);

  float mask = 1.0 - smoothstep(-1.0, 0.5, d);
  gl_FragColor = (bubbleLayer + shardsLayer * (1.0 - bubbleLayer.a)) * mask;
}
