import { useMemo, useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { createGlowTexture, createPanelTexture, createShadowTexture, createSheenTexture } from "./textures";

/* Exact brand palette + tints, reused across every mesh */
export const C = {
  forest: "#0F352A",
  forest600: "#1A5745",
  forest500: "#216A52",
  forest400: "#2F7F63",
  grass: "#85D050",
  grass300: "#A9E37C",
  grass600: "#63AD31",
  solar: "#FFC00A",
  solar300: "#FFD44F",
  canvas: "#EAEFEF",
  white: "#FFFFFF",
} as const;

type V3 = [number, number, number];

/* ───────────────────────── Island ───────────────────────── */

export function Island() {
  return (
    <group>
      {/* Grass cap */}
      <mesh position={[0, -0.25, 0]} receiveShadow>
        <cylinderGeometry args={[3.6, 3.6, 0.5, 72]} />
        <meshStandardMaterial color={C.grass} roughness={0.95} />
      </mesh>
      {/* Sun-gold rim */}
      <mesh position={[0, -0.012, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.6, 0.034, 12, 110]} />
        <meshBasicMaterial color={C.solar} toneMapped={false} />
      </mesh>
      {/* Soil band */}
      <mesh position={[0, -0.7, 0]} receiveShadow>
        <cylinderGeometry args={[3.6, 3.36, 0.4, 72]} />
        <meshStandardMaterial color={C.forest500} roughness={0.9} />
      </mesh>
      {/* Faceted underside */}
      <mesh position={[0, -1.85, 0]} castShadow>
        <cylinderGeometry args={[3.36, 0.35, 1.9, 9]} />
        <meshStandardMaterial color={C.forest600} emissive={C.forest400} emissiveIntensity={0.14} roughness={0.85} flatShading />
      </mesh>
    </group>
  );
}

export function GroundShadow() {
  const tex = useMemo(() => createShadowTexture(), []);
  return (
    <mesh position={[0, -3.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[7.5, 7.5]} />
      <meshBasicMaterial map={tex} transparent opacity={0.55} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

/* ───────────────────────── House ───────────────────────── */

const W = 3.0; // width  (x)
const D = 2.4; // depth  (z)
const H = 1.45; // wall height
const PITCH = 0.5; // roof pitch (rad)
const RIDGE = (D / 2) * Math.tan(PITCH);
const SLOPE_L = D / 2 / Math.cos(PITCH) + 0.18; // slab length incl. eave overhang
const SLAB_Y = H + RIDGE - (SLOPE_L * Math.sin(PITCH)) / 2;
const SLAB_Z = (SLOPE_L * Math.cos(PITCH)) / 2;

const PANEL_SLOTS: [number, number][] = [];
for (const z of [-0.35, 0.35]) for (const x of [-1.23, -0.41, 0.41, 1.23]) PANEL_SLOTS.push([x, z]);

type RoofProps = {
  side: 1 | -1;
  panelMat: THREE.Material;
  sheenMat: THREE.Material;
};

function RoofSide({ side, panelMat, sheenMat }: RoofProps) {
  return (
    <group position={[0, SLAB_Y, side * SLAB_Z]} rotation={[side * PITCH, 0, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[W + 0.3, 0.1, SLOPE_L]} />
        <meshStandardMaterial color={C.forest600} roughness={0.7} />
      </mesh>

      {PANEL_SLOTS.map(([x, z], i) => (
        <group key={i} position={[x, 0.075, z]}>
          {/* frame */}
          <mesh castShadow>
            <boxGeometry args={[0.76, 0.05, 0.64]} />
            <meshStandardMaterial color={C.canvas} roughness={0.45} metalness={0.25} />
          </mesh>
          {/* PV glass */}
          <mesh position={[0, 0.0265, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.69, 0.57]} />
            <primitive object={panelMat} attach="material" />
          </mesh>
        </group>
      ))}

      {/* travelling sheen across the whole array */}
      <mesh position={[0, 0.106, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.3, 1.42]} />
        <primitive object={sheenMat} attach="material" />
      </mesh>
    </group>
  );
}

function Window({ position, rotation = [0, 0, 0], glass }: { position: V3; rotation?: V3; glass: THREE.Material }) {
  const w = 0.62;
  const h = 0.56;
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow>
        <boxGeometry args={[w + 0.12, h + 0.12, 0.05]} />
        <meshStandardMaterial color={C.forest} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <boxGeometry args={[w, h, 0.03]} />
        <primitive object={glass} attach="material" />
      </mesh>
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[0.028, h, 0.01]} />
        <meshStandardMaterial color={C.forest} />
      </mesh>
      <mesh position={[0, -h / 2 - 0.08, 0.04]}>
        <boxGeometry args={[w + 0.22, 0.04, 0.12]} />
        <meshStandardMaterial color={C.canvas} roughness={0.7} />
      </mesh>
    </group>
  );
}

export function House({ position, scrollRef }: { position: V3; scrollRef: MutableRefObject<number> }) {
  const panelMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        map: createPanelTexture(),
        metalness: 0.35,
        roughness: 0.16,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        envMapIntensity: 1.5,
      }),
    []
  );
  const sheenTex = useMemo(() => createSheenTexture(), []);
  const sheenMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: sheenTex,
        color: "#FFF3C4",
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    [sheenTex]
  );
  const glass = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#CFEFFF",
        metalness: 0.1,
        roughness: 0.05,
        clearcoat: 1,
        envMapIntensity: 2.2,
      }),
    []
  );
  const gableGeo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-D / 2, 0);
    s.lineTo(D / 2, 0);
    s.lineTo(0, RIDGE);
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: W, bevelEnabled: false });
    g.translate(0, 0, -W / 2);
    return g;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    sheenTex.offset.x = -((t * 0.14) % 1);
    sheenMat.opacity = 0.32 + scrollRef.current * 0.4 + Math.sin(t * 1.3) * 0.05;
  });

  return (
    <group position={position}>
      {/* plinth */}
      <mesh position={[0, 0.07, 0]} castShadow receiveShadow>
        <boxGeometry args={[W + 0.1, 0.14, D + 0.1]} />
        <meshStandardMaterial color={C.forest} roughness={0.8} />
      </mesh>
      {/* walls */}
      <RoundedBox args={[W, H - 0.14, D]} radius={0.05} smoothness={3} position={[0, 0.14 + (H - 0.14) / 2, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={C.white} roughness={0.85} />
      </RoundedBox>
      {/* gable volume */}
      <mesh geometry={gableGeo} position={[0, H, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={C.white} roughness={0.85} />
      </mesh>

      {/* roof planes with solar arrays */}
      <RoofSide side={1} panelMat={panelMat} sheenMat={sheenMat} />
      <RoofSide side={-1} panelMat={panelMat} sheenMat={sheenMat} />
      {/* ridge cap */}
      <mesh position={[0, H + RIDGE + 0.05, 0]} castShadow>
        <boxGeometry args={[W + 0.32, 0.09, 0.2]} />
        <meshStandardMaterial color={C.forest} roughness={0.6} />
      </mesh>

      {/* door (solar yellow) + step */}
      <mesh position={[0, 0.14 + 0.47, D / 2 + 0.02]} castShadow>
        <boxGeometry args={[0.52, 0.94, 0.04]} />
        <meshStandardMaterial color={C.solar} roughness={0.5} />
      </mesh>
      <mesh position={[0.17, 0.62, D / 2 + 0.06]}>
        <sphereGeometry args={[0.03, 12, 12]} />
        <meshStandardMaterial color={C.forest} />
      </mesh>
      <mesh position={[0, 0.04, D / 2 + 0.22]} castShadow receiveShadow>
        <boxGeometry args={[0.85, 0.08, 0.36]} />
        <meshStandardMaterial color={C.canvas} roughness={0.8} />
      </mesh>

      {/* windows */}
      <Window position={[-0.95, 0.92, D / 2]} glass={glass} />
      <Window position={[0.95, 0.92, D / 2]} glass={glass} />
      <Window position={[-W / 2, 0.92, 0.1]} rotation={[0, -Math.PI / 2, 0]} glass={glass} />
      <Window position={[W / 2, 0.92, 0.1]} rotation={[0, Math.PI / 2, 0]} glass={glass} />
    </group>
  );
}

/* ───────────────────────── Battery wall ───────────────────────── */

export function Battery({ position }: { position: V3 }) {
  const segs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(({ clock }) => {
    // "charging" animation: 0 → 4 segments, loop
    const step = Math.floor(clock.elapsedTime * 1.6) % 5;
    segs.current.forEach((m, i) => {
      if (m) m.visible = i < step;
    });
  });

  return (
    <group position={position} rotation={[0, -0.25, 0]}>
      <RoundedBox args={[0.66, 1.05, 0.4]} radius={0.05} smoothness={3} position={[0, 0.525, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={C.white} roughness={0.45} metalness={0.1} />
      </RoundedBox>
      <mesh position={[0, 1.07, 0]} castShadow>
        <boxGeometry args={[0.7, 0.06, 0.44]} />
        <meshStandardMaterial color={C.forest} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.84, 0.205]}>
        <circleGeometry args={[0.1, 24]} />
        <meshBasicMaterial color={C.solar} toneMapped={false} />
      </mesh>
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          ref={(el) => {
            segs.current[i] = el;
          }}
          position={[0, 0.2 + i * 0.13, 0.205]}
        >
          <boxGeometry args={[0.38, 0.08, 0.01]} />
          <meshBasicMaterial color={C.grass} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/* ───────────────────────── Nature ───────────────────────── */

export function Pine({ position, scale = 1 }: { position: V3; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.09, 0.4, 8]} />
        <meshStandardMaterial color={C.forest} roughness={0.9} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, 0.55 + i * 0.38, 0]} castShadow>
          <coneGeometry args={[0.52 - i * 0.13, 0.7, 9]} />
          <meshStandardMaterial color={i % 2 ? C.forest400 : C.forest500} roughness={0.85} flatShading />
        </mesh>
      ))}
    </group>
  );
}

export function RoundTree({ position, scale = 1 }: { position: V3; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.1, 0.6, 8]} />
        <meshStandardMaterial color={C.forest} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.95, 0]} castShadow>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshStandardMaterial color={C.grass600} roughness={0.85} flatShading />
      </mesh>
      <mesh position={[0.22, 1.32, 0.08]} castShadow>
        <icosahedronGeometry args={[0.34, 1]} />
        <meshStandardMaterial color={C.grass300} roughness={0.85} flatShading />
      </mesh>
    </group>
  );
}

export function Bush({ position, scale = 1 }: { position: V3; scale?: number }) {
  return (
    <mesh position={position} scale={[scale, scale * 0.72, scale]} castShadow>
      <icosahedronGeometry args={[0.3, 1]} />
      <meshStandardMaterial color={C.grass600} roughness={0.9} flatShading />
    </mesh>
  );
}

const FLOWERS: [number, number][] = [
  [-1.2, 1.7],
  [0.5, 1.95],
  [1.9, 1.5],
  [2.4, 0.95],
  [-2.3, 1.3],
  [-1.7, 2.25],
  [1.2, 2.55],
  [0.2, 2.9],
  [-1.6, -2.3],
  [1.0, -2.4],
  [2.2, -1.65],
];

export function Flowers() {
  return (
    <group>
      {FLOWERS.map(([x, z], i) => (
        <group key={i} position={[x, 0.06, z]}>
          <mesh>
            <sphereGeometry args={[0.058, 10, 10]} />
            <meshStandardMaterial color={i % 3 === 0 ? C.white : C.solar} emissive={i % 3 === 0 ? C.white : C.solar} emissiveIntensity={0.35} />
          </mesh>
          <mesh position={[0, 0.0, 0]} scale={0.45}>
            <sphereGeometry args={[0.058, 8, 8]} />
            <meshBasicMaterial color={C.solar} toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

const STONES: [number, number][] = [
  [-0.55, 1.62],
  [-0.43, 2.02],
  [-0.62, 2.42],
  [-0.46, 2.82],
  [-0.58, 3.2],
];

export function PathStones() {
  return (
    <group>
      {STONES.map(([x, z], i) => (
        <mesh key={i} position={[x, 0.02, z]} rotation={[0, i * 0.7, 0]} receiveShadow>
          <cylinderGeometry args={[0.19, 0.19, 0.04, 8]} />
          <meshStandardMaterial color={C.canvas} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

export function Turbine({ position, scale = 1 }: { position: V3; scale?: number }) {
  const rotor = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (rotor.current) rotor.current.rotation.z -= delta * 1.4;
  });
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <cylinderGeometry args={[0.16, 0.18, 0.08, 16]} />
        <meshStandardMaterial color={C.canvas} />
      </mesh>
      <mesh position={[0, 1.08, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.07, 2.1, 12]} />
        <meshStandardMaterial color={C.white} roughness={0.5} />
      </mesh>
      <mesh position={[0, 2.15, 0.04]} castShadow>
        <boxGeometry args={[0.13, 0.13, 0.32]} />
        <meshStandardMaterial color={C.canvas} roughness={0.5} />
      </mesh>
      <group ref={rotor} position={[0, 2.15, 0.23]}>
        <mesh>
          <sphereGeometry args={[0.075, 16, 16]} />
          <meshStandardMaterial color={C.solar} roughness={0.4} />
        </mesh>
        {[0, 1, 2].map((i) => (
          <group key={i} rotation={[0, 0, (i * Math.PI * 2) / 3]}>
            <mesh position={[0, 0.47, 0]} castShadow>
              <boxGeometry args={[0.075, 0.86, 0.016]} />
              <meshStandardMaterial color={C.white} roughness={0.4} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

/* ───────────────────────── Sky ───────────────────────── */

const PUFFS: [number, number, number, number][] = [
  [0, 0, 0, 0.5],
  [0.55, -0.1, 0.05, 0.38],
  [-0.58, -0.12, 0, 0.4],
  [0.22, 0.3, 0, 0.42],
  [-0.18, 0.24, 0.1, 0.34],
  [1.0, -0.18, 0, 0.28],
  [-1.0, -0.19, 0, 0.27],
];

export function Cloud({ position, scale = 1, phase = 0, speed = 0.25 }: { position: V3; scale?: number; phase?: number; speed?: number }) {
  const ref = useRef<THREE.Group>(null);
  const base = useRef(position);
  useFrame(({ clock }) => {
    const g = ref.current;
    if (!g) return;
    const t = clock.elapsedTime * speed + phase;
    g.position.x = base.current[0] + Math.sin(t) * 0.45;
    g.position.y = base.current[1] + Math.sin(t * 1.7) * 0.08;
  });
  return (
    <group ref={ref} position={position} scale={[scale * 1.25, scale * 0.85, scale * 0.9]}>
      {PUFFS.map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[r, 22, 22]} />
          <meshStandardMaterial color={C.white} emissive={C.white} emissiveIntensity={0.42} roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

export function SunBody() {
  const rays = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const glowTex = useMemo(() => createGlowTexture(), []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (rays.current) rays.current.rotation.z = t * 0.22;
    if (core.current) core.current.scale.setScalar(1 + Math.sin(t * 1.6) * 0.035);
  });

  return (
    <group>
      <sprite scale={[5.4, 5.4, 1]}>
        <spriteMaterial map={glowTex} transparent depthWrite={false} toneMapped={false} />
      </sprite>
      <mesh ref={core}>
        <sphereGeometry args={[0.58, 40, 40]} />
        <meshBasicMaterial color={C.solar} toneMapped={false} />
      </mesh>
      <group ref={rays}>
        {Array.from({ length: 16 }).map((_, i) => {
          const a = (i / 16) * Math.PI * 2;
          const long = i % 2 === 0;
          const r = long ? 0.98 : 0.92;
          const len = long ? 0.44 : 0.24;
          return (
            <mesh key={i} position={[Math.cos(a) * (r + len / 2), Math.sin(a) * (r + len / 2), 0]} rotation={[0, 0, a - Math.PI / 2]}>
              <boxGeometry args={[0.085, len, 0.02]} />
              <meshBasicMaterial color={long ? C.solar : C.solar300} toneMapped={false} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}
