import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, BufferGeometry, Float32BufferAttribute, Uint16BufferAttribute, DoubleSide } from "three";

export default function BoxGeometry({ vertices, triangles, color }: { vertices: number[]; triangles: number[]; color: string }) {
  const ref = useRef<Mesh | null>(null);

  useEffect(() => {
    if (!vertices.length || !triangles.length) return;

    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

    for (let i = 0; i < vertices.length; i += 3) {
      minX = Math.min(minX, vertices[i]);
      maxX = Math.max(maxX, vertices[i]);
      minY = Math.min(minY, vertices[i + 1]);
      maxY = Math.max(maxY, vertices[i + 1]);
      minZ = Math.min(minZ, vertices[i + 2]);
      maxZ = Math.max(maxZ, vertices[i + 2]);
    }

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const centerZ = (minZ + maxZ) / 2;

    const centeredVertices = vertices.map((v, i) =>
      i % 3 === 0 ? v - centerX :
        i % 3 === 1 ? v - centerY :
          v - centerZ
    );

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(centeredVertices, 3));
    geometry.setIndex(new Uint16BufferAttribute(triangles, 1));
    geometry.computeVertexNormals();

    if (ref.current) {
      ref.current.geometry.dispose();
      ref.current.geometry = geometry;
      ref.current.rotation.z += 0.5;
    }

    return () => geometry.dispose();
  }, [vertices, triangles]);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.005;
    }
  });

  return (
    <mesh ref={ref}>
      <meshStandardMaterial color={color} side={DoubleSide} />
    </mesh>
  );
}
