'use client';

import { Component, Suspense, useMemo, useRef, type ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, Html, Lightformer, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { MEDIA, MODEL_TUNING } from '@/lib/media';
import { HOTSPOTS } from '@/lib/content';
import { scrollState } from '@/lib/scroll';

// Camera stops (azimuth, elevation, distance) for TRACK / IDENTIFY / RECORD / SECURE.
const STOPS: [number, number, number][] = [
  [-0.55, 0.12, 6.4],
  [0.95, 0.32, 5.6],
  [2.55, 0.18, 6.0],
  [4.05, 0.55, 5.2],
];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);

function stopAt(p: number) {
  const f = Math.min(Math.max(p, 0), 1) * (STOPS.length - 1);
  const i = Math.min(Math.floor(f), STOPS.length - 2);
  // Ease between stops so the camera "settles" on each one.
  const t = smooth(smooth(f - i));
  const a = STOPS[i];
  const b = STOPS[i + 1];
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)] as const;
}

function Model({ onHotspot, active }: { onHotspot: (id: string) => void; active: string | null }) {
  const { scene } = useGLTF(MEDIA.bell407Glb);
  const group = useRef<THREE.Group>(null);

  // Fit any generated mesh into a 3.2-unit box, centred on the origin.
  const { object, size } = useMemo(() => {
    const obj = scene.clone(true);
    obj.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.castShadow = true;
        const mat = m.material as THREE.MeshStandardMaterial;
        if (mat && 'envMapIntensity' in mat) mat.envMapIntensity = 1.15;
      }
    });
    const box = new THREE.Box3().setFromObject(obj);
    const s = box.getSize(new THREE.Vector3());
    const scale = (3.2 / Math.max(s.x, s.y, s.z)) * MODEL_TUNING.scale;
    const c = box.getCenter(new THREE.Vector3());
    obj.position.set(-c.x * scale, -c.y * scale + MODEL_TUNING.lift, -c.z * scale);
    obj.scale.setScalar(scale);
    return { object: obj, size: s.multiplyScalar(scale) };
  }, [scene]);

  useFrame((state) => {
    if (!group.current) return;
    // Gentle hover, like an aircraft holding in ground effect.
    const t = state.clock.elapsedTime;
    group.current.position.y = Math.sin(t * 0.9) * 0.05;
    group.current.rotation.z = Math.sin(t * 0.6) * 0.012;
  });

  const half = size.clone().multiplyScalar(0.5);

  return (
    <>
    <ContactShadows position={[0, -half.y - 0.08, 0]} opacity={0.6} scale={9} blur={2.6} far={3} />
    <group ref={group} rotation={[0, MODEL_TUNING.yawOffset, 0]}>
      <primitive object={object} />
      <RotorBlur y={half.y * 0.92} radius={Math.max(half.x, half.z) * 1.05} />
      {HOTSPOTS.map((h) => (
        <Html
          key={h.id}
          position={[h.pos[0] * half.x, h.pos[1] * half.y, h.pos[2] * half.z]}
          zIndexRange={[4, 0]}
          occlude={false}
        >
          <button
            className={`hotspot ${active === h.id ? 'on' : ''}`}
            onClick={() => onHotspot(h.id)}
            aria-label={h.title}
            data-cursor="VIEW"
          >
            +
          </button>
        </Html>
      ))}
    </group>
    </>
  );
}

/** A translucent spinning disc that reads as a turning main rotor. */
function RotorBlur({ y, radius }: { y: number; radius: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const tex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const g = c.getContext('2d')!;
    const grd = g.createConicGradient(0, 128, 128);
    for (let i = 0; i < 4; i++) {
      const o = i / 4;
      grd.addColorStop(o, 'rgba(255,255,255,0.22)');
      grd.addColorStop(o + 0.03, 'rgba(255,255,255,0.0)');
      grd.addColorStop(o + 0.22, 'rgba(255,255,255,0.0)');
    }
    g.fillStyle = grd;
    g.beginPath();
    g.arc(128, 128, 126, 0, Math.PI * 2);
    g.fill();
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);

  useFrame((_, dt) => {
    if (!ref.current) return;
    const v = Math.min(Math.abs(scrollState.velocity) / 3000, 1);
    ref.current.rotation.z -= dt * (14 + v * 18);
  });

  return (
    <mesh ref={ref} position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[radius, 64]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} opacity={0.55} />
    </mesh>
  );
}

function Rig() {
  const { camera, pointer } = useThree();
  const cur = useRef({ az: STOPS[0][0], el: STOPS[0][1], d: STOPS[0][2] });
  useFrame(() => {
    const [az, el, d] = stopAt(scrollState.aircraft);
    const c = cur.current;
    c.az = lerp(c.az, az + pointer.x * 0.12, 0.06);
    c.el = lerp(c.el, el + pointer.y * 0.05, 0.06);
    c.d = lerp(c.d, d, 0.06);
    camera.position.set(Math.sin(c.az) * c.d * Math.cos(c.el), Math.sin(c.el) * c.d + 0.3, Math.cos(c.az) * c.d * Math.cos(c.el));
    camera.lookAt(0, 0.05, 0);
  });
  return null;
}

class Boundary extends Component<{ fallback: ReactNode; children: ReactNode; onError: () => void }, { err: boolean }> {
  state = { err: false };
  static getDerivedStateFromError() {
    return { err: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.err ? this.props.fallback : this.props.children;
  }
}

export default function HelicopterScene({
  onHotspot,
  active,
  onFail,
}: {
  onHotspot: (id: string) => void;
  active: string | null;
  onFail: () => void;
}) {
  return (
    <Boundary fallback={null} onError={onFail}>
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ fov: 32, near: 0.1, far: 100, position: [0, 0.6, 6.4] }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
        }}
        data-cursor="DRAG"
      >
        <ambientLight intensity={0.25} />
        <directionalLight position={[4, 8, 5]} intensity={1.6} castShadow shadow-mapSize={[1024, 1024]} />
        <directionalLight position={[-6, 3, -4]} intensity={0.9} color="#ffd9b0" />
        <spotLight position={[0, 6, -6]} intensity={30} angle={0.6} penumbra={1} color="#9fc7ff" />
        {/* Studio environment built from light panels: no external HDR download. */}
        <Environment resolution={256} frames={1}>
          <Lightformer intensity={2.2} position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[10, 10, 1]} />
          <Lightformer intensity={1.4} position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[10, 2, 1]} />
          <Lightformer intensity={1.4} position={[5, 1, 1]} rotation-y={-Math.PI / 2} scale={[10, 2, 1]} />
          <Lightformer intensity={0.8} color="#e3262b" position={[0, -1, -6]} scale={[12, 1, 1]} />
        </Environment>
        <Suspense fallback={null}>
          <Model onHotspot={onHotspot} active={active} />
        </Suspense>
        <Rig />
      </Canvas>
    </Boundary>
  );
}
