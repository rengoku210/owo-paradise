"use client";

import { useMemo, useRef, useEffect, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles, Stars } from "@react-three/drei";
import * as THREE from "three";
import { useUiStore } from "@/store/uiStore";
import { useScrollStore } from "@/store/scrollStore";
import { isScrollBurstActive } from "@/lib/scrollBurst";

type MouseRef = React.MutableRefObject<{ x: number; y: number }>;
type ScrollRef = React.MutableRefObject<number>;

/** Subtle pointer parallax + scroll-based Y drift for foreground (faster than background CSS layer). */
function ParallaxRig({
  mouse,
  scrollRef,
  children,
}: {
  mouse: MouseRef;
  scrollRef: ScrollRef;
  children: ReactNode;
}) {
  const group = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!group.current) return;
    const tx = mouse.current.x * 0.2;
    const ty = mouse.current.y * 0.15;
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      tx * 0.028,
      0.05
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      -ty * 0.022,
      0.05
    );
    const burst = isScrollBurstActive() ? 1.52 : 1;
    const sy = scrollRef.current * 0.00045 * burst;
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, sy, 0.08);
  });
  return <group ref={group}>{children}</group>;
}

/** Starfield drifts slower than foreground meshes (≈ background 0.3× feel). */
function StarfieldParallax({
  scrollRef,
  dense,
}: {
  scrollRef: ScrollRef;
  dense: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!group.current) return;
    group.current.position.y = scrollRef.current * 0.00012;
  });
  return (
    <group ref={group}>
      <Stars
        radius={90}
        depth={36}
        count={dense ? 420 : 1000}
        factor={2.6}
        fade
        speed={0.12}
      />
    </group>
  );
}

function CameraScrollRig({ scrollRef }: { scrollRef: ScrollRef }) {
  const { camera } = useThree();
  const baseZ = 6.8;
  useFrame(() => {
    const s = scrollRef.current;
    const burst = isScrollBurstActive() ? 1.38 : 1;
    const targetZ = baseZ + s * 0.00115 * burst;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.042);
    const cap = 0.02;
    const targetRy = THREE.MathUtils.clamp(s * 0.000017, -cap, cap);
    const targetRx = THREE.MathUtils.clamp(s * -0.000013, -cap, cap);
    camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, targetRy, 0.04);
    camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, targetRx, 0.04);
  });
  return null;
}

function SoftAccents({ dense }: { dense: boolean }) {
  const mats = useMemo(
    () => ({
      purple: new THREE.MeshStandardMaterial({
        color: "#d4af37",
        emissive: "#9c7a2d",
        emissiveIntensity: 0.35,
        roughness: 0.45,
        metalness: 0.25,
      }),
      cyan: new THREE.MeshStandardMaterial({
        color: "#f5e6ba",
        emissive: "#d4af37",
        emissiveIntensity: 0.38,
        roughness: 0.38,
        metalness: 0.3,
      }),
    }),
    []
  );

  useEffect(() => {
    return () => {
      Object.values(mats).forEach((m) => m.dispose());
    };
  }, [mats]);

  if (dense) return null;

  return (
    <group>
      <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.42}>
        <mesh position={[1.35, 0.15, -0.55]} material={mats.purple}>
          <icosahedronGeometry args={[0.38, 0]} />
        </mesh>
      </Float>
      <Float speed={0.95} rotationIntensity={0.1} floatIntensity={0.38}>
        <mesh position={[-1.45, -0.25, 0.1]} material={mats.cyan}>
          <octahedronGeometry args={[0.32, 0]} />
        </mesh>
      </Float>
    </group>
  );
}

function SceneContent({
  mouse,
  dense,
  scrollRef,
}: {
  mouse: MouseRef;
  dense: boolean;
  scrollRef: ScrollRef;
}) {
  const { gl, scene } = useThree();

  useEffect(() => {
    scene.fog = new THREE.FogExp2("#080a0f", dense ? 0.055 : 0.042);
    gl.setClearColor("#080a0f", 1);
  }, [gl, scene, dense]);

  return (
    <>
      <CameraScrollRig scrollRef={scrollRef} />
      <ambientLight intensity={0.32} />
      <directionalLight position={[4, 6, 2]} intensity={0.95} color="#f5e6ba" />
      <pointLight position={[-3, 1.5, 1.5]} intensity={0.85} color="#d4af37" />
      <pointLight position={[2.5, -0.8, 1]} intensity={0.7} color="#f5e6ba" />
      <StarfieldParallax scrollRef={scrollRef} dense={dense} />
      <ParallaxRig mouse={mouse} scrollRef={scrollRef}>
        <SoftAccents dense={dense} />
        <Sparkles
          count={dense ? 18 : 48}
          scale={7}
          size={1.6}
          speed={0.18}
          opacity={0.42}
          color="#f5e6ba"
        />
      </ParallaxRig>
    </>
  );
}

export function HeroScene() {
  const mouse = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);
  const isMobileCanvas = useUiStore((s) => s.isMobileCanvas);

  useEffect(() => {
    scrollRef.current = useScrollStore.getState().scrollY;
    const unsub = useScrollStore.subscribe((state) => {
      scrollRef.current = state.scrollY;
    });
    return unsub;
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <Canvas
      className="h-full w-full"
      dpr={isMobileCanvas ? [1, 1] : [1, 1.5]}
      gl={{
        powerPreference: "high-performance",
        antialias: false,
        alpha: false,
        stencil: false,
        depth: true,
      }}
      camera={{ position: [0, 0, 6.8], fov: 40, near: 0.1, far: 72 }}
    >
      <SceneContent mouse={mouse} dense={isMobileCanvas} scrollRef={scrollRef} />
    </Canvas>
  );
}
