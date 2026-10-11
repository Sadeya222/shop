import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { Battery, Bush, C, Cloud, Flowers, GroundShadow, House, Island, PathStones, Pine, RoundTree, SunBody, Turbine } from "./parts";

type ScrollProps = { scrollRef: MutableRefObject<number> };

/* ───────────────────── Energy streams ───────────────────── */

const SUN_STREAM = 14;
const BAT_STREAM = 9;

/**
 * Two animated particle flows:
 *  1. golden photons travelling from the sun onto the roof array
 *  2. green electrons running from the roof into the battery wall
 */
function EnergyFlow({ sunPos }: { sunPos: THREE.Vector3 }) {
  const sunMesh = useRef<THREE.InstancedMesh>(null);
  const batMesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const roofTarget = useMemo(() => new THREE.Vector3(-0.55, 2.0, 0.5), []);
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.7, 1.98, 0.6),
        new THREE.Vector3(1.2, 2.7, 0.8),
        new THREE.Vector3(1.65, 2.2, 0.55),
        new THREE.Vector3(1.55, 1.2, 0.35),
      ]),
    []
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;

    if (sunMesh.current) {
      for (let i = 0; i < SUN_STREAM; i++) {
        const k = (t * 0.2 + i / SUN_STREAM) % 1;
        tmp.lerpVectors(sunPos, roofTarget, k);
        tmp.x += Math.sin(k * 11 + i * 1.7) * 0.06;
        tmp.y += Math.cos(k * 9 + i) * 0.06;
        dummy.position.copy(tmp);
        dummy.scale.setScalar(Math.max(0.001, Math.sin(Math.PI * k)));
        dummy.updateMatrix();
        sunMesh.current.setMatrixAt(i, dummy.matrix);
      }
      sunMesh.current.instanceMatrix.needsUpdate = true;
    }

    if (batMesh.current) {
      for (let i = 0; i < BAT_STREAM; i++) {
        const k = (t * 0.32 + i / BAT_STREAM) % 1;
        curve.getPoint(k, tmp);
        dummy.position.copy(tmp);
        dummy.scale.setScalar(Math.max(0.001, Math.sin(Math.PI * k) * 0.9 + 0.1));
        dummy.updateMatrix();
        batMesh.current.setMatrixAt(i, dummy.matrix);
      }
      batMesh.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      <instancedMesh ref={sunMesh} args={[undefined!, undefined!, SUN_STREAM]} frustumCulled={false}>
        <sphereGeometry args={[0.07, 14, 14]} />
        <meshBasicMaterial color={C.solar300} toneMapped={false} />
      </instancedMesh>
      <instancedMesh ref={batMesh} args={[undefined!, undefined!, BAT_STREAM]} frustumCulled={false}>
        <sphereGeometry args={[0.055, 14, 14]} />
        <meshBasicMaterial color={C.grass} toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

/* ───────────────────── World ───────────────────── */

function World({ scrollRef, readyRef }: ScrollProps & { readyRef: MutableRefObject<boolean> }) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);

  const group = useRef<THREE.Group>(null);
  const sunGroup = useRef<THREE.Group>(null);
  const light = useRef<THREE.DirectionalLight>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const intro = useRef(0);
  const sunPos = useMemo(() => new THREE.Vector3(-2.9, 4.1, -2.2), []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const p = scrollRef.current;
    const { x: px, y: py } = pointer.current;

    /* intro plays once the preloader lifts */
    if (readyRef.current) intro.current = Math.min(1, intro.current + delta * 0.5);
    const e = 1 - Math.pow(1 - intro.current, 3);

    /* responsive camera — always frames the whole island, any aspect ratio */
    const aspect = size.width / Math.max(1, size.height);
    const frustumH = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const dist = Math.max(11.5, 9.4 / (frustumH * aspect));
    camera.position.x = THREE.MathUtils.damp(camera.position.x, px * 0.7, 2, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, 0.8 + dist * 0.25 + py * 0.45, 2, delta);
    camera.position.z = dist * 0.97;
    camera.lookAt(0, 0.8, 0);

    /* island: pointer parallax + scroll-driven turn + float */
    const yaw = -0.3 + px * 0.32 + p * 0.85 - (1 - e) * 1.3;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, yaw, 2.6, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -py * 0.07, 2.6, delta);
    g.position.y = -0.1 + Math.sin(t * 0.6) * 0.12 + p * 1.1 - (1 - e) * 1.6;
    g.scale.setScalar((0.55 + 0.45 * e) * (1 - p * 0.08));

    /* the sun tracks across the sky as you scroll; the key light follows it */
    const a = THREE.MathUtils.lerp(2.3, 0.85, p);
    sunPos.set(Math.cos(a) * 4.3, 2.2 + Math.sin(a) * 2.6, -2.2);
    sunGroup.current?.position.copy(sunPos);
    light.current?.position.set(sunPos.x * 1.15, sunPos.y + 1.6, 3.6);
  });

  return (
    <>
      <hemisphereLight args={["#FFFFFF", "#A9E37C", 0.9]} />
      <ambientLight intensity={0.3} color="#FFF8E6" />

      {/* Local sky reflections for the glossy PV glass — no network fetch */}
      <Environment resolution={256} frames={1} environmentIntensity={0.85}>
        <Lightformer form="rect" intensity={2.4} color="#FFFFFF" position={[0, 7, 2]} rotation={[Math.PI / 2, 0, 0]} scale={[14, 14, 1]} />
        <Lightformer form="rect" intensity={2.2} color="#FFE7A8" position={[-7, 3, 4]} rotation={[0, Math.PI / 2, 0]} scale={[8, 6, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#BDE6FF" position={[7, 2, 3]} rotation={[0, -Math.PI / 2, 0]} scale={[8, 6, 1]} />
        <Lightformer form="rect" intensity={1.0} color="#FFFFFF" position={[0, 2, 8]} rotation={[0, Math.PI, 0]} scale={[10, 5, 1]} />
        <Lightformer form="ring" intensity={0.6} color="#85D050" position={[0, -6, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={8} />
      </Environment>

      <group ref={group} position={[0, -0.1, 0]}>
        <directionalLight
          ref={light}
          castShadow
          intensity={2.6}
          color="#FFF0C8"
          position={[-3.3, 5.7, 3.6]}
          shadow-mapSize={[1024, 1024]}
          shadow-camera-left={-5.5}
          shadow-camera-right={5.5}
          shadow-camera-top={6}
          shadow-camera-bottom={-4}
          shadow-camera-near={0.5}
          shadow-camera-far={24}
          shadow-bias={-0.0004}
          shadow-normalBias={0.03}
        />

        <Island />
        <House position={[-0.55, 0, -0.2]} scrollRef={scrollRef} />
        <Battery position={[1.55, 0, 0.35]} />
        <Turbine position={[2.9, 0, -0.9]} scale={0.95} />

        <Pine position={[-2.5, 0, -1.8]} scale={1.1} />
        <Pine position={[-2.9, 0, -0.45]} scale={0.8} />
        <RoundTree position={[2.0, 0, -2.2]} scale={0.95} />
        <Bush position={[-1.75, 0.12, 1.4]} scale={1} />
        <Bush position={[0.55, 0.1, 1.45]} scale={0.8} />
        <Bush position={[-2.1, 0.1, 0.9]} scale={0.7} />
        <Flowers />
        <PathStones />

        <EnergyFlow sunPos={sunPos} />

        <group ref={sunGroup} position={[-2.9, 4.1, -2.2]}>
          <SunBody />
        </group>

        <Cloud position={[-3.0, 2.6, -1.0]} scale={0.8} phase={0} />
        <Cloud position={[3.1, 1.7, 0.6]} scale={0.95} phase={2.1} speed={0.2} />
        <Cloud position={[1.0, 4.6, -3.0]} scale={0.65} phase={4.2} speed={0.3} />

        <Sparkles count={46} scale={[9, 6, 7]} position={[0, 1.8, 0]} size={3} speed={0.3} color={C.solar} opacity={0.8} />
        <GroundShadow />
      </group>
    </>
  );
}

/* ───────────────────── Canvas ───────────────────── */

type Props = ScrollProps & { ready?: boolean };

export default function SolarScene({ scrollRef, ready = true }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const readyRef = useRef(ready);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    readyRef.current = ready;
  }, [ready]);

  /* Stop rendering while the hero is off-screen — keeps pinned sections jank-free */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "120px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="h-full w-full">
      <Canvas
        shadows="percentage"
        dpr={[1, 1.75]}
        frameloop={visible ? "always" : "never"}
        camera={{ position: [0, 3.8, 12], fov: 36, near: 0.1, far: 70 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          // Neutral tone mapping keeps the brand greens & yellows true to their hex values
          gl.toneMapping = THREE.NeutralToneMapping;
        }}
        style={{ pointerEvents: "none", background: "transparent" }}
      >
        <World scrollRef={scrollRef} readyRef={readyRef} />
      </Canvas>
    </div>
  );
}
